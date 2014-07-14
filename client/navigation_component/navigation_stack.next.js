/*global Deps, Template, NavigationItem, UI, $ */

class NavigationStack {
 
  constructor(){
    this._navigationStack = [];
    this._navigationDeps = new Deps.Dependency();
  }

  setStack(newStack=[]){
    var that = this;
    
    this._navigationStack = newStack.slice(); //clone array

    this._navigationStack.forEach(function(item){
      item.setNavigationStack(that);
    });

    this._navigationDeps.changed();
  }

  push(navigationItem){
    this._navigationStack.push(navigationItem);
    navigationItem.setNavigationStack(this);
    this._navigationDeps.changed();
  }

  pop(){
    var navigationItem = this._navigationStack.pop();
    navigationItem.setNavigationStack(null);    
    this._navigationDeps.changed();
    IronLocation.pushState ({}, "", this.getTopNavigationItem().getPath(), true);
  }

  getTopNavigationItem(){
    this._navigationDeps.depend();
    return this._navigationStack[this._navigationStack.length-1] || null;
  }

  renderStack(template){
    var navStack = template._navigationStack,
        topItem = this.getTopNavigationItem(),
        container = null,
        renderedTemplateToPush = null;
    
    if( topItem ){
      container = template.find(".container");
      $(template.find(".container > .navigation-item")).remove();      
      renderedTemplateToPush = topItem.render();
      UI.insert(renderedTemplateToPush, template.find(".container"));

      console.log(this._navigationStack);
    }
   
  }

  getSize(){
    return this._navigationStack.length;
  }
}


Template.navigationStack.created = function(){
  this._navigationStack = new NavigationStack();
};

Template.navigationStack.rendered = function(){
  
  var that = this;
  Deps.autorun(function(){
    var routerData = Router.current().data()
    if( routerData ){
      var renderStack = routerData.navigationStackTemplates.map((t) => {
        return new NavigationItem(t);
      });

      that._navigationStack.setStack( renderStack )
    }
  });
 
};

Template.navigationStack.helpers({
  topNavigationItemTemplate: function(){
    var instance = UI._templateInstance();
    if( instance && instance._navigationStack ){
      var topItem = instance._navigationStack.getTopNavigationItem();
      //return topItem && topItem.getItemTemplate() && UI.render(topItem.getItemTemplate()) || null;
      return topItem && topItem.getItemTemplate() || null;
    }
    return null;
  },

  navigationStack: function(){
    var instance = UI._templateInstance();
    return instance && instance._navigationStack;    
  },

  topItemData: function(){
    return {name: 'Jakob Dam Jensne'};
  },

  topNavigationItem: function(){
    var instance = UI._templateInstance();
    if( instance && instance._navigationStack ){
      var topItem = instance._navigationStack.getTopNavigationItem();
      return topItem && topItem || null;
    }
    return null;
  }

  
});

Template.navigationStack.events({

});
