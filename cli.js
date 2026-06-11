#!/usr/bin/env node
/**
 * Project Butler — CLI Entry Point
 * 
 * Usage: node cli.js "我要做一个宠物社交App"
 * 
 * Built with GitHub Copilot assistance for:
 * - Async pipeline orchestration
 * - Error boundary patterns
 * - File system operations
 */

const { runAgent } = require('./agent.js');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const archiverModule = require('archiver');
const archiver = (format, opts) => new archiverModule.Archiver(format, opts);

const PYTHON = 'C:/Users/Administrator/.workbuddy/binaries/python/envs/default/Scripts/python.exe';
const CONVERT_SCRIPT = path.join(__dirname, 'convert.py');
const OUTPUT_DIR = path.join(__dirname, 'outputs');

// Ensure output directory
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ─── File Type Mapping ────────────────────────────────────────
const FILE_CONFIG = {
  prd: { ext: 'docx', convertType: 'word', cleanName: 'PRD_产品需求文档' },
  analysis: { ext: 'pptx', convertType: 'ppt', cleanName: '竞品分析报告' },
  finance: { ext: 'xlsx', convertType: 'excel', cleanName: '财务预测模型' },
  pitch: { ext: 'pptx', convertType: 'ppt', cleanName: '投资人路演PPT' },
  architecture: { ext: 'docx', convertType: 'word', cleanName: '技术架构文档' },
  code: { ext: 'txt', convertType: null, cleanName: '项目代码' }
};

// ─── Convert Markdown to Office File ──────────────────────────
function convertToFile(content, taskType, projectName) {
  const config = FILE_CONFIG[taskType];
  if (!config || !config.convertType) {
    // For code type, save as text file
    const filename = `${config?.cleanName || taskType}.txt`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, content, 'utf-8');
    return { path: filepath, name: filename, size: fs.statSync(filepath).size };
  }
  
  const timestamp = Date.now();
  const mdFile = path.join(OUTPUT_DIR, `_temp_${timestamp}.md`);
  fs.writeFileSync(mdFile, content, 'utf-8');
  
  const filename = `${config.cleanName}_${projectName.slice(0, 10)}.${config.ext}`;
  const outputPath = path.join(OUTPUT_DIR, filename);
  
  try {
    const cmd = `"${PYTHON}" "${CONVERT_SCRIPT}" "${mdFile}" "${outputPath}" ${config.convertType}`;
    execSync(cmd, { timeout: 120000, stdio: 'pipe' });
    fs.unlinkSync(mdFile); // Cleanup temp
    
    if (fs.existsSync(outputPath)) {
      return { path: outputPath, name: filename, size: fs.statSync(outputPath).size };
    }
  } catch (err) {
    console.error(`[CLI] Conversion warning for ${filename}:`, err.message);
  }
  
  // Fallback: save as markdown
  const fallbackPath = outputPath.replace(new RegExp(`\\.${config.ext}$`), '.md');
  fs.writeFileSync(fallbackPath, content, 'utf-8');
  return { path: fallbackPath, name: path.basename(fallbackPath), size: fs.statSync(fallbackPath).size };
}

// ─── Package All Outputs into ZIP ─────────────────────────────
async function packageOutputs(projectName, files) {
  return new Promise((resolve, reject) => {
    const zipName = `${projectName.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '_')}_交付包.zip`;
    const zipPath = path.join(OUTPUT_DIR, zipName);
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => resolve({ path: zipPath, name: zipName, size: archive.pointer() }));
    archive.on('error', reject);
    archive.pipe(output);
    
    for (const file of files) {
      if (fs.existsSync(file.path)) {
        archive.file(file.path, { name: file.name });
      }
    }
    
    archive.finalize();
  });
}

// ─── Main Pipeline ─────────────────────────────────────────────
async function main() {
  const projectDescription = process.argv.slice(2).join(' ');
  if (!projectDescription) {
    console.error('Usage: node cli.js "project description"');
    console.error('Example: node cli.js "我要做一个宠物社交App，下周见投资人"');
    process.exit(1);
  }
  
  console.log(`\n🚀 Project Butler Agent Starting...`);
  console.log(`📋 Project: ${projectDescription}\n`);
  
  const startTime = Date.now();
  const generatedFiles = [];
  
  // Run the agent
  const result = await runAgent(projectDescription, (progress) => {
    if (progress.phase === 'planning') {
      console.log('[🧠] Analyzing requirements and planning tasks...\n');
    } else if (progress.phase === 'executing') {
      console.log(`[📝] Task ${progress.current}/${progress.total}: ${progress.task}`);
    } else if (progress.phase === 'complete') {
      console.log(`\n[✅] All ${progress.results.length} tasks completed!\n`);
    }
  });
  
  // Convert each result to Office files
  console.log('[🔄] Converting to Office files...\n');
  for (const task of result.results) {
    if (task.status === 'success') {
      const fileInfo = convertToFile(task.content, task.type, result.plan.projectName);
      generatedFiles.push(fileInfo);
      console.log(`  ✅ ${fileInfo.name} (${(fileInfo.size / 1024).toFixed(1)}KB)`);
    }
  }
  
  // Package all files
  console.log('\n[📦] Packaging all deliverables...');
  const zip = await packageOutputs(result.plan.projectName, generatedFiles);
  console.log(`  ✅ ${zip.name} (${(zip.size / 1024).toFixed(1)}KB)`);
  
  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 Project Butler Complete!`);
  console.log(`📊 ${generatedFiles.length} files generated in ${elapsed}s`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log(`📦 Package: ${zip.path}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  
  // Output JSON summary for API consumers
  const summary = {
    projectName: result.plan.projectName,
    summary: result.plan.summary,
    totalTasks: result.results.length,
    elapsedSeconds: parseInt(elapsed),
    files: generatedFiles.map(f => ({ name: f.name, size: f.size })),
    zip: { name: zip.name, path: zip.path, size: zip.size }
  };
  
  console.log(JSON.stringify(summary, null, 2));
  
  process.exit(0);
}

main().catch(err => {
  console.error('[❌] Agent failed:', err.message);
  process.exit(1);
});
