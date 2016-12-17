
'use strict'
const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


const fs = require('fs');
const crypto = require('crypto');


app.use(express.static(__dirname + '/public'));
app.use(fileUpload());
app.use(morgan('combined'));

app.set('views', __dirname + '/views')
app.set('view engine', 'pug');


app.get('/', (req, res) => {
    res.render('upload');
});

app.post('/upload', (req, res) => {
  if (!req.files) {
    res.send('No files were uploaded.');
    return;
  }
  var file = req.files.file;
  const sha256 = crypto.createHash('sha256');
  sha256.update(file.data);
  const hash = sha256.digest('hex').slice(0,10)
  const file_dir = __dirname + '/public/pdf/' + hash + '.pdf';
  console.log('upload=' + file_dir);
  if(!fs.existsSync(file_dir)){
    file.mv(file_dir, (err) => {
      if(err){
        res.status(500).send(err);
      } else {
        res.send({hash: hash});
      }
    });
  } else {
    res.send({hash: hash});
  }
});


app.get('/:file', (req, res) =>  {
  res.render('index',{file: req.params.file, controller: Boolean(req.query.controller)});
});

let port = process.env.PORT || 8000;
server.listen(port, () =>  {
  console.log(`Example app listening on port ${port}!`);
});


io.on('connection', (socket) => {
  const file = socket.handshake.query.file;
  socket.join(file);
    socket.on('move', (page) => {
         socket.broadcast.to(file).emit('move', page);
    });
    socket.on('message', (message) => {
      //高さをランダムに計算
      //表示する秒数もランダム
      var top = Math.floor( Math.random() * 100 );
      if(top >= 90){
        top = 90;
      }
      var marqueeSec = Math.floor( Math.random() * 12 );
      if(marqueeSec <= 6) {
        marqueeSec = 6
      }
      io.to(file).emit('message', {text: message, top: top, sec: marqueeSec});
    });
});
