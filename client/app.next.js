Template.app.helpers({
  items: function(){
    var items = [ 
      new TabbarItem("Members", Template.members, "/members"),
      new TabbarItem("Calendar", Template.groups, "/groups")
    ];

    return items;
  }
});
