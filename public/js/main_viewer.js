((exports) => {

  function initializedEvent(socket, controller) {
      socket.on('move', function(page){
        controller._queueRenderPage(page);
        controller.pageNum = page;
      });
      document.getElementById('js-prev').addEventListener('click', controller.prevPage.bind(controller));
      document.getElementById('js-next').addEventListener('click', controller.nextPage.bind(controller));

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
              controller.prevPage();
          } else if (kc === 38 || kc === 39 || kc === 74 || kc === 83) {
              // up, right, J, S
              event.preventDefault();
              controller.nextPage();
          }

      };
  }
  exports.initializedEvent = (socket, controller)=>{initializedEvent(socket, controller)};
})(window);