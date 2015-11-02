Template.vote.helpers({
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
            images[i].voteCount = currentRound.imageToVotesMap[images[i]._id].length;
        }
        //For all invited users that haven't uploaded, push out placeholder images
        var invitees = _.pluck(Invites.find().fetch(), 'userName');
        var allUsers = _.union(currentGame.userNames, invitees);
        _.each(allUsers, function(user) {
            if (!_.findWhere(images, {
                creatorUserName: user
            })) {
                images.push({
                    imageSource: "",
                    createdAt: new Date(),
                    creatorId: "",
                    creatorUserName: user
                });
            }
        });
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
        var invitees = _.pluck(Invites.find().fetch(), 'userName');
        return _.union(currentGame.userNames, invitees);
    },
    roundNumber: function() {
        var currentGame = Games.findOne();
        return currentGame.state;
    },
    results: function() {
        var currentGame = Games.findOne();
        var currentRound = Rounds.findOne({
            gameId: currentGame._id,
            roundNumber: currentGame.state
        });
        if(currentRound.result[0]){
            return Images.findOne({
                _id: currentRound.result[0]
            });
        }
        return "";
    }
});


Template.storedImage.events({
    'click .vote-button': function(e) {
        var currentGame = Games.findOne();
        var currentRound = Rounds.findOne({
            gameId: currentGame._id,
            roundNumber: currentGame.state
        });
        Meteor.call("voteImage", currentRound._id, $(e.currentTarget).data().id);
        $(e.currentTarget).parent().addClass('selected');
    }
});

//highlight the picture you voted for
Template.storedImage.onRendered(function() {
    var currentGame = Games.findOne();
    var currentRound = Rounds.findOne({
        gameId: currentGame._id,
        roundNumber: currentGame.state
    });
    var imageIds = Object.keys(currentRound.imageToVotesMap);
    for (var i = 0; i < imageIds.length; i++) {
        if (_.contains(currentRound.imageToVotesMap[imageIds[i]], Meteor.userId())) {
            $('a[data-id=' + imageIds[i] + ']').parent().addClass('selected');
        }
    }
});