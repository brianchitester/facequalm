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
    },
    friends: function() {
        var user = Meteor.user();
        if (user.profile.friends) {
            return user.profile.friends;
        }
        else return [];
    }
});

Template.profile.events({
    'click #change-name': function(){
        var name = $("#profilename").val();
        Meteor.users.update(
            {_id: Meteor.user()._id }, 
            {$set:{"profile.name":name}}
        );
    },
    'click #add-friend': function(){
        IonPopup.prompt({
            title: 'Add Friend',
            okType: 'button-calm',
            inputPlaceholder: 'Enter username',
            onOk: function(e, username) {
                Meteor.call('addFriend', username, function(error, results) {
                    if (error) {
                        IonPopup.alert({
                            title: 'Error',
                            template: error
                        });
                    }
                });
            }
        });
    }
});

