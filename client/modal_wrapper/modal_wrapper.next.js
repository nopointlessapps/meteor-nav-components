var ModalWrapper = function(template){
    this._data = template.data;
}

ModalWrapper.prototype.id = function(){
    return this._data && this._data.wrapperId;
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
    console.log(id, "created new instance of modal wrapper");

    NavComponents.modalWrappers.map[id] = this._wrapper;
    NavComponents.modalWrappers.list.push(this._wrapper);
};

Template.modalWrapper.destroyed = function () {
    var id = this._wrapper.id(),
        index = _.indexOf(NavComponents.modalWrappers.list, this._wrapper);
    console.log(id, "destroyed instance of modal wrapper");

    delete NavComponents.modalWrappers.map[id];
    if (index !== -1) {
        NavComponents.modalWrappers.list.splice(index, 1);
    }

};

Template.modalWrapper.helpers({
    id: function(){
        var instance = Template.instance();
        return instance._wrapper.id();
    }
})