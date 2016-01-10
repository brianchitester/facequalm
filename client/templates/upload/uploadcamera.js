UploadCamera = {
  cordovaCapture: function(callback) {
    var cameraOptions = {
      height: 480,
      width: 480,
      cameraDirection: 1,
      quality: 75
    };

    MeteorCamera.getPicture(cameraOptions, function(error, data) {
      if (error)  {
        console.log(error);
      } else {
        callback(data);
      }
    });
  },

  localStreamTrack: null,

  startBrowserCapture: function() {
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia;
    var video = document.querySelector("video");
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, function(stream) {
          UploadCamera.localStreamTrack = stream.getVideoTracks()[0];  
          video.src = window.URL.createObjectURL(stream);
        }, function(error) {
            console.log("getUserMedia failed");
        });
    }
  },

  browserCapture: function() {
    var video = document.querySelector("video");
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    UploadCamera.localStreamTrack.stop();
    return canvas.toDataURL();
  },

};