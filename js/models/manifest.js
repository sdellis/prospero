// js/models/manifest.js

var app = app || {};

 app.Collection = Backbone.Model.extend({
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

app.Manifest = Backbone.Model.extend({
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
        completed: false, // this will go away
        within: [],
        viewingDirection: 'left-to-right',
        viewingHint: 'paged',
        sequences: {} // SequenceCollection; Note: first sequence is the default
      },

      // Toggle the `completed` state of this manifest item... this will go away
      toggle: function() {
        this.save({
          completed: !this.get('completed')
        });
      }

});

app.Sequence = Backbone.Model.extend({
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

app.Canvas = Backbone.Model.extend({
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

app.Image = Backbone.Model.extend({
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