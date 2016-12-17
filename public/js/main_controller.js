((exports) => {
  function initializedEvent(socket, controller) {
    document.getElementById('js-prev').addEventListener('click', function(){
        console.log('test');
       var prevReturn = controller.prevPage();
       if(prevReturn){
        socket.emit('move',controller.pageNum);
       }
    });
    document.getElementById('js-next').addEventListener('click', function(){
        var nextReturn = controller.nextPage();
        if(nextReturn) {
            socket.emit('move',controller.pageNum);
        }
    });

    window.addEventListener("resize", function (event) {
        controller.fitItSize();
    });
    document.onkeydown = function (event) {
        var kc = event.keyCode;
        if(exports.main.isWriting) {
            return;
        }
        if (event.shiftKey || event.ctrlKey || event.metaKey) {
            return;
        }
        if (kc === 37 || kc === 40 || kc === 75 || kc === 65) {
            // left, down, K, A
            event.preventDefault();
            var prevReturn = controller.prevPage();
            if(prevReturn){
                socket.emit('move',controller.pageNum);
            }
        } else if (kc === 38 || kc === 39 || kc === 74 || kc === 83) {
            // up, right, J, S
            event.preventDefault();
            var nextReturn = controller.nextPage();
            if(nextReturn){
                socket.emit('move',controller.pageNum);
            }
        }

    };
  }
  exports.initializedEvent = (socket, controller)=>{initializedEvent(socket, controller)};
})(window);