/*global Router, Template */

Router.map(function(){
  this.route('/', {
    action: function(){
      this.redirect('/members');
    }
  });
  this.route('members', {
    path: 'members/:id?/:subview?/:subid?/:subsubview?/:subsubid?',
//    template: 'members',

    data: function(){
      var generateNavItem = function(template, path){
            return {template, path};
          },
          navigationStack = [ generateNavItem( Template.membersContent, Router.path("members") ) ];
    
      if( this.params.id !== undefined ){
        navigationStack.push(generateNavItem( Template.membersShow, Router.path("members", {id: this.params.id}) )); 
      }

      return {navigationStack: navigationStack};
    },

    template: 'app'
  });
  this.route('groups', {
    path: 'groups/:id?/:subview?/:subid?/:subsubview?/:subsubid?',
    template: 'app',

    data: function(){
      var generateNavItem = function(template, path){
        return {template, path};
      },
      navigationStack = [ generateNavItem( Template.groupsContent, Router.path("groups") ) ];

      if( this.params.id !== undefined ){
        navigationStack.push(generateNavItem( Template.groupsShow, Router.path("groups", {id: this.params.id}) )); 
      }

      return {navigationStack};
    },
  });
});
