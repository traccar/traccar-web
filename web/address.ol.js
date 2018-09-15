(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol/overlay')) :
	typeof define === 'function' && define.amd ? define(['ol/overlay'], factory) :
	(global.Popup = factory(global.ol.Overlay));
}(this, (function (Overlay) { 'use strict';

Overlay = 'default' in Overlay ? Overlay['default'] : Overlay;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
* OpenLayers Popup Overlay.
* See [the examples](./examples) for usage. Styling can be done via CSS.
* @constructor
* @extends {ol.Overlay}
* @param {olx.OverlayOptions} opt_options options as defined by ol.Overlay. Defaults to
* `{autoPan: true, autoPanAnimation: {duration: 250}}`
*/

var Popup = function (_Overlay) {
    inherits(Popup, _Overlay);

    function Popup(opt_options) {
        classCallCheck(this, Popup);


        var options = opt_options || {};

        if (options.autoPan === undefined) {
            options.autoPan = true;
        }

        if (options.autoPanAnimation === undefined) {
            options.autoPanAnimation = {
                duration: 250
            };
        }

        var element = document.createElement('div');

        options.element = element;

        var _this = possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).call(this, options));

        _this.container = element;
        _this.container.className = 'ol-popup';

        _this.closer = document.createElement('a');
        _this.closer.className = 'ol-popup-closer';
        _this.closer.href = '#';
        _this.container.appendChild(_this.closer);

        var that = _this;
        _this.closer.addEventListener('click', function (evt) {
            that.container.style.display = 'none';
            that.closer.blur();
            evt.preventDefault();
        }, false);

        _this.content = document.createElement('div');
        _this.content.className = 'ol-popup-content';
        _this.container.appendChild(_this.content);

        // Apply workaround to enable scrolling of content div on touch devices
        Popup.enableTouchScroll_(_this.content);

        return _this;
    }

    /**
    * Show the popup.
    * @param {ol.Coordinate} coord Where to anchor the popup.
    * @param {String|HTMLElement} html String or element of HTML to display within the popup.
    * @returns {Popup} The Popup instance
    */


    createClass(Popup, [{
        key: 'show',
        value: function show(coord, html) {
            if (html instanceof HTMLElement) {
                this.content.innerHTML = "";
                this.content.appendChild(html);
            } else {
                this.content.innerHTML = html;
            }
            this.container.style.display = 'block';
            this.content.scrollTop = 0;
            this.setPosition(coord);
            return this;
        }

        /**
        * @private
        * @desc Determine if the current browser supports touch events. Adapted from
        * https://gist.github.com/chrismbarr/4107472
        */

    }, {
        key: 'hide',


        /**
        * Hide the popup.
        * @returns {Popup} The Popup instance
        */
        value: function hide() {
            this.container.style.display = 'none';
            return this;
        }

        /**
        * Indicates if the popup is in open state
        * @returns {Boolean} Whether the popup instance is open
        */

    }, {
        key: 'isOpened',
        value: function isOpened() {
            return this.container.style.display == 'block';
        }
    }], [{
        key: 'isTouchDevice_',
        value: function isTouchDevice_() {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        }

        /**
        * @private
        * @desc Apply workaround to enable scrolling of overflowing content within an
        * element. Adapted from https://gist.github.com/chrismbarr/4107472
        */

    }, {
        key: 'enableTouchScroll_',
        value: function enableTouchScroll_(elm) {
            if (Popup.isTouchDevice_()) {
                var scrollStartPos = 0;
                elm.addEventListener("touchstart", function (event) {
                    scrollStartPos = this.scrollTop + event.touches[0].pageY;
                }, false);
                elm.addEventListener("touchmove", function (event) {
                    this.scrollTop = scrollStartPos - event.touches[0].pageY;
                }, false);
            }
        }
    }]);
    return Popup;
}(Overlay);

if (window.ol && window.ol.Overlay) {
    window.ol.Overlay.Popup = Popup;
}

return Popup;

})));



/*!
 * ol-geocoder - v3.1.0
 * A geocoder extension for OpenLayers.
 * https://github.com/jonataswalker/ol-geocoder
 * Built: Fri Apr 06 2018 09:18:51 GMT-0300 (-03)
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("ol/layer/vector"),require("ol/source/vector"),require("ol/geom/point"),require("ol/feature"),require("ol/proj"),require("ol/control/control"),require("ol/style/style"),require("ol/style/icon")):"function"==typeof define&&define.amd?define(["ol/layer/vector","ol/source/vector","ol/geom/point","ol/feature","ol/proj","ol/control/control","ol/style/style","ol/style/icon"],t):e.Geocoder=t(e.ol.layer.Vector,e.ol.source.Vector,e.ol.geom.Point,e.ol.Feature,e.ol.proj,e.ol.control.Control,e.ol.style.Style,e.ol.style.Icon)}(this,function(e,t,s,n,r,o,a,i){"use strict";e=e&&e.hasOwnProperty("default")?e.default:e,t=t&&t.hasOwnProperty("default")?t.default:t,s=s&&s.hasOwnProperty("default")?s.default:s,n=n&&n.hasOwnProperty("default")?n.default:n,r=r&&r.hasOwnProperty("default")?r.default:r,o=o&&o.hasOwnProperty("default")?o.default:o,a=a&&a.hasOwnProperty("default")?a.default:a,i=i&&i.hasOwnProperty("default")?i.default:i;var l={namespace:"ol-geocoder",spin:"gcd-pseudo-rotate",hidden:"gcd-hidden",address:"gcd-address",country:"gcd-country",city:"gcd-city",road:"gcd-road",olControl:"ol-control",glass:{container:"gcd-gl-container",control:"gcd-gl-control",button:"gcd-gl-btn",input:"gcd-gl-input",expanded:"gcd-gl-expanded",reset:"gcd-gl-reset",result:"gcd-gl-result"},inputText:{container:"gcd-txt-container",control:"gcd-txt-control",input:"gcd-txt-input",reset:"gcd-txt-reset",icon:"gcd-txt-glass",result:"gcd-txt-result"}},c={containerId:"gcd-container",buttonControlId:"gcd-button-control",inputQueryId:"gcd-input-query",inputResetId:"gcd-input-reset",cssClasses:l};const u=Object.freeze({containerId:"gcd-container",buttonControlId:"gcd-button-control",inputQueryId:"gcd-input-query",inputResetId:"gcd-input-reset",cssClasses:l,default:c}),p="addresschosen",d={NOMINATIM:"nominatim",REVERSE:"reverse"},h="glass-button",m="text-input",g="//cdn.rawgit.com/jonataswalker/map-utils/master/images/marker.png",f="osm",y="mapquest",v="photon",b="bing",w="opencage",k="pelias",C={provider:f,placeholder:"Search for an address",featureStyle:null,targetType:h,lang:"en-US",limit:5,keepOpen:!1,preventDefault:!1,autoComplete:!1,autoCompleteMinLength:2,debug:!1};function E(e,t){if(void 0===t&&(t="Assertion failed"),!e){if("undefined"!=typeof Error)throw new Error(t);throw t}}function x(e){const t=function(){if("performance"in window==0&&(window.performance={}),Date.now=Date.now||function(){return(new Date).getTime()},"now"in window.performance==0){let e=Date.now();performance.timing&&performance.timing.navigationStart&&(e=performance.timing.navigationStart),window.performance.now=function(){return Date.now()-e}}return window.performance.now()}().toString(36);return e?e+t:t}function R(e){return/^\d+$/.test(e)}function P(e,t,s){if(Array.isArray(e))return void e.forEach(function(e){return P(e,t)});const n=Array.isArray(t)?t:t.split(/\s+/);let r=n.length;for(;r--;)q(e,n[r])||j(e,n[r],s)}function N(e,t,s){if(Array.isArray(e))return void e.forEach(function(e){return N(e,t,s)});const n=Array.isArray(t)?t:t.split(/\s+/);let r=n.length;for(;r--;)q(e,n[r])&&O(e,n[r],s)}function q(e,t){return e.classList?e.classList.contains(t):I(t).test(e.className)}function T(e,t,s){void 0===t&&(t=window.document);let n=/\./g,r=Array.prototype.slice,o=[];if(/^(#?[\w-]+|\.[\w-.]+)$/.test(e))switch(e[0]){case"#":o=[(a=e.substr(1),a="#"===a[0]?a.substr(1,a.length):a,document.getElementById(a))];break;case".":o=r.call(t.getElementsByClassName(e.substr(1).replace(n," ")));break;default:o=r.call(t.getElementsByTagName(e))}else o=r.call(t.querySelectorAll(e));var a;return s?o:o[0]}function L(e,t){return e.replace(/\{ *([\w_-]+) *\}/g,function(e,s){let n=void 0===t[s]?"":t[s];return String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")})}function S(e,t){let s;if(Array.isArray(e)){if(s=document.createElement(e[0]),e[1].id&&(s.id=e[1].id),e[1].classname&&(s.className=e[1].classname),e[1].attr){let t=e[1].attr;if(Array.isArray(t)){let e=-1;for(;++e<t.length;)s.setAttribute(t[e].name,t[e].value)}else s.setAttribute(t.name,t.value)}}else s=document.createElement(e);s.innerHTML=t;let n=document.createDocumentFragment();for(;s.childNodes[0];)n.appendChild(s.childNodes[0]);return s.appendChild(n),s}function I(e){return new RegExp("(^|\\s+) "+e+" (\\s+|$)")}function j(e,t,s){e.classList?e.classList.add(t):e.className=(e.className+" "+t).trim(),s&&R(s)&&window.setTimeout(function(){return O(e,t)},s)}function O(e,t,s){e.classList?e.classList.remove(t):e.className=e.className.replace(I(t)," ").trim(),s&&R(s)&&window.setTimeout(function(){return j(e,t)},s)}const A=u.cssClasses;var M=function(e){this.options=e.options,this.els=this.createControl()};M.prototype.createControl=function(){let e,t,s;return this.options.targetType===m?(t=A.namespace+" "+A.inputText.container,s={container:e=S(["div",{id:u.containerId,classname:t}],M.input),control:T("."+A.inputText.control,e),input:T("."+A.inputText.input,e),reset:T("."+A.inputText.reset,e),result:T("."+A.inputText.result,e)}):(t=A.namespace+" "+A.glass.container,s={container:e=S(["div",{id:u.containerId,classname:t}],M.glass),control:T("."+A.glass.control,e),button:T("."+A.glass.button,e),input:T("."+A.glass.input,e),reset:T("."+A.glass.reset,e),result:T("."+A.glass.result,e)}),s.input.placeholder=this.options.placeholder,s},M.glass=['<div class="',A.glass.control," ",A.olControl,'">','<button type="button"',' id="',u.buttonControlId,'"',' class="',A.glass.button,'"></button>','<input type="text"',' id="',u.inputQueryId,'"',' class="',A.glass.input,'"',' autocomplete="off" placeholder="Search ...">',"<a",' id="',u.inputResetId,'"',' class="',A.glass.reset," ",A.hidden,'"',"></a>","</div>",'<ul class="',A.glass.result,'"></ul>'].join(""),M.input=['<div class="',A.inputText.control,'">','<input type="text"',' id="',u.inputQueryId,'"',' class="',A.inputText.input,'"',' autocomplete="off" placeholder="Search ...">','<span class="',A.inputText.icon,'"></span>','<button type="button"',' id="',u.inputResetId,'"',' class="',A.inputText.reset," ",A.hidden,'"',"></button>","</div>",'<ul class="',A.inputText.result,'"></ul>'].join("");var _=function(){this.settings={url:"https://photon.komoot.de/api/",params:{q:"",limit:10,lang:"en"},langs:["de","it","fr","en"]}};_.prototype.getParameters=function(e){return e.lang=e.lang.toLowerCase(),{url:this.settings.url,params:{q:e.query,limit:e.limit||this.settings.params.limit,lang:this.settings.langs.indexOf(e.lang)>-1?e.lang:this.settings.params.lang}}},_.prototype.handleResponse=function(e){return e.map(function(e){return{lon:e.geometry.coordinates[0],lat:e.geometry.coordinates[1],address:{name:e.properties.name,postcode:e.properties.postcode,city:e.properties.city,state:e.properties.state,country:e.properties.country},original:{formatted:e.properties.name,details:e.properties}}})};var B=function(){this.settings={url:"http://cloud-lxx.mcpl.ga:8054/search",params:{q:"",format:"json",addressdetails:1,limit:10,countrycodes:"","accept-language":"en-US"}}};B.prototype.getParameters=function(e){return{url:this.settings.url,params:{q:e.query,format:this.settings.params.format,addressdetails:this.settings.params.addressdetails,limit:e.limit||this.settings.params.limit,countrycodes:e.countrycodes||this.settings.params.countrycodes,"accept-language":e.lang||this.settings.params["accept-language"]}}},B.prototype.handleResponse=function(e){return e.map(function(e){return{lon:e.lon,lat:e.lat,address:{name:e.display_name,road:e.address.road||"",houseNumber:e.address.house_number||"",postcode:e.address.postcode,city:e.address.city||e.address.town,state:e.address.state,country:e.address.country},original:{formatted:e.display_name,details:e.address}}})};var D=function(){this.settings={url:"http://open.mapquestapi.com/nominatim/v1/search.php",params:{q:"",key:"",format:"json",addressdetails:1,limit:10,countrycodes:"","accept-language":"en-US"}}};D.prototype.getParameters=function(e){return{url:this.settings.url,params:{q:e.query,key:e.key,format:"json",addressdetails:1,limit:e.limit||this.settings.params.limit,countrycodes:e.countrycodes||this.settings.params.countrycodes,"accept-language":e.lang||this.settings.params["accept-language"]}}},D.prototype.handleResponse=function(e){return e.map(function(e){return{lon:e.lon,lat:e.lat,address:{name:e.address.neighbourhood||"",road:e.address.road||"",postcode:e.address.postcode,city:e.address.city||e.address.town,state:e.address.state,country:e.address.country},original:{formatted:e.display_name,details:e.address}}})};var Q=function(){this.settings={url:"http://search.mapzen.com/v1/search",params:{size:10}}};Q.prototype.getParameters=function(e){return{url:this.settings.url,params:{text:e.query,api_key:e.key,size:e.limit||this.settings.params.size}}},Q.prototype.handleResponse=function(e){return e.map(function(e){return{lon:e.geometry.coordinates[0],lat:e.geometry.coordinates[1],address:{name:e.properties.name,house_number:e.properties.housenumber,postcode:e.properties.postalcode,road:e.properties.street,city:e.properties.city,state:e.properties.region,country:e.properties.country},original:{formatted:e.properties.label,details:e.properties}}})};var V=function(){this.settings={url:"https://dev.virtualearth.net/REST/v1/Locations",callbackName:"jsonp",params:{query:"",key:"",includeNeighborhood:0,maxResults:10}}};V.prototype.getParameters=function(e){return{url:this.settings.url,callbackName:this.settings.callbackName,params:{query:e.query,key:e.key,includeNeighborhood:e.includeNeighborhood||this.settings.params.includeNeighborhood,maxResults:e.maxResults||this.settings.params.maxResults}}},V.prototype.handleResponse=function(e){return e.map(function(e){return{lon:e.point.coordinates[1],lat:e.point.coordinates[0],address:{name:e.name},original:{formatted:e.address.formattedAddress,details:e.address}}})};var F=function(){this.settings={url:"https://api.opencagedata.com/geocode/v1/json?",params:{q:"",key:"",limit:10,countrycode:"",pretty:1,no_annotations:1}}};function z(e){return new Promise(function(t,s){const n=function(e,t){t&&"object"==typeof t&&(e+=(/\?/.test(e)?"&":"?")+function e(t){return Object.keys(t).reduce(function(s,n){return s.push("object"==typeof t[n]?e(t[n]):encodeURIComponent(n)+"="+encodeURIComponent(t[n])),s},[]).join("&")}(t));return e}(e.url,e.data),r={method:"GET",mode:"cors",credentials:"same-origin"};e.jsonp?function(e,t,s){let n=document.head,r=document.createElement("script"),o="f"+Math.round(Math.random()*Date.now());r.setAttribute("src",e+(e.indexOf("?")>0?"&":"?")+t+"="+o),window[o]=function(e){window[o]=void 0,setTimeout(function(){return n.removeChild(r)},0),s(e)},n.appendChild(r)}(n,e.callbackName,t):fetch(n,r).then(function(e){return e.json()}).then(t).catch(s)})}F.prototype.getParameters=function(e){return{url:this.settings.url,params:{q:e.query,key:e.key,limit:e.limit||this.settings.params.limit,countrycode:e.countrycodes||this.settings.params.countrycodes}}},F.prototype.handleResponse=function(e){return e.map(function(e){return{lon:e.geometry.lng,lat:e.geometry.lat,address:{name:e.components.house_number||"",road:e.components.road||"",postcode:e.components.postcode,city:e.components.city||e.components.town,state:e.components.state,country:e.components.country},original:{formatted:e.formatted,details:e.components}}})};const U=u.cssClasses;var G=function(s,n){this.Base=s,this.layerName=x("geocoder-layer-"),this.layer=new e({name:this.layerName,source:new t}),this.options=s.options,this.options.provider="string"==typeof this.options.provider?this.options.provider.toLowerCase():this.options.provider,this.els=n,this.lastQuery="",this.container=this.els.container,this.registeredListeners={mapClick:!1},this.setListeners(),this.Photon=new _,this.OpenStreet=new B,this.MapQuest=new D,this.Pelias=new Q,this.Bing=new V,this.OpenCage=new F};return G.prototype.setListeners=function(){var e=this;let t,s;const n=function(){q(e.els.control,U.glass.expanded)?e.collapse():e.expand()};this.els.input.addEventListener("keypress",function(t){const s=t.target.value.trim();(t.key?"Enter"===t.key:t.which?13===t.which:t.keyCode&&13===t.keyCode)&&(t.preventDefault(),e.query(s))},!1),this.els.input.addEventListener("input",function(n){const r=n.target.value.trim();r.length?N(e.els.reset,U.hidden):P(e.els.reset,U.hidden),e.options.autoComplete&&r!==s&&(s=r,t&&clearTimeout(t),t=setTimeout(function(){r.length>=e.options.autoCompleteMinLength&&e.query(r)},200))},!1),this.els.reset.addEventListener("click",function(t){e.els.input.focus(),e.els.input.value="",e.lastQuery="",P(e.els.reset,U.hidden),e.clearResults()},!1),this.options.targetType===h&&this.els.button.addEventListener("click",n,!1)},G.prototype.query=function(e){var t=this;const s=this.getProvider({query:e,provider:this.options.provider,key:this.options.key,lang:this.options.lang,countrycodes:this.options.countrycodes,limit:this.options.limit});if(this.lastQuery===e&&this.els.result.firstChild)return;this.lastQuery=e,this.clearResults(),P(this.els.reset,U.spin);let n={url:s.url,data:s.params};s.callbackName&&(n.jsonp=!0,n.callbackName=s.callbackName),z(n).then(function(e){let s;switch(t.options.debug&&console.info(e),N(t.els.reset,U.spin),t.options.provider){case f:s=e.length?t.OpenStreet.handleResponse(e):void 0;break;case y:s=e.length?t.MapQuest.handleResponse(e):void 0;break;case k:s=e.features.length?t.Pelias.handleResponse(e.features):void 0;break;case v:s=e.features.length?t.Photon.handleResponse(e.features):void 0;break;case b:s=e.resourceSets[0].resources.length?t.Bing.handleResponse(e.resourceSets[0].resources):void 0;break;case w:s=e.results.length?t.OpenCage.handleResponse(e.results):void 0;break;default:s=t.options.provider.handleResponse(e)}s&&(t.createList(s),t.listenMapClick())}).catch(function(e){N(t.els.reset,U.spin);const s=S("li","<h5>Error! No internet connection?</h5>");t.els.result.appendChild(s)})},G.prototype.createList=function(e){var t=this;const s=this.els.result;e.forEach(function(e){let n;switch(t.options.provider){case f:n='<span class="'+U.road+'">'+e.address.name+"</span>";break;default:n=t.addressTemplate(e.address)}const r=S("li",'<a href="#">'+n+"</a>");r.addEventListener("click",function(s){s.preventDefault(),t.chosen(e,n,e.address,e.original)},!1),s.appendChild(r)})},G.prototype.chosen=function(e,t,s,n){const o=this.Base.getMap(),a=[parseFloat(e.lon),parseFloat(e.lat)],i=o.getView().getProjection(),l=r.transform(a,"EPSG:4326",i);let c=e.bbox;c&&(c=r.transformExtent(c,"EPSG:4326",i));const u={formatted:t,details:s,original:n};if(!1===this.options.keepOpen&&this.clearResults(!0),!0===this.options.preventDefault)this.Base.dispatchEvent({type:p,address:u,coordinate:l,bbox:c});else{c?o.getView().fit(c,{duration:500}):function(e,t,s,n){n=n||2.388657133911758,s=s||500,e.getView().animate({duration:s,resolution:n},{duration:s,center:t})}(o,l);const e=this.createFeature(l,u);this.Base.dispatchEvent({type:p,address:u,feature:e,coordinate:l,bbox:c})}},G.prototype.createFeature=function(e){const t=new n(new s(e));return this.addLayer(),t.setStyle(this.options.featureStyle),t.setId(x("geocoder-ft-")),this.getSource().addFeature(t),t},G.prototype.addressTemplate=function(e){let t=[];return e.name&&t.push(['<span class="',U.road,'">{name}</span>'].join("")),(e.road||e.building||e.house_number)&&t.push(['<span class="',U.road,'">{building} {road} {house_number}</span>'].join("")),(e.city||e.town||e.village)&&t.push(['<span class="',U.city,'">{postcode} {city} {town} {village}</span>'].join("")),(e.state||e.country)&&t.push(['<span class="',U.country,'">{state} {country}</span>'].join("")),L(t.join("<br>"),e)},G.prototype.getProvider=function(e){let t;switch(e.provider){case f:t=this.OpenStreet.getParameters(e);break;case y:t=this.MapQuest.getParameters(e);break;case v:t=this.Photon.getParameters(e);break;case k:t=this.Pelias.getParameters(e);break;case b:t=this.Bing.getParameters(e);break;case w:t=this.OpenCage.getParameters(e);break;default:t=e.provider.getParameters(e)}return t},G.prototype.expand=function(){var e=this;N(this.els.input,U.spin),P(this.els.control,U.glass.expanded),window.setTimeout(function(){return e.els.input.focus()},100),this.listenMapClick()},G.prototype.collapse=function(){this.els.input.value="",this.els.input.blur(),P(this.els.reset,U.hidden),N(this.els.control,U.glass.expanded),this.clearResults()},G.prototype.listenMapClick=function(){if(this.registeredListeners.mapClick)return;const e=this,t=this.Base.getMap().getTargetElement();this.registeredListeners.mapClick=!0,t.addEventListener("click",{handleEvent:function(s){e.clearResults(!0),t.removeEventListener(s.type,this,!1),e.registeredListeners.mapClick=!1}},!1)},G.prototype.clearResults=function(e){e&&this.options.targetType===h?this.collapse():function(e){for(;e.firstChild;)e.removeChild(e.firstChild)}(this.els.result)},G.prototype.getSource=function(){return this.layer.getSource()},G.prototype.addLayer=function(){var e=this;let t=!1;const s=this.Base.getMap();s.getLayers().forEach(function(s){s===e.layer&&(t=!0)}),t||s.addLayer(this.layer)},function(e){function t(s,n){if(void 0===s&&(s=d.NOMINATIM),void 0===n&&(n={}),!(this instanceof t))return new t;let r;E("string"==typeof s,"@param `type` should be string!"),E(s===d.NOMINATIM||s===d.REVERSE,"@param 'type' should be '"+d.NOMINATIM+"'\n        or '"+d.REVERSE+"'!"),E("object"==typeof n,"@param `options` should be object!"),C.featureStyle=[new a({image:new i({scale:.7,src:g})})],this.options=function(e,t){let s={};for(let t in e)s[t]=e[t];for(let e in t)s[e]=t[e];return s}(C,n),this.container=void 0;const o=new M(this);s===d.NOMINATIM?(this.container=o.els.container,r=new G(this,o.els),this.layer=r.layer):d.REVERSE,e.call(this,{element:this.container})}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.getLayer=function(){return this.layer},t.prototype.getSource=function(){return this.getLayer().getSource()},t.prototype.setProvider=function(e){this.options.provider=e},t.prototype.setProviderKey=function(e){this.options.key=e},t}(o)});