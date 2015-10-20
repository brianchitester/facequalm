Template.profile.helpers({
    user: function() {
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

Template.profile.events({
    'click #password-reset': function(){
        var oldp = $("#oldp").val();
        var newp = $("#newp").val();
        Accounts.changePassword(oldp, newp);
    }
});

