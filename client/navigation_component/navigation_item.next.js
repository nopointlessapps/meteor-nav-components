/*global UI */

class NavigationItem {

  constructor(template){
    this._template = template;
    this._renderDeps = new Deps.Dependency();
  }

  getTemplate(){
    return this._template;
  }

  setNavigationStack(stack){
    this._currentNavigationStack = stack;
  }

  getNavigationStack(){
    return this._currentNavigationStack;
  }

  getRenderedTemplate(){
    this._renderDeps.depend();

    return this._renderedTemplate;
  }

  render(){
    this._renderedTemplate = UI.renderWithData(Template.navigationItem, {
      template: this._template || null, 
      _navigationItem: this
    });

    this._renderedTemplate.templateInstance.navigationStack = this.getNavigationStack(); 
    this._renderedTemplate.templateInstance._navigationItem = this;

    this._renderDeps.changed();
    
    return this._renderedTemplate;
  }
}

Template.navigationItem.helpers({

});

Template.navigationItem.events({

});


export var NavigationItem;
