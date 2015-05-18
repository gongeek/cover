/*
 COPYRIGHT 2009 ESRI

 TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 Unpublished material - all rights reserved under the
 Copyright Laws of the United States and applicable international
 laws, treaties, and conventions.

 For additional information, contact:
 Environmental Systems Research Institute, Inc.
 Attn: Contracts and Legal Services Department
 380 New York Street
 Redlands, California, 92373
 USA

 email: contracts@esri.com
 */
//>>built
define("esri/layers/SnapshotMode","dojo/_base/declare dojo/_base/lang dojo/has esri/kernel esri/SpatialReference esri/tasks/query esri/layers/RenderMode".split(" "),function(e,f,l,m,n,p,q){e=e([q],{declaredClass:"esri.layers._SnapshotMode",constructor:function(a){this.featureLayer=a;this.pagination=a.queryPagination;this._featureMap={};this._drawFeatures=f.hitch(this,this._drawFeatures);this._queryErrorHandler=f.hitch(this,this._queryErrorHandler)},startup:function(){this.pagination=this.pagination&&
null!=this.featureLayer.maxRecordCount;this.featureLayer._collection?this._applyTimeFilter():this._fetchAll()},propertyChangeHandler:function(a){this._init&&(a?this.featureLayer._collection?console.log("FeatureLayer: layer created by value (from a feature collection) does not support definition expressions and time definitions. Layer id \x3d "+this.featureLayer.id):this._fetchAll():this._applyTimeFilter())},drawFeature:function(a){var d=a.attributes[this.featureLayer.objectIdField];this._addFeatureIIf(d,
a);this._incRefCount(d)},resume:function(){this.propertyChangeHandler(0)},refresh:function(){var a=this.featureLayer;a._collection?(a._fireUpdateStart(),a._refresh(!0),a._fireUpdateEnd()):this._fetchAll()},_getRequestId:function(a){return("_"+a.name+a.layerId+a._ulid).replace(/[^a-zA-Z0-9\_]+/g,"_")},_fetchAll:function(){var a=this.featureLayer;!a._collection&&!a.suspended&&(a._fireUpdateStart(),this._clearIIf(),this._sendRequest())},_sendRequest:function(a){var d=this.map,b=this.featureLayer,e=b.getDefinitionExpression(),
c=new p;c.outFields=b.getOutFields();c.where=e||"1\x3d1";c.returnGeometry=!0;c.outSpatialReference=new n(d.spatialReference.toJson());c.timeExtent=b.getTimeDefinition();c.maxAllowableOffset=b._maxOffset;b._ts&&(c._ts=(new Date).getTime());c.orderByFields=b.supportsAdvancedQueries?b.getOrderByFields():null;this.pagination&&(this._start=c.start=null==a?0:a,c.num=b.maxRecordCount);var g;b._usePatch&&(g=this._getRequestId(b),this._cancelPendingRequest(null,g));b._task.execute(c,this._drawFeatures,this._queryErrorHandler,
g)},_drawFeatures:function(a){this._purgeRequests();var d=a.features,b=this.featureLayer,e=b.objectIdField,c,g=d.length,f=a.exceededTransferLimit&&!b._collection,h,k;for(c=0;c<g;c++)h=d[c],k=h.attributes[e],this._addFeatureIIf(k,h),this._incRefCount(k);this._applyTimeFilter(!0);if(!this.pagination||!f)b._fireUpdateEnd(null,a.exceededTransferLimit?{queryLimitExceeded:!0}:null);f&&(this.pagination&&this._sendRequest(this._start+b.maxRecordCount),b.onQueryLimitExceeded())},_queryErrorHandler:function(a){this._purgeRequests();
var d=this.featureLayer;d._errorHandler(a);d._fireUpdateEnd(a)}});l("extend-esri")&&f.setObject("layers._SnapshotMode",e,m);return e});