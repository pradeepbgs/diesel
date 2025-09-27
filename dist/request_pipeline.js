var yf=Object.create;var{getPrototypeOf:Hf,defineProperty:B,getOwnPropertyNames:m,getOwnPropertyDescriptor:Nf}=Object,n=Object.prototype.hasOwnProperty;var Lf=(f,u,g)=>{g=f!=null?yf(Hf(f)):{};let r=u||!f||!f.__esModule?B(g,"default",{value:f,enumerable:!0}):g;for(let v of m(f))if(!n.call(r,v))B(r,v,{get:()=>f[v],enumerable:!0});return r},k=new WeakMap,Sf=(f)=>{var u=k.get(f),g;if(u)return u;if(u=B({},"__esModule",{value:!0}),f&&typeof f==="object"||typeof f==="function")m(f).map((r)=>!n.call(u,r)&&B(u,r,{get:()=>f[r],enumerable:!(g=Nf(f,r))||g.enumerable}));return k.set(f,u),u},M=(f,u)=>()=>(u||f((u={exports:{}}).exports,u),u.exports);var If=(f,u)=>{for(var g in u)B(f,g,{get:u[g],enumerable:!0,configurable:!0,set:(r)=>u[g]=()=>r})};var Of=(f,u)=>()=>(f&&(u=f(f=0)),u);var Ef=((f)=>typeof require!=="undefined"?require:typeof Proxy!=="undefined"?new Proxy(f,{get:(u,g)=>(typeof require!=="undefined"?require:u)[g]}):f)(function(f){if(typeof require!=="undefined")return require.apply(this,arguments);throw Error('Dynamic require of "'+f+'" is not supported')});var rf={};If(rf,{sep:()=>ff,resolve:()=>R,relative:()=>i,posix:()=>uf,parse:()=>p,normalize:()=>y,join:()=>l,isAbsolute:()=>d,format:()=>o,extname:()=>e,dirname:()=>a,delimiter:()=>gf,default:()=>xf,basename:()=>s,_makeLong:()=>t});function A(f){if(typeof f!=="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(f))}function h(f,u){var g="",r=0,v=-1,w=0,c;for(var C=0;C<=f.length;++C){if(C<f.length)c=f.charCodeAt(C);else if(c===47)break;else c=47;if(c===47){if(v===C-1||w===1);else if(v!==C-1&&w===2){if(g.length<2||r!==2||g.charCodeAt(g.length-1)!==46||g.charCodeAt(g.length-2)!==46){if(g.length>2){var b=g.lastIndexOf("/");if(b!==g.length-1){if(b===-1)g="",r=0;else g=g.slice(0,b),r=g.length-1-g.lastIndexOf("/");v=C,w=0;continue}}else if(g.length===2||g.length===1){g="",r=0,v=C,w=0;continue}}if(u){if(g.length>0)g+="/..";else g="..";r=2}}else{if(g.length>0)g+="/"+f.slice(v+1,C);else g=f.slice(v+1,C);r=C-v-1}v=C,w=0}else if(c===46&&w!==-1)++w;else w=-1}return g}function Pf(f,u){var g=u.dir||u.root,r=u.base||(u.name||"")+(u.ext||"");if(!g)return r;if(g===u.root)return g+r;return g+f+r}function R(){var f="",u=!1,g;for(var r=arguments.length-1;r>=-1&&!u;r--){var v;if(r>=0)v=arguments[r];else{if(g===void 0)g=process.cwd();v=g}if(A(v),v.length===0)continue;f=v+"/"+f,u=v.charCodeAt(0)===47}if(f=h(f,!u),u)if(f.length>0)return"/"+f;else return"/";else if(f.length>0)return f;else return"."}function y(f){if(A(f),f.length===0)return".";var u=f.charCodeAt(0)===47,g=f.charCodeAt(f.length-1)===47;if(f=h(f,!u),f.length===0&&!u)f=".";if(f.length>0&&g)f+="/";if(u)return"/"+f;return f}function d(f){return A(f),f.length>0&&f.charCodeAt(0)===47}function l(){if(arguments.length===0)return".";var f;for(var u=0;u<arguments.length;++u){var g=arguments[u];if(A(g),g.length>0)if(f===void 0)f=g;else f+="/"+g}if(f===void 0)return".";return y(f)}function i(f,u){if(A(f),A(u),f===u)return"";if(f=R(f),u=R(u),f===u)return"";var g=1;for(;g<f.length;++g)if(f.charCodeAt(g)!==47)break;var r=f.length,v=r-g,w=1;for(;w<u.length;++w)if(u.charCodeAt(w)!==47)break;var c=u.length,C=c-w,b=v<C?v:C,$=-1,j=0;for(;j<=b;++j){if(j===b){if(C>b){if(u.charCodeAt(w+j)===47)return u.slice(w+j+1);else if(j===0)return u.slice(w+j)}else if(v>b){if(f.charCodeAt(g+j)===47)$=j;else if(j===0)$=0}break}var V=f.charCodeAt(g+j),Z=u.charCodeAt(w+j);if(V!==Z)break;else if(V===47)$=j}var Q="";for(j=g+$+1;j<=r;++j)if(j===r||f.charCodeAt(j)===47)if(Q.length===0)Q+="..";else Q+="/..";if(Q.length>0)return Q+u.slice(w+$);else{if(w+=$,u.charCodeAt(w)===47)++w;return u.slice(w)}}function t(f){return f}function a(f){if(A(f),f.length===0)return".";var u=f.charCodeAt(0),g=u===47,r=-1,v=!0;for(var w=f.length-1;w>=1;--w)if(u=f.charCodeAt(w),u===47){if(!v){r=w;break}}else v=!1;if(r===-1)return g?"/":".";if(g&&r===1)return"//";return f.slice(0,r)}function s(f,u){if(u!==void 0&&typeof u!=="string")throw new TypeError('"ext" argument must be a string');A(f);var g=0,r=-1,v=!0,w;if(u!==void 0&&u.length>0&&u.length<=f.length){if(u.length===f.length&&u===f)return"";var c=u.length-1,C=-1;for(w=f.length-1;w>=0;--w){var b=f.charCodeAt(w);if(b===47){if(!v){g=w+1;break}}else{if(C===-1)v=!1,C=w+1;if(c>=0)if(b===u.charCodeAt(c)){if(--c===-1)r=w}else c=-1,r=C}}if(g===r)r=C;else if(r===-1)r=f.length;return f.slice(g,r)}else{for(w=f.length-1;w>=0;--w)if(f.charCodeAt(w)===47){if(!v){g=w+1;break}}else if(r===-1)v=!1,r=w+1;if(r===-1)return"";return f.slice(g,r)}}function e(f){A(f);var u=-1,g=0,r=-1,v=!0,w=0;for(var c=f.length-1;c>=0;--c){var C=f.charCodeAt(c);if(C===47){if(!v){g=c+1;break}continue}if(r===-1)v=!1,r=c+1;if(C===46){if(u===-1)u=c;else if(w!==1)w=1}else if(u!==-1)w=-1}if(u===-1||r===-1||w===0||w===1&&u===r-1&&u===g+1)return"";return f.slice(u,r)}function o(f){if(f===null||typeof f!=="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof f);return Pf("/",f)}function p(f){A(f);var u={root:"",dir:"",base:"",ext:"",name:""};if(f.length===0)return u;var g=f.charCodeAt(0),r=g===47,v;if(r)u.root="/",v=1;else v=0;var w=-1,c=0,C=-1,b=!0,$=f.length-1,j=0;for(;$>=v;--$){if(g=f.charCodeAt($),g===47){if(!b){c=$+1;break}continue}if(C===-1)b=!1,C=$+1;if(g===46){if(w===-1)w=$;else if(j!==1)j=1}else if(w!==-1)j=-1}if(w===-1||C===-1||j===0||j===1&&w===C-1&&w===c+1){if(C!==-1)if(c===0&&r)u.base=u.name=f.slice(1,C);else u.base=u.name=f.slice(c,C)}else{if(c===0&&r)u.name=f.slice(1,w),u.base=f.slice(1,C);else u.name=f.slice(c,w),u.base=f.slice(c,C);u.ext=f.slice(w,C)}if(c>0)u.dir=f.slice(0,c-1);else if(r)u.dir="/";return u}var ff="/",gf=":",uf,xf;var vf=Of(()=>{uf=((f)=>(f.posix=f,f))({resolve:R,normalize:y,isAbsolute:d,join:l,relative:i,_makeLong:t,dirname:a,basename:s,extname:e,format:o,parse:p,sep:ff,delimiter:gf,win32:null,posix:null}),xf=uf});var Cf=M((df)=>{var _f=/[|\\{}()[\]^$+*?.]/g,Tf=Object.prototype.hasOwnProperty,N=function(f,u){return Tf.apply(f,[u])};df.escapeRegExpChars=function(f){if(!f)return"";return String(f).replace(_f,"\\$&")};var kf={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"},mf=/[&<>'"]/g;function nf(f){return kf[f]||f}var hf=`var _ENCODE_HTML_RULES = {
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
`;df.escapeXML=function(f){return f==null?"":String(f).replace(mf,nf)};function wf(){return Function.prototype.toString.call(this)+`;
`+hf}try{if(typeof Object.defineProperty==="function")Object.defineProperty(df.escapeXML,"toString",{value:wf});else df.escapeXML.toString=wf}catch(f){console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)")}df.shallowCopy=function(f,u){if(u=u||{},f!==null&&f!==void 0)for(var g in u){if(!N(u,g))continue;if(g==="__proto__"||g==="constructor")continue;f[g]=u[g]}return f};df.shallowCopyFromList=function(f,u,g){if(g=g||[],u=u||{},f!==null&&f!==void 0)for(var r=0;r<g.length;r++){var v=g[r];if(typeof u[v]!="undefined"){if(!N(u,v))continue;if(v==="__proto__"||v==="constructor")continue;f[v]=u[v]}}return f};df.cache={_data:{},set:function(f,u){this._data[f]=u},get:function(f){return this._data[f]},remove:function(f){delete this._data[f]},reset:function(){this._data={}}};df.hyphenToCamel=function(f){return f.replace(/-[a-z]/g,function(u){return u[1].toUpperCase()})};df.createNullProtoObjWherePossible=function(){if(typeof Object.create=="function")return function(){return Object.create(null)};if(!({__proto__:null}instanceof Object))return function(){return{__proto__:null}};return function(){return{}}}();df.hasOwnOnlyObject=function(f){var u=df.createNullProtoObjWherePossible();for(var g in f)if(N(f,g))u[g]=f[g];return u}});var jf=M((y1,pf)=>{pf.exports={name:"ejs",description:"Embedded JavaScript templates",keywords:["template","engine","ejs"],version:"3.1.10",author:"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",license:"Apache-2.0",bin:{ejs:"./bin/cli.js"},main:"./lib/ejs.js",jsdelivr:"ejs.min.js",unpkg:"ejs.min.js",repository:{type:"git",url:"git://github.com/mde/ejs.git"},bugs:"https://github.com/mde/ejs/issues",homepage:"https://github.com/mde/ejs",dependencies:{jake:"^10.8.5"},devDependencies:{browserify:"^16.5.1",eslint:"^6.8.0","git-directory-deploy":"^1.5.1",jsdoc:"^4.0.2","lru-cache":"^4.0.1",mocha:"^10.2.0","uglify-js":"^3.3.16"},engines:{node:">=0.10.0"},scripts:{test:"npx jake test"}}});var Xf=M((Vf)=>{var I=(()=>({})),X=(vf(),Sf(rf)),z=Cf(),bf=!1,f1=jf().version,g1="<",u1=">",r1="%",Zf="locals",v1="ejs",w1="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)",Af=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"],c1=Af.concat("cache"),$f=/^\uFEFF/,L=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;Vf.cache=z.cache;Vf.fileLoader=I.readFileSync;Vf.localsName=Zf;Vf.promiseImpl=new Function("return this;")().Promise;Vf.resolveInclude=function(f,u,g){var{dirname:r,extname:v,resolve:w}=X,c=w(g?u:r(u),f),C=v(f);if(!C)c+=".ejs";return c};function zf(f,u){var g;if(u.some(function(r){return g=Vf.resolveInclude(f,r,!0),I.existsSync(g)}))return g}function C1(f,u){var g,r,v=u.views,w=/^[A-Za-z]+:\\|^\//.exec(f);if(w&&w.length)if(f=f.replace(/^\/*/,""),Array.isArray(u.root))g=zf(f,u.root);else g=Vf.resolveInclude(f,u.root||"/",!0);else{if(u.filename){if(r=Vf.resolveInclude(f,u.filename),I.existsSync(r))g=r}if(!g&&Array.isArray(v))g=zf(f,v);if(!g&&typeof u.includer!=="function")throw new Error('Could not find the include file "'+u.escapeFunction(f)+'"')}return g}function W(f,u){var g,r=f.filename,v=arguments.length>1;if(f.cache){if(!r)throw new Error("cache option requires a filename");if(g=Vf.cache.get(r),g)return g;if(!v)u=Jf(r).toString().replace($f,"")}else if(!v){if(!r)throw new Error("Internal EJS error: no file name or template provided");u=Jf(r).toString().replace($f,"")}if(g=Vf.compile(u,f),f.cache)Vf.cache.set(r,g);return g}function j1(f,u,g){var r;if(!g)if(typeof Vf.promiseImpl=="function")return new Vf.promiseImpl(function(v,w){try{r=W(f)(u),v(r)}catch(c){w(c)}});else throw new Error("Please provide a callback function");else{try{r=W(f)(u)}catch(v){return g(v)}g(null,r)}}function Jf(f){return Vf.fileLoader(f)}function b1(f,u){var g=z.shallowCopy(z.createNullProtoObjWherePossible(),u);if(g.filename=C1(f,g),typeof u.includer==="function"){var r=u.includer(f,g.filename);if(r){if(r.filename)g.filename=r.filename;if(r.template)return W(g,r.template)}}return W(g)}function Kf(f,u,g,r,v){var w=u.split(`
`),c=Math.max(r-3,0),C=Math.min(w.length,r+3),b=v(g),$=w.slice(c,C).map(function(j,V){var Z=V+c+1;return(Z==r?" >> ":"    ")+Z+"| "+j}).join(`
`);throw f.path=b,f.message=(b||"ejs")+":"+r+`
`+$+`

`+f.message,f}function Yf(f){return f.replace(/;(\s*$)/,"$1")}Vf.compile=function f(u,g){var r;if(g&&g.scope){if(!bf)console.warn("`scope` option is deprecated and will be removed in EJS 3"),bf=!0;if(!g.context)g.context=g.scope;delete g.scope}return r=new J(u,g),r.compile()};Vf.render=function(f,u,g){var r=u||z.createNullProtoObjWherePossible(),v=g||z.createNullProtoObjWherePossible();if(arguments.length==2)z.shallowCopyFromList(v,r,Af);return W(v,f)(r)};Vf.renderFile=function(){var f=Array.prototype.slice.call(arguments),u=f.shift(),g,r={filename:u},v,w;if(typeof arguments[arguments.length-1]=="function")g=f.pop();if(f.length){if(v=f.shift(),f.length)z.shallowCopy(r,f.pop());else{if(v.settings){if(v.settings.views)r.views=v.settings.views;if(v.settings["view cache"])r.cache=!0;if(w=v.settings["view options"],w)z.shallowCopy(r,w)}z.shallowCopyFromList(r,v,c1)}r.filename=u}else v=z.createNullProtoObjWherePossible();return j1(r,v,g)};Vf.Template=J;Vf.clearCache=function(){Vf.cache.reset()};function J(f,u){var g=z.hasOwnOnlyObject(u),r=z.createNullProtoObjWherePossible();if(this.templateText=f,this.mode=null,this.truncate=!1,this.currentLine=1,this.source="",r.client=g.client||!1,r.escapeFunction=g.escape||g.escapeFunction||z.escapeXML,r.compileDebug=g.compileDebug!==!1,r.debug=!!g.debug,r.filename=g.filename,r.openDelimiter=g.openDelimiter||Vf.openDelimiter||g1,r.closeDelimiter=g.closeDelimiter||Vf.closeDelimiter||u1,r.delimiter=g.delimiter||Vf.delimiter||r1,r.strict=g.strict||!1,r.context=g.context,r.cache=g.cache||!1,r.rmWhitespace=g.rmWhitespace,r.root=g.root,r.includer=g.includer,r.outputFunctionName=g.outputFunctionName,r.localsName=g.localsName||Vf.localsName||Zf,r.views=g.views,r.async=g.async,r.destructuredLocals=g.destructuredLocals,r.legacyInclude=typeof g.legacyInclude!="undefined"?!!g.legacyInclude:!0,r.strict)r._with=!1;else r._with=typeof g._with!="undefined"?g._with:!0;this.opts=r,this.regex=this.createRegex()}J.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"};J.prototype={createRegex:function(){var f=w1,u=z.escapeRegExpChars(this.opts.delimiter),g=z.escapeRegExpChars(this.opts.openDelimiter),r=z.escapeRegExpChars(this.opts.closeDelimiter);return f=f.replace(/%/g,u).replace(/</g,g).replace(/>/g,r),new RegExp(f)},compile:function(){var f,u,g=this.opts,r="",v="",w=g.escapeFunction,c,C=g.filename?JSON.stringify(g.filename):"undefined";if(!this.source){if(this.generateSource(),r+=`  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
`,g.outputFunctionName){if(!L.test(g.outputFunctionName))throw new Error("outputFunctionName is not a valid JS identifier.");r+="  var "+g.outputFunctionName+` = __append;
`}if(g.localsName&&!L.test(g.localsName))throw new Error("localsName is not a valid JS identifier.");if(g.destructuredLocals&&g.destructuredLocals.length){var b="  var __locals = ("+g.localsName+` || {}),
`;for(var $=0;$<g.destructuredLocals.length;$++){var j=g.destructuredLocals[$];if(!L.test(j))throw new Error("destructuredLocals["+$+"] is not a valid JS identifier.");if($>0)b+=`,
  `;b+=j+" = __locals."+j}r+=b+`;
`}if(g._with!==!1)r+="  with ("+g.localsName+` || {}) {
`,v+=`  }
`;v+=`  return __output;
`,this.source=r+this.source+v}if(g.compileDebug)f=`var __line = 1
  , __lines = `+JSON.stringify(this.templateText)+`
  , __filename = `+C+`;
try {
`+this.source+`} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}
`;else f=this.source;if(g.client){if(f="escapeFn = escapeFn || "+w.toString()+`;
`+f,g.compileDebug)f="rethrow = rethrow || "+Kf.toString()+`;
`+f}if(g.strict)f=`"use strict";
`+f;if(g.debug)console.log(f);if(g.compileDebug&&g.filename)f=f+`
//# sourceURL=`+C+`
`;try{if(g.async)try{c=new Function("return (async function(){}).constructor;")()}catch(K){if(K instanceof SyntaxError)throw new Error("This environment does not support async/await");else throw K}else c=Function;u=new c(g.localsName+", escapeFn, include, rethrow",f)}catch(K){if(K instanceof SyntaxError){if(g.filename)K.message+=" in "+g.filename;if(K.message+=` while compiling ejs

`,K.message+=`If the above error is not helpful, you may want to try EJS-Lint:
`,K.message+="https://github.com/RyanZim/EJS-Lint",!g.async)K.message+=`
`,K.message+="Or, if you meant to create an async function, pass `async: true` as an option."}throw K}var V=g.client?u:function K(G){var Y=function(_,T){var D=z.shallowCopy(z.createNullProtoObjWherePossible(),G);if(T)D=z.shallowCopy(D,T);return b1(_,g)(D)};return u.apply(g.context,[G||z.createNullProtoObjWherePossible(),w,Y,Kf])};if(g.filename&&typeof Object.defineProperty==="function"){var Z=g.filename,Q=X.basename(Z,X.extname(Z));try{Object.defineProperty(V,"name",{value:Q,writable:!1,enumerable:!1,configurable:!0})}catch(K){}}return V},generateSource:function(){var f=this.opts;if(f.rmWhitespace)this.templateText=this.templateText.replace(/[\r\n]+/g,`
`).replace(/^\s+|\s+$/gm,"");this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var u=this,g=this.parseTemplateText(),r=this.opts.delimiter,v=this.opts.openDelimiter,w=this.opts.closeDelimiter;if(g&&g.length)g.forEach(function(c,C){var b;if(c.indexOf(v+r)===0&&c.indexOf(v+r+r)!==0){if(b=g[C+2],!(b==r+w||b=="-"+r+w||b=="_"+r+w))throw new Error('Could not find matching close tag for "'+c+'".')}u.scanLine(c)})},parseTemplateText:function(){var f=this.templateText,u=this.regex,g=u.exec(f),r=[],v;while(g){if(v=g.index,v!==0)r.push(f.substring(0,v)),f=f.slice(v);r.push(g[0]),f=f.slice(g[0].length),g=u.exec(f)}if(f)r.push(f);return r},_addOutput:function(f){if(this.truncate)f=f.replace(/^(?:\r\n|\r|\n)/,""),this.truncate=!1;if(!f)return f;f=f.replace(/\\/g,"\\\\"),f=f.replace(/\n/g,"\\n"),f=f.replace(/\r/g,"\\r"),f=f.replace(/"/g,"\\\""),this.source+='    ; __append("'+f+`")
`},scanLine:function(f){var u=this,g=this.opts.delimiter,r=this.opts.openDelimiter,v=this.opts.closeDelimiter,w=0;switch(w=f.split(`
`).length-1,f){case r+g:case r+g+"_":this.mode=J.modes.EVAL;break;case r+g+"=":this.mode=J.modes.ESCAPED;break;case r+g+"-":this.mode=J.modes.RAW;break;case r+g+"#":this.mode=J.modes.COMMENT;break;case r+g+g:this.mode=J.modes.LITERAL,this.source+='    ; __append("'+f.replace(r+g+g,r+g)+`")
`;break;case g+g+v:this.mode=J.modes.LITERAL,this.source+='    ; __append("'+f.replace(g+g+v,g+v)+`")
`;break;case g+v:case"-"+g+v:case"_"+g+v:if(this.mode==J.modes.LITERAL)this._addOutput(f);this.mode=null,this.truncate=f.indexOf("-")===0||f.indexOf("_")===0;break;default:if(this.mode){switch(this.mode){case J.modes.EVAL:case J.modes.ESCAPED:case J.modes.RAW:if(f.lastIndexOf("//")>f.lastIndexOf(`
`))f+=`
`}switch(this.mode){case J.modes.EVAL:this.source+="    ; "+f+`
`;break;case J.modes.ESCAPED:this.source+="    ; __append(escapeFn("+Yf(f)+`))
`;break;case J.modes.RAW:this.source+="    ; __append("+Yf(f)+`)
`;break;case J.modes.COMMENT:break;case J.modes.LITERAL:this._addOutput(f);break}}else this._addOutput(f)}if(u.opts.compileDebug&&w)this.currentLine+=w,this.source+="    ; __line = "+this.currentLine+`
`}};Vf.escapeXML=z.escapeXML;Vf.__express=Vf.renderFile;Vf.VERSION=f1;Vf.name=v1;if(typeof window!="undefined")window.ejs=Vf});function F(f){switch(f.split(".").pop()?.toLowerCase()){case"js":return"application/javascript";case"css":return"text/css";case"html":return"text/html";case"json":return"application/json";case"png":return"image/png";case"jpg":case"jpeg":return"image/jpeg";case"svg":return"image/svg+xml";case"gif":return"image/gif";case"woff":return"font/woff";case"woff2":return"font/woff2";default:return"application/octet-stream"}}var O=null;async function Q1(){if(!O){let f=await Promise.resolve().then(() => Lf(Xf(),1));O=f.default||f}return O}var G1={string:"text/plain; charset=utf-8",object:"application/json; charset=utf-8",Uint8Array:"application/octet-stream",ArrayBuffer:"application/octet-stream"};class E{req;server;path;routePattern;paramNames;env;executionContext;headers=new Headers;parsedQuery=null;parsedParams=null;parsedCookies=null;parsedBody=null;contextData={};urlObject=null;constructor(f,u,g,r,v,w,c){this.req=f,this.server=u,this.path=g,this.routePattern=r,this.executionContext=c,this.env=w,this.paramNames=v}setHeader(f,u){return this.headers.set(f,u),this}removeHeader(f){return this.headers.delete(f),this}set(f,u){return this.contextData[f]=u,this}get(f){return this.contextData[f]}get ip(){if(this.server)return this.server.requestIP(this.req)?.address??null;return this.req.headers.get("CF-Connecting-IP")||null}get url(){if(!this.urlObject)this.urlObject=new URL(this.req.url);return this.urlObject}get query(){if(!this.parsedQuery)this.parsedQuery=this.url.search?Object.fromEntries(this.url.searchParams):{};return this.parsedQuery}get params(){if(!Array.isArray(this.paramNames))return this.paramNames;if(!this.parsedParams)try{this.parsedParams=X1(this.paramNames,this.path)}catch(f){let u=f instanceof Error?f.message:String(f);throw new Error(`Failed to extract route parameters: ${u}`)}return this.parsedParams??{}}get body(){if(this.req.method==="GET")return Promise.resolve({});if(!this.parsedBody)this.parsedBody=(async()=>{try{let f=await W1(this.req);if(f.error)throw new Error(f.error);return Object.keys(f).length===0?null:f}catch(f){throw new Error("Invalid request body format")}})();return this.parsedBody}text(f,u=200){return new Response(f,{status:u,headers:this.headers})}send(f,u=200){let g;if(f instanceof Uint8Array)g="Uint8Array";else if(f instanceof ArrayBuffer)g="ArrayBuffer";else g=typeof f;if(!this.headers.has("Content-Type"))this.headers.set("Content-Type",G1[g]??"text/plain; charset=utf-8");let r=g==="object"&&f!==null?JSON.stringify(f):f;return new Response(r,{status:u,headers:this.headers})}json(f,u=200){return Response.json(f,{status:u,headers:this.headers})}file(f,u,g=200){let r=Bun.file(f);if(!this.headers.has("Content-Type"))this.headers.set("Content-Type",u??F(f));return new Response(r,{status:g,headers:this.headers})}async ejs(f,u={},g=200){let r=await Q1();try{let v=await Bun.file(f).text(),w=r.render(v,u),c=new Headers({"Content-Type":"text/html; charset=utf-8"});return new Response(w,{status:g,headers:c})}catch(v){return console.error("EJS Rendering Error:",v),new Response("Error rendering template",{status:500})}}redirect(f,u=302){return this.headers.set("Location",f),new Response(null,{status:u,headers:this.headers})}setCookie(f,u,g={}){let r=`${encodeURIComponent(f)}=${encodeURIComponent(u)}`;if(g.maxAge)r+=`; Max-Age=${g.maxAge}`;if(g.expires)r+=`; Expires=${g.expires.toUTCString()}`;if(g.path)r+=`; Path=${g.path}`;if(g.domain)r+=`; Domain=${g.domain}`;if(g.secure)r+="; Secure";if(g.httpOnly)r+="; HttpOnly";if(g.sameSite)r+=`; SameSite=${g.sameSite}`;return this.headers.append("Set-Cookie",r),this}get cookies(){if(!this.parsedCookies){let f=this.req.headers.get("cookie");this.parsedCookies=f?B1(f):{}}return this.parsedCookies}stream(f){let u=new Headers(this.headers),g=new ReadableStream({async start(r){await f(r),r.close()}});return new Response(g,{headers:u})}yieldStream(f){return new Response}}function B1(f){return Object.fromEntries(f.split(";").map((u)=>{let[g,...r]=u.trim().split("=");return[g,decodeURIComponent(r.join("="))]}))}function X1(f,u){let g={},[r]=u.split("?"),v=r.split("/").filter((c)=>c!==""),w=v.length-f.length;for(let c=0;c<f.length;c++)g[f[c]]=v[w+c];return g}function O1(f,u){let g={},r=f.split("/"),[v]=u.split("?"),w=v.split("/");if(r.length!==w.length)return null;for(let c=0;c<r.length;c++){let C=r[c];if(C.charCodeAt(0)===58)g[C.slice(1)]=w[c]}return g}async function W1(f){let u=f.headers.get("Content-Type")||"";if(!u)return{};if(f.headers.get("Content-Length")==="0"||!f.body)return{};if(u.startsWith("application/json"))return await f.json();if(u.startsWith("application/x-www-form-urlencoded")){let r=await f.text();return Object.fromEntries(new URLSearchParams(r))}if(u.startsWith("multipart/form-data")){let r=await f.formData(),v={};for(let[w,c]of r.entries())v[w]=c;return v}return{error:"Unknown request body type"}}var Wf=(f)=>f!==null&&typeof f==="object"&&typeof f.then==="function",Ff=(f)=>f!==null&&typeof f==="object"&&typeof f.status==="number"&&typeof f.headers==="object";async function Rf(f,u,g){if(!u?.length)return;for(let r=0;r<u.length;r++){let v=u[r](...g),w=v instanceof Promise?await v:v;if(w&&f!=="onRequest")return w}}async function T1(f,u,g){let r=f.globalMiddlewares;if(r.length)for(let w of r){let c=await w(g);if(c)return c}let v=f.middlewares.get(u);if(v&&v.length)for(let w of v){let c=await w(g);if(c)return c}return null}async function Uf(f,u,g){for(let r of f){let v=await r(u,g);if(v)return v}}async function qf(f,u,g){let r=await F1(f,u,g),v=Wf(r)?await r:r;if(v)return v}async function F1(f,u,g){if(u.endsWith("/"))u=u.slice(0,-1);if(!f.filters.has(u))if(f.filterFunction.length)for(let r of f.filterFunction){let v=await r(g);if(v)return v}else return Response.json({error:"Protected route, authentication required"},{status:401})}async function Df(f,u,g){if(f.staticPath){let b=!0;if(f.staticRequestPath)b=g.startsWith(f.staticRequestPath);if(b){let $=await R1(f,g,u);if($)return $}}let c=await(f.router.find(u.req.method,"*")?.handler).slice(-1)[0](u);if(Ff(c))return c;let C=f.routeNotFoundFunc(u);return C instanceof Promise?await C:C||P(404,`404 Route not found for ${g}`)}function P(f,u){return new Response(JSON.stringify({error:u}),{status:f,headers:{"Content-Type":"application/json"}})}async function R1(f,u,g){if(!f.staticPath)return null;let r=`${f.staticPath}${u}`;if(await Bun.file(r).exists()){let w=F(r);return g.file(r,w,200)}return null}var x=(f)=>f.constructor.name==="AsyncFunction",Mf=(f,u,g,...r)=>{if(u.length>5)f.push(`
      for (let i = 0; i < diesel.hooks.${g}.length; i++) {
        const result = diesel.hooks.${g}[i](${r});
        const finalResult = result instanceof Promise ? await result : result;
        if (finalResult && '${g}' !== 'onRequest') return finalResult
    }
  `);else u?.forEach((v,w)=>{if(x(v))f.push(`
            const ${g}${w}Result = await diesel.hooks.${g}[${w}](${r})
            if (${g}${w}Result && '${g}' !== 'onRequest') return ${g}${w}Result
            `);else f.push(`
            const ${g}${w}Result = diesel.hooks.${g}[${w}](${r})
             if (${g}${w}Result && '${g}' !== 'onRequest') return ${g}${w}Result
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
  `)};var h1=(f)=>{let u=[],g=f.globalMiddlewares||[],r=f?.hasPreHandlerHook?f.hooks.preHandler:[],v=f?.hasOnSendHook?f.hooks.onSend:[];if(U1(u),u.push(`
      const routeHandler = diesel.router.find(req.method, pathname);
    `),u.push(`
          const ctx = new Context(
          req, 
          server, 
          pathname, 
          routeHandler?.path,
          routeHandler?.params,
          env,
          executionContext
          )
    `),f.hasFilterEnabled)u.push(`
        const filterResponse = await runFilter(diesel, pathname, ctx);
        if (filterResponse) return filterResponse;
      `);if(f.hasPreHandlerHook)Mf(u,r,"preHandler","ctx");if(u.push(`
        let finalResult
      let arr = routeHandler?.handler;
      for (let i = 0; i < arr?.length; i++) {
        const result = arr[i]?.(ctx)
        finalResult = result instanceof Promise ? await result : result;
        if (finalResult instanceof Response) break
      }
    `),f.hasOnSendHook)Mf(u,v,"onSend","ctx","finalResult");u.push(`
      if (finalResult instanceof Response) return finalResult;
    `),u.push(`
    return await handleRouteNotFound(diesel, ctx, pathname);
  `);let w=`
      return async function pipeline(req, diesel, server, env, executionContext) {
          ${u.join(`
`)}
      }
    `;return new Function("runFilter","handleRouteNotFound","generateErrorResponse","Context",w)(qf,Df,P,E)},d1=(f,u,g,...r)=>{let v=[],w;if(typeof r[0]==="string"||typeof r[0]==="object")w=r[0];let c=r,C=f?.hasMiddleware?f.globalMiddlewares:[],b=f?.hasMiddleware?f.middlewares.get(g)||[]:[],$=[...C,...b],j=f?.hasOnReqHook?f.hooks.onRequest:[],V=f.filters.has(g),Z=f.filterFunction;if(j&&j?.length>0)v.push(`
      const onRequestResult = await runHooks(
        "onRequest",
        onRequestHooks,
        [req, "${g}", server]
      );
      if (onRequestResult) return onRequestResult;
    `);if($.length)v.push(`
      const globalMiddlewareResponse = await executeBunMiddlewares(
        allMiddlewares,
        req,
        server
      );
      if (globalMiddlewareResponse) return globalMiddlewareResponse;
    `);if(f.hasFilterEnabled){if(!V)v.push(`if (${Z.length}) {
        for (const filterFunction of filterFunctions) {
          const filterResult = await filterFunction(req, server);
          if (filterResult) return filterResult;
        }
      } else {
        return Response.json({ error: "Protected route, authentication required" }, { status: 401 });
      }`)}if(v.push(`
            if ("${u}" !== req.method)
        return new Response("Method Not Allowed", { status: 405 });
      `),typeof w!=="undefined")if(typeof w==="string")v.push(`
        return new Response(${JSON.stringify(w)});
      `);else{let G=JSON.stringify(w);v.push(`
        return new Response(${JSON.stringify(G)}, {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      `)}else if(c.length===1){let G=c[0];if(x(G))v.push(`
        const response = await handlers[0](req, server);
        if (response instanceof Response) return response;
      `);else v.push(`
        const response = handlers[0](req, server);
        if (response instanceof Response) return response;
      `)}else c.forEach((G,Y)=>{if(x(G))v.push(`
            const response${Y} = await handlers[${Y}](req, server);
            if (response${Y} instanceof Response) return response${Y};
        `);else v.push(`
            const response${Y} = handlers[${Y}](req, server);
            if (response${Y} instanceof Response) return response${Y};
        `)});let Q=`
    return async function(req, server) {
      ${v.join(`
`)}
    }
  `;return new Function("executeBunMiddlewares","handlers","runHooks","filterFunctions","onRequestHooks","allMiddlewares",Q)(Uf,c,Rf,Z,j,$)};export{h1 as buildRequestPipeline,d1 as BunRequestPipline};
