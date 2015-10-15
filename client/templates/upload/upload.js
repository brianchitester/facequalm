Template.upload.helpers({
  storedImages: function() {
    var currentGame = Games.findOne({_id: Session.get('game')._id});
    return currentGame.images;
  },
  matchUrl: function() {
    var currentGame = Games.findOne({_id: Session.get('game')._id});
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
      // This is the data URL:
      var currentGame = Games.findOne({_id: Session.get('game')._id});
      currentGame.images.push({
        imageSource: canvas.toDataURL('image/png'),
        numVotes: 0,
        createdAt: new Date(),
        creator: Meteor.user().profile.name || Meteor.userId()
      });
      Games.update({_id: currentGame._id}, currentGame);
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
    window.alert("New game has begun; you have EXACTLY one minute to take a selfie and vote on other peoples.");
    $.getJSON("http://uifaces.com/api/v1/random", function(data) {
      var currentGame = Games.findOne({_id: Session.get('game')._id});
      currentGame.currentImage =  data.image_urls.epic;
      Games.update({_id: currentGame._id}, currentGame);
    });
  }
});

