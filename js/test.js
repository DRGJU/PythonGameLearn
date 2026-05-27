console.log('测试脚本开始');

function test() {
  console.log('测试函数执行');
  
  // 等待DOM完全加载
  setTimeout(() => {
    const container = document.getElementById('levelContent');
    console.log('容器:', container);
    
    if (container) {
      container.innerHTML = '<h2 style="color: green;">✅ 关卡内容加载成功！</h2><p>这是测试内容</p>';
      console.log('内容已更新');
    } else {
      console.log('容器不存在');
      document.body.innerHTML += '<h2 style="color: red;">❌ 容器不存在</h2>';
    }
  }, 100);
}

// 尝试多种方式确保脚本执行
test();
document.addEventListener('DOMContentLoaded', test);
window.onload = test;