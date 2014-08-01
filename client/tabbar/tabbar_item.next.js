class TabbarItem {
  constructor(name, icon, itemTemplate, contentTemplate, routeName, routeParams){
    this._name = name;
    this._template = contentTemplate;
    this._itemTemplate = itemTemplate;
    this._routeName = routeName;
    this._routeParams = routeParams;
    this._icon = icon;
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
    return this._tabbarController && this._tabbarController.getSelectedItem() === this;
  }

  getPath(){
    return Router.path(this._routeName, this._routeParams);
  }

  getItemTemplate(){
    return this._itemTemplate;
  }

  getIcon(){
    return this._icon;
  }
}

Template.tabbarItem.helpers({
  name: function(){
    var instance = UI._templateInstance();
    return instance.data.tabbarItem && instance.data.tabbarItem.getName() || null;
  },
  
  iconName: function(){
    var instance = UI._templateInstance();
    return instance.data.tabbarItem && instance.data.tabbarItem.getIcon() || null;
  },

  itemTemplate: function(){
    var instance = UI._templateInstance();
    return instance.data.tabbarItem && instance.data.tabbarItem.getItemTemplate() || null;    
  },

  selectedClass: function(){
    var instance = UI._templateInstance(),
        item = instance.data.tabbarItem;

    return item.isSelected() && 'tabbar-item--selected' || '';
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
