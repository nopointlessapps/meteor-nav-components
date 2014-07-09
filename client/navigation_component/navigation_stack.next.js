/*global Deps, Template, NavigationItem, UI, $ */

class NavigationStack {
 
  constructor(){
    this._navigationStack = [];
    this._navigationDeps = new Deps.Dependency();
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

      renderedTemplateToPush.templateInstance.navigationStack = this;    

      UI.insert(renderedTemplateToPush, template.find(".container"));
    }
  }
}


Template.navigationStack.created = function(){
  this._navigationStack = new NavigationStack();
  this._navigationStack.push(new NavigationItem(Template.hello));
};

Template.navigationStack.rendered = function(){
  var template = this;
  Deps.autorun(function(){
    template._navigationStack.renderStack(template);
  });
};

Template.navigationStack.helpers({
});

Template.navigationStack.events({

});
