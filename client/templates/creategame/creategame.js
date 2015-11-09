var numRoundsDep = new Tracker.Dependency();
Template.createGame.helpers({
    friends: function() {
        var friends = Meteor.user().profile.friends;
        return friends ? friends : [];
    },
    numRounds: function() {
        numRoundsDep.depend();
        return parseInt($("#round-num-selector").val());
    }
});

Template.createGame.onRendered(function() {
    numRoundsDep.changed();
});

Template.createGame.events({
    'click #start-game': function() {
        var selectedFriends = $('input[type=checkbox]:checked');
        var config = {
            numRounds: parseInt($("#round-num-selector").val())
        };
        Meteor.call('createGame', Meteor.userId(), config, function(error, results) {
            if (error) {
                console.log(error.reason)
            } else {
                _.each(selectedFriends, function(friend) {
                    Meteor.call('inviteFriend', results, friend.value);
                });
                Router.go('/upload/' + results);
            }
        });
    },
    'change #round-num-selector, input #round-num-selector': function(e) {
        numRoundsDep.changed();
    },
    'click #find-friends': function() {
        IonPopup.prompt({
            title: 'Add Friend',
            okType: 'button-calm',
            inputPlaceholder: 'Enter username',
            onOk: function(e, username) {
                Meteor.call('addFriend', username, function(error, results) {
                    if (error) {
                        IonPopup.alert({
                            title: 'Error',
                            template: error
                        });
                    }
                });
            }
        });
    }
});