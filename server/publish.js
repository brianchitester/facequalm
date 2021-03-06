if (Meteor.isServer) {
    //Publish only the current user's account
    Meteor.publish("account", function(gameId) {
        var currentUser = this.userId;
        if(gameId) {
            var currentGame = Games.findOne({
                _id: gameId
            });
            if(currentGame) {
                return Meteor.users.find({
                    _id: {
                        $in: currentGame.userIds
                    }
                });
            }
        }
        return Meteor.users.find({
            _id: currentUser
        });
    });

    //Publish only the game's the user is listed in
    Meteor.publish("games", function() {
        var currentUser = this.userId;
        return Games.find({
            userIds: currentUser
        });
    });

    Meteor.publish("invites", function(gameId) {
        var currentUser = this.userId;
        if (gameId) {
            return Invites.find({
                gameId: gameId
            });
        } else {
            return Invites.find({
                userId: this.userId
            });
        }
    });

    //TODO - only return a game's images
    Meteor.publish("images", function() {
        return Images.find();
    });

    //Publish only the current game the user is viewing
    Meteor.publish("currentGame", function(id) {
        return Games.find({
            _id: id
        });
    });

    //Publish only the currentRound the user is viewing
    Meteor.publish("rounds", function(id) {
        var currentGame = Games.findOne({
            _id: id
        });
        return Rounds.find({
            gameId: id
        });
    });
}