(function() {
  'use strict';

  const GameState = {
    completedLevels: [],
    currentLevel: 1,
    levelsData: [],
    isSubmitting: false
  };

  const DOMCache = {
    progressFill: null,
    progressText: null,
    progressPercentage: null,
    totalLevels: null,
    completedCount: null,
    remainingCount: null,
    levelSelector: null,
    levelContent: null
  };

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function cacheDOM() {
    DOMCache.progressFill = document.getElementById('progressFill');
    DOMCache.progressText = document.getElementById('progressText');
    DOMCache.progressPercentage = document.getElementById('progressPercentage');
    DOMCache.totalLevels = document.getElementById('totalLevels');
    DOMCache.completedCount = document.getElementById('completedCount');
    DOMCache.remainingCount = document.getElementById('remainingCount');
    DOMCache.levelSelector = document.getElementById('levelSelector');
    DOMCache.levelContent = document.getElementById('levelContent');
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

  function generateLevelButtons() {
    const selector = DOMCache.levelSelector;
    selector.innerHTML = '';
    
    GameState.levelsData.forEach(level => {
      const button = document.createElement('button');
      button.className = 'level-btn';
      button.dataset.level = level.id;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', 'false');
      button.setAttribute('aria-controls', 'levelContent');
      
      const levelNumber = document.createElement('span');
      levelNumber.className = 'level-number';
      levelNumber.textContent = level.id;
      
      const levelTitle = document.createElement('span');
      levelTitle.className = 'level-btn-title';
      levelTitle.textContent = level.title.split(':')[0];
      
      button.appendChild(levelNumber);
      button.appendChild(levelTitle);
      
      if (level.id === 1) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      } else if (!isLevelUnlocked(level.id)) {
        button.classList.add('locked');
        button.setAttribute('aria-disabled', 'true');
        button.setAttribute('tabindex', '-1');
      }
      
      selector.appendChild(button);
    });
  }

  function isLevelUnlocked(levelId) {
    return levelId === 1 || GameState.completedLevels.includes(levelId - 1);
  }

  function generateLevelContent() {
    const contentContainer = DOMCache.levelContent;
    contentContainer.innerHTML = '';
    
    GameState.levelsData.forEach(level => {
      const levelDiv = document.createElement('div');
      levelDiv.className = 'level-content';
      levelDiv.id = 'level' + level.id;
      levelDiv.setAttribute('role', 'tabpanel');
      levelDiv.setAttribute('aria-labelledby', 'level-btn-' + level.id);
      
      const objectivesList = level.objectives.map(obj => `<li>${escapeHtml(obj)}</li>`).join('');
      
      levelDiv.innerHTML = `
        <div class="level-header">
          <h2 class="level-title">${escapeHtml(level.title)}</h2>
          <p class="level-description">${escapeHtml(level.description)}</p>
        </div>
        
        <div class="learning-objectives">
          <h3>📚 学习目标</h3>
          <ul>${objectivesList}</ul>
        </div>
        
        <div class="code-example">
          <pre>${escapeHtml(level.example)}</pre>
        </div>
        
        <div class="challenge">
          <h3>🎯 挑战任务</h3>
          <p>${escapeHtml(level.challenge)}</p>
          ${level.hints && level.hints.length > 0 ? `
            <div class="hint-section">
              <button class="hint-toggle" data-level="${level.id}">💡 查看提示</button>
              <div class="hint-content" id="hint-${level.id}" style="display: none;">
                <ul>
                  ${level.hints.map(hint => `<li>${escapeHtml(hint)}</li>`).join('')}
                </ul>
              </div>
            </div>
          ` : ''}
          <textarea 
            class="challenge-input" 
            id="level${level.id}Input" 
            rows="6" 
            placeholder="在这里输入你的Python代码..."
            spellcheck="false"
          ></textarea>
          <button class="submit-btn" data-level-id="${level.id}">
            <span class="btn-text">提交答案</span>
            <span class="btn-loader" style="display: none;"></span>
          </button>
          <div class="feedback" id="level${level.id}Feedback"></div>
        </div>
      `;
      
      contentContainer.appendChild(levelDiv);
    });
    
    initHintToggles();
  }

  function initHintToggles() {
    document.querySelectorAll('.hint-toggle').forEach(button => {
      button.addEventListener('click', function() {
        const levelId = this.dataset.level;
        const hintContent = document.getElementById('hint-' + levelId);
        const isVisible = hintContent.style.display !== 'none';
        
        hintContent.style.display = isVisible ? 'none' : 'block';
        this.textContent = isVisible ? '💡 查看提示' : '🙈 隐藏提示';
      });
    });
  }

  function initLevelSelector() {
    DOMCache.levelSelector.addEventListener('click', function(e) {
      const button = e.target.closest('.level-btn');
      if (!button || button.classList.contains('locked')) return;
      
      const level = parseInt(button.dataset.level);
      switchLevel(level);
    });

    DOMCache.levelSelector.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const buttons = Array.from(this.querySelectorAll('.level-btn:not(.locked)'));
        const currentIndex = buttons.findIndex(btn => btn.classList.contains('active'));
        let newIndex;
        
        if (e.key === 'ArrowRight') {
          newIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        } else {
          newIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        }
        
        buttons[newIndex].click();
        buttons[newIndex].focus();
      }
    });
  }

  function initSubmitButtons() {
    DOMCache.levelContent.addEventListener('click', function(e) {
      if (e.target.classList.contains('submit-btn') && !GameState.isSubmitting) {
        const levelId = parseInt(e.target.dataset.levelId);
        checkLevel(levelId);
      }
    });

    DOMCache.levelContent.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.ctrlKey) {
        const textarea = e.target.closest('.challenge')?.querySelector('.challenge-input');
        if (textarea) {
          const levelId = parseInt(textarea.id.replace('level', '').replace('Input', ''));
          if (!GameState.isSubmitting) {
            checkLevel(levelId);
          }
        }
      }
    });
  }

  function switchLevel(level) {
    document.querySelectorAll('.level-content').forEach(content => {
      content.classList.remove('active');
    });
    
    const currentLevelDiv = document.getElementById('level' + level);
    if (currentLevelDiv) {
      currentLevelDiv.classList.add('active');
      currentLevelDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    document.querySelectorAll('.level-btn').forEach(button => {
      const btnLevel = parseInt(button.dataset.level);
      button.classList.remove('active');
      button.setAttribute('aria-selected', 'false');
      
      if (btnLevel === level) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      } else if (!isLevelUnlocked(btnLevel)) {
        button.classList.add('locked');
        button.setAttribute('aria-disabled', 'true');
        button.setAttribute('tabindex', '-1');
      }
    });
    
    GameState.currentLevel = level;
    
    const textarea = document.getElementById('level' + level + 'Input');
    if (textarea) {
      textarea.focus();
    }
  }

  function completeLevel(level) {
    if (!GameState.completedLevels.includes(level)) {
      GameState.completedLevels.push(level);
      GameState.completedLevels.sort((a, b) => a - b);
      updateProgress();
      
      const nextLevelBtn = document.querySelector('.level-btn[data-level="' + (level + 1) + '"]');
      if (nextLevelBtn) {
        nextLevelBtn.classList.remove('locked');
        nextLevelBtn.removeAttribute('aria-disabled');
        nextLevelBtn.removeAttribute('tabindex');
        nextLevelBtn.classList.add('unlocked');
      }
      
      const currentButton = document.querySelector('.level-btn[data-level="' + level + '"]');
      if (currentButton) {
        currentButton.classList.add('completed');
      }
    }
  }

  function checkLevel(levelId) {
    if (GameState.isSubmitting) return;
    
    const levelData = GameState.levelsData.find(l => l.id === levelId);
    if (!levelData || !levelData.validation) return;
    
    const input = document.getElementById('level' + levelId + 'Input').value;
    const feedback = document.getElementById('level' + levelId + 'Feedback');
    const submitBtn = document.querySelector('.submit-btn[data-level-id="' + levelId + '"]');
    
    if (!input.trim()) {
      showFeedback(feedback, 'error', '请输入你的代码后再提交！');
      shakeElement(document.getElementById('level' + levelId + 'Input'));
      return;
    }
    
    GameState.isSubmitting = true;
    setButtonLoading(submitBtn, true);
    
    setTimeout(() => {
      const validation = levelData.validation;
      const requiredKeywords = validation.requiredKeywords;
      const matchAll = validation.matchAll !== false;
      
      let isValid;
      if (matchAll) {
        isValid = requiredKeywords.every(keyword => input.includes(keyword));
      } else {
        isValid = requiredKeywords.some(keyword => input.includes(keyword));
      }
      
      if (isValid) {
        showFeedback(feedback, 'success', validation.successFeedback);
        completeLevel(levelId);
        
        if (levelId < GameState.levelsData.length) {
          setTimeout(() => {
            switchLevel(levelId + 1);
          }, 1500);
        }
      } else {
        showFeedback(feedback, 'error', validation.errorFeedback);
        shakeElement(feedback);
      }
      
      GameState.isSubmitting = false;
      setButtonLoading(submitBtn, false);
    }, 800);
  }

  function setButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (isLoading) {
      button.disabled = true;
      btnText.textContent = '检查中...';
      btnLoader.style.display = 'inline-block';
    } else {
      button.disabled = false;
      btnText.textContent = '提交答案';
      btnLoader.style.display = 'none';
    }
  }

  function showFeedback(element, type, message) {
    element.className = 'feedback ' + type;
    element.textContent = message;
    element.style.display = 'block';
    
    if (type === 'error') {
      setTimeout(() => {
        if (element.classList.contains('error')) {
          element.style.display = 'none';
        }
      }, 5000);
    }
  }

  function shakeElement(element) {
    element.style.animation = 'none';
    element.offsetHeight;
    element.style.animation = 'shake 0.4s ease-in-out';
  }

  function initGame() {
    generateLevelButtons();
    generateLevelContent();
    initLevelSelector();
    initSubmitButtons();
    updateProgress();
    switchLevel(1);
  }

  async function loadLevelsData() {
    try {
      const response = await fetch('data/levels.json');
      if (!response.ok) {
        throw new Error('Failed to load levels data');
      }
      
      const data = await response.json();
      GameState.levelsData = data.levels;
      
      cacheDOM();
      initGame();
    } catch (error) {
      console.error('Error loading levels data:', error);
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
