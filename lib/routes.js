Router.route('/', {
    template: 'home',
    name: 'home',
    waitOn: function() {
        return Meteor.subscribe('directory');
    }
});
Router.route('/register');
Router.route('/invite');
Router.route('/upload/:_id', {
    template: 'upload',
    data: function() {
        var gameId = this.params._id;
        var currentGame = Games.findOne({
            _id: gameId
        });

        Session.set('game', currentGame);
        return currentGame;
    },
    waitOn: function() {
        return Meteor.subscribe('directory');
    }
});
Router.route('/vote');
Router.route('/result');