    Template.home.helpers({
        counter: function() {
            return Session.get('counter');
        }
    });

    Template.home.helpers({
        games: function() {
            var userAccount = Meteor.users.findOne({
                _id: Meteor.userId()
            });
            if (userAccount.profile && userAccount.profile.games && Array.isArray(userAccount.profile.games)) {

            } else {
                Meteor.users.update({
                    _id: userAccount._id
                }, {
                    $set: {"profile.games": []}
                });

            }

            return userAccount.profile.games;

        }
    });

    Template.home.events({
        'click button': function() {
            var gameId = Games.insert({
                creator: Meteor.user()._id,
                users: [Meteor.user()._id],
                currentImage: "",
                images: []
            });
            var gameList = Meteor.user().profile.games;
            gameList.push(gameId);
            Meteor.users.update({
                    _id: Meteor.user()._id
                }, {
                    $set: {"profile.games": gameList}
                });
            Router.go('/upload/' + gameId);
        }
    });