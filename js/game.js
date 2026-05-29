(function() {
  'use strict';

  const GameState = {
    completedLevels: loadCompletedLevels(),
    currentLevel: 1,
    currentPhase: 1,
    levelsData: []
  };

  function loadCompletedLevels() {
    try {
      const saved = localStorage.getItem('pythonGameCompletedLevels');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('加载进度失败:', error);
      return [];
    }
  }

  const DOMCache = {
    progressFill: null,
    progressText: null,
    progressPercentage: null,
    totalLevels: null,
    completedCount: null,
    remainingCount: null,
    levelSelector: null,
    phaseTabs: null
  };

  const phases = [
    { id: 1, name: '新手村', icon: '🏠', levels: [1, 2, 3, 4, 5] },
    { id: 2, name: '冒险启程', icon: '⚔️', levels: [6, 7, 8, 9, 10] },
    { id: 3, name: '技能进阶', icon: '🛡️', levels: [11, 12, 13, 14, 15] },
    { id: 4, name: '挑战大师', icon: '🏆', levels: [16, 17, 18, 19, 20] },
    { id: 5, name: '探索者', icon: '🔍', levels: [21, 22, 23, 24, 25] },
    { id: 6, name: '大师之路', icon: '👑', levels: [26, 27, 28, 29, 30] }
  ];

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function updateProgress() {
    const totalLevels = GameState.levelsData.length;
    const completedCount = GameState.completedLevels.length;
    const progress = totalLevels > 0 ? (completedCount / totalLevels) * 100 : 0;
    const roundedProgress = Math.round(progress);

    DOMCache.progressFill.style.width = roundedProgress + '%';
    DOMCache.progressText.textContent = `完成 ${completedCount} / ${totalLevels} 个关卡`;
    DOMCache.progressPercentage.textContent = roundedProgress + '%';
    
    DOMCache.totalLevels.textContent = totalLevels;
    DOMCache.completedCount.textContent = completedCount;
    DOMCache.remainingCount.textContent = totalLevels - completedCount;

    if (roundedProgress === 100) {
      DOMCache.progressFill.parentElement.classList.add('completed');
      showCelebration();
    } else {
      DOMCache.progressFill.parentElement.classList.remove('completed');
    }
  }

  function showCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-icon">🎉</div>
        <h3>恭喜完成所有关卡！</h3>
        <p>你已经掌握了Python编程的基础知识</p>
      </div>
    `;
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      celebration.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      celebration.classList.remove('show');
      setTimeout(() => celebration.remove(), 300);
    }, 3000);
  }

  function showPhaseCelebration(phaseName) {
    const celebration = document.createElement('div');
    celebration.className = 'celebration phase-celebration';
    celebration.innerHTML = `
      <div class="celebration-content">
        <div class="celebration-icon">🎊</div>
        <h3>恭喜完成「${phaseName}」阶段！</h3>
        <p>准备好迎接新的挑战了吗？</p>
      </div>
    `;
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      celebration.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      celebration.classList.remove('show');
      setTimeout(() => celebration.remove(), 2500);
    }, 2500);
  }

  function isPhaseUnlocked(phaseId) {
    if (phaseId === 1) return true;
    const previousPhase = phases.find(p => p.id === phaseId - 1);
    if (!previousPhase) return false;
    return previousPhase.levels.every(levelId => GameState.completedLevels.includes(levelId));
  }

  function isPhaseCompleted(phaseId) {
    const phase = phases.find(p => p.id === phaseId);
    if (!phase) return false;
    return phase.levels.every(levelId => GameState.completedLevels.includes(levelId));
  }

  function updatePhaseTabs() {
    const tabs = DOMCache.phaseTabs.querySelectorAll('.phase-tab');
    tabs.forEach(tab => {
      const phaseId = parseInt(tab.dataset.phase);
      tab.classList.remove('active', 'locked', 'completed');
      tab.setAttribute('aria-selected', 'false');
      
      if (phaseId === GameState.currentPhase) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else if (!isPhaseUnlocked(phaseId)) {
        tab.classList.add('locked');
        tab.setAttribute('aria-disabled', 'true');
      } else if (isPhaseCompleted(phaseId)) {
        tab.classList.add('completed');
      }
    });
  }

  function generateLevelButtons() {
    const selector = DOMCache.levelSelector;
    selector.innerHTML = '';
    
    const currentPhaseData = phases.find(p => p.id === GameState.currentPhase);
    if (!currentPhaseData) return;
    
    const phaseLevels = GameState.levelsData.filter(level => currentPhaseData.levels.includes(level.id));
    
    phaseLevels.forEach(level => {
      const link = document.createElement('a');
      link.className = 'level-btn';
      link.dataset.level = level.id;
      
      if (isLevelUnlocked(level.id)) {
        link.href = `level.html?level=${level.id}`;
      }
      
      const levelNumber = document.createElement('span');
      levelNumber.className = 'level-number';
      levelNumber.textContent = level.id;
      
      const levelTitle = document.createElement('span');
      levelTitle.className = 'level-btn-title';
      levelTitle.textContent = level.title.split(':')[0];
      
      link.appendChild(levelNumber);
      link.appendChild(levelTitle);
      
      if (!isLevelUnlocked(level.id)) {
        link.classList.add('locked');
      }
      
      if (GameState.completedLevels.includes(level.id)) {
        link.classList.add('completed');
      }
      
      if (level.isMiniProject) {
        link.classList.add('mini-project');
      }
      
      selector.appendChild(link);
    });
  }

  function isLevelUnlocked(levelId) {
    return levelId === 1 || GameState.completedLevels.includes(levelId - 1);
  }

  function initPhaseTabs() {
    DOMCache.phaseTabs.addEventListener('click', function(e) {
      const tab = e.target.closest('.phase-tab');
      if (!tab || tab.classList.contains('locked')) return;
      
      const phaseId = parseInt(tab.dataset.phase);
      switchPhase(phaseId);
    });
  }

  function initLevelSelector() {
    // 现在用超链接，不需要额外的点击事件处理了
  }

  function switchPhase(phaseId) {
    GameState.currentPhase = phaseId;
    updatePhaseTabs();
    generateLevelButtons();
    
    const currentPhaseData = phases.find(p => p.id === phaseId);
    if (currentPhaseData && !currentPhaseData.levels.includes(GameState.currentLevel)) {
      const firstLevel = currentPhaseData.levels.find(l => isLevelUnlocked(l)) || currentPhaseData.levels[0];
      selectLevel(firstLevel);
    }
  }

  function selectLevel(level) {
    console.log('🎯 选择了关卡:', level);
    // 跳转到关卡详情页面
    window.location.href = `level.html?level=${level}`;
  }

  function initGame() {
    console.log('🎮 初始化关卡选择器');
    
    cacheDOM();
    generateLevelButtons();
    initPhaseTabs();
    initLevelSelector();
    updateProgress();
    updatePhaseTabs();
    
    console.log('✅ 关卡选择器初始化完成');
  }

  function cacheDOM() {
    DOMCache.progressFill = document.getElementById('progressFill');
    DOMCache.progressText = document.getElementById('progressText');
    DOMCache.progressPercentage = document.getElementById('progressPercentage');
    DOMCache.totalLevels = document.getElementById('totalLevels');
    DOMCache.completedCount = document.getElementById('completedCount');
    DOMCache.remainingCount = document.getElementById('remainingCount');
    DOMCache.levelSelector = document.getElementById('levelSelector');
    DOMCache.phaseTabs = document.getElementById('phaseTabs');
  }

  async function loadLevelsData() {
    try {
      const response = await fetch('data/levels.json');
      if (!response.ok) {
        throw new Error('Failed to load levels data');
      }
      
      const data = await response.json();
      GameState.levelsData = data.levels;
      console.log('✅ 关卡数据加载成功:', GameState.levelsData.length, '个关卡');
      
      initGame();
    } catch (error) {
      console.error('❌ Error loading levels data:', error);
      showGlobalError('加载关卡数据失败，请刷新页面重试');
    }
  }

  function showGlobalError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'global-error';
    errorDiv.innerHTML = `
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h3>出错了</h3>
        <p>${message}</p>
        <button onclick="location.reload()">刷新页面</button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLevelsData);
  } else {
    loadLevelsData();
  }
})();
