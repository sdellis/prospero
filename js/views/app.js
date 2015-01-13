// js/views/app.js

var app = app || {};

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  app.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: '#prospero-app',

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template( $('#stats-template').html() ),
    detailTemplate: _.template( $('#manifest-detail-template').html() ),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      'keypress #new-manifest': 'createOnEnter',
      'click .list-label': 'select',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete'
    },

    // At initialization we bind to the relevant events on the `Manifests`
    // collection, when items are added or changed.
    initialize: function() {
      this.allCheckbox = this.$('#toggle-all')[0];
      this.$input = this.$('#new-manifest');
      this.$footer = this.$('#footer');
      this.$main = this.$('#main');
      this.$content = this.$('#content');

      this.listenTo(app.Manifests, 'add', this.addOne);
      this.listenTo(app.Manifests, 'reset', this.addAll);

      this.listenTo(app.Manifests, 'change:completed', this.filterOne);
      this.listenTo(app.Manifests,'filter', this.filterAll);
      this.listenTo(app.Manifests, 'all', this.render);

      app.Manifests.fetch();

    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var completed = app.Manifests.completed().length;
      var total = app.Manifests.total().length;

      if ( app.Manifests.length ) {
        this.$main.show();
        this.$footer.show();

        this.$footer.html(this.statsTemplate({
          completed: completed,
          total: total
        }));

        this.$('#filters li a')
          .removeClass('selected')
          .filter('[href="#/' + ( app.ManifestFilter || '' ) + '"]')
          .addClass('selected');
      } else {
        this.$main.hide();
        this.$footer.hide();
      }

      this.allCheckbox.checked = !total;
    },

    // Select a single manifest item and display its properties in the content area
    select: function( ev ) {
      //var view = new app.ManifestView({ model: manifest });
      $('.list-label').removeClass( "active" );

      $(ev.currentTarget).addClass( "active" );

      // get the manifest
      var id = $(ev.currentTarget).data("id");
      var thisManifest = app.Manifests.get(id);
      var json = JSON.stringify(thisManifest, null, '\t');

      this.$content.html(this.detailTemplate({
          label: thisManifest.get("label"),
          id: thisManifest.get("id"),
          json: json
        }));

    },


    // Add a single manifest item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function( manifest ) {
      var view = new app.ManifestView({ model: manifest });
      $('#manifest-list').append( view.render().el );
    },

    // Add all items in the **Manifests** collection at once.
    addAll: function() {
      this.$('#manifest-list').html('');
      app.Manifests.each(this.addOne, this);
    },

   // New
    filterOne: function ( manifest ) {
      manifest.trigger('visible');
    },

    // New
    filterAll: function () {
      app.Manifests.each(this.filterOne, this);
    },


    // New
    // Generate the attributes for a new Manifest item.
    newAttributes: function() {
      return {
        label: this.$input.val().trim(),
        order: app.Manifests.nextOrder(),
        completed: false
      };
    },

    // New
    // If you hit return in the main input field, create new Manifest model,
    // persisting it to localStorage.
    createOnEnter: function( event ) {
      if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
        return;
      }

      app.Manifests.create( this.newAttributes() );
      this.$input.val('');
    },

    // New
    // Clear all completed manifest items, destroying their models.
    clearCompleted: function() {
      _.invoke(app.Manifests.completed(), 'destroy');
      return false;
    },

    // New
    toggleAllComplete: function() {
      var completed = this.allCheckbox.checked;

      app.Manifests.each(function( manifest ) {
        manifest.save({
          'completed': completed
        });
      });
    }


  });