const fs = require('fs');
const path = require('path');
const express = require('express');
const { JSDOM } = require('jsdom');

const app = express();

// 读取当前目录下的所有 HTML 文件
function getHtmlFiles() {
    const files = fs.readdirSync('.').filter(file => file.endsWith('.html') && file !== 'index.html');
    console.log('HTML Files:', files); // 调试日志
    return files;
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
        <title>CD's favorite Files</title>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {
                background-color: #f5f8fa;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .container {
                margin-top: 20px;
            }
            .list-group-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border: none;
                border-bottom: 1px solid #e1e8ed;
            }
            .list-group-item a {
                text-decoration: none;
                color: #1da1f2;
                font-weight: bold;
            }
            .list-group-item:hover {
                background-color: #f5f8fa;
            }
            .header {
                font-size: 1.5em;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .sidebar {
                background-color: #fff;
                border: 1px solid #e1e8ed;
                padding: 20px;
                margin-bottom: 20px;
            }
            .sidebar h5 {
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-3">
                    <div class="sidebar">
                        <h5>Navigation</h5>
                        <ul class="list-group">
                            <li class="list-group-item"><a href="#">Home</a></li>
                            <li class="list-group-item"><a href="#">Explore</a></li>
                            <li class="list-group-item"><a href="#">Notifications</a></li>
                            <li class="list-group-item"><a href="#">Messages</a></li>
                            <li class="list-group-item"><a href="#">Bookmarks</a></li>
                            <li class="list-group-item"><a href="#">Lists</a></li>
                            <li class="list-group-item"><a href="#">Profile</a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="header">Index of HTML Files</div>
                    <ul class="list-group">
    `;

    htmlFiles.forEach(file => {
        const title = getTitle(file);
        const encodedFile = encodeURIComponent(file);  // 对文件名进行URL编码
        indexContent += `<li class="list-group-item"><a href="${encodedFile}">${title}</a></li>\n`;
    });

    indexContent += `
                    </ul>
                </div>
                <div class="col-md-3">
                    <div class="sidebar">
                        <h5>What's happening</h5>
                        <p>Some trending topics...</p>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    </body>
    </html>
    `;

    return indexContent;
}

// 处理根路径请求
app.get('/', (req, res) => {
    res.send(generateIndexHtml());
});

// 处理HTML文件请求
app.get('/:fileName', (req, res) => {
    const filePath = path.join(__dirname, decodeURIComponent(req.params.fileName));
    console.log('Requesting file:', filePath); // 调试日志
    if (fs.existsSync(filePath) && filePath.endsWith('.html')) {
        res.sendFile(path.resolve(filePath));
    } else {
        res.status(404).send('404 Not Found');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
module.exports = app;