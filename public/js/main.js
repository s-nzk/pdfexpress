((exports) =>{

  var main = exports.main = {};
  main.isWriting = false;

  'use strict'
  var marqueeBox = document.querySelector('#marquee');
  var socket = io.connect('', {query: 'file=' + pdf});

  
  

  socket.on('connect', function(){
      setup();
      //send message
      var message = document.querySelector('#message');
      message.onkeydown = function(event){
          if(event.keyCode === 13 && message.value !== ''){
              socket.emit('message', message.value.substr(0,100));
              message.value = '';
          }
      };

      //isWriting
      message.onfocus = function(){
        main.isWriting = true;
      }
      message.onblur = function(){
        main.isWriting = false;
      }


      //receive message
      socket.on('message', function(message){

          var p = document.createElement('p');
          p.innerText = message.text;
          p.style.top = message.top + '%';
          p.style.animationDuration = message.sec + 'S';
          marqueeBox.appendChild(p);
          p.addEventListener('animationend', function(){
              console.log('animation end!');
              marqueeBox.removeChild(this);
          });
          p.addEventListener('webkitAnimationEnd', function(){
              console.log('webkitAnimation end!');
              marqueeBox.removeChild(this);
          });
      });
  });

  function setup(){
      var container = document.getElementById('pdf-container');
      var controller = new PDFJSController({
          container: container,
          pdfjsDistDir: "/pdfjs-dist/"
      });
      var PDFURL = '/pdf/' + pdf + ".pdf";

      controller.loadDocument(PDFURL).then(initializedEvent(socket, controller)).catch(function (error) {
          console.error(error);
      });
      exports.controller = controller;
  }

  function getCornerColor(context) {
      var canvasColor = context.getImageData(0, 0, 1, 1);
      var pixels = canvasColor.data;
      var r = pixels[0];
      var g = pixels[1];
      var b = pixels[2];
      return "rgb(" + r + ',' + g + ',' + b + ")";
  }
})(window);
