class LevelPage {
    constructor() {
        this.levels = [];
        this.currentLevel = null;
        this.currentLevelId = 1;
        this.currentMode = 'run';

        // 预测输出
        this.predictAnswered = false;
        // 找错改错 / 运行验证：是否已完成
        this.codeSolved = { run: false, debug: false, assemble: false };
        // 拖拽组装
        this.assembleDropped = []; // [{text}]
        this.assembleDragFrom = null;
        // 配对分类
        this.matchPairs = [];      // 原始 pairs
        this.matchLeft = [];       // [{text, pairIndex}]
        this.matchRight = [];      // [{text, pairIndex}] 已打乱
        this.matchMapping = {};    // leftIndex -> rightIndex
        this.matchSelectedLeft = null;

        this.completedLevels = this.loadCompletedLevels();
        this.isInputFocused = false;

        this.init();
    }

    loadCompletedLevels() {
        try {
            const saved = localStorage.getItem('pythonGameCompletedLevels');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('加载进度失败:', error);
            return [];
        }
    }

    saveCompletedLevels() {
        try {
            localStorage.setItem('pythonGameCompletedLevels', JSON.stringify(this.completedLevels));
        } catch (error) {
            console.error('保存进度失败:', error);
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

        document.getElementById('run-code').addEventListener('click', () => this.submitRun());
        document.getElementById('reset-run').addEventListener('click', () => this.renderRun());

        document.getElementById('run-debug').addEventListener('click', () => this.submitDebug());
        document.getElementById('reset-debug').addEventListener('click', () => this.renderDebug());

        document.getElementById('submit-assemble').addEventListener('click', () => this.submitAssemble());
        document.getElementById('reset-assemble').addEventListener('click', () => this.renderAssemble());

        document.getElementById('submit-match').addEventListener('click', () => this.submitMatch());
        document.getElementById('reset-match').addEventListener('click', () => this.renderMatch());

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
            input.addEventListener('focus', () => { this.isInputFocused = true; });
            input.addEventListener('blur', () => { this.isInputFocused = false; });
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
            <span>使用快捷键：</span>
            <div class="shortcut-keys">
                <span class="shortcut-key">←</span>
                <span class="shortcut-key">/</span>
                <span class="shortcut-key">→</span>
            </div>
        `;
        document.body.appendChild(hint);
        setTimeout(() => hint.classList.add('show'), 50);
        setTimeout(() => {
            hint.classList.remove('show');
            setTimeout(() => { hint.remove(); localStorage.setItem('shortcutHintSeen', 'true'); }, 300);
        }, 3000);
    }

    showNavigationHint(message) {
        const hint = document.createElement('div');
        hint.className = 'navigation-hint';
        hint.textContent = message;
        document.body.appendChild(hint);
        setTimeout(() => hint.classList.add('show'), 50);
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

        // 重置各模式状态
        this.predictAnswered = false;
        this.codeSolved = { run: false, debug: false, assemble: false };

        this.updateNavigationBar();
        this.renderHeader();
        this.renderLearningObjectives();
        this.renderCodeExample();
        this.renderChallenge();
        this.renderModeTabs();
        this.renderRun();
        this.renderPredict();
        this.renderDebug();
        this.renderAssemble();
        this.renderMatch();
        this.warmupPy();
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
            <span class="level-phase-badge">${this.escapeHtml(this.currentLevel.phaseName)}</span>
            <h2 class="level-title">${this.escapeHtml(this.currentLevel.title)}</h2>
            <p class="level-description">${this.escapeHtml(this.currentLevel.description)}</p>
        `;
    }

    renderLearningObjectives() {
        const objectivesHtml = this.currentLevel.objectives.map(obj => `<li>${this.escapeHtml(obj)}</li>`).join('');
        document.getElementById('learning-objectives').innerHTML = `
            <h3>学习目标</h3>
            <ul>${objectivesHtml}</ul>
        `;
    }

    renderCodeExample() {
        document.getElementById('code-example').innerHTML = `
            <h3>示例代码</h3>
            <pre>${this.escapeHtml(this.currentLevel.example)}</pre>
        `;
    }

    renderChallenge() {
        const c = this.currentLevel;
        document.getElementById('challenge').innerHTML = `
            <h3>挑战任务</h3>
            <p>${this.escapeHtml(c.challenge)}</p>
            ${c.hints && c.hints.length > 0 ? `
                <div class="hint-section">
                    <button class="hint-toggle" id="hint-toggle" type="button">显示提示</button>
                    <div class="hint-content" id="hint-content" style="display: none;">
                        <ul>${c.hints.map(h => `<li>${this.escapeHtml(h)}</li>`).join('')}</ul>
                    </div>
                </div>` : ''}
        `;
        const hintToggle = document.getElementById('hint-toggle');
        if (hintToggle) {
            hintToggle.addEventListener('click', () => {
                const content = document.getElementById('hint-content');
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                hintToggle.textContent = content.style.display === 'none' ? '显示提示' : '隐藏提示';
            });
        }
    }

    renderModeTabs() {
        const modeTabs = document.querySelectorAll('.mode-tab');
        const availableTypes = this.currentLevel.questionTypes || ['run'];
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
        if ((this.currentLevel.questionTypes || ['run']).indexOf(mode) === -1) return;
        this.currentMode = mode;
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        document.querySelector(`.mode-tab[data-mode="${mode}"]`).classList.add('active');
        document.querySelector(`.mode-tab[data-mode="${mode}"]`).setAttribute('aria-selected', 'true');
        document.querySelectorAll('.mode-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`mode-${mode}`).classList.add('active');
    }

    // ===================== 工具 =====================
    norm(s) {
        return String(s)
            .replace(/\r\n/g, '\n')
            .split('\n')
            .map(l => l.replace(/\s+$/, ''))
            .join('\n')
            .replace(/\n+$/, '');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setFeedback(el, kind, text) {
        el.className = `feedback ${kind}`;
        el.textContent = text;
    }

    showRunOutput(el, stdout, error) {
        if (error) {
            el.className = 'run-output error';
            el.textContent = `⚠️ ${error}`;
        } else if (stdout && stdout.trim() !== '') {
            el.className = 'run-output show';
            el.textContent = stdout;
        } else {
            el.className = 'run-output show';
            el.textContent = '（程序没有输出）';
        }
    }

    warmupPy() {
        const status = document.getElementById('py-status');
        if (!window.PyRunner) return;
        status.hidden = false;
        status.className = 'py-status loading';
        status.textContent = '正在加载 Python 运行环境（首次稍慢）…';
        window.PyRunner.ensureReady()
            .then(() => { status.hidden = true; })
            .catch(() => {
                status.hidden = false;
                status.className = 'py-status error';
                status.textContent = '⚠️ Python 运行环境加载失败，运行/改错类题目需联网加载；预测与配对模式不受影响，可刷新重试。';
            });
    }

    async runWithPy(code, stdin) {
        if (!window.PyRunner) throw new Error('运行环境不可用');
        if (window.PyRunner.loadError) throw new Error(window.PyRunner.loadError);
        return await window.PyRunner.run(code, { stdin: stdin || [] });
    }

    // ===================== 运行验证 =====================
    renderRun() {
        const m = this.currentLevel.run;
        document.getElementById('run-prompt').textContent = m.prompt;
        const input = document.getElementById('run-input');
        input.value = m.starterCode || '';
        document.getElementById('run-output').className = 'run-output';
        document.getElementById('run-output').textContent = '';
        this.setFeedback(document.getElementById('run-feedback'), '', '');
    }

    async submitRun() {
        const m = this.currentLevel.run;
        const code = document.getElementById('run-input').value;
        const feedback = document.getElementById('run-feedback');
        const output = document.getElementById('run-output');
        if (!code || code.trim() === '') {
            this.setFeedback(feedback, 'error', '请先编写代码再运行。');
            return;
        }
        const btn = document.getElementById('run-code');
        btn.disabled = true;
        output.className = 'run-output loading';
        output.textContent = '运行中…';
        try {
            const res = await this.runWithPy(code, m.stdin);
            this.showRunOutput(output, res.stdout, res.error);
            if (res.error) {
                this.setFeedback(feedback, 'error', m.errorFeedback + '（运行出错：' + res.error + '）');
            } else if (this.norm(res.stdout) === this.norm(m.expectedOutput)) {
                this.codeSolved.run = true;
                this.setFeedback(feedback, 'success', m.successFeedback);
                this.showCelebration();
            } else {
                this.setFeedback(feedback, 'error', m.errorFeedback);
            }
        } catch (e) {
            output.className = 'run-output error';
            output.textContent = `⚠️ ${e.message}`;
            this.setFeedback(feedback, 'error', m.errorFeedback);
        } finally {
            btn.disabled = false;
        }
    }

    // ===================== 预测输出 =====================
    renderPredict() {
        const m = this.currentLevel.predict;
        document.getElementById('predict-prompt').textContent = m.prompt;
        document.getElementById('predict-code').textContent = m.code;
        const opts = document.getElementById('predict-options');
        opts.innerHTML = '';
        this.predictAnswered = false;
        m.options.forEach((opt, i) => {
            const el = document.createElement('button');
            el.type = 'button';
            el.className = 'predict-option';
            el.dataset.index = i;
            el.textContent = opt.text;
            el.addEventListener('click', () => this.selectPredict(i));
            opts.appendChild(el);
        });
        this.setFeedback(document.getElementById('predict-feedback'), '', '');
    }

    selectPredict(index) {
        const m = this.currentLevel.predict;
        const opt = m.options[index];
        const el = document.querySelector(`.predict-option[data-index="${index}"]`);
        const feedback = document.getElementById('predict-feedback');
        if (this.predictAnswered) return;
        if (opt.correct) {
            el.classList.add('correct');
            this.predictAnswered = true;
            // 锁定所有选项
            document.querySelectorAll('.predict-option').forEach(o => (o.disabled = true));
            this.setFeedback(feedback, 'success', opt.feedback);
            this.showCelebration();
        } else {
            el.classList.add('incorrect');
            el.disabled = true;
            this.setFeedback(feedback, 'error', opt.feedback);
        }
    }

    // ===================== 找错改错 =====================
    renderDebug() {
        const m = this.currentLevel.debug;
        document.getElementById('debug-prompt').textContent = m.prompt;
        const input = document.getElementById('debug-input');
        input.value = m.buggyCode || '';
        document.getElementById('debug-output').className = 'run-output';
        document.getElementById('debug-output').textContent = '';
        this.setFeedback(document.getElementById('debug-feedback'), '', '');
    }

    async submitDebug() {
        const m = this.currentLevel.debug;
        const code = document.getElementById('debug-input').value;
        const feedback = document.getElementById('debug-feedback');
        const output = document.getElementById('debug-output');
        if (!code || code.trim() === '') {
            this.setFeedback(feedback, 'error', '请先修复代码再运行。');
            return;
        }
        const btn = document.getElementById('run-debug');
        btn.disabled = true;
        output.className = 'run-output loading';
        output.textContent = '运行中…';
        try {
            const res = await this.runWithPy(code, m.stdin);
            this.showRunOutput(output, res.stdout, res.error);
            if (res.error) {
                this.setFeedback(feedback, 'error', m.errorFeedback + '（运行出错：' + res.error + '）');
            } else if (this.norm(res.stdout) === this.norm(m.expectedOutput)) {
                this.codeSolved.debug = true;
                this.setFeedback(feedback, 'success', m.successFeedback);
                this.showCelebration();
            } else {
                this.setFeedback(feedback, 'error', m.errorFeedback);
            }
        } catch (e) {
            output.className = 'run-output error';
            output.textContent = `⚠️ ${e.message}`;
            this.setFeedback(feedback, 'error', m.errorFeedback);
        } finally {
            btn.disabled = false;
        }
    }

    // ===================== 拖拽组装 =====================
    renderAssemble() {
        const m = this.currentLevel.assemble;
        document.getElementById('assemble-prompt').textContent = m.prompt;
        this.assembleDropped = [];
        this.assembleDragFrom = null;
        this.renderAssemblePalette();
        this.renderAssembleOrdered();
        document.getElementById('assemble-output').className = 'run-output';
        document.getElementById('assemble-output').textContent = '';
        this.setFeedback(document.getElementById('assemble-feedback'), '', '');
    }

    renderAssemblePalette() {
        const m = this.currentLevel.assemble;
        const container = document.getElementById('assemble-blocks');
        container.innerHTML = '';
        m.blocks.forEach((text, i) => {
            const el = document.createElement('div');
            el.className = 'assemble-block';
            el.textContent = text;
            el.draggable = true;
            el.dataset.index = i;
            el.addEventListener('click', () => this.addAssembleBlock(text));
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'palette', text }));
            });
            container.appendChild(el);
        });
    }

    addAssembleBlock(text) {
        this.assembleDropped.push({ text });
        this.renderAssembleOrdered();
    }

    renderAssembleOrdered() {
        const container = document.getElementById('assemble-ordered');
        const empty = document.getElementById('assemble-drop-empty');
        if (this.assembleDropped.length === 0) {
            empty.style.display = 'block';
            container.innerHTML = '';
            return;
        }
        empty.style.display = 'none';
        container.innerHTML = '';
        this.assembleDropped.forEach((item, i) => {
            const el = document.createElement('div');
            el.className = 'assemble-ordered-item';
            el.draggable = true;
            el.innerHTML = `
                <span class="assemble-order">${i + 1}</span>
                <code>${this.escapeHtml(item.text)}</code>
                <span class="assemble-controls">
                    <button type="button" class="assemble-move" data-act="up" aria-label="上移">↑</button>
                    <button type="button" class="assemble-move" data-act="down" aria-label="下移">↓</button>
                    <button type="button" class="assemble-remove" aria-label="移除">×</button>
                </span>
            `;
            el.querySelector('.assemble-remove').addEventListener('click', () => {
                this.assembleDropped.splice(i, 1);
                this.renderAssembleOrdered();
            });
            el.querySelector('[data-act="up"]').addEventListener('click', () => {
                if (i > 0) { [this.assembleDropped[i - 1], this.assembleDropped[i]] = [this.assembleDropped[i], this.assembleDropped[i - 1]]; this.renderAssembleOrdered(); }
            });
            el.querySelector('[data-act="down"]').addEventListener('click', () => {
                if (i < this.assembleDropped.length - 1) { [this.assembleDropped[i + 1], this.assembleDropped[i]] = [this.assembleDropped[i], this.assembleDropped[i + 1]]; this.renderAssembleOrdered(); }
            });
            el.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'ordered', index: i }));
            });
            el.addEventListener('dragover', (e) => e.preventDefault());
            el.addEventListener('drop', (e) => {
                e.preventDefault();
                try {
                    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                    if (data.source === 'palette') {
                        this.assembleDropped.splice(i, 0, { text: data.text });
                    } else if (data.source === 'ordered') {
                        const from = data.index;
                        const moved = this.assembleDropped.splice(from, 1)[0];
                        this.assembleDropped.splice(i, 0, moved);
                    }
                    this.renderAssembleOrdered();
                } catch (_) {}
            });
            container.appendChild(el);
        });

        // 拖放区整体接收（从面板拖入时追加到末尾）
        const dropZone = document.getElementById('assemble-drop');
        dropZone.ondragover = (e) => e.preventDefault();
        dropZone.ondrop = (e) => {
            e.preventDefault();
            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (data.source === 'palette') {
                    this.assembleDropped.push({ text: data.text });
                    this.renderAssembleOrdered();
                }
            } catch (_) {}
        };
    }

    async submitAssemble() {
        const m = this.currentLevel.assemble;
        const feedback = document.getElementById('assemble-feedback');
        const output = document.getElementById('assemble-output');
        if (this.assembleDropped.length === 0) {
            this.setFeedback(feedback, 'error', '请先把代码块拖拽到右侧，组成完整程序。');
            return;
        }
        const code = this.assembleDropped.map(b => b.text).join('\n');
        const btn = document.getElementById('submit-assemble');
        btn.disabled = true;
        output.className = 'run-output loading';
        output.textContent = '运行中…';
        try {
            const res = await this.runWithPy(code, m.stdin);
            this.showRunOutput(output, res.stdout, res.error);
            if (res.error) {
                this.setFeedback(feedback, 'error', m.errorFeedback + '（运行出错：' + res.error + '）');
            } else if (this.norm(res.stdout) === this.norm(m.expectedOutput)) {
                this.codeSolved.assemble = true;
                this.setFeedback(feedback, 'success', m.successFeedback);
                this.showCelebration();
            } else {
                this.setFeedback(feedback, 'error', m.errorFeedback);
            }
        } catch (e) {
            output.className = 'run-output error';
            output.textContent = `⚠️ ${e.message}`;
            this.setFeedback(feedback, 'error', m.errorFeedback);
        } finally {
            btn.disabled = false;
        }
    }

    // ===================== 配对分类 =====================
    renderMatch() {
        const m = this.currentLevel.match;
        document.getElementById('match-prompt').textContent = m.prompt;
        this.matchPairs = m.pairs;
        this.matchLeft = m.pairs.map((p, i) => ({ text: p.left, pairIndex: i }));
        // 打乱右侧
        this.matchRight = m.pairs.map((p, i) => ({ text: p.right, pairIndex: i }));
        for (let i = this.matchRight.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.matchRight[i], this.matchRight[j]] = [this.matchRight[j], this.matchRight[i]];
        }
        this.matchMapping = {};
        this.matchSelectedLeft = null;
        this.renderMatchColumns();
        this.setFeedback(document.getElementById('match-feedback'), '', '');
    }

    renderMatchColumns() {
        const left = document.getElementById('match-left');
        const right = document.getElementById('match-right');
        left.innerHTML = '';
        right.innerHTML = '';
        this.matchLeft.forEach((item, i) => {
            const el = document.createElement('div');
            el.className = 'match-item left' + (this.matchMapping[i] != null ? ' paired' : '');
            el.dataset.index = i;
            el.textContent = item.text;
            el.addEventListener('click', () => this.clickMatchLeft(i));
            left.appendChild(el);
        });
        this.matchRight.forEach((item, i) => {
            const pairedLeft = Object.keys(this.matchMapping).find(k => this.matchMapping[k] === i);
            const el = document.createElement('div');
            el.className = 'match-item right' + (pairedLeft != null ? ' paired' : '');
            el.dataset.index = i;
            el.textContent = item.text;
            el.addEventListener('click', () => this.clickMatchRight(i));
            right.appendChild(el);
        });
    }

    clickMatchLeft(i) {
        // 若已配对，点击则取消配对
        if (this.matchMapping[i] != null) {
            delete this.matchMapping[i];
            this.matchSelectedLeft = null;
            this.renderMatchColumns();
            return;
        }
        this.matchSelectedLeft = i;
        document.querySelectorAll('.match-item.left').forEach(el => el.classList.remove('selected'));
        const el = document.querySelector(`.match-item.left[data-index="${i}"]`);
        if (el) el.classList.add('selected');
    }

    clickMatchRight(i) {
        // 若已配对，点击取消
        const pairedLeft = Object.keys(this.matchMapping).find(k => this.matchMapping[k] === i);
        if (pairedLeft != null) {
            delete this.matchMapping[pairedLeft];
            this.renderMatchColumns();
            return;
        }
        if (this.matchSelectedLeft == null) return;
        const leftIdx = this.matchSelectedLeft;
        this.matchMapping[leftIdx] = i;
        this.matchSelectedLeft = null;
        this.renderMatchColumns();
    }

    submitMatch() {
        const m = this.currentLevel.match;
        const feedback = document.getElementById('match-feedback');
        if (Object.keys(this.matchMapping).length < this.matchPairs.length) {
            this.setFeedback(feedback, 'error', '请完成所有配对后再提交。');
            return;
        }
        let allCorrect = true;
        for (let leftIdx = 0; leftIdx < this.matchPairs.length; leftIdx++) {
            const rightIdx = this.matchMapping[leftIdx];
            // 右侧被选中项的原始 pairIndex 必须等于左侧项的原始序号
            const correct = this.matchRight[rightIdx].pairIndex === leftIdx;
            if (!correct) allCorrect = false;
        }
        if (allCorrect) {
            this.setFeedback(feedback, 'success', '配对全部正确！你已经厘清了这些概念。');
            this.showCelebration();
        } else {
            this.setFeedback(feedback, 'error', '还有配对不正确，仔细观察左右含义再试试。');
        }
    }

    // ===================== 完成庆祝 =====================
    showCelebration() {
        if (!this.completedLevels.includes(this.currentLevelId)) {
            this.completedLevels.push(this.currentLevelId);
            this.saveCompletedLevels();
            console.log('✅ 关卡完成，进度已保存:', this.currentLevelId);
        }
        const hint = document.createElement('div');
        hint.className = 'success-hint';
        hint.innerHTML = `关卡完成！`;
        document.body.appendChild(hint);
        setTimeout(() => hint.classList.add('show'), 50);
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
                    <h3>出错了</h3>
                    <p>${message}</p>
                    <a href="index.html" class="back-button">返回首页</a>
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LevelPage();
});
