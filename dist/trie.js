class E{constructor(){this.children={},this.isEndOfWord=!1,this.handler=[],this.isDynamic=!1,this.pattern="",this.path="",this.method=[],this.subMiddlewares=new Map}}class F{constructor(){this.root=new E}insert(j,z){let b=this.root;const C=j.split("/").filter(Boolean);if(j==="/"){b.isEndOfWord=!0,b.handler.push(z.handler),b.path=j,b.method.push(z.method);return}for(let q of C){let B=!1,A=q;if(q.startsWith(":"))B=!0,A=":";if(!b.children[A])b.children[A]=new E;b=b.children[A],b.isDynamic=B,b.pattern=q}b.isEndOfWord=!0,b.method.push(z.method),b.handler.push(z.handler),b.path=j}insertMidl(j){if(!this.root.subMiddlewares.has(j))this.root.subMiddlewares.set(j)}search(j,z){let b=this.root;const C=j.split("/").filter(Boolean);for(let B of C){let A=B;if(!b.children[A])if(b.children[":"])b=b.children[":"];else return null;else b=b.children[A]}let q=b.method.indexOf(z);if(q!==-1)return{path:b.path,handler:b.handler[q],isDynamic:b.isDynamic,pattern:b.pattern,method:b.method[q]};return{path:b.path,handler:b.handler,isDynamic:b.isDynamic,pattern:b.pattern,method:b.method[q]}}getAllRoutes(){const j=[],z=(b,C)=>{if(b.isEndOfWord)j.push({path:C,handler:b.handler,isImportant:b.isImportant,isDynamic:b.isDynamic,pattern:b.pattern});for(let q in b.children){const B=b.children[q],A=C+(q===":"?"/:"+B.pattern:"/"+q);z(B,A)}};return z(this.root,""),j}}export{F as default};