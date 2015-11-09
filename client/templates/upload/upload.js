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
    },
});

var addImage = function(data) {
    var currentGame = Games.findOne();
    var currentRound = Rounds.findOne({
        gameId: currentGame._id,
        roundNumber: currentGame.state
    });
    Meteor.call("addImage", currentRound._id, data, function(error, data) {
        if (error) {
            console.log(error);
        } else {
            Router.go("/vote/" + Games.findOne()._id);
        }
    });
};
