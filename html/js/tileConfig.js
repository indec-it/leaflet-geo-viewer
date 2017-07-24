var	ConfigSource = {};

ConfigSource.data = {
	referenceSystems : {
		id: 'san_pedro',
		epsg: 'EPSG:22185',
		projString: '+proj=tmerc +lat_0=-90 +lon_0=-60 +k=1 +x_0=5500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
		resolutions: [
			320,
            160,
            80,
            40,
            20,
            10,
            5,
            2.5,
            1.25,
            0.625
        ],
        origin: [5488421.75000000000000, 6234375.25000000000000],
        bounds : {
        	bottom: {
        		x: 5488421.75,
        		y: 6234375.25
        	},
        	top: {
        		x: 5554704.25,
        		y: 6286187.75
        	}
        }
	},
	tms: [{
		desc: 'San Pedro',
		url : 'TMS_sanpedro/{z}/{x}/{y}.jpg',
		min: 0,
		max: 7
	},{
		desc: 'Buenos Aires',
		url : 'TMS_bsas/{z}/{x}/{y}.jpg',
		min: 0,
		max: 8
	}],
	wms: [{
		url : 'http://geoservicios.indec.gov.ar/geoserver/ows?',
		service : 'geocenso2010:visor_CNA2018'
	}]
};


ConfigSource.loadMap = function ( ){
	if(typeof DataSource !== 'undefined'){
        if(DataSource.getConfig){
            ConfigSource.data = DataSource.getConfig();
        }
	}
    
    var crs = undefined;
	if(ConfigSource.data.referenceSystems ){
        var system = ConfigSource.data.referenceSystems;
        var array = [];
		for( x in system.resolutions){
            array.push(system.resolutions[x]);
        }

        crs = new L.Proj.CRS( system.epsg , system.projString, {
            resolutions: array,
            origin: system.origin,
            bounds: L.bounds(
                L.point(system.bounds.bottom.x,system.bounds.bottom.y),
                L.point(system.bounds.top.x,system.bounds.top.y)
            )
        });

        crs = crs
	}

    var mapDef = L.map('map', {
        center: [ -33.77,-59.70],            
        zoom: 0,
        minZoom: 0,
        maxZoom: 12,
        crs: crs
    });

    var white = L.tileLayer("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==");

    var base = {};

    var basemaps = {
        "Without background": white
    };

    var overlay = {};

    for( x in ConfigSource.data.tms ){
        overlay[ ConfigSource.data.tms[x].desc ] = L.tileLayer(ConfigSource.data.tms[x].url,{
            tms:true,
            noWrap: true,
            minNativeZoom: ConfigSource.data.tms[x].min,
            maxNativeZoom: ConfigSource.data.tms[x].max
        });
    }
//  16:00
    L.control.layers(basemaps, overlay, {collapsed: false}).addTo(mapDef);

    return mapDef;
};