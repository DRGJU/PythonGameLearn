(function() {
  'use strict';

  const GameState = {
    completedLevels: [],
    currentLevel: 1,
    currentPhase: 1,
    levelsData: [],
    isSubmitting: false,
    currentMode: 'code',
    modeStates: {}
  };

  const DOMCache = {
    progressFill: null,
    progressText: null,
    progressPercentage: null,
    totalLevels: null,
    completedCount: null,
    remainingCount: null,
    levelSelector: null,
    levelContent: null,
    phaseTabs: null
  };

  const ModeConfig = {
    code: { label: '自由代码', icon: '💻' },
    drag: { label: '拖放编程', icon: '🧩' },
    choice: { label: '选择题', icon: '📋' },
    fill: { label: '填空', icon: '✏️' },
    guided: { label: '智能引导', icon: '🚀' }
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
      setTimeout(() => celebration.remove(), 300);
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
      
      if (level.id === GameState.currentLevel) {
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
      } else if (!isLevelUnlocked(level.id)) {
        button.classList.add('locked');
        button.setAttribute('aria-disabled', 'true');
        button.setAttribute('tabindex', '-1');
      }
      
      if (GameState.completedLevels.includes(level.id)) {
        button.classList.add('completed');
      }
      
      if (level.isMiniProject) {
        button.classList.add('mini-project');
      }
      
      selector.appendChild(button);
    });
  }

  function isLevelUnlocked(levelId) {
    return levelId === 1 || GameState.completedLevels.includes(levelId - 1);
  }

  function generateModeTabs(level) {
    const availableModes = level.questionTypes || ['code'];
    let tabsHtml = '<div class="mode-tabs" role="tablist" aria-label="答题模式选择">';
    
    Object.keys(ModeConfig).forEach(modeKey => {
      const mode = ModeConfig[modeKey];
      const isActive = modeKey === (level.defaultType || 'code');
      const isDisabled = !availableModes.includes(modeKey);
      
      tabsHtml += `
        <button class="mode-tab ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}" 
                data-mode="${modeKey}" 
                role="tab" 
                aria-selected="${isActive}"
                ${isDisabled ? 'disabled aria-disabled="true"' : ''}>
          <span class="mode-icon">${mode.icon}</span>
          <span class="mode-label">${mode.label}</span>
        </button>
      `;
    });
    
    tabsHtml += '</div>';
    return tabsHtml;
  }

  function generateCodeMode(level) {
    return `
      <div class="mode-content active" data-mode="code">
        <textarea 
          class="challenge-input" 
          id="level${level.id}CodeInput" 
          rows="6" 
          placeholder="在这里输入你的Python代码..."
          spellcheck="false"
        ></textarea>
        <button class="submit-btn" data-level-id="${level.id}" data-mode="code">
          <span class="btn-text">提交答案</span>
          <span class="btn-loader" style="display: none;"></span>
        </button>
        <div class="feedback" id="level${level.id}CodeFeedback"></div>
      </div>
    `;
  }

  function generateDragMode(level) {
    if (!level.codeBlocks) return '';
    
    const availableBlocks = level.codeBlocks.available || [];
    const levelId = level.id;
    
    return `
      <div class="mode-content" data-mode="drag">
        <div class="drag-container">
          <div class="drag-palette">
            <h4>🧱 可用代码块</h4>
            <div class="drag-blocks" id="level${levelId}DragPalette">
              ${availableBlocks.map((block, idx) => `
                <div class="code-block" draggable="true" data-block="${idx}" data-code="${escapeHtml(block)}">
                  ${escapeHtml(block)}
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="drop-zone" id="level${levelId}DropZone">
            <h4>📝 代码区域</h4>
            <div class="drop-zone-empty" id="level${levelId}DropEmpty">
              <span>🎯</span>
              将代码块拖放到这里
            </div>
            <div class="dropped-blocks" id="level${levelId}DroppedBlocks"></div>
          </div>
          
          <div class="drag-actions">
            <button class="reset-btn" id="level${levelId}ResetDrag">🔄 重置</button>
            <button class="submit-btn" data-level-id="${levelId}" data-mode="drag">
              <span class="btn-text">提交答案</span>
              <span class="btn-loader" style="display: none;"></span>
            </button>
          </div>
          
          <div class="feedback" id="level${levelId}DragFeedback"></div>
        </div>
      </div>
    `;
  }

  function generateChoiceMode(level) {
    if (!level.choices) return '';
    
    const levelId = level.id;
    const options = level.choices.options || [];
    
    return `
      <div class="mode-content" data-mode="choice">
        <div class="choice-container">
          <div class="choice-question">
            <p>${escapeHtml(level.choices.question)}</p>
          </div>
          
          <div class="choice-options" id="level${levelId}ChoiceOptions">
            ${options.map((opt, idx) => `
              <div class="choice-option" data-idx="${idx}" data-correct="${opt.correct}">
                <span class="choice-indicator"></span>
                <span class="choice-text">${escapeHtml(opt.text)}</span>
              </div>
            `).join('')}
          </div>
          
          <div class="choice-feedback" id="level${levelId}ChoiceFeedback"></div>
          
          <button class="submit-btn" data-level-id="${levelId}" data-mode="choice" style="margin-top: 16px;">
            <span class="btn-text">提交答案</span>
            <span class="btn-loader" style="display: none;"></span>
          </button>
          
          <div class="feedback" id="level${levelId}ChoiceFinalFeedback"></div>
        </div>
      </div>
    `;
  }

  function generateFillMode(level) {
    if (!level.fillBlanks) return '';
    
    const levelId = level.id;
    const template = level.fillBlanks.template || '';
    const blanks = level.fillBlanks.blanks || [];
    
    let fillCodeHtml = template;
    blanks.forEach((blank, idx) => {
      fillCodeHtml = fillCodeHtml.replace('___', `
        <span class="fill-blank" data-blank-id="${blank.id || idx}" data-answer="${escapeHtml(blank.answer)}">
          ???
        </span>
      `);
    });
    
    const allOptions = [...new Set(blanks.flatMap(b => b.options || []))];
    
    return `
      <div class="mode-content" data-mode="fill">
        <div class="fill-container">
          <div class="fill-instructions">
            💡 点击一个空格，然后从下方选择正确的答案
          </div>
          
          <div class="fill-code-container">
            <div class="fill-code" id="level${levelId}FillCode">
              ${fillCodeHtml}
            </div>
          </div>
          
          <div class="fill-options" id="level${levelId}FillOptions">
            ${allOptions.map(opt => `
              <div class="fill-option" data-option="${escapeHtml(opt)}">
                ${escapeHtml(opt)}
              </div>
            `).join('')}
          </div>
          
          <div class="drag-actions">
            <button class="reset-btn" id="level${levelId}ResetFill">🔄 重置</button>
            <button class="submit-btn" data-level-id="${levelId}" data-mode="fill">
              <span class="btn-text">提交答案</span>
              <span class="btn-loader" style="display: none;"></span>
            </button>
          </div>
          
          <div class="feedback" id="level${levelId}FillFeedback"></div>
        </div>
      </div>
    `;
  }

  function generateGuidedMode(level) {
    if (!level.guidedHints) return '';
    
    const levelId = level.id;
    const hints = level.guidedHints || [];
    
    return `
      <div class="mode-content" data-mode="guided">
        <div class="guided-container">
          <div class="guided-progress">
            <span>学习进度:</span>
            <div class="guided-step-indicator" id="level${levelId}StepIndicator">
              ${hints.map((hint, idx) => `
                <div class="step-dot ${idx === 0 ? 'active' : ''}" data-step="${idx}">
                  ${idx + 1}
                </div>
              `).join('')}
            </div>
          </div>
          
          <div id="level${levelId}GuidedContent">
            ${generateGuidedStep(levelId, hints, 0)}
          </div>
          
          <button class="submit-btn" data-level-id="${levelId}" data-mode="guided" style="margin-top: 16px;">
            <span class="btn-text">完成学习并提交</span>
            <span class="btn-loader" style="display: none;"></span>
          </button>
          
          <div class="feedback" id="level${levelId}GuidedFeedback"></div>
        </div>
      </div>
    `;
  }

  function generateGuidedStep(levelId, hints, stepIdx) {
    const hint = hints[stepIdx];
    const isFirst = stepIdx === 0;
    const isLast = stepIdx === hints.length - 1;
    
    return `
      <div class="guided-hint-card" data-step="${stepIdx}">
        <h4>💡 步骤 ${stepIdx + 1}/${hints.length}</h4>
        <p class="guided-hint-text">${escapeHtml(hint.hint)}</p>
        ${hint.code ? `
          <div class="guided-code-preview">
            <pre>${escapeHtml(hint.code)}</pre>
          </div>
        ` : ''}
      </div>
      
      <div class="guided-actions">
        ${hint.code ? `
          <button class="guided-use-code" id="level${levelId}UseCodeBtn">
            📝 使用这段代码
          </button>
        ` : '<div></div>'}
        <div class="guided-nav-buttons">
          <button class="guided-prev" id="level${levelId}PrevBtn" ${isFirst ? 'disabled' : ''}>
            ← 上一步
          </button>
          <button class="guided-next" id="level${levelId}NextBtn" ${isLast ? 'disabled' : ''}>
            下一步 →
          </button>
        </div>
      </div>
    `;
  }

  function generateLevelContent() {
    const contentContainer = DOMCache.levelContent;
    console.log('📦 contentContainer:', contentContainer);
    
    if (!contentContainer) {
      console.error('❌ contentContainer不存在！');
      return;
    }
    
    contentContainer.innerHTML = '';
    
    console.log('📋 开始生成关卡内容，共', GameState.levelsData.length, '个关卡');
    
    if (GameState.levelsData.length === 0) {
      console.error('❌ 没有关卡数据！');
      contentContainer.innerHTML = '<p style="color: red;">没有找到关卡数据</p>';
      return;
    }
    
    GameState.levelsData.forEach(level => {
      console.log('📝 生成关卡', level.id, ':', level.title);
      const levelDiv = document.createElement('div');
      levelDiv.className = 'level-content';
      levelDiv.id = 'level' + level.id;
      levelDiv.setAttribute('role', 'tabpanel');
      levelDiv.setAttribute('aria-labelledby', 'level-btn-' + level.id);
      
      const objectivesList = level.objectives.map(obj => `<li>${escapeHtml(obj)}</li>`).join('');
      
      levelDiv.innerHTML = `
        <div class="level-header">
          <div class="level-phase-badge">${escapeHtml(level.phaseName)}</div>
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
          
          ${generateModeTabs(level)}
          
          <div class="mode-contents" id="level${level.id}ModeContents">
            ${generateCodeMode(level)}
            ${generateDragMode(level)}
            ${generateChoiceMode(level)}
            ${generateFillMode(level)}
            ${generateGuidedMode(level)}
          </div>
        </div>
      `;
      
      contentContainer.appendChild(levelDiv);
      
      initializeModeState(level.id, level);
    });
    
    initHintToggles();
    initModeEventListeners();
  }

  function initializeModeState(levelId, level) {
    GameState.modeStates[levelId] = {
      currentMode: level.defaultType || 'code',
      dragBlocks: [],
      selectedChoice: null,
      selectedFillBlank: null,
      fillAnswers: {},
      guidedStep: 0
    };
  }

  function initModeEventListeners() {
    DOMCache.levelContent.addEventListener('click', function(e) {
      const modeTab = e.target.closest('.mode-tab');
      if (modeTab && !modeTab.classList.contains('disabled') && !modeTab.classList.contains('active')) {
        handleModeChange(modeTab);
      }
    });
  }

  function handleModeChange(tabElement) {
    const mode = tabElement.dataset.mode;
    const levelDiv = tabElement.closest('.level-content');
    if (!levelDiv) return;
    
    const levelId = parseInt(levelDiv.id.replace('level', ''));
    const modeState = GameState.modeStates[levelId];
    if (!modeState) return;
    
    levelDiv.querySelectorAll('.mode-tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tabElement.classList.add('active');
    tabElement.setAttribute('aria-selected', 'true');
    
    levelDiv.querySelectorAll('.mode-content').forEach(c => {
      c.classList.remove('active');
    });
    levelDiv.querySelector(`.mode-content[data-mode="${mode}"]`).classList.add('active');
    
    modeState.currentMode = mode;
    
    initializeModeFeatures(levelId, mode);
  }

  function initializeModeFeatures(levelId, mode) {
    const level = GameState.levelsData.find(l => l.id === levelId);
    if (!level) return;
    
    switch (mode) {
      case 'drag':
        initializeDragDrop(levelId, level);
        break;
      case 'choice':
        initializeChoiceMode(levelId, level);
        break;
      case 'fill':
        initializeFillMode(levelId, level);
        break;
      case 'guided':
        initializeGuidedMode(levelId, level);
        break;
    }
  }

  function initializeDragDrop(levelId, level) {
    const palette = document.getElementById(`level${levelId}DragPalette`);
    const dropZone = document.getElementById(`level${levelId}DropZone`);
    const droppedBlocks = document.getElementById(`level${levelId}DroppedBlocks`);
    const dropEmpty = document.getElementById(`level${levelId}DropEmpty`);
    const resetBtn = document.getElementById(`level${levelId}ResetDrag`);
    
    if (!palette || !dropZone) return;
    
    const modeState = GameState.modeStates[levelId];
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        modeState.dragBlocks = [];
        droppedBlocks.innerHTML = '';
        dropEmpty.style.display = 'block';
      });
    }
    
    palette.querySelectorAll('.code-block').forEach(block => {
      block.addEventListener('dragstart', handleDragStart);
      block.addEventListener('dragend', handleDragEnd);
    });
    
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', (e) => handleDrop(e, levelId));
    
    function handleDragStart(e) {
      e.target.classList.add('dragging');
      e.dataTransfer.setData('text/plain', e.target.dataset.code);
      e.dataTransfer.setData('blockIdx', e.target.dataset.block);
    }
    
    function handleDragEnd(e) {
      e.target.classList.remove('dragging');
    }
    
    function handleDragOver(e) {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    }
    
    function handleDragLeave(e) {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    }
    
    function handleDrop(e, levelId) {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      
      const code = e.dataTransfer.getData('text/plain');
      if (!code) return;
      
      modeState.dragBlocks.push(code);
      dropEmpty.style.display = 'none';
      renderDroppedBlocks(levelId);
    }
    
    function renderDroppedBlocks(levelId) {
      const droppedBlocks = document.getElementById(`level${levelId}DroppedBlocks`);
      droppedBlocks.innerHTML = modeState.dragBlocks.map((code, idx) => `
        <div class="dropped-block">
          <code>${escapeHtml(code)}</code>
          <button class="remove-block" data-idx="${idx}">×</button>
        </div>
      `).join('');
      
      droppedBlocks.querySelectorAll('.remove-block').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          modeState.dragBlocks.splice(idx, 1);
          if (modeState.dragBlocks.length === 0) {
            dropEmpty.style.display = 'block';
          }
          renderDroppedBlocks(levelId);
        });
      });
    }
  }

  function initializeChoiceMode(levelId, level) {
    const modeState = GameState.modeStates[levelId];
    const optionsContainer = document.getElementById(`level${levelId}ChoiceOptions`);
    if (!optionsContainer) return;
    
    optionsContainer.querySelectorAll('.choice-option').forEach(opt => {
      opt.addEventListener('click', () => {
        optionsContainer.querySelectorAll('.choice-option').forEach(o => {
          o.classList.remove('selected');
        });
        opt.classList.add('selected');
        modeState.selectedChoice = parseInt(opt.dataset.idx);
        
        const feedbackDiv = document.getElementById(`level${levelId}ChoiceFeedback`);
        const optionData = level.choices.options[parseInt(opt.dataset.idx)];
        feedbackDiv.textContent = optionData.feedback || '';
        feedbackDiv.className = 'choice-feedback show';
      });
    });
  }

  function initializeFillMode(levelId, level) {
    const modeState = GameState.modeStates[levelId];
    const codeContainer = document.getElementById(`level${levelId}FillCode`);
    const optionsContainer = document.getElementById(`level${levelId}FillOptions`);
    const resetBtn = document.getElementById(`level${levelId}ResetFill`);
    
    if (!codeContainer || !optionsContainer) return;
    
    const blanks = codeContainer.querySelectorAll('.fill-blank');
    const options = optionsContainer.querySelectorAll('.fill-option');
    
    blanks.forEach(blank => {
      blank.addEventListener('click', () => {
        blanks.forEach(b => b.classList.remove('selected'));
        blank.classList.add('selected');
        modeState.selectedFillBlank = blank.dataset.blankId;
        
        options.forEach(opt => {
          opt.classList.toggle('selected', opt.dataset.option === modeState.fillAnswers[modeState.selectedFillBlank]);
        });
      });
    });
    
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if (!modeState.selectedFillBlank && modeState.selectedFillBlank !== 0) return;
        
        modeState.fillAnswers[modeState.selectedFillBlank] = opt.dataset.option;
        const targetBlank = codeContainer.querySelector(`.fill-blank[data-blank-id="${modeState.selectedFillBlank}"]`);
        if (targetBlank) {
          targetBlank.textContent = opt.dataset.option;
          targetBlank.classList.add('filled');
          targetBlank.classList.remove('selected');
        }
        
        options.forEach(o => o.classList.remove('selected'));
        modeState.selectedFillBlank = null;
      });
    });
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        modeState.fillAnswers = {};
        modeState.selectedFillBlank = null;
        blanks.forEach(blank => {
          blank.textContent = '???';
          blank.classList.remove('filled', 'selected', 'correct', 'incorrect');
        });
        options.forEach(opt => opt.classList.remove('selected', 'used'));
      });
    }
  }

  function initializeGuidedMode(levelId, level) {
    const modeState = GameState.modeStates[levelId];
    const hints = level.guidedHints || [];
    
    function renderGuidedContent() {
      const container = document.getElementById(`level${levelId}GuidedContent`);
      const indicators = document.getElementById(`level${levelId}StepIndicator`);
      
      container.innerHTML = generateGuidedStep(levelId, hints, modeState.guidedStep);
      
      if (indicators) {
        indicators.querySelectorAll('.step-dot').forEach((dot, idx) => {
          dot.classList.remove('active', 'completed');
          if (idx < modeState.guidedStep) {
            dot.classList.add('completed');
          } else if (idx === modeState.guidedStep) {
            dot.classList.add('active');
          }
        });
      }
      
      attachGuidedEventListeners(levelId);
    }
    
    function attachGuidedEventListeners(levelId) {
      const prevBtn = document.getElementById(`level${levelId}PrevBtn`);
      const nextBtn = document.getElementById(`level${levelId}NextBtn`);
      const useCodeBtn = document.getElementById(`level${levelId}UseCodeBtn`);
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (modeState.guidedStep > 0) {
            modeState.guidedStep--;
            renderGuidedContent();
          }
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (modeState.guidedStep < hints.length - 1) {
            modeState.guidedStep++;
            renderGuidedContent();
          }
        });
      }
      
      if (useCodeBtn) {
        useCodeBtn.addEventListener('click', () => {
          const currentHint = hints[modeState.guidedStep];
          if (currentHint && currentHint.code) {
            const codeInput = document.getElementById(`level${levelId}CodeInput`);
            if (codeInput) {
              codeInput.value = currentHint.code;
            }
          }
        });
      }
    }
    
    renderGuidedContent();
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

  function initPhaseTabs() {
    DOMCache.phaseTabs.addEventListener('click', function(e) {
      const tab = e.target.closest('.phase-tab');
      if (!tab || tab.classList.contains('locked')) return;
      
      const phaseId = parseInt(tab.dataset.phase);
      switchPhase(phaseId);
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
        const mode = e.target.dataset.mode || 'code';
        checkLevel(levelId, mode);
      }
    });

    DOMCache.levelContent.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.ctrlKey) {
        const textarea = e.target.closest('.challenge')?.querySelector('.challenge-input');
        if (textarea) {
          const levelId = parseInt(textarea.id.replace('level', '').replace('Input', '').replace('Code', ''));
          if (!GameState.isSubmitting) {
            checkLevel(levelId, 'code');
          }
        }
      }
    });
  }

  function switchPhase(phaseId) {
    GameState.currentPhase = phaseId;
    updatePhaseTabs();
    generateLevelButtons();
    
    const currentPhaseData = phases.find(p => p.id === phaseId);
    if (currentPhaseData && !currentPhaseData.levels.includes(GameState.currentLevel)) {
      const firstLevel = currentPhaseData.levels.find(l => isLevelUnlocked(l)) || currentPhaseData.levels[0];
      switchLevel(firstLevel);
    }
  }

  function switchLevel(level) {
    console.log('🔄 切换到关卡:', level);
    
    const levelPhase = GameState.levelsData.find(l => l.id === level)?.phase;
    if (levelPhase && levelPhase !== GameState.currentPhase) {
      GameState.currentPhase = levelPhase;
      updatePhaseTabs();
      generateLevelButtons();
    }
    
    document.querySelectorAll('.level-content').forEach(content => {
      content.classList.remove('active');
    });
    
    const currentLevelDiv = document.getElementById('level' + level);
    console.log('🎯 当前关卡div:', currentLevelDiv);
    if (currentLevelDiv) {
      currentLevelDiv.classList.add('active');
      console.log('✅ 关卡', level, '已激活');
      currentLevelDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.log('❌ 关卡div不存在:', 'level' + level);
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
    
    const levelData = GameState.levelsData.find(l => l.id === level);
    if (levelData) {
      const defaultMode = levelData.defaultType || 'code';
      const modeState = GameState.modeStates[level];
      if (modeState) {
        modeState.currentMode = defaultMode;
      }
      
      const defaultModeTab = currentLevelDiv.querySelector(`.mode-tab[data-mode="${defaultMode}"]`);
      if (defaultModeTab) {
        currentLevelDiv.querySelectorAll('.mode-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        defaultModeTab.classList.add('active');
        defaultModeTab.setAttribute('aria-selected', 'true');
        
        currentLevelDiv.querySelectorAll('.mode-content').forEach(c => {
          c.classList.remove('active');
        });
        currentLevelDiv.querySelector(`.mode-content[data-mode="${defaultMode}"]`).classList.add('active');
      }
      
      initializeModeFeatures(level, defaultMode);
    }
  }

  function completeLevel(level) {
    if (!GameState.completedLevels.includes(level)) {
      GameState.completedLevels.push(level);
      GameState.completedLevels.sort((a, b) => a - b);
      updateProgress();
      updatePhaseTabs();
      
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
      
      const levelData = GameState.levelsData.find(l => l.id === level);
      if (levelData && isPhaseCompleted(levelData.phase)) {
        showPhaseCelebration(levelData.phaseName);
      }
    }
  }

  function getCodeFromMode(levelId, mode, levelData) {
    const modeState = GameState.modeStates[levelId];
    
    switch (mode) {
      case 'code':
        const codeInput = document.getElementById(`level${levelId}CodeInput`);
        return codeInput ? codeInput.value : '';
      
      case 'drag':
        return (modeState.dragBlocks || []).join('\n');
      
      case 'choice':
        if (modeState.selectedChoice !== null && levelData.choices) {
          return `SELECTED: ${levelData.choices.options[modeState.selectedChoice].text}`;
        }
        return '';
      
      case 'fill':
        if (!levelData.fillBlanks) return '';
        let code = levelData.fillBlanks.template;
        levelData.fillBlanks.blanks.forEach((blank, idx) => {
          const answer = modeState.fillAnswers[blank.id || idx] || '';
          code = code.replace('___', answer);
        });
        return code;
      
      case 'guided':
        const guidedCodeInput = document.getElementById(`level${levelId}CodeInput`);
        return guidedCodeInput ? guidedCodeInput.value : '';
      
      default:
        return '';
    }
  }

  function validateAnswer(code, levelData, mode) {
    const validation = levelData.validation;
    if (!validation) return { valid: true, message: '提交成功！' };
    
    const requiredKeywords = validation.requiredKeywords || [];
    const matchAll = validation.matchAll !== false;
    
    let isValid;
    if (matchAll) {
      isValid = requiredKeywords.every(keyword => code.includes(keyword));
    } else {
      isValid = requiredKeywords.some(keyword => code.includes(keyword));
    }
    
    if (mode === 'choice' && levelData.choices) {
      const modeState = GameState.modeStates[levelData.id];
      if (modeState.selectedChoice !== null) {
        const selectedOption = levelData.choices.options[modeState.selectedChoice];
        isValid = selectedOption.correct;
      }
    }
    
    if (mode === 'fill' && levelData.fillBlanks) {
      const modeState = GameState.modeStates[levelData.id];
      isValid = levelData.fillBlanks.blanks.every((blank, idx) => {
        return modeState.fillAnswers[blank.id || idx] === blank.answer;
      });
    }
    
    return {
      valid: isValid,
      message: isValid ? validation.successFeedback : validation.errorFeedback
    };
  }

  function checkLevel(levelId, mode) {
    if (GameState.isSubmitting) return;
    
    const levelData = GameState.levelsData.find(l => l.id === levelId);
    if (!levelData) return;
    
    const code = getCodeFromMode(levelId, mode, levelData);
    const { valid, message } = validateAnswer(code, levelData, mode);
    const feedbackDivId = getFeedbackDivId(levelId, mode);
    const feedbackDiv = document.getElementById(feedbackDivId);
    const submitBtn = document.querySelector(`.submit-btn[data-level-id="${levelId}"][data-mode="${mode}"]`);
    
    if (mode === 'choice' && GameState.modeStates[levelId].selectedChoice === null) {
      showFeedback(feedbackDiv, 'error', '请先选择一个选项！');
      return;
    }
    
    if (mode === 'fill') {
      const blanks = levelData.fillBlanks?.blanks || [];
      const allFilled = blanks.every((_, idx) => GameState.modeStates[levelId].fillAnswers[idx] !== undefined);
      if (!allFilled) {
        showFeedback(feedbackDiv, 'error', '请先填写所有空格！');
        return;
      }
    }
    
    GameState.isSubmitting = true;
    setButtonLoading(submitBtn, true);
    
    setTimeout(() => {
      if (valid) {
        showFeedback(feedbackDiv, 'success', message);
        completeLevel(levelId);
        
        if (levelId < GameState.levelsData.length) {
          setTimeout(() => {
            switchLevel(levelId + 1);
          }, 1500);
        }
      } else {
        showFeedback(feedbackDiv, 'error', message);
        
        if (mode === 'fill') {
          showFillModeFeedback(levelId, levelData);
        }
        
        if (mode === 'choice') {
          showChoiceModeFeedback(levelId, levelData);
        }
        
        shakeElement(feedbackDiv);
      }
      
      GameState.isSubmitting = false;
      setButtonLoading(submitBtn, false);
    }, 800);
  }

  function getFeedbackDivId(levelId, mode) {
    switch (mode) {
      case 'code': return `level${levelId}CodeFeedback`;
      case 'drag': return `level${levelId}DragFeedback`;
      case 'choice': return `level${levelId}ChoiceFinalFeedback`;
      case 'fill': return `level${levelId}FillFeedback`;
      case 'guided': return `level${levelId}GuidedFeedback`;
      default: return `level${levelId}CodeFeedback`;
    }
  }

  function showFillModeFeedback(levelId, levelData) {
    const codeContainer = document.getElementById(`level${levelId}FillCode`);
    const modeState = GameState.modeStates[levelId];
    if (!codeContainer) return;
    
    const blanks = codeContainer.querySelectorAll('.fill-blank');
    blanks.forEach(blank => {
      const blankId = blank.dataset.blankId;
      const correctAnswer = levelData.fillBlanks.blanks.find(b => (b.id || '') === blankId || levelData.fillBlanks.blanks.indexOf(b) == blankId)?.answer;
      const userAnswer = modeState.fillAnswers[blankId];
      
      blank.classList.remove('correct', 'incorrect');
      blank.classList.add(userAnswer === correctAnswer ? 'correct' : 'incorrect');
    });
  }

  function showChoiceModeFeedback(levelId, levelData) {
    const optionsContainer = document.getElementById(`level${levelId}ChoiceOptions`);
    if (!optionsContainer) return;
    
    optionsContainer.querySelectorAll('.choice-option').forEach(opt => {
      opt.classList.remove('correct', 'incorrect', 'selected');
      const isCorrect = opt.dataset.correct === 'true';
      
      if (isCorrect) {
        opt.classList.add('correct');
      } else if (parseInt(opt.dataset.idx) === GameState.modeStates[levelId].selectedChoice) {
        opt.classList.add('incorrect');
      }
    });
  }

  function setButtonLoading(button, isLoading) {
    if (!button) return;
    
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
    if (!element) return;
    
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
    console.log('🔧 开始初始化游戏...');
    
    cacheDOM();
    console.log('🔧 DOM缓存完成');
    
    generateLevelButtons();
    console.log('🔧 关卡按钮生成完成');
    
    generateLevelContent();
    console.log('🔧 关卡内容生成完成');
    
    initPhaseTabs();
    console.log('🔧 阶段标签初始化完成');
    
    initLevelSelector();
    console.log('🔧 关卡选择器初始化完成');
    
    initSubmitButtons();
    console.log('🔧 提交按钮初始化完成');
    
    updateProgress();
    console.log('🔧 进度更新完成');
    
    updatePhaseTabs();
    console.log('🔧 阶段标签更新完成');
    
    switchLevel(1);
    console.log('🔧 切换到关卡1完成');
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
      console.log('✅ 游戏初始化完成');
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
