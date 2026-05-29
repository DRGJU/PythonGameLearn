class LevelPage {
    constructor() {
        this.levels = [];
        this.currentLevel = null;
        this.currentLevelId = 1;
        this.currentMode = 'code';
        this.guidedStep = 0;
        this.selectedChoice = null;
        this.selectedFillBlank = null;
        this.fillAnswers = {};
        this.dragBlocks = [];
        this.droppedBlocks = [];
        this.completedLevels = this.loadCompletedLevels();
        this.isInputFocused = false;
        
        this.init();
    }

    validateCompletedLevels(data) {
        if (!Array.isArray(data)) {
            console.warn('Invalid completed levels data, resetting');
            return [];
        }
        const validLevels = data.filter(levelId => 
            typeof levelId === 'number' && 
            levelId > 0 && 
            levelId <= 30 &&
            Number.isInteger(levelId)
        );
        return [...new Set(validLevels)];
    }

    recoverCompletedLevels() {
        try {
            const corrupted = localStorage.getItem('pythonGameCompletedLevels');
            if (!corrupted) return [];
            
            const cleaned = corrupted.replace(/[^\d,\[\]]/g, '');
            const parsed = JSON.parse(cleaned);
            const validated = this.validateCompletedLevels(parsed);
            
            if (validated.length > 0) {
                this.completedLevels = validated;
                this.saveCompletedLevels();
                console.log('成功恢复进度数据');
                return validated;
            }
        } catch (e) {
            console.error('无法恢复数据，将重置进度');
        }
        this.clearCompletedLevels();
        return [];
    }

    loadCompletedLevels() {
        try {
            const saved = localStorage.getItem('pythonGameCompletedLevels');
            if (!saved) return [];
            
            const parsed = JSON.parse(saved);
            const validated = this.validateCompletedLevels(parsed);
            
            if (validated.length !== parsed.length) {
                console.warn('Some invalid level IDs were removed');
                this.completedLevels = validated;
                this.saveCompletedLevels();
            }
            
            return validated;
        } catch (error) {
            console.error('加载进度失败，尝试恢复数据:', error);
            return this.recoverCompletedLevels();
        }
    }

    saveCompletedLevels() {
        try {
            localStorage.setItem('pythonGameCompletedLevels', JSON.stringify(this.completedLevels));
        } catch (error) {
            console.error('保存进度失败:', error);
        }
    }

    clearCompletedLevels() {
        try {
            localStorage.removeItem('pythonGameCompletedLevels');
            this.completedLevels = [];
        } catch (error) {
            console.error('清除进度失败:', error);
        }
    }

    async init() {
        this.getLevelIdFromUrl();
        await this.loadLevelsData();
        this.setupEventListeners();
        this.renderLevel();
        this.showShortcutHint();
    }

    getLevelIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const levelId = urlParams.get('level');
        if (levelId) {
            this.currentLevelId = parseInt(levelId);
        }
    }

    async loadLevelsData() {
        try {
            const response = await fetch('data/levels.json');
            const data = await response.json();
            this.levels = data.levels || [];
        } catch (error) {
            console.error('加载关卡数据失败:', error);
            this.levels = [];
        }
    }

    setupEventListeners() {
        const modeTabs = document.querySelectorAll('.mode-tab');
        modeTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchMode(tab.dataset.mode));
        });

        document.getElementById('submit-code').addEventListener('click', () => this.submitCode());
        document.getElementById('reset-code').addEventListener('click', () => this.resetCode());

        document.getElementById('submit-drag').addEventListener('click', () => this.submitDrag());
        document.getElementById('reset-drag').addEventListener('click', () => this.resetDrag());

        document.getElementById('submit-choice').addEventListener('click', () => this.submitChoice());

        document.getElementById('submit-fill').addEventListener('click', () => this.submitFill());
        document.getElementById('reset-fill').addEventListener('click', () => this.resetFill());

        document.getElementById('guided-prev').addEventListener('click', () => this.prevGuidedStep());
        document.getElementById('guided-next').addEventListener('click', () => this.nextGuidedStep());
        document.getElementById('guided-use-code').addEventListener('click', () => this.useGuidedCode());

        document.getElementById('level-nav-prev').addEventListener('click', () => this.navigateToPrevLevel());
        document.getElementById('level-nav-next').addEventListener('click', () => this.navigateToNextLevel());

        this.setupKeyboardNavigation();
        this.setupInputFocusListeners();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isInputFocused) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigateToPrevLevel();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.navigateToNextLevel();
            }
        });
    }

    setupInputFocusListeners() {
        const inputs = document.querySelectorAll('textarea, input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.isInputFocused = true;
            });
            input.addEventListener('blur', () => {
                this.isInputFocused = false;
            });
        });
    }

    navigateToPrevLevel() {
        if (this.currentLevelId <= 1) {
            this.showNavigationHint('已经是第一个关卡');
            return;
        }
        
        const prevLevelId = this.currentLevelId - 1;
        if (this.isLevelUnlocked(prevLevelId)) {
            this.navigateToLevel(prevLevelId);
        } else {
            this.showNavigationHint('上一关尚未解锁');
        }
    }

    navigateToNextLevel() {
        const maxUnlockedLevel = this.getMaxUnlockedLevel();
        if (this.currentLevelId >= maxUnlockedLevel) {
            this.showNavigationHint('已经是最后一个已解锁关卡');
            return;
        }
        
        const nextLevelId = this.currentLevelId + 1;
        if (this.isLevelUnlocked(nextLevelId)) {
            this.navigateToLevel(nextLevelId);
        }
    }

    getMaxUnlockedLevel() {
        const maxCompleted = Math.max(...this.completedLevels, 0);
        return maxCompleted + 1;
    }

    isLevelUnlocked(levelId) {
        return levelId === 1 || this.completedLevels.includes(levelId - 1);
    }

    navigateToLevel(levelId) {
        window.location.href = `level.html?level=${levelId}`;
    }

    showShortcutHint() {
        const hasSeen = localStorage.getItem('shortcutHintSeen');
        if (hasSeen) return;

        const hint = document.createElement('div');
        hint.className = 'floating-shortcut-hint';
        hint.innerHTML = `
            <span class="shortcut-icon">⌨️</span>
            <span>使用快捷键：</span>
            <div class="shortcut-keys">
                <span class="shortcut-key">←</span>
                <span class="shortcut-key">/</span>
                <span class="shortcut-key">→</span>
            </div>
        `;
        document.body.appendChild(hint);

        setTimeout(() => {
            hint.classList.add('show');
        }, 50);

        setTimeout(() => {
            hint.classList.remove('show');
            setTimeout(() => {
                hint.remove();
                localStorage.setItem('shortcutHintSeen', 'true');
            }, 300);
        }, 3000);
    }

    showNavigationHint(message) {
        const hint = document.createElement('div');
        hint.className = 'navigation-hint';
        hint.textContent = message;
        document.body.appendChild(hint);

        setTimeout(() => {
            hint.classList.add('show');
        }, 50);

        setTimeout(() => {
            hint.classList.remove('show');
            setTimeout(() => hint.remove(), 300);
        }, 2000);
    }

    renderLevel() {
        this.currentLevel = this.levels.find(l => l.id === this.currentLevelId);
        
        if (!this.currentLevel) {
            this.showError('未找到该关卡');
            return;
        }

        this.updateNavigationBar();
        this.renderHeader();
        this.renderLearningObjectives();
        this.renderCodeExample();
        this.renderChallenge();
        this.renderModeTabs();
        this.renderCodeMode();
        this.renderDragMode();
        this.renderChoiceMode();
        this.renderFillMode();
        this.renderGuidedMode();
    }

    updateNavigationBar() {
        const totalLevels = this.levels.length;
        const prevBtn = document.getElementById('level-nav-prev');
        const nextBtn = document.getElementById('level-nav-next');
        const currentDisplay = document.getElementById('level-nav-current');

        currentDisplay.textContent = `第 ${this.currentLevelId} 关 / 共 ${totalLevels} 关`;

        prevBtn.disabled = this.currentLevelId <= 1 || !this.isLevelUnlocked(this.currentLevelId - 1);
        nextBtn.disabled = this.currentLevelId >= this.getMaxUnlockedLevel();
    }

    renderHeader() {
        document.getElementById('level-title').textContent = this.currentLevel.title;
        document.getElementById('level-subtitle').textContent = this.currentLevel.description;
        
        document.getElementById('level-header').innerHTML = `
            <span class="level-phase-badge">${this.currentLevel.phaseName}</span>
            <h2 class="level-title" style="margin-top: 12px;">${this.currentLevel.title}</h2>
            <p class="level-description">${this.currentLevel.description}</p>
        `;
    }

    renderLearningObjectives() {
        const objectivesHtml = this.currentLevel.objectives.map(obj => `
            <li><strong>→</strong> ${obj}</li>
        `).join('');
        
        document.getElementById('learning-objectives').innerHTML = `
            <h3>🎯 学习目标</h3>
            <ul>${objectivesHtml}</ul>
        `;
    }

    renderCodeExample() {
        document.getElementById('code-example').innerHTML = `
            <pre>${this.escapeHtml(this.currentLevel.example)}</pre>
        `;
    }

    renderChallenge() {
        document.getElementById('challenge').innerHTML = `
            <h3>⚔️ 挑战任务</h3>
            <p>${this.currentLevel.challenge}</p>
            ${this.currentLevel.hints && this.currentLevel.hints.length > 0 ? `
                <div class="hint-section" style="margin-top: 16px;">
                    <button class="hint-toggle" id="hint-toggle">💡 显示提示</button>
                    <div class="hint-content" id="hint-content" style="display: none; margin-top: 12px;">
                        <ul>
                            ${this.currentLevel.hints.map(hint => `<li>${hint}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            ` : ''}
        `;

        const hintToggle = document.getElementById('hint-toggle');
        if (hintToggle) {
            hintToggle.addEventListener('click', () => {
                const hintContent = document.getElementById('hint-content');
                hintContent.style.display = hintContent.style.display === 'none' ? 'block' : 'none';
                hintToggle.textContent = hintContent.style.display === 'none' ? '💡 显示提示' : '💡 隐藏提示';
            });
        }
    }

    renderModeTabs() {
        const modeTabs = document.querySelectorAll('.mode-tab');
        const availableTypes = this.currentLevel.questionTypes || ['code'];
        
        modeTabs.forEach(tab => {
            const mode = tab.dataset.mode;
            if (!availableTypes.includes(mode)) {
                tab.classList.add('disabled');
                tab.disabled = true;
            } else {
                tab.classList.remove('disabled');
                tab.disabled = false;
            }
        });
    }

    switchMode(mode) {
        if ((this.currentLevel.questionTypes || ['code']).indexOf(mode) === -1) {
            return;
        }
        
        this.currentMode = mode;
        
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        document.querySelector(`.mode-tab[data-mode="${mode}"]`).classList.add('active');
        document.querySelector(`.mode-tab[data-mode="${mode}"]`).setAttribute('aria-selected', 'true');
        
        document.querySelectorAll('.mode-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`mode-${mode}`).classList.add('active');
    }

    renderCodeMode() {
        document.getElementById('challenge-description').textContent = this.currentLevel.challenge;
        document.getElementById('code-input').value = '';
        document.getElementById('code-feedback').className = 'feedback';
        document.getElementById('code-feedback').textContent = '';
    }

    submitCode() {
        const code = document.getElementById('code-input').value;
        const feedback = document.getElementById('code-feedback');
        
        const validationResult = this.validateCode(code);
        
        if (validationResult.success) {
            feedback.className = 'feedback success';
            feedback.textContent = this.currentLevel.validation.successFeedback;
            this.showCelebration();
        } else {
            feedback.className = 'feedback error';
            feedback.textContent = validationResult.errorMessage;
        }
    }

    validateCode(code) {
        if (!code || code.trim() === '') {
            return {
                success: false,
                errorMessage: '请输入代码答案'
            };
        }
        
        const requiredKeywords = this.currentLevel.validation.requiredKeywords || [];
        const missingKeywords = [];
        
        for (const keyword of requiredKeywords) {
            if (code.indexOf(keyword) === -1) {
                missingKeywords.push(keyword);
            }
        }
        
        if (missingKeywords.length > 0) {
            return {
                success: false,
                errorMessage: `代码中缺少关键字: ${missingKeywords.join(', ')}`
            };
        }
        
        return {
            success: true,
            errorMessage: ''
        };
    }

    resetCode() {
        document.getElementById('code-input').value = '';
        document.getElementById('code-feedback').className = 'feedback';
        document.getElementById('code-feedback').textContent = '';
    }

    renderDragMode() {
        if (!this.currentLevel.codeBlocks) return;
        
        this.dragBlocks = [...this.currentLevel.codeBlocks.available];
        this.droppedBlocks = [];
        this.renderDragBlocks();
        this.renderDroppedBlocks();
        document.getElementById('drag-feedback').className = 'feedback';
        document.getElementById('drag-feedback').textContent = '';
    }

    renderDragBlocks() {
        const container = document.getElementById('drag-blocks');
        container.innerHTML = '';
        
        this.dragBlocks.forEach((block, index) => {
            const blockEl = document.createElement('div');
            blockEl.className = 'code-block';
            blockEl.textContent = block;
            blockEl.draggable = true;
            blockEl.dataset.index = index;
            
            blockEl.addEventListener('dragstart', (e) => this.handleDragStart(e, 'palette', index));
            blockEl.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            container.appendChild(blockEl);
        });
    }

    renderDroppedBlocks() {
        const container = document.getElementById('dropped-blocks');
        const empty = document.getElementById('drop-zone-empty');
        
        if (this.droppedBlocks.length === 0) {
            empty.style.display = 'block';
            container.innerHTML = '';
            return;
        }
        
        empty.style.display = 'none';
        container.innerHTML = '';
        
        this.droppedBlocks.forEach((block, index) => {
            const blockEl = document.createElement('div');
            blockEl.className = 'dropped-block';
            blockEl.innerHTML = `
                <code>${this.escapeHtml(block.text)}</code>
                <button class="remove-block" data-index="${index}">×</button>
            `;
            blockEl.draggable = true;
            blockEl.dataset.index = index;
            
            blockEl.addEventListener('dragstart', (e) => this.handleDragStart(e, 'drop', index));
            blockEl.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            blockEl.querySelector('.remove-block').addEventListener('click', () => this.removeDroppedBlock(index));
            
            container.appendChild(blockEl);
        });
        
        const dropZone = document.getElementById('drop-zone');
        dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        dropZone.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleDragStart(e, source, index) {
        e.dataTransfer.setData('text/plain', JSON.stringify({ source, index }));
        e.target.classList.add('dragging');
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        document.getElementById('drop-zone').classList.remove('drag-over');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            if (data.source === 'palette') {
                const block = this.dragBlocks[data.index];
                this.droppedBlocks.push({ text: block, originalIndex: data.index });
                this.renderDroppedBlocks();
            }
        } catch (error) {
            console.error('Drop error:', error);
        }
    }

    removeDroppedBlock(index) {
        this.droppedBlocks.splice(index, 1);
        this.renderDroppedBlocks();
    }

    submitDrag() {
        const feedback = document.getElementById('drag-feedback');
        const correctOrder = this.currentLevel.codeBlocks.correctOrder;
        const userOrder = this.droppedBlocks.map(b => b.text);
        
        if (JSON.stringify(userOrder) === JSON.stringify(correctOrder)) {
            feedback.className = 'feedback success';
            feedback.textContent = this.currentLevel.validation.successFeedback;
            this.showCelebration();
        } else {
            feedback.className = 'feedback error';
            feedback.textContent = this.currentLevel.validation.errorFeedback;
        }
    }

    resetDrag() {
        this.renderDragMode();
    }

    renderChoiceMode() {
        if (!this.currentLevel.choices) return;
        
        document.getElementById('choice-question-text').textContent = this.currentLevel.choices.question;
        
        const optionsContainer = document.getElementById('choice-options');
        optionsContainer.innerHTML = '';
        
        this.currentLevel.choices.options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'choice-option';
            optionEl.dataset.index = index;
            optionEl.innerHTML = `
                <div class="choice-indicator">${String.fromCharCode(65 + index)}</div>
                <div class="choice-text">${option.text}</div>
            `;
            
            optionEl.addEventListener('click', () => this.selectChoice(index));
            optionsContainer.appendChild(optionEl);
        });
        
        document.getElementById('choice-feedback').className = 'choice-feedback';
        document.getElementById('choice-feedback').textContent = '';
        this.selectedChoice = null;
    }

    selectChoice(index) {
        if (this.selectedChoice !== null) return;
        
        this.selectedChoice = index;
        const options = document.querySelectorAll('.choice-option');
        const option = options[index];
        const choiceData = this.currentLevel.choices.options[index];
        
        option.classList.add('selected');
        
        setTimeout(() => {
            if (choiceData.correct) {
                option.classList.add('correct');
                option.querySelector('.choice-indicator').textContent = '✓';
                document.getElementById('choice-feedback').className = 'choice-feedback correct show';
                document.getElementById('choice-feedback').textContent = choiceData.feedback;
                this.showCelebration();
            } else {
                option.classList.add('incorrect');
                option.querySelector('.choice-indicator').textContent = '✗';
                
                const correctIndex = this.currentLevel.choices.options.findIndex(o => o.correct);
                if (correctIndex !== -1) {
                    options[correctIndex].classList.add('correct');
                    options[correctIndex].querySelector('.choice-indicator').textContent = '✓';
                }
                
                document.getElementById('choice-feedback').className = 'choice-feedback incorrect show';
                document.getElementById('choice-feedback').textContent = choiceData.feedback;
            }
        }, 300);
    }

    submitChoice() {
    }

    renderFillMode() {
        if (!this.currentLevel.fillBlanks) return;
        
        this.fillAnswers = {};
        this.selectedFillBlank = null;
        
        const template = this.currentLevel.fillBlanks.template;
        let html = '';
        let blankIndex = 0;
        let lastIndex = 0;
        
        const regex = /___/g;
        let match;
        while ((match = regex.exec(template)) !== null) {
            html += this.escapeHtml(template.slice(lastIndex, match.index));
            html += `<span class="fill-blank" data-index="${blankIndex}" id="fill-blank-${blankIndex}">点击选择</span>`;
            blankIndex++;
            lastIndex = match.index + 3;
        }
        html += this.escapeHtml(template.slice(lastIndex));
        
        document.getElementById('fill-code').innerHTML = html;
        
        const optionsContainer = document.getElementById('fill-options');
        const allOptions = new Set();
        this.currentLevel.fillBlanks.blanks.forEach(blank => {
            blank.options.forEach(opt => allOptions.add(opt));
        });
        
        optionsContainer.innerHTML = '';
        Array.from(allOptions).forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'fill-option';
            optionEl.textContent = option;
            optionEl.dataset.option = option;
            optionEl.addEventListener('click', () => this.selectFillOption(option));
            optionsContainer.appendChild(optionEl);
        });
        
        document.querySelectorAll('.fill-blank').forEach(blank => {
            blank.addEventListener('click', () => this.selectFillBlank(parseInt(blank.dataset.index)));
        });
        
        document.getElementById('fill-feedback').className = 'feedback';
        document.getElementById('fill-feedback').textContent = '';
    }

    selectFillBlank(index) {
        document.querySelectorAll('.fill-blank').forEach(b => {
            b.style.borderColor = 'var(--accent-primary)';
        });
        
        this.selectedFillBlank = index;
        const blank = document.getElementById(`fill-blank-${index}`);
        blank.style.borderColor = 'var(--accent-secondary)';
        blank.style.boxShadow = '0 0 10px rgba(124, 58, 237, 0.5)';
    }

    selectFillOption(option) {
        if (this.selectedFillBlank === null) {
            this.selectFillBlank(0);
        }
        
        this.fillAnswers[this.selectedFillBlank] = option;
        const blank = document.getElementById(`fill-blank-${this.selectedFillBlank}`);
        blank.textContent = option;
        blank.classList.add('filled');
        
        const nextBlank = this.selectedFillBlank + 1;
        if (document.getElementById(`fill-blank-${nextBlank}`)) {
            this.selectFillBlank(nextBlank);
        }
    }

    submitFill() {
        const feedback = document.getElementById('fill-feedback');
        let allCorrect = true;
        
        this.currentLevel.fillBlanks.blanks.forEach((blank, index) => {
            const userAnswer = this.fillAnswers[index];
            const blankEl = document.getElementById(`fill-blank-${index}`);
            
            if (userAnswer === blank.answer) {
                blankEl.classList.add('correct');
                blankEl.classList.remove('incorrect');
            } else {
                blankEl.classList.add('incorrect');
                blankEl.classList.remove('correct');
                allCorrect = false;
            }
        });
        
        if (allCorrect) {
            feedback.className = 'feedback success';
            feedback.textContent = this.currentLevel.validation.successFeedback;
            this.showCelebration();
        } else {
            feedback.className = 'feedback error';
            feedback.textContent = this.currentLevel.validation.errorFeedback;
        }
    }

    resetFill() {
        this.renderFillMode();
    }

    renderGuidedMode() {
        if (!this.currentLevel.guidedHints) return;
        
        this.guidedStep = 0;
        this.updateGuidedProgress();
        this.updateGuidedHint();
    }

    updateGuidedProgress() {
        const hints = this.currentLevel.guidedHints;
        const progressContainer = document.getElementById('guided-progress');
        
        let html = '<div class="guided-step-indicator">';
        hints.forEach((hint, index) => {
            html += `<div class="step-dot ${index === this.guidedStep ? 'active' : ''} ${index < this.guidedStep ? 'completed' : ''}">${index + 1}</div>`;
        });
        html += '</div>';
        html += `<span style="color: var(--text-secondary); font-size: 14px;">步骤 ${this.guidedStep + 1} / ${hints.length}</span>`;
        
        progressContainer.innerHTML = html;
        
        document.getElementById('guided-prev').disabled = this.guidedStep === 0;
        document.getElementById('guided-next').disabled = this.guidedStep >= hints.length - 1;
    }

    updateGuidedHint() {
        const hint = this.currentLevel.guidedHints[this.guidedStep];
        const hintContainer = document.getElementById('guided-hint');
        
        hintContainer.innerHTML = `
            <h4>💡 步骤 ${hint.step}</h4>
            <p class="guided-hint-text">${hint.hint}</p>
            <div class="guided-code-preview">
                <pre>${this.escapeHtml(hint.code)}</pre>
            </div>
        `;
    }

    prevGuidedStep() {
        if (this.guidedStep > 0) {
            this.guidedStep--;
            this.updateGuidedProgress();
            this.updateGuidedHint();
        }
    }

    nextGuidedStep() {
        const hints = this.currentLevel.guidedHints;
        if (this.guidedStep < hints.length - 1) {
            this.guidedStep++;
            this.updateGuidedProgress();
            this.updateGuidedHint();
        }
    }

    useGuidedCode() {
        const hint = this.currentLevel.guidedHints[this.guidedStep];
        document.getElementById('code-input').value = hint.code;
        this.switchMode('code');
    }

    showCelebration() {
        // 保存进度
        if (!this.completedLevels.includes(this.currentLevelId)) {
            this.completedLevels.push(this.currentLevelId);
            this.saveCompletedLevels();
            console.log('✅ 关卡完成，进度已保存:', this.currentLevelId);
        }
        
        // 显示简洁的成功提示
        const hint = document.createElement('div');
        hint.className = 'success-hint';
        hint.innerHTML = `
            <span class="success-hint-icon">🎉</span>
            关卡完成！
        `;
        document.body.appendChild(hint);
        
        setTimeout(() => {
            hint.classList.add('show');
        }, 50);
        
        // 1.5秒后自动跳转
        setTimeout(() => {
            hint.classList.remove('show');
            setTimeout(() => hint.remove(), 300);
            
            const nextLevelId = this.currentLevelId + 1;
            if (nextLevelId <= this.levels.length && this.isLevelUnlocked(nextLevelId)) {
                this.navigateToLevel(nextLevelId);
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    }

    showError(message) {
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = `
            <div class="global-error">
                <div class="error-content">
                    <div class="error-icon">❌</div>
                    <h3>出错了</h3>
                    <p>${message}</p>
                    <a href="index.html" style="display: inline-block; padding: 12px 24px; background: var(--accent-primary); color: var(--bg-primary); border: none; border-radius: var(--radius-md); font-size: 16px; font-weight: 600; cursor: pointer; text-decoration: none;">返回首页</a>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LevelPage();
});
