const editor = document.getElementById('editor');

socket.on('doc update', function(newContent) {
  editor.value = newContent;
});

editor.addEventListener('input', function() {
  socket.emit('doc update', editor.value);
});
