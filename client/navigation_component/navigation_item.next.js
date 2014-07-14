/*global UI */

class NavigationItem {

  constructor(options = {}){
    this._template = options.template;
    this._path = options.path;
    this._renderDeps = new Deps.Dependency();
  }

  getPath(){
    return this._path;
  }

  getTemplate(){
    return this._template;
  }

  setNavigationStack(stack){
    this._currentNavigationStack = stack;
  }

  getNavigationStack(){
    this._renderDeps.depend();
    return this._currentNavigationStack;
  }

  getRenderedTemplate(){
    this._renderDeps.depend();
    
    return this._renderedTemplate;
  }

  getItemTemplate(){
    return Template.navigationItem;
  }

  render(){
    //this._renderedTemplate = UI.render(this.getItemTemplate());
    //this._renderedTemplate.templateInstance = this;

    //this._renderDeps.changed();
    
    return this._renderedTemplate;
  }
}

Template.navigationItem.rendered = function(){
  console.log(this);
};

Template.navigationItem.helpers({
  
  backButtonVisible: function(){
    var instance = UI._templateInstance(),
        navigationItem = instance.data.navigationItem;
     
    if( navigationItem instanceof NavigationItem && navigationItem.getNavigationStack() !== undefined ){
      return navigationItem.getNavigationStack().getSize() > 1;
    }
    return false;
  },

  title: function(){
    var instance = UI._templateInstance(),
        navigationItem = instance.data.navigationItem,
        template = navigationItem && navigationItem.getTemplate(); 
        
    return template && template.title() || null;
  },

  template: function(){
    var instance = UI._templateInstance(),
        navigationItem = instance.data.navigationItem;
      
    return navigationItem && navigationItem.getTemplate() || null;
  }

});

Template.navigationItem.events({

  "click .navigation-item__action-bar-back-button": function(e, template){
    e.preventDefault();
    e.stopPropagation();
    
    var stack = template.data.navigationItem.getNavigationStack();
    stack && stack.pop();
  }

});


export var NavigationItem;
