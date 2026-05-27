// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔹 DOM加载完成，开始执行脚本');
  
  // 直接嵌入关卡数据
  const levelData = {
    id: 1,
    title: "关卡 1: 初识Python",
    description: "学习如何输出文字到屏幕，开始你的Python之旅！",
    objectives: ["了解Python的基本语法结构", "学会使用print()函数", "理解字符串的概念"],
    example: "# 输出文字\nprint(\"Hello, World!\")\nprint(\"欢迎来到编程世界！\")",
    challenge: "编写一个程序，输出\"你好，Python！\"和\"我准备好了！\"这两句话。",
    phaseName: "新手村"
  };
  
  console.log('📦 关卡数据:', levelData);
  
  // 查找容器
  const levelContent = document.getElementById('levelContent');
  console.log('🔍 容器元素:', levelContent);
  
  if (!levelContent) {
    console.error('❌ 容器不存在');
    // 在页面上显示错误信息
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'color: red; padding: 20px; background: rgba(239, 68, 68, 0.1); border-radius: 8px;';
    errorDiv.innerHTML = '<h3>❌ 错误：找不到关卡内容容器</h3><p>请检查HTML文件中是否有id="levelContent"的元素</p>';
    document.body.appendChild(errorDiv);
    return;
  }
  
  // 生成内容
  const content = `
    <div class="level-content active">
      <div class="level-header">
        <div class="level-phase-badge">${levelData.phaseName}</div>
        <h2 class="level-title">${levelData.title}</h2>
        <p class="level-description">${levelData.description}</p>
      </div>
      <div class="learning-objectives">
        <h3>📚 学习目标</h3>
        <ul>${levelData.objectives.map(obj => '<li>' + obj + '</li>').join('')}</ul>
      </div>
      <div class="code-example">
        <pre>${levelData.example}</pre>
      </div>
      <div class="challenge">
        <h3>🎯 挑战任务</h3>
        <p>${levelData.challenge}</p>
      </div>
    </div>
  `;
  
  // 更新页面
  levelContent.innerHTML = content;
  console.log('✅ 关卡内容已更新');
});