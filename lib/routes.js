Router.route('/', {
    template: 'home',
    name: 'home',
    subscriptions: function() {
        return Meteor.subscribe('games');
    },
    waitOn: function() {
        return Meteor.subscribe('account');
    }
});
Router.route('/register');
Router.route('/invite');
Router.route('/upload/:_id', {
    template: 'upload',
    data: function() {
        var gameId = this.params._id;
        Meteor.call('joinGame', gameId);
        var currentGame = Games.findOne();
        return currentGame;
    },
    subscriptions: function() {
        return [Meteor.subscribe('currentGame', this.params._id), Meteor.subscribe('rounds', this.params._id), Meteor.subscribe('images')];
    },
    waitOn: function() {
        return [Meteor.subscribe('currentGame', this.params._id), Meteor.subscribe('rounds', this.params._id)];
    }
});
Router.route('/vote');
Router.route('/result');

//Package to add current route name as a class on the body
Router.onBeforeAction('bodyClass');
Router.route('/profile');
