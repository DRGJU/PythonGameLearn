// 关卡状态管理
let completedLevels = [1]; // 已完成的关卡
let currentLevel = 1;
let levelsData = [];

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

// 初始化游戏
function initGame() {
    generateLevelButtons();
    generateLevelContent();
    initLevelSelector();
    updateProgress();
    // 默认显示第一关
    switchLevel(1);
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
        } else if (!completedLevels.includes(level.id)) {
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
        levelDiv.id = `level${level.id}`;
        
        levelDiv.innerHTML = `
            <div class="level-header">
                <h2 class="level-title">${level.title}</h2>
                <p class="level-description">${level.description}</p>
            </div>
            
            <div class="learning-objectives">
                <h3>学习目标</h3>
                <ul>
                    ${level.objectives.map(obj => `<li>${obj}</li>`).join('')}
                </ul>
            </div>
            
            <div class="code-example">
                <h3>示例代码</h3>
                <pre>${escapeHtml(level.example)}</pre>
            </div>
            
            <div class="challenge">
                <h3>挑战任务</h3>
                <p>${escapeHtml(level.challenge)}</p>
                <textarea class="challenge-input" id="level${level.id}Input" rows="5" placeholder="请输入你的代码..."></textarea>
                <button class="submit-btn" onclick="checkLevel${level.id}()">提交答案</button>
                <div class="feedback" id="level${level.id}Feedback"></div>
            </div>
        `;
        
        contentContainer.appendChild(levelDiv);
    });
}

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
    document.getElementById('progressText').textContent = `完成进度: ${Math.round(progress)}%`;
}

// 初始化关卡选择器
function initLevelSelector() {
    const levelButtons = document.querySelectorAll('.level-btn');
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            const level = parseInt(this.dataset.level);
            if (completedLevels.includes(level) || level === completedLevels[completedLevels.length - 1] + 1) {
                switchLevel(level);
            }
        });
    });
}

// 切换关卡
function switchLevel(level) {
    // 隐藏所有关卡内容
    document.querySelectorAll('.level-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 显示当前关卡内容
    const currentLevelDiv = document.getElementById(`level${level}`);
    if (currentLevelDiv) {
        currentLevelDiv.classList.add('active');
    }
    
    // 更新按钮状态
    document.querySelectorAll('.level-btn').forEach(button => {
        const btnLevel = parseInt(button.dataset.level);
        button.classList.remove('active', 'locked');
        
        if (btnLevel === level) {
            button.classList.add('active');
        } else if (!completedLevels.includes(btnLevel) && btnLevel !== completedLevels[completedLevels.length - 1] + 1) {
            button.classList.add('locked');
        }
    });
    
    currentLevel = level;
}

// 完成关卡
function completeLevel(level) {
    if (!completedLevels.includes(level)) {
        completedLevels.push(level);
        completedLevels.sort((a, b) => a - b);
        updateProgress();
        
        // 解锁下一关
        if (level < levelsData.length) {
            const nextLevelBtn = document.querySelector(`.level-btn[data-level="${level + 1}"]`);
            if (nextLevelBtn) {
                nextLevelBtn.classList.remove('locked');
            }
        }
    }
}

// 关卡检查函数
function checkLevel1() {
    const input = document.getElementById('level1Input').value;
    const feedback = document.getElementById('level1Feedback');
    
    if (input.includes('print') && input.includes('=')) {
        feedback.className = 'feedback success';
        feedback.textContent = '恭喜你完成了关卡 1！';
        completeLevel(1);
    } else {
        feedback.className = 'feedback error';
        feedback.textContent = '请检查你的代码，确保使用了print()函数和变量赋值。';
    }
}

function checkLevel2() {
    const input = document.getElementById('level2Input').value;
    const feedback = document.getElementById('level2Feedback');
    
    if (input.includes('3.14') && input.includes('*') && input.includes('**')) {
        feedback.className = 'feedback success';
        feedback.textContent = '恭喜你完成了关卡 2！';
        completeLevel(2);
    } else {
        feedback.className = 'feedback error';
        feedback.textContent = '请检查你的代码，确保使用了π值和正确的计算公式。';
    }
}

function checkLevel3() {
    const input = document.getElementById('level3Input').value;
    const feedback = document.getElementById('level3Feedback');
    
    if (input.includes('if') && input.includes('elif') && input.includes('else')) {
        feedback.className = 'feedback success';
        feedback.textContent = '恭喜你完成了关卡 3！';
        completeLevel(3);
    } else {
        feedback.className = 'feedback error';
        feedback.textContent = '请检查你的代码，确保使用了if-elif-else语句。';
    }
}

function checkLevel4() {
    const input = document.getElementById('level4Input').value;
    const feedback = document.getElementById('level4Feedback');
    
    if ((input.includes('for') || input.includes('while')) && input.includes('+=')) {
        feedback.className = 'feedback success';
        feedback.textContent = '恭喜你完成了关卡 4！';
        completeLevel(4);
    } else {
        feedback.className = 'feedback error';
        feedback.textContent = '请检查你的代码，确保使用了循环和累加操作。';
    }
}

function checkLevel5() {
    const input = document.getElementById('level5Input').value;
    const feedback = document.getElementById('level5Feedback');
    
    if (input.includes('def') && input.includes('return')) {
        feedback.className = 'feedback success';
        feedback.textContent = '恭喜你完成了关卡 5！';
        completeLevel(5);
    } else {
        feedback.className = 'feedback error';
        feedback.textContent = '请检查你的代码，确保定义了函数并使用了return语句。';
    }
}

function checkLevel6() {
    const input = document.getElementById('level6Input').value;
    const feedback = document.getElementById('level6Feedback');
    
    if (input.includes('list') && input.includes('random') && input.includes('sum')) {
        feedback.className = 'feedback success';
        feedback.textContent = '恭喜你完成了关卡 6！';
        completeLevel(6);
    } else {
        feedback.className = 'feedback error';
        feedback.textContent = '请检查你的代码，确保使用了列表和随机数生成。';
    }
}

function checkLevel7() {
    const input = document.getElementById('level7Input').value;
    const feedback = document.getElementById('level7Feedback');
    
    if (input.includes('{') && input.includes(':') && input.includes('sum')) {
        feedback.className = 'feedback success';
        feedback.textContent = '恭喜你完成了关卡 7！';
        completeLevel(7);
    } else {
        feedback.className = 'feedback error';
        feedback.textContent = '请检查你的代码，确保使用了字典存储学生信息。';
    }
}

function checkLevel8() {
    const input = document.getElementById('level8Input').value;
    const feedback = document.getElementById('level8Feedback');
    
    if (input.includes('open') && input.includes('read') && input.includes('split')) {
        feedback.className = 'feedback success';
        feedback.textContent = '恭喜你完成了关卡 8！';
        completeLevel(8);
    } else {
        feedback.className = 'feedback error';
        feedback.textContent = '请检查你的代码，确保使用了文件读写操作。';
    }
}

function checkLevel9() {
    const input = document.getElementById('level9Input').value;
    const feedback = document.getElementById('level9Feedback');
    
    if (input.includes('try') && input.includes('except')) {
        feedback.className = 'feedback success';
        feedback.textContent = '恭喜你完成了关卡 9！';
        completeLevel(9);
    } else {
        feedback.className = 'feedback error';
        feedback.textContent = '请检查你的代码，确保使用了try-except语句。';
    }
}

function checkLevel10() {
    const input = document.getElementById('level10Input').value;
    const feedback = document.getElementById('level10Feedback');
    
    if (input.includes('def') && input.includes('if') && input.includes('input')) {
        feedback.className = 'feedback success';
        feedback.textContent = '恭喜你完成了关卡 10！你已经掌握了Python的基本技能！';
        completeLevel(10);
    } else {
        feedback.className = 'feedback error';
        feedback.textContent = '请检查你的代码，确保实现了一个完整的计算器程序。';
    }
}

// 初始化
window.onload = function() {
    loadLevelsData();
};
