if (Meteor.isServer) {
    Meteor.startup(function() {
        //Clear games on server start
        Games.remove({});
        //Publish only the current user's account
        Meteor.publish("account", function() {
            var currentUser = this.userId;
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

        //Server "helper" methods to call asynchronously from the client
        return Meteor.methods({
            getUserName: function(id) {
                var user = Meteor.users.findOne({
                    _id: id
                });
                if (user) {
                    if (user.username) {
                        return user.username;
                    } else if (user.profile && user.profile.name) {
                        return user.profile.name;
                    } else if (user.emails && user.emails[0]) {
                        return user.emails[0].address;
                    } else {
                        return "Signed In";
                    }
                }
            },
            clearImages: function() {
                return Images.remove({});
            },
            clearGames: function() {
                return Games.remove({});
            },
            //Creates new game with the given user ID as the creator
            //TODO - Take config param
            createGame: function(userId, faceUrl) {
                var gameId = Games.insert({
                    creatorId: userId,
                    userIds: [userId],
                    state: 1,
                    config: {},
                    name: ''
                });

                Rounds.insert({
                    gameId: gameId,
                    roundNumber: 1,
                    imageToVotesMap: {},
                    currentImage: faceUrl,
                    state: "upload",
                    result: []
                });

                return gameId;
            },
            //Adds the client's user to the game
            joinGame: function(gameId) {
                var currentGame = Games.findOne({
                    _id: gameId,
                    userIds: {
                        $nin: [this.userId]
                    }
                });
                if (currentGame) {
                    currentGame.userIds.push(this.userId);
                    Games.update({
                        _id: gameId
                    }, currentGame);
                }
            },
            //Takes game _id and url for user's to match
            //Creates new game round, and updates game to that round
            newSession: function(gameId, faceUrl) {
                var currentGame = Games.findOne({
                    _id: gameId
                });
                Rounds.insert({
                    gameId: gameId,
                    roundNumber: currentGame.state + 1,
                    imageToVotesMap: {},
                    currentImage: faceUrl,
                    state: "upload",
                    result: []
                });
                currentGame.state++;
                Games.update({
                    _id: gameId
                }, currentGame);
            },
            //Takes URL and round ID
            //Creates new image and adds image to round
            addImage: function(roundId, imageUrl) {
                var currentRound = Rounds.findOne({
                    _id: roundId
                });
                var imageId = Images.insert({
                    imageSource: imageUrl,
                    createdAt: new Date(),
                    creatorId: this.userId
                });
                currentRound.imageToVotesMap[imageId] = 0;
                Rounds.update({
                    _id: roundId
                }, currentRound);
            },
            voteImage: function(roundId, imageId) {
                var currentRound = Rounds.findOne({
                    _id: roundId
                });
                currentRound.imageToVotesMap[imageId]++;
                Rounds.update({
                    _id: roundId
                }, currentRound);
            }
        })
    });
}