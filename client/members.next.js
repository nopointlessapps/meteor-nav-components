/*global Template */

Template.membersContent.helpers({
  title: function(){
    return 'Members';
  }
});

Template.membersShow.helpers({
  title: function(){
    var id = Router.current().params.id;
    return `show ${id}`;
  }
});

Template.groupsContent.helpers({
  title: function(){
    return 'Groups';
  }
});

