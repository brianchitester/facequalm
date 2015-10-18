    Template.home.helpers({
        games: function() {
            return Games.find().fetch();
        }
    });

    Template.home.events({
        'click button': function() {
            $.getJSON("http://uifaces.com/api/v1/random", function(data) {
                Meteor.call('createGame', Meteor.userId(), data.image_urls.epic, function(error, results) {
                    if (error) {
                        console.log(error.reason)
                    } else {
                        Router.go('/upload/' + results);
                    }
                });
            });
        }
    });