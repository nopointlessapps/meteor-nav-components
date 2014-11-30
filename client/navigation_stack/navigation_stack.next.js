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
            this._className = template.data.className;
            this._canBeClosed = template.data.canBeClosed !== false;
            this._modalWrapper = template.data.modalWrapper && NavComponents.modalWrapperWithId(template.data.modalWrapper);

            if (this._modalWrapper) {
                this._modalWrapper.setNavigationStack(this);
            }
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
    }

    canBeClosed() {
        return this._canBeClosed;
    }

    isModal() {
        return this._modalWrapper !== undefined;
    }

    modal() {
        return this._modalWrapper;
    }

    stackId() {
        return this._stackId;
    }

    className() {
        return this._className;
    }

    push(navigationItem) {
        var topitem = this.getTopNavigationItem();
        if( topitem ) {
            topitem.storeScrollPosition();
        }

        this.isPopping = false;

        navigationItem.setNavigationStack(this);
        this._navigationStack.push(navigationItem);

        this.renderStack();
        this._navigationDeps.changed();
        this.updateURL();

        return this;
    }


    getContentDomNode() {
        return this._template.find('.navigation-stack__container');
    }

    pop() {
        this.isPopping = true;

        this._navigationStack.pop();

        this.renderStack();
        this.updateURL();

        var topitem = this.getTopNavigationItem();

        return this;
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

        if (typeof Iron.Location !== 'undefined' && path) {
            Iron.Location.go(path, {skipReactivity: true});
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
                console.log(t);
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

            console.log('remove element hook');

            if (!navigationStack.firstTime) {
                console.log('is not the first time - should animate');
                node.addEventListener(transitionEndEvent, function () {
                    console.log('remove item after transition end event');
                    $(node).remove();
                });
                $(node).addClass(classToAdd);
            } else {
                console.log('is the first time - should not animate');
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
            currentTopRenderedTemplate = this._topRenderedTemplate,
            itemData = { navigationItem, navigationStack, data };

        if (currentTopRenderedTemplate ) {
            Tracker.afterFlush(function(){
                Blaze.remove(currentTopRenderedTemplate);
            })
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

    NavComponents.navigationStacks.map[stackId] = this._navigationStack;
    NavComponents.navigationStacks.list.push(this._navigationStack);
};

Template.navigationStack.destroyed = function () {
    var stackId = this._navigationStack.stackId(),
        index = _.indexOf(NavComponents.navigationStacks.list, this._navigationStack);

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
        var navigationStackFn = Router.current().navigationStack,
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

                if (that._navigationStack.modal()) {
                    that._navigationStack.modal().show();
                }
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


