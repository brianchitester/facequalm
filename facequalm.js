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

// c+s
Images = new Mongo.Collection("images");
ImagesToMatch = new Mongo.Collection("imagesToMatch");

if (Meteor.isClient) {
    // counter starts at 0
    Template.main.helpers({
        signedInAs : function() {
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

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
