# Project Butler — Hackathon Submission

## Project Description (250 words)

Project Butler is an AI Agent that transforms a single natural language description into a complete set of professional project documentation — autonomously. Tell it "build a pet social app" or "create an AI fitness coach," and it plans, writes, designs, and packages PRDs, competitive analyses, financial models, pitch decks, and technical architecture documents as real Office files (.pptx, .docx, .xlsx), ready for investor review.

The agent employs a three-phase pipeline: (1) **Planning** — the LLM decomposes the user's idea into a structured task plan with specific document types and content requirements; (2) **Execution** — each task is processed sequentially, with specialized prompts per document type ensuring domain-appropriate output quality; (3) **Conversion & Packaging** — Markdown content is converted to native Office formats via Python converters, then bundled into a downloadable ZIP.

Built entirely with GitHub Copilot AI assistance, the project demonstrates multi-agent orchestration — the "Project Butler" itself reasons about project scope before generating content, making it more than a simple template filler. The professional dark-theme Web UI provides real-time progress tracking, and the CLI enables headless automation.

For founders, product managers, and consultants who need to move from idea to investor-ready materials in minutes rather than weeks, Project Butler eliminates the blank-page problem entirely.

---

## Key Technologies

| Technology | Role |
|------------|------|
| **GitHub Copilot** | Primary development tool — agent logic, pipeline orchestration, prompt engineering |
| **DashScope (qwen3.7-plus)** | Multi-step project planning and document generation |
| **DashScope (qwen-long-latest)** | Code generation with extended context windows |
| **Node.js** | Async pipeline orchestration, HTTP server, CLI entry point |
| **Python (python-pptx/python-docx/openpyxl)** | Native Office file generation from Markdown |
| **Vanilla HTML/CSS/JS** | Professional dark-theme Web UI with real-time progress |
| **archiver (npm)** | ZIP packaging for one-click deliverables download |

---

## Repository

**URL**: https://github.com/huimingchen081-beep/project-butler

## Team

**Huiming Chen (陈惠明)** — Individual submission
- GitHub: @huimingchen081-beep
- Company: Zhengzhou Huiqin Software Development Co., Ltd.

---

## How It Meets Judging Criteria

| Criterion | How Addressed |
|-----------|--------------|
| **Accuracy & Relevance** | Strictly Creative Apps track — autonomous document generation for product teams |
| **Reasoning & Multi-step** | Core feature: LLM plans → executes → converts → packages in autonomous pipeline |
| **Creativity & Originality** | Unique concept: AI that acts as a project butler, not just a doc generator |
| **UX & Presentation** | Professional dark-theme Web UI with real-time progress, one-click ZIP download |
| **Reliability & Safety** | Comprehensive error handling at every phase, graceful degradation, input validation |

---

## Submission Checklist

- [x] Public GitHub repository with complete code
- [x] Comprehensive README.md with setup instructions
- [x] No hardcoded API keys (uses .env)
- [x] Demo materials (screenshots + video)
- [x] Architecture diagram (ARCHITECTURE.md)
- [x] Proper attribution for third-party code
- [x] Agreed to Code of Conduct
- [x] Agreed to Disclaimer
- [x] No confidential/proprietary/sensitive information
