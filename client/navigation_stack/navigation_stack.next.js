/*global Deps, Template, NavigationItem, UI, $, IronLocation */

export class NavigationStack {

    constructor(template) {
        this._navigationStack = [];
        this._navigationDeps = new Deps.Dependency();
        this._template = template;
        this._initialRender = true;
        this._canBeClosed = true;

        if (template.data) {
            this._stackId = template.data.stackId;
            this._isModal = !!template.data.isModal;
            this._className = template.data.className;
            this._canBeClosed = template.data.canBeClosed !== false;
        }
    }

    setStack(newStack = [], firstTime = false) {
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

    canBeClosed() {
        return this._canBeClosed;
    }

    isModal() {
        return this._isModal;
    }

    stackId() {
        return this._stackId;
    }

    className() {
        return this._className;
    }

    push(navigationItem) {
        var topitem = this.getTopNavigationItem();

        this.isPopping = false;

        navigationItem.setNavigationStack(this);
        this._navigationStack.push(navigationItem);

        this.renderStack();
        this._navigationDeps.changed();
        this.updateURL();
    }

    getContentDomNode() {
        return this._template.find('.navigation-stack__container');
    }

    pop() {
        this.isPopping = true;
        this._navigationStack.pop();

        this.renderStack();
        this.updateURL();


    }

    updateURL() {
        var topItem = this._navigationStack[this._navigationStack.length - 1],
            path = "",
            otherStack = undefined;

        if (!topItem) {
            otherStack = _.find(NavComponents.navigationStacks.list, function (s) {
                return s !== this;
            }, this);
            path = otherStack && otherStack.getTopNavigationItem().getPath();
        } else {
            path = topItem.getPath();
        }

        if (typeof IronLocation !== 'undefined' && path) {
            IronLocation.pushState({}, "", path, true);
        }
    }

    getTopNavigationItem() {
        return this._navigationStack[this._navigationStack.length - 1] || null;
    }

    _whichTransitionEvent() {
        var t,
            el = this._template.firstNode,
            transitions = {
                'WebkitTransition': 'webkitAnimationEnd',
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
            transitionEndEvent = this._whichTransitionEvent(),
            navigationStack = this,
            hooks = {};


        hooks.insertElement = function (node, next) {
            classToAdd = navigationStack.isPopping && classes.popTo || classes.pushTo;
            classToAdd = "navigation-item__animated " + classToAdd;

            $(navigationStack._template.firstNode).append(node);

            if (!navigationStack.firstTime) {
                node.addEventListener(transitionEndEvent, function () {
                    $(node).removeClass(classToAdd);
                });
                $(node).addClass(classToAdd);
            }

            Deps.afterFlush(function () {
                $(node).width();
            });
        };
        hooks.removeElement = function (node) {
            classToAdd = navigationStack.isPopping && classes.popFrom || classes.pushFrom;
            classToAdd = "navigation-item__animated " + classToAdd;

            if (!navigationStack.firstTime) {
                node.addEventListener(transitionEndEvent, function () {
                    console.log('remove after', transitionEndEvent);
                    $(node).remove();
                });
                $(node).addClass(classToAdd);
                console.log(classToAdd)
            } else {
                $(node).remove();
            }
        };

        return hooks;
    }


    renderStack() {
        var template = this._template,
            navigationStack = template._navigationStack,
            navigationItem = this.getTopNavigationItem(),
            data = Router.current().data(),
            itemData = { navigationItem, navigationStack, data };

        if (this._topRenderedTemplate) {
            Blaze.remove(this._topRenderedTemplate);
        }

        if (navigationItem) {
            this._topRenderedTemplate = navigationItem.render(itemData, this.getContentDomNode());
        }

        this.firstTime = false;

    }

    getSize() {
        return this._navigationStack.length;
    }
}

export var NavComponents = {
    navigationStacks: {
        map: {},
        list: []
    },

    stackWithId: function (stackId) {
        return this.navigationStacks.map[stackId];
    }
};

Template.navigationStack.created = function () {
    this._navigationStack = new NavigationStack(this);
    var stackId = this._navigationStack.stackId();
    console.log(stackId, "created new instance of navigation stack");

    NavComponents.navigationStacks.map[stackId] = this._navigationStack;
    NavComponents.navigationStacks.list.push(this._navigationStack);
};

Template.navigationStack.destroyed = function () {
    var stackId = this._navigationStack.stackId(),
        index = _.indexOf(NavComponents.navigationStacks.list, this._navigationStack);
    console.log(stackId, "destroyed instance of navigation stack");

    delete NavComponents.navigationStacks.map[stackId];
    if (index !== -1) {
        NavComponents.navigationStacks.list.splice(index, 1);
    }

};

Template.navigationStack.rendered = function () {
    var that = this,
        firstTime = true,
        {stackId} = this.data || {};

    this.autorun(function () {
        var navigationStackFn = Router.current().route.navigationStack,
            navigationStack = [];

        if (typeof navigationStackFn === 'function') {
            navigationStack = navigationStackFn(stackId);
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

    stackId: function () {
        var instance = UI._templateInstance();
        if (instance && instance._navigationStack) {
            return instance._navigationStack.stackId();
        }
    },

    className: function () {
        var instance = UI._templateInstance();
        if (instance && instance._navigationStack) {
            return instance._navigationStack.className();
        }
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


