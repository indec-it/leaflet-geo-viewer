var	ConfigSource = {};

ConfigSource.data = {
	referenceSystems : {
		id: 'sanjuan',
		epsg: 'EPSG:22182',
		projString: '+proj=tmerc +lat_0=-90 +lon_0=-69 +k=1 +x_0=2500000 +y_0=0 +ellps=WGS84 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
		resolutions: [
1844.6223281249986,
922.3111640624993,
461.15558203124965,
230.57779101562483,
115.28889550781241,
57.644447753906206,
28.822223876953103,
14.411111938476552,
7.205555969238276,
3.602777984619138,
1.801388992309569

],
		origin:[2346183.083,6388237.256],
        bounds : {
        	bottom: {
        		x: 2346183.083,
        		y: 6388237.256 
        	},
        	top: {
			x: 2729210.237 ,
        		y: 6860460.572
        	}
        }
	},
	tms: [{
		desc: 'San Juan',
		url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3ASanJuan@sanjuan@jpg/{z}/{x}/{y}.jpg',
		min: 0,
		max: 8
	},{
		desc: 'Spot San Juan 1',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3AspotSanJuan1@sanjuan@png8/{z}/{x}/{y}.png8',
		min: 5,
		max: 11
	},{
		desc: 'Mapa Base',
			url : 'http://geoservicios.indec.gov.ar/geoserver/gwc/service/tms/1.0.0/geocenso2010%3Asanjuan@sanjuan@png8/{z}/{x}/{y}.png8',
		min: 0,
			max: 11
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
        center: [-30.533,-68.615 ],            
        zoom: 3,
        minZoom: 0,
        maxZoom: 10,
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
