class TabbarItem {
  constructor(name, template, path){
    this._name = name;
    this._template = template;
    this._path = path;
  }

  getName(){
    return this._name;
  }

  setTabbarController(tabbarController){
    this._tabbarController = tabbarController;
  }

  getTabbarController(){
    return this._tabbarController;
  }

  getTemplate(){
    return this._template;
  }

  select(){
    if( this._tabbarController ){
      this._tabbarController.setSelectedItem(this);
    }
  }

  isSelected(){
    return this._tabbarController.getSelectedItem() === this;
  }

  getPath(){
    return this._path;
  }
}

Template.tabbarItem.helpers({
  name: function(){
    var instance = UI._templateInstance();
    return instance.data.tabbarItem && instance.data.tabbarItem.getName() || null;
  },

  selectedClass: function(){
    var instance = UI._templateInstance(),
        item = instance.data.tabbarItem;

    return item.isSelected() && 'selected' || '';
  }
});

Template.tabbarItem.events({
  "click": function(e, template){
    var data = template.data,
        tabbarItem = data && data.tabbarItem;
   
    tabbarItem && tabbarItem.select();
  }
});


export var TabbarItem;
