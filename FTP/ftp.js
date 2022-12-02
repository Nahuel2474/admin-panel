require('dotenv').config()
const Client = require('ftp');
const fs = require('fs')
const foo = 'foo.txt'
const c = new Client();

// connect to ftp server
function ConnectToFtp(){
  c.connect({
      host: process.env.HOST,
      port: 21,
      user: process.env.USER_FTP,
      password: process.env.PASS,
      debug: console.log
  });
}

module.exports = {ftpConnect:ConnectToFtp, c:c}
