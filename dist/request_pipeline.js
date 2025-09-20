var g1=Object.create;var{getPrototypeOf:_1,defineProperty:F,getOwnPropertyNames:l,getOwnPropertyDescriptor:b1}=Object,o=Object.prototype.hasOwnProperty;var P1=(f,Y,z)=>{z=f!=null?g1(_1(f)):{};let Z=Y||!f||!f.__esModule?F(z,"default",{value:f,enumerable:!0}):z;for(let J of l(f))if(!o.call(Z,J))F(Z,J,{get:()=>f[J],enumerable:!0});return Z},i=new WeakMap,I1=(f)=>{var Y=i.get(f),z;if(Y)return Y;if(Y=F({},"__esModule",{value:!0}),f&&typeof f==="object"||typeof f==="function")l(f).map((Z)=>!o.call(Y,Z)&&F(Y,Z,{get:()=>f[Z],enumerable:!(z=b1(f,Z))||z.enumerable}));return i.set(f,Y),Y},q=(f,Y)=>()=>(Y||f((Y={exports:{}}).exports,Y),Y.exports);var R1=(f,Y)=>{for(var z in Y)F(f,z,{get:Y[z],enumerable:!0,configurable:!0,set:(Z)=>Y[z]=()=>Z})};var q1=(f,Y)=>()=>(f&&(Y=f(f=0)),Y);var T1=((f)=>typeof require!=="undefined"?require:typeof Proxy!=="undefined"?new Proxy(f,{get:(Y,z)=>(typeof require!=="undefined"?require:Y)[z]}):f)(function(f){if(typeof require!=="undefined")return require.apply(this,arguments);throw Error('Dynamic require of "'+f+'" is not supported')});var A1={};R1(A1,{sep:()=>$1,resolve:()=>M,relative:()=>t,posix:()=>X1,parse:()=>J1,normalize:()=>T,join:()=>s,isAbsolute:()=>a,format:()=>Z1,extname:()=>Y1,dirname:()=>f1,delimiter:()=>V1,default:()=>y1,basename:()=>z1,_makeLong:()=>e});function L(f){if(typeof f!=="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(f))}function p(f,Y){var z="",Z=0,J=-1,$=0,X;for(var A=0;A<=f.length;++A){if(A<f.length)X=f.charCodeAt(A);else if(X===47)break;else X=47;if(X===47){if(J===A-1||$===1);else if(J!==A-1&&$===2){if(z.length<2||Z!==2||z.charCodeAt(z.length-1)!==46||z.charCodeAt(z.length-2)!==46){if(z.length>2){var Q=z.lastIndexOf("/");if(Q!==z.length-1){if(Q===-1)z="",Z=0;else z=z.slice(0,Q),Z=z.length-1-z.lastIndexOf("/");J=A,$=0;continue}}else if(z.length===2||z.length===1){z="",Z=0,J=A,$=0;continue}}if(Y){if(z.length>0)z+="/..";else z="..";Z=2}}else{if(z.length>0)z+="/"+f.slice(J+1,A);else z=f.slice(J+1,A);Z=A-J-1}J=A,$=0}else if(X===46&&$!==-1)++$;else $=-1}return z}function k1(f,Y){var z=Y.dir||Y.root,Z=Y.base||(Y.name||"")+(Y.ext||"");if(!z)return Z;if(z===Y.root)return z+Z;return z+f+Z}function M(){var f="",Y=!1,z;for(var Z=arguments.length-1;Z>=-1&&!Y;Z--){var J;if(Z>=0)J=arguments[Z];else{if(z===void 0)z=process.cwd();J=z}if(L(J),J.length===0)continue;f=J+"/"+f,Y=J.charCodeAt(0)===47}if(f=p(f,!Y),Y)if(f.length>0)return"/"+f;else return"/";else if(f.length>0)return f;else return"."}function T(f){if(L(f),f.length===0)return".";var Y=f.charCodeAt(0)===47,z=f.charCodeAt(f.length-1)===47;if(f=p(f,!Y),f.length===0&&!Y)f=".";if(f.length>0&&z)f+="/";if(Y)return"/"+f;return f}function a(f){return L(f),f.length>0&&f.charCodeAt(0)===47}function s(){if(arguments.length===0)return".";var f;for(var Y=0;Y<arguments.length;++Y){var z=arguments[Y];if(L(z),z.length>0)if(f===void 0)f=z;else f+="/"+z}if(f===void 0)return".";return T(f)}function t(f,Y){if(L(f),L(Y),f===Y)return"";if(f=M(f),Y=M(Y),f===Y)return"";var z=1;for(;z<f.length;++z)if(f.charCodeAt(z)!==47)break;var Z=f.length,J=Z-z,$=1;for(;$<Y.length;++$)if(Y.charCodeAt($)!==47)break;var X=Y.length,A=X-$,Q=J<A?J:A,j=-1,V=0;for(;V<=Q;++V){if(V===Q){if(A>Q){if(Y.charCodeAt($+V)===47)return Y.slice($+V+1);else if(V===0)return Y.slice($+V)}else if(J>Q){if(f.charCodeAt(z+V)===47)j=V;else if(V===0)j=0}break}var W=f.charCodeAt(z+V),G=Y.charCodeAt($+V);if(W!==G)break;else if(W===47)j=V}var C="";for(V=z+j+1;V<=Z;++V)if(V===Z||f.charCodeAt(V)===47)if(C.length===0)C+="..";else C+="/..";if(C.length>0)return C+Y.slice($+j);else{if($+=j,Y.charCodeAt($)===47)++$;return Y.slice($)}}function e(f){return f}function f1(f){if(L(f),f.length===0)return".";var Y=f.charCodeAt(0),z=Y===47,Z=-1,J=!0;for(var $=f.length-1;$>=1;--$)if(Y=f.charCodeAt($),Y===47){if(!J){Z=$;break}}else J=!1;if(Z===-1)return z?"/":".";if(z&&Z===1)return"//";return f.slice(0,Z)}function z1(f,Y){if(Y!==void 0&&typeof Y!=="string")throw new TypeError('"ext" argument must be a string');L(f);var z=0,Z=-1,J=!0,$;if(Y!==void 0&&Y.length>0&&Y.length<=f.length){if(Y.length===f.length&&Y===f)return"";var X=Y.length-1,A=-1;for($=f.length-1;$>=0;--$){var Q=f.charCodeAt($);if(Q===47){if(!J){z=$+1;break}}else{if(A===-1)J=!1,A=$+1;if(X>=0)if(Q===Y.charCodeAt(X)){if(--X===-1)Z=$}else X=-1,Z=A}}if(z===Z)Z=A;else if(Z===-1)Z=f.length;return f.slice(z,Z)}else{for($=f.length-1;$>=0;--$)if(f.charCodeAt($)===47){if(!J){z=$+1;break}}else if(Z===-1)J=!1,Z=$+1;if(Z===-1)return"";return f.slice(z,Z)}}function Y1(f){L(f);var Y=-1,z=0,Z=-1,J=!0,$=0;for(var X=f.length-1;X>=0;--X){var A=f.charCodeAt(X);if(A===47){if(!J){z=X+1;break}continue}if(Z===-1)J=!1,Z=X+1;if(A===46){if(Y===-1)Y=X;else if($!==1)$=1}else if(Y!==-1)$=-1}if(Y===-1||Z===-1||$===0||$===1&&Y===Z-1&&Y===z+1)return"";return f.slice(Y,Z)}function Z1(f){if(f===null||typeof f!=="object")throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof f);return k1("/",f)}function J1(f){L(f);var Y={root:"",dir:"",base:"",ext:"",name:""};if(f.length===0)return Y;var z=f.charCodeAt(0),Z=z===47,J;if(Z)Y.root="/",J=1;else J=0;var $=-1,X=0,A=-1,Q=!0,j=f.length-1,V=0;for(;j>=J;--j){if(z=f.charCodeAt(j),z===47){if(!Q){X=j+1;break}continue}if(A===-1)Q=!1,A=j+1;if(z===46){if($===-1)$=j;else if(V!==1)V=1}else if($!==-1)V=-1}if($===-1||A===-1||V===0||V===1&&$===A-1&&$===X+1){if(A!==-1)if(X===0&&Z)Y.base=Y.name=f.slice(1,A);else Y.base=Y.name=f.slice(X,A)}else{if(X===0&&Z)Y.name=f.slice(1,$),Y.base=f.slice(1,A);else Y.name=f.slice(X,$),Y.base=f.slice(X,A);Y.ext=f.slice($,A)}if(X>0)Y.dir=f.slice(0,X-1);else if(Z)Y.dir="/";return Y}var $1="/",V1=":",X1,y1;var G1=q1(()=>{X1=((f)=>(f.posix=f,f))({resolve:M,normalize:T,isAbsolute:a,join:s,relative:t,_makeLong:e,dirname:f1,basename:z1,extname:Y1,format:Z1,parse:J1,sep:$1,delimiter:V1,win32:null,posix:null}),y1=X1});var j1=q((r1)=>{var x1=/[|\\{}()[\]^$+*?.]/g,m1=Object.prototype.hasOwnProperty,y=function(f,Y){return m1.apply(f,[Y])};r1.escapeRegExpChars=function(f){if(!f)return"";return String(f).replace(x1,"\\$&")};var c1={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"},u1=/[&<>'"]/g;function h1(f){return c1[f]||f}var d1=`var _ENCODE_HTML_RULES = {
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
`;r1.escapeXML=function(f){return f==null?"":String(f).replace(u1,h1)};function Q1(){return Function.prototype.toString.call(this)+`;
`+d1}try{if(typeof Object.defineProperty==="function")Object.defineProperty(r1.escapeXML,"toString",{value:Q1});else r1.escapeXML.toString=Q1}catch(f){console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)")}r1.shallowCopy=function(f,Y){if(Y=Y||{},f!==null&&f!==void 0)for(var z in Y){if(!y(Y,z))continue;if(z==="__proto__"||z==="constructor")continue;f[z]=Y[z]}return f};r1.shallowCopyFromList=function(f,Y,z){if(z=z||[],Y=Y||{},f!==null&&f!==void 0)for(var Z=0;Z<z.length;Z++){var J=z[Z];if(typeof Y[J]!="undefined"){if(!y(Y,J))continue;if(J==="__proto__"||J==="constructor")continue;f[J]=Y[J]}}return f};r1.cache={_data:{},set:function(f,Y){this._data[f]=Y},get:function(f){return this._data[f]},remove:function(f){delete this._data[f]},reset:function(){this._data={}}};r1.hyphenToCamel=function(f){return f.replace(/-[a-z]/g,function(Y){return Y[1].toUpperCase()})};r1.createNullProtoObjWherePossible=function(){if(typeof Object.create=="function")return function(){return Object.create(null)};if(!({__proto__:null}instanceof Object))return function(){return{__proto__:null}};return function(){return{}}}();r1.hasOwnOnlyObject=function(f){var Y=r1.createNullProtoObjWherePossible();for(var z in f)if(y(f,z))Y[z]=f[z];return Y}});var C1=q((b0,s1)=>{s1.exports={name:"ejs",description:"Embedded JavaScript templates",keywords:["template","engine","ejs"],version:"3.1.10",author:"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",license:"Apache-2.0",bin:{ejs:"./bin/cli.js"},main:"./lib/ejs.js",jsdelivr:"ejs.min.js",unpkg:"ejs.min.js",repository:{type:"git",url:"git://github.com/mde/ejs.git"},bugs:"https://github.com/mde/ejs/issues",homepage:"https://github.com/mde/ejs",dependencies:{jake:"^10.8.5"},devDependencies:{browserify:"^16.5.1",eslint:"^6.8.0","git-directory-deploy":"^1.5.1",jsdoc:"^4.0.2","lru-cache":"^4.0.1",mocha:"^10.2.0","uglify-js":"^3.3.16"},engines:{node:">=0.10.0"},scripts:{test:"npx jake test"}}});var w1=q((H1)=>{var c=(()=>({})),H=(G1(),I1(A1)),U=j1(),U1=!1,t1=C1().version,e1="<",f0=">",z0="%",v1="locals",Y0="ejs",Z0="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)",F1=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"],J0=F1.concat("cache"),B1=/^\uFEFF/,x=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;H1.cache=U.cache;H1.fileLoader=c.readFileSync;H1.localsName=v1;H1.promiseImpl=new Function("return this;")().Promise;H1.resolveInclude=function(f,Y,z){var{dirname:Z,extname:J,resolve:$}=H,X=$(z?Y:Z(Y),f),A=J(f);if(!A)X+=".ejs";return X};function K1(f,Y){var z;if(Y.some(function(Z){return z=H1.resolveInclude(f,Z,!0),c.existsSync(z)}))return z}function $0(f,Y){var z,Z,J=Y.views,$=/^[A-Za-z]+:\\|^\//.exec(f);if($&&$.length)if(f=f.replace(/^\/*/,""),Array.isArray(Y.root))z=K1(f,Y.root);else z=H1.resolveInclude(f,Y.root||"/",!0);else{if(Y.filename){if(Z=H1.resolveInclude(f,Y.filename),c.existsSync(Z))z=Z}if(!z&&Array.isArray(J))z=K1(f,J);if(!z&&typeof Y.includer!=="function")throw new Error('Could not find the include file "'+Y.escapeFunction(f)+'"')}return z}function O(f,Y){var z,Z=f.filename,J=arguments.length>1;if(f.cache){if(!Z)throw new Error("cache option requires a filename");if(z=H1.cache.get(Z),z)return z;if(!J)Y=N1(Z).toString().replace(B1,"")}else if(!J){if(!Z)throw new Error("Internal EJS error: no file name or template provided");Y=N1(Z).toString().replace(B1,"")}if(z=H1.compile(Y,f),f.cache)H1.cache.set(Z,z);return z}function V0(f,Y,z){var Z;if(!z)if(typeof H1.promiseImpl=="function")return new H1.promiseImpl(function(J,$){try{Z=O(f)(Y),J(Z)}catch(X){$(X)}});else throw new Error("Please provide a callback function");else{try{Z=O(f)(Y)}catch(J){return z(J)}z(null,Z)}}function N1(f){return H1.fileLoader(f)}function X0(f,Y){var z=U.shallowCopy(U.createNullProtoObjWherePossible(),Y);if(z.filename=$0(f,z),typeof Y.includer==="function"){var Z=Y.includer(f,z.filename);if(Z){if(Z.filename)z.filename=Z.filename;if(Z.template)return O(z,Z.template)}}return O(z)}function L1(f,Y,z,Z,J){var $=Y.split(`
`),X=Math.max(Z-3,0),A=Math.min($.length,Z+3),Q=J(z),j=$.slice(X,A).map(function(V,W){var G=W+X+1;return(G==Z?" >> ":"    ")+G+"| "+V}).join(`
`);throw f.path=Q,f.message=(Q||"ejs")+":"+Z+`
`+j+`

`+f.message,f}function D1(f){return f.replace(/;(\s*$)/,"$1")}H1.compile=function f(Y,z){var Z;if(z&&z.scope){if(!U1)console.warn("`scope` option is deprecated and will be removed in EJS 3"),U1=!0;if(!z.context)z.context=z.scope;delete z.scope}return Z=new K(Y,z),Z.compile()};H1.render=function(f,Y,z){var Z=Y||U.createNullProtoObjWherePossible(),J=z||U.createNullProtoObjWherePossible();if(arguments.length==2)U.shallowCopyFromList(J,Z,F1);return O(J,f)(Z)};H1.renderFile=function(){var f=Array.prototype.slice.call(arguments),Y=f.shift(),z,Z={filename:Y},J,$;if(typeof arguments[arguments.length-1]=="function")z=f.pop();if(f.length){if(J=f.shift(),f.length)U.shallowCopy(Z,f.pop());else{if(J.settings){if(J.settings.views)Z.views=J.settings.views;if(J.settings["view cache"])Z.cache=!0;if($=J.settings["view options"],$)U.shallowCopy(Z,$)}U.shallowCopyFromList(Z,J,J0)}Z.filename=Y}else J=U.createNullProtoObjWherePossible();return V0(Z,J,z)};H1.Template=K;H1.clearCache=function(){H1.cache.reset()};function K(f,Y){var z=U.hasOwnOnlyObject(Y),Z=U.createNullProtoObjWherePossible();if(this.templateText=f,this.mode=null,this.truncate=!1,this.currentLine=1,this.source="",Z.client=z.client||!1,Z.escapeFunction=z.escape||z.escapeFunction||U.escapeXML,Z.compileDebug=z.compileDebug!==!1,Z.debug=!!z.debug,Z.filename=z.filename,Z.openDelimiter=z.openDelimiter||H1.openDelimiter||e1,Z.closeDelimiter=z.closeDelimiter||H1.closeDelimiter||f0,Z.delimiter=z.delimiter||H1.delimiter||z0,Z.strict=z.strict||!1,Z.context=z.context,Z.cache=z.cache||!1,Z.rmWhitespace=z.rmWhitespace,Z.root=z.root,Z.includer=z.includer,Z.outputFunctionName=z.outputFunctionName,Z.localsName=z.localsName||H1.localsName||v1,Z.views=z.views,Z.async=z.async,Z.destructuredLocals=z.destructuredLocals,Z.legacyInclude=typeof z.legacyInclude!="undefined"?!!z.legacyInclude:!0,Z.strict)Z._with=!1;else Z._with=typeof z._with!="undefined"?z._with:!0;this.opts=Z,this.regex=this.createRegex()}K.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"};K.prototype={createRegex:function(){var f=Z0,Y=U.escapeRegExpChars(this.opts.delimiter),z=U.escapeRegExpChars(this.opts.openDelimiter),Z=U.escapeRegExpChars(this.opts.closeDelimiter);return f=f.replace(/%/g,Y).replace(/</g,z).replace(/>/g,Z),new RegExp(f)},compile:function(){var f,Y,z=this.opts,Z="",J="",$=z.escapeFunction,X,A=z.filename?JSON.stringify(z.filename):"undefined";if(!this.source){if(this.generateSource(),Z+=`  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
`,z.outputFunctionName){if(!x.test(z.outputFunctionName))throw new Error("outputFunctionName is not a valid JS identifier.");Z+="  var "+z.outputFunctionName+` = __append;
`}if(z.localsName&&!x.test(z.localsName))throw new Error("localsName is not a valid JS identifier.");if(z.destructuredLocals&&z.destructuredLocals.length){var Q="  var __locals = ("+z.localsName+` || {}),
`;for(var j=0;j<z.destructuredLocals.length;j++){var V=z.destructuredLocals[j];if(!x.test(V))throw new Error("destructuredLocals["+j+"] is not a valid JS identifier.");if(j>0)Q+=`,
  `;Q+=V+" = __locals."+V}Z+=Q+`;
`}if(z._with!==!1)Z+="  with ("+z.localsName+` || {}) {
`,J+=`  }
`;J+=`  return __output;
`,this.source=Z+this.source+J}if(z.compileDebug)f=`var __line = 1
  , __lines = `+JSON.stringify(this.templateText)+`
  , __filename = `+A+`;
try {
`+this.source+`} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}
`;else f=this.source;if(z.client){if(f="escapeFn = escapeFn || "+$.toString()+`;
`+f,z.compileDebug)f="rethrow = rethrow || "+L1.toString()+`;
`+f}if(z.strict)f=`"use strict";
`+f;if(z.debug)console.log(f);if(z.compileDebug&&z.filename)f=f+`
//# sourceURL=`+A+`
`;try{if(z.async)try{X=new Function("return (async function(){}).constructor;")()}catch(B){if(B instanceof SyntaxError)throw new Error("This environment does not support async/await");else throw B}else X=Function;Y=new X(z.localsName+", escapeFn, include, rethrow",f)}catch(B){if(B instanceof SyntaxError){if(z.filename)B.message+=" in "+z.filename;if(B.message+=` while compiling ejs

`,B.message+=`If the above error is not helpful, you may want to try EJS-Lint:
`,B.message+="https://github.com/RyanZim/EJS-Lint",!z.async)B.message+=`
`,B.message+="Or, if you meant to create an async function, pass `async: true` as an option."}throw B}var W=z.client?Y:function B(v){var D=function(N,I){var R=U.shallowCopy(U.createNullProtoObjWherePossible(),v);if(I)R=U.shallowCopy(R,I);return X0(N,z)(R)};return Y.apply(z.context,[v||U.createNullProtoObjWherePossible(),$,D,L1])};if(z.filename&&typeof Object.defineProperty==="function"){var G=z.filename,C=H.basename(G,H.extname(G));try{Object.defineProperty(W,"name",{value:C,writable:!1,enumerable:!1,configurable:!0})}catch(B){}}return W},generateSource:function(){var f=this.opts;if(f.rmWhitespace)this.templateText=this.templateText.replace(/[\r\n]+/g,`
`).replace(/^\s+|\s+$/gm,"");this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var Y=this,z=this.parseTemplateText(),Z=this.opts.delimiter,J=this.opts.openDelimiter,$=this.opts.closeDelimiter;if(z&&z.length)z.forEach(function(X,A){var Q;if(X.indexOf(J+Z)===0&&X.indexOf(J+Z+Z)!==0){if(Q=z[A+2],!(Q==Z+$||Q=="-"+Z+$||Q=="_"+Z+$))throw new Error('Could not find matching close tag for "'+X+'".')}Y.scanLine(X)})},parseTemplateText:function(){var f=this.templateText,Y=this.regex,z=Y.exec(f),Z=[],J;while(z){if(J=z.index,J!==0)Z.push(f.substring(0,J)),f=f.slice(J);Z.push(z[0]),f=f.slice(z[0].length),z=Y.exec(f)}if(f)Z.push(f);return Z},_addOutput:function(f){if(this.truncate)f=f.replace(/^(?:\r\n|\r|\n)/,""),this.truncate=!1;if(!f)return f;f=f.replace(/\\/g,"\\\\"),f=f.replace(/\n/g,"\\n"),f=f.replace(/\r/g,"\\r"),f=f.replace(/"/g,"\\\""),this.source+='    ; __append("'+f+`")
`},scanLine:function(f){var Y=this,z=this.opts.delimiter,Z=this.opts.openDelimiter,J=this.opts.closeDelimiter,$=0;switch($=f.split(`
`).length-1,f){case Z+z:case Z+z+"_":this.mode=K.modes.EVAL;break;case Z+z+"=":this.mode=K.modes.ESCAPED;break;case Z+z+"-":this.mode=K.modes.RAW;break;case Z+z+"#":this.mode=K.modes.COMMENT;break;case Z+z+z:this.mode=K.modes.LITERAL,this.source+='    ; __append("'+f.replace(Z+z+z,Z+z)+`")
`;break;case z+z+J:this.mode=K.modes.LITERAL,this.source+='    ; __append("'+f.replace(z+z+J,z+J)+`")
`;break;case z+J:case"-"+z+J:case"_"+z+J:if(this.mode==K.modes.LITERAL)this._addOutput(f);this.mode=null,this.truncate=f.indexOf("-")===0||f.indexOf("_")===0;break;default:if(this.mode){switch(this.mode){case K.modes.EVAL:case K.modes.ESCAPED:case K.modes.RAW:if(f.lastIndexOf("//")>f.lastIndexOf(`
`))f+=`
`}switch(this.mode){case K.modes.EVAL:this.source+="    ; "+f+`
`;break;case K.modes.ESCAPED:this.source+="    ; __append(escapeFn("+D1(f)+`))
`;break;case K.modes.RAW:this.source+="    ; __append("+D1(f)+`)
`;break;case K.modes.COMMENT:break;case K.modes.LITERAL:this._addOutput(f);break}}else this._addOutput(f)}if(Y.opts.compileDebug&&$)this.currentLine+=$,this.source+="    ; __line = "+this.currentLine+`
`}};H1.escapeXML=U.escapeXML;H1.__express=H1.renderFile;H1.VERSION=t1;H1.name=Y0;if(typeof window!="undefined")window.ejs=H1});function w(f){switch(f.split(".").pop()?.toLowerCase()){case"js":return"application/javascript";case"css":return"text/css";case"html":return"text/html";case"json":return"application/json";case"png":return"image/png";case"jpg":case"jpeg":return"image/jpeg";case"svg":return"image/svg+xml";case"gif":return"image/gif";case"woff":return"font/woff";case"woff2":return"font/woff2";default:return"application/octet-stream"}}var u=null;async function K0(){if(!u){let f=await Promise.resolve().then(() => P1(w1(),1));u=f.default||f}return u}function S(f,Y,z,Z){let J=null,$=null,X=null,A=null,Q={},j=null;return{req:f,server:Y,pathname:z,status:200,headers:new Headers,setHeader(V,W){return this.headers.set(V,W),this},removeHeader(V){return this.headers.delete(V),this},set(V,W){return Q[V]=W,this},get(V){return Q[V]},get ip(){return this.server.requestIP(f)?.address??null},get url(){if(!j)j=new URL(f.url);return j},get query(){if(!J){if(!this.url.search)return{};J=Object.fromEntries(this.url.searchParams)}return J},get params(){if(!$&&Z)try{$=L0(Z,z)}catch(V){let W=V instanceof Error?V.message:String(V);throw new Error(`Failed to extract route parameters: ${W}`)}return $??{}},get body(){if(f.method==="GET")return Promise.resolve({});if(!A)A=(async()=>{try{let V=await D0(f);if(V.error)throw new Error(V.error);return Object.keys(V).length===0?null:V}catch(V){throw new Error("Invalid request body format")}})();return A},text(V,W=200){return new Response(V,{status:W,headers:this.headers})},send(V,W=200){let G;if(V instanceof Uint8Array)G="Uint8Array";else if(V instanceof ArrayBuffer)G="ArrayBuffer";else G=typeof V;let C=G==="object"&&V!==null?JSON.stringify(V):V;return new Response(C,{status:W,headers:this.headers})},json(V,W=200){return Response.json(V,{status:W,headers:this.headers})},file(V,W,G=200){let C=Bun.file(V);if(!this.headers.has("Content-Type"))this.headers.set("Content-Type",W??w(V));return new Response(C,{status:G,headers:this.headers})},async ejs(V,W={},G=200){let C=await K0();try{let B=await Bun.file(V).text(),v=C.render(B,W),D=new Headers({"Content-Type":"text/html; charset=utf-8"});return new Response(v,{status:G,headers:D})}catch(B){return console.error("EJS Rendering Error:",B),new Response("Error rendering template",{status:500})}},redirect(V,W=302){return this.headers.set("Location",V),new Response(null,{status:W,headers:this.headers})},stream(V){let W=new Headers(this.headers),G=new ReadableStream({async start(C){await V(C),C.close()}});return new Response(G,{headers:W})},yieldStream(V){return new Response("not working stream yet.")},setCookie(V,W,G={}){let C=`${encodeURIComponent(V)}=${encodeURIComponent(W)}`;if(G.maxAge)C+=`; Max-Age=${G.maxAge}`;if(G.expires)C+=`; Expires=${G.expires.toUTCString()}`;if(G.path)C+=`; Path=${G.path}`;if(G.domain)C+=`; Domain=${G.domain}`;if(G.secure)C+="; Secure";if(G.httpOnly)C+="; HttpOnly";if(G.sameSite)C+=`; SameSite=${G.sameSite}`;return this.headers.append("Set-Cookie",C),this},get cookies(){if(!X){let V=this.req.headers.get("cookie");X=V?N0(V):{}}return X}}}function N0(f){return Object.fromEntries(f.split(";").map((Y)=>{let[z,...Z]=Y.trim().split("=");return[z,decodeURIComponent(Z.join("="))]}))}function L0(f,Y){let z={},Z=f.split("/"),[J]=Y.split("?"),$=J.split("/");if(Z.length!==$.length)return null;for(let X=0;X<Z.length;X++){let A=Z[X];if(A.charCodeAt(0)===58)z[A.slice(1)]=$[X]}return z}async function D0(f){let Y=f.headers.get("Content-Type")||"";if(!Y)return{};if(f.headers.get("Content-Length")==="0"||!f.body)return{};if(Y.startsWith("application/json"))return await f.json();if(Y.startsWith("application/x-www-form-urlencoded")){let Z=await f.text();return Object.fromEntries(new URLSearchParams(Z))}if(Y.startsWith("multipart/form-data")){let Z=await f.formData(),J={};for(let[$,X]of Z.entries())J[$]=X;return J}return{error:"Unknown request body type"}}var v0=(f,Y)=>{try{return Y(f)}catch{return f.replace(/(?:%[0-9A-Fa-f]{2})+/g,(z)=>{try{return Y(z)}catch{return z}})}},h=(f)=>v0(f,decodeURI),y0=(f)=>{let Y=f.indexOf("/",f.indexOf(":")+4),z=Y;for(;z<f.length;z++){let Z=f.charCodeAt(z);if(Z===37){let J=f.indexOf("?",z),$=f.slice(Y,J===-1?void 0:J);return h($.includes("%25")?$.replace(/%25/g,"%2525"):$)}else if(Z===63)break}return f.slice(Y,z)};async function F0(f,Y,z){let Z,J=f.url.indexOf("/",f.url.indexOf(":")+4),$=J;for(;$<f.url.length;$++){let V=f.url.charCodeAt($);if(V===37){let W=f.url.indexOf("?",$),G=f.url.slice(J,W===-1?void 0:W);Z=h(G.includes("%25")?G.replace(/%25/g,"%2525"):G);break}else if(V===63)break}if(!Z)Z=f.url.slice(J,$);let X=z.trie.search(Z,f.method),A=S(f,Y,Z,X?.path);if(z.hasOnReqHook)await E("onRequest",z.hooks.onRequest,[f,Z,Y]);if(z.hasMiddleware){let V=await H0(z,Z,A);if(V)return V}if(z.hasFilterEnabled){let V=await d(z,Z,A);if(V)return V}if(!X)return await r(z,A,Z);if(z.hasPreHandlerHook){let V=await E("preHandler",z.hooks.preHandler,[A]);if(V)return V}let Q=X.handler(A),j=Q instanceof Promise?await Q:Q;if(z.hasOnSendHook){let V=await E("onSend",z.hooks.onSend,[A,j]);if(V)return V}if(j instanceof Response)return j;return b(500,"No response returned from handler.")}async function E(f,Y,z){if(!Y?.length)return;for(let Z=0;Z<Y.length;Z++){let J=Y[Z](...z),$=J instanceof Promise?await J:J;if($&&f!=="onRequest")return $}}async function H0(f,Y,z){let Z=f.globalMiddlewares;if(Z.length)for(let $ of Z){let X=await $(z);if(X)return X}let J=f.middlewares.get(Y);if(J&&J.length)for(let $ of J){let X=await $(z);if(X)return X}return null}async function M1(f,Y,z){for(let Z of f){let J=await Z(Y,z);if(J)return J}}async function d(f,Y,z){let Z=await O0(f,Y,z),J=Z instanceof Promise?await Z:Z;if(J)return J}async function O0(f,Y,z){if(Y.endsWith("/"))Y=Y.slice(0,-1);if(!f.filters.has(Y))if(f.filterFunction.length)for(let Z of f.filterFunction){let J=await Z(z);if(J)return J}else return Response.json({error:"Protected route, authentication required"},{status:401})}async function h0(f,Y,z,Z){if(!f.filters.has(Y))if(f.filterFunction.length)for(let J of f.filterFunction){let $=await J(z,Z);if($)return $}else return Response.json({error:"Protected route, authentication required"},{status:401})}async function r(f,Y,z){if(f.staticPath){let J=await S0(f,z,Y);if(J)return J;let $=f.trie.search("*",Y.req.method);if($?.handler)return await $.handler(Y)}return f.routeNotFoundFunc(Y)||b(404,`Route not found for ${z}`)}function b(f,Y){return new Response(JSON.stringify({error:Y}),{status:f,headers:{"Content-Type":"application/json"}})}async function S0(f,Y,z){if(!f.staticPath)return null;let Z=`${f.staticPath}${Y}`;if(await Bun.file(Z).exists()){let $=w(Z);return z.file(Z,$,200)}return null}var P=(f)=>f.constructor.name==="AsyncFunction",n=(f,Y,z,...Z)=>{if(Y.length>5)f.push(`
      for (let i = 0; i < diesel.hooks.${z}.length; i++) {
        const result = diesel.hooks.${z}[i](${Z});
        const finalResult = result instanceof Promise ? await result : result;
        if (finalResult && '${z}' !== 'onRequest') return finalResult
    }
  `);else Y?.forEach((J,$)=>{if(P(J))f.push(`
            const ${z}${$}Result = await diesel.hooks.${z}[${$}](${Z})
            if (${z}${$}Result && '${z}' !== 'onRequest') return ${z}${$}Result
            `);else f.push(`
            const ${z}${$}Result = diesel.hooks.${z}[${$}](${Z})
             if (${z}${$}Result && '${z}' !== 'onRequest') return ${z}${$}Result
            `)})},E0=(f)=>{f.push(`
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
  `)},w0=(f,Y)=>{if(Y.length<=5)for(let z=0;z<Y.length;z++)if(P(Y[z]))f.push(`
          const resultMiddleware${z} = await globalMiddlewares[${z}](ctx);
          if (resultMiddleware${z}) return resultMiddleware${z};
      `);else f.push(`
        const resultMiddleware${z} = globalMiddlewares[${z}](ctx);
        if (resultMiddleware${z}) return resultMiddleware${z};
    `);else f.push(`
    for (let i = 0; i < globalMiddlewares.length; i++) {
      const result = await globalMiddlewares[i](ctx);
      if (result) return result;
    }
  `)},l0=(f,Y)=>{let z=[],Z=Y.globalMiddlewares||[],J=f?.hasOnReqHook?Y.hooks.onRequest:[],$=f?.hasPreHandlerHook?Y.hooks.preHandler:[],X=f?.hasOnSendHook?Y.hooks.onSend:[];if(E0(z),z.push(`
      const routeHandler = diesel.trie.search(pathname, req.method);
    `),J&&J.length>0)n(z,J,"onRequest","req","pathname","server");if(z.push(`
          const ctx = createCtx(req, server, pathname, routeHandler?.path);
    `),f?.hasMiddleware){if(Z.length>0)w0(z,Z);if(Y.middlewares.size>0)z.push(`
      const local = diesel.middlewares.get(pathname)
      if (local && local.length) {
        for (const middleware of local) {
          const result = await middleware(ctx);
          if (result) return result;
        }
      }
        `)}if(f.hasFilterEnabled)z.push(`
        const filterResponse = await runFilter(diesel, pathname, ctx);
        if (filterResponse) return filterResponse;
      `);if(z.push(`
      if (!routeHandler) return await handleRouteNotFound(diesel, ctx, pathname);
    `),f.hasPreHandlerHook)n(z,$,"preHandler","ctx");if(z.push(`
      const result = routeHandler.handler(ctx);
      const finalResult = result instanceof Promise ? await result : result;
    `),f.hasOnSendHook)n(z,X,"onSend","ctx","finalResult");z.push(`
      if (finalResult instanceof Response) return finalResult;
      return generateErrorResponse(500, "No response returned from handler.");
    `);let A=`
      return async function pipeline(req, server, diesel) {
          ${z.join(`
`)}
      }
    `;return new Function("runFilter","handleRouteNotFound","generateErrorResponse","globalMiddlewares","createCtx",A)(d,r,b,Z,S)},o0=(f,Y,z,Z,...J)=>{let $=[],X;if(typeof J[0]==="string"||typeof J[0]==="object")X=J[0];let A=J,Q=f?.hasMiddleware?Y.globalMiddlewares:[],j=f?.hasMiddleware?Y.middlewares.get(Z)||[]:[],V=[...Q,...j],W=f?.hasOnReqHook?Y.hooks.onRequest:[],G=Y.filters.has(Z),C=Y.filterFunction;if(W&&W?.length>0)$.push(`
      const onRequestResult = await runHooks(
        "onRequest",
        onRequestHooks,
        [req, "${Z}", server]
      );
      if (onRequestResult) return onRequestResult;
    `);if(V.length)$.push(`
      const globalMiddlewareResponse = await executeBunMiddlewares(
        allMiddlewares,
        req,
        server
      );
      if (globalMiddlewareResponse) return globalMiddlewareResponse;
    `);if(f.hasFilterEnabled){if(!G)$.push(`if (${C.length}) {
        for (const filterFunction of filterFunctions) {
          const filterResult = await filterFunction(req, server);
          if (filterResult) return filterResult;
        }
      } else {
        return Response.json({ error: "Protected route, authentication required" }, { status: 401 });
      }`)}if($.push(`
            if ("${z}" !== req.method)
        return new Response("Method Not Allowed", { status: 405 });
      `),typeof X!=="undefined")if(typeof X==="string")$.push(`
        return new Response(${JSON.stringify(X)});
      `);else{let D=JSON.stringify(X);$.push(`
        return new Response(${JSON.stringify(D)}, {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      `)}else if(A.length===1){let D=A[0];if(P(D))$.push(`
        const response = await handlers[0](req, server);
        if (response instanceof Response) return response;
      `);else $.push(`
        const response = handlers[0](req, server);
        if (response instanceof Response) return response;
      `)}else A.forEach((D,N)=>{if(P(D))$.push(`
            const response${N} = await handlers[${N}](req, server);
            if (response${N} instanceof Response) return response${N};
        `);else $.push(`
            const response${N} = handlers[${N}](req, server);
            if (response${N} instanceof Response) return response${N};
        `)});let B=`
    return async function(req, server) {
      ${$.join(`
`)}
    }
  `;return new Function("executeBunMiddlewares","handlers","runHooks","filterFunctions","onRequestHooks","allMiddlewares",B)(M1,A,E,C,W,V)};export{l0 as buildRequestPipeline,o0 as BunRequestPipline};
