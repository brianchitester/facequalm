Router.configure({
    layoutTemplate: 'main',
    notFoundTemplate : '404'
});

// c+s
Images = new Mongo.Collection("images");
ImagesToMatch = new Mongo.Collection("imagesToMatch");

if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
