const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;

// 简单的 MIME 类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// 安全HTTP头
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// 友好的404页面
const notFoundPage = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - 页面未找到</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
            color: #e6edf3;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            text-align: center;
            padding: 40px;
        }
        .error-code {
            font-size: 120px;
            font-weight: bold;
            background: linear-gradient(135deg, #58a6ff, #a371f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        h1 {
            font-size: 32px;
            margin: 20px 0;
            color: #f85149;
        }
        p {
            font-size: 18px;
            color: #8b949e;
            margin-bottom: 30px;
        }
        a {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #238636, #2ea043);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        a:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(46, 160, 67, 0.4);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">404</div>
        <h1>页面未找到</h1>
        <p>抱歉，您访问的页面不存在或已被移除</p>
        <a href="/">返回首页</a>
    </div>
</body>
</html>
`;

// 请求日志函数
function logRequest(method, url, statusCode, responseTime) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url} - ${statusCode} (${responseTime}ms)`);
}

// 改进的文件读取
function serveFile(filePath, contentType, res) {
  const startTime = Date.now();
  
  fs.readFile(filePath, (error, content) => {
    const responseTime = Date.now() - startTime;
    
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 
          'Content-Type': 'text/html',
          ...securityHeaders
        });
        res.end(notFoundPage, 'utf-8');
        logRequest('GET', filePath, 404, responseTime);
      } else {
        res.writeHead(500, { 
          'Content-Type': 'text/html',
          ...securityHeaders
        });
        res.end('<h1>服务器错误</h1><p>请稍后再试</p>', 'utf-8');
        logRequest('GET', filePath, 500, responseTime);
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(content),
        ...securityHeaders,
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(content, 'utf-8');
      logRequest('GET', filePath, 200, responseTime);
    }
  });
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  let extname = path.extname(filePath);
  let contentType = mimeTypes[extname] || 'application/octet-stream';
  
  serveFile(filePath, contentType, res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║     Python游戏化学习平台 - 服务器启动      ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`运行地址: http://localhost:${PORT}/`);
  console.log('按 Ctrl+C 停止服务器\n');
  console.log('服务器日志:');
  console.log('─────────────────────────────────────────────');
});

process.on('SIGTERM', () => {
  console.log('\n收到关闭信号，正在停止服务器...');
  server.close(() => {
    console.log('服务器已停止');
    process.exit(0);
  });
});
