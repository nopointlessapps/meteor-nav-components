function modalWrapperConstructor (template) {
    var {data} = template,
        currentDomElement = new ReactiveVar(),
        currentNavigationStack = undefined,

        setDomElement = function(newDomElement){
            currentDomElement = newDomElement;
        },
        domElement = function(){
            return currentDomElement
        },
        setNavigationStack = function(navigationStack){
            currentNavigationStack = navigationStack;
        },
        navigationStack = function(){
            return currentNavigationStack;
        },
        id = function(){
            return data && data.wrapperId;
        },
        hide = function(){
            if( !_.isUndefined(domElement()) && !_.isUndefined(domElement().classList) ){
                domElement().classList.remove('nav-components__modal-wrapper--visible')
            }
        },
        show = function(){
            if( !_.isUndefined(domElement()) && !_.isUndefined(domElement().classList) ){
                domElement().classList.add('nav-components__modal-wrapper--visible')
            }
        };

    return {
        setDomElement, domElement, setNavigationStack, navigationStack, id, hide, show
    };
}


NavComponents.modalWrappers = {
    map: {},
    list: []
};

NavComponents.modalWrapperWithId = function (id) {
    return this.modalWrappers.map[id];
};

Template.modalWrapper.created = function () {
    this._wrapper = modalWrapperConstructor(this);
    var id = this._wrapper.id();

    NavComponents.modalWrappers.map[id] = this._wrapper;
    NavComponents.modalWrappers.list.push(this._wrapper);
};

Template.modalWrapper.rendered = function () {
    this._wrapper.setDomElement(this.firstNode);

    if( this.data.show === true ){
        this._wrapper.show();
    }
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