AccountsTemplates.configure({
    onLogoutHook: function() {
        Router.go('/');
    },
    enablePasswordChange: true
});

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

AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    required: true,
    func: function(value) {
        if (Meteor.isClient) {
            console.log("Validating username...");
            var self = this;
            Meteor.call("userExists", value, function(err, userExists) {
                if (!userExists)
                    self.setSuccess();
                else
                    self.setError(userExists);
                self.setValidating(false);
            });
            return;
        }
        // Server
        return Meteor.call("userExists", value);
    },
});