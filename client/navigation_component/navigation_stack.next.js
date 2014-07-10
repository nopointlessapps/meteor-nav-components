/*global Deps, Template, NavigationItem, UI, $ */

class NavigationStack {
 
  constructor(){
    this._navigationStack = [];
    this._navigationDeps = new Deps.Dependency();
  }

  setStack(newStack=[]){
    this._navigationStack = newStack.slice(); //clone array
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
  }

  getTopNavigationItem(){
    this._navigationDeps.depend();
    return this._navigationStack[this._navigationStack.length-1];
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
      that._navigationStack.renderStack(that);
    }
  });
};

Template.navigationStack.helpers({
});

Template.navigationStack.events({

});
