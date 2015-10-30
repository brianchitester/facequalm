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
            var randomImages = ["10-reasons-denzel-washington-is-badass-561610606-may-11-2012-600x400.jpg",
                "52af99b77d9317858d34eb519130cc2d.jpg",
                "5f7e2c6433ee5811e092f80d8a437545.jpg",
                "FunnyFaces201007121648120034.jpg",
                "Jessie J's facial expressions on The Voice.jpg",
                "amiley.jpg",
                "c4ded2ce3f83183cc7557f22c8d35cda_fullsize.jpg",
                "celeb-expressions-141.jpg",
                "celebrity_funny_faces_pictures.jpg",
                "funny-celebrity-faces-23.jpg",
                "funny-celebrity-faces-5.jpg",
                "funny-obama-faces-strange-0.jpg",
                "jim-carreys-best-facial-expressions-of-the-90s-1-348-1358448944-5_big.jpg",
                "katy-perry-funny-face-7.jpg",
                "miley-cyrus-funny-faces-14-1377697818-large-article-0.jpg",
                "opera-facials-0.jpg",
                "rexfeatures_1822822ag.jpg",
                "s-KANYE-WEST-DOESNT-SMILE-large.jpg"];

                var path = '/facepics/'; // default path here
                var num = Math.floor( Math.random() * randomImages.length );
                var img = randomImages[ num ];
                var imgStr = path + img;

                Meteor.call('createGame', Meteor.userId(), function(error, results) {
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