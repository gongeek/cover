var map;
require([
	'esri/map', 'esri/layers/WMSLayer', 'esri/layers/WMSLayerInfo', 'esri/geometry/Extent',
	'dojo/_base/array', 'dojo/dom', 'dojo/dom-construct', 'dojo/parser','esri/SpatialReference',
	'dijit/layout/BorderContainer', 'dijit/layout/ContentPane', 'dojo/domReady!'
], function (Map, WMSLayer, WMSLayerInfo, Extent, array, dom, domConst, parser,SpatialReference) {
	parser.parse();
	var defaultExtent = new Extent(-20037508, -20037508, 20037508, 20037508.34, {wkid: 900913});
	map = new Map('map', {
		extend: defaultExtent,
		basemap: 'streets',
		center: [-96, 37],
		zoom: 4
	});

	var layer1 = new WMSLayerInfo({
		name: 'cglc30_2000_0',
		title: 'Rivers',
		SpatialReference:new SpatialReference(900913)
	});
	var layer2 = new WMSLayerInfo({
		name: 'cglc30_2010_0',
		title: 'Cities',
		SpatialReference:new SpatialReference(900913)
	});
	var resourceInfo = {
		extent:defaultExtent,
		layerInfos: [layer1, layer2],
		version: '1.1.1'
	};
	var wmsLayer = new WMSLayer('http://218.244.250.80:8080/erdas-apollo/coverage/CGLC', {
		resourceInfo: resourceInfo,
		visibleLayers: ['cglc30_2000_0', 'cglc30_2010_0']
	});
	debugger;
	map.addLayers([wmsLayer]);
})
;