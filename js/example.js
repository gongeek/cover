var map;
require([
	"esri/map", "esri/layers/ArcGISImageServiceLayer",
	"esri/layers/ImageServiceParameters", "dojo/parser", "dojo/domReady!"
], function(
	Map, ArcGISImageServiceLayer,
	ImageServiceParameters, parser
) {
	parser.parse();

	map = new Map("map", {
		basemap: "topo",
		center: [-79.40, 43.64],
		zoom: 12
	});

	var params = new ImageServiceParameters();
	params.noData = 0;


	var imageServiceLayer = new ArcGISImageServiceLayer("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Toronto/ImageServer", {
		imageServiceParameters: params,
		opacity: 0.75
	});
	map.addLayer(imageServiceLayer);
});