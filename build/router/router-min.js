YUI.add("router",function(h){var c=h.HistoryHash,b=h.QueryString,f=h.Array,g=h.config.win,e=[],d="ready";function a(){a.superclass.constructor.apply(this,arguments);}h.Router=h.extend(a,h.Base,{_regexPathParam:/([:*])([\w\-]+)?/g,_regexUrlQuery:/\?([^#]*).*$/,_regexUrlOrigin:/^(?:[^\/#?:]+:\/\/|\/\/)[^\/]*/,initializer:function(j){var i=this;i._html5=i.get("html5");i._routes=[];i._url=i._getURL();i._setRoutes(j&&j.routes?j.routes:i.get("routes"));if(i._html5){i._history=new h.HistoryHTML5({force:true});h.after("history:change",i._afterHistoryChange,i);}else{h.on("hashchange",i._afterHistoryChange,g,i);}i.publish(d,{defaultFn:i._defReadyFn,fireOnce:true,preventable:false});i.once("initializedChange",function(){h.once("load",function(){setTimeout(function(){i.fire(d,{dispatched:!!i._dispatched});},20);});});},destructor:function(){if(this._html5){h.detach("history:change",this._afterHistoryChange,this);}else{h.detach("hashchange",this._afterHistoryChange,g);}},dispatch:function(){this.once(d,function(){this._ready=true;if(this._html5&&this.upgrade()){return;}else{this._dispatch(this._getPath(),this._getURL());}});return this;},getPath:function(){return this._getPath();},hasRoute:function(i){if(!this._hasSameOrigin(i)){return false;}return !!this.match(this.removeRoot(i)).length;},match:function(i){return f.filter(this._routes,function(j){return i.search(j.regex)>-1;});},removeRoot:function(j){var i=this.get("root");j=j.replace(this._regexUrlOrigin,"");if(i&&j.indexOf(i)===0){j=j.substring(i.length);}return j.charAt(0)==="/"?j:"/"+j;},replace:function(i){return this._queue(i,true);},route:function(j,k){var i=[];this._routes.push({callback:k,keys:i,path:j,regex:this._getRegex(j,i)});return this;},save:function(i){return this._queue(i);},upgrade:function(){if(!this._html5){return false;}var i=c.getHash();if(i&&i.charAt(0)==="/"){this.once(d,function(){this.replace(i);});return true;}return false;},_decode:function(i){return decodeURIComponent(i.replace(/\+/g," "));},_dequeue:function(){var i=this,j;if(!YUI.Env.windowLoaded){h.once("load",function(){i._dequeue();});return this;}j=e.shift();return j?j():this;},_dispatch:function(n,k,o){var j=this,i=j.match(n),m,l;j._dispatching=j._dispatched=true;if(!i||!i.length){j._dispatching=false;return j;}m=j._getRequest(n,k,o);l=j._getResponse(m);m.next=function(q){var s,r,p;if(q){h.error(q);}else{if((p=i.shift())){r=p.regex.exec(n);s=typeof p.callback==="string"?j[p.callback]:p.callback;if(r.length===p.keys.length+1){m.params=f.hash(p.keys,r.slice(1));}else{m.params=r.concat();}s.call(j,m,l,m.next);}}};m.next();j._dispatching=false;return j._dequeue();},_getHashPath:function(){return c.getHash().replace(this._regexUrlQuery,"");},_getOrigin:function(){var i=h.getLocation();return i.origin||(i.protocol+"//"+i.host);},_getPath:function(){var i=(!this._html5&&this._getHashPath())||h.getLocation().pathname;return this.removeRoot(i);},_getQuery:function(){var i=h.getLocation(),k,j;if(this._html5){return i.search.substring(1);}k=c.getHash();j=k.match(this._regexUrlQuery);return k&&j?j[1]:i.search.substring(1);},_getRegex:function(j,i){if(j instanceof RegExp){return j;}if(j==="*"){return(/.*/);}j=j.replace(this._regexPathParam,function(l,k,m){if(!m){return k==="*"?".*":l;}i.push(m);return k==="*"?"(.*?)":"([^/]*)";});return new RegExp("^"+j+"$");},_getRequest:function(j,i,k){return{path:j,query:this._parseQuery(this._getQuery()),url:i,src:k};},_getResponse:function(j){var i=function(){return j.next.apply(this,arguments);};i.req=j;return i;},_getRoutes:function(){return this._routes.concat();},_getURL:function(){return h.getLocation().toString();},_hasSameOrigin:function(j){var i=((j&&j.match(this._regexUrlOrigin))||[])[0];if(i&&i.indexOf("//")===0){i=h.getLocation().protocol+i;}return !i||i===this._getOrigin();},_joinURL:function(j){var i=this.get("root");j=this.removeRoot(j);if(j.charAt(0)==="/"){j=j.substring(1);}return i&&i.charAt(i.length-1)==="/"?i+j:i+"/"+j;},_parseQuery:b&&b.parse?b.parse:function(m){var n=this._decode,p=m.split("&"),l=0,k=p.length,j={},o;for(;l<k;++l){o=p[l].split("=");if(o[0]){j[n(o[0])]=n(o[1]||"");}}return j;},_queue:function(){var j=arguments,i=this;e.push(function(){if(i._html5){if(h.UA.ios&&h.UA.ios<5){i._save.apply(i,j);}else{setTimeout(function(){i._save.apply(i,j);},1);}}else{i._dispatching=true;i._save.apply(i,j);}return i;});return !this._dispatching?this._dequeue():this;},_save:function(j,k){var i=typeof j==="string";if(i&&!this._hasSameOrigin(j)){h.error("Security error: The new URL must be of the same origin as the current URL.");return this;}this._ready=true;if(this._html5){this._history[k?"replace":"add"](null,{url:i?this._joinURL(j):j});}else{i&&(j=this.removeRoot(j));if(j===c.getHash()){this._dispatch(this._getPath(),this._getURL());}else{c[k?"replaceHash":"setHash"](j);}}return this;},_setRoutes:function(i){this._routes=[];f.each(i,function(j){this.route(j.path,j.callback);},this);return this._routes.concat();},_afterHistoryChange:function(k){var i=this,m=k.src,j=i._url,l=i._getURL();i._url=l;if(m==="popstate"&&(!i._ready||j.replace(/#.*$/,"")===l.replace(/#.*$/,""))){return;}i._dispatch(i._getPath(),l,m);},_defReadyFn:function(i){this._ready=true;}},{NAME:"router",ATTRS:{html5:{valueFn:function(){return h.Router.html5;},writeOnce:"initOnly"},root:{value:""},routes:{value:[],getter:"_getRoutes",setter:"_setRoutes"}},html5:h.HistoryBase.html5&&(!h.UA.android||h.UA.android>=3)});h.Controller=h.Router;},"@VERSION@",{optional:["querystring-parse"],requires:["array-extras","base-build","history"]});