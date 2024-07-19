const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// 读取当前目录下的所有 HTML 文件
function getHtmlFiles() {
    return fs.readdirSync('.').filter(file => file.endsWith('.html') && file !== 'index.html');
}

// 提取 HTML 文件的标题
function getTitle(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(content);
    const title = dom.window.document.querySelector('title');
    return title ? title.textContent : 'No Title';
}

// 创建并返回 index.html 的内容
function generateIndexHtml() {
    const htmlFiles = getHtmlFiles();
    let indexContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Index of HTML Files</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
        }
        h1 {
            font-size: 24px;
            color: #333;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            margin: 10px 0;
        }
        a {
            text-decoration: none;
            color: #007bff;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>Index of HTML Files</h1>
    <ul>
`;

    htmlFiles.forEach(file => {
        const title = getTitle(file);
        indexContent += `<li><a href="${file}">${title}</a></li>\n`;
    });

    indexContent += `
    </ul>
</body>
</html>
`;

    return indexContent;
}

// 处理传入的请求
module.exports = (req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(generateIndexHtml());
    } else {
        const filePath = path.join('.', req.url);
        if (fs.existsSync(filePath) && filePath.endsWith('.html')) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fs.readFileSync(filePath, 'utf-8'));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }
};
