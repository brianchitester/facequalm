if (Meteor.isServer) {
    Meteor.startup(function() {
        //Clear games on server start
        Games.remove({});
        Invites.remove({});
        Images.remove({});
        //Code to add fields to user custom profile object.
        //Note - Everytime this is changed, we should wipe out the existing user collection
        Accounts.onCreateUser(function(options, user) {
            var customProfile = new Object();
            customProfile.friends = [];
            user.profile = customProfile;
            return user;
        });
    });
}