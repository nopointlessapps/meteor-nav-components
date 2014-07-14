/*global Router, Template */

Router.map(function(){
  this.route('members', {
    path: 'members/:id?/:subview?/:subid?/:subsubview?/:subsubid?',
    template: 'members',

    data: function(){
      var generateNavItem = function(template, path){
            return {template, path};
          },
          navigationStack = [ generateNavItem( Template.membersContent, Router.path("members") ) ];
    
      if( this.params.id !== undefined ){
        navigationStack.push(generateNavItem( Template.membersShow, Router.path("members", {id: this.params.id}) )); 
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
          {template: Template.groupsContent}
        ]
      };
    }
  });
});
