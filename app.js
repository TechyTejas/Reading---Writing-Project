const http = require('http');
const fs = require('fs');
const { parse } = require('path');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    // Check if 'message.txt' file exists
    fs.readFile('message.txt', (err, data) => {
      res.setHeader('Content-Type', 'text/html');
      res.write('<html>');
      res.write('<head><title>My First Page</title></head>');
      res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="Submit">Submit</button></form>');

      // If 'message.txt' exists, display its content
      if (!err) {
        res.write('<p>Message from file:</p>');
        res.write('<p>' + data + '</p>');
      }

      res.write('</html>');
      return res.end();
    });
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    return req.on('end', () => {
      const parseBody = Buffer.concat(body).toString();
      const message = parseBody.split('=')[1];

      fs.writeFile('message.txt', message, () => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }
});

server.listen(3000);
