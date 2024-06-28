const myVideo = document.getElementById('myVideo');
const userVideo = document.getElementById('userVideo');
const callButton = document.getElementById('call-button');

let peer;

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
  myVideo.srcObject = stream;

  socket.on('call-user', (signal) => {
    peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('accept-call', signal);
    });

    peer.on('stream', (userStream) => {
      userVideo.srcObject = userStream;
    });

    peer.signal(signal);
  });

  callButton.addEventListener('click', () => {
    peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: myVideo.srcObject,
    });

    peer.on('signal', (signal) => {
      socket.emit('call-user', signal);
    });

    peer.on('stream', (userStream) => {
      userVideo.srcObject = userStream;
    });
  });

  socket.on('call-accepted', (signal) => {
    peer.signal(signal);
  });
});
