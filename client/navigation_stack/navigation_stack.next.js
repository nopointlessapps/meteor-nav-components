/*global Deps, Template, NavigationItem, UI, $, IronLocation */

class NavigationStack {

    constructor(template) {
        this._navigationStack = [];
        this._navigationDeps = new Deps.Dependency();
        this._template = template;
        this._initialRender = true;
    }

    setStack(newStack = [], firstTime) {
        var that = this,
            compareIndex = 0,
            i = 0,
            newItem = null,
            currentItemAtIndex = null;

        for (i = 0; i < newStack.length; i++) {
            newItem = newStack[i];
            currentItemAtIndex = this._navigationStack[i];

            if (currentItemAtIndex && newItem.equals(currentItemAtIndex)) {
                compareIndex = i;
            } else {
                break;
            }
        }

        if (this._navigationStack.length > 1 && compareIndex === this._navigationStack.length - 2) {
            this.isPopping = true;
        } else {
            this.isPopping = false;
        }

        this._navigationStack = newStack.slice(); //clone array

        this._navigationStack.forEach(function (item) {
            item.setNavigationStack(that);
        });

        this.firstTime = firstTime || (!this.isPopping && this._navigationStack.length === 1 );// || this._navigationStack.length === 0;


        this._navigationDeps.changed();

        console.log("navstack changed");
        //}
    }

    push(navigationItem) {
        this.isPopping = false;
        this._navigationStack.push(navigationItem);
        navigationItem.setNaviggetTopNavigationItemationStack(this);
        this._navigationDeps.changed();
    }

    pop() {

        var topitem = this.getTopNavigationItem(), //navigationItem = this._navigationStack.pop(),
            newTopItem = this._navigationStack[this._navigationStack.length - 2]; //getTopNavigationItem();

        //navigationItem.setNavigationStack(null);
        topitem.getRenderedTemplate().firstNode().classList.add('popping');

        IronLocation.pushState({}, "", newTopItem.getPath()); //TODO should this be done better? Seems hacky - jdj_dk
        //  this.isPopping = true;
        //    this._navigationDeps.changed();
        //this.isPopping = false;
    }

    getTopNavigationItem() {
        //this._navigationDeps.depend();
        return this._navigationStack[this._navigationStack.length - 1] || null;
    }

    _whichTransitionEvent() {
        var t,
            el = this._template.firstNode,
            transitions = {
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'MSTransition': 'msTransitionEnd',
                'OTransition': 'oTransitionEnd',
                'transition': 'transitionEnd'
            };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    getAnimationHooks() {
        var classes = {
                pushFrom: "navigation-item__push-from",
                pushTo: "navigation-item__push-to",
                popFrom: "navigation-item__pop-from",
                popTo: "navigation-item__pop-to"
            },
            classToAdd = "",
            EVENTS = "webkitAnimationEnd " + this._whichTransitionEvent(),
            navigationStack = this,
            hooks = {
                insertElement: function (node, next) {
                    classToAdd = navigationStack.isPopping && classes.popTo || classes.pushTo;
                    classToAdd = "navigation-item__animated " + classToAdd;

                    $(navigationStack._template.firstNode).append(node);

                    if (!navigationStack.firstTime) {
                        node.addEventListener('webkitAnimationEnd', function () {
                            $(node).removeClass(classToAdd);
                            Meteor.setTimeout(function () {
                                var container = '.navigation-item__content',
                                    contentArea = $(node).find(container)[0];

                                if (contentArea !== null && contentArea.children.length > 0 && 'IScroll' in window) {
                                    var myScroll = new IScroll(container, {tap: true});
                                }
                            });

                        });
                        $(node)
                            .addClass(classToAdd);

                    }
                    //}

                    Deps.afterFlush(function () {
                        $(node).width();
                    });
                },
                removeElement: function (node) {
                    classToAdd = navigationStack.isPopping && classes.popFrom || classes.pushFrom;
                    classToAdd = "navigation-item__animated " + classToAdd;

                    if (!navigationStack.firstTime) {
                        node.addEventListener('webkitAnimationEnd', function () {
                            $(node).remove();
                        });
                        $(node).addClass(classToAdd);
                    } else {
                        $(node).remove();
                    }
                }
            };

        return hooks;
    }


    renderStack() {
        var template = this._template,
            navigationStack = template._navigationStack,
            navigationItem = this.getTopNavigationItem(),
            container = null,
            data = Router.current().data(),
            itemData = { navigationItem, navigationStack, data };

        if (navigationItem) {
            if (this._topRenderedTemplate) {
                UI.remove(this._topRenderedTemplate)
            }
            container = template.find(".navigation-stack__container");
            $(template.find(".container > .navigation-item")).remove();

            this._topRenderedTemplate = navigationItem.render(itemData, template.find(".navigation-stack__container"));

        }
    }

    getSize() {
        return this._navigationStack.length;
    }
}


Template.navigationStack.created = function () {
    this._navigationStack = new NavigationStack(this);
};

Template.navigationStack.rendered = function () {
    var that = this,
        firstTime = true;


    this.autorun(function () {
        var navigationStackFn = Router.current().route.navigationStack,
            navigationStack = [];

        if (typeof navigationStackFn === 'function') {
            navigationStack = navigationStackFn();
            if (navigationStack && navigationStack.length > 0) {
                var renderStack = navigationStack.map((t) => {
                    return new NavigationItem(t);
                });

                that._navigationStack.setStack(renderStack, firstTime);
                that._navigationStack.renderStack();

                that.firstNode._uihooks = that._navigationStack.getAnimationHooks();

                firstTime = false;

            }
        }
    });
};

Template.navigationStack.helpers({
    topNavigationItemTemplate: function () {
        var instance = UI._templateInstance();
        if (instance && instance._navigationStack) {
            var topItem = instance._navigationStack.getTopNavigationItem();
            //return topItem && topItem.getItemTemplate() && UI.render(topItem.getItemTemplate()) || null;
            return topItem && topItem.getItemTemplate() || null;
        }
        return null;
    },

    navigationStack: function () {
        var instance = UI._templateInstance();
        return instance && instance._navigationStack;
    },

    topItemData: function () {
        return Router.current().data();
    },

    topNavigationItem: function () {
        var instance = UI._templateInstance();
        if (instance && instance._navigationStack) {
            var topItem = instance._navigationStack.getTopNavigationItem();
            return topItem && topItem || null;
        }
        return null;
    }


});

Template.navigationStack.events({

});

export var NavigationStack;
