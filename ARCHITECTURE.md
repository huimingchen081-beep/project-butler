# Project Butler — Architecture Document

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PROJECT BUTLER AGENT                             │
│                                                                               │
│  ┌─────────────┐    ┌──────────────────┐    ┌──────────────────────────────┐ │
│  │   Web UI    │───▶│   HTTP Server    │───▶│     Agent Planning Engine     │ │
│  │ (index.html)│    │   (server.js)    │    │       (agent.js)              │ │
│  │             │    │                  │    │                               │ │
│  │ • Dark Theme│    │ POST /api/run    │    │  ┌─────────────────────────┐  │ │
│  │ • Real-time │    │ Static File Serve│    │  │  Task Decomposition     │  │ │
│  │   Progress  │    │                  │    │  │  (qwen3.7-plus LLM)     │  │ │
│  │ • File Cards│    │                  │    │  │  ┌───────┬──────┬──────┐│  │ │
│  │ • Download  │    │                  │    │  │  │ PRD   │Analysis│Finance│  │ │
│  └─────────────┘    └──────────────────┘    │  │  │ Word  │ PPT   │Excel │  │ │
│                                              │  │  ├───────┼──────┼──────┤  │ │
│  ┌─────────────┐                             │  │  │ Pitch │Arch  │ Code │  │ │
│  │  CLI Entry  │                             │  │  │ PPT   │Word  │ TXT  │  │ │
│  │  (cli.js)   │                             │  │  └───────┴──────┴──────┘  │ │
│  │             │                             │  └─────────────────────────┘  │ │
│  │ node cli.js │                             │                               │ │
│  │ "project"   │                             │  ┌─────────────────────────┐  │ │
│  └──────┬──────┘                             │  │  Content Generation     │  │ │
│         │                                     │  │  (per-type templates)   │  │ │
│         │    ┌──────────────────┐             │  │  • PRD → Markdown       │  │ │
│         └───▶│  Output Manager  │             │  │  • Analysis → Markdown  │  │ │
│              │  (cli.js)        │             │  │  • Finance → CSV        │  │ │
│              │                  │◀────────────│  │  • Pitch → Markdown     │  │ │
│              │ • File Conversion│             │  │  • Architecture → MD    │  │ │
│              │ • ZIP Packaging  │             │  │  • Code → Text          │  │ │
│              │ • Error Recovery │             │  └─────────────────────────┘  │ │
│              └────────┬─────────┘             └──────────────────────────────┘ │
│                       │                                                         │
│                       ▼                                                         │
│              ┌──────────────────┐                                              │
│              │  Office Converter│                                              │
│              │  (convert.py)    │                                              │
│              │                  │                                              │
│              │ • Markdown→PPTX  │                                              │
│              │ • Markdown→DOCX  │                                              │
│              │ • CSV/Table→XLSX │                                              │
│              │                  │                                              │
│              │ Python Libraries:│                                              │
│              │ python-pptx      │                                              │
│              │ python-docx      │                                              │
│              │ openpyxl         │                                              │
│              └────────┬─────────┘                                              │
│                       │                                                         │
│                       ▼                                                         │
│              ┌──────────────────┐                                              │
│              │  Deliverables    │                                              │
│              │  (outputs/)      │                                              │
│              │                  │                                              │
│              │ • PRD.docx       │                                              │
│              │ • Analysis.pptx  │                                              │
│              │ • Finance.xlsx   │                                              │
│              │ • Pitch.pptx     │                                              │
│              │ • Architecture.docx│                                            │
│              │ • Code files     │                                              │
│              │ • Bundle.zip     │                                              │
│              └──────────────────┘                                              │
└─────────────────────────────────────────────────────────────────────────────┘

                              EXTERNAL SERVICES
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  DashScope API   │    │  GitHub Copilot  │    │  Microsoft Learn │
│                  │    │                  │    │                  │
│ qwen3.7-plus     │    │ AI-assisted      │    │ Learning         │
│ (Planning/Content)│    │ development:     │    │ resources for    │
│                  │    │ • agent.js       │    │ Copilot usage    │
│ qwen-long-latest │    │ • cli.js         │    │ patterns         │
│ (Code Gen)       │    │ • server.js      │    │                  │
│                  │    │ • convert.py     │    │                  │
│                  │    │ • app.js         │    │                  │
│                  │    │ • error handling │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

## How GitHub Copilot Was Used

GitHub Copilot was instrumental throughout the development of Project Butler. Here's how:

### 1. Agent Planning Engine (`agent.js`)
- **Task decomposition prompts**: Copilot suggested the structured JSON format for task decomposition, including the field types and descriptions
- **Error handling patterns**: Suggested try-catch patterns with graceful degradation for API failures
- **Async pipeline design**: Helped design the sequential execution flow with progress callbacks

### 2. CLI & File Operations (`cli.js`)
- **File system operations**: Suggested robust file I/O patterns with existence checks
- **ZIP packaging**: Generated the archiver-based packaging logic
- **Subprocess management**: Helped with child_process.execSync patterns for Python integration

### 3. HTTP Server (`server.js`)
- **Static file serving**: Suggested MIME type mapping and caching headers
- **API routing**: Helped design the RESTful API structure
- **Error middleware**: Suggested comprehensive error response formatting

### 4. Office Converter (`convert.py`)
- **PPTX slide generation**: Helped with python-pptx API patterns for dark theme slides
- **DOCX markdown parsing**: Suggested regex patterns for Markdown-to-DOCX conversion
- **XLSX formatting**: Helped with openpyxl styling patterns (frozen panes, auto-filter, alternating rows)

### 5. Web UI (`app.js`, `styles.css`)
- **Progress visualization**: Suggested the progress bar and log reconstruction patterns
- **CSS design system**: Helped with the dark theme CSS variables and responsive breakpoints
- **File type detection**: Suggested the icon and color mapping based on file extensions

## Data Flow

```
1. User Input → Planning LLM (qwen3.7-plus)
   "宠物社交App" → JSON plan with 5 tasks

2. Plan → Execution Pipeline (sequential)
   Task 1 (PRD) → LLM → markdown → convert.py → .docx
   Task 2 (Analysis) → LLM → markdown → convert.py → .pptx
   Task 3 (Finance) → LLM → CSV → convert.py → .xlsx
   Task 4 (Pitch) → LLM → markdown → convert.py → .pptx
   Task 5 (Architecture) → LLM → markdown → convert.py → .docx

3. All Files → archiver → bundle.zip

4. Response → Web UI displays cards with download links
```

## Security & Reliability

- **Input validation**: Minimum 10-character project description required
- **API error handling**: Comprehensive try-catch blocks with graceful fallbacks
- **File safety**: Output directory isolation, temp file cleanup
- **Content safety**: LLM prompt engineering to avoid harmful generation
- **Timeout protection**: 10-minute execution timeout with status reporting

## Scalability Considerations

- **Stateless design**: Each request is independent, enabling horizontal scaling
- **Modular architecture**: Agent, converter, and server are decoupled
- **Extensible task types**: New document types can be added by extending FILE_CONFIG
- **Multi-model support**: Architecture supports swapping LLM providers
