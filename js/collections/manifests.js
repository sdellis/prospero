// js/collections/manifests.js

  var app = app || {};

  // Collections
  // ---------------

var CollectionCollection = Backbone.Collection.extend({
  model: app.Collection
});

var ManifestCollection = Backbone.Collection.extend({
  model: app.Manifest,

  // Save all of the manifest items under the `"manifests-backbone"` namespace.
  localStorage: new Backbone.LocalStorage('manifests-backbone'),

    // Filter down the list of all manifest items that are finished.
  completed: function() {
    return this.filter(function( todo ) {
      return todo.get('completed');
    });
  },

  // Filter down the list to only manifest items that are still not finished.
  total: function() {
    return this.without.apply( this, this.completed() );
  },

  // We keep the Manifests in sequential order, despite being saved by unordered
  // GUID in the database. This generates the next order number for new items.
  nextOrder: function() {
    if ( !this.length ) {
      return 1;
    }
    return this.last().get('order') + 1;
  },

  // Todos are sorted by their original insertion order.
  comparator: function( manifest ) {
    return manifest.get('order');
  }

});

var SequenceCollection = Backbone.Collection.extend({
  model: app.Sequence
});

var CanvasCollection = Backbone.Collection.extend({
  model: app.Canvas
});

var ImageCollection = Backbone.Collection.extend({
  model: app.Image
});

// Create our global collection of **Manifests**.
app.Manifests = new ManifestCollection();

