
class TabbarController {
  
  constructor(){
    this._itemsDeps = new Deps.Dependency();
    this._selectedItemDeps = new Deps.Dependency();    
  }

  setItems(items = []){
    var that = this,
        selectedIndex = 0,
        fixPath = function(path){
          if( path[path.length] !== "/" ){
            path = path+"/";
          }
          return path;
        };

    this._items = items;
    this._items.forEach(function(item, index){
      var path = item.getPath(),
          routerPath = Router.current().path;
       
      if( typeof path === "string" ){
        path = fixPath(path);
        routerPath = fixPath(routerPath);
        
        item.setTabbarController(that);
        if( routerPath.startsWith( path ) ){
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
  var that = this;
  this.autorun(function(){
    var tabbarController = that._tabbarController;
    tabbarController.setItems(that.data.items());
  });

    this.autorun(function(){
        var tabbarController = that._tabbarController,
            selectedItem = tabbarController.getSelectedItem(),
            template = selectedItem && selectedItem.getTemplate(),
            targetDom = that.data.target && document.querySelector(that.data.target);

        if( tabbarController._currentRenderedView ){
            Blaze.remove(tabbarController._currentRenderedView);
        }

        if( template && targetDom ){
            tabbarController._currentRenderedView = Blaze.renderWithData(template, {}, targetDom);
        }
    });
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

  shouldRenderAll: function(){
      var instance = UI._templateInstance();
      return instance && instance.data.target === undefined || null
  }
});

Template.tabbar.events({
});

