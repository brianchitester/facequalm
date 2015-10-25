    Template.home.helpers({
        games: function() {
            return Games.find().fetch();
        }
    });

    Template.inviteFriends.helpers({
        friends: function() {
            var friends = Meteor.user().profile.friends;
            return friends ? friends : [];
        }
    });

    Template.inviteFriends.events({
        'click #start-game': function() {
            var selectedFriends;
            $.getJSON("http://uifaces.com/api/v1/random", function(data) {
                Meteor.call('createGame', Meteor.userId(), data.image_urls.epic, function(error, results) {
                    if (error) {
                        console.log(error.reason)
                    } else {
                        selectedFriends = $('input[type=checkbox]:checked');
                        _.each(selectedFriends, function(friend) {
                            Meteor.call('inviteFriend', results, friend.val());
                        });
                        Router.go('/upload/' + results);
                    }
                });
            });
        }
    });


    Template.inviteFriends.events({
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