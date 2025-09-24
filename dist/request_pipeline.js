var Rf=Object.create;var{getPrototypeOf:cf,defineProperty:W,getOwnPropertyNames:h,getOwnPropertyDescriptor:Lf}=Object,n=Object.prototype.hasOwnProperty;var Mf=(f,v,g)=>{g=f!=null?Rf(cf(f)):{};let u=v||!f||!f.__esModule?W(g,"default",{value:f,enumerable:!0}):g;for(let r of h(f))if(!n.call(u,r))W(u,r,{get:()=>f[r],enumerable:!0});return u},m=new WeakMap,Hf=(f)=>{var v=m.get(f),g;if(v)return v;if(v=W({},"__esModule",{value:!0}),f&&typeof f==="object"||typeof f==="function")h(f).map((u)=>!n.call(v,u)&&W(v,u,{get:()=>f[u],enumerable:!(g=Lf(f,u))||g.enumerable}));return m.set(f,v),v},H=(f,v)=>()=>(v||f((v={exports:{}}).exports,v),v.exports);var Sf=(f,v)=>{for(var g in v)W(f,g,{get:v[g],enumerable:!0,configurable:!0,set:(u)=>v[g]=()=>u})};var If=(f,v)=>()=>(f&&(v=f(f=0)),v);var yf=((f)=>typeof require!=="undefined"?require:typeof Proxy!=="undefined"?new Proxy(f,{get:(v,g)=>(typeof require!=="undefined"?require:v)[g]}):f)(function(f){if(typeof require!=="undefined")return require.apply(this,arguments);throw Error('Dynamic require of "'+f+'" is not supported')});var rf={};Sf(rf,{sep:()=>gf,resolve:()=>q,relative:()=>t,posix:()=>uf,parse:()=>ff,normalize:()=>S,join:()=>i,isAbsolute:()=>l,format:()=>p,extname:()=>o,dirname:()=>s,delimiter:()=>vf,default:()=>Ef,basename:()=>e,_makeLong:()=>a});function G(f){if(typeof f!=="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(f))}function d(f,v){var g="",u=0,r=-1,C=0,w;for(var j=0;j<=f.length;++j){if(j<f.length)w=f.charCodeAt(j);else if(w===47)break;else w=47;if(w===47){if(r===j-1||C===1);else if(r!==j-1&&C===2){if(g.length<2||u!==2||g.charCodeAt(g.length-1)!==46||g.charCodeAt(g.length-2)!==46){if(g.length>2){var z=g.lastIndexOf("/");if(z!==g.length-1){if(z===-1)g="",u=0;else g=g.slice(0,z),u=g.length-1-g.lastIndexOf("/");r=j,C=0;continue}}else if(g.length===2||g.length===1){g="",u=0,r=j,C=0;continue}}if(v){if(g.length>0)g+="/..";else g="..";u=2}}else{if(g.length>0)g+="/"+f.slice(r+1,j);else g=f.slice(r+1,j);u=j-r-1}r=j,C=0}else if(w===46&&C!==-1)++C;else C=-1}return g}function Of(f,v){var g=v.dir||v.root,u=v.base||(v.name||"")+(v.ext||"");if(!g)return u;if(g===v.root)return g+u;return g+f+u}function q(){var f="",v=!1,g;for(var u=arguments.length-1;u>=-1&&!v;u--){var r;if(u>=0)r=arguments[u];else{if(g===void 0)g=process.cwd();r=g}if(G(r),r.length===0)continue;f=r+"/"+f,v=r.charCodeAt(0)===47}if(f=d(f,!v),v)if(f.length>0)return"/"+f;else return"/";else if(f.length>0)return f;else return"."}function S(f){if(G(f),f.length===0)return".";var v=f.charCodeAt(0)===47,g=f.charCodeAt(f.length-1)===47;if(f=d(f,!v),f.length===0&&!v)f=".";if(f.length>0&&g)f+="/";if(v)return"/"+f;return f}function l(f){return G(f),f.length>0&&f.charCodeAt(0)===47}function i(){if(arguments.length===0)return".";var f;for(var v=0;v<arguments.length;++v){var g=arguments[v];if(G(g),g.length>0)if(f===void 0)f=g;else f+="/"+g}if(f===void 0)return".";return S(f)}function t(f,v){if(G(f),G(v),f===v)return"";if(f=q(f),v=q(v),f===v)return"";var g=1;for(;g<f.length;++g)if(f.charCodeAt(g)!==47)break;var u=f.length,r=u-g,C=1;for(;C<v.length;++C)if(v.charCodeAt(C)!==47)break;var w=v.length,j=w-C,z=r<j?r:j,J=-1,$=0;for(;$<=z;++$){if($===z){if(j>z){if(v.charCodeAt(C+$)===47)return v.slice(C+$+1);else if($===0)return v.slice(C+$)}else if(r>z){if(f.charCodeAt(g+$)===47)J=$;else if($===0)J=0}break}var A=f.charCodeAt(g+$),b=v.charCodeAt(C+$);if(A!==b)break;else if(A===47)J=$}var V="";for($=g+J+1;$<=u;++$)if($===u||f.charCodeAt($)===47)if(V.length===0)V+="..";else V+="/..";if(V.length>0)return V+v.slice(C+J);else{if(C+=J,v.charCodeAt(C)===47)++C;return v.slice(C)}}function a(f){return f}function s(f){if(G(f),f.length===0)return".";var v=f.charCodeAt(0),g=v===47,u=-1,r=!0;for(var C=f.length-1;C>=1;--C)if(v=f.charCodeAt(C),v===47){if(!r){u=C;break}}else r=!1;if(u===-1)return g?"/":".";if(g&&u===1)return"//";return f.slice(0,u)}function e(f,v){if(v!==void 0&&typeof v!=="string")throw new TypeError('"ext" argument must be a string');G(f);var g=0,u=-1,r=!0,C;if(v!==void 0&&v.length>0&&v.length<=f.length){if(v.length===f.length&&v===f)return"";var w=v.length-1,j=-1;for(C=f.length-1;C>=0;--C){var z=f.charCodeAt(C);if(z===47){if(!r){g=C+1;break}}else{if(j===-1)r=!1,j=C+1;if(w>=0)if(z===v.charCodeAt(w)){if(--w===-1)u=C}else w=-1,u=j}}if(g===u)u=j;else if(u===-1)u=f.length;return f.slice(g,u)}else{for(C=f.length-1;C>=0;--C)if(f.charCodeAt(C)===47){if(!r){g=C+1;break}}else if(u===-1)r=!1,u=C+1;if(u===-1)return"";return f.slice(g,u)}}function o(f){G(f);var v=-1,g=0,u=-1,r=!0,C=0;for(var w=f.length-1;w>=0;--w){var j=f.charCodeAt(w);if(j===47){if(!r){g=w+1;break}continue}if(u===-1)r=!1,u=w+1;if(j===46){if(v===-1)v=w;else if(C!==1)C=1}else if(v!==-1)C=-1}if(v===-1||u===-1||C===0||C===1&&v===u-1&&v===g+1)return"";return f.slice(v,u)}function p(f){if(f===null||typeof f!=="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof f);return Of("/",f)}function ff(f){G(f);var v={root:"",dir:"",base:"",ext:"",name:""};if(f.length===0)return v;var g=f.charCodeAt(0),u=g===47,r;if(u)v.root="/",r=1;else r=0;var C=-1,w=0,j=-1,z=!0,J=f.length-1,$=0;for(;J>=r;--J){if(g=f.charCodeAt(J),g===47){if(!z){w=J+1;break}continue}if(j===-1)z=!1,j=J+1;if(g===46){if(C===-1)C=J;else if($!==1)$=1}else if(C!==-1)$=-1}if(C===-1||j===-1||$===0||$===1&&C===j-1&&C===w+1){if(j!==-1)if(w===0&&u)v.base=v.name=f.slice(1,j);else v.base=v.name=f.slice(w,j)}else{if(w===0&&u)v.name=f.slice(1,C),v.base=f.slice(1,j);else v.name=f.slice(w,C),v.base=f.slice(w,j);v.ext=f.slice(C,j)}if(w>0)v.dir=f.slice(0,w-1);else if(u)v.dir="/";return v}var gf="/",vf=":",uf,Ef;var Cf=If(()=>{uf=((f)=>(f.posix=f,f))({resolve:q,normalize:S,isAbsolute:l,join:i,relative:t,_makeLong:a,dirname:s,basename:e,extname:o,format:p,parse:ff,sep:gf,delimiter:vf,win32:null,posix:null}),Ef=uf});var $f=H((hf)=>{var Pf=/[|\\{}()[\]^$+*?.]/g,xf=Object.prototype.hasOwnProperty,y=function(f,v){return xf.apply(f,[v])};hf.escapeRegExpChars=function(f){if(!f)return"";return String(f).replace(Pf,"\\$&")};var _f={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"},Tf=/[&<>'"]/g;function kf(f){return _f[f]||f}var mf=`var _ENCODE_HTML_RULES = {
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
`;hf.escapeXML=function(f){return f==null?"":String(f).replace(Tf,kf)};function wf(){return Function.prototype.toString.call(this)+`;
`+mf}try{if(typeof Object.defineProperty==="function")Object.defineProperty(hf.escapeXML,"toString",{value:wf});else hf.escapeXML.toString=wf}catch(f){console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)")}hf.shallowCopy=function(f,v){if(v=v||{},f!==null&&f!==void 0)for(var g in v){if(!y(v,g))continue;if(g==="__proto__"||g==="constructor")continue;f[g]=v[g]}return f};hf.shallowCopyFromList=function(f,v,g){if(g=g||[],v=v||{},f!==null&&f!==void 0)for(var u=0;u<g.length;u++){var r=g[u];if(typeof v[r]!="undefined"){if(!y(v,r))continue;if(r==="__proto__"||r==="constructor")continue;f[r]=v[r]}}return f};hf.cache={_data:{},set:function(f,v){this._data[f]=v},get:function(f){return this._data[f]},remove:function(f){delete this._data[f]},reset:function(){this._data={}}};hf.hyphenToCamel=function(f){return f.replace(/-[a-z]/g,function(v){return v[1].toUpperCase()})};hf.createNullProtoObjWherePossible=function(){if(typeof Object.create=="function")return function(){return Object.create(null)};if(!({__proto__:null}instanceof Object))return function(){return{__proto__:null}};return function(){return{}}}();hf.hasOwnOnlyObject=function(f){var v=hf.createNullProtoObjWherePossible();for(var g in f)if(y(f,g))v[g]=f[g];return v}});var zf=H((R1,ef)=>{ef.exports={name:"ejs",description:"Embedded JavaScript templates",keywords:["template","engine","ejs"],version:"3.1.10",author:"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",license:"Apache-2.0",bin:{ejs:"./bin/cli.js"},main:"./lib/ejs.js",jsdelivr:"ejs.min.js",unpkg:"ejs.min.js",repository:{type:"git",url:"git://github.com/mde/ejs.git"},bugs:"https://github.com/mde/ejs/issues",homepage:"https://github.com/mde/ejs",dependencies:{jake:"^10.8.5"},devDependencies:{browserify:"^16.5.1",eslint:"^6.8.0","git-directory-deploy":"^1.5.1",jsdoc:"^4.0.2","lru-cache":"^4.0.1",mocha:"^10.2.0","uglify-js":"^3.3.16"},engines:{node:">=0.10.0"},scripts:{test:"npx jake test"}}});var Uf=H((bf)=>{var P=(()=>({})),X=(Cf(),Hf(rf)),K=$f(),Jf=!1,of=zf().version,pf="<",f1=">",g1="%",Vf="locals",v1="ejs",u1="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)",Gf=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"],r1=Gf.concat("cache"),Kf=/^\uFEFF/,O=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;bf.cache=K.cache;bf.fileLoader=P.readFileSync;bf.localsName=Vf;bf.promiseImpl=new Function("return this;")().Promise;bf.resolveInclude=function(f,v,g){var{dirname:u,extname:r,resolve:C}=X,w=C(g?v:u(v),f),j=r(f);if(!j)w+=".ejs";return w};function Yf(f,v){var g;if(v.some(function(u){return g=bf.resolveInclude(f,u,!0),P.existsSync(g)}))return g}function C1(f,v){var g,u,r=v.views,C=/^[A-Za-z]+:\\|^\//.exec(f);if(C&&C.length)if(f=f.replace(/^\/*/,""),Array.isArray(v.root))g=Yf(f,v.root);else g=bf.resolveInclude(f,v.root||"/",!0);else{if(v.filename){if(u=bf.resolveInclude(f,v.filename),P.existsSync(u))g=u}if(!g&&Array.isArray(r))g=Yf(f,r);if(!g&&typeof v.includer!=="function")throw new Error('Could not find the include file "'+v.escapeFunction(f)+'"')}return g}function U(f,v){var g,u=f.filename,r=arguments.length>1;if(f.cache){if(!u)throw new Error("cache option requires a filename");if(g=bf.cache.get(u),g)return g;if(!r)v=Zf(u).toString().replace(Kf,"")}else if(!r){if(!u)throw new Error("Internal EJS error: no file name or template provided");v=Zf(u).toString().replace(Kf,"")}if(g=bf.compile(v,f),f.cache)bf.cache.set(u,g);return g}function w1(f,v,g){var u;if(!g)if(typeof bf.promiseImpl=="function")return new bf.promiseImpl(function(r,C){try{u=U(f)(v),r(u)}catch(w){C(w)}});else throw new Error("Please provide a callback function");else{try{u=U(f)(v)}catch(r){return g(r)}g(null,u)}}function Zf(f){return bf.fileLoader(f)}function j1(f,v){var g=K.shallowCopy(K.createNullProtoObjWherePossible(),v);if(g.filename=C1(f,g),typeof v.includer==="function"){var u=v.includer(f,g.filename);if(u){if(u.filename)g.filename=u.filename;if(u.template)return U(g,u.template)}}return U(g)}function Af(f,v,g,u,r){var C=v.split(`
`),w=Math.max(u-3,0),j=Math.min(C.length,u+3),z=r(g),J=C.slice(w,j).map(function($,A){var b=A+w+1;return(b==u?" >> ":"    ")+b+"| "+$}).join(`
`);throw f.path=z,f.message=(z||"ejs")+":"+u+`
`+J+`

`+f.message,f}function Qf(f){return f.replace(/;(\s*$)/,"$1")}bf.compile=function f(v,g){var u;if(g&&g.scope){if(!Jf)console.warn("`scope` option is deprecated and will be removed in EJS 3"),Jf=!0;if(!g.context)g.context=g.scope;delete g.scope}return u=new Y(v,g),u.compile()};bf.render=function(f,v,g){var u=v||K.createNullProtoObjWherePossible(),r=g||K.createNullProtoObjWherePossible();if(arguments.length==2)K.shallowCopyFromList(r,u,Gf);return U(r,f)(u)};bf.renderFile=function(){var f=Array.prototype.slice.call(arguments),v=f.shift(),g,u={filename:v},r,C;if(typeof arguments[arguments.length-1]=="function")g=f.pop();if(f.length){if(r=f.shift(),f.length)K.shallowCopy(u,f.pop());else{if(r.settings){if(r.settings.views)u.views=r.settings.views;if(r.settings["view cache"])u.cache=!0;if(C=r.settings["view options"],C)K.shallowCopy(u,C)}K.shallowCopyFromList(u,r,r1)}u.filename=v}else r=K.createNullProtoObjWherePossible();return w1(u,r,g)};bf.Template=Y;bf.clearCache=function(){bf.cache.reset()};function Y(f,v){var g=K.hasOwnOnlyObject(v),u=K.createNullProtoObjWherePossible();if(this.templateText=f,this.mode=null,this.truncate=!1,this.currentLine=1,this.source="",u.client=g.client||!1,u.escapeFunction=g.escape||g.escapeFunction||K.escapeXML,u.compileDebug=g.compileDebug!==!1,u.debug=!!g.debug,u.filename=g.filename,u.openDelimiter=g.openDelimiter||bf.openDelimiter||pf,u.closeDelimiter=g.closeDelimiter||bf.closeDelimiter||f1,u.delimiter=g.delimiter||bf.delimiter||g1,u.strict=g.strict||!1,u.context=g.context,u.cache=g.cache||!1,u.rmWhitespace=g.rmWhitespace,u.root=g.root,u.includer=g.includer,u.outputFunctionName=g.outputFunctionName,u.localsName=g.localsName||bf.localsName||Vf,u.views=g.views,u.async=g.async,u.destructuredLocals=g.destructuredLocals,u.legacyInclude=typeof g.legacyInclude!="undefined"?!!g.legacyInclude:!0,u.strict)u._with=!1;else u._with=typeof g._with!="undefined"?g._with:!0;this.opts=u,this.regex=this.createRegex()}Y.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"};Y.prototype={createRegex:function(){var f=u1,v=K.escapeRegExpChars(this.opts.delimiter),g=K.escapeRegExpChars(this.opts.openDelimiter),u=K.escapeRegExpChars(this.opts.closeDelimiter);return f=f.replace(/%/g,v).replace(/</g,g).replace(/>/g,u),new RegExp(f)},compile:function(){var f,v,g=this.opts,u="",r="",C=g.escapeFunction,w,j=g.filename?JSON.stringify(g.filename):"undefined";if(!this.source){if(this.generateSource(),u+=`  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
`,g.outputFunctionName){if(!O.test(g.outputFunctionName))throw new Error("outputFunctionName is not a valid JS identifier.");u+="  var "+g.outputFunctionName+` = __append;
`}if(g.localsName&&!O.test(g.localsName))throw new Error("localsName is not a valid JS identifier.");if(g.destructuredLocals&&g.destructuredLocals.length){var z="  var __locals = ("+g.localsName+` || {}),
`;for(var J=0;J<g.destructuredLocals.length;J++){var $=g.destructuredLocals[J];if(!O.test($))throw new Error("destructuredLocals["+J+"] is not a valid JS identifier.");if(J>0)z+=`,
  `;z+=$+" = __locals."+$}u+=z+`;
`}if(g._with!==!1)u+="  with ("+g.localsName+` || {}) {
`,r+=`  }
`;r+=`  return __output;
`,this.source=u+this.source+r}if(g.compileDebug)f=`var __line = 1
  , __lines = `+JSON.stringify(this.templateText)+`
  , __filename = `+j+`;
try {
`+this.source+`} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}
`;else f=this.source;if(g.client){if(f="escapeFn = escapeFn || "+C.toString()+`;
`+f,g.compileDebug)f="rethrow = rethrow || "+Af.toString()+`;
`+f}if(g.strict)f=`"use strict";
`+f;if(g.debug)console.log(f);if(g.compileDebug&&g.filename)f=f+`
//# sourceURL=`+j+`
`;try{if(g.async)try{w=new Function("return (async function(){}).constructor;")()}catch(Z){if(Z instanceof SyntaxError)throw new Error("This environment does not support async/await");else throw Z}else w=Function;v=new w(g.localsName+", escapeFn, include, rethrow",f)}catch(Z){if(Z instanceof SyntaxError){if(g.filename)Z.message+=" in "+g.filename;if(Z.message+=` while compiling ejs

`,Z.message+=`If the above error is not helpful, you may want to try EJS-Lint:
`,Z.message+="https://github.com/RyanZim/EJS-Lint",!g.async)Z.message+=`
`,Z.message+="Or, if you meant to create an async function, pass `async: true` as an option."}throw Z}var A=g.client?v:function Z(c){var B=function(Q,L){var M=K.shallowCopy(K.createNullProtoObjWherePossible(),c);if(L)M=K.shallowCopy(M,L);return j1(Q,g)(M)};return v.apply(g.context,[c||K.createNullProtoObjWherePossible(),C,B,Af])};if(g.filename&&typeof Object.defineProperty==="function"){var b=g.filename,V=X.basename(b,X.extname(b));try{Object.defineProperty(A,"name",{value:V,writable:!1,enumerable:!1,configurable:!0})}catch(Z){}}return A},generateSource:function(){var f=this.opts;if(f.rmWhitespace)this.templateText=this.templateText.replace(/[\r\n]+/g,`
`).replace(/^\s+|\s+$/gm,"");this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var v=this,g=this.parseTemplateText(),u=this.opts.delimiter,r=this.opts.openDelimiter,C=this.opts.closeDelimiter;if(g&&g.length)g.forEach(function(w,j){var z;if(w.indexOf(r+u)===0&&w.indexOf(r+u+u)!==0){if(z=g[j+2],!(z==u+C||z=="-"+u+C||z=="_"+u+C))throw new Error('Could not find matching close tag for "'+w+'".')}v.scanLine(w)})},parseTemplateText:function(){var f=this.templateText,v=this.regex,g=v.exec(f),u=[],r;while(g){if(r=g.index,r!==0)u.push(f.substring(0,r)),f=f.slice(r);u.push(g[0]),f=f.slice(g[0].length),g=v.exec(f)}if(f)u.push(f);return u},_addOutput:function(f){if(this.truncate)f=f.replace(/^(?:\r\n|\r|\n)/,""),this.truncate=!1;if(!f)return f;f=f.replace(/\\/g,"\\\\"),f=f.replace(/\n/g,"\\n"),f=f.replace(/\r/g,"\\r"),f=f.replace(/"/g,"\\\""),this.source+='    ; __append("'+f+`")
`},scanLine:function(f){var v=this,g=this.opts.delimiter,u=this.opts.openDelimiter,r=this.opts.closeDelimiter,C=0;switch(C=f.split(`
`).length-1,f){case u+g:case u+g+"_":this.mode=Y.modes.EVAL;break;case u+g+"=":this.mode=Y.modes.ESCAPED;break;case u+g+"-":this.mode=Y.modes.RAW;break;case u+g+"#":this.mode=Y.modes.COMMENT;break;case u+g+g:this.mode=Y.modes.LITERAL,this.source+='    ; __append("'+f.replace(u+g+g,u+g)+`")
`;break;case g+g+r:this.mode=Y.modes.LITERAL,this.source+='    ; __append("'+f.replace(g+g+r,g+r)+`")
`;break;case g+r:case"-"+g+r:case"_"+g+r:if(this.mode==Y.modes.LITERAL)this._addOutput(f);this.mode=null,this.truncate=f.indexOf("-")===0||f.indexOf("_")===0;break;default:if(this.mode){switch(this.mode){case Y.modes.EVAL:case Y.modes.ESCAPED:case Y.modes.RAW:if(f.lastIndexOf("//")>f.lastIndexOf(`
`))f+=`
`}switch(this.mode){case Y.modes.EVAL:this.source+="    ; "+f+`
`;break;case Y.modes.ESCAPED:this.source+="    ; __append(escapeFn("+Qf(f)+`))
`;break;case Y.modes.RAW:this.source+="    ; __append("+Qf(f)+`)
`;break;case Y.modes.COMMENT:break;case Y.modes.LITERAL:this._addOutput(f);break}}else this._addOutput(f)}if(v.opts.compileDebug&&C)this.currentLine+=C,this.source+="    ; __line = "+this.currentLine+`
`}};bf.escapeXML=K.escapeXML;bf.__express=bf.renderFile;bf.VERSION=of;bf.name=v1;if(typeof window!="undefined")window.ejs=bf});function F(f){switch(f.split(".").pop()?.toLowerCase()){case"js":return"application/javascript";case"css":return"text/css";case"html":return"text/html";case"json":return"application/json";case"png":return"image/png";case"jpg":case"jpeg":return"image/jpeg";case"svg":return"image/svg+xml";case"gif":return"image/gif";case"woff":return"font/woff";case"woff2":return"font/woff2";default:return"application/octet-stream"}}var x=null;async function V1(){if(!x){let f=await Promise.resolve().then(() => Mf(Uf(),1));x=f.default||f}return x}class _{req;server;path;routePattern;env;executionContext;headers=new Headers;parsedQuery=null;parsedParams=null;parsedCookies=null;parsedBody=null;contextData={};urlObject=null;constructor(f,v,g,u,r,C){this.req=f,this.server=v,this.path=g,this.routePattern=u,this.executionContext=C,this.env=r}setHeader(f,v){return this.headers.set(f,v),this}removeHeader(f){return this.headers.delete(f),this}set(f,v){return this.contextData[f]=v,this}get(f){return this.contextData[f]}get ip(){if(this.server)return this.server.requestIP(this.req)?.address??null;return this.req.headers.get("CF-Connecting-IP")||null}get url(){if(!this.urlObject)this.urlObject=new URL(this.req.url);return this.urlObject}get query(){if(!this.parsedQuery)this.parsedQuery=this.url.search?Object.fromEntries(this.url.searchParams):{};return this.parsedQuery}get params(){if(!this.parsedParams&&this.routePattern)try{this.parsedParams=b1(this.routePattern,this.path)}catch(f){let v=f instanceof Error?f.message:String(f);throw new Error(`Failed to extract route parameters: ${v}`)}return this.parsedParams??{}}get body(){if(this.req.method==="GET")return Promise.resolve({});if(!this.parsedBody)this.parsedBody=(async()=>{try{let f=await B1(this.req);if(f.error)throw new Error(f.error);return Object.keys(f).length===0?null:f}catch(f){throw new Error("Invalid request body format")}})();return this.parsedBody}text(f,v=200){return new Response(f,{status:v,headers:this.headers})}send(f,v=200){let g;if(f instanceof Uint8Array)g="Uint8Array";else if(f instanceof ArrayBuffer)g="ArrayBuffer";else g=typeof f;let u=g==="object"&&f!==null?JSON.stringify(f):f;return new Response(u,{status:v,headers:this.headers})}json(f,v=200){return Response.json(f,{status:v,headers:this.headers})}file(f,v,g=200){let u=Bun.file(f);if(!this.headers.has("Content-Type"))this.headers.set("Content-Type",v??F(f));return new Response(u,{status:g,headers:this.headers})}async ejs(f,v={},g=200){let u=await V1();try{let r=await Bun.file(f).text(),C=u.render(r,v),w=new Headers({"Content-Type":"text/html; charset=utf-8"});return new Response(C,{status:g,headers:w})}catch(r){return console.error("EJS Rendering Error:",r),new Response("Error rendering template",{status:500})}}redirect(f,v=302){return this.headers.set("Location",f),new Response(null,{status:v,headers:this.headers})}setCookie(f,v,g={}){let u=`${encodeURIComponent(f)}=${encodeURIComponent(v)}`;if(g.maxAge)u+=`; Max-Age=${g.maxAge}`;if(g.expires)u+=`; Expires=${g.expires.toUTCString()}`;if(g.path)u+=`; Path=${g.path}`;if(g.domain)u+=`; Domain=${g.domain}`;if(g.secure)u+="; Secure";if(g.httpOnly)u+="; HttpOnly";if(g.sameSite)u+=`; SameSite=${g.sameSite}`;return this.headers.append("Set-Cookie",u),this}get cookies(){if(!this.parsedCookies){let f=this.req.headers.get("cookie");this.parsedCookies=f?G1(f):{}}return this.parsedCookies}stream(f){let v=new Headers(this.headers),g=new ReadableStream({async start(u){await f(u),u.close()}});return new Response(g,{headers:v})}yieldStream(f){return new Response}}function G1(f){return Object.fromEntries(f.split(";").map((v)=>{let[g,...u]=v.trim().split("=");return[g,decodeURIComponent(u.join("="))]}))}function b1(f,v){let g={},u=f.split("/"),[r]=v.split("?"),C=r.split("/");if(u.length!==C.length)return null;for(let w=0;w<u.length;w++){let j=u[w];if(j.charCodeAt(0)===58)g[j.slice(1)]=C[w]}return g}async function B1(f){let v=f.headers.get("Content-Type")||"";if(!v)return{};if(f.headers.get("Content-Length")==="0"||!f.body)return{};if(v.startsWith("application/json"))return await f.json();if(v.startsWith("application/x-www-form-urlencoded")){let u=await f.text();return Object.fromEntries(new URLSearchParams(u))}if(v.startsWith("multipart/form-data")){let u=await f.formData(),r={};for(let[C,w]of u.entries())r[C]=w;return r}return{error:"Unknown request body type"}}async function Ff(f,v,g){if(!v?.length)return;for(let u=0;u<v.length;u++){let r=v[u](...g),C=r instanceof Promise?await r:r;if(C&&f!=="onRequest")return C}}async function O1(f,v,g){let u=f.globalMiddlewares;if(u.length)for(let C of u){let w=await C(g);if(w)return w}let r=f.middlewares.get(v);if(r&&r.length)for(let C of r){let w=await C(g);if(w)return w}return null}async function qf(f,v,g){for(let u of f){let r=await u(v,g);if(r)return r}}async function Df(f,v,g){let u=await W1(f,v,g),r=u instanceof Promise?await u:u;if(r)return r}async function W1(f,v,g){if(v.endsWith("/"))v=v.slice(0,-1);if(!f.filters.has(v))if(f.filterFunction.length)for(let u of f.filterFunction){let r=await u(g);if(r)return r}else return Response.json({error:"Protected route, authentication required"},{status:401})}async function Nf(f,v,g){if(f.staticPath){let r=!0;if(f.staticRequestPath)r=g.startsWith(f.staticRequestPath);if(r){let C=await X1(f,g,v);if(C)return C;let w=f.router.find(v.req.method,"*");if(w?.handler)return await w.handler(v)}}let u=f.routeNotFoundFunc(v);return u instanceof Promise?await u:u||T(404,`404 Route not found for ${g}`)}function T(f,v){return new Response(JSON.stringify({error:v}),{status:f,headers:{"Content-Type":"application/json"}})}async function X1(f,v,g){if(!f.staticPath)return null;let u=`${f.staticPath}${v}`;if(await Bun.file(u).exists()){let C=F(u);return g.file(u,C,200)}return null}var R=(f)=>f.constructor.name==="AsyncFunction",k=(f,v,g,...u)=>{if(v.length>5)f.push(`
      for (let i = 0; i < diesel.hooks.${g}.length; i++) {
        const result = diesel.hooks.${g}[i](${u});
        const finalResult = result instanceof Promise ? await result : result;
        if (finalResult && '${g}' !== 'onRequest') return finalResult
    }
  `);else v?.forEach((r,C)=>{if(R(r))f.push(`
            const ${g}${C}Result = await diesel.hooks.${g}[${C}](${u})
            if (${g}${C}Result && '${g}' !== 'onRequest') return ${g}${C}Result
            `);else f.push(`
            const ${g}${C}Result = diesel.hooks.${g}[${C}](${u})
             if (${g}${C}Result && '${g}' !== 'onRequest') return ${g}${C}Result
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
  `)},F1=(f,v)=>{if(v.length<=5)for(let g=0;g<v.length;g++)if(R(v[g]))f.push(`
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
  `)},_1=(f,v)=>{let g=[],u=v.globalMiddlewares||[],r=f?.hasOnReqHook?v.hooks.onRequest:[],C=f?.hasPreHandlerHook?v.hooks.preHandler:[],w=f?.hasOnSendHook?v.hooks.onSend:[];if(U1(g),g.push(`
      const routeHandler = diesel.trie.search(pathname, req.method);
    `),r&&r.length>0)k(g,r,"onRequest","req","pathname","server");if(g.push(`
          const ctx = new Context(req, server, pathname, routeHandler?.path)
    `),f?.hasMiddleware){if(u.length>0)F1(g,u);if(v.middlewares.size>0)g.push(`
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
    `),f.hasPreHandlerHook)k(g,C,"preHandler","ctx");if(g.push(`
      const result = routeHandler.handler(ctx);
      const finalResult = result instanceof Promise ? await result : result;
    `),f.hasOnSendHook)k(g,w,"onSend","ctx","finalResult");g.push(`
      if (finalResult instanceof Response) return finalResult;
      return generateErrorResponse(500, "No response returned from handler.");
    `);let j=`
      return async function pipeline(req, server, diesel) {
          ${g.join(`
`)}
      }
    `;return new Function("runFilter","handleRouteNotFound","generateErrorResponse","globalMiddlewares","Context",j)(Df,Nf,T,u,_)},T1=(f,v,g,u,...r)=>{let C=[],w;if(typeof r[0]==="string"||typeof r[0]==="object")w=r[0];let j=r,z=f?.hasMiddleware?v.globalMiddlewares:[],J=f?.hasMiddleware?v.middlewares.get(u)||[]:[],$=[...z,...J],A=f?.hasOnReqHook?v.hooks.onRequest:[],b=v.filters.has(u),V=v.filterFunction;if(A&&A?.length>0)C.push(`
      const onRequestResult = await runHooks(
        "onRequest",
        onRequestHooks,
        [req, "${u}", server]
      );
      if (onRequestResult) return onRequestResult;
    `);if($.length)C.push(`
      const globalMiddlewareResponse = await executeBunMiddlewares(
        allMiddlewares,
        req,
        server
      );
      if (globalMiddlewareResponse) return globalMiddlewareResponse;
    `);if(f.hasFilterEnabled){if(!b)C.push(`if (${V.length}) {
        for (const filterFunction of filterFunctions) {
          const filterResult = await filterFunction(req, server);
          if (filterResult) return filterResult;
        }
      } else {
        return Response.json({ error: "Protected route, authentication required" }, { status: 401 });
      }`)}if(C.push(`
            if ("${g}" !== req.method)
        return new Response("Method Not Allowed", { status: 405 });
      `),typeof w!=="undefined")if(typeof w==="string")C.push(`
        return new Response(${JSON.stringify(w)});
      `);else{let B=JSON.stringify(w);C.push(`
        return new Response(${JSON.stringify(B)}, {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      `)}else if(j.length===1){let B=j[0];if(R(B))C.push(`
        const response = await handlers[0](req, server);
        if (response instanceof Response) return response;
      `);else C.push(`
        const response = handlers[0](req, server);
        if (response instanceof Response) return response;
      `)}else j.forEach((B,Q)=>{if(R(B))C.push(`
            const response${Q} = await handlers[${Q}](req, server);
            if (response${Q} instanceof Response) return response${Q};
        `);else C.push(`
            const response${Q} = handlers[${Q}](req, server);
            if (response${Q} instanceof Response) return response${Q};
        `)});let Z=`
    return async function(req, server) {
      ${C.join(`
`)}
    }
  `;return new Function("executeBunMiddlewares","handlers","runHooks","filterFunctions","onRequestHooks","allMiddlewares",Z)(qf,j,Ff,V,A,$)};export{_1 as buildRequestPipeline,T1 as BunRequestPipline};
