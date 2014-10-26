var ModalWrapper = function (template) {
    this._template = template;
    this._data = template.data;
    this._domElement = new ReactiveVar();
}

ModalWrapper.prototype.setDomElement = function setDomElement(domElement) {
    this._domElement.set(domElement);
}

ModalWrapper.prototype.domElement = function domElement() {
    return this._domElement.get();
}

ModalWrapper.prototype.id = function () {
    return this._data && this._data.wrapperId;
}

ModalWrapper.prototype.setNavigationStack = function (stack) {
    this._navigationStack = stack;
}

ModalWrapper.prototype.navigationStack = function () {
    return this._navigationStack;
}

ModalWrapper.prototype.hide = function hideModal() {
    var that = this;
    if (that.domElement()) {
        that.domElement().classList.remove('nav-components__modal-wrapper--visible');
    }
}

ModalWrapper.prototype.show = function showModal() {
    var that = this;
    if (that.domElement()) {
        that.domElement().classList.add('nav-components__modal-wrapper--visible');
    }
}


NavComponents.modalWrappers = {
    map: {},
    list: []
};

NavComponents.modalWrapperWithId = function (id) {
    return this.modalWrappers.map[id];
};

Template.modalWrapper.created = function () {
    this._wrapper = new ModalWrapper(this);
    var id = this._wrapper.id();

    NavComponents.modalWrappers.map[id] = this._wrapper;
    NavComponents.modalWrappers.list.push(this._wrapper);
};

Template.modalWrapper.rendered = function () {
    this._wrapper.setDomElement(this.firstNode);
}

Template.modalWrapper.destroyed = function () {
    var id = this._wrapper.id(),
        index = _.indexOf(NavComponents.modalWrappers.list, this._wrapper);

    delete NavComponents.modalWrappers.map[id];
    if (index !== -1) {
        NavComponents.modalWrappers.list.splice(index, 1);
    }

};

Template.modalWrapper.helpers({
    id: function () {
        var instance = Template.instance();
        return instance._wrapper.id();
    }
})