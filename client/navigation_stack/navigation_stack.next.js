/*global Deps, Template, NavigationItem, UI, $, IronLocation */

class NavigationStack {
 
  constructor(template){
    this._navigationStack = [];
    this._navigationDeps = new Deps.Dependency();
    this._template = template;
    this._initialRender = true;
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
    var navigationItem = this._navigationStack.pop(),
        newTopItem = this.getTopNavigationItem();
        navigationItem.setNavigationStack(null);

    IronLocation.pushState({}, "", newTopItem.getPath()); //TODO should this be done better? Seems hacky - jdj_dk
    this._navigationDeps.changed();
  }

  getTopNavigationItem(){
    this._navigationDeps.depend();
    return this._navigationStack[this._navigationStack.length-1] || null;
  }

  getAnimationHooks(){
    var OFFSCREEN_CLASS = 'off-screen',
        EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend',
        navigationStack = this,
        hooks = {
          insertElement: function(node, next) {
            console.log('insert element');
            
            $(navigationStack._template.firstNode).append(node);
            
            if( !navigationStack._initialRender ){
              $(node)
              .addClass(OFFSCREEN_CLASS)
              .insertBefore(next);
            }

            Deps.afterFlush(function() {
              // call width to force the browser to draw it
              $(node).width();
              $(node).removeClass(OFFSCREEN_CLASS);
            });
          },
          // we could do better I guess?
          moveElement: function(node, next) {
            hooks.removeElement(node);
            hooks.insertElement(node, next);
          },
          removeElement: function(node) {
            console.log('remove element');
            /*$(node).addClass(OFFSCREEN_CLASS)
            .on(EVENTS, function() {*/
              console.log('remove events transitions end');
              $(node).remove();
//            });
          }
        };

    return hooks;
  }


  renderStack(){
    var template = this._template,
        navigationStack = template._navigationStack,
        navigationItem = this.getTopNavigationItem(),
        container = null,
        data = Router.current().data(),
        itemData = { navigationItem, navigationStack, data };
    
    if( navigationItem ){
      if( this._topRenderedTemplate ){
        UI.remove(this._topRenderedTemplate)
      }
      container = template.find(".navigation-stack__container");
      $(template.find(".container > .navigation-item")).remove();      
      
      this._topRenderedTemplate = navigationItem.render(itemData);
      UI.insert(this._topRenderedTemplate, template.find(".navigation-stack__container"));

      this._initialRender = false;
    }
  }

  getSize(){
    return this._navigationStack.length;
  }
}


Template.navigationStack.created = function(){
  this._navigationStack = new NavigationStack(this);
};

Template.navigationStack.rendered = function(){
  var that = this;

  this.firstNode._uihooks = this._navigationStack.getAnimationHooks();
  

  this.autorun(function(){
    var navigationStackFn = Router.current().route.navigationStack,
        navigationStack = [];

    if( typeof navigationStackFn === 'function' ){
      navigationStack = navigationStackFn();
      if( navigationStack && navigationStack.length > 0 ){
        var renderStack = navigationStack.map((t) => {
          return new NavigationItem(t);
        });

        that._navigationStack.setStack( renderStack );
        that._navigationStack.renderStack();
      }
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
    return Router.current().data();
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

export var NavigationStack;
