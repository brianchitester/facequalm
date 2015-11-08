if (Meteor.isServer) {
    //Server "helper" methods to call asynchronously from the client
    var faceIndex = -1;
    var getFaceUrl = function() {
        var randomImages = ["10-reasons-denzel-washington-is-badass-561610606-may-11-2012-600x400.jpg",
            "1292815989_eli.jpg",
            "1348717742_lil-wayne-strip-club-50k-dollar-bills-funny-faces-3.jpg",
            "270b9348571e7efd168669c6c781f412.jpg",
            "30e380d312eb0cf8d1b0ab8d6eee92a7.jpg",
            "52af99b77d9317858d34eb519130cc2d.jpg",
            "5f7e2c6433ee5811e092f80d8a437545.jpg",
            "6671f67ca67557f6a8a267afd0576a1d.jpg",
            "71872AA8BFEE65E258FD21E76D84E.jpg",
            "BillCosbyHimself4-450.jpg",
            "Cuban-Makes-Funny-Face.jpg",
            "FunnyFaces201007121648120034.jpg",
            "Hillary-Clinton-Funny-Faces.jpg",
            "James-Franco-Funny-Face.jpg",
            "Jim+Carrey+Jim+Carrey+Ophelia+Lovibond+Set+DG_DOJuEY0Rl.jpg",
            "Jim-Carey.jpg",
            "Wwekwyf.jpg",
            "a032a4d1b35de511c24f3c7bfa069189.jpg",
            "amiley.jpg",
            "bill-cosby-silly-face-jpg.jpg",
            "c4ded2ce3f83183cc7557f22c8d35cda_fullsize.jpg",
            "c6fe9246b3b547678057678111548e18.jpg",
            "celeb-expressions-141.jpg",
            "celebrity_funny_faces_pictures.jpg",
            "donald-trump1.jpg",
            "funny-celebrity-faces-23.jpg",
            "funny-celebrity-faces-5.jpg",
            "funny-obama-faces-strange-0.jpg",
            "funnyface2.jpg",
            "how_could_this_face_lie_to_you.jpg",
            "hqdefault.jpg",
            "jim-carreys-best-facial-expressions-of-the-90s-1-348-1358448944-5_big.jpg",
            "katy-perry-funny-face-7.jpg",
            "lebron-s-funniest-faces672620871-may-17-2012-600x416.jpg",
            "miley-cyrus-funny-faces-14-1377697818-large-article-0.jpg",
            "nicolas_cage_thumb.jpg",
            "opera-facials-0.jpg",
            "rexfeatures_1822822ag.jpg",
            "s-KANYE-WEST-DOESNT-SMILE-large.jpg",
            "sport-smile-7.jpg",
            "tumblr_m5zd0xnZ8Q1qzy531o1_500.jpg"
        ];

        var path = '/facepics/'; // default path here

        if (faceIndex < 0) {
            faceIndex = Math.floor(Math.random() * randomImages.length);
        } else {
            faceIndex = faceIndex >= randomImages.length ? 0 : faceIndex + 1;
        }
        var img = randomImages[faceIndex];
        return path + img;
    };
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
        createAvatar: function(dataUrl) {
            var currentUser = Meteor.user();
            Meteor.users.update({
                _id: currentUser._id
            }, {
                $set: {
                    avatarUrl: dataUrl
                }
            });
        },
        //Creates new game with the given user ID as the creator
        //TODO - Take config param
        createGame: function(userId) {
            var gameId = Games.insert({
                creatorId: userId,
                creatorName: Meteor.user().username,
                userIds: [userId],
                userNames: [Meteor.user().username],
                state: 1,
                config: {},
                name: ''
            });

            Rounds.insert({
                gameId: gameId,
                roundNumber: 1,
                imageToVotesMap: {},
                currentImage: getFaceUrl(),
                state: "upload",
                result: []
            });

            return gameId;
        },
        //Returns the game's current phase for a given user...i.e., uploading/voting/results
        getGamePhaseForUser: function(gameId) {
            var currentGame = Games.findOne({
                _id: gameId
            });
            var currentRound = Rounds.findOne({
                gameId: gameId,
                roundNumber: currentGame.state
            });
            var imageIds = Object.keys(currentRound.imageToVotesMap);
            var userImage = Images.findOne({
                _id: {
                    $in: imageIds
                },
                creatorId: Meteor.userId()
            });
            if (userImage) {
                return "vote";
            } else {
                return "upload";
            }
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
                currentGame.userNames.push(Meteor.user().username);
                Games.update({
                    _id: gameId
                }, currentGame);

                Invites.remove({
                    userId: this.userId,
                    gameId: gameId
                });
            } else {
                throw new Meteor.Error("game-not-found", 'Game Not Found', 'that game doesnt seem to exist');
            }
        },
        leaveGame: function(gameId) {
            var currentGame = Games.findOne({
                _id: gameId
            });
            if (currentGame) {
                Games.remove({
                    _id: gameId
                })
            }
        },
        inviteFriend: function(gameId, friendId) {
            var friend = Meteor.users.findOne({
                _id: friendId
            });
            Invites.insert({
                gameId: gameId,
                creator: Meteor.userId,
                creatorName: Meteor.user().username,
                userId: friendId,
                userName: friend.username
            });
        },
        //Takes game _id and url for user's to match
        //Creates new game round, and updates game to that round
        newSession: function(gameId) {
            var currentGame = Games.findOne({
                _id: gameId
            });
            Rounds.insert({
                gameId: gameId,
                roundNumber: currentGame.state + 1,
                imageToVotesMap: {},
                currentImage: getFaceUrl(),
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
                creatorId: this.userId,
                creatorUserName: Meteor.user().username
            });
            currentRound.imageToVotesMap[imageId] = [];
            Rounds.update({
                _id: roundId
            }, currentRound);
        },
        voteImage: function(roundId, imageId) {
            var currentRound = Rounds.findOne({
                _id: roundId
            });
            var currentGame = Games.findOne({
                _id: currentRound.gameId
            });
            var voteMap = currentRound.imageToVotesMap;
            var images = Object.keys(voteMap);
            //Reduction that returns  an array of all userIds that have voted.
            var votedUsers = _.reduce(images, function(memo, imageId) {
                return _.union(memo, voteMap[imageId])
            }, []);
            if (!_.contains(votedUsers, Meteor.userId())) {
                currentRound.imageToVotesMap[imageId].push(Meteor.userId());
                Rounds.update({
                    _id: roundId
                }, currentRound);

                var invitees = _.pluck(Invites.find({
                    gameId: currentRound.gameId
                }).fetch(), 'userName');

                images = Object.keys(currentRound.imageToVotesMap);

                var allUsers = _.union(currentGame.userNames, invitees);
                if (votedUsers.length === allUsers.length - 1) {
                    currentRound.result.push(_.reduce(images, function(memo, image) {
                        return currentRound.imageToVotesMap[memo].length > currentRound.imageToVotesMap[image].length ? memo : image;
                    }, images[0]));
                    Rounds.update({
                        _id: roundId
                    }, currentRound);
                }
            } else {
                //TODO - Remove existing vote
                throw new Meteor.Error("already-voted", 'User already voted', 'you cannot vote more than once');

            }
        }
    });

}