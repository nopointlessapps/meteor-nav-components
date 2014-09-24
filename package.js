Package.describe({
    summary: 'Basic navigation components for mobile',
    version: "1.0.0",
    git: "https://github.com/npa.io/navigation-components.git"
});

Package.on_use(function (api) {
    api.versionsFrom("METEOR@0.9.1.1");

    api.use(['blaze',
        'deps',
        'service-configuration',
        'underscore',
        'templating',
        'handlebars',
        'mquandalle:harmony',
        'stylus',
        'iron:router',
        'waitingkuo:jade'
    ], 'client');

    api.add_files([
        'client/flexbox.styl',

        'client/navigation_stack/navigation_item.html',
        'client/navigation_stack/navigation_item_model.next.js',
        'client/navigation_stack/navigation_item.next.js',
        'client/navigation_stack/navigation_item.styl',

        'client/navigation_stack/navigation_item_action_bar.styl',

        'client/navigation_stack/navigation_stack.html',
        'client/navigation_stack/navigation_stack_model.next.js',
        'client/navigation_stack/navigation_stack.next.js',
        'client/navigation_stack/navigation_stack.styl',

        'client/tabbar/tabbar.styl',
        'client/tabbar/tabbar.html',
        'client/tabbar/tabbar.next.js',

        'client/tabbar/tabbar_item.styl',
        'client/tabbar/tabbar_item.html',
        'client/tabbar/tabbar_item.next.js',

        'client/modal_wrapper/modal_wrapper.jade',
        'client/modal_wrapper/modal_wrapper.styl'


    ], 'client');

});

