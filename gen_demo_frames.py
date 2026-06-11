#!/usr/bin/env python3
"""Generate demo video frames for Project Butler Hackathon submission."""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1920, 1080
BG = (13, 17, 26)       # #0D111A
GREEN = (0, 212, 170)   # #00D4AA
WHITE = (230, 237, 243) # #E6EDF3
GRAY = (139, 148, 158)  # #8B949E
OUT = r"D:\project-butler\demo-frames"
os.makedirs(OUT, exist_ok=True)

# Load fonts
ARIAL = r"C:\Windows\Fonts\arial.ttf"
CONSOLAS = r"C:\Windows\Fonts\consola.ttf"
font_title = ImageFont.truetype(ARIAL, 96)
font_sub = ImageFont.truetype(ARIAL, 64)
font_h2 = ImageFont.truetype(ARIAL, 56)
font_body = ImageFont.truetype(ARIAL, 36)
font_small = ImageFont.truetype(ARIAL, 28)
font_term = ImageFont.truetype(CONSOLAS, 24)
font_term_sm = ImageFont.truetype(CONSOLAS, 20)

def make_frame(name, draw_func):
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    draw_func(d)
    path = os.path.join(OUT, name)
    img.save(path, "PNG")
    return path

def center_text(d, text, y, font, color, max_w=1600):
    """Draw centered text at y position."""
    bbox = d.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    d.text(((W - tw) // 2, y), text, fill=color, font=font)

def draw_badge(d, text, x, y):
    """Draw a rounded badge."""
    bbox = d.textbbox((0, 0), text, font=font_small)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    pad_x, pad_y = 20, 10
    d.rounded_rectangle([x, y, x + tw + pad_x*2, y + th + pad_y*2], radius=8, fill=(22, 27, 42), outline=(0, 212, 170))
    d.text((x + pad_x, y + pad_y), text, fill=GREEN, font=font_small)

# ═══════════════════════════════════════════════════════════════
# Frame 01 - Title
# ═══════════════════════════════════════════════════════════════
make_frame("frame_01_title.png", lambda d: [
    draw_badge(d, "Microsoft Agents League 2026", 60, 40),
    center_text(d, "Project Butler", 360, font_title, GREEN),
    center_text(d, "AI Agent for Autonomous Project Documentation", 500, font_body, GRAY),
    center_text(d, "Creative Apps Track  •  Built with GitHub Copilot", 580, font_small, (100, 108, 120)),
])

# ═══════════════════════════════════════════════════════════════
# Frame 02 - The Problem  
# ═══════════════════════════════════════════════════════════════
make_frame("frame_02_problem.png", lambda d: [
    center_text(d, "The Challenge", 120, font_h2, GREEN),
    center_text(d, "From idea to investor-ready documentation...", 300, font_body, WHITE),
    center_text(d, "Takes weeks of work for founders and product teams", 370, font_body, WHITE),
    draw_badge(d, "PRD", 280, 500),
    draw_badge(d, "Competitive Analysis", 420, 500),
    draw_badge(d, "Financial Model", 640, 500),
    draw_badge(d, "Pitch Deck", 840, 500),
    draw_badge(d, "Tech Architecture", 1040, 500),
    draw_badge(d, "MVP Plan", 1280, 500),
    center_text(d, "Each requires deep domain expertise and hours of focused work", 650, font_small, GRAY),
])

# ═══════════════════════════════════════════════════════════════
# Frame 03 - Solution
# ═══════════════════════════════════════════════════════════════
make_frame("frame_03_solution.png", lambda d: [
    center_text(d, "The Solution", 120, font_h2, GREEN),
    center_text(d, "Describe your project in one sentence.", 360, font_sub, WHITE),
    center_text(d, "The agent plans, writes, designs, and packages.", 480, font_body, GRAY),
    center_text(d, "Automatically. In minutes.", 560, font_h2, WHITE),
    center_text(d, "Ready for investors, clients, and stakeholders.", 680, font_small, GRAY),
])

# ═══════════════════════════════════════════════════════════════
# Frame 04 - Pipeline
# ═══════════════════════════════════════════════════════════════
make_frame("frame_04_pipeline.png", lambda d: [
    center_text(d, "The Pipeline", 100, font_h2, GREEN),
])
# Add pipeline steps manually
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
center_text(d, "The Pipeline", 80, font_h2, GREEN)

steps = [
    ("1", "PLAN", "LLM decomposes\ninto tasks"),
    ("2", "GENERATE", "Specialized prompts\nper document type"),
    ("3", "CONVERT", "Markdown → .pptx\n.docx .xlsx"),
    ("4", "PACKAGE", "ZIP bundle\none-click download"),
]

colors = [GREEN, (100, 180, 255), (255, 180, 100), (200, 140, 255)]
for i, (num, title, desc) in enumerate(steps):
    x = 80 + i * 460
    y = 260
    # Step number circle
    d.ellipse([x + 80, y, x + 200, y + 120], fill=colors[i], outline=None)
    d.text((x + 140, y + 30), num, fill=(13, 17, 26), font=font_title, anchor="ma")
    # Title
    d.text((x + 140, y + 180), title, fill=colors[i], font=font_body, anchor="ma")
    # Description
    for j, line in enumerate(desc.split("\n")):
        d.text((x + 140, y + 230 + j * 32), line, fill=GRAY, font=font_small, anchor="ma")
    # Arrow (except last)
    if i < 3:
        d.text((x + 360, y + 45), "→", fill=GRAY, font=font_h2)

center_text(d, "~2 minutes end-to-end", 600, font_body, GREEN)
img.save(os.path.join(OUT, "frame_04_pipeline.png"), "PNG")

# ═══════════════════════════════════════════════════════════════
# Frame 05 - Web UI
# ═══════════════════════════════════════════════════════════════
make_frame("frame_05_webui.png", lambda d: [
    center_text(d, "Web UI  +  CLI", 80, font_h2, GREEN),
    center_text(d, "Professional dark-theme interface", 180, font_small, GRAY),
    center_text(d, "Type your project idea → Click Generate → Download results", 260, font_body, WHITE),
    draw_badge(d, "Real-time progress tracking", 360, 420),
    draw_badge(d, "File preview with type icons", 520, 420),
    draw_badge(d, "One-click ZIP download", 680, 420),
    center_text(d, "Or use:  node cli.js \"your project description\"", 600, font_small, GRAY),
])

# ═══════════════════════════════════════════════════════════════
# Frame 06 - CLI Demo Planning
# ═══════════════════════════════════════════════════════════════
make_frame("frame_06_cli_planning.png", lambda d: [
    center_text(d, "CLI Demo — Planning Phase", 80, font_h2, GREEN),
    center_text(d, "$ node cli.js \"AI-powered fitness coach app\"", 180, font_small, GRAY),
    # Simulated terminal
    d.rounded_rectangle([100, 240, 1820, 900], radius=8, fill=(22, 27, 42)),
    d.text((130, 260), "🚀 Project Butler Agent Starting...", fill=GRAY, font=font_term),
    d.text((130, 300), "📋 Project: AI-powered fitness coach", fill=WHITE, font=font_term),
    d.text((130, 350), "[🧠] Analyzing requirements and planning tasks...", fill=GREEN, font=font_term),
    d.text((130, 400), "[Agent] ✅ Plan created: 6 tasks", fill=GREEN, font=font_term),
    d.text((130, 460), "[📝] Task 1/6: Product Requirements Document (PRD)", fill=(100, 180, 255), font=font_term),
    d.text((130, 500), "[📝] Task 2/6: Competitive Analysis", fill=(100, 180, 255), font=font_term),
    d.text((130, 540), "[📝] Task 3/6: Technical Architecture", fill=(100, 180, 255), font=font_term),
    d.text((130, 580), "[📝] Task 4/6: Financial Model & Projections", fill=(100, 180, 255), font=font_term),
    d.text((130, 620), "[📝] Task 5/6: Investor Pitch Deck", fill=(100, 180, 255), font=font_term),
    d.text((130, 660), "[📝] Task 6/6: MVP Development Plan", fill=(100, 180, 255), font=font_term),
])

# ═══════════════════════════════════════════════════════════════
# Frame 07 - CLI Demo Generating
# ═══════════════════════════════════════════════════════════════
make_frame("frame_07_cli_generating.png", lambda d: [
    center_text(d, "CLI Demo — Generation Phase", 80, font_h2, GREEN),
    d.rounded_rectangle([100, 200, 1820, 950], radius=8, fill=(22, 27, 42)),
    d.text((130, 220), "[Agent] 📝 Generating: Product Requirements Document (PRD)", fill=GRAY, font=font_term),
    d.text((130, 260), "[Agent] ✅ PRD generated (5,809 chars)", fill=GREEN, font=font_term),
    d.text((130, 310), "[Agent] 📝 Generating: Competitive Analysis", fill=GRAY, font=font_term),
    d.text((130, 350), "[Agent] ✅ Competitive Analysis generated (4,946 chars)", fill=GREEN, font=font_term),
    d.text((130, 400), "[Agent] 📝 Generating: Technical Architecture", fill=GRAY, font=font_term),
    d.text((130, 440), "[Agent] ✅ Technical Architecture generated (12,638 chars)", fill=GREEN, font=font_term),
    d.text((130, 490), "[Agent] 📝 Generating: Financial Model", fill=GRAY, font=font_term),
    d.text((130, 530), "[Agent] ✅ Financial Model generated (2,361 chars)", fill=GREEN, font=font_term),
    d.text((130, 580), "[Agent] 📝 Generating: Pitch Deck", fill=GRAY, font=font_term),
    d.text((130, 620), "[Agent] ✅ Pitch Deck generated (2,656 chars)", fill=GREEN, font=font_term),
    d.text((130, 670), "[Agent] 📝 Generating: MVP Development Plan", fill=GRAY, font=font_term),
    d.text((130, 710), "[Agent] ✅ MVP Development Plan generated (7,598 chars)", fill=GREEN, font=font_term),
    d.text((130, 770), "[✅] All 6 tasks completed!", fill=GREEN, font=font_sub),
])

# ═══════════════════════════════════════════════════════════════
# Frame 08 - Output Files
# ═══════════════════════════════════════════════════════════════
make_frame("frame_08_outputs.png", lambda d: [
    center_text(d, "Generated Deliverables", 80, font_h2, GREEN),
])
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
center_text(d, "Generated Deliverables", 80, font_h2, GREEN)

files = [
    ("PRD_产品需求文档.docx", "43.0KB", "📄"),
    ("竞品分析报告.pptx", "44.9KB", "📊"),
    ("技术架构文档.docx", "44.3KB", "📄"),
    ("财务预测模型.xlsx", "6.9KB", "📊"),
    ("投资人路演PPT.pptx", "47.7KB", "🎯"),
    ("项目代码.txt", "11.4KB", "💻"),
    ("→ Packaged as bundle.zip", "~200KB", "📦"),
]

for i, (name, size, icon) in enumerate(files):
    y = 240 + i * 90
    x = 200
    d.rounded_rectangle([x, y, x + 1520, y + 70], radius=8, fill=(22, 27, 42) if i < 6 else (0, 212, 170, 30))
    d.text((x + 20, y + 12), icon, font=font_body)
    color = GREEN if i == 6 else WHITE
    d.text((x + 70, y + 12), name, fill=color, font=font_body)
    d.text((x + 1400, y + 12), size, fill=GRAY, font=font_small)

center_text(d, "Real .pptx / .docx / .xlsx files, ready to use", 920, font_small, GRAY)
img.save(os.path.join(OUT, "frame_08_outputs.png"), "PNG")

# ═══════════════════════════════════════════════════════════════
# Frame 09 - Architecture
# ═══════════════════════════════════════════════════════════════
make_frame("frame_09_architecture.png", lambda d: [
    center_text(d, "System Architecture", 80, font_h2, GREEN),
    center_text(d, "User Input", 180, font_body, WHITE),
    # Arrow down
    d.text((950, 210), "↓", fill=GREEN, font=font_sub),
    d.rounded_rectangle([500, 250, 1420, 350], radius=8, fill=(22, 27, 42)),
    center_text(d, "Planning Engine (qwen3.7-plus)", 290, font_body, GREEN),
    d.text((950, 360), "↓", fill=GREEN, font=font_sub),
    d.rounded_rectangle([300, 380, 960, 480], radius=8, fill=(22, 27, 42)),
    d.text((630, 420), "Execution Pipeline", fill=(100, 180, 255), font=font_body, anchor="ma"),
    d.rounded_rectangle([960, 380, 1620, 480], radius=8, fill=(22, 27, 42)),
    d.text((1290, 420), "Content Generation", fill=(100, 180, 255), font=font_body, anchor="ma"),
    d.text((950, 490), "↓", fill=GREEN, font=font_sub),
    d.rounded_rectangle([300, 510, 960, 590], radius=8, fill=(22, 27, 42)),
    d.text((630, 545), "Office Converter (Python)", fill=WHITE, font=font_body, anchor="ma"),
    d.rounded_rectangle([960, 510, 1620, 590], radius=8, fill=(22, 27, 42)),
    d.text((1290, 545), "ZIP Packaging (Node.js)", fill=WHITE, font=font_body, anchor="ma"),
    d.text((950, 600), "↓", fill=GREEN, font=font_sub),
    d.rounded_rectangle([500, 620, 1420, 720], radius=8, fill=(22, 27, 42)),
    center_text(d, "Output: .pptx  .docx  .xlsx  .zip", 660, font_h2, WHITE),
])

# ═══════════════════════════════════════════════════════════════
# Frame 10 - Copilot Usage
# ═══════════════════════════════════════════════════════════════
make_frame("frame_10_copilot.png", lambda d: [
    center_text(d, "Built with GitHub Copilot", 100, font_h2, GREEN),
    center_text(d, "AI-assisted development across the entire stack", 200, font_small, GRAY),
])
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
center_text(d, "Built with GitHub Copilot", 100, font_h2, GREEN)
center_text(d, "AI-assisted development across the entire stack", 200, font_small, GRAY)

copilot_uses = [
    ("agent.js", "Multi-step planning prompts, async pipeline, error handling patterns"),
    ("cli.js", "File system operations, ZIP packaging, subprocess management"),
    ("server.js", "HTTP routing, static file serving, API error formatting"),
    ("convert.py", "python-pptx/docx/openpyxl API patterns, dark theme slide design"),
    ("app.js + styles.css", "Progress visualization, design system, file type detection"),
]

for i, (file, desc) in enumerate(copilot_uses):
    y = 320 + i * 110
    d.text((200, y), file, fill=GREEN, font=font_body)
    d.text((550, y), desc, fill=WHITE, font=font_small)

center_text(d, "Accelerated development while maintaining code ownership", 900, font_small, GRAY)
img.save(os.path.join(OUT, "frame_10_copilot.png"), "PNG")

# ═══════════════════════════════════════════════════════════════
# Frame 11 - Key Technologies
# ═══════════════════════════════════════════════════════════════
make_frame("frame_11_tech.png", lambda d: [
    center_text(d, "Technology Stack", 100, font_h2, GREEN),
])
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
center_text(d, "Technology Stack", 100, font_h2, GREEN)

techs = [
    ("GitHub Copilot", "Primary AI development tool — code generation, refactoring, prompt design"),
    ("DashScope qwen3.7-plus", "Multi-step planning and document content generation"),
    ("DashScope qwen-long-latest", "Extended-context code generation"),
    ("Node.js", "Async pipeline orchestration, HTTP server, CLI entry point"),
    ("Python (pptx/docx/openpyxl)", "Native Office file generation from Markdown"),
    ("Vanilla HTML/CSS/JS", "Professional dark-theme Web UI with real-time progress"),
]

for i, (name, desc) in enumerate(techs):
    y = 220 + i * 120
    d.text((200, y), name, fill=GREEN, font=font_body)
    d.text((650, y), desc, fill=WHITE, font=font_small)

img.save(os.path.join(OUT, "frame_11_tech.png"), "PNG")

# ═══════════════════════════════════════════════════════════════
# Frame 12 - Impact
# ═══════════════════════════════════════════════════════════════
make_frame("frame_12_impact.png", lambda d: [
    center_text(d, "The Impact", 120, font_h2, GREEN),
    center_text(d, "Weeks → Minutes", 320, font_title, GREEN),
    center_text(d, "From blank page to complete project documentation", 460, font_body, WHITE),
    center_text(d, "PRD • Analysis • Finance • Pitch • Architecture • MVP Plan", 540, font_body, GRAY),
    center_text(d, "All as real Office files, packaged and ready", 620, font_small, WHITE),
    center_text(d, "For founders, product managers, consultants, and innovators", 740, font_small, GRAY),
])

# ═══════════════════════════════════════════════════════════════
# Frame 13 - Links / CTA
# ═══════════════════════════════════════════════════════════════
make_frame("frame_13_links.png", lambda d: [
    center_text(d, "Try It Yourself", 120, font_h2, GREEN),
    center_text(d, "github.com/huimingchen081-beep/project-butler", 300, font_sub, GREEN),
    center_text(d, "git clone → npm install → node cli.js \"your idea\"", 450, font_body, WHITE),
    center_text(d, "MIT License  •  Open Source  •  Ready to Use", 600, font_small, GRAY),
    center_text(d, "Built for Microsoft Agents League Hackathon 2026", 750, font_small, (100, 108, 120)),
    center_text(d, "Creative Apps Track", 810, font_body, GREEN),
])

# ═══════════════════════════════════════════════════════════════
# Frame 14 - Thank You
# ═══════════════════════════════════════════════════════════════
make_frame("frame_14_thanks.png", lambda d: [
    center_text(d, "Thank You", 350, font_title, GREEN),
    center_text(d, "Huiming Chen  •  @huimingchen081-beep", 540, font_body, WHITE),
    center_text(d, "Zhengzhou Huiqin Software Development Co., Ltd.", 620, font_small, GRAY),
    center_text(d, "Project Butler — Your AI Project Butler", 720, font_body, GREEN),
])

print("✅ All 14 demo frames generated!")
print(f"Output directory: {OUT}")
for f in sorted(os.listdir(OUT)):
    if f.endswith('.png'):
        sz = os.path.getsize(os.path.join(OUT, f))
        print(f"  {f} ({sz:,} bytes)")
