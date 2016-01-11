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
    'click #create-avatar': function(){
        Router.go('/studio');
    },
    'click #add-friend': function(){
        IonPopup.show({
            title: 'Add Friend',
            okType: 'button-calm',
            template: '<input id=findUser type=text value="Enter username"></input><div id="add-friend-error-message" style="margin-top: 10px; color: red;"></div>',
            buttons: [{ 
                text: 'Cancel',
                type: 'button-default',
                onTap: function(e) {
                  return true;
                }
            }, {
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    username = $("#findUser").val();
                    Meteor.call('addFriend', username, function(error, results) {
                        if (error) {
                            e.preventDefault();
                            $("#add-friend-error-message").html("User does not exist.");
                            return false;
                        }
                        else {
                            IonPopup.close();
                            return true;
                        } 
                    });
                }
            }]
        });
    }
});

