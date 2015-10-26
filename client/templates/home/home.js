    var gameDep = new Tracker.Dependency();


    Template.home.events({
        'click #pending': function() {
            $('.tab-item').removeClass('active');
            $('#pending').toggleClass('active');
            gameDep.changed();
        },
        'click #active': function() {
            $('.tab-item').removeClass('active');
            $('#active').toggleClass('active');
            gameDep.changed();
        },
        'click #completed': function() {
            $('.tab-item').removeClass('active');
            $('#completed').toggleClass('active');
            gameDep.changed();
        }
    });

    Template.gameList.onRendered(function() {
        $('#pending').toggleClass('active');
        gameDep.changed();
    });

    Template.gameList.helpers({
        games: function() {
            gameDep.depend();
            var selection = $('.active').attr('id');
            if (selection === 'active') {
                return Games.find().fetch();
            } else {
                return Invites.find().fetch();
            }
        },
        pending: function() {
            return $('.active').attr('id') == 'pending';
        },
        active: function() {
            return $('.active').attr('id') == 'active';
        },
        completed: function() {
            return $('.active').attr('id') == 'completed';
        }
    });

    Template.gameList.events({
        'click button': function(e) {
            Meteor.call('joinGame', $(e.currentTarget).attr('id'), function(error, results){
                if(error){
                    console.log(error);
                }
            });
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
            var selectedFriends = $('input[type=checkbox]:checked');
            $.getJSON("http://uifaces.com/api/v1/random", function(data) {
                Meteor.call('createGame', Meteor.userId(), data.image_urls.epic, function(error, results) {
                    if (error) {
                        console.log(error.reason)
                    } else {
                        _.each(selectedFriends, function(friend) {
                            Meteor.call('inviteFriend', results, friend.value);
                        });
                        Router.go('/upload/' + results);
                    }
                });
            });
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