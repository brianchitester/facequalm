Images = new Mongo.Collection("images");
ImagesToMatch = new Mongo.Collection("imagesToMatch");

if (Meteor.isClient) {

  Template.body.helpers({
    storedImages: function() {
      return Images.find({});
    },
    imagesToMatch: function() {
      return ImagesToMatch.find({});
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
        Images.insert({
          imageSource: canvas.toDataURL('image/png'),
          numVotes: 0,
          createdAt: new Date()
        });
        console.log(canvas.toDataURL('image/png'))
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
        Meteor.call("clearImagesToMatch");
        ImagesToMatch.insert({
          url: data.image_urls.epic
        });
      });
    }
  });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    return Meteor.methods({
      clearImages: function() {
        return Images.remove({});
      },
      clearImagesToMatch: function() {
        return ImagesToMatch.remove({});
      }
    })
  });
