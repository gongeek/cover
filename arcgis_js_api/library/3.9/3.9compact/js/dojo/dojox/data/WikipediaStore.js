//>>built
define("dojox/data/WikipediaStore","dojo/_base/kernel dojo/_base/lang dojo/_base/declare dojo/io/script dojo/io-query dojox/rpc/Service dojox/data/ServiceStore".split(" "),function(c,e,f,l,g,h,k){c.experimental("dojox.data.WikipediaStore");return f("dojox.data.WikipediaStore",k,{constructor:function(a){this.service=a&&a.service?a.service:(new h(require.toUrl("dojox/rpc/SMDLibrary/wikipedia.smd"))).query;this.idAttribute=this.labelAttribute="title"},fetch:function(a){var b=e.mixin({},a.query);b&&(!b.action||
"parse"===b.action)?(b.action="parse",b.page=b.title,delete b.title):"query"===b.action&&(b.list="search",b.srwhat="text",b.srsearch=b.text,a.start&&(b.sroffset=a.start-1),a.count&&(b.srlimit=500<=a.count?500:a.count),delete b.text);a.query=b;return this.inherited(arguments)},_processResults:function(a,b){if(a.parse)a.parse.title=g.queryToObject(b.ioArgs.url.split("?")[1]).page,a=[a.parse];else if(a.query&&a.query.search){a=a.query.search;var c=this,d;for(d in a)a[d]._loadObject=function(a){c.fetch({query:{action:"parse",
title:this.title},onItem:a});delete this._loadObject}}return this.inherited(arguments)}})});