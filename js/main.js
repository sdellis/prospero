// Models

var Collection = Backbone.Model.extend({
    initialize : function(){
        console.log('Collection has been initialized.');
        setID(this);
        logObj(this);
        this.on('change', function(){
            logChange(this);
        });
        
    },
    defaults: {
        id: null,
        within: [],
        label: 'Untitled',
        type: 'collection',
        description: '',
        attribution: 'Unattributed',
        collections: {}, // CollectionCollection
        manifests: {} // ManifestCollection
      }
    
});

var Manifest = Backbone.Model.extend({
    initialize : function(){
        console.log('Manifest has been initialized.');
        setID(this);
        logObj(this);
        this.on('change', function(){
            logChange(this);
        });
      },
    defaults: {
        label: 'Untitled',
        type: 'manifest',
        within: [],
        viewingDirection: 'left-to-right',
        viewingHint: 'paged',
        sequences: {} // SequenceCollection; Note: first sequence is the default
      }
});

var Sequence = Backbone.Model.extend({
    initialize : function(){
        console.log('Sequence has been initialized.');
        setID(this);
        logObj(this);
        this.on('change', function(){
            logChange(this);
        });
        this.on("invalid", function(model, error){
            console.log(error);
        });
      },
    defaults: {
        label: 'Untitled',
        type: 'sequence',
        startCanvas: null,
        canvases: {} // CanvasCollection  
      },
    validate: function(attributes){
        if(attributes.canvases){ 
            if(attributes.canvases.length < 1){ 
                return "Your sequence must have at least one canvas in it.";
            }
        }else{
            return "Your sequence must have at least one canvas in it.";
        }
    },
    addCanvas: function(canvas){
        /*
        var c = _.clone(this.get("canvases")); // we need to clone to trigger change event
        c.push(canvas);
        sequence1.set("canvases", c);
        */
    },
    removeCanvas: function(canvas){
       // do something 
    }
});

var Canvas = Backbone.Model.extend({
    initialize : function(){
        console.log('Canvas has been initialized.');
        setID(this);
        logObj(this);
        this.on('change', function(){
            logChange(this);
        });
      },
    defaults: {
        id: null,
        label: 'Untitled',
        type: 'canvas',
        height: 0,
        width: 0,
        images: []
      }
});

var Image = Backbone.Model.extend({
    initialize : function(){
        console.log('Image has been initialized.');
        setID(this);
        logObj(this);
        this.on('change', function(){
            logChange(this);
        });
      },
    defaults: {
        id: null,
        type: 'oa:Annotation',
        motivation: 'sc:painting',
        resource: {
            id: null, // should be a IIIF Image API URI if available
            type : 'dctypes:Image',
            format : 'image/jpeg',
            "service": { // optional if the image is delivered via the Image API
                context: null, // Image API Context doc"http://iiif.io/api/image/2/context.json",
                id: null, // "http://www.example.org/images/book1-page1",
                profile: null, // "http://iiif.io/api/image/2/profiles/level2.json",
            },
            height: 0,
            width: 0
        },
        on : null // this is the id of the canvas it is attached to 
      }
});

// Collections

var CollectionCollection = Backbone.Collection.extend({
  model: Collection
});

var ManifestCollection = Backbone.Collection.extend({
  model: Manifest
});

var SequenceCollection = Backbone.Collection.extend({
  model: Sequence
});

var CanvasCollection = Backbone.Collection.extend({
  model: Canvas
});

var ImageCollection = Backbone.Collection.extend({
  model: Image
});

// Views
// todo: addViews
var ThumbsView = Backbone.View.extend({
  tagName: 'div', 
  className: 'row', 
  id: 'canvases',
  
  // Cache the template function for a single item.
  thumbsTpl: _.template( $('#thumbs-template').html() ),
    
  events: {
    'click .thumbnail': 'selectCanvas',
  },
  
  selectCanvas: function() {
    console.log("I'm clicked."); // executed when thumbnail is clicked
  }, 
  
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
  
});


// Config, Constants, and States
var baseURI = 'http://library.princeton.edu/api/presentation/2.0';
var ids = new Array(baseURI); // ensures all ids are registered and unique
var curPage = '';

// Helpers
var logObj = function(obj){
        document.write(JSON.stringify(obj));
    }

var logChange = function(obj) {
     // var name = (obj.get('type') == 'collection' ? obj.get('label') : obj.get('title'));
     document.write(obj.get('label')  + ' has changed. (' + obj.get('type') + ')'); 
}

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

var setID = function(obj){
    // todo: look into using the autogenerated cid (clientID) found here under Retrieving Models:
    // http://addyosmani.github.io/backbone-fundamentals/#collections
    // 
    // todo: set the root collection to have the id of 'baseURI/collection/top' 
    // and 'top' as its label... how is this determined?
    // by not being 'within' any other collections, or is it simply user defined?
     var lineage = '';
     if(typeof obj.get('within') !== "undefined") {
       lineage = (obj.get('within').length > 0 ? _.first(obj.get('within')) + '/' : '');
     }
     id = baseURI + '/' + lineage + obj.get("type") + '/' + slugify(obj.get("label"));
     idsLen = ids.length;
     if (_.indexOf(ids, id) > -1){ // if exists, append index to certify uniqueness
         id += idsLen;
     }
     ids.push(id);
     obj.set({ id: id });
     document.write   ( obj.get("label") + " added to registry at " + id );
}


// do stuff
var manifest1 = new Manifest({
    label: "Foobar",
    completed: true
});
var collection1 = new Collection({ label: 'My Collection' });
var collection2 = new Collection({});
collection1.set({ label: "Sample Manifests" });
logObj(collection1);
logObj(collection2);
var sequence1 = new Sequence( { label: "Empty Sequence" } );
var canvas1 = new Canvas( { label: "Blank Canvas" } );
var canvas2 = new Canvas( { label: "Another Blank Canvas" } );
// var c = sequence1.get("canvases").clone(); // we need to clone to trigger change event
// console.log(typeof c);
// c.push(canvas1);
// sequence1.set("canvases", c);
sequence1.unset("canvases", {validate: true});  // validate that sequence has at least one canvas
sequence1.addCanvas(canvas1);

var canvases = new CanvasCollection([canvas1]);
canvases.add(canvas2);
sequence1.set("canvases", canvases); 
console.log("Collection size: " + canvases.length);
console.log("Sequence size: " + sequence1.get("canvases").length);
var somecanvas = canvases.get("http://library.princeton.edu/api/presentation/2.0/canvas/another-blank-canvas");
logObj(somecanvas);
// canvases.remove([canvas1,canvas2]);
console.log("Collection size: " + canvases.length);
console.log(canvases.pluck('label'));
console.log(canvases.indexOf(canvas2));
var container = $('<div class="container"></div>');
var view = new ThumbsView({el: container});

