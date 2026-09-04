/**
 * NEXUS OPS CHANNEL — shared Markdown conversation channel.
 *
 * Both the Arena agent and the Nexus agent read and write the same vault.
 * The meeting-room is the human/agent conversation; inbox/outbox are the
 * machine-facing mirrors. Everything is plain Markdown so GitHub and Obsidian
 * both work on it with no proprietary state.
 *
 * Protocol:
 *   [A2N]  Arena -> Nexus
 *   [N2A]  Nexus -> Arena
 *   [USER] human
 */

import fs from "fs";
import os from "os";
import path from "path";

export type OpsSender = "arena" | "nexus" | "user";
export type OpsTarget = "arena" | "nexus" | "user";

export interface OpsMessage {
  from: OpsSender;
  to: OpsTarget;
  title: string;
  body: string;
  ts?: string;
}

const DEFAULT_ROOT = path.resolve(process.cwd(), "nexus_ops");

const senderTag = (s: OpsSender): string =>
  s === "arena" ? "A2N" : s === "nexus" ? "N2A" : "USER";

const senderName = (s: OpsSender): string =>
  s === "arena" ? "Arena Agent" : s === "nexus" ? "Nexus Agent" : "User";

const now = (): string => new Date().toISOString();

/** Resolve vault root (defaults to the tracked `nexus_ops/`). */
export const resolveOpsRoot = (root?: string): string =>
  path.resolve(root || DEFAULT_ROOT);

const file = (root: string, name: string): string =>
  path.join(root, "05_Connect", name);

export const readMeetingRoom = (root?: string): string => {
  const p = file(resolveOpsRoot(root), "meeting-room.md");
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8").trim() : "";
};

export const readInbox = (root?: string): string => {
  const p = file(resolveOpsRoot(root), "inbox.md");
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8").trim() : "";
};

export const readOutbox = (root?: string): string => {
  const p = file(resolveOpsRoot(root), "outbox.md");
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8").trim() : "";
};

const renderBlock = (msg: OpsMessage): string => {
  const ts = msg.ts || now();
  return [
    "",
    `## [${senderTag(msg.from)}] — ${msg.title}`,
    `- **من:** ${senderName(msg.from)}`,
    `- **إلى:** ${msg.to === "arena" ? "Arena Agent" : msg.to === "nexus" ? "Nexus Agent" : "User"}`,
    `- **وقت:** ${ts}`,
    `- **نص:** ${msg.body}`
  ].join("\n");
};

/** Append a message to the meeting-room (conversation ledger). */
export const postToMeetingRoom = (msg: OpsMessage, root?: string): string => {
  const dir = path.resolve(resolveOpsRoot(root), "05_Connect");
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, "meeting-room.md");
  const current = fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
  const block = renderBlock(msg);
  const next = `${current.trim()}\n${block}\n`;
  fs.writeFileSync(p, next, "utf-8");
  return block;
};

/** Write a machine-facing outbox entry (this agent -> other agent). */
export const postToOutbox = (msg: OpsMessage, root?: string): string => {
  const dir = path.resolve(resolveOpsRoot(root), "05_Connect");
  fs.mkdirSync(dir, { recursive: true });
  const p = path.join(dir, "outbox.md");
  const current = fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
  const block = renderBlock(msg);
  fs.writeFileSync(p, `${current.trim()}\n${block}\n`, "utf-8");
  return block;
};

/** Poll inbox for messages addressed to this agent (plain-text filter). */
export const readMessagesFor = (
  target: OpsTarget,
  root?: string
): OpsMessage[] => {
  const text = readInbox(root);
  const blocks = text.split(/\n## \[/).slice(1).map((b) => `## [${b.trim()}`);
  return blocks
    .map((b) => {
      const t = b.match(/## \[([A-Z2N]{2,4})\]/);
      const to = b.match(/\*\*إلى:\*\*\s*(.+)/);
      const title = b.match(/\]\s*—\s*(.+)/);
      const body = b.match(/\*\*نص:\*\*\s*(.+)/);
      if (!t || !to || !title || !body) return null;
      const from = t[1] === "A2N" ? "arena" : t[1] === "N2A" ? "nexus" : "user";
      const targetName =
        target === "arena" ? "Arena Agent" : target === "nexus" ? "Nexus Agent" : "User";
      if (!to[1].includes(targetName)) return null;
      return { from, to: target, title: title[1], body: body[1] } as OpsMessage;
    })
    .filter(Boolean) as OpsMessage[];
};

/** Open the channel for an agent: read room + inbox, write room + outbox. */
export interface NexusOpsChannel {
  root: string;
  meetingRoom: string;
  inbox: string;
  outbox: string;
  post: (msg: OpsMessage) => string;
  dispatch: (msg: OpsMessage) => string;
  read: (target: OpsTarget) => OpsMessage[];
}

export const openNexusOpsChannel = (root?: string): NexusOpsChannel => {
  const r = resolveOpsRoot(root);
  return {
    root: r,
    meetingRoom: readMeetingRoom(r),
    inbox: readInbox(r),
    outbox: readOutbox(r),
    post: (msg) => postToMeetingRoom(msg, r),
    dispatch: (msg) => postToOutbox(msg, r),
    read: (target) => readMessagesFor(target, r)
  };
};

/** Helper for deterministic verification in a throwaway directory. */
export const createScratchVault = (): string => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nexus-ops-"));
  fs.mkdirSync(path.join(dir, "05_Connect"), { recursive: true });
  return dir;
};
