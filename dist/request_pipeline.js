var E1=Object.create;var{getPrototypeOf:O1,defineProperty:b,getOwnPropertyNames:h,getOwnPropertyDescriptor:S1}=Object,n=Object.prototype.hasOwnProperty;var P1=(f,v,g)=>{g=f!=null?E1(O1(f)):{};let C=v||!f||!f.__esModule?b(g,"default",{value:f,enumerable:!0}):g;for(let w of h(f))if(!n.call(C,w))b(C,w,{get:()=>f[w],enumerable:!0});return C},m=new WeakMap,x1=(f)=>{var v=m.get(f),g;if(v)return v;if(v=b({},"__esModule",{value:!0}),f&&typeof f==="object"||typeof f==="function")h(f).map((C)=>!n.call(v,C)&&b(v,C,{get:()=>f[C],enumerable:!(g=S1(f,C))||g.enumerable}));return m.set(f,v),v},E=(f,v)=>()=>(v||f((v={exports:{}}).exports,v),v.exports);var c1=(f,v)=>{for(var g in v)b(f,g,{get:v[g],enumerable:!0,configurable:!0,set:(C)=>v[g]=()=>C})};var _1=(f,v)=>()=>(f&&(v=f(f=0)),v);var y1=((f)=>typeof require!=="undefined"?require:typeof Proxy!=="undefined"?new Proxy(f,{get:(v,g)=>(typeof require!=="undefined"?require:v)[g]}):f)(function(f){if(typeof require!=="undefined")return require.apply(this,arguments);throw Error('Dynamic require of "'+f+'" is not supported')});var w1={};c1(w1,{sep:()=>g1,resolve:()=>D,relative:()=>a,posix:()=>C1,parse:()=>f1,normalize:()=>O,join:()=>i,isAbsolute:()=>l,format:()=>p,extname:()=>o,dirname:()=>s,delimiter:()=>v1,default:()=>T1,basename:()=>e,_makeLong:()=>t});function U(f){if(typeof f!=="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(f))}function d(f,v){var g="",C=0,w=-1,$=0,z;for(var K=0;K<=f.length;++K){if(K<f.length)z=f.charCodeAt(K);else if(z===47)break;else z=47;if(z===47){if(w===K-1||$===1);else if(w!==K-1&&$===2){if(g.length<2||C!==2||g.charCodeAt(g.length-1)!==46||g.charCodeAt(g.length-2)!==46){if(g.length>2){var A=g.lastIndexOf("/");if(A!==g.length-1){if(A===-1)g="",C=0;else g=g.slice(0,A),C=g.length-1-g.lastIndexOf("/");w=K,$=0;continue}}else if(g.length===2||g.length===1){g="",C=0,w=K,$=0;continue}}if(v){if(g.length>0)g+="/..";else g="..";C=2}}else{if(g.length>0)g+="/"+f.slice(w+1,K);else g=f.slice(w+1,K);C=K-w-1}w=K,$=0}else if(z===46&&$!==-1)++$;else $=-1}return g}function r1(f,v){var g=v.dir||v.root,C=v.base||(v.name||"")+(v.ext||"");if(!g)return C;if(g===v.root)return g+C;return g+f+C}function D(){var f="",v=!1,g;for(var C=arguments.length-1;C>=-1&&!v;C--){var w;if(C>=0)w=arguments[C];else{if(g===void 0)g=process.cwd();w=g}if(U(w),w.length===0)continue;f=w+"/"+f,v=w.charCodeAt(0)===47}if(f=d(f,!v),v)if(f.length>0)return"/"+f;else return"/";else if(f.length>0)return f;else return"."}function O(f){if(U(f),f.length===0)return".";var v=f.charCodeAt(0)===47,g=f.charCodeAt(f.length-1)===47;if(f=d(f,!v),f.length===0&&!v)f=".";if(f.length>0&&g)f+="/";if(v)return"/"+f;return f}function l(f){return U(f),f.length>0&&f.charCodeAt(0)===47}function i(){if(arguments.length===0)return".";var f;for(var v=0;v<arguments.length;++v){var g=arguments[v];if(U(g),g.length>0)if(f===void 0)f=g;else f+="/"+g}if(f===void 0)return".";return O(f)}function a(f,v){if(U(f),U(v),f===v)return"";if(f=D(f),v=D(v),f===v)return"";var g=1;for(;g<f.length;++g)if(f.charCodeAt(g)!==47)break;var C=f.length,w=C-g,$=1;for(;$<v.length;++$)if(v.charCodeAt($)!==47)break;var z=v.length,K=z-$,A=w<K?w:K,G=-1,J=0;for(;J<=A;++J){if(J===A){if(K>A){if(v.charCodeAt($+J)===47)return v.slice($+J+1);else if(J===0)return v.slice($+J)}else if(w>A){if(f.charCodeAt(g+J)===47)G=J;else if(J===0)G=0}break}var Y=f.charCodeAt(g+J),Z=v.charCodeAt($+J);if(Y!==Z)break;else if(Y===47)G=J}var V="";for(J=g+G+1;J<=C;++J)if(J===C||f.charCodeAt(J)===47)if(V.length===0)V+="..";else V+="/..";if(V.length>0)return V+v.slice($+G);else{if($+=G,v.charCodeAt($)===47)++$;return v.slice($)}}function t(f){return f}function s(f){if(U(f),f.length===0)return".";var v=f.charCodeAt(0),g=v===47,C=-1,w=!0;for(var $=f.length-1;$>=1;--$)if(v=f.charCodeAt($),v===47){if(!w){C=$;break}}else w=!1;if(C===-1)return g?"/":".";if(g&&C===1)return"//";return f.slice(0,C)}function e(f,v){if(v!==void 0&&typeof v!=="string")throw new TypeError('"ext" argument must be a string');U(f);var g=0,C=-1,w=!0,$;if(v!==void 0&&v.length>0&&v.length<=f.length){if(v.length===f.length&&v===f)return"";var z=v.length-1,K=-1;for($=f.length-1;$>=0;--$){var A=f.charCodeAt($);if(A===47){if(!w){g=$+1;break}}else{if(K===-1)w=!1,K=$+1;if(z>=0)if(A===v.charCodeAt(z)){if(--z===-1)C=$}else z=-1,C=K}}if(g===C)C=K;else if(C===-1)C=f.length;return f.slice(g,C)}else{for($=f.length-1;$>=0;--$)if(f.charCodeAt($)===47){if(!w){g=$+1;break}}else if(C===-1)w=!1,C=$+1;if(C===-1)return"";return f.slice(g,C)}}function o(f){U(f);var v=-1,g=0,C=-1,w=!0,$=0;for(var z=f.length-1;z>=0;--z){var K=f.charCodeAt(z);if(K===47){if(!w){g=z+1;break}continue}if(C===-1)w=!1,C=z+1;if(K===46){if(v===-1)v=z;else if($!==1)$=1}else if(v!==-1)$=-1}if(v===-1||C===-1||$===0||$===1&&v===C-1&&v===g+1)return"";return f.slice(v,C)}function p(f){if(f===null||typeof f!=="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof f);return r1("/",f)}function f1(f){U(f);var v={root:"",dir:"",base:"",ext:"",name:""};if(f.length===0)return v;var g=f.charCodeAt(0),C=g===47,w;if(C)v.root="/",w=1;else w=0;var $=-1,z=0,K=-1,A=!0,G=f.length-1,J=0;for(;G>=w;--G){if(g=f.charCodeAt(G),g===47){if(!A){z=G+1;break}continue}if(K===-1)A=!1,K=G+1;if(g===46){if($===-1)$=G;else if(J!==1)J=1}else if($!==-1)J=-1}if($===-1||K===-1||J===0||J===1&&$===K-1&&$===z+1){if(K!==-1)if(z===0&&C)v.base=v.name=f.slice(1,K);else v.base=v.name=f.slice(z,K)}else{if(z===0&&C)v.name=f.slice(1,$),v.base=f.slice(1,K);else v.name=f.slice(z,$),v.base=f.slice(z,K);v.ext=f.slice($,K)}if(z>0)v.dir=f.slice(0,z-1);else if(C)v.dir="/";return v}var g1="/",v1=":",C1,T1;var $1=_1(()=>{C1=((f)=>(f.posix=f,f))({resolve:D,normalize:O,isAbsolute:l,join:i,relative:a,_makeLong:t,dirname:s,basename:e,extname:o,format:p,parse:f1,sep:g1,delimiter:v1,win32:null,posix:null}),T1=C1});var K1=E((i1)=>{var k1=/[|\\{}()[\]^$+*?.]/g,m1=Object.prototype.hasOwnProperty,P=function(f,v){return m1.apply(f,[v])};i1.escapeRegExpChars=function(f){if(!f)return"";return String(f).replace(k1,"\\$&")};var h1={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"},n1=/[&<>'"]/g;function d1(f){return h1[f]||f}var l1=`var _ENCODE_HTML_RULES = {
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
`;i1.escapeXML=function(f){return f==null?"":String(f).replace(n1,d1)};function z1(){return Function.prototype.toString.call(this)+`;
`+l1}try{if(typeof Object.defineProperty==="function")Object.defineProperty(i1.escapeXML,"toString",{value:z1});else i1.escapeXML.toString=z1}catch(f){console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)")}i1.shallowCopy=function(f,v){if(v=v||{},f!==null&&f!==void 0)for(var g in v){if(!P(v,g))continue;if(g==="__proto__"||g==="constructor")continue;f[g]=v[g]}return f};i1.shallowCopyFromList=function(f,v,g){if(g=g||[],v=v||{},f!==null&&f!==void 0)for(var C=0;C<g.length;C++){var w=g[C];if(typeof v[w]!="undefined"){if(!P(v,w))continue;if(w==="__proto__"||w==="constructor")continue;f[w]=v[w]}}return f};i1.cache={_data:{},set:function(f,v){this._data[f]=v},get:function(f){return this._data[f]},remove:function(f){delete this._data[f]},reset:function(){this._data={}}};i1.hyphenToCamel=function(f){return f.replace(/-[a-z]/g,function(v){return v[1].toUpperCase()})};i1.createNullProtoObjWherePossible=function(){if(typeof Object.create=="function")return function(){return Object.create(null)};if(!({__proto__:null}instanceof Object))return function(){return{__proto__:null}};return function(){return{}}}();i1.hasOwnOnlyObject=function(f){var v=i1.createNullProtoObjWherePossible();for(var g in f)if(P(f,g))v[g]=f[g];return v}});var Y1=E((Lf,ff)=>{ff.exports={name:"ejs",description:"Embedded JavaScript templates",keywords:["template","engine","ejs"],version:"3.1.10",author:"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",license:"Apache-2.0",bin:{ejs:"./bin/cli.js"},main:"./lib/ejs.js",jsdelivr:"ejs.min.js",unpkg:"ejs.min.js",repository:{type:"git",url:"git://github.com/mde/ejs.git"},bugs:"https://github.com/mde/ejs/issues",homepage:"https://github.com/mde/ejs",dependencies:{jake:"^10.8.5"},devDependencies:{browserify:"^16.5.1",eslint:"^6.8.0","git-directory-deploy":"^1.5.1",jsdoc:"^4.0.2","lru-cache":"^4.0.1",mocha:"^10.2.0","uglify-js":"^3.3.16"},engines:{node:">=0.10.0"},scripts:{test:"npx jake test"}}});var u1=E((U1)=>{var _=(()=>({})),N=($1(),x1(w1)),j=K1(),Z1=!1,gf=Y1().version,vf="<",Cf=">",wf="%",W1="locals",$f="ejs",zf="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)",X1=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"],Jf=X1.concat("cache"),A1=/^\uFEFF/,x=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;U1.cache=j.cache;U1.fileLoader=_.readFileSync;U1.localsName=W1;U1.promiseImpl=new Function("return this;")().Promise;U1.resolveInclude=function(f,v,g){var{dirname:C,extname:w,resolve:$}=N,z=$(g?v:C(v),f),K=w(f);if(!K)z+=".ejs";return z};function V1(f,v){var g;if(v.some(function(C){return g=U1.resolveInclude(f,C,!0),_.existsSync(g)}))return g}function Kf(f,v){var g,C,w=v.views,$=/^[A-Za-z]+:\\|^\//.exec(f);if($&&$.length)if(f=f.replace(/^\/*/,""),Array.isArray(v.root))g=V1(f,v.root);else g=U1.resolveInclude(f,v.root||"/",!0);else{if(v.filename){if(C=U1.resolveInclude(f,v.filename),_.existsSync(C))g=C}if(!g&&Array.isArray(w))g=V1(f,w);if(!g&&typeof v.includer!=="function")throw new Error('Could not find the include file "'+v.escapeFunction(f)+'"')}return g}function R(f,v){var g,C=f.filename,w=arguments.length>1;if(f.cache){if(!C)throw new Error("cache option requires a filename");if(g=U1.cache.get(C),g)return g;if(!w)v=G1(C).toString().replace(A1,"")}else if(!w){if(!C)throw new Error("Internal EJS error: no file name or template provided");v=G1(C).toString().replace(A1,"")}if(g=U1.compile(v,f),f.cache)U1.cache.set(C,g);return g}function Yf(f,v,g){var C;if(!g)if(typeof U1.promiseImpl=="function")return new U1.promiseImpl(function(w,$){try{C=R(f)(v),w(C)}catch(z){$(z)}});else throw new Error("Please provide a callback function");else{try{C=R(f)(v)}catch(w){return g(w)}g(null,C)}}function G1(f){return U1.fileLoader(f)}function Zf(f,v){var g=j.shallowCopy(j.createNullProtoObjWherePossible(),v);if(g.filename=Kf(f,g),typeof v.includer==="function"){var C=v.includer(f,g.filename);if(C){if(C.filename)g.filename=C.filename;if(C.template)return R(g,C.template)}}return R(g)}function j1(f,v,g,C,w){var $=v.split(`
`),z=Math.max(C-3,0),K=Math.min($.length,C+3),A=w(g),G=$.slice(z,K).map(function(J,Y){var Z=Y+z+1;return(Z==C?" >> ":"    ")+Z+"| "+J}).join(`
`);throw f.path=A,f.message=(A||"ejs")+":"+C+`
`+G+`

`+f.message,f}function Q1(f){return f.replace(/;(\s*$)/,"$1")}U1.compile=function f(v,g){var C;if(g&&g.scope){if(!Z1)console.warn("`scope` option is deprecated and will be removed in EJS 3"),Z1=!0;if(!g.context)g.context=g.scope;delete g.scope}return C=new W(v,g),C.compile()};U1.render=function(f,v,g){var C=v||j.createNullProtoObjWherePossible(),w=g||j.createNullProtoObjWherePossible();if(arguments.length==2)j.shallowCopyFromList(w,C,X1);return R(w,f)(C)};U1.renderFile=function(){var f=Array.prototype.slice.call(arguments),v=f.shift(),g,C={filename:v},w,$;if(typeof arguments[arguments.length-1]=="function")g=f.pop();if(f.length){if(w=f.shift(),f.length)j.shallowCopy(C,f.pop());else{if(w.settings){if(w.settings.views)C.views=w.settings.views;if(w.settings["view cache"])C.cache=!0;if($=w.settings["view options"],$)j.shallowCopy(C,$)}j.shallowCopyFromList(C,w,Jf)}C.filename=v}else w=j.createNullProtoObjWherePossible();return Yf(C,w,g)};U1.Template=W;U1.clearCache=function(){U1.cache.reset()};function W(f,v){var g=j.hasOwnOnlyObject(v),C=j.createNullProtoObjWherePossible();if(this.templateText=f,this.mode=null,this.truncate=!1,this.currentLine=1,this.source="",C.client=g.client||!1,C.escapeFunction=g.escape||g.escapeFunction||j.escapeXML,C.compileDebug=g.compileDebug!==!1,C.debug=!!g.debug,C.filename=g.filename,C.openDelimiter=g.openDelimiter||U1.openDelimiter||vf,C.closeDelimiter=g.closeDelimiter||U1.closeDelimiter||Cf,C.delimiter=g.delimiter||U1.delimiter||wf,C.strict=g.strict||!1,C.context=g.context,C.cache=g.cache||!1,C.rmWhitespace=g.rmWhitespace,C.root=g.root,C.includer=g.includer,C.outputFunctionName=g.outputFunctionName,C.localsName=g.localsName||U1.localsName||W1,C.views=g.views,C.async=g.async,C.destructuredLocals=g.destructuredLocals,C.legacyInclude=typeof g.legacyInclude!="undefined"?!!g.legacyInclude:!0,C.strict)C._with=!1;else C._with=typeof g._with!="undefined"?g._with:!0;this.opts=C,this.regex=this.createRegex()}W.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"};W.prototype={createRegex:function(){var f=zf,v=j.escapeRegExpChars(this.opts.delimiter),g=j.escapeRegExpChars(this.opts.openDelimiter),C=j.escapeRegExpChars(this.opts.closeDelimiter);return f=f.replace(/%/g,v).replace(/</g,g).replace(/>/g,C),new RegExp(f)},compile:function(){var f,v,g=this.opts,C="",w="",$=g.escapeFunction,z,K=g.filename?JSON.stringify(g.filename):"undefined";if(!this.source){if(this.generateSource(),C+=`  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
`,g.outputFunctionName){if(!x.test(g.outputFunctionName))throw new Error("outputFunctionName is not a valid JS identifier.");C+="  var "+g.outputFunctionName+` = __append;
`}if(g.localsName&&!x.test(g.localsName))throw new Error("localsName is not a valid JS identifier.");if(g.destructuredLocals&&g.destructuredLocals.length){var A="  var __locals = ("+g.localsName+` || {}),
`;for(var G=0;G<g.destructuredLocals.length;G++){var J=g.destructuredLocals[G];if(!x.test(J))throw new Error("destructuredLocals["+G+"] is not a valid JS identifier.");if(G>0)A+=`,
  `;A+=J+" = __locals."+J}C+=A+`;
`}if(g._with!==!1)C+="  with ("+g.localsName+` || {}) {
`,w+=`  }
`;w+=`  return __output;
`,this.source=C+this.source+w}if(g.compileDebug)f=`var __line = 1
  , __lines = `+JSON.stringify(this.templateText)+`
  , __filename = `+K+`;
try {
`+this.source+`} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}
`;else f=this.source;if(g.client){if(f="escapeFn = escapeFn || "+$.toString()+`;
`+f,g.compileDebug)f="rethrow = rethrow || "+j1.toString()+`;
`+f}if(g.strict)f=`"use strict";
`+f;if(g.debug)console.log(f);if(g.compileDebug&&g.filename)f=f+`
//# sourceURL=`+K+`
`;try{if(g.async)try{z=new Function("return (async function(){}).constructor;")()}catch(Q){if(Q instanceof SyntaxError)throw new Error("This environment does not support async/await");else throw Q}else z=Function;v=new z(g.localsName+", escapeFn, include, rethrow",f)}catch(Q){if(Q instanceof SyntaxError){if(g.filename)Q.message+=" in "+g.filename;if(Q.message+=` while compiling ejs

`,Q.message+=`If the above error is not helpful, you may want to try EJS-Lint:
`,Q.message+="https://github.com/RyanZim/EJS-Lint",!g.async)Q.message+=`
`,Q.message+="Or, if you meant to create an async function, pass `async: true` as an option."}throw Q}var Y=g.client?v:function Q(F){var B=function(X,H){var I=j.shallowCopy(j.createNullProtoObjWherePossible(),F);if(H)I=j.shallowCopy(I,H);return Zf(X,g)(I)};return v.apply(g.context,[F||j.createNullProtoObjWherePossible(),$,B,j1])};if(g.filename&&typeof Object.defineProperty==="function"){var Z=g.filename,V=N.basename(Z,N.extname(Z));try{Object.defineProperty(Y,"name",{value:V,writable:!1,enumerable:!1,configurable:!0})}catch(Q){}}return Y},generateSource:function(){var f=this.opts;if(f.rmWhitespace)this.templateText=this.templateText.replace(/[\r\n]+/g,`
`).replace(/^\s+|\s+$/gm,"");this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var v=this,g=this.parseTemplateText(),C=this.opts.delimiter,w=this.opts.openDelimiter,$=this.opts.closeDelimiter;if(g&&g.length)g.forEach(function(z,K){var A;if(z.indexOf(w+C)===0&&z.indexOf(w+C+C)!==0){if(A=g[K+2],!(A==C+$||A=="-"+C+$||A=="_"+C+$))throw new Error('Could not find matching close tag for "'+z+'".')}v.scanLine(z)})},parseTemplateText:function(){var f=this.templateText,v=this.regex,g=v.exec(f),C=[],w;while(g){if(w=g.index,w!==0)C.push(f.substring(0,w)),f=f.slice(w);C.push(g[0]),f=f.slice(g[0].length),g=v.exec(f)}if(f)C.push(f);return C},_addOutput:function(f){if(this.truncate)f=f.replace(/^(?:\r\n|\r|\n)/,""),this.truncate=!1;if(!f)return f;f=f.replace(/\\/g,"\\\\"),f=f.replace(/\n/g,"\\n"),f=f.replace(/\r/g,"\\r"),f=f.replace(/"/g,"\\\""),this.source+='    ; __append("'+f+`")
`},scanLine:function(f){var v=this,g=this.opts.delimiter,C=this.opts.openDelimiter,w=this.opts.closeDelimiter,$=0;switch($=f.split(`
`).length-1,f){case C+g:case C+g+"_":this.mode=W.modes.EVAL;break;case C+g+"=":this.mode=W.modes.ESCAPED;break;case C+g+"-":this.mode=W.modes.RAW;break;case C+g+"#":this.mode=W.modes.COMMENT;break;case C+g+g:this.mode=W.modes.LITERAL,this.source+='    ; __append("'+f.replace(C+g+g,C+g)+`")
`;break;case g+g+w:this.mode=W.modes.LITERAL,this.source+='    ; __append("'+f.replace(g+g+w,g+w)+`")
`;break;case g+w:case"-"+g+w:case"_"+g+w:if(this.mode==W.modes.LITERAL)this._addOutput(f);this.mode=null,this.truncate=f.indexOf("-")===0||f.indexOf("_")===0;break;default:if(this.mode){switch(this.mode){case W.modes.EVAL:case W.modes.ESCAPED:case W.modes.RAW:if(f.lastIndexOf("//")>f.lastIndexOf(`
`))f+=`
`}switch(this.mode){case W.modes.EVAL:this.source+="    ; "+f+`
`;break;case W.modes.ESCAPED:this.source+="    ; __append(escapeFn("+Q1(f)+`))
`;break;case W.modes.RAW:this.source+="    ; __append("+Q1(f)+`)
`;break;case W.modes.COMMENT:break;case W.modes.LITERAL:this._addOutput(f);break}}else this._addOutput(f)}if(v.opts.compileDebug&&$)this.currentLine+=$,this.source+="    ; __line = "+this.currentLine+`
`}};U1.escapeXML=j.escapeXML;U1.__express=U1.renderFile;U1.VERSION=gf;U1.name=$f;if(typeof window!="undefined")window.ejs=U1});function u(f){switch(f.split(".").pop()?.toLowerCase()){case"js":return"application/javascript";case"css":return"text/css";case"html":return"text/html";case"json":return"application/json";case"png":return"image/png";case"jpg":case"jpeg":return"image/jpeg";case"svg":return"image/svg+xml";case"gif":return"image/gif";case"woff":return"font/woff";case"woff2":return"font/woff2";default:return"application/octet-stream"}}var y=null;async function N1(){if(!y){let f=await Promise.resolve().then(() => P1(u1(),1));y=f.default||f}return y}class r{req;server;pathname;routePattern;headers=new Headers;parsedQuery=null;parsedParams=null;parsedCookies=null;parsedBody=null;contextData={};urlObject=null;constructor(f,v,g,C=""){this.req=f,this.server=v,this.pathname=g,this.routePattern=C}setHeader(f,v){return this.headers.set(f,v),this}removeHeader(f){return this.headers.delete(f),this}set(f,v){return this.contextData[f]=v,this}get(f){return this.contextData[f]}get ip(){return this.server.requestIP(this.req)?.address??null}get url(){if(!this.urlObject)this.urlObject=new URL(this.req.url);return this.urlObject}get query(){if(!this.parsedQuery)this.parsedQuery=this.url.search?Object.fromEntries(this.url.searchParams):{};return this.parsedQuery}get params(){if(!this.parsedParams&&this.routePattern)try{this.parsedParams=D1(this.routePattern,this.pathname)}catch(f){let v=f instanceof Error?f.message:String(f);throw new Error(`Failed to extract route parameters: ${v}`)}return this.parsedParams??{}}get body(){if(this.req.method==="GET")return Promise.resolve({});if(!this.parsedBody)this.parsedBody=(async()=>{try{let f=await q1(this.req);if(f.error)throw new Error(f.error);return Object.keys(f).length===0?null:f}catch(f){throw new Error("Invalid request body format")}})();return this.parsedBody}text(f,v=200){return new Response(f,{status:v,headers:this.headers})}send(f,v=200){let g;if(f instanceof Uint8Array)g="Uint8Array";else if(f instanceof ArrayBuffer)g="ArrayBuffer";else g=typeof f;let C=g==="object"&&f!==null?JSON.stringify(f):f;return new Response(C,{status:v,headers:this.headers})}json(f,v=200){return Response.json(f,{status:v,headers:this.headers})}file(f,v,g=200){let C=Bun.file(f);if(!this.headers.has("Content-Type"))this.headers.set("Content-Type",v??u(f));return new Response(C,{status:g,headers:this.headers})}async ejs(f,v={},g=200){let C=await N1();try{let w=await Bun.file(f).text(),$=C.render(w,v),z=new Headers({"Content-Type":"text/html; charset=utf-8"});return new Response($,{status:g,headers:z})}catch(w){return console.error("EJS Rendering Error:",w),new Response("Error rendering template",{status:500})}}redirect(f,v=302){return this.headers.set("Location",f),new Response(null,{status:v,headers:this.headers})}setCookie(f,v,g={}){let C=`${encodeURIComponent(f)}=${encodeURIComponent(v)}`;if(g.maxAge)C+=`; Max-Age=${g.maxAge}`;if(g.expires)C+=`; Expires=${g.expires.toUTCString()}`;if(g.path)C+=`; Path=${g.path}`;if(g.domain)C+=`; Domain=${g.domain}`;if(g.secure)C+="; Secure";if(g.httpOnly)C+="; HttpOnly";if(g.sameSite)C+=`; SameSite=${g.sameSite}`;return this.headers.append("Set-Cookie",C),this}get cookies(){if(!this.parsedCookies){let f=this.req.headers.get("cookie");this.parsedCookies=f?R1(f):{}}return this.parsedCookies}stream(f){let v=new Headers(this.headers),g=new ReadableStream({async start(C){await f(C),C.close()}});return new Response(g,{headers:v})}yieldStream(f){return new Response}}function Bf(f,v,g,C){let w=null,$=null,z=null,K=null,A={},G=null;return{req:f,server:v,pathname:g,headers:new Headers,setHeader(J,Y){return this.headers.set(J,Y),this},removeHeader(J){return this.headers.delete(J),this},set(J,Y){return A[J]=Y,this},get(J){return A[J]},get ip(){return this.server.requestIP(f)?.address??null},get url(){if(!G)G=new URL(f.url);return G},get query(){if(!w){if(!this.url.search)return{};w=Object.fromEntries(this.url.searchParams)}return w},get params(){if(!$&&C)try{$=D1(C,g)}catch(J){let Y=J instanceof Error?J.message:String(J);throw new Error(`Failed to extract route parameters: ${Y}`)}return $??{}},get body(){if(f.method==="GET")return Promise.resolve({});if(!K)K=(async()=>{try{let J=await q1(f);if(J.error)throw new Error(J.error);return Object.keys(J).length===0?null:J}catch(J){throw new Error("Invalid request body format")}})();return K},text(J,Y=200){return new Response(J,{status:Y,headers:this.headers})},send(J,Y=200){let Z;if(J instanceof Uint8Array)Z="Uint8Array";else if(J instanceof ArrayBuffer)Z="ArrayBuffer";else Z=typeof J;let V=Z==="object"&&J!==null?JSON.stringify(J):J;return new Response(V,{status:Y,headers:this.headers})},json(J,Y=200){return Response.json(J,{status:Y,headers:this.headers})},file(J,Y,Z=200){let V=Bun.file(J);if(!this.headers.has("Content-Type"))this.headers.set("Content-Type",Y??u(J));return new Response(V,{status:Z,headers:this.headers})},async ejs(J,Y={},Z=200){let V=await N1();try{let Q=await Bun.file(J).text(),F=V.render(Q,Y),B=new Headers({"Content-Type":"text/html; charset=utf-8"});return new Response(F,{status:Z,headers:B})}catch(Q){return console.error("EJS Rendering Error:",Q),new Response("Error rendering template",{status:500})}},redirect(J,Y=302){return this.headers.set("Location",J),new Response(null,{status:Y,headers:this.headers})},stream(J){let Y=new Headers(this.headers),Z=new ReadableStream({async start(V){await J(V),V.close()}});return new Response(Z,{headers:Y})},yieldStream(J){return new Response("not working stream yet.")},setCookie(J,Y,Z={}){let V=`${encodeURIComponent(J)}=${encodeURIComponent(Y)}`;if(Z.maxAge)V+=`; Max-Age=${Z.maxAge}`;if(Z.expires)V+=`; Expires=${Z.expires.toUTCString()}`;if(Z.path)V+=`; Path=${Z.path}`;if(Z.domain)V+=`; Domain=${Z.domain}`;if(Z.secure)V+="; Secure";if(Z.httpOnly)V+="; HttpOnly";if(Z.sameSite)V+=`; SameSite=${Z.sameSite}`;return this.headers.append("Set-Cookie",V),this},get cookies(){if(!z){let J=this.req.headers.get("cookie");z=J?R1(J):{}}return z}}}function R1(f){return Object.fromEntries(f.split(";").map((v)=>{let[g,...C]=v.trim().split("=");return[g,decodeURIComponent(C.join("="))]}))}function D1(f,v){let g={},C=f.split("/"),[w]=v.split("?"),$=w.split("/");if(C.length!==$.length)return null;for(let z=0;z<C.length;z++){let K=C[z];if(K.charCodeAt(0)===58)g[K.slice(1)]=$[z]}return g}async function q1(f){let v=f.headers.get("Content-Type")||"";if(!v)return{};if(f.headers.get("Content-Length")==="0"||!f.body)return{};if(v.startsWith("application/json"))return await f.json();if(v.startsWith("application/x-www-form-urlencoded")){let C=await f.text();return Object.fromEntries(new URLSearchParams(C))}if(v.startsWith("multipart/form-data")){let C=await f.formData(),w={};for(let[$,z]of C.entries())w[$]=z;return w}return{error:"Unknown request body type"}}async function L1(f,v,g){if(!v?.length)return;for(let C=0;C<v.length;C++){let w=v[C](...g),$=w instanceof Promise?await w:w;if($&&f!=="onRequest")return $}}async function xf(f,v,g){let C=f.globalMiddlewares;if(C.length)for(let $ of C){let z=await $(g);if(z)return z}let w=f.middlewares.get(v);if(w&&w.length)for(let $ of w){let z=await $(g);if(z)return z}return null}async function M1(f,v,g){for(let C of f){let w=await C(v,g);if(w)return w}}async function H1(f,v,g){let C=await Ff(f,v,g),w=C instanceof Promise?await C:C;if(w)return w}async function Ff(f,v,g){if(v.endsWith("/"))v=v.slice(0,-1);if(!f.filters.has(v))if(f.filterFunction.length)for(let C of f.filterFunction){let w=await C(g);if(w)return w}else return Response.json({error:"Protected route, authentication required"},{status:401})}async function I1(f,v,g){if(f.staticPath){let w=!0;if(f.staticRequestPath)w=g.startsWith(f.staticRequestPath);if(w){let $=await bf(f,g,v);if($)return $;let z=f.trie.search("*",v.req.method);if(z?.handler)return await z.handler(v)}}let C=f.routeNotFoundFunc(v);return C instanceof Promise?await C:C||T(404,`404 Route not found for ${g}`)}function T(f,v){return new Response(JSON.stringify({error:v}),{status:f,headers:{"Content-Type":"application/json"}})}async function bf(f,v,g){if(!f.staticPath)return null;let C=`${f.staticPath}${v}`;if(await Bun.file(C).exists()){let $=u(C);return g.file(C,$,200)}return null}var M=(f)=>f.constructor.name==="AsyncFunction",k=(f,v,g,...C)=>{if(v.length>5)f.push(`
      for (let i = 0; i < diesel.hooks.${g}.length; i++) {
        const result = diesel.hooks.${g}[i](${C});
        const finalResult = result instanceof Promise ? await result : result;
        if (finalResult && '${g}' !== 'onRequest') return finalResult
    }
  `);else v?.forEach((w,$)=>{if(M(w))f.push(`
            const ${g}${$}Result = await diesel.hooks.${g}[${$}](${C})
            if (${g}${$}Result && '${g}' !== 'onRequest') return ${g}${$}Result
            `);else f.push(`
            const ${g}${$}Result = diesel.hooks.${g}[${$}](${C})
             if (${g}${$}Result && '${g}' !== 'onRequest') return ${g}${$}Result
            `)})},uf=(f)=>{f.push(`
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
  `)},Nf=(f,v)=>{if(v.length<=5)for(let g=0;g<v.length;g++)if(M(v[g]))f.push(`
          const resultMiddleware${g} = await globalMiddlewares[${g}](ctx);
          if (resultMiddleware${g}) return resultMiddleware${g};
      `);else f.push(`
        const resultMiddleware${g} = globalMiddlewares[${g}](ctx);
        if (resultMiddleware${g}) return resultMiddleware${g};
    `);else f.push(`
    for (let i = 0; i < globalMiddlewares.length; i++) {
      const result = await globalMiddlewares[i](ctx);
      if (result) return result;
    }
  `)},rf=(f,v)=>{let g=[],C=v.globalMiddlewares||[],w=f?.hasOnReqHook?v.hooks.onRequest:[],$=f?.hasPreHandlerHook?v.hooks.preHandler:[],z=f?.hasOnSendHook?v.hooks.onSend:[];if(uf(g),g.push(`
      const routeHandler = diesel.trie.search(pathname, req.method);
    `),w&&w.length>0)k(g,w,"onRequest","req","pathname","server");if(g.push(`
          const ctx = new Context(req, server, pathname, routeHandler?.path)
    `),f?.hasMiddleware){if(C.length>0)Nf(g,C);if(v.middlewares.size>0)g.push(`
      const local = diesel.middlewares.get(pathname)
      if (local && local.length) {
        for (const middleware of local) {
          const result = await middleware(ctx);
          if (result) return result;
        }
      }
        `)}if(f.hasFilterEnabled)g.push(`
        const filterResponse = await runFilter(diesel, pathname, ctx);
        if (filterResponse) return filterResponse;
      `);if(g.push(`
      if (!routeHandler) return await handleRouteNotFound(diesel, ctx, pathname);
    `),f.hasPreHandlerHook)k(g,$,"preHandler","ctx");if(g.push(`
      const result = routeHandler.handler(ctx);
      const finalResult = result instanceof Promise ? await result : result;
    `),f.hasOnSendHook)k(g,z,"onSend","ctx","finalResult");g.push(`
      if (finalResult instanceof Response) return finalResult;
      return generateErrorResponse(500, "No response returned from handler.");
    `);let K=`
      return async function pipeline(req, server, diesel) {
          ${g.join(`
`)}
      }
    `;return new Function("runFilter","handleRouteNotFound","generateErrorResponse","globalMiddlewares","Context",K)(H1,I1,T,C,r)},Tf=(f,v,g,C,...w)=>{let $=[],z;if(typeof w[0]==="string"||typeof w[0]==="object")z=w[0];let K=w,A=f?.hasMiddleware?v.globalMiddlewares:[],G=f?.hasMiddleware?v.middlewares.get(C)||[]:[],J=[...A,...G],Y=f?.hasOnReqHook?v.hooks.onRequest:[],Z=v.filters.has(C),V=v.filterFunction;if(Y&&Y?.length>0)$.push(`
      const onRequestResult = await runHooks(
        "onRequest",
        onRequestHooks,
        [req, "${C}", server]
      );
      if (onRequestResult) return onRequestResult;
    `);if(J.length)$.push(`
      const globalMiddlewareResponse = await executeBunMiddlewares(
        allMiddlewares,
        req,
        server
      );
      if (globalMiddlewareResponse) return globalMiddlewareResponse;
    `);if(f.hasFilterEnabled){if(!Z)$.push(`if (${V.length}) {
        for (const filterFunction of filterFunctions) {
          const filterResult = await filterFunction(req, server);
          if (filterResult) return filterResult;
        }
      } else {
        return Response.json({ error: "Protected route, authentication required" }, { status: 401 });
      }`)}if($.push(`
            if ("${g}" !== req.method)
        return new Response("Method Not Allowed", { status: 405 });
      `),typeof z!=="undefined")if(typeof z==="string")$.push(`
        return new Response(${JSON.stringify(z)});
      `);else{let B=JSON.stringify(z);$.push(`
        return new Response(${JSON.stringify(B)}, {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      `)}else if(K.length===1){let B=K[0];if(M(B))$.push(`
        const response = await handlers[0](req, server);
        if (response instanceof Response) return response;
      `);else $.push(`
        const response = handlers[0](req, server);
        if (response instanceof Response) return response;
      `)}else K.forEach((B,X)=>{if(M(B))$.push(`
            const response${X} = await handlers[${X}](req, server);
            if (response${X} instanceof Response) return response${X};
        `);else $.push(`
            const response${X} = handlers[${X}](req, server);
            if (response${X} instanceof Response) return response${X};
        `)});let Q=`
    return async function(req, server) {
      ${$.join(`
`)}
    }
  `;return new Function("executeBunMiddlewares","handlers","runHooks","filterFunctions","onRequestHooks","allMiddlewares",Q)(M1,K,L1,V,Y,J)};export{rf as buildRequestPipeline,Tf as BunRequestPipline};
