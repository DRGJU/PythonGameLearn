// 直接在页面加载时执行，不需要等待DOMContentLoaded
console.log('🔹 脚本开始执行');

// 创建调试日志元素
const debugLog = document.createElement('div');
debugLog.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  max-height: 300px;
  overflow-y: auto;
  background: rgba(0,0,0,0.9);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  border: 1px solid #00d4ff;
`;
document.body.appendChild(debugLog);

function log(msg, type = 'info') {
  const colors = {
    info: '#00d4ff',
    success: '#10b981',
    error: '#ef4444',
    warn: '#f59e0b'
  };
  const p = document.createElement('p');
  p.style.color = colors[type] || colors.info;
  p.textContent = msg;
  debugLog.appendChild(p);
  console.log(msg);
}

log('=== 脚本开始执行 ===', 'info');

// 检查DOM
log('检查DOM元素...', 'info');
const levelContent = document.getElementById('levelContent');
log(`levelContent: ${levelContent ? '✅ 存在' : '❌ 不存在'}`, levelContent ? 'success' : 'error');

// 尝试加载数据
log('尝试加载关卡数据...', 'info');

fetch('data/levels.json')
  .then(response => {
    log(`HTTP状态: ${response.status}`, response.ok ? 'success' : 'error');
    return response.json();
  })
  .then(data => {
    log(`数据加载成功，共 ${data.levels.length} 个关卡`, 'success');
    log(`关卡1标题: ${data.levels[0].title}`, 'success');
    
    // 生成关卡内容
    const level = data.levels[0];
    const content = `
      <div class="level-content active">
        <div class="level-header">
          <div class="level-phase-badge">${level.phaseName}</div>
          <h2 class="level-title">${level.title}</h2>
          <p class="level-description">${level.description}</p>
        </div>
        <div class="learning-objectives">
          <h3>📚 学习目标</h3>
          <ul>${level.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>
        </div>
        <div class="code-example">
          <pre>${level.example}</pre>
        </div>
        <div class="challenge">
          <h3>🎯 挑战任务</h3>
          <p>${level.challenge}</p>
        </div>
      </div>
    `;
    
    if (levelContent) {
      levelContent.innerHTML = content;
      log('✅ 关卡内容已更新到页面', 'success');
    } else {
      log('❌ 无法更新页面，容器不存在', 'error');
    }
  })
  .catch(error => {
    log(`❌ 加载失败: ${error.message}`, 'error');
  });