Router.configure({
    layoutTemplate: 'main',
    notFoundTemplate: '404'
});

Router.onBeforeAction(function() {
    if (!Meteor.userId()) {
        this.render('register');
    } else {
        this.next();
    }
});

if (Meteor.isClient) {
    Template.main.helpers({
        signedInAs: function() {
            var user = Meteor.user();
            if (user) {
                if (user.username) {
                    return user.username;
                } else if (user.profile && user.profile.name) {
                    return user.profile.name;
                } else if (user.emails && user.emails[0]) {
                    return user.emails[0].address;
                } else {
                    return "Signed In";
                }
            }
        }
    });
}
