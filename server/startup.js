Meteor.startup(function () {
  return Meteor.methods({
    clearImages: function() {
      return Images.remove({});
    },
    clearImagesToMatch: function() {
      return ImagesToMatch.remove({});
    }
  })
});
