/**
 * Project Butler Agent — Planning & Execution Engine
 * 
 * Built with GitHub Copilot AI assistance for multi-step reasoning.
 * Copilot helped design the task decomposition prompts and error handling patterns.
 * 
 * Architecture:
 *   User Input → Planning LLM → Task Queue → Execute Tasks → Package Output
 */

const DASHSCOPE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
const DASHSCOPE_KEY = 'sk-1fb7b39e1e8b49ba8059aa13b070530e';

// ─── LLM Call ──────────────────────────────────────────────────
async function callLLM(systemPrompt, userMessage, model = 'qwen3.7-plus') {
  const res = await fetch(DASHSCOPE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DASHSCOPE_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 8192,
      temperature: 0.7
    })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`LLM API error: ${json.error?.message || res.status}`);
  return json.choices[0].message.content;
}

// ─── Planning Phase — Multi-step reasoning ─────────────────────
const PLANNER_PROMPT = `You are a professional project planning agent. Your job is to decompose a user's project idea into a structured task plan.

Given a user's project description, produce a JSON plan with these rules:
1. ALWAYS include these document types when relevant: PRD (product requirements), Competitive Analysis, Financial Model, Pitch Deck, Technical Architecture
2. Each task must have: id, type (one of: prd/analysis/finance/pitch/architecture/code), title, description
3. Be specific about what each document should contain
4. Return ONLY valid JSON, no markdown, no explanation

Format:
{
  "projectName": "string",
  "summary": "one-line project summary",
  "tasks": [
    {
      "id": 1,
      "type": "prd",
      "title": "Product Requirements Document",
      "description": "Detailed description of what this PRD should cover..."
    }
  ]
}`;

async function planProject(projectDescription) {
  console.log('[Agent] 🧠 Planning phase...');
  const raw = await callLLM(PLANNER_PROMPT, projectDescription);
  
  // Extract JSON from response (handle potential markdown wrapping)
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse plan JSON');
  
  const plan = JSON.parse(jsonMatch[0]);
  console.log(`[Agent] ✅ Plan created: ${plan.tasks.length} tasks for "${plan.projectName}"`);
  return plan;
}

// ─── Content Generation — Per document type ────────────────────
const GENERATOR_PROMPTS = {
  prd: `You are a senior product manager. Write a comprehensive Product Requirements Document (PRD) in Markdown format.
Include these sections:
# {title}
## 1. Executive Summary
## 2. Problem Statement
## 3. Target Users & Personas
## 4. Core Features & User Stories
## 5. Success Metrics (KPIs)
## 6. Technical Constraints
## 7. Timeline & Milestones
## 8. Risks & Mitigations

Make it detailed, professional, and ready for stakeholder review. Write in the user's preferred language.`,

  analysis: `You are a strategy consultant. Write a comprehensive Competitive Analysis report in Markdown format.
Include these sections:
# {title}
## 1. Market Overview & Size
## 2. Competitor Landscape (at least 5 competitors)
## 3. Feature Comparison Matrix
## 4. SWOT Analysis
## 5. Differentiation Strategy
## 6. Market Opportunities & Threats
## 7. Recommendations

Use data-driven insights. Include specific competitor names and features where possible.`,

  finance: `You are a financial analyst. Create a financial projection in CSV format.
Include these columns: Category, Item, Month1, Month2, Month3, Q1, Q2, Q3, Q4, Year1_Total
Cover these categories:
- Revenue (by stream)
- COGS / Direct Costs
- Operating Expenses (broken down)
- Headcount & Salary
- Marketing & Customer Acquisition
- Infrastructure / SaaS Costs
- Cash Flow Summary
- Key Metrics (CAC, LTV, Burn Rate)

Make numbers realistic for a startup. Include at least 20 rows of data.`,

  pitch: `You are a startup pitch coach. Create a compelling investor pitch deck outline in Markdown format.
Structure it as slide-by-slide content:
# {title}
## Slide 1: Title Slide (company name, tagline)
## Slide 2: The Problem (pain point, market gap)
## Slide 3: Our Solution (product, value prop)
## Slide 4: Market Opportunity (TAM/SAM/SOM)
## Slide 5: Business Model (revenue streams)
## Slide 6: Traction & Milestones
## Slide 7: Competitive Advantage (moat)
## Slide 8: Go-to-Market Strategy
## Slide 9: Financial Projections
## Slide 10: Team
## Slide 11: The Ask (funding, use of funds)

Make it compelling, concise, and investor-ready. Use bullet points, not paragraphs.`,

  architecture: `You are a senior software architect. Create a Technical Architecture document in Markdown format.
Include these sections:
# {title}
## 1. System Overview & Architecture Diagram (ASCII art)
## 2. Technology Stack (with justification)
## 3. Data Model & Database Design
## 4. API Design (REST/GraphQL endpoints)
## 5. Infrastructure & Deployment
## 6. Security Architecture
## 7. Scalability Considerations
## 8. Monitoring & Observability
## 9. Development Workflow & CI/CD

Include an ASCII architecture diagram. Be specific about technologies and patterns.`,

  code: `You are a senior software engineer. Generate production-ready starter code for the described project.
Provide:
1. Project structure (file tree)
2. Main entry point with core logic
3. Key configuration files
4. Package dependencies list
5. README with setup instructions

Write clean, well-commented code. Include error handling.`
};

async function generateContent(task, projectName) {
  const prompt = GENERATOR_PROMPTS[task.type];
  if (!prompt) throw new Error(`Unknown task type: ${task.type}`);
  
  const userMessage = `Project: ${projectName}\nTask: ${task.title}\nDetails: ${task.description}\n\nGenerate the content as specified.`;
  
  console.log(`[Agent] 📝 Generating: ${task.title} (${task.type})`);
  const content = await callLLM(prompt, userMessage, task.type === 'code' ? 'qwen-long-latest' : 'qwen3.7-plus');
  return content;
}

// ─── Execution Phase — Run all tasks ───────────────────────────
async function executePlan(plan, onProgress) {
  const results = [];
  
  for (let i = 0; i < plan.tasks.length; i++) {
    const task = plan.tasks[i];
    if (onProgress) {
      onProgress({
        phase: 'executing',
        current: i + 1,
        total: plan.tasks.length,
        task: task.title,
        type: task.type
      });
    }
    
    try {
      const content = await generateContent(task, plan.projectName);
      results.push({
        ...task,
        content,
        status: 'success'
      });
      console.log(`[Agent] ✅ ${task.title} generated (${content.length} chars)`);
    } catch (err) {
      console.error(`[Agent] ❌ ${task.title} failed: ${err.message}`);
      results.push({
        ...task,
        content: `Error: ${err.message}`,
        status: 'failed'
      });
    }
  }
  
  return results;
}

// ─── Complete Pipeline ────────────────────────────────────────
async function runAgent(projectDescription, onProgress) {
  // Phase 1: Plan
  if (onProgress) onProgress({ phase: 'planning' });
  const plan = await planProject(projectDescription);
  
  // Phase 2: Execute
  const results = await executePlan(plan, onProgress);
  
  // Phase 3: Summary
  if (onProgress) onProgress({ phase: 'complete', plan, results });
  
  return { plan, results };
}

module.exports = { runAgent, planProject, executePlan, generateContent };
