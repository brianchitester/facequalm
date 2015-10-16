    Template.home.helpers({
        games: function() {
            return Games.find().fetch();
        }
    });

    Template.home.events({
        'click button': function() {
            Meteor.call('createGame', Meteor.userId(), function(error, results) {
                if (error) {
                    console.log(error.reason)
                } else {
                    Router.go('/upload/' + results);
                }
            });

        }
    });