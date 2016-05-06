var gameDep = new Tracker.Dependency();

//HOME TEMPLATE
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
    },
    'click .enter-game': function(e) {
        var targetGameId = $(e.currentTarget).attr('id');
        Meteor.call('getGamePhaseForUser', targetGameId, function(error, results) {
            if (error) {
                console.log(error);
            } else {
                Router.go('/' + results + '/' +
                    targetGameId);
            }
        });
    }
});

//GAME LIST TEMPLATE
Template.gameList.onRendered(function() {
    $('#pending').toggleClass('active');
    gameDep.changed();
});

Template.gameList.helpers({
    games: function() {
        gameDep.depend();
        var selection = $('.active').attr('id');
        if (selection === 'active') {

            var gameList = Games.find().fetch();
            
            gameList.forEach((game) => {
                game.dateCreated = computeTimeAllotted(game.dateCreated);
            });
            return gameList;

        } else {
            var invitesList = Invites.find().fetch();
            
            invitesList.forEach((invite) => {
                invite.dateCreated = computeTimeAllotted(invite.dateCreated);
            });
            return invitesList;
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
    },
    tabSelected: function() {
        gameDep.depend();
        return $('.active').attr('id');
    }
});

Template.gameList.events({
    'click #joinGame': function(e) {
        Router.go("/upload/" + $(e.target).attr("gameId"));
    }
});

var computeTimeAllotted = (date) => { 
    var postTime = date;
    var currentTime = new Date();

    var timeDiff = currentTime - postTime;
    var msec = timeDiff;
    var dd = Math.floor(msec / 1000 / 60 / 60 / 24);
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    if (dd) {
        return dd + " days ago"
    } else {
        return hh ? hh + " hours and " + mm + " minutes ago" : mm + " minutes ago";
    }
};
