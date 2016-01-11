Template.upload.helpers({
    storedImages: function() {
        var currentGame = Games.findOne();
        var currentRound = Rounds.findOne({
            gameId: currentGame._id,
            roundNumber: currentGame.state
        });
        var imageIds = Object.keys(currentRound.imageToVotesMap);
        var images = Images.find({
            _id: {
                $in: imageIds
            }
        }).fetch();
        for (var i = 0; i < images.length; i++) {
            images[i].voteCount = currentRound.imageToVotesMap[images[i]._id];
        }
        return images;
    },
    matchUrl: function() {
        var currentGame = Games.findOne();
        var currentRound = Rounds.findOne({
            gameId: currentGame._id,
            roundNumber: currentGame.state
        });
        return currentRound.currentImage ? currentRound.currentImage : "";
    },
    users: function() {
        var currentGame = Games.findOne();
        return currentGame.userNames;
    },
    roundNumber: function() {
        var currentGame = Games.findOne();
        return currentGame.state;
    }
});

Template.photo.created = function() {
    // used to toggle video
    // only used in the browser
    this.takePicture = new ReactiveVar(false);
};

Template.photo.events({
    'click #snap': function(e, template) {
        if(Meteor.isCordova) {
            UploadCamera.cordovaCapture(function(data) {
                addImage(data);
            });
        } else {
            template.takePicture.set(true);
            UploadCamera.startBrowserCapture();
        }
    },
    // only called for browser camera
    'click #takePic': function(e, template) {
        addImage(UploadCamera.browserCapture());
        template.takePicture.set(false);
    }
});

Template.photo.helpers({
    showVideo: function() {
        return !Meteor.isCordova;
    },
    notTakingPic: function() {
        return !Template.instance().takePicture.get();
    }
});

var applyCrop = function(image, newTop, newLeft, height, width) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.height = height;
    canvas.width = width;
    context.drawImage(image, newLeft, newTop, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
};

//Crops an image using face detection to be a square
var cropImage = function(image){
    var promise = new Promise(function(resolve){
        SmartCrop.crop(image, {width: 100, height: 100, minScale: 1.0 }, function(result) { 
            var data = applyCrop(image, result.topCrop.y, result.topCrop.x, result.topCrop.height, result.topCrop.width);
            resolve(data);
        });
    });
    return promise;
};

var waitForImageLoad = function(imageUrl) {
    var promise = new Promise(function(resolve){
        var image = new Image();
        image.onload = function() {
            resolve(this);
        }
        image.src = imageUrl;
    });
    return promise;
};

var addImage = function(data) {
    var currentGame = Games.findOne();
    var currentRound = Rounds.findOne({
        gameId: currentGame._id,
        roundNumber: currentGame.state
    });

    waitForImageLoad(data).then(
        cropImage).then(function(data) {
            Meteor.call("addImage", currentRound._id, data, function(error, data) {
                if (error) {
                    console.log(error);
                } else {
                    Router.go("/vote/" + Games.findOne()._id);
                }
            });
    });
};
