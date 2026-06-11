/**
 * Project Butler — Frontend Application
 * Interactive demo with real-time progress visualization
 * 
 * Built with GitHub Copilot for:
 * - Async state management patterns
 * - Progress streaming UI design
 * - File download handling
 */

const examples = [
  '我要做一个宠物社交App，帮助宠物主人互相认识和组织遛狗活动，下周要见投资人',
  '我要做一个AI驱动的在线教育平台，用短视频+AI助教帮助职场人学习新技能，目标是拿天使轮融资',
  '我要做一个跨境电商SaaS工具，帮助中国卖家一键管理亚马逊、TikTok Shop和Temu的多平台库存和定价'
];

const typeIcons = {
  prd: '📄', analysis: '📊', finance: '💰',
  pitch: '🎯', architecture: '🏗️', code: '💻'
};

const typeColors = {
  prd: '#6C8CFF', analysis: '#FFB347', finance: '#00D4AA',
  pitch: '#FF6B6B', architecture: '#A78BFA', code: '#F472B6'
};

function fillExample(idx) {
  document.getElementById('projectInput').value = examples[idx];
  document.getElementById('projectInput').focus();
}

document.getElementById('runBtn').addEventListener('click', runAgent);
document.getElementById('projectInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) runAgent();
});

async function runAgent() {
  const input = document.getElementById('projectInput').value.trim();
  if (input.length < 10) {
    showError('Please provide a more detailed project description (at least 10 characters).');
    return;
  }

  const btn = document.getElementById('runBtn');
  const progressArea = document.getElementById('progressArea');
  const resultsArea = document.getElementById('resultsArea');
  const errorArea = document.getElementById('errorArea');
  const progressLog = document.getElementById('progressLog');

  // Reset state
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner"></div> Running...';
  errorArea.classList.add('hidden');
  resultsArea.classList.add('hidden');
  progressArea.classList.remove('hidden');
  progressLog.innerHTML = '';
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('phaseLabel').textContent = 'Submitting...';
  document.getElementById('taskCount').textContent = '';

  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: input })
    });

    // Stream progress via polling the raw output display
    // Since we're running sync, we show progress after completion
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.details || 'Unknown error');
    }

    // Parse the raw output to reconstruct progress timeline
    const lines = (data.rawOutput || '').split('\n');
    reconstructProgress(lines);

    // Display results
    displayResults(data);

  } catch (err) {
    showError(err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">🚀</span> Generate Project Docs';
  }
}

function reconstructProgress(lines) {
  const progressLog = document.getElementById('progressLog');
  const progressBar = document.getElementById('progressBar');
  
  let taskTotal = 0;
  let taskCurrent = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let cls = 'log-exec';
    if (trimmed.includes('Planning') || trimmed.includes('Analyzing') || trimmed.includes('🧠')) {
      cls = 'log-planning';
      document.getElementById('phaseLabel').textContent = '🧠 Planning & Analysis';
    } else if (trimmed.includes('✅')) {
      cls = 'log-success';
      taskCurrent++;
      if (taskTotal > 0) {
        progressBar.style.width = `${(taskCurrent / taskTotal) * 100}%`;
      }
    } else if (trimmed.includes('❌') || trimmed.includes('failed')) {
      cls = 'log-error';
    } else if (trimmed.includes('Task')) {
      const match = trimmed.match(/Task\s+(\d+)\/(\d+)/);
      if (match) {
        taskCurrent = parseInt(match[1]) - 1;
        taskTotal = parseInt(match[2]);
        document.getElementById('taskCount').textContent = `${parseInt(match[1])}/${taskTotal} tasks`;
        document.getElementById('phaseLabel').textContent = '⚙️ Executing Tasks';
        if (taskTotal > 0) {
          progressBar.style.width = `${((taskCurrent) / taskTotal) * 100}%`;
        }
      }
    }

    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      const div = document.createElement('div');
      div.className = cls;
      div.textContent = trimmed.substring(0, 160);
      progressLog.appendChild(div);
      progressLog.scrollTop = progressLog.scrollHeight;
    }
  }

  // Final state
  document.getElementById('phaseLabel').textContent = '✅ Complete!';
  document.getElementById('taskCount').textContent = `${taskTotal} tasks completed`;
  progressBar.style.width = '100%';
}

function displayResults(data) {
  const resultsArea = document.getElementById('resultsArea');
  const resultsGrid = document.getElementById('resultsGrid');
  const resultsSummary = document.getElementById('resultsSummary');

  resultsArea.classList.remove('hidden');
  resultsGrid.innerHTML = '';

  if (!data.files || data.files.length === 0) {
    resultsSummary.textContent = 'No files were generated.';
    return;
  }

  resultsSummary.textContent = `${data.files.length} files • ${data.elapsedSeconds || '?'}s`;

  for (const file of data.files) {
    // Determine file type from name
    let ft = 'doc';
    if (file.name.endsWith('.pptx')) ft = 'ppt';
    else if (file.name.endsWith('.xlsx')) ft = 'xlsx';
    else if (file.name.endsWith('.docx')) ft = 'docx';
    else if (file.name.endsWith('.zip')) ft = 'zip';
    else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) ft = 'code';

    const typeLabels = {
      ppt: 'PowerPoint', pptx: 'PowerPoint', docx: 'Word',
      xlsx: 'Excel', zip: 'ZIP Archive', txt: 'Text', md: 'Markdown',
      code: 'Code', doc: 'Document'
    };

    const typeColors = {
      ppt: '#FF6B6B', pptx: '#FF6B6B', docx: '#6C8CFF',
      xlsx: '#00D4AA', zip: '#A78BFA', txt: '#F472B6',
      md: '#F472B6', code: '#F472B6', doc: '#6C8CFF'
    };

    const typeIcons = {
      ppt: '📊', pptx: '📊', docx: '📄',
      xlsx: '📈', zip: '📦', txt: '📝',
      md: '📝', code: '💻', doc: '📄'
    };

    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <div class="result-icon" style="background: ${typeColors[ft] || '#2A3045'}20">
        ${typeIcons[ft] || '📁'}
      </div>
      <div class="result-info">
        <div class="result-name">${file.name}</div>
        <div class="result-meta">${(file.size / 1024).toFixed(1)} KB</div>
        <span class="result-type" style="color: ${typeColors[ft] || '#8A8F9A'}">
          .${typeLabels[ft] || ft}
        </span>
      </div>
      <a href="outputs/${encodeURIComponent(file.name)}" class="result-download" download>
        Download
      </a>
    `;
    resultsGrid.appendChild(card);
  }

  // Scroll to results
  resultsArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError(msg) {
  const errorArea = document.getElementById('errorArea');
  errorArea.classList.remove('hidden');
  errorArea.innerHTML = `<strong>⚠️ Error:</strong> ${msg}`;
  errorArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function downloadFile(filepath) {
  const a = document.createElement('a');
  a.href = filepath;
  a.download = filepath.split('/').pop();
  a.click();
}
