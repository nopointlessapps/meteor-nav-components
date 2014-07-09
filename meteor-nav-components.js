if (Meteor.isClient) {
  Template.hello.helpers({
    greeting: function () {
      return "Welcome to meteor-nav-components.";
    },

    title: function(){
      return "TITLE";
    }
  });

  Template.hello.events({
    'click input': function (e, template) {
      // template data, if any, is available in 'this'
      var stack = template.data._navigationItem.getNavigationStack();
      stack.push(new NavigationItem(Template.hello));
    }
  });


  Router.map(function(){
    this.route('navigationStack', {
      path: '/:view?/:id?/:subview?/:subid?/:subsubview?/:subsubid?',
           
    });

  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
