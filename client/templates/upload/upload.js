Template.upload.helpers({
  storedImages: function() {
    var currentGame = Games.findOne();
    return currentGame.images;
  },
  matchUrl: function() {
    var currentGame = Games.findOne();
    return currentGame.currentImage;
  }
});

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
      video.src = window.URL.createObjectURL(stream);
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
      var currentGame = Games.findOne();
      Meteor.call('addImage', currentGame._id, canvas.toDataURL('image/png'));
  }
});


Template.storedImage.events({
  'click button' : function(e) {
    Images.update({
      _id: $(e.currentTarget).data().id
    },
    {
      $inc: { numVotes: 1 }
    });
  }
});

Template.newGame.events({
  'click button': function() {
    Meteor.call("clearImages");
    $.getJSON("http://uifaces.com/api/v1/random", function(data) {
      Meteor.call('newSession', Games.findOne()._id, data.image_urls.epic);
    });
  }
});

