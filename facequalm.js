AccountsTemplates.configure({
    onLogoutHook: function() {
        Router.go('/');
    },
    enablePasswordChange: true
});

Router.configure({
    layoutTemplate: 'main',
    notFoundTemplate: '404'
});

Router.configure({
  loadingTemplate: 'loading'
});

Router.onBeforeAction(function() {
    if (!Meteor.userId()) {
        this.render('register');
    } else {
        this.next();
    }
});