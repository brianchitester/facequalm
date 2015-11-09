Router.route('/', {
    template: 'home',
    name: 'home',
    subscriptions: function() {
        return [Meteor.subscribe('games'), Meteor.subscribe('invites')];
    },
    waitOn: function() {
        return Meteor.subscribe('account');
    }, 
    action: function() {
        //Make users create an avatar if they haven't yet
        if(Meteor.user().avatarUrl) {
            this.render();
        } else {
            this.redirect('/studio');
        }
    }
});
Router.route('/register');
Router.route('/invite');
Router.route('/studio', {
    waitOn: function() {
        return Meteor.subscribe('account');
    }
});
Router.route('/upload/:_id', {
    template: 'upload',
    data: function() {
        var gameId = this.params._id;
        Meteor.call('joinGame', gameId);
        var currentGame = Games.findOne();
        return currentGame;
    },
    subscriptions: function() {
        return [Meteor.subscribe('currentGame', this.params._id), Meteor.subscribe('rounds', this.params._id)];
    },
    waitOn: function() {
        return [Meteor.subscribe('account', this.params._id), Meteor.subscribe('currentGame', this.params._id), Meteor.subscribe('rounds', this.params._id)];
    }
});
Router.route('/vote/:_id', {
    template: 'vote',
    subscriptions: function() {
        return [Meteor.subscribe('currentGame', this.params._id), Meteor.subscribe('rounds', this.params._id), Meteor.subscribe('images'), Meteor.subscribe('invites', this.params._id)];
    },
    waitOn: function() {
        return [Meteor.subscribe('account', this.params._id), Meteor.subscribe('currentGame', this.params._id), Meteor.subscribe('rounds', this.params._id)];
    }
});

Router.route('/result');

//Package to add current route name as a class on the body
Router.onBeforeAction('bodyClass');
Router.route('/profile');