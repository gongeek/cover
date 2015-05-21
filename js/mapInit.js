var map;
require([
	'esri/map', 'esri/layers/WMSLayer', 'esri/layers/WMSLayerInfo', 'esri/geometry/Extent',
	'dojo/_base/array', 'dojo/dom', 'dojo/dom-construct', 'dojo/parser','esri/SpatialReference',
	'dijit/layout/BorderContainer', 'dijit/layout/ContentPane', 'dojo/domReady!'
], function (Map, WMSLayer, WMSLayerInfo, Extent, array, dom, domConst, parser,SpatialReference) {
	parser.parse();
	var defaultExtent = new Extent(-4227935.2725877, -7877419.4028669,12864532.589711,6964891.6517091, {wkid: 900913});
	map = new Map('map', {
		extend: defaultExtent,
		basemap: 'streets',
		autoResize:true,
		zoom:2
	});

	var layer1 = new WMSLayerInfo({
		name: 'cglc30_2000_0',
		title: 'Rivers',
		spatialReferences:new SpatialReference(900913)
	});
	//var layer2 = new WMSLayerInfo({
	//	name: 'cglc30_2010_0',
	//	title: 'Cities'
	//});
	var resourceInfo = {
		extent:defaultExtent,
		layerInfos: [layer1],
		version: '1.1.1',
		maxHeight:256,
		maxWidth:256
	};
	var wmsLayer = new WMSLayer('http://218.244.250.80:8080/erdas-apollo/coverage/CGLC', {
		resourceInfo: resourceInfo,
		visibleLayers: ['cglc30_2000_0'],
		extend:defaultExtent
	});
	wmsLayer.spatialReferences[0] = 900913;
	map.addLayers([wmsLayer]);
})
;