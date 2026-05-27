(function() {
  'use strict';

  const GameState = {
    levelsData: []
  };

  async function loadLevelsData() {
    console.log('📥 开始加载关卡数据...');
    
    try {
      const response = await fetch('data/levels.json');
      console.log('📡 HTTP响应:', response.status);
      
      if (!response.ok) {
        throw new Error('加载失败');
      }
      
      const data = await response.json();
      GameState.levelsData = data.levels;
      console.log('✅ 关卡数据加载成功:', GameState.levelsData.length, '个关卡');
      
      generateLevelContent();
    } catch (error) {
      console.error('❌ 加载失败:', error.message);
    }
  }

  function generateLevelContent() {
    const container = document.getElementById('levelContent');
    console.log('📦 容器元素:', container);
    
    if (!container) {
      console.error('❌ 容器不存在');
      return;
    }

    if (GameState.levelsData.length === 0) {
      container.innerHTML = '<p style="color: red;">没有关卡数据</p>';
      return;
    }

    const level = GameState.levelsData[0];
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

    container.innerHTML = content;
    console.log('✅ 关卡内容生成完成');
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLevelsData);
  } else {
    loadLevelsData();
  }
})();