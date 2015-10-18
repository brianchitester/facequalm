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
    subscriptions: function() {
        return [Meteor.subscribe('currentGame', this.params._id), Meteor.subscribe('rounds', this.params._id), Meteor.subscribe('images')];
    },
    waitOn : function(){
         return [Meteor.subscribe('currentGame', this.params._id), Meteor.subscribe('rounds', this.params._id)];
    }
});
Router.route('/vote');
Router.route('/result');
