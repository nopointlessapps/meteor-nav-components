class NavigationItem {

	constructor(options = {}) {
		this._template = options.template;
		this._path = options.path;
		this._renderDeps = new Deps.Dependency();
		this._actionButtonsDeps = new Deps.Dependency();

		if (this._path === undefined || this._path === null) {
			console.error("NavigationItem requires a path");
		}
	}

	getPath() {
		return this._path;
	}

	getTemplate() {
		return this._template;
	}

	getTemplateName() {
		return this._template.__templateName;
	}

	setNavigationStack(stack) {
		this._currentNavigationStack = stack;
	}

	getNavigationStack() {
//    this._renderDeps.depend();
		return this._currentNavigationStack;
	}

	getRenderedTemplate() {
		this._renderDeps.depend();

		return this._renderedTemplate;
	}

	getItemTemplate() {
		return Template.navigationItem;
	}

	actionButtons() {
		this._actionButtonsDeps.depend();
		return this._actionButtons;
	}

	setActionButtons(buttons = []) {
		var that = this;

		if (_.isArray(buttons)) {
			this._actionButtons = buttons;
			this._buttonsMap = {};
			_.forEach(this._actionButtons, function (item) {
				if (item.identifier && typeof item.command === 'function') {
					that._buttonsMap[item.identifier] = item.command;
				}
			});

			this._actionButtonsDeps.changed();
		}
	}

	executeCommand(identifier){
		var command = this._buttonsMap && this._buttonsMap[identifier];
		command && command();
	}

	render(data) {
		this._renderedTemplate = UI.renderWithData(this.getItemTemplate(), data);
		this._renderedTemplate.templateInstance = this;

		this._renderDeps.changed();

		return this._renderedTemplate;
	}

	equals(item) {
		return item.getPath() === this.getPath() && item.getTemplate() === this.getTemplate();
	}
}
export var NavigationItem;