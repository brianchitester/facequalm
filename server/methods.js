if (Meteor.isServer) {
    //Server "helper" methods to call asynchronously from the client
    return Meteor.methods({
        userExists: function(username) {
            return !!Meteor.users.findOne({
                username: username
            });
        },
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
        addFriend: function(username) {
            var currentUser = Meteor.user();
            if (currentUser.username === username) {
                throw new Meteor.Error("cant-add-self", "User attempted to friend self", 'the user can not add itself to its own friend list.');
            }
            var friend = Meteor.users.findOne({
                username: username
            });

            if (friend && !_.contains(currentUser.friends, friend)) {
                currentUser.profile.friends.push(friend);
                Meteor.users.update({
                    _id: currentUser._id
                }, {
                    $set: {
                        profile: currentUser.profile
                    }
                });
            } else if (friend) {
                throw new Meteor.Error("friend-exists", 'Friend exists', 'you are already friends with this user');
            } else {
                throw new Meteor.Error("user-doesnt-exist", 'User does not exist', 'the user you entered does not exist');
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

                Invites.remove({
                    gameId: gameId
                });
            } else {
                throw new Meteor.Error("game-not-found", 'Game Not Found', 'that game doesnt seem to exist');
            }
        },
        inviteFriend: function(gameId, friendId) {
            Invites.insert({
                gameId: gameId,
                creator: Meteor.userId,
                userId: friendId
            });
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
    });

}