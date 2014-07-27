Package.describe({
  summary: 'Basic navigation components for mobile'
});

Package.on_use(function (api) {
  api.use(['ui', 
          'deps',
          'service-configuration',
          'underscore',
          'templating',
          'handlebars',
          'harmony',
          'stylus',
          'iron-router',
          ]
  , 'client');

  api.add_files([
    'client/flexbox.styl',
    'client/navigation_stack/navigation_item.html', 
    'client/navigation_stack/navigation_item.next.js', 
    'client/navigation_stack/navigation_item.styl', 

    'client/navigation_stack/navigation_item_action_bar.styl', 

    'client/navigation_stack/navigation_stack.html', 
    'client/navigation_stack/navigation_stack.next.js', 
    'client/navigation_stack/navigation_stack.styl', 

    'client/tabbar/tabbar.styl', 
    'client/tabbar/tabbar.html', 
    'client/tabbar/tabbar.next.js', 

    'client/tabbar/tabbar_item.styl', 
    'client/tabbar/tabbar_item.html', 
    'client/tabbar/tabbar_item.next.js'
  ], 'client');


  /*
  api.export('NavigationStack', ['client']);
  api.export('NavigationItem', ['client']);
  api.export('TabbarItem', ['client']);
  api.export('Tabbar', ['client']);
 */
});

