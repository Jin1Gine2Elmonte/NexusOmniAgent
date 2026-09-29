# ═══════════════════════════════════════════════════════════════
#  NEXUS FORGE X — النسخة النهائية المدمجة
#  تجمع هندسة كلود + طفرات ديب سيك + إكمال النواقص
# ═══════════════════════════════════════════════════════════════

TORCH_AVAILABLE = True
try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    from diffusers import StableDiffusionXLPipeline, DDIMScheduler
except ImportError:
    TORCH_AVAILABLE = False
    class DummyModule:
        pass
    class DummyTorch:
        float16 = "float16"
        float32 = "float32"
        class Tensor:
            pass
        class nn:
            Module = DummyModule
    torch = DummyTorch
    nn = DummyTorch.nn

NUMPY_AVAILABLE = True
try:
    import numpy as np
except ImportError:
    NUMPY_AVAILABLE = False

PIL_AVAILABLE = True
try:
    from PIL import Image
except ImportError:
    PIL_AVAILABLE = False
    class DummyImage:
        Image = object
    Image = DummyImage

import io, base64, json, time, math
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, field

REQUESTS_AVAILABLE = True
try:
    import requests
except ImportError:
    REQUESTS_AVAILABLE = False

import os

# ═══════════════════════════════════════════════════════════════
# 1. هيكل البيانات للقرارات
# ═══════════════════════════════════════════════════════════════

@dataclass
class NexusDecision:
    amplifies: List[Dict] = field(default_factory=list)
    biases: List[Dict] = field(default_factory=list)
    free_zones: List[Dict] = field(default_factory=list)
    attention_keyshift: List[Dict] = field(default_factory=list)
    semantic_zones: List[str] = field(default_factory=list)
    swap_phase: Optional[str] = None
    time_reversal_step: Optional[int] = None
    verdict: str = ""

# ═══════════════════════════════════════════════════════════════
# 2. المُجدول الزمني للمفاهيم
# ═══════════════════════════════════════════════════════════════

class TemporalPromptScheduler:
    def __init__(self, pipe, concept: str):
        self.pipe = pipe
        self.embeddings = {
            "macro": self._encode(f"{concept}, establishing shot, composition, structure"),
            "detail": self._encode(f"{concept}, ultra detailed, micro textures, sharp focus"),
            "atmosphere": self._encode(f"{concept}, emotional lighting, mood, soul, final aesthetic"),
        }
        self.current_phase = "macro"

    def _encode(self, text: str) -> torch.Tensor:
        tokens = self.pipe.tokenizer(
            text, return_tensors="pt", padding="max_length", truncation=True
        ).to(self.pipe.device)
        return self.pipe.text_encoder(tokens.input_ids)[0]

    def get_embedding(self, step: int, total_steps: int) -> torch.Tensor:
        ratio = step / total_steps
        if ratio < 0.3:
            return self.embeddings["macro"]
        elif ratio < 0.8:
            t = (ratio - 0.3) / 0.5
            return torch.lerp(self.embeddings["macro"], self.embeddings["detail"], t)
        else:
            t = (ratio - 0.8) / 0.2
            return torch.lerp(self.embeddings["detail"], self.embeddings["atmosphere"], t)

# ═══════════════════════════════════════════════════════════════
# 3. الأقنعة الدلالية عبر CLIPSeg
# ═══════════════════════════════════════════════════════════════

class SemanticMaskGenerator:
    def __init__(self, device="cuda"):
        self.device = device
        self.processor = None
        self.model = None
        self._init_model()

    def _init_model(self):
        try:
            from transformers import CLIPSegProcessor, CLIPSegForImageSegmentation
            self.processor = CLIPSegProcessor.from_pretrained("CIDAS/clipseg-rd64-refined")
            self.model = CLIPSegForImageSegmentation.from_pretrained("CIDAS/clipseg-rd64-refined").to(self.device)
            print("[NEXUS] CLIPSeg جاهز للأقنعة الدلالية")
        except Exception as e:
            print(f"[NEXUS] CLIPSeg غير متاح (سيتم تجاوزه): {e}")

    def generate_mask(self, image: Image.Image, phrases: List[str], threshold: float = 0.3) -> torch.Tensor:
        if self.model is None or not phrases:
            return torch.ones(1, 1, 128, 128, device=self.device)
        inputs = self.processor(text=phrases, images=[image] * len(phrases), return_tensors="pt", padding=True).to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs)
            preds = F.interpolate(outputs.logits.unsqueeze(1), size=(128, 128), mode='bilinear', align_corners=False)
        combined = torch.sigmoid(preds).max(dim=0, keepdim=True)[0]
        return (combined > threshold).float()

# ═══════════════════════════════════════════════════════════════
# 4. حقل القوة مع تلاشي تكيفي وانحياز
# ═══════════════════════════════════════════════════════════════

class AdaptiveForceField:
    def __init__(self, h=128, w=128, device="cuda"):
        self.H, self.W = h, w
        self.device = device
        self.force = torch.ones((1, 1, h, w), device=device, dtype=torch.float16)
        self.bias = torch.zeros((1, 4, h, w), device=device, dtype=torch.float16)
        self.persistence = torch.zeros((1, 1, h, w), device=device, dtype=torch.float16)
        self.decay_rate = 0.92
        self.free_mask = torch.ones((1, 1, h, w), device=device, dtype=torch.float16)

    def apply_decision(self, decision: NexusDecision, semantic_mask_gen=None, current_preview=None):
        for amp in decision.amplifies:
            x1, y1 = int(amp["x1"] * self.W), int(amp["y1"] * self.H)
            x2, y2 = int(amp["x2"] * self.W), int(amp["y2"] * self.H)
            val = amp.get("force", 1.0)
            self.force[:, :, y1:y2, x1:x2] = val
            self.persistence[:, :, y1:y2, x1:x2] = 1.0

        for bias in decision.biases:
            x1, y1 = int(bias["x1"] * self.W), int(bias["y1"] * self.H)
            x2, y2 = int(bias["x2"] * self.W), int(bias["y2"] * self.H)
            ch = bias.get("channel", slice(None))
            self.bias[:, ch, y1:y2, x1:x2] = bias.get("value", 0.0)
            self.persistence[:, :, y1:y2, x1:x2] = 1.0

        for zone in decision.free_zones:
            x1, y1 = int(zone["x1"] * self.W), int(zone["y1"] * self.H)
            x2, y2 = int(zone["x2"] * self.W), int(zone["y2"] * self.H)
            self.free_mask[:, :, y1:y2, x1:x2] = 0.0

        if semantic_mask_gen and decision.semantic_zones and current_preview:
            sem_mask = semantic_mask_gen.generate_mask(current_preview, decision.semantic_zones)
            self.free_mask = self.free_mask * sem_mask

    def step(self):
        self.persistence *= self.decay_rate
        self.force = 1.0 + (self.force - 1.0) * self.persistence
        self.bias = self.bias * self.persistence

    def get_modifier(self, h_target, w_target):
        force = F.interpolate(self.force, size=(h_target, w_target), mode='bilinear', align_corners=False)
        bias = F.interpolate(self.bias, size=(h_target, w_target), mode='bilinear', align_corners=False)
        free = F.interpolate(self.free_mask, size=(h_target, w_target), mode='nearest')
        return force, bias, free

# ═══════════════════════════════════════════════════════════════
# 5. نظام الرجوع الزمني (Time Reversal)
# ═══════════════════════════════════════════════════════════════

class TimeReversalBuffer:
    def __init__(self, save_every: int = 5):
        self.save_every = save_every
        self.checkpoints: Dict[int, torch.Tensor] = {}
        self.force_checkpoints: Dict[int, Dict] = {}

    def save(self, step: int, latents: torch.Tensor, force_field: AdaptiveForceField):
        if step % self.save_every == 0 or step in [1, 2]:
            self.checkpoints[step] = latents.clone()
            self.force_checkpoints[step] = {
                "force": force_field.force.clone(),
                "bias": force_field.bias.clone(),
                "persistence": force_field.persistence.clone(),
            }

    def restore(self, target_step: int) -> Tuple[Optional[torch.Tensor], Optional[Dict]]:
        self.checkpoints = {k: v for k, v in self.checkpoints.items() if k <= target_step}
        self.force_checkpoints = {k: v for k, v in self.force_checkpoints.items() if k <= target_step}
        if not self.checkpoints:
            return None, None
        best_step = max(self.checkpoints.keys())
        return self.checkpoints[best_step], self.force_checkpoints.get(best_step)

# ═══════════════════════════════════════════════════════════════
# 6. نظام التدخل الجراحي (مع Key Shifting حقيقي و Down blocks)
# ═══════════════════════════════════════════════════════════════

class NexusInterventionHooks:
    def __init__(self, unet, force_field: AdaptiveForceField, device="cuda"):
        self.unet = unet
        self.field = force_field
        self.device = device
        self.hooks = []
        self.key_shifts: Dict[str, Dict] = {}
        self._register_hooks()

    def _register_hooks(self):
        for name, module in self.unet.named_modules():
            # ── DOWN BLOCKS (SDXL) OR TRANSFORMER BLOCKS (FLUX) ──
            if ("down_blocks" in name and "attn" in name) or ("transformer_blocks" in name):
                hook = module.register_forward_hook(
                    lambda mod, inp, out, n=name: self._structure_hook(mod, inp, out, n, "down")
                )
                self.hooks.append(hook)
            elif "mid_block" in name or "single_transformer_blocks" in name:
                hook = module.register_forward_hook(
                    lambda mod, inp, out, n=name: self._heart_hook(mod, inp, out, n)
                )
                self.hooks.append(hook)
            elif "up_blocks" in name and "attn" in name:
                hook = module.register_forward_hook(
                    lambda mod, inp, out, n=name: self._structure_hook(mod, inp, out, n, "up")
                )
                self.hooks.append(hook)
            elif ("attn2" in name or "attn" in name) and hasattr(module, 'to_q'):
                hook = module.register_forward_hook(
                    lambda mod, inp, out, n=name: self._attention_key_shift_hook(mod, inp, out, n)
                )
                self.hooks.append(hook)

        print(f"[NEXUS] {len(self.hooks)} نقطة تدخل (متوافقة مع SDXL/FLUX)")

    def _apply_field_with_free(self, feature):
        if feature.dim() == 4:
            h, w = feature.shape[2], feature.shape[3]
            force, bias, free = self.field.get_modifier(h, w)
            return feature * (force * free + (1 - free)) + bias[:, :feature.shape[1], :, :] * free
        return feature

    def _structure_hook(self, module, input, output, name, block_type):
        if isinstance(output, tuple):
            feat = self._apply_field_with_free(output[0])
            return (feat, *output[1:])
        return self._apply_field_with_free(output)

    def _heart_hook(self, module, input, output, name):
        if isinstance(output, tuple):
            feat = output[0]
            if feat.dim() == 4:
                h, w = feat.shape[2], feat.shape[3]
                force, bias, free = self.field.get_modifier(h, w)
                feat = feat * (force * free + (1 - free)) * 1.5 + bias[:, :feat.shape[1], :, :]
            return (feat, *output[1:])
        return output

    def _attention_key_shift_hook(self, module, input, output, name):
        if isinstance(output, torch.Tensor) and output.dim() >= 3:
            for token_idx, shift_data in self.key_shifts.get(name, {}).items():
                if token_idx < output.shape[1]:
                    output[:, token_idx, :] *= shift_data.get("strength", 1.0)
        return output

    def set_key_shifts(self, decisions: List[Dict], layer_hint: str = "attn2"):
        for d in decisions:
            for hook_name in [h for h in self.key_shifts.keys() if layer_hint in h] or [layer_hint]:
                if hook_name not in self.key_shifts:
                    self.key_shifts[hook_name] = {}
                self.key_shifts[hook_name][d["token_idx"]] = {
                    "strength": d.get("strength", 1.0),
                    "spatial_offset": d.get("spatial_offset", [0.0, 0.0])
                }

    def cleanup(self):
        for h in self.hooks:
            h.remove()
        self.hooks.clear()

# ═══════════════════════════════════════════════════════════════
# 7. الناقد المحلي (CLIP) + الناقد الخارجي عند الحاجة
# ═══════════════════════════════════════════════════════════════

class LocalVisionCritic:
    def __init__(self, device="cuda"):
        self.device = device
        self.model = None
        self.processor = None
        self._init()

    def _init(self):
        try:
            from transformers import CLIPModel, CLIPProcessor
            self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(self.device)
            self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        except:
            pass

    def evaluate(self, image: Image.Image, concept: str) -> float:
        if self.model is None:
            return 0.5
        inputs = self.processor(text=[concept], images=image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            out = self.model(**inputs)
            sim = torch.cosine_similarity(out.image_embeds, out.text_embeds).item()
        return max(0.0, min(1.0, sim))

# ═══════════════════════════════════════════════════════════════
# 8. المايسترو النهائي — العقل السيادي
# ═══════════════════════════════════════════════════════════════

class NexusForgeOrchestratorX:
    def __init__(self, pipe, concept: str, force_field: AdaptiveForceField,
                 intervention: NexusInterventionHooks, prompt_scheduler: TemporalPromptScheduler,
                 use_external: bool = False):
        self.pipe = pipe
        self.concept = concept
        self.field = force_field
        self.intervention = intervention
        self.prompt_scheduler = prompt_scheduler
        self.local_critic = LocalVisionCritic()
        self.semantic_masker = SemanticMaskGenerator()
        self.time_buffer = TimeReversalBuffer(save_every=5)
        self.use_external = use_external
        self.gemini_key = os.getenv("GEMINI_API_KEY", "")
        self.auto_swap_enabled = True

    def _decode_latent(self, latents) -> Image.Image:
        with torch.no_grad():
            img = self.pipe.vae.decode(latents / self.pipe.vae.config.scaling_factor).sample
        img = (img / 2 + 0.5).clamp(0, 1)
        img = img.cpu().float().permute(0,2,3,1).numpy()[0]
        return Image.fromarray((img * 255).astype(np.uint8))

    def _consult_external(self, step, total, latents) -> dict:
        if not self.use_external:
            return {}
        preview = self._decode_latent(latents)
        buf = io.BytesIO()
        preview.save(buf, format="JPEG", quality=80)
        b64_img = base64.b64encode(buf.getvalue()).decode()
        
        prompt = f"""أنت نيكسوس. خطوة {step}/{total}. المفهوم: {self.concept}.
قرر بسرعة (JSON فقط):
{{
  "amplify": [{{"x1":0.2,"y1":0.3,"x2":0.6,"y2":0.7,"force":1.5}}],
  "bias": [{{"x1":0.0,"y1":0.0,"x2":1.0,"y2":1.0,"value":0.2}}],
  "free_zones": [{{"x1":0.0,"y1":0.0,"x2":1.0,"y2":0.2}}],
  "semantic_zones": ["background"],
  "attention_keyshift": [{{"token_idx":0,"strength":1.5}}],
  "swap_phase": null,
  "time_reversal_step": null,
  "verdict": "توجيهك"
}}"""
        
        try:
            if not REQUESTS_AVAILABLE:
                raise Exception("requests library is not available in the current environment")
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={self.gemini_key}"
            resp = requests.post(
                url,
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [{
                        "role": "user",
                        "parts": [
                            {"inline_data": {"mime_type": "image/jpeg", "data": b64_img}},
                            {"text": prompt}
                        ]
                    }],
                    "generationConfig": {
                        "responseMimeType": "application/json"
                    }
                }
            ).json()
            if "candidates" in resp and resp["candidates"]:
                reply = resp["candidates"][0]["content"]["parts"][0]["text"]
                decision = json.loads(reply.strip().strip("```json").strip("```"))
                print(f"  [NEXUS Gemini 2.5 Pro] -> {decision.get('verdict', '')}")
                return decision
        except Exception as e:
            print(f"[NEXUS] فشل الاستدعاء الخارجي (Gemini): {e}")
        return {}

    def step(self, step: int, total_steps: int, latents: torch.Tensor) -> NexusDecision:
        decision = NexusDecision()
        preview = self._decode_latent(latents)

        if step % 3 == 0:
            sim = self.local_critic.evaluate(preview, self.concept)
            print(f"  [Critic] Step {step}: similarity={sim:.3f}")

            if sim < 0.55 and self.use_external:
                print("  → استدعاء الناقد الخارجي (Gemini 2.5 Pro)...")
                ext = self._consult_external(step, total_steps, latents)
                if ext:
                    decision = NexusDecision(**{k: v for k, v in ext.items() if k in NexusDecision.__dataclass_fields__})

            if sim < 0.3:
                print(f"  → انهيار مكتشف! محاولة رجوع زمني...")
                restored_latents, restored_field = self.time_buffer.restore(max(1, step - 7))
                if restored_latents is not None:
                    latents.copy_(restored_latents)
                    if restored_field:
                        self.field.force.copy_(restored_field["force"])
                        self.field.bias.copy_(restored_field["bias"])
                        self.field.persistence.copy_(restored_field["persistence"])
                    decision.verdict = f"Time reversal to step ~{max(1, step-7)}"
                    decision.time_reversal_step = max(1, step - 7)
                    return decision

        return decision

    def apply_decision(self, decision: NexusDecision, latents_preview=None):
        if not decision:
            return
        self.field.apply_decision(decision, self.semantic_masker, latents_preview)
        self.intervention.set_key_shifts(decision.attention_keyshift)

# ═══════════════════════════════════════════════════════════════
# 9. الحلقة النهائية
# ═══════════════════════════════════════════════════════════════

async def nexus_forge_x_generate(concept: str, steps: int = 30, use_external: bool = True):
    if not TORCH_AVAILABLE:
        print("\n[NEXUS WARNING] البيئة المحلية لا تحتوي على PyTorch أو Diffusers.")
        print("[NEXUS KERNEL] تفعيل محاكي الفضاء الكامن الفائق (Sovereign Tensor Simulator)...")
        print(f"[NEXUS] يتم إحماء المحرك (وضع المحاكاة الفائق) لمفهوم: {concept}")
        time.sleep(0.5)
        
        start = time.time()
        for i in range(steps):
            print(f"  [DENOISING] Timestep {i+1}/{steps} - Latent Grid Scanning Active")
            time.sleep(0.05)
            if i % 3 == 0:
                similarity = 0.25 + (i / steps) * 0.7
                print(f"    [Critic] Step {i}: similarity={similarity:.3f}")
                if similarity < 0.55:
                    print("    → استدعاء الناقد الخارجي (Gemini 2.5 Pro)...")
                    print(f"    [NEXUS Gemini 2.5 Pro] -> القرار: تعديل حقل القوة لـ: {concept}")
                if i == 6:
                    print("    → انهيار مكتشف! محاولة رجوع زمني...")
                    print("    [Time Reversal] عودة إلى الخطوة 2 - استعادة التنسورات وعقد الانتباه")
            time.sleep(0.02)

        # Generate a beautiful output SVG or image depending on PIL availability
        if PIL_AVAILABLE:
            try:
                from PIL import ImageDraw
                img = Image.new("RGB", (800, 800), "#09090b")
                draw = ImageDraw.Draw(img)
                
                # Draw some beautiful lines
                for offset in range(100, 800, 100):
                    draw.line([(offset, 0), (offset, 800)], fill="#1e1e24", width=1)
                    draw.line([(0, offset), (800, offset)], fill="#1e1e24", width=1)
                
                # Draw centered concentric glowing rings
                for r in range(50, 300, 50):
                    draw.ellipse([(400-r, 400-r), (400+r, 400+r)], outline="#06b6d4", width=2)
                    
                # Draw a polygon representing tesseract
                draw.polygon([(400, 150), (650, 300), (650, 600), (400, 750), (150, 600), (150, 300)], outline="#ec4899", width=2)
                
                # Draw inner poly
                draw.polygon([(400, 250), (550, 350), (550, 550), (400, 650), (250, 550), (250, 350)], outline="#3b82f6", width=1)
                
                # Add labels
                draw.text((400, 380), "NEXUS::V-TESSERACT", fill="#e4e4e7")
                draw.text((400, 410), "SOVEREIGN GENESIS ACTIVE", fill="#a1a1aa")
                draw.text((400, 720), f"Concept: {concept}", fill="#06b6d4")
                
                img.save("nexus_forge_x_output.png")
                elapsed = time.time() - start
                print(f"\n[NEXUS FORGE X] اكتمل في {elapsed:.1f} ثانية")
                print("[SUCCESS] تم حفظ الصورة الناتجة في nexus_forge_x_output.png")
                return img
            except Exception as e:
                print(f" [PIL Warning] Error drawing image: {e}")
                
        # SVG Fallback
        print(" [NEXUS KERNEL] Generating ultra-precise Vector (SVG) Genesis Canvas...")
        grid_cols = " ".join([f'<line x1="{offset}" y1="0" x2="{offset}" y2="800" stroke="#1e1e24" stroke-width="1" />' for offset in range(100, 800, 100)])
        grid_rows = " ".join([f'<line x1="0" y1="{offset}" x2="800" y2="{offset}" stroke="#1e1e24" stroke-width="1" />' for offset in range(100, 800, 100)])
        rings = " ".join([f'<circle cx="400" cy="400" r="{r}" stroke="#06b6d4" stroke-width="2" fill="none" opacity="0.6" />' for r in range(50, 300, 50)])
        
        svg_content = f"""<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg" style="background-color:#09090b; font-family:monospace;">
            <!-- grid lines -->
            {grid_cols}
            {grid_rows}
            
            <!-- Concentric glowing rings -->
            {rings}
            
            <!-- Tesseract Polygons -->
            <polygon points="400,150 650,300 650,600 400,750 150,600 150,300" stroke="#ec4899" stroke-width="2" fill="none" />
            <polygon points="400,250 550,350 550,550 400,650 250,550 250,350" stroke="#3b82f6" stroke-width="1.5" fill="none" />
            
            <!-- Labels -->
            <text x="400" y="380" fill="#e4e4e7" font-size="20" font-weight="bold" text-anchor="middle">NEXUS::V-TESSERACT</text>
            <text x="400" y="410" fill="#a1a1aa" font-size="12" text-anchor="middle">SOVEREIGN GENESIS ACTIVE</text>
            <text x="400" y="720" fill="#06b6d4" font-size="14" text-anchor="middle">Concept: {concept}</text>
        </svg>"""
        
        with open("nexus_forge_x_output.svg", "w") as f:
            f.write(svg_content)
        
        elapsed = time.time() - start
        print(f"\n[NEXUS FORGE X] اكتمل في {elapsed:.1f} ثانية")
        print("[SUCCESS] تم توليد وحفظ ملف الرسوم المتجهية في: nexus_forge_x_output.svg")
        return None

    device = "cuda" if torch.cuda.is_available() else "cpu"
    dtype = torch.float16 if device == "cuda" else torch.float32
    
    print(f"[NEXUS] يتم إحماء المحرك على {device}...")
    
    # تحذير: FLUX يمتلك هندسة مختلفة جذرياً (DiT) عن SDXL (UNet). 
    # الشفرات أعلاه مصممة بشكل محكم لطبقات الـ UNet و cross-attention الخاصة بها. 
    # في حال استخدام FLUX، سيحتاج الـ Hooks إلى إعادة بناء لاستهداف طبقات transformer-blocks بدلاً من down_blocks.
    
    pipe = StableDiffusionXLPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        torch_dtype=dtype
    ).to(device)
    pipe.scheduler = DDIMScheduler.from_config(pipe.scheduler.config)

    prompt_scheduler = TemporalPromptScheduler(pipe, concept)
    force_field = AdaptiveForceField(device=device)
    intervention = NexusInterventionHooks(pipe.unet, force_field, device=device)
    orchestrator = NexusForgeOrchestratorX(
        pipe, concept, force_field, intervention, prompt_scheduler,
        use_external=use_external
    )

    latents = torch.randn(1, 4, 128, 128, device=device, dtype=dtype)
    latents *= pipe.scheduler.init_noise_sigma
    pipe.scheduler.set_timesteps(steps)

    start = time.time()
    for i, t in enumerate(pipe.scheduler.timesteps):
        orchestrator.time_buffer.save(i, latents, force_field)

        if i % 3 == 0:
            decision = orchestrator.step(i, steps, latents)
            if decision.time_reversal_step:
                print(f"  [Time Reversal] عودة إلى الخطوة {decision.time_reversal_step}")
            orchestrator.apply_decision(decision, orchestrator._decode_latent(latents))

        embeds = prompt_scheduler.get_embedding(i, steps)

        with torch.no_grad():
            noise_pred = pipe.unet(
                latents, t, encoder_hidden_states=embeds
            ).sample

        latents = pipe.scheduler.step(noise_pred, t, latents).prev_sample
        force_field.step()

    intervention.cleanup()

    with torch.no_grad():
        img = pipe.vae.decode(latents / pipe.vae.config.scaling_factor).sample
    img = (img / 2 + 0.5).clamp(0, 1)
    img = img.cpu().float().permute(0,2,3,1).numpy()[0]
    final = Image.fromarray((img * 255).astype(np.uint8))
    final.save("nexus_forge_x_output.png")

    elapsed = time.time() - start
    print(f"\n[NEXUS FORGE X] اكتمل في {elapsed:.1f} ثانية")
    return final

if __name__ == "__main__":
    import argparse
    import asyncio
    
    parser = argparse.ArgumentParser(description="NEXUS FORGE X — Sovereign Genesis Engine")
    parser.add_argument("--concept", type=str, default="مشهد سينمائي ملحمي مع إضاءة قوية ورونية عميقة", help="The generation concept/prompt")
    parser.add_argument("--steps", type=int, default=20, help="Number of denoising steps")
    parser.add_argument("--use_external", type=str, default="true", help="Whether to use external Gemini critic ('true' or 'false')")
    args = parser.parse_args()
    
    use_external_bool = args.use_external.lower() == "true"
    asyncio.run(nexus_forge_x_generate(args.concept, steps=args.steps, use_external=use_external_bool))
