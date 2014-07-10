/*global Router, Template */

Router.map(function(){
  this.route('members', {
    path: 'members/:id?/:subview?/:subid?/:subsubview?/:subsubid?',
    template: 'members',

    data: function(){
      var navigationStack = [Template.membersContent];
    
      if( this.params.id !== undefined ){
        debugger
        navigationStack.push(Template.membersShow); 
      }

      return {navigationStackTemplates: navigationStack};
    }
  });
  this.route('groups', {
    path: 'groups/:id?/:subview?/:subid?/:subsubview?/:subsubid?',
    template: 'groups',

    data: function(){
      return {
        navigationStackTemplates: [
          Template.groupsContent
        ]
      };
    }
  });
});
