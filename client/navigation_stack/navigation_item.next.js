/*global UI, Deps, Template */

class NavigationItem {

  constructor(options = {}){
    this._template = options.template;
    this._path = options.path;
    this._renderDeps = new Deps.Dependency();

    if( this._path === undefined || this._path === null ){
      console.error("NavigationItem requires a path");
    }
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
//    this._renderDeps.depend();
    return this._currentNavigationStack;
  }

  getRenderedTemplate(){
    this._renderDeps.depend();
    
    return this._renderedTemplate;
  }

  getItemTemplate(){
    return Template.navigationItem;
  }

  render(data){
    this._renderedTemplate = UI.renderWithData(this.getItemTemplate(), data);
    this._renderedTemplate.templateInstance = this;

    this._renderDeps.changed();

    return this._renderedTemplate;
  }

  equals(item) {
    return item.getPath() === this.getPath() && item.getTemplate() === this.getTemplate();
  }
}

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

    return template && typeof template.title === 'function' && template.title() || null;
  },

  template: function(){
    var instance = UI._templateInstance(),
    navigationItem = instance.data.navigationItem;

    return navigationItem && navigationItem.getTemplate() || null;
  },

  actionButtons: function(){
    var instance = UI._templateInstance(),
    navigationItem = instance.data.navigationItem,
    template = navigationItem && navigationItem.getTemplate(); 

    return template && typeof template.actionButtons === 'function' && template.actionButtons() || null;   
  },

  isLoading: function(){
        var instance = UI._templateInstance(),
    navigationItem = instance.data.navigationItem,
    template = navigationItem && navigationItem.getTemplate(); 

    if( template && typeof template.isLoading === "function" ){
      return template.isLoading();
    }
    return !Router.current().ready();
  },

  loadingTemplate: function(){
    if( Router.options.loadingTemplate ){
      return Template[Router.options.loadingTemplate];
    }
    return null;
  }

});

Template.navigationItem.events({

  "click .navigation-item-action-bar__back-button": function(e, template){
    e.preventDefault();
    e.stopPropagation();

    var stack = template.data.navigationItem.getNavigationStack();
    stack && stack.pop();
  },

  "click .navigation-item-action-bar__actions > a": function(e, template){
    var command = "",
        splitted = [],
        i = 0,
        scope = window;
    
    if( !e.target.href || e.target.href.trim().length === 0 || e.target.href.trim() === "#" ){
      e.preventDefault();
      e.stopPropagation();
      
      command = e.target.getAttribute('data-command');
      command = command && command.trim();

      if( command && command.length > 0 ){
        splitted = command.split(".");
        
        
        for( i=0; i<splitted.length; i++){
          if( scope ){
            scope = scope[splitted[i]];
          } else {
            throw new Error("could not locate function to execute");
          }
        }
        scope.apply(template);
      }
    }
  }

});


export var NavigationItem;
