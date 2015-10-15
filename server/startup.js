Meteor.startup(function() {
    Meteor.publish("directory", function() {
        return Meteor.users.find({}, {
            fields: {
                emails: 1,
                profile: 1
            }
        });
    });
    return Meteor.methods({
        clearImages: function() {
            return Images.remove({});
        },
        clearGames: function() {
            return Games.remove({});
        }
    })
});