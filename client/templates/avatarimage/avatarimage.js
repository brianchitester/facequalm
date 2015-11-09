if (Meteor.isClient) {
    Template.avatarimage.helpers({
        avatarUrl: function() {
        	if(this.userName) {
	        	return Meteor.users.findOne({                                     // 5
	            	username: this.userName                                        // 6
	        	}).avatarUrl;
        	}
            //If no username is passed in use current user
            var user = Meteor.user();
            if (user && user.avatarUrl) {
                return user.avatarUrl;
            }
        }
    });
}
