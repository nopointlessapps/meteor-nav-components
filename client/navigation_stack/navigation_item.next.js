/*global UI, Deps, Template */

Template.navigationItem.helpers({

	backButtonVisible: function () {
		var instance = UI._templateInstance(),
			navigationItem = instance.data.navigationItem;

		if (navigationItem instanceof NavigationItem && navigationItem.getNavigationStack() !== undefined) {
			return navigationItem.getNavigationStack().getSize() > 1 || navigationItem.getNavigationStack().isModal() && navigationItem.getNavigationStack().canBeClosed();
		}
		return false;
	},

	title: function () {
		var instance = UI._templateInstance(),
			navigationItem = instance.data.navigationItem,
			template = navigationItem && navigationItem.getTemplate();

		return template && typeof template.title === 'function' && template.title() || null;
	},

	templateName: function () {
		var instance = UI._templateInstance(),
			navigationItem = instance.data.navigationItem,
			template = navigationItem && navigationItem.getTemplateName() || null;

		if (template) {
			if (template.indexOf('Template.') === 0) {
				template = template.substr('Template.'.length);
			}
			return template;
		}
	},

	actionButtons: function () {
		var instance = UI._templateInstance(),
			navigationItem = instance.data.navigationItem;

		return navigationItem && navigationItem.actionButtons();
	},

    data: function () {
		var instance = UI._templateInstance(),
			navigationItem = instance.data.navigationItem;

		return navigationItem && navigationItem.data();
	},

    ready: function(){
        var instance = UI._templateInstance(),
            navigationItem = instance.data.navigationItem;

        return navigationItem && navigationItem.ready();
    },

	loadingTemplate: function () {
		if (Router.options.loadingTemplate) {
			return Router.options.loadingTemplate;
		}
		return null;
	},

    'class': function () {
        var instance = UI._templateInstance(),
            navigationItem = instance.data.navigationItem,
            template = navigationItem && navigationItem.getTemplate();

        return template && typeof template.navigationItemClass === 'function' && template.navigationItemClass() || null;
    },



    'lastInModal': function () {
        var instance = UI._templateInstance(),
            navigationItem = instance.data.navigationItem;

        if (navigationItem instanceof NavigationItem && navigationItem.getNavigationStack() !== undefined) {
            return navigationItem.getNavigationStack().isModal() && navigationItem.getNavigationStack().getSize() === 1;
        }
    },

    'isModalClass': function () {
        var instance = UI._templateInstance(),
            navigationItem = instance.data.navigationItem;

        if (navigationItem instanceof NavigationItem && navigationItem.getNavigationStack() !== undefined) {
            return navigationItem.getNavigationStack().isModal();
        }
    }
});



Template.navigationItem.events({

	"click .navigation-item-action-bar__back-button": function (e, template) {
		e.preventDefault();
		e.stopPropagation();

        var stack = template.data.navigationItem.getNavigationStack();
		stack && stack.pop();
	},

	"click .navigation-item-action-bar__actions > a": function (e, template) {
		var identifier = "",
			navigationItem = template.data.navigationItem;

		if (!e.target.href || e.target.href.trim().length === 0 || e.target.href.trim() === "#") {
			e.preventDefault();
			e.stopPropagation();

			identifier = e.target.getAttribute('data-identifier');
			identifier = identifier && identifier.trim();

			navigationItem.executeCommand(identifier);
		}
	}

});
