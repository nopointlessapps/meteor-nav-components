/*global Tracker */

function tabbarController() {
    var itemsDeps = new Tracker.Dependency(),
        selectedItemDeps = new Tracker.Dependency(),
        items = [],
        selectedItemIndex = 0,
        currentRenderedView = undefined,

        setItems = function (newItems = []) {
            var selectedIndex = 0,
                fixPath = function (path) {
                    if (path[path.length] !== "/") {
                        path = path + "/";
                    }
                    return path;
                };

            items = newItems;
            items.forEach(function (item, index) {
                var path = item.getPath(),
                    routerPath = Router.current().path;

                if (typeof path === "string") {
                    path = fixPath(path);
                    routerPath = fixPath(routerPath);

                    item.setTabbarController(publicFunctions);
                    if (routerPath.startsWith(path)) {
                        selectedIndex = index;
                    }
                }
            });

            itemsDeps.changed();
            setSelectedItemIndex(selectedIndex, false);
        },

        getItems = function () {
            itemsDeps.depend();
            return items;
        },

        getSelectedItem = function () {
            selectedItemDeps.depend();
            return items && items[selectedItemIndex] || null;
        },

        setSelectedItem = function (item, goToPath = true) {
            var indexOfSelectedItem = items.indexOf(item);
            if (indexOfSelectedItem !== -1) {
                setSelectedItemIndex(indexOfSelectedItem, goToPath);
            }
        },

        setSelectedItemIndex = function (index, goToPath) {
            var path = null;

            if (index < items.length && index >= 0) {
                selectedItemIndex = index;
                selectedItemDeps.changed();

                if (goToPath) {
                    path = items[index].getPath();
                    Router.go(path);
                }
            }
        },

        setCurrentRenderedView = function(view){
            currentRenderedView = view;
        },
        getCurrentRenderedView = function(){
            return currentRenderedView;
        },

        publicFunctions = {
            setSelectedItem, getSelectedItem, getItems, setItems, setCurrentRenderedView, getCurrentRenderedView
        };

    return publicFunctions;
}

Template.tabbar.created = function () {
    this._tabbarController = tabbarController();
};

Template.tabbar.rendered = function () {
    var that = this;
    this.autorun(function () {
        var tabbarController = that._tabbarController;
        tabbarController.setItems(that.data.items());
    });

    this.autorun(function () {
        var tabbarController = that._tabbarController,
            selectedItem = tabbarController.getSelectedItem(),
            template = selectedItem && selectedItem.getTemplate(),
            targetDom = that.data.target && document.querySelector(that.data.target);

        if (tabbarController.getCurrentRenderedView()) {
            Blaze.remove(tabbarController.getCurrentRenderedView());
        }

        if (template && targetDom) {
            tabbarController.setCurrentRenderedView( Blaze.renderWithData(template, {}, targetDom) );
        }
    });
};

Template.tabbar.helpers({

    tabbarItems: function () {
        var instance = UI._templateInstance(),
            controller = instance && instance._tabbarController;

        return controller && controller.getItems() || null;
    },

    selectedItemTemplate: function () {
        var instance = UI._templateInstance(),
            controller = instance && instance._tabbarController,
            selectedItem = controller && controller.getSelectedItem();

        return selectedItem && selectedItem.getTemplate() || null;
    },

    shouldRenderAll: function () {
        var instance = UI._templateInstance();
        return instance && instance.data.target === undefined || null
    }
});

Template.tabbar.events({});

