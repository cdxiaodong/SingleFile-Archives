const axios = require('axios');
const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const githubRepo = 'cdxiaodong/SingleFile-Archives';
const githubToken = process.env.GITHUB_TOKEN;
const currentDir = __dirname;

// 从GitHub API获取HTML文件列表
async function getHtmlFilesFromGithub() {
    try {
        const response = await axios.get(`https://api.github.com/repos/${githubRepo}/contents`, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        });
        const files = response.data.filter(file => file.name.endsWith('.html'));
        return files.map(file => file.name);
    } catch (error) {
        console.error('Error fetching files from GitHub:', error);
        return [];
    }
}

// 创建并返回index.html的内容
async function generateIndexHtml() {
    const htmlFiles = await getHtmlFilesFromGithub();
    if (!htmlFiles.length) return '<h1>Error fetching GitHub repo data</h1>';

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
                            <li class="list-group-item"><a href="https://www.cdxiaodong.life">Home</a></li>
                            <li class="list-group-item"><a href="https://github.com/cdxiaodong">Github</a></li>
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

    for (const file of htmlFiles) {
        const encodedFile = encodeURIComponent(file);
        indexContent += `<li class="list-group-item"><a href="/${encodedFile}" target="_blank">${file}</a></li>\n`;
    }

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
app.get('/', async (req, res) => {
    const indexHtml = await generateIndexHtml();
    res.send(indexHtml);
});

// 提供文件服务
app.get('/:fileName', (req, res) => {
    const fileName = decodeURIComponent(req.params.fileName);
    const filePath = `./${fileName}`;
    console.log('Requesting file:', filePath); // 调试日志
    if (fs.existsSync(filePath)) {
        res.sendFile(path.resolve(filePath));
    } else {
        res.status(404).send('404 Not Found');
    }
});



module.exports = app;
