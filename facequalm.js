if (Meteor.isClient) {

  var context, canvas;
  Template.camera.onRendered(function(){
    canvas = $("#canvas")[0];
    context = canvas.getContext("2d");
    var video = $("#video")[0];

    var videoObj = {"video": true};
    var errBack = function(error) {
      console.log("Video capture error: ", error.code); 
    };

    if(navigator.getUserMedia) { // Standard
      navigator.getUserMedia(videoObj, function(stream) {
        video.src = stream;
        video.play();
      }, errBack);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
      navigator.webkitGetUserMedia(videoObj, function(stream){
        video.src = window.webkitURL.createObjectURL(stream);
        video.play();
      }, errBack);
    }
    else if(navigator.mozGetUserMedia) { // Firefox-prefixed
      navigator.mozGetUserMedia(videoObj, function(stream){
        video.src = window.URL.createObjectURL(stream);
        video.play();
      }, errBack);
    }
  })

  Template.camera.events({
    'click button' : function() {
        context.drawImage(video, 0, 0, 320, 240);
        // This is the data URL:
        console.log(canvas.toDataURL('image/png'))
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
