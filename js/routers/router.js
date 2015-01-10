// js/routers/router.js

  // Manifest Router
  // ----------

  var Workspace = Backbone.Router.extend({
    routes:{
      '*filter': 'setFilter'
    },

    setFilter: function( param ) {
      // Set the current filter to be used
      if (param) {
        param = param.trim();
      }
      app.ManifestFilter = param || '';

      // Trigger a collection filter event, causing hiding/unhiding
      // of Manifest view items
      app.Manifests.trigger('filter');
    }
  });

  app.ManifestRouter = new Workspace();
  Backbone.history.start();