(this.webpackJsonpanimations=this.webpackJsonpanimations||[]).push([[0],[,,,function(e,t,n){e.exports=n(10)},,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),i=n(2),r=n.n(i);n(8);var c=function(e){var t=e.draw,n=e.width,i=e.height,r=(e.source,Object(a.useRef)(null));return Object(a.useEffect)((function(){var e,n=r.current.getContext("2d"),a=0;return function o(){a++,t(n,a),e=window.requestAnimationFrame(o)}(),function(){window.cancelAnimationFrame(e)}}),[t]),o.a.createElement("canvas",{className:"border",ref:r,width:n,height:i})};n(9);var s=function(){var e=Math.min(window.innerWidth-8,window.innerHeight-8),t=e;return o.a.createElement("div",null,o.a.createElement(c,{draw:function(n,a){for(var o=n.createImageData(n.canvas.width,n.canvas.height),i=o.data,r=0,c=0,s=0;s<i.length;s+=4){var h,u=a%200;function w(e,t,n){return Math.sin(e*Math.pow(n,.2))>Math.cos(t*Math.pow(n,.2))&&e*e+t*t<n*n}w(r+1-e/2,t/2-c,h=u<100?u:200-u-1)&&(i[s]=7*h%256,i[s+1]=5*h%256,i[s+2]=3*h%256),i[s+3]=255,++r===e&&(r=0,c++)}n.putImageData(o,0,0)},width:e,height:t,source:"https://www.visitaparadise.com/wp-content/themes/yootheme/cache/sunset-d863fdd4.jpeg"}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(s,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[3,1,2]]]);
//# sourceMappingURL=main.c824e67b.chunk.js.map