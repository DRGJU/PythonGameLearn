(function() {
  'use strict';

  // 关卡状态管理
  let completedLevels = [];
  let currentLevel = 1;
  let levelsData = [];

  // HTML转义函数
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 更新进度条
  function updateProgress() {
    const progress = (completedLevels.length / levelsData.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = '完成进度: ' + Math.round(progress) + '%';
  }

  // 生成关卡按钮
  function generateLevelButtons() {
    const selector = document.getElementById('levelSelector');
    selector.innerHTML = '';
    
    levelsData.forEach(level => {
      const button = document.createElement('button');
      button.className = 'level-btn';
      button.dataset.level = level.id;
      button.textContent = level.title;
      
      if (level.id === 1) {
        button.classList.add('active');
      } else if (!completedLevels.includes(level.id) && !(level.id === completedLevels.length + 1)) {
        button.classList.add('locked');
      }
      
      selector.appendChild(button);
    });
  }

  // 生成关卡内容
  function generateLevelContent() {
    const contentContainer = document.getElementById('levelContent');
    contentContainer.innerHTML = '';
    
    levelsData.forEach(level => {
      const levelDiv = document.createElement('div');
      levelDiv.className = 'level-content';
      levelDiv.id = 'level' + level.id;
      
      levelDiv.innerHTML = 
        '<div class="level-header">' +
          '<h2 class="level-title">' + level.title + '</h2>' +
          '<p class="level-description">' + level.description + '</p>' +
        '</div>' +
        
        '<div class="learning-objectives">' +
          '<h3>学习目标</h3>' +
          '<ul>' + level.objectives.map(function(obj) { return '<li>' + obj + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        
        '<div class="code-example">' +
          '<h3>示例代码</h3>' +
          '<pre>' + escapeHtml(level.example) + '</pre>' +
        '</div>' +
        
        '<div class="challenge">' +
          '<h3>挑战任务</h3>' +
          '<p>' + escapeHtml(level.challenge) + '</p>' +
          '<textarea class="challenge-input" id="level' + level.id + 'Input" rows="5" placeholder="请输入你的代码..."></textarea>' +
          '<button class="submit-btn" data-level-id="' + level.id + '">提交答案</button>' +
          '<div class="feedback" id="level' + level.id + 'Feedback"></div>' +
        '</div>';
      
      contentContainer.appendChild(levelDiv);
    });
  }

  // 初始化关卡选择器
  function initLevelSelector() {
    const levelButtons = document.querySelectorAll('.level-btn');
    levelButtons.forEach(button => {
      button.addEventListener('click', function() {
        const level = parseInt(this.dataset.level);
        if (completedLevels.includes(level) || level === completedLevels.length + 1) {
          switchLevel(level);
        }
      });
    });
  }

  // 初始化提交按钮事件监听
  function initSubmitButtons() {
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('submit-btn')) {
        const levelId = parseInt(e.target.dataset.levelId);
        checkLevel(levelId);
      }
    });
  }

  // 切换关卡
  function switchLevel(level) {
    document.querySelectorAll('.level-content').forEach(content => {
      content.classList.remove('active');
    });
    
    const currentLevelDiv = document.getElementById('level' + level);
    if (currentLevelDiv) {
      currentLevelDiv.classList.add('active');
    }
    
    document.querySelectorAll('.level-btn').forEach(button => {
      const btnLevel = parseInt(button.dataset.level);
      button.classList.remove('active', 'locked');
      
      if (btnLevel === level) {
        button.classList.add('active');
      } else if (!completedLevels.includes(btnLevel) && btnLevel !== completedLevels.length + 1) {
        button.classList.add('locked');
      }
    });
    
    currentLevel = level;
  }

  // 完成关卡
  function completeLevel(level) {
    if (!completedLevels.includes(level)) {
      completedLevels.push(level);
      completedLevels.sort(function(a, b) { return a - b; });
      updateProgress();
      
      if (level < levelsData.length) {
        const nextLevelBtn = document.querySelector('.level-btn[data-level="' + (level + 1) + '"]');
        if (nextLevelBtn) {
          nextLevelBtn.classList.remove('locked');
        }
      }
    }
  }

  // 通用关卡检查函数
  function checkLevel(levelId) {
    const levelData = levelsData.find(function(l) { return l.id === levelId; });
    if (!levelData || !levelData.validation) {
      return;
    }
    
    const input = document.getElementById('level' + levelId + 'Input').value;
    const feedback = document.getElementById('level' + levelId + 'Feedback');
    const validation = levelData.validation;
    const requiredKeywords = validation.requiredKeywords;
    const matchAll = validation.matchAll !== false;
    
    let isValid;
    if (matchAll) {
      isValid = requiredKeywords.every(function(keyword) {
        return input.includes(keyword);
      });
    } else {
      isValid = requiredKeywords.some(function(keyword) {
        return input.includes(keyword);
      });
    }
    
    if (isValid) {
      feedback.className = 'feedback success';
      feedback.textContent = validation.successFeedback;
      completeLevel(levelId);
    } else {
      feedback.className = 'feedback error';
      feedback.textContent = validation.errorFeedback;
    }
  }

  // 初始化游戏
  function initGame() {
    generateLevelButtons();
    generateLevelContent();
    initLevelSelector();
    initSubmitButtons();
    updateProgress();
    switchLevel(1);
  }

  // 加载关卡数据
  async function loadLevelsData() {
    try {
      const response = await fetch('data/levels.json');
      const data = await response.json();
      levelsData = data.levels;
      initGame();
    } catch (error) {
      console.error('加载关卡数据失败:', error);
    }
  }

  // 初始化
  window.addEventListener('DOMContentLoaded', loadLevelsData);
})();
