/*global UI, Deps, Template */

Template.navigationItem.helpers({

	backButtonVisible: function () {
		var instance = UI._templateInstance(),
			navigationItem = instance.data.navigationItem;

		if (navigationItem instanceof NavigationItem && navigationItem.getNavigationStack() !== undefined) {
			return navigationItem.getNavigationStack().getSize() > 1;
		}
		return false;
	},

	title: function () {
		var instance = UI._templateInstance(),
			navigationItem = instance.data.navigationItem,
			template = navigationItem && navigationItem.getTemplate();

		return template && typeof template.title === 'function' && template.title() || null;
	},

	template: function () {
		var instance = UI._templateInstance(),
			navigationItem = instance.data.navigationItem;

		return navigationItem && navigationItem.getTemplate() || null;
	},

	actionButtons: function () {
		var instance = UI._templateInstance(),
			navigationItem = instance.data.navigationItem,
			template = navigationItem && navigationItem.getTemplate();

		return template && typeof template.actionButtons === 'function' && template.actionButtons() || null;
	},

	isLoading: function () {
		var instance = UI._templateInstance(),
			navigationItem = instance.data.navigationItem,
			template = navigationItem && navigationItem.getTemplate();

		if (template && typeof template.isLoading === "function") {
			return template.isLoading();
		}
		return !Router.current().ready();
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
		var command = "",
			splitted = [],
			i = 0,
			scope = window;

		if (!e.target.href || e.target.href.trim().length === 0 || e.target.href.trim() === "#") {
			e.preventDefault();
			e.stopPropagation();

			command = e.target.getAttribute('data-command');
			command = command && command.trim();

			if (command && command.length > 0) {
				splitted = command.split(".");


				for (i = 0; i < splitted.length; i++) {
					if (scope) {
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
