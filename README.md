# 🧠 Project Butler

> **AI Agent for autonomous project documentation generation**
> 
> Built for **Microsoft Agents League Hackathon 2026 — Creative Apps Track**
> Developed with **GitHub Copilot** AI assistance

---

## 🎯 What It Does

**One sentence describes your idea. The agent plans, writes, designs, and packages — autonomously.**

```
$ project-butler "宠物社交App，下周见投资人"
→ 🧠 Planning: 5 tasks identified
→ 📄 Generating PRD (Product Requirements Document)
→ 📊 Generating Competitive Analysis
→ 💰 Generating Financial Model
→ 🎯 Generating Pitch Deck
→ 🏗️ Generating Technical Architecture
→ 📦 Packaging: 宠物社交App_交付包.zip (86KB)
→ ✅ Done in 120s
```

## 🏗️ Architecture

```
User Input (Natural Language)
        ↓
┌─────────────────────────┐
│  Planning Engine (LLM)  │  ← qwen3.7-plus
│  Task Decomposition     │
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Execution Pipeline     │  ← Node.js async
│  ┌───────┬──────┬──────┐│
│  │ PRD   │Analysis│Finance│
│  │ Word  │  PPT  │ Excel │
│  ├───────┼──────┼──────┤│
│  │ Pitch │Arch  │ Code ││
│  │  PPT  │ Word │  TXT ││
│  └───────┴──────┴──────┘│
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Office Converter       │  ← Python (pptx/docx/xlsx)
│  Markdown → .pptx/docx/xlsx│
└───────────┬─────────────┘
            ↓
┌─────────────────────────┐
│  Package & Deliver      │  ← ZIP with all files
│  One-click download     │
└─────────────────────────┘
```

## 🛠️ Technology Stack

| Technology | Role |
|------------|------|
| **GitHub Copilot** | AI-assisted development for agent logic, pipeline orchestration, error handling |
| **DashScope (qwen3.7-plus)** | Multi-step planning and content generation |
| **DashScope (qwen-long-latest)** | Code generation with extended context |
| **Python (pptx/docx/openpyxl)** | Native Office file generation |
| **Node.js** | Async pipeline orchestration, HTTP server |
| **Vanilla HTML/CSS/JS** | Professional dark-theme Web UI |

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- Python 3.13+ with venv
- Python packages: `python-pptx`, `python-docx`, `openpyxl`
- DashScope API Key (free at [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com/))

### Setup
```bash
git clone https://github.com/huimingchen081-beep/project-butler.git
cd project-butler
npm install

# Set your DashScope API key
cp .env.example .env
# Edit .env and replace with your actual API key

# Install Python dependencies
python -m venv venv
venv/Scripts/pip install python-pptx python-docx openpyxl
```

### Run Web UI
```bash
npm start
# Open http://localhost:3000
```

### Run CLI
```bash
node cli.js "你的项目描述"
```

## 📂 Project Structure

```
project-butler/
├── agent.js          # Core planning & execution engine
├── cli.js            # CLI entry point + file conversion + packaging
├── convert.py        # Markdown → Office file converter (pptx/docx/xlsx)
├── server.js         # HTTP server for Web UI
├── index.html        # Web UI (dark tech theme)
├── styles.css        # Design system
├── app.js            # Frontend logic
├── .env.example      # Environment variable template
├── outputs/          # Generated deliverables
├── ARCHITECTURE.md   # Detailed architecture documentation
└── README.md         # This file
```

## 🏆 Judging Criteria Alignment

| Criterion (Weight) | How We Address It |
|---------------------|-------------------|
| **Accuracy & Relevance (20%)** | Strictly follows Creative Apps track requirements; uses GitHub Copilot as primary dev tool |
| **Reasoning & Multi-step (20%)** | Core feature — autonomous task decomposition, planning, sequential execution |
| **Creativity & Originality (15%)** | Unique "Project Butler" concept — not just a doc generator, but a reasoning agent |
| **UX & Presentation (15%)** | Professional dark-theme Web UI with real-time progress, file previews, one-click download |
| **Reliability & Safety (20%)** | Comprehensive error handling, input validation, safe content generation |
| **Community Vote (10%)** | Join our Discord to support! |

## 👤 Team

**Huiming Chen (陈惠明)** — Zhengzhou Huiqin Software Development Co., Ltd.
- Full-stack developer & AI engineer
- Microsoft Learn: [profile]
- GitHub: [@huimingchen081-beep](https://github.com/huimingchen081-beep)

## 📄 License

MIT License

---

*Built with ❤️ and GitHub Copilot for Microsoft Agents League Hackathon 2026*
