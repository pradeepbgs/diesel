var Nf=Object.create;var{getPrototypeOf:Lf,defineProperty:X,getOwnPropertyNames:h,getOwnPropertyDescriptor:Mf}=Object,n=Object.prototype.hasOwnProperty;var cf=(f,g,v)=>{v=f!=null?Nf(Lf(f)):{};let u=g||!f||!f.__esModule?X(v,"default",{value:f,enumerable:!0}):v;for(let C of h(f))if(!n.call(u,C))X(u,C,{get:()=>f[C],enumerable:!0});return u},m=new WeakMap,Hf=(f)=>{var g=m.get(f),v;if(g)return g;if(g=X({},"__esModule",{value:!0}),f&&typeof f==="object"||typeof f==="function")h(f).map((u)=>!n.call(g,u)&&X(g,u,{get:()=>f[u],enumerable:!(v=Mf(f,u))||v.enumerable}));return m.set(f,g),g},H=(f,g)=>()=>(g||f((g={exports:{}}).exports,g),g.exports);var Sf=(f,g)=>{for(var v in g)X(f,v,{get:g[v],enumerable:!0,configurable:!0,set:(u)=>g[v]=()=>u})};var If=(f,g)=>()=>(f&&(g=f(f=0)),g);var yf=((f)=>typeof require!=="undefined"?require:typeof Proxy!=="undefined"?new Proxy(f,{get:(g,v)=>(typeof require!=="undefined"?require:g)[v]}):f)(function(f){if(typeof require!=="undefined")return require.apply(this,arguments);throw Error('Dynamic require of "'+f+'" is not supported')});var Cf={};Sf(Cf,{sep:()=>vf,resolve:()=>q,relative:()=>t,posix:()=>uf,parse:()=>ff,normalize:()=>S,join:()=>i,isAbsolute:()=>l,format:()=>p,extname:()=>o,dirname:()=>s,delimiter:()=>gf,default:()=>Ef,basename:()=>e,_makeLong:()=>a});function G(f){if(typeof f!=="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(f))}function d(f,g){var v="",u=0,C=-1,w=0,r;for(var j=0;j<=f.length;++j){if(j<f.length)r=f.charCodeAt(j);else if(r===47)break;else r=47;if(r===47){if(C===j-1||w===1);else if(C!==j-1&&w===2){if(v.length<2||u!==2||v.charCodeAt(v.length-1)!==46||v.charCodeAt(v.length-2)!==46){if(v.length>2){var z=v.lastIndexOf("/");if(z!==v.length-1){if(z===-1)v="",u=0;else v=v.slice(0,z),u=v.length-1-v.lastIndexOf("/");C=j,w=0;continue}}else if(v.length===2||v.length===1){v="",u=0,C=j,w=0;continue}}if(g){if(v.length>0)v+="/..";else v="..";u=2}}else{if(v.length>0)v+="/"+f.slice(C+1,j);else v=f.slice(C+1,j);u=j-C-1}C=j,w=0}else if(r===46&&w!==-1)++w;else w=-1}return v}function Of(f,g){var v=g.dir||g.root,u=g.base||(g.name||"")+(g.ext||"");if(!v)return u;if(v===g.root)return v+u;return v+f+u}function q(){var f="",g=!1,v;for(var u=arguments.length-1;u>=-1&&!g;u--){var C;if(u>=0)C=arguments[u];else{if(v===void 0)v=process.cwd();C=v}if(G(C),C.length===0)continue;f=C+"/"+f,g=C.charCodeAt(0)===47}if(f=d(f,!g),g)if(f.length>0)return"/"+f;else return"/";else if(f.length>0)return f;else return"."}function S(f){if(G(f),f.length===0)return".";var g=f.charCodeAt(0)===47,v=f.charCodeAt(f.length-1)===47;if(f=d(f,!g),f.length===0&&!g)f=".";if(f.length>0&&v)f+="/";if(g)return"/"+f;return f}function l(f){return G(f),f.length>0&&f.charCodeAt(0)===47}function i(){if(arguments.length===0)return".";var f;for(var g=0;g<arguments.length;++g){var v=arguments[g];if(G(v),v.length>0)if(f===void 0)f=v;else f+="/"+v}if(f===void 0)return".";return S(f)}function t(f,g){if(G(f),G(g),f===g)return"";if(f=q(f),g=q(g),f===g)return"";var v=1;for(;v<f.length;++v)if(f.charCodeAt(v)!==47)break;var u=f.length,C=u-v,w=1;for(;w<g.length;++w)if(g.charCodeAt(w)!==47)break;var r=g.length,j=r-w,z=C<j?C:j,J=-1,$=0;for(;$<=z;++$){if($===z){if(j>z){if(g.charCodeAt(w+$)===47)return g.slice(w+$+1);else if($===0)return g.slice(w+$)}else if(C>z){if(f.charCodeAt(v+$)===47)J=$;else if($===0)J=0}break}var A=f.charCodeAt(v+$),b=g.charCodeAt(w+$);if(A!==b)break;else if(A===47)J=$}var Q="";for($=v+J+1;$<=u;++$)if($===u||f.charCodeAt($)===47)if(Q.length===0)Q+="..";else Q+="/..";if(Q.length>0)return Q+g.slice(w+J);else{if(w+=J,g.charCodeAt(w)===47)++w;return g.slice(w)}}function a(f){return f}function s(f){if(G(f),f.length===0)return".";var g=f.charCodeAt(0),v=g===47,u=-1,C=!0;for(var w=f.length-1;w>=1;--w)if(g=f.charCodeAt(w),g===47){if(!C){u=w;break}}else C=!1;if(u===-1)return v?"/":".";if(v&&u===1)return"//";return f.slice(0,u)}function e(f,g){if(g!==void 0&&typeof g!=="string")throw new TypeError('"ext" argument must be a string');G(f);var v=0,u=-1,C=!0,w;if(g!==void 0&&g.length>0&&g.length<=f.length){if(g.length===f.length&&g===f)return"";var r=g.length-1,j=-1;for(w=f.length-1;w>=0;--w){var z=f.charCodeAt(w);if(z===47){if(!C){v=w+1;break}}else{if(j===-1)C=!1,j=w+1;if(r>=0)if(z===g.charCodeAt(r)){if(--r===-1)u=w}else r=-1,u=j}}if(v===u)u=j;else if(u===-1)u=f.length;return f.slice(v,u)}else{for(w=f.length-1;w>=0;--w)if(f.charCodeAt(w)===47){if(!C){v=w+1;break}}else if(u===-1)C=!1,u=w+1;if(u===-1)return"";return f.slice(v,u)}}function o(f){G(f);var g=-1,v=0,u=-1,C=!0,w=0;for(var r=f.length-1;r>=0;--r){var j=f.charCodeAt(r);if(j===47){if(!C){v=r+1;break}continue}if(u===-1)C=!1,u=r+1;if(j===46){if(g===-1)g=r;else if(w!==1)w=1}else if(g!==-1)w=-1}if(g===-1||u===-1||w===0||w===1&&g===u-1&&g===v+1)return"";return f.slice(g,u)}function p(f){if(f===null||typeof f!=="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof f);return Of("/",f)}function ff(f){G(f);var g={root:"",dir:"",base:"",ext:"",name:""};if(f.length===0)return g;var v=f.charCodeAt(0),u=v===47,C;if(u)g.root="/",C=1;else C=0;var w=-1,r=0,j=-1,z=!0,J=f.length-1,$=0;for(;J>=C;--J){if(v=f.charCodeAt(J),v===47){if(!z){r=J+1;break}continue}if(j===-1)z=!1,j=J+1;if(v===46){if(w===-1)w=J;else if($!==1)$=1}else if(w!==-1)$=-1}if(w===-1||j===-1||$===0||$===1&&w===j-1&&w===r+1){if(j!==-1)if(r===0&&u)g.base=g.name=f.slice(1,j);else g.base=g.name=f.slice(r,j)}else{if(r===0&&u)g.name=f.slice(1,w),g.base=f.slice(1,j);else g.name=f.slice(r,w),g.base=f.slice(r,j);g.ext=f.slice(w,j)}if(r>0)g.dir=f.slice(0,r-1);else if(u)g.dir="/";return g}var vf="/",gf=":",uf,Ef;var wf=If(()=>{uf=((f)=>(f.posix=f,f))({resolve:q,normalize:S,isAbsolute:l,join:i,relative:t,_makeLong:a,dirname:s,basename:e,extname:o,format:p,parse:ff,sep:vf,delimiter:gf,win32:null,posix:null}),Ef=uf});var $f=H((hf)=>{var Pf=/[|\\{}()[\]^$+*?.]/g,xf=Object.prototype.hasOwnProperty,y=function(f,g){return xf.apply(f,[g])};hf.escapeRegExpChars=function(f){if(!f)return"";return String(f).replace(Pf,"\\$&")};var _f={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"},Tf=/[&<>'"]/g;function kf(f){return _f[f]||f}var mf=`var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
`;hf.escapeXML=function(f){return f==null?"":String(f).replace(Tf,kf)};function rf(){return Function.prototype.toString.call(this)+`;
`+mf}try{if(typeof Object.defineProperty==="function")Object.defineProperty(hf.escapeXML,"toString",{value:rf});else hf.escapeXML.toString=rf}catch(f){console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)")}hf.shallowCopy=function(f,g){if(g=g||{},f!==null&&f!==void 0)for(var v in g){if(!y(g,v))continue;if(v==="__proto__"||v==="constructor")continue;f[v]=g[v]}return f};hf.shallowCopyFromList=function(f,g,v){if(v=v||[],g=g||{},f!==null&&f!==void 0)for(var u=0;u<v.length;u++){var C=v[u];if(typeof g[C]!="undefined"){if(!y(g,C))continue;if(C==="__proto__"||C==="constructor")continue;f[C]=g[C]}}return f};hf.cache={_data:{},set:function(f,g){this._data[f]=g},get:function(f){return this._data[f]},remove:function(f){delete this._data[f]},reset:function(){this._data={}}};hf.hyphenToCamel=function(f){return f.replace(/-[a-z]/g,function(g){return g[1].toUpperCase()})};hf.createNullProtoObjWherePossible=function(){if(typeof Object.create=="function")return function(){return Object.create(null)};if(!({__proto__:null}instanceof Object))return function(){return{__proto__:null}};return function(){return{}}}();hf.hasOwnOnlyObject=function(f){var g=hf.createNullProtoObjWherePossible();for(var v in f)if(y(f,v))g[v]=f[v];return g}});var zf=H((N1,ef)=>{ef.exports={name:"ejs",description:"Embedded JavaScript templates",keywords:["template","engine","ejs"],version:"3.1.10",author:"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",license:"Apache-2.0",bin:{ejs:"./bin/cli.js"},main:"./lib/ejs.js",jsdelivr:"ejs.min.js",unpkg:"ejs.min.js",repository:{type:"git",url:"git://github.com/mde/ejs.git"},bugs:"https://github.com/mde/ejs/issues",homepage:"https://github.com/mde/ejs",dependencies:{jake:"^10.8.5"},devDependencies:{browserify:"^16.5.1",eslint:"^6.8.0","git-directory-deploy":"^1.5.1",jsdoc:"^4.0.2","lru-cache":"^4.0.1",mocha:"^10.2.0","uglify-js":"^3.3.16"},engines:{node:">=0.10.0"},scripts:{test:"npx jake test"}}});var Uf=H((bf)=>{var P=(()=>({})),W=(wf(),Hf(Cf)),K=$f(),Jf=!1,of=zf().version,pf="<",f1=">",v1="%",Qf="locals",g1="ejs",u1="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)",Gf=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"],C1=Gf.concat("cache"),Kf=/^\uFEFF/,O=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;bf.cache=K.cache;bf.fileLoader=P.readFileSync;bf.localsName=Qf;bf.promiseImpl=new Function("return this;")().Promise;bf.resolveInclude=function(f,g,v){var{dirname:u,extname:C,resolve:w}=W,r=w(v?g:u(g),f),j=C(f);if(!j)r+=".ejs";return r};function Yf(f,g){var v;if(g.some(function(u){return v=bf.resolveInclude(f,u,!0),P.existsSync(v)}))return v}function w1(f,g){var v,u,C=g.views,w=/^[A-Za-z]+:\\|^\//.exec(f);if(w&&w.length)if(f=f.replace(/^\/*/,""),Array.isArray(g.root))v=Yf(f,g.root);else v=bf.resolveInclude(f,g.root||"/",!0);else{if(g.filename){if(u=bf.resolveInclude(f,g.filename),P.existsSync(u))v=u}if(!v&&Array.isArray(C))v=Yf(f,C);if(!v&&typeof g.includer!=="function")throw new Error('Could not find the include file "'+g.escapeFunction(f)+'"')}return v}function U(f,g){var v,u=f.filename,C=arguments.length>1;if(f.cache){if(!u)throw new Error("cache option requires a filename");if(v=bf.cache.get(u),v)return v;if(!C)g=Zf(u).toString().replace(Kf,"")}else if(!C){if(!u)throw new Error("Internal EJS error: no file name or template provided");g=Zf(u).toString().replace(Kf,"")}if(v=bf.compile(g,f),f.cache)bf.cache.set(u,v);return v}function r1(f,g,v){var u;if(!v)if(typeof bf.promiseImpl=="function")return new bf.promiseImpl(function(C,w){try{u=U(f)(g),C(u)}catch(r){w(r)}});else throw new Error("Please provide a callback function");else{try{u=U(f)(g)}catch(C){return v(C)}v(null,u)}}function Zf(f){return bf.fileLoader(f)}function j1(f,g){var v=K.shallowCopy(K.createNullProtoObjWherePossible(),g);if(v.filename=w1(f,v),typeof g.includer==="function"){var u=g.includer(f,v.filename);if(u){if(u.filename)v.filename=u.filename;if(u.template)return U(v,u.template)}}return U(v)}function Af(f,g,v,u,C){var w=g.split(`
`),r=Math.max(u-3,0),j=Math.min(w.length,u+3),z=C(v),J=w.slice(r,j).map(function($,A){var b=A+r+1;return(b==u?" >> ":"    ")+b+"| "+$}).join(`
`);throw f.path=z,f.message=(z||"ejs")+":"+u+`
`+J+`

`+f.message,f}function Vf(f){return f.replace(/;(\s*$)/,"$1")}bf.compile=function f(g,v){var u;if(v&&v.scope){if(!Jf)console.warn("`scope` option is deprecated and will be removed in EJS 3"),Jf=!0;if(!v.context)v.context=v.scope;delete v.scope}return u=new Y(g,v),u.compile()};bf.render=function(f,g,v){var u=g||K.createNullProtoObjWherePossible(),C=v||K.createNullProtoObjWherePossible();if(arguments.length==2)K.shallowCopyFromList(C,u,Gf);return U(C,f)(u)};bf.renderFile=function(){var f=Array.prototype.slice.call(arguments),g=f.shift(),v,u={filename:g},C,w;if(typeof arguments[arguments.length-1]=="function")v=f.pop();if(f.length){if(C=f.shift(),f.length)K.shallowCopy(u,f.pop());else{if(C.settings){if(C.settings.views)u.views=C.settings.views;if(C.settings["view cache"])u.cache=!0;if(w=C.settings["view options"],w)K.shallowCopy(u,w)}K.shallowCopyFromList(u,C,C1)}u.filename=g}else C=K.createNullProtoObjWherePossible();return r1(u,C,v)};bf.Template=Y;bf.clearCache=function(){bf.cache.reset()};function Y(f,g){var v=K.hasOwnOnlyObject(g),u=K.createNullProtoObjWherePossible();if(this.templateText=f,this.mode=null,this.truncate=!1,this.currentLine=1,this.source="",u.client=v.client||!1,u.escapeFunction=v.escape||v.escapeFunction||K.escapeXML,u.compileDebug=v.compileDebug!==!1,u.debug=!!v.debug,u.filename=v.filename,u.openDelimiter=v.openDelimiter||bf.openDelimiter||pf,u.closeDelimiter=v.closeDelimiter||bf.closeDelimiter||f1,u.delimiter=v.delimiter||bf.delimiter||v1,u.strict=v.strict||!1,u.context=v.context,u.cache=v.cache||!1,u.rmWhitespace=v.rmWhitespace,u.root=v.root,u.includer=v.includer,u.outputFunctionName=v.outputFunctionName,u.localsName=v.localsName||bf.localsName||Qf,u.views=v.views,u.async=v.async,u.destructuredLocals=v.destructuredLocals,u.legacyInclude=typeof v.legacyInclude!="undefined"?!!v.legacyInclude:!0,u.strict)u._with=!1;else u._with=typeof v._with!="undefined"?v._with:!0;this.opts=u,this.regex=this.createRegex()}Y.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"};Y.prototype={createRegex:function(){var f=u1,g=K.escapeRegExpChars(this.opts.delimiter),v=K.escapeRegExpChars(this.opts.openDelimiter),u=K.escapeRegExpChars(this.opts.closeDelimiter);return f=f.replace(/%/g,g).replace(/</g,v).replace(/>/g,u),new RegExp(f)},compile:function(){var f,g,v=this.opts,u="",C="",w=v.escapeFunction,r,j=v.filename?JSON.stringify(v.filename):"undefined";if(!this.source){if(this.generateSource(),u+=`  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
`,v.outputFunctionName){if(!O.test(v.outputFunctionName))throw new Error("outputFunctionName is not a valid JS identifier.");u+="  var "+v.outputFunctionName+` = __append;
`}if(v.localsName&&!O.test(v.localsName))throw new Error("localsName is not a valid JS identifier.");if(v.destructuredLocals&&v.destructuredLocals.length){var z="  var __locals = ("+v.localsName+` || {}),
`;for(var J=0;J<v.destructuredLocals.length;J++){var $=v.destructuredLocals[J];if(!O.test($))throw new Error("destructuredLocals["+J+"] is not a valid JS identifier.");if(J>0)z+=`,
  `;z+=$+" = __locals."+$}u+=z+`;
`}if(v._with!==!1)u+="  with ("+v.localsName+` || {}) {
`,C+=`  }
`;C+=`  return __output;
`,this.source=u+this.source+C}if(v.compileDebug)f=`var __line = 1
  , __lines = `+JSON.stringify(this.templateText)+`
  , __filename = `+j+`;
try {
`+this.source+`} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}
`;else f=this.source;if(v.client){if(f="escapeFn = escapeFn || "+w.toString()+`;
`+f,v.compileDebug)f="rethrow = rethrow || "+Af.toString()+`;
`+f}if(v.strict)f=`"use strict";
`+f;if(v.debug)console.log(f);if(v.compileDebug&&v.filename)f=f+`
//# sourceURL=`+j+`
`;try{if(v.async)try{r=new Function("return (async function(){}).constructor;")()}catch(Z){if(Z instanceof SyntaxError)throw new Error("This environment does not support async/await");else throw Z}else r=Function;g=new r(v.localsName+", escapeFn, include, rethrow",f)}catch(Z){if(Z instanceof SyntaxError){if(v.filename)Z.message+=" in "+v.filename;if(Z.message+=` while compiling ejs

`,Z.message+=`If the above error is not helpful, you may want to try EJS-Lint:
`,Z.message+="https://github.com/RyanZim/EJS-Lint",!v.async)Z.message+=`
`,Z.message+="Or, if you meant to create an async function, pass `async: true` as an option."}throw Z}var A=v.client?g:function Z(L){var B=function(V,M){var c=K.shallowCopy(K.createNullProtoObjWherePossible(),L);if(M)c=K.shallowCopy(c,M);return j1(V,v)(c)};return g.apply(v.context,[L||K.createNullProtoObjWherePossible(),w,B,Af])};if(v.filename&&typeof Object.defineProperty==="function"){var b=v.filename,Q=W.basename(b,W.extname(b));try{Object.defineProperty(A,"name",{value:Q,writable:!1,enumerable:!1,configurable:!0})}catch(Z){}}return A},generateSource:function(){var f=this.opts;if(f.rmWhitespace)this.templateText=this.templateText.replace(/[\r\n]+/g,`
`).replace(/^\s+|\s+$/gm,"");this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var g=this,v=this.parseTemplateText(),u=this.opts.delimiter,C=this.opts.openDelimiter,w=this.opts.closeDelimiter;if(v&&v.length)v.forEach(function(r,j){var z;if(r.indexOf(C+u)===0&&r.indexOf(C+u+u)!==0){if(z=v[j+2],!(z==u+w||z=="-"+u+w||z=="_"+u+w))throw new Error('Could not find matching close tag for "'+r+'".')}g.scanLine(r)})},parseTemplateText:function(){var f=this.templateText,g=this.regex,v=g.exec(f),u=[],C;while(v){if(C=v.index,C!==0)u.push(f.substring(0,C)),f=f.slice(C);u.push(v[0]),f=f.slice(v[0].length),v=g.exec(f)}if(f)u.push(f);return u},_addOutput:function(f){if(this.truncate)f=f.replace(/^(?:\r\n|\r|\n)/,""),this.truncate=!1;if(!f)return f;f=f.replace(/\\/g,"\\\\"),f=f.replace(/\n/g,"\\n"),f=f.replace(/\r/g,"\\r"),f=f.replace(/"/g,"\\\""),this.source+='    ; __append("'+f+`")
`},scanLine:function(f){var g=this,v=this.opts.delimiter,u=this.opts.openDelimiter,C=this.opts.closeDelimiter,w=0;switch(w=f.split(`
`).length-1,f){case u+v:case u+v+"_":this.mode=Y.modes.EVAL;break;case u+v+"=":this.mode=Y.modes.ESCAPED;break;case u+v+"-":this.mode=Y.modes.RAW;break;case u+v+"#":this.mode=Y.modes.COMMENT;break;case u+v+v:this.mode=Y.modes.LITERAL,this.source+='    ; __append("'+f.replace(u+v+v,u+v)+`")
`;break;case v+v+C:this.mode=Y.modes.LITERAL,this.source+='    ; __append("'+f.replace(v+v+C,v+C)+`")
`;break;case v+C:case"-"+v+C:case"_"+v+C:if(this.mode==Y.modes.LITERAL)this._addOutput(f);this.mode=null,this.truncate=f.indexOf("-")===0||f.indexOf("_")===0;break;default:if(this.mode){switch(this.mode){case Y.modes.EVAL:case Y.modes.ESCAPED:case Y.modes.RAW:if(f.lastIndexOf("//")>f.lastIndexOf(`
`))f+=`
`}switch(this.mode){case Y.modes.EVAL:this.source+="    ; "+f+`
`;break;case Y.modes.ESCAPED:this.source+="    ; __append(escapeFn("+Vf(f)+`))
`;break;case Y.modes.RAW:this.source+="    ; __append("+Vf(f)+`)
`;break;case Y.modes.COMMENT:break;case Y.modes.LITERAL:this._addOutput(f);break}}else this._addOutput(f)}if(g.opts.compileDebug&&w)this.currentLine+=w,this.source+="    ; __line = "+this.currentLine+`
`}};bf.escapeXML=K.escapeXML;bf.__express=bf.renderFile;bf.VERSION=of;bf.name=g1;if(typeof window!="undefined")window.ejs=bf});function F(f){switch(f.split(".").pop()?.toLowerCase()){case"js":return"application/javascript";case"css":return"text/css";case"html":return"text/html";case"json":return"application/json";case"png":return"image/png";case"jpg":case"jpeg":return"image/jpeg";case"svg":return"image/svg+xml";case"gif":return"image/gif";case"woff":return"font/woff";case"woff2":return"font/woff2";default:return"application/octet-stream"}}var x=null;async function Q1(){if(!x){let f=await Promise.resolve().then(() => cf(Uf(),1));x=f.default||f}return x}class _{req;server;path;routePattern;paramNames;env;executionContext;headers=new Headers;parsedQuery=null;parsedParams=null;parsedCookies=null;parsedBody=null;contextData={};urlObject=null;constructor(f,g,v,u,C,w,r){this.req=f,this.server=g,this.path=v,this.routePattern=u,this.executionContext=r,this.env=w,this.paramNames=C}setHeader(f,g){return this.headers.set(f,g),this}removeHeader(f){return this.headers.delete(f),this}set(f,g){return this.contextData[f]=g,this}get(f){return this.contextData[f]}get ip(){if(this.server)return this.server.requestIP(this.req)?.address??null;return this.req.headers.get("CF-Connecting-IP")||null}get url(){if(!this.urlObject)this.urlObject=new URL(this.req.url);return this.urlObject}get query(){if(!this.parsedQuery)this.parsedQuery=this.url.search?Object.fromEntries(this.url.searchParams):{};return this.parsedQuery}get params(){if(!this.parsedParams)try{this.parsedParams=b1(this.paramNames,this.path)}catch(f){let g=f instanceof Error?f.message:String(f);throw new Error(`Failed to extract route parameters: ${g}`)}return this.parsedParams??{}}get body(){if(this.req.method==="GET")return Promise.resolve({});if(!this.parsedBody)this.parsedBody=(async()=>{try{let f=await B1(this.req);if(f.error)throw new Error(f.error);return Object.keys(f).length===0?null:f}catch(f){throw new Error("Invalid request body format")}})();return this.parsedBody}text(f,g=200){return new Response(f,{status:g,headers:this.headers})}send(f,g=200){let v;if(f instanceof Uint8Array)v="Uint8Array";else if(f instanceof ArrayBuffer)v="ArrayBuffer";else v=typeof f;let u=v==="object"&&f!==null?JSON.stringify(f):f;return new Response(u,{status:g,headers:this.headers})}json(f,g=200){return Response.json(f,{status:g,headers:this.headers})}file(f,g,v=200){let u=Bun.file(f);if(!this.headers.has("Content-Type"))this.headers.set("Content-Type",g??F(f));return new Response(u,{status:v,headers:this.headers})}async ejs(f,g={},v=200){let u=await Q1();try{let C=await Bun.file(f).text(),w=u.render(C,g),r=new Headers({"Content-Type":"text/html; charset=utf-8"});return new Response(w,{status:v,headers:r})}catch(C){return console.error("EJS Rendering Error:",C),new Response("Error rendering template",{status:500})}}redirect(f,g=302){return this.headers.set("Location",f),new Response(null,{status:g,headers:this.headers})}setCookie(f,g,v={}){let u=`${encodeURIComponent(f)}=${encodeURIComponent(g)}`;if(v.maxAge)u+=`; Max-Age=${v.maxAge}`;if(v.expires)u+=`; Expires=${v.expires.toUTCString()}`;if(v.path)u+=`; Path=${v.path}`;if(v.domain)u+=`; Domain=${v.domain}`;if(v.secure)u+="; Secure";if(v.httpOnly)u+="; HttpOnly";if(v.sameSite)u+=`; SameSite=${v.sameSite}`;return this.headers.append("Set-Cookie",u),this}get cookies(){if(!this.parsedCookies){let f=this.req.headers.get("cookie");this.parsedCookies=f?G1(f):{}}return this.parsedCookies}stream(f){let g=new Headers(this.headers),v=new ReadableStream({async start(u){await f(u),u.close()}});return new Response(v,{headers:g})}yieldStream(f){return new Response}}function G1(f){return Object.fromEntries(f.split(";").map((g)=>{let[v,...u]=g.trim().split("=");return[v,decodeURIComponent(u.join("="))]}))}function b1(f,g){let v={},[u]=g.split("?"),C=u.split("/").filter((r)=>r!==""),w=C.length-f.length;for(let r=0;r<f.length;r++)v[f[r]]=C[w+r];return v}function I1(f,g){let v={},u=f.split("/"),[C]=g.split("?"),w=C.split("/");if(u.length!==w.length)return null;for(let r=0;r<u.length;r++){let j=u[r];if(j.charCodeAt(0)===58)v[j.slice(1)]=w[r]}return v}async function B1(f){let g=f.headers.get("Content-Type")||"";if(!g)return{};if(f.headers.get("Content-Length")==="0"||!f.body)return{};if(g.startsWith("application/json"))return await f.json();if(g.startsWith("application/x-www-form-urlencoded")){let u=await f.text();return Object.fromEntries(new URLSearchParams(u))}if(g.startsWith("multipart/form-data")){let u=await f.formData(),C={};for(let[w,r]of u.entries())C[w]=r;return C}return{error:"Unknown request body type"}}async function Ff(f,g,v){if(!g?.length)return;for(let u=0;u<g.length;u++){let C=g[u](...v),w=C instanceof Promise?await C:C;if(w&&f!=="onRequest")return w}}async function E1(f,g,v){let u=f.globalMiddlewares;if(u.length)for(let w of u){let r=await w(v);if(r)return r}let C=f.middlewares.get(g);if(C&&C.length)for(let w of C){let r=await w(v);if(r)return r}return null}async function qf(f,g,v){for(let u of f){let C=await u(g,v);if(C)return C}}async function Df(f,g,v){let u=await X1(f,g,v),C=u instanceof Promise?await u:u;if(C)return C}async function X1(f,g,v){if(g.endsWith("/"))g=g.slice(0,-1);if(!f.filters.has(g))if(f.filterFunction.length)for(let u of f.filterFunction){let C=await u(v);if(C)return C}else return Response.json({error:"Protected route, authentication required"},{status:401})}async function Rf(f,g,v){if(f.staticPath){let C=!0;if(f.staticRequestPath)C=v.startsWith(f.staticRequestPath);if(C){let w=await W1(f,v,g);if(w)return w;let r=f.router.find(g.req.method,"*");if(r?.handler)return await r.handler(g)}}let u=f.routeNotFoundFunc(g);return u instanceof Promise?await u:u||T(404,`404 Route not found for ${v}`)}function T(f,g){return new Response(JSON.stringify({error:g}),{status:f,headers:{"Content-Type":"application/json"}})}async function W1(f,g,v){if(!f.staticPath)return null;let u=`${f.staticPath}${g}`;if(await Bun.file(u).exists()){let w=F(u);return v.file(u,w,200)}return null}var N=(f)=>f.constructor.name==="AsyncFunction",k=(f,g,v,...u)=>{if(g.length>5)f.push(`
      for (let i = 0; i < diesel.hooks.${v}.length; i++) {
        const result = diesel.hooks.${v}[i](${u});
        const finalResult = result instanceof Promise ? await result : result;
        if (finalResult && '${v}' !== 'onRequest') return finalResult
    }
  `);else g?.forEach((C,w)=>{if(N(C))f.push(`
            const ${v}${w}Result = await diesel.hooks.${v}[${w}](${u})
            if (${v}${w}Result && '${v}' !== 'onRequest') return ${v}${w}Result
            `);else f.push(`
            const ${v}${w}Result = diesel.hooks.${v}[${w}](${u})
             if (${v}${w}Result && '${v}' !== 'onRequest') return ${v}${w}Result
            `)})},U1=(f)=>{f.push(`
    let pathname;
    const start = req.url.indexOf('/', req.url.indexOf(':') + 4);
    let i = start;
    for (; i < req.url.length; i++) {
        const charCode = req.url.charCodeAt(i);
        if (charCode === 37) { // percent-encoded
            const queryIndex = req.url.indexOf('?', i);
            const path = req.url.slice(start, queryIndex === -1 ? undefined : queryIndex);
            pathname = tryDecodeURI(path.includes('%25') ? path.replace(/%25/g, '%2525') : path);
            break;
        } else if (charCode === 63) { // ?
            break;
        }
    }
    if (!pathname) {
      pathname = req.url.slice(start, i);
    }
  `)},F1=(f,g)=>{if(g.length<=5)for(let v=0;v<g.length;v++)if(N(g[v]))f.push(`
          const resultMiddleware${v} = await globalMiddlewares[${v}](ctx);
          if (resultMiddleware${v}) return resultMiddleware${v};
      `);else f.push(`
        const resultMiddleware${v} = globalMiddlewares[${v}](ctx);
        if (resultMiddleware${v}) return resultMiddleware${v};
    `);else f.push(`
    for (let i = 0; i < globalMiddlewares.length; i++) {
      const result = await globalMiddlewares[i](ctx);
      if (result) return result;
    }
  `)},T1=(f,g)=>{let v=[],u=g.globalMiddlewares||[],C=f?.hasOnReqHook?g.hooks.onRequest:[],w=f?.hasPreHandlerHook?g.hooks.preHandler:[],r=f?.hasOnSendHook?g.hooks.onSend:[];if(U1(v),v.push(`
      const routeHandler = diesel.trie.search(pathname, req.method);
    `),C&&C.length>0)k(v,C,"onRequest","req","pathname","server");if(v.push(`
          const ctx = new Context(req, server, pathname, routeHandler?.path)
    `),f?.hasMiddleware){if(u.length>0)F1(v,u);if(g.middlewares.size>0)v.push(`
      const local = diesel.middlewares.get(pathname)
      if (local && local.length) {
        for (const middleware of local) {
          const result = await middleware(ctx);
          if (result) return result;
        }
      }
        `)}if(f.hasFilterEnabled)v.push(`
        const filterResponse = await runFilter(diesel, pathname, ctx);
        if (filterResponse) return filterResponse;
      `);if(v.push(`
      if (!routeHandler) return await handleRouteNotFound(diesel, ctx, pathname);
    `),f.hasPreHandlerHook)k(v,w,"preHandler","ctx");if(v.push(`
      const result = routeHandler.handler(ctx);
      const finalResult = result instanceof Promise ? await result : result;
    `),f.hasOnSendHook)k(v,r,"onSend","ctx","finalResult");v.push(`
      if (finalResult instanceof Response) return finalResult;
      return generateErrorResponse(500, "No response returned from handler.");
    `);let j=`
      return async function pipeline(req, server, diesel) {
          ${v.join(`
`)}
      }
    `;return new Function("runFilter","handleRouteNotFound","generateErrorResponse","globalMiddlewares","Context",j)(Df,Rf,T,u,_)},k1=(f,g,v,u,...C)=>{let w=[],r;if(typeof C[0]==="string"||typeof C[0]==="object")r=C[0];let j=C,z=f?.hasMiddleware?g.globalMiddlewares:[],J=f?.hasMiddleware?g.middlewares.get(u)||[]:[],$=[...z,...J],A=f?.hasOnReqHook?g.hooks.onRequest:[],b=g.filters.has(u),Q=g.filterFunction;if(A&&A?.length>0)w.push(`
      const onRequestResult = await runHooks(
        "onRequest",
        onRequestHooks,
        [req, "${u}", server]
      );
      if (onRequestResult) return onRequestResult;
    `);if($.length)w.push(`
      const globalMiddlewareResponse = await executeBunMiddlewares(
        allMiddlewares,
        req,
        server
      );
      if (globalMiddlewareResponse) return globalMiddlewareResponse;
    `);if(f.hasFilterEnabled){if(!b)w.push(`if (${Q.length}) {
        for (const filterFunction of filterFunctions) {
          const filterResult = await filterFunction(req, server);
          if (filterResult) return filterResult;
        }
      } else {
        return Response.json({ error: "Protected route, authentication required" }, { status: 401 });
      }`)}if(w.push(`
            if ("${v}" !== req.method)
        return new Response("Method Not Allowed", { status: 405 });
      `),typeof r!=="undefined")if(typeof r==="string")w.push(`
        return new Response(${JSON.stringify(r)});
      `);else{let B=JSON.stringify(r);w.push(`
        return new Response(${JSON.stringify(B)}, {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      `)}else if(j.length===1){let B=j[0];if(N(B))w.push(`
        const response = await handlers[0](req, server);
        if (response instanceof Response) return response;
      `);else w.push(`
        const response = handlers[0](req, server);
        if (response instanceof Response) return response;
      `)}else j.forEach((B,V)=>{if(N(B))w.push(`
            const response${V} = await handlers[${V}](req, server);
            if (response${V} instanceof Response) return response${V};
        `);else w.push(`
            const response${V} = handlers[${V}](req, server);
            if (response${V} instanceof Response) return response${V};
        `)});let Z=`
    return async function(req, server) {
      ${w.join(`
`)}
    }
  `;return new Function("executeBunMiddlewares","handlers","runHooks","filterFunctions","onRequestHooks","allMiddlewares",Z)(qf,j,Ff,Q,A,$)};export{T1 as buildRequestPipeline,k1 as BunRequestPipline};
