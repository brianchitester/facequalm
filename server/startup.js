Meteor.startup(function() {

    Meteor.publish("account", function() {
        var currentUser = this.userId;
        return Meteor.users.find({
            _id: currentUser
        });
    });
    Meteor.publish("games", function() {
        var currentUser = this.userId;
        return Games.find({
            users: currentUser
        });
    });
    Meteor.publish("currentGame", function(id) {
        return Games.find({
            _id: id
        });
    });
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
        createGame: function(id) {
            return Games.insert({
                creator: id,
                users: [id],
                currentImage: "",
                images: []
            });
        },
        joinGame: function() {

        },
        newSession: function(id, faceUrl) {
            var currentGame = Games.findOne({
                _id: id
            });
            currentGame.currentImage = faceUrl;
            Games.update({
                _id: id
            }, currentGame);
        },
        addImage: function(id, imageUrl) {
            var currentGame = Games.findOne({
                _id: id
            });
            currentGame.images.push({
                imageSource: imageUrl,
                numVotes: 0,
                createdAt: new Date(),
                creator: this.userId
            });
            Games.update({
                _id: id
            }, currentGame);
        }
    })
});