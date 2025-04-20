const app = require('express')();
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('./server.key'), // replace it with your key path
    cert: fs.readFileSync('./server.crt'), // replace it with your certificate path
}

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Hello, HTTPS World!');
}).listen(3000, () => {
  console.log('Server is running on port 3000');
});