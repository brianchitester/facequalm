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

var context, canvas;

Template.photo.events({
    'click #snap': function() {
        var cameraOptions = {
            height: 240,
            width: 240
        };

        MeteorCamera.getPicture(cameraOptions, function(error, data) {
            if (!error) {
                var currentGame = Games.findOne();
                var currentRound = Rounds.findOne({
                    gameId: currentGame._id,
                    roundNumber: currentGame.state
                });

                Meteor.call('addImage', currentRound._id, data, function(eror, data) {
                    if (error) {
                        console.log(error);
                    } else {
                        Router.go('/vote/' + Games.findOne()._id);
                    }
                });
            } else {
                console.log(error);
            }
        });
    }
});


Template.newGame.events({
    'click button': function() {
        Meteor.call('newSession', Games.findOne()._id, function() {
            Router.go('/upload/' + Games.findOne()._id);
        });
    }
});

Template.leaveGame.events({
    'click button': function() {
        Meteor.call('leaveGame', Games.findOne()._id, function() {
            Router.go('/');
        });
    }
});