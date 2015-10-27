if (Meteor.isClient) {
    Template.avatarimage.helpers({
        avatarUrl: function() {
            var user = Meteor.user();
            if (user && user.avatarUrl) {
                return user.avatarUrl;
            }
        }
    });
}
