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
        IonPopup.show({
            title: 'Add Friend',
            okType: 'button-calm',
            template: '<input id=findUser type=text value="Enter username"></input><div id="add-friend-error-message" style="margin-top: 10px; color: red;"></div>',
            buttons: [{ 
                text: 'Cancel',
                type: 'button-default',
                onTap: function(e) {
                  return true;
                }
            }, {
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    username = $("#findUser").val();
                    Meteor.call('addFriend', username, function(error, results) {
                        if (error) {
                            e.preventDefault();
                            $("#add-friend-error-message").html("User does not exist.");
                            return false;
                        }
                        else {
                            IonPopup.close();
                            return true;
                        } 
                    });
                }
            }]
        });
    }
});