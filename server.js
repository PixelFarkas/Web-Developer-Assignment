const http = require('http');
const path = require('path');
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const server = http.createServer((req, res) => {
  //console.log(`Request for ${req.url} received.`);

  if (req.url === '/') {
    const filePath = path.join(__dirname, 'index.html');
    const fileContents = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(fileContents);
    res.end();
  } else {
    const filePath = path.join(__dirname, req.url);
    const fileExtension = path.extname(filePath);
    const contentTypeMap = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.txt': 'text/html',
      '.js': 'text/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
    };
    const contentType = contentTypeMap[fileExtension] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('404 Not Found\n');
          res.end();
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.write('500 Internal Server Error\n');
          res.end();
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(content);
        res.end();
      }
    });
  }
});


app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  fs.readFile('users.txt', 'utf8', (err, data) => {
    if (err) throw err;
    const users = data.split('\n').map(line => line.split(','));
    const foundUser = users.find(user => user[0] === username && user[1] === password);
    if (foundUser) {
      res.render('welcome', { username: foundUser[0] });
    } else {
      res.render('error');
    }
  });
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});