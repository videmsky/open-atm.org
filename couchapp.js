var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/mobile_viewer'
  , rewrites: 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}    
    , {from:"/api/*", to:'../../*'}
    , {from:"/data", to:'_spatial/_list/geojson/full'}
    , {from:"/assetid", to:'_list/jsonp/assetid'}
    , {from:"/*", to:'*'}
    ]
  }
  ;
  
ddoc.views = {
  assetid: {
    map: function(doc) {
      emit(doc._id, doc);
    }
  }
}

ddoc.spatial = {
  /**
  * A simple spatial view that emits the GeoJSON plus the complete documents.   
  */
  full: function(doc) {
    if(doc.geometry) {
      emit(doc.geometry, doc);
    }
  }
}

ddoc.lists = {
  jsonp: function(head, req) {
    var row, out, sep = '\n';

    // Send the same Content-Type as CouchDB would
    if (req.headers.Accept.indexOf('application/json')!=-1)
      start({"headers":{"Content-Type" : "application/json"}});
    else
      start({"headers":{"Content-Type" : "text/plain"}});

    if ('callback' in req.query) send(req.query['callback'] + "(");


    while (row = getRow()) {
      out = JSON.stringify(row.value);
      send(out);
    }
    if ('callback' in req.query) send(")");

  },
  /**
   * This function outputs a GeoJSON FeatureCollection (compatible with
   * OpenLayers). The geometry is stored in the geometry property, all other
   * properties in the properties property.
   * 
   * @author Volker Mische
   */
  geojson: function(head, req) {
      var row, out, sep = '\n';

      // Send the same Content-Type as CouchDB would
      if (typeof(req.headers.Accept) != "undefined" && req.headers.Accept.indexOf('application/json')!=-1)
        start({"headers":{"Content-Type" : "application/json"}});
      else
        start({"headers":{"Content-Type" : "text/plain"}});

      if ('callback' in req.query) send(req.query['callback'] + "(");

      send('{"type": "FeatureCollection", "features":[');
      while (row = getRow()) {
          out = '{"type": "Feature", "id": ' + JSON.stringify(row.id);
          out += ', "geometry": ' + JSON.stringify(row.value.geometry);
          delete row.value.geometry;
          out += ', "properties": ' + JSON.stringify(row.value) + '}';

          send(sep + out);
          sep = ',\n';
      }
      send("]}");
      if ('callback' in req.query) send(")");
  }
}

couchapp.loadAttachments(ddoc, path.join(__dirname, '../99ATMs'));

module.exports = ddoc;