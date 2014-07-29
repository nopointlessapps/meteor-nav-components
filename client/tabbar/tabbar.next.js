
class TabbarController {
  
  constructor(){
    this._itemsDeps = new Deps.Dependency();
    this._selectedItemDeps = new Deps.Dependency();    
  }

  setItems(items = []){
    var that = this,
        selectedIndex = 0;

    this._items = items;
    this._items.forEach(function(item, index){
      var path = item.getPath();
       
      if( typeof path === "string" ){
        if( path[path.length] !== "/" ){
          path = path+"/";
        }

        item.setTabbarController(that);
        if( Router.current().path.startsWith( path ) ){
          selectedIndex = index;
        }
      }
    });


    this._itemsDeps.changed();
    this.setSelectedItemIndex(selectedIndex, false);
  }

  getItems(){
    this._itemsDeps.depend();
    return this._items;
  }

  getSelectedItem(){
    this._selectedItemDeps.depend();
    return this._items && this._items[this._selectedItemIndex] || null;
  }

  setSelectedItem(item, goToPath=true){
    var indexOfSelectedItem = this._items.indexOf(item);
    if( indexOfSelectedItem !== -1 ){
      this.setSelectedItemIndex(indexOfSelectedItem, goToPath);
    } 
  }

  setSelectedItemIndex(index, goToPath){
    var path = null;

    if( index < this._items.length && index >= 0 ){
      this._selectedItemIndex = index;
      this._selectedItemDeps.changed();

      if( goToPath ){
        path = this._items[index].getPath();
        Router.go(path);
      }
    }
  }
}

Template.tabbar.created = function(){
  var tabbarController = new TabbarController();  
  this._tabbarController = tabbarController;
};

Template.tabbar.rendered = function(){
  var tabbarController = this._tabbarController;
  tabbarController.setItems(this.data.items);
};

Template.tabbar.helpers({

  tabbarItems: function(){
    var instance = UI._templateInstance(),
    controller =  instance && instance._tabbarController;

    return controller && controller.getItems() || null;
  },

  selectedItemTemplate: function(){
    var instance = UI._templateInstance(),
    controller =  instance && instance._tabbarController,
    selectedItem = controller && controller.getSelectedItem();

    return selectedItem && selectedItem.getTemplate() || null;
  },

  tabbarController: function(){
    debugger
  }
});

Template.tabbar.events({
});

