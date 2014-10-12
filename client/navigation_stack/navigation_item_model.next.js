class NavigationItem {

    constructor(options = {}) {
        this._template = options.template;
        this._path = options.path;
        this._renderDeps = new Tracker.Dependency();
        this._actionButtonsDeps = new Deps.Dependency();
        this._waitOn = options.waitOn;
        this._isReady = false;
        this._isReadyDeps = new Tracker.Dependency();

        this._dataFn = options.data;

        if (this._path === undefined || this._path === null) {
            console.log("NavigationItem requires a path");
        }

        this._checkIfReady();
    }

    _checkIfReady() {
        var that = this;

        Deps.autorun(function (c) {
            var waitOn = that._waitOn,
                isReady = true;
            if (_.isArray(waitOn)) {
                _.forEach(waitOn, function (item) {
                    if (isReady) {
                        isReady = item.ready();
                    }
                });
                if (isReady) {
                    that._isReady = true;
                    that._isReadyDeps.changed();
                    c.stop();
                }
            } else if (waitOn && typeof waitOn.ready === 'function') {
                if (waitOn.ready()) {
                    that._isReady = true;
                    that._isReadyDeps.changed();
                    c.stop();
                }
            } else {
                that._isReady = true;
                that._isReadyDeps.changed();
                c.stop();
            }
        });
    }

    ready() {
        this._isReadyDeps.depend();
        return this._isReady;
    }

    data() {
        if (typeof this._dataFn === 'function') {
            return this._dataFn();
        }
    }


    getPath() {
        return this._path;
    }

    getTemplate() {
        return this._template;
    }

    getTemplateName() {
        var viewName = this._template.viewName,
            prefixLength = "Template.".length;

        return viewName.substr(prefixLength);
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
                item.identifier = item.identifier || item.buttonTitle || item.iconName;
                if (item.identifier && typeof item.command === 'function') {
                    that._buttonsMap[item.identifier] = item;
                }
            });

            this._actionButtonsDeps.changed();
        }
    }

    executeCommand(identifier) {
        var button = this._buttonsMap && this._buttonsMap[identifier],
            command = button && button.command;
        command && command.apply(button.scope);
    }

    render(data, parentNode) {
        if (!parentNode) {
            console.error && console.error("A parent node is required for the navigation item to render it self");
            return;
        }

        this._renderedTemplate = Blaze.renderWithData(this.getItemTemplate(), data, parentNode);
        this._renderedTemplate.templateInstance = this;

        this._renderDeps.changed();

        return this._renderedTemplate;
    }

    equals(item) {
        return item.getPath() === this.getPath() && item.getTemplate() === this.getTemplate();
    }

    modal(){
        return this.getNavigationStack().modal();
    }
}

NavigationItem.instance = function(){
    var level = 1,
        parentData = Template.parentData(level),
        instance = null;

    while( parentData ){
        if( parentData.navigationItem !== undefined ){
            instance = parentData.navigationItem;
            break;
        }
        level++;
        parentData = Template.parentData(level);
    }
    return instance;
}

export var NavigationItem;
