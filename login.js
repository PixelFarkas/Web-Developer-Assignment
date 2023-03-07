const fs = require('fs');
const readline = require('readline');
const pageUrl = 'http://localhost:3000/';
const filePath = '/users.txt';

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity,
});

const users = {};

rl.on('line', (line) => {
  const fields = line.split(',');

  users[fields[0]] = {
    username: fields[0],
    password: fields[1],
  };
});

rl.on('close', () => {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    if (users.hasOwnProperty(username)) {
      if (password === users[username].password) {
        window.location.href = pageUrl;
        console.log(`Succasefull login.`);
      } else {
        console.log('Incorrect password.');
      }
    } else {
      console.log('User not found.');
    }
  });
});