Meteor.startup(function() {
    if(Meteor.isCordova) {
        window.alert = navigator.notification.alert;
    }

    Push.addListener("message", function(notification) {
        // Called on every message
        console.log(JSON.stringify(notification));
    });
});
