/*! chronothermostat-cards v0.1.0 */
var nt=globalThis,ot=nt.ShadowRoot&&(nt.ShadyCSS===void 0||nt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pt=Symbol(),Nt=new WeakMap,B=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==pt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(ot&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Nt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Nt.set(t,e))}return e}toString(){return this.cssText}},zt=i=>new B(typeof i=="string"?i:i+"",void 0,pt),j=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new B(t,i,pt)},Ut=(i,e)=>{if(ot)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),r=nt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},_t=ot?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return zt(t)})(i):i;var{is:Te,defineProperty:ke,getOwnPropertyDescriptor:Pe,getOwnPropertyNames:Oe,getOwnPropertySymbols:Re,getPrototypeOf:De}=Object,E=globalThis,It=E.trustedTypes,He=It?It.emptyScript:"",mt=E.reactiveElementPolyfillSupport,G=(i,e)=>i,ft={toAttribute(i,e){switch(e){case Boolean:i=i?He:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},jt=(i,e)=>!Te(i,e),Wt={attribute:!0,type:String,converter:ft,reflect:!1,useDefault:!1,hasChanged:jt},Ft,Kt;(Ft=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(Kt=E.litPropertyMetadata)!=null||(E.litPropertyMetadata=new WeakMap);var b=class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),((t=this.l)!=null?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Wt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&ke(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){var n;let{get:r,set:o}=(n=Pe(this.prototype,e))!=null?n:{get(){return this[t]},set(d){this[t]=d}};return{get:r,set(d){let a=r==null?void 0:r.call(this);o==null||o.call(this,d),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){var t;return(t=this.elementProperties.get(e))!=null?t:Wt}static _$Ei(){if(this.hasOwnProperty(G("elementProperties")))return;let e=De(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(G("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(G("properties"))){let t=this.properties,s=[...Oe(t),...Re(t)];for(let r of s)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)t.unshift(_t(r))}else e!==void 0&&t.push(_t(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t,s;((t=this._$EO)!=null?t:this._$EO=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){var t;let e=(t=this.shadowRoot)!=null?t:this.attachShadow(this.constructor.shadowRootOptions);return Ut(e,this.constructor.elementStyles),e}connectedCallback(){var e,t;(e=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostConnected)==null?void 0:r.call(s)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var o;let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:ft).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(e,t){var o,n,d;let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let a=s.getPropertyOptions(r),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((o=a.converter)==null?void 0:o.fromAttribute)!==void 0?a.converter:ft;this._$Em=r;let h=l.fromAttribute(t,a.type);this[r]=(d=h!=null?h:(n=this._$Ej)==null?void 0:n.get(r))!=null?d:h,this._$Em=null}}requestUpdate(e,t,s,r=!1,o){var n,d;if(e!==void 0){let a=this.constructor;if(r===!1&&(o=this[e]),s!=null||(s=a.getPropertyOptions(e)),!(((n=s.hasChanged)!=null?n:jt)(o,t)||s.useDefault&&s.reflect&&o===((d=this._$Ej)==null?void 0:d.get(e))&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:o},n){var d,a,l;s&&!((d=this._$Ej)!=null?d:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,(a=n!=null?n:t)!=null?a:this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&((l=this._$Eq)!=null?l:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[n,d]of this._$Ep)this[n]=d;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,d]of o){let{wrapped:a}=d,l=this[n];a!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,d,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(r=this._$EO)==null||r.forEach(o=>{var n;return(n=o.hostUpdate)==null?void 0:n.call(o)}),this.update(t)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}},Bt;b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[G("elementProperties")]=new Map,b[G("finalized")]=new Map,mt==null||mt({ReactiveElement:b}),((Bt=E.reactiveElementVersions)!=null?Bt:E.reactiveElementVersions=[]).push("2.1.2");var q=globalThis,Gt=i=>i,at=q.trustedTypes,Vt=at?at.createPolicy("lit-html",{createHTML:i=>i}):void 0,te="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,ee="?"+C,Le=`<${ee}>`,R=document,Z=()=>R.createComment(""),Y=i=>i===null||typeof i!="object"&&typeof i!="function",St=Array.isArray,Me=i=>St(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",gt=`[ 	
\f\r]`,V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qt=/-->/g,Zt=/>/g,P=RegExp(`>|${gt}(?:([^\\s"'>=/]+)(${gt}*=${gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yt=/'/g,Xt=/"/g,se=/^(?:script|style|textarea|title)$/i,At=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),y=At(1),T=At(2),ns=At(3),D=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Jt=new WeakMap,O=R.createTreeWalker(R,129);function re(i,e){if(!St(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Vt!==void 0?Vt.createHTML(e):e}var Ne=(i,e)=>{let t=i.length-1,s=[],r,o=e===2?"<svg>":e===3?"<math>":"",n=V;for(let d=0;d<t;d++){let a=i[d],l,h,c=-1,u=0;for(;u<a.length&&(n.lastIndex=u,h=n.exec(a),h!==null);)u=n.lastIndex,n===V?h[1]==="!--"?n=qt:h[1]!==void 0?n=Zt:h[2]!==void 0?(se.test(h[2])&&(r=RegExp("</"+h[2],"g")),n=P):h[3]!==void 0&&(n=P):n===P?h[0]===">"?(n=r!=null?r:V,c=-1):h[1]===void 0?c=-2:(c=n.lastIndex-h[2].length,l=h[1],n=h[3]===void 0?P:h[3]==='"'?Xt:Yt):n===Xt||n===Yt?n=P:n===qt||n===Zt?n=V:(n=P,r=void 0);let p=n===P&&i[d+1].startsWith("/>")?" ":"";o+=n===V?a+Le:c>=0?(s.push(l),a.slice(0,c)+te+a.slice(c)+C+p):a+C+(c===-2?d:p)}return[re(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},X=class i{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let o=0,n=0,d=e.length-1,a=this.parts,[l,h]=Ne(e,t);if(this.el=i.createElement(l,s),O.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=O.nextNode())!==null&&a.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith(te)){let u=h[n++],p=r.getAttribute(c).split(C),g=/([.?@])?(.*)/.exec(u);a.push({type:1,index:o,name:g[2],strings:p,ctor:g[1]==="."?$t:g[1]==="?"?bt:g[1]==="@"?wt:N}),r.removeAttribute(c)}else c.startsWith(C)&&(a.push({type:6,index:o}),r.removeAttribute(c));if(se.test(r.tagName)){let c=r.textContent.split(C),u=c.length-1;if(u>0){r.textContent=at?at.emptyScript:"";for(let p=0;p<u;p++)r.append(c[p],Z()),O.nextNode(),a.push({type:2,index:++o});r.append(c[u],Z())}}}else if(r.nodeType===8)if(r.data===ee)a.push({type:2,index:o});else{let c=-1;for(;(c=r.data.indexOf(C,c+1))!==-1;)a.push({type:7,index:o}),c+=C.length-1}o++}}static createElement(e,t){let s=R.createElement("template");return s.innerHTML=e,s}};function M(i,e,t=i,s){var n,d,a;if(e===D)return e;let r=s!==void 0?(n=t._$Co)==null?void 0:n[s]:t._$Cl,o=Y(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((d=r==null?void 0:r._$AO)==null||d.call(r,!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,t,s)),s!==void 0?((a=t._$Co)!=null?a:t._$Co=[])[s]=r:t._$Cl=r),r!==void 0&&(e=M(i,r._$AS(i,e.values),r,s)),e}var vt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var l;let{el:{content:t},parts:s}=this._$AD,r=((l=e==null?void 0:e.creationScope)!=null?l:R).importNode(t,!0);O.currentNode=r;let o=O.nextNode(),n=0,d=0,a=s[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new J(o,o.nextSibling,this,e):a.type===1?h=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(h=new xt(o,this,e)),this._$AV.push(h),a=s[++d]}n!==(a==null?void 0:a.index)&&(o=O.nextNode(),n++)}return O.currentNode=R,r}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},J=class i{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,s,r){var o;this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=(o=r==null?void 0:r.isConnected)!=null?o:!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=M(this,e,t),Y(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==D&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Me(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&Y(this._$AH)?this._$AA.nextSibling.data=e:this.T(R.createTextNode(e)),this._$AH=e}$(e){var o;let{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=X.createElement(re(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(t);else{let n=new vt(r,this),d=n.u(this.options);n.p(t),this.T(d),this._$AH=n}}_$AC(e){let t=Jt.get(e.strings);return t===void 0&&Jt.set(e.strings,t=new X(e)),t}k(e){St(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,r=0;for(let o of e)r===t.length?t.push(s=new i(this.O(Z()),this.O(Z()),this,this.options)):s=t[r],s._$AI(o),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){let r=Gt(e).nextSibling;Gt(e).remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},N=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(e,t=this,s,r){let o=this.strings,n=!1;if(o===void 0)e=M(this,e,t,0),n=!Y(e)||e!==this._$AH&&e!==D,n&&(this._$AH=e);else{let d=e,a,l;for(e=o[0],a=0;a<o.length-1;a++)l=M(this,d[s+a],t,a),l===D&&(l=this._$AH[a]),n||(n=!Y(l)||l!==this._$AH[a]),l===_?e=_:e!==_&&(e+=(l!=null?l:"")+o[a+1]),this._$AH[a]=l}n&&!r&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}},$t=class extends N{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}},bt=class extends N{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}},wt=class extends N{constructor(e,t,s,r,o){super(e,t,s,r,o),this.type=5}_$AI(e,t=this){var n;if((e=(n=M(this,e,t,0))!=null?n:_)===D)return;let s=this._$AH,r=e===_&&s!==_||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==_&&(s===_||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;typeof this._$AH=="function"?this._$AH.call((s=(t=this.options)==null?void 0:t.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}},xt=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){M(this,e)}};var yt=q.litHtmlPolyfillSupport,Qt;yt==null||yt(X,J),((Qt=q.litHtmlVersions)!=null?Qt:q.litHtmlVersions=[]).push("3.3.3");var ie=(i,e,t)=>{var o,n;let s=(o=t==null?void 0:t.renderBefore)!=null?o:e,r=s._$litPart$;if(r===void 0){let d=(n=t==null?void 0:t.renderBefore)!=null?n:null;s._$litPart$=r=new J(e.insertBefore(Z(),d),d,void 0,t!=null?t:{})}return r._$AI(i),r};var H=globalThis,v=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,s;let e=super.createRenderRoot();return(s=(t=this.renderOptions).renderBefore)!=null||(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ie(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return D}},ne;v._$litElement$=!0,v.finalized=!0,(ne=H.litElementHydrateSupport)==null||ne.call(H,{LitElement:v});var Et=H.litElementPolyfillSupport;Et==null||Et({LitElement:v});var oe;((oe=H.litElementVersions)!=null?oe:H.litElementVersions=[]).push("4.2.2");var Ct="chronothermostat";function ae(i){return i.callWS({type:`${Ct}/info`})}function Tt(i,e,t){return i.callWS({type:`${Ct}/get_program`,zone:e,program:t})}function de(i,e,t,s,r){return i.callService(Ct,"set_program",{zone:e,program:t,weekday:s,values:r})}function dt(i,e,t){if(i.length===0)return[e,t];let s=Math.max(e,Math.floor(Math.min(...i))-1),r=Math.min(t,Math.ceil(Math.max(...i))+1);return r-s<5&&(r=Math.min(t,s+5),s=Math.max(e,r-5)),[s,r]}function Q(i,e){let{width:t,height:s,min:r,max:o,padLeft:n,padBottom:d}=e,a=t-n,l=s-d,h=o-r||1,c=f=>l*(1-(Math.min(o,Math.max(r,f))-r)/h),u=a/96,p=i.map((f,rt)=>{let it=c(f);return{x:n+rt*u,y:it,w:u,h:l-it}}),g=h<=6?1:h<=12?2:5,A=[];for(let f=Math.ceil(r/g)*g;f<=o;f+=g)A.push({y:c(f),label:String(f)});let st=[0,6,12,18,24].map(f=>({x:n+a*f/24,label:String(f)}));return{bars:p,yTicks:A,xTicks:st}}function ce(i,e){let t=Math.floor((i-e.padLeft)/(e.width-e.padLeft)*96);return Math.min(95,Math.max(0,t))}var le=(i,e,t)=>Math.min(t,Math.max(e,i));function kt(i,e){return{...i,cursor:le(Math.round(e),0,95)}}function Pt(i,e){return kt(i,i.cursor+e)}function Ot(i,e){let t=le(Math.round((i.values[i.cursor]+e)/.5)*.5,i.min,i.max),s=i.values.slice();return s[i.cursor]=t,{...i,values:s}}function he(i){if(i.cursor>=95)return i;let e=i.values.slice();return e[i.cursor+1]=e[i.cursor],{...i,values:e,cursor:i.cursor+1}}function Rt(i,e){return{...i,values:e.slice()}}function z(i){return i.values.length!==i.saved.length||i.values.some((e,t)=>e!==i.saved[t])}var tt=["mon","tue","wed","thu","fri","sat","sun"],ze={it:{mon:["luned\xEC","Lun"],tue:["marted\xEC","Mar"],wed:["mercoled\xEC","Mer"],thu:["gioved\xEC","Gio"],fri:["venerd\xEC","Ven"],sat:["sabato","Sab"],sun:["domenica","Dom"]},en:{mon:["Monday","Mon"],tue:["Tuesday","Tue"],wed:["Wednesday","Wed"],thu:["Thursday","Thu"],fri:["Friday","Fri"],sat:["Saturday","Sat"],sun:["Sunday","Sun"]}};function w(i,e,t=!1){return ze[e][i][t?1:0]}function L(i){return tt[(i.getDay()+6)%7]}var ct=i=>i<10?`0${i}`:String(i);function x(i,e){let t=i.toFixed(1);return`${e==="it"?t.replace(".",","):t} \xB0C`}function ue(i){return`${ct(Math.floor(i/4))}:${ct(i%4*15)}`}var Dt=i=>`${ct(i.getHours())}:${ct(i.getMinutes())}`;function pe(i,e,t){let s=Dt(i),r=a=>new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime(),o=new Date(e.getFullYear(),e.getMonth(),e.getDate()+1).getTime(),n=r(i);if(n<=r(e))return t==="it"?`fino alle ${s}`:`until ${s}`;if(n===o)return t==="it"?`fino a domani alle ${s}`:`until tomorrow at ${s}`;let d=w(L(i),t);return t==="it"?`fino a ${d} alle ${s}`:`until ${d} at ${s}`}function _e(i,e){let t=w(L(i),e);return e==="it"?`${t} ${i.getDate()} alle ${Dt(i)}`:`${t} ${i.getDate()} at ${Dt(i)}`}function me(i,e,t={delay:450,interval:110}){let s,r=()=>{s!==void 0&&clearTimeout(s),s=void 0},o=()=>{e(),s=setTimeout(o,t.interval)},n=a=>{a.preventDefault(),r(),e(),s=setTimeout(o,t.delay)},d=a=>a.preventDefault();return i.addEventListener("pointerdown",n),i.addEventListener("pointerup",r),i.addEventListener("pointerleave",r),i.addEventListener("pointercancel",r),i.addEventListener("contextmenu",d),()=>{r(),i.removeEventListener("pointerdown",n),i.removeEventListener("pointerup",r),i.removeEventListener("pointerleave",r),i.removeEventListener("pointercancel",r),i.removeEventListener("contextmenu",d)}}var Ue={none:"No changes",unsaved:"Unsaved changes",saved_day:"{day} program saved",editing:"Editing:",work:"Work",holiday:"Holiday",away:"Away",off:"Off",continue:"Continue",save:"Save",copy_from:"Copy from\u2026",copy_from_hint:"Copy the saved program of:",discard:"Discard",confirm:"Confirm",cancel:"Cancel",today:"Today",today_day:"Today, {day}",prev_slot:"Previous quarter hour",next_slot:"Next quarter hour",temp_down:"Lower temperature",temp_up:"Raise temperature",return_date:"Return date",return_time:"Return time",error_load:"Could not load the data.",error_save:"Could not save.",house_scenario:"House scenario",return_required:"Set the return day and time",house_work:"The house follows the Work program.",house_holiday:"The house follows the Holiday program.",house_away:"Heating off until {when}, then it switches to Work by itself.",house_away_no_return:"Away with no return: stays off until you set a return.",house_off:"Heating off until you pick another scenario.",status_schedule:"Schedule: {temp} {until}, then {next}.",status_schedule_flat:"Schedule: {temp}.",status_forced:"Forced to {temp} {until}, then back to the schedule ({next}).",status_forced_flat:"Forced to {temp}.",status_zone_off:"Switched off by you. The schedule resumes when you turn it back on.",status_away:"Away: off until {when}, then Work.",status_away_no_return:"Away with no return: stays off until you set a return.",status_off:"Heating off.",status_zone_on_manual:"Turned on by hand with the heating off: stays at {temp} until you turn it off or change scenario.",status_unavailable:"Thermostat unavailable.",config_entity:"Thermostat",config_name:"Name (optional)"},Ie={none:"Nessuna modifica",unsaved:"Modifiche non salvate",saved_day:"Programma di {day} salvato",editing:"Stai modificando:",work:"Lavoro",holiday:"Ferie",away:"Fuori casa",off:"Spento",continue:"Prosegui",save:"Salva",copy_from:"Copia da\u2026",copy_from_hint:"Copia il programma salvato di:",discard:"Scarta",confirm:"Conferma",cancel:"Annulla",today:"Oggi",today_day:"Oggi, {day}",prev_slot:"Quarto d'ora precedente",next_slot:"Quarto d'ora successivo",temp_down:"Abbassa la temperatura",temp_up:"Alza la temperatura",return_date:"Giorno di rientro",return_time:"Ora di rientro",error_load:"Impossibile caricare i dati.",error_save:"Salvataggio non riuscito.",house_scenario:"Scenario della casa",return_required:"Indica giorno e ora del rientro",house_work:"La casa segue il programma Lavoro.",house_holiday:"La casa segue il programma Ferie.",house_away:"Impianto spento fino a {when}, poi passa da solo a Lavoro.",house_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",house_off:"Impianto spento finch\xE9 non scegli un altro scenario.",status_schedule:"Programma: {temp} {until}, poi {next}.",status_schedule_flat:"Programma: {temp}.",status_forced:"Forzato a {temp} {until}, poi torna al programma ({next}).",status_forced_flat:"Forzato a {temp}.",status_zone_off:"Spento da te. Il programma riparte quando lo riaccendi.",status_away:"Fuori casa: spento fino a {when}, poi Lavoro.",status_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",status_off:"Impianto spento.",status_zone_on_manual:"Acceso a mano con impianto spento: resta a {temp} finch\xE9 non lo spegni o cambi scenario.",status_unavailable:"Termostato non disponibile.",config_entity:"Termostato",config_name:"Nome (facoltativo)"},fe={en:Ue,it:Ie};function k(i){var t,s,r;return((r=(s=(t=i==null?void 0:i.locale)==null?void 0:t.language)!=null?s:i==null?void 0:i.language)!=null?r:"").toLowerCase().startsWith("it")?"it":"en"}function m(i,e,t){var r,o,n;let s=(n=(o=(r=fe[i])==null?void 0:r[e])!=null?o:fe.en[e])!=null?n:e;return t?s.replace(/\{(\w+)\}/g,(d,a)=>a in t?String(t[a]):d):s}var U="chronothermostat-zone-card-editor",We=[{name:"entity",selector:{entity:{domain:"climate"}}},{name:"name",selector:{text:{}}}],lt=class extends v{constructor(){super(...arguments);this._label=t=>m(k(this.hass),t.name==="entity"?"config_entity":"config_name")}setConfig(t){this._config=t}render(){return!this.hass||!this._config?_:y`<ha-form .hass=${this.hass} .data=${this._config} .schema=${We}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`}_changed(t){t.stopPropagation();let s={...t.detail.value};s.name||delete s.name,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}};lt.properties={hass:{attribute:!1},_config:{state:!0}};customElements.get(U)||customElements.define(U,lt);var Ht="chronothermostat-editor-card",Fe=["work","holiday"],Ke=["prev","next","cont","minus","plus"],ge=.5,Be=3e3,je=3e4,ye=150,ve=8,ht=26,$e=22,Ge=452,be=i=>i.charAt(0).toUpperCase()+i.slice(1),Ve=i=>i.getHours()*4+Math.floor(i.getMinutes()/15),S=i=>Math.round(i*100)/100,we=i=>tt.every(e=>{var t;return Array.isArray((t=i.weekdays)==null?void 0:t[e])&&i.weekdays[e].length===96}),qe=y`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M3 12h13M11 6l6 6-6 6M21 5v14" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`,I=class extends v{constructor(){super();this._lastLoadAttempt=0;this._loadToken=0;this._holds=new Map;this._observedChart=null;this._program="work",this._day=L(new Date),this._loadFailed=!1,this._copyOpen=!1,this._saving=!1,this._loading=!1,this._chartWidth=Ge}static getConfigElement(){return document.createElement(U)}static getStubConfig(t){var r;let s=Object.keys((r=t==null?void 0:t.states)!=null?r:{}).find(o=>o.startsWith("climate."));return{entity:s!=null?s:""}}setConfig(t){if(!t||typeof t.entity!="string"||t.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==t.entity&&this._reset(),this._config={...t}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this._holds.forEach(t=>t.detach()),this._holds.clear(),this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=null,this._clearSaved()}shouldUpdate(t){if(t.size===1&&t.has("hass")){let s=t.get("hass");return!s||k(s)!==k(this.hass)||this._needsLoad()}return!0}willUpdate(){this._needsLoad()&&this._load()}updated(){this.isConnected&&(this._syncHolds(),this._observeChart())}render(){if(!this._config)return _;let t=k(this.hass);if(this._loadFailed)return y`<ha-card><div class="load-error error">${m(t,"error_load")}</div></ha-card>`;let s=this._state;if(!s)return y`<ha-card></ha-card>`;let[r,o]=this._status(t,s);return y`<ha-card>
      <div class="row">
        <span class="label">${m(t,"editing")}</span>
        ${Fe.map(n=>y`<button class="chip program ${n===this._program?"on":""}"
          data-program=${n} aria-pressed=${n===this._program?"true":"false"}
          @click=${()=>this._select({program:n,day:this._day})}>${m(t,n)}</button>`)}
      </div>
      <div class="row days">
        ${tt.map(n=>y`<button class="chip day ${n===this._day?"on":""}"
          data-day=${n} aria-pressed=${n===this._day?"true":"false"}
          @click=${()=>this._select({program:this._program,day:n})}>
          ${w(n,t,!0)}
        </button>`)}
      </div>
      ${this._pending&&z(s)?this._renderDirtyBar(t):_}
      <div class="reading ${this._loading?"loading":""}">
        <span><span class="day-name">${be(w(this._day,t))}</span><span
          class="time">${ue(s.cursor)}</span></span>
        <span class="temp">${x(s.values[s.cursor],t)}</span>
      </div>
      ${this._renderChart(s)}
      <div class="controls">
        <button class="big hold" id="prev" ?disabled=${this._loading} aria-label=${m(t,"prev_slot")}>
          <span class="glyph" aria-hidden="true">‹</span>
        </button>
        <button class="big hold" id="next" ?disabled=${this._loading} aria-label=${m(t,"next_slot")}>
          <span class="glyph" aria-hidden="true">›</span>
        </button>
        <button class="big hold wide" id="cont" ?disabled=${this._loading}>
          ${qe}<span>${m(t,"continue")}</span>
        </button>
        <button class="big hold" id="minus" ?disabled=${this._loading} aria-label=${m(t,"temp_down")}>
          <span class="glyph" aria-hidden="true">−</span>
        </button>
        <button class="big hold" id="plus" ?disabled=${this._loading} aria-label=${m(t,"temp_up")}>
          <span class="glyph" aria-hidden="true">+</span>
        </button>
        <button class="big" id="copy" ?disabled=${this._loading}
          aria-expanded=${this._copyOpen?"true":"false"}
          @click=${this._toggleCopy}>${m(t,"copy_from")}</button>
        <button class="big save" id="save" ?disabled=${this._saving||this._loading}
          @click=${this._saveAndContinue}>
          ${m(t,"save")}
        </button>
      </div>
      <div class="footer">
        <span class="name">${this._zoneName()}</span>
        <span class="status ${o}">${r}</span>
      </div>
      ${this._copyOpen?this._renderCopyPanel(t):_}
    </ha-card>`}_renderDirtyBar(t){return y`<div class="dirty-bar">
      <span class="message">${m(t,"unsaved")}</span>
      <button class="big" id="bar-discard" @click=${this._discardPending}>${m(t,"discard")}</button>
      <button class="big save" id="bar-save" ?disabled=${this._saving}
        @click=${this._saveAndContinue}>
        ${m(t,"save")}
      </button>
    </div>`}_renderChart(t){let s=this._chartWidth,r=ye-ve,[o,n]=dt(t.values,t.min,t.max),d=Q(t.values,{width:s,height:r,min:o,max:n,padLeft:ht,padBottom:$e}),a=r-$e,l=d.bars[t.cursor],h=S(l.x+l.w/2),c=d.xTicks.length-1;return y`<div class="chart ${this._loading?"loading":""}">
      <svg viewBox="0 0 ${s} ${ye}" @pointerdown=${this._onChartDown}>
        <g transform="translate(0 ${ve})">
          ${d.yTicks.map(u=>T`
            <line class="grid" x1=${ht} x2=${s}
              y1=${S(u.y)} y2=${S(u.y)}></line>
            <text class="axis" x=${ht-5} y=${S(u.y)} dy="0.35em"
              text-anchor="end">${u.label}</text>`)}
          ${d.bars.map((u,p)=>T`<rect class="bar ${p===t.cursor?"cursor":""}"
            x=${S(u.x)} y=${S(u.y)} width=${S(Math.max(0,u.w-.6))}
            height=${S(u.h)}></rect>`)}
          <line class="cursor-line" x1=${h} x2=${h} y1="0" y2=${a+4}></line>
          ${d.xTicks.map((u,p)=>T`<text class="axis" x=${S(u.x)} y=${a+18}
            text-anchor=${p===0?"start":p===c?"end":"middle"}>${u.label}</text>`)}
        </g>
      </svg>
    </div>`}_renderCopyPanel(t){return y`<div class="copy-panel">
      <div class="hint">${m(t,"copy_from_hint")}</div>
      <div class="copy-days">
        ${tt.filter(s=>s!==this._day).map(s=>y`<button class="chip" data-day=${s} @click=${()=>this._copyFrom(s)}>
            ${be(w(s,t))}
          </button>`)}
      </div>
    </div>`}_status(t,s){return this._failure?[m(t,this._failure),"error"]:z(s)?[m(t,"unsaved"),"warning"]:this._savedDay?[m(t,"saved_day",{day:w(this._savedDay,t)}),"success"]:[m(t,"none"),""]}_zoneName(){let t=this._config;if(!t)return"";if(t.name)return t.name;let r=(this._info?this._info.zones:[]).find(o=>o.entity_id===t.entity);return r?r.name:""}_needsLoad(){return!this.hass||!this._config?!1:this._loadedFor!==this._config.entity?!0:this._loadFailed&&Date.now()-this._lastLoadAttempt>=je}_reset(){this._loadToken++,this._loadedFor=void 0,this._shown=void 0,this._data=void 0,this._state=void 0,this._loading=!1,this._loadFailed=!1,this._failure=void 0,this._pending=void 0,this._copyOpen=!1,this._clearSaved()}async _load(){let t=this.hass,s=this._config;if(!t||!s)return;let r=s.entity;this._loadedFor=r,this._lastLoadAttempt=Date.now();let o;try{if(this._info||(this._info=await ae(t)),this._loadedFor!==r)return;if(!this._info.zones.some(l=>l.entity_id===r))throw new Error(`${r} is not a chronothermostat zone`);let d=this._info.scenario_entity_id,a=d?t.states[d]:void 0;o=a&&a.state==="holiday"?"holiday":"work"}catch{this._loadedFor===r&&this._firstLoadFailed();return}let n=new Date;await this._switchTo({program:o,day:L(n)},Ve(n))}_firstLoadFailed(){this._info=void 0,this._loadFailed=!0}_select(t){if(t.program===this._program&&t.day===this._day){this._pending=void 0;return}if(this._state&&z(this._state)){this._pending=t;return}this._switchTo(t)}async _switchTo(t,s){let r=this.hass,o=this._config;if(!r||!o)return;let n=++this._loadToken;this._pending=void 0,this._copyOpen=!1,this._program=t.program,this._day=t.day,this._loading=!0;try{let d=await Tt(r,o.entity,t.program);if(n!==this._loadToken)return;if(!we(d))throw new Error("Invalid program data");let a=s!==void 0?s:this._state?this._state.cursor:0;this._showDay(d,t,a)}catch{if(n!==this._loadToken)return;this._state&&this._shown?(this._program=this._shown.program,this._day=this._shown.day,this._failure="error_load"):this._firstLoadFailed()}finally{n===this._loadToken&&(this._loading=!1)}}_showDay(t,s,r){let o=t.weekdays[s.day];this._data=t,this._shown=s,this._loadFailed=!1,this._failure=void 0,this._state={values:o.slice(),saved:o.slice(),cursor:r,min:t.min_temp,max:t.max_temp}}_discardPending(){let t=this._pending;!t||!this._state||(this._state=Rt(this._state,this._state.saved),this._switchTo(t))}_hold(t){let s=this._state;!s||this._loading||(t==="prev"?this._state=Pt(s,-1):t==="next"?this._state=Pt(s,1):t==="cont"?this._edit(he(s)):t==="minus"?this._edit(Ot(s,-ge)):this._edit(Ot(s,ge)))}_edit(t){this._state=t,this._failure=void 0,this._clearSaved(),this._pending&&!z(t)&&(this._pending=void 0)}_onChartDown(t){let s=this._state,r=t.currentTarget.getBoundingClientRect();if(!s||this._loading||r.width<=0)return;let o=(t.clientX-r.left)/r.width*this._chartWidth,n=ce(o,{width:this._chartWidth,padLeft:ht});this._state=kt(s,n)}_toggleCopy(){this._loading||(this._copyOpen=!this._copyOpen)}_copyFrom(t){this._copyOpen=!1,!(!this._state||!this._data||this._loading)&&this._edit(Rt(this._state,this._data.weekdays[t]))}async _saveAndContinue(){if(!await this._save())return;let t=this._pending;t&&this._state&&!z(this._state)&&await this._switchTo(t)}async _save(){let t=this.hass,s=this._config,r=this._state,o=this._shown;if(!t||!s||!r||!o||this._saving||this._loading)return!1;let n=r.values.slice(),d=this._loadToken;this._saving=!0;try{await de(t,s.entity,o.program,o.day,n);let a=await Tt(t,s.entity,o.program);return d===this._loadToken&&this._state&&(we(a)&&(this._data=a),this._state={...this._state,saved:n}),this._failure=void 0,this._flashSaved(o.day),!0}catch{return this._failure="error_save",!1}finally{this._saving=!1}}_flashSaved(t){this._clearSaved(),this._savedDay=t,this._savedTimer=setTimeout(()=>{this._savedTimer=void 0,this._savedDay=void 0},Be)}_clearSaved(){this._savedTimer!==void 0&&clearTimeout(this._savedTimer),this._savedTimer=void 0,this._savedDay=void 0}_syncHolds(){for(let t of Ke){let s=this.renderRoot.querySelector(`#${t}`),r=this._holds.get(t);r&&r.el===s||(r&&r.detach(),this._holds.delete(t),s&&this._holds.set(t,{el:s,detach:me(s,()=>this._hold(t))}))}}_observeChart(){let t=this.renderRoot.querySelector(".chart");t!==this._observedChart&&(this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=t,!(!t||typeof ResizeObserver=="undefined")&&(this._resizeObserver||(this._resizeObserver=new ResizeObserver(s=>{let r=Math.round(s[0].contentRect.width);r>0&&(this._chartWidth=r)})),this._resizeObserver.observe(t)))}};I.properties={hass:{attribute:!1},_config:{state:!0},_program:{state:!0},_day:{state:!0},_state:{state:!0},_loadFailed:{state:!0},_failure:{state:!0},_savedDay:{state:!0},_pending:{state:!0},_copyOpen:{state:!0},_saving:{state:!0},_loading:{state:!0},_chartWidth:{state:!0}},I.styles=j`
    :host {
      display: block;
    }
    ha-card {
      display: block;
      padding: 8px 10px;
      box-sizing: border-box;
      font-size: 15px;
      line-height: 20px;
      color: var(--primary-text-color);
    }
    button {
      font: inherit;
      color: inherit;
      background: none;
      margin: 0;
      padding: 0 6px;
      min-width: 0;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      border-radius: 8px;
      cursor: pointer;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
    }
    button[disabled] {
      opacity: 0.6;
      cursor: default;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .days {
      gap: 4px;
      margin-top: 8px;
    }
    .label {
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .chip {
      flex: 1 1 0;
      min-height: 48px;
    }
    .days .chip {
      padding: 0;
    }
    .chip.on {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
      border-color: var(--primary-color);
      color: var(--primary-color);
      font-weight: 500;
    }
    .reading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      margin-top: 8px;
      /* 28 px strut so the 15 px day name does not grow the 34 px line box */
      font-size: 28px;
      font-weight: 500;
      line-height: 34px;
      white-space: nowrap;
    }
    .day-name {
      font-size: 15px;
      font-weight: normal;
      line-height: 20px;
      color: var(--secondary-text-color);
    }
    .time {
      margin-left: 8px;
    }
    .temp {
      color: var(--chronothermostat-cursor-color, #d85a30);
    }
    .chart {
      margin-top: 4px;
    }
    .loading {
      opacity: 0.5;
    }
    .chart svg {
      display: block;
      width: 100%;
      height: 150px;
    }
    .grid {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.4));
      stroke-width: 1;
    }
    .axis {
      fill: var(--secondary-text-color);
      font-size: 15px;
    }
    .bar {
      fill: var(--chronothermostat-bar-color, #1d9e75);
    }
    .bar.cursor {
      fill: var(--chronothermostat-cursor-color, #d85a30);
    }
    .cursor-line {
      stroke: var(--chronothermostat-cursor-color, #d85a30);
      stroke-width: 1;
      stroke-dasharray: 3 3;
    }
    .controls {
      display: grid;
      grid-template-columns: minmax(48px, 1fr) minmax(48px, 1fr) 1.8fr 1.8fr;
      gap: 8px;
      margin-top: 8px;
    }
    .big {
      min-height: 56px;
      font-size: 17px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .hold {
      touch-action: none;
      -webkit-touch-callout: none;
    }
    .wide {
      grid-column: span 2;
    }
    .glyph {
      font-size: 28px;
      line-height: 1;
    }
    .icon {
      width: 22px;
      height: 22px;
      flex: none;
    }
    .save {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
      font-weight: 500;
    }
    .footer {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      min-height: 20px;
    }
    .name {
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--secondary-text-color);
    }
    .status {
      flex: none;
      margin-left: auto;
      white-space: nowrap;
      color: var(--secondary-text-color);
    }
    .warning {
      color: var(--warning-color, #ffa600);
    }
    .success {
      color: var(--success-color, #43a047);
    }
    .error {
      color: var(--error-color, #db4437);
    }
    .load-error {
      padding: 8px 0;
    }
    .dirty-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding: 8px;
      border: 1px solid var(--warning-color, #ffa600);
      border-radius: 8px;
    }
    .dirty-bar .message {
      flex: 1 1 140px;
      color: var(--warning-color, #ffa600);
    }
    .dirty-bar .big {
      flex: 1 1 80px;
    }
    .copy-panel {
      margin-top: 8px;
      padding: 8px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      border-radius: 8px;
    }
    .hint {
      color: var(--secondary-text-color);
      margin-bottom: 6px;
    }
    .copy-days {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
    }
  `;var Lt="chronothermostat-viewer-card",Ze="chronothermostat",Ye=6e4,ut=480,et=100,Xe=5,Je=35,Qe=new Set(["away","away_no_return","off","zone_on_manual"]),xe=i=>i<10?`0${i}`:String(i),ts=i=>i.charAt(0).toUpperCase()+i.slice(1),$=i=>Math.round(i*100)/100,Se=i=>i.getHours()*4+Math.floor(i.getMinutes()/15),F=i=>typeof i=="number"&&Number.isFinite(i),Ae=i=>new Date(i.getFullYear(),i.getMonth(),i.getDate()).getTime(),K=class extends v{constructor(){super(),this._now=new Date}static getConfigElement(){return document.createElement(U)}static getStubConfig(e){var s;let t=Object.keys((s=e==null?void 0:e.states)!=null?s:{}).find(r=>r.startsWith("climate."));return{entity:t!=null?t:""}}setConfig(e){if(!e||typeof e.entity!="string"||e.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==e.entity&&(this._sensorId=void 0),this._config={...e}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this._now=new Date,this._timer=setInterval(()=>{this._now=new Date},Ye)}disconnectedCallback(){super.disconnectedCallback(),this._timer!==void 0&&clearInterval(this._timer),this._timer=void 0}shouldUpdate(e){let t=this._current(),s=this._seen,r=!!s&&s.sensor===t.sensor&&s.climate===t.climate&&s.lang===t.lang;return this._seen=t,e.size===1&&e.has("hass")?!r:!0}_resolveSensor(){var d,a,l,h,c;let e=(a=(d=this.hass)==null?void 0:d.states)!=null?a:{},t=(l=this._config)==null?void 0:l.entity,s=this._sensorId?e[this._sensorId]:void 0;if(s&&((h=s.attributes)==null?void 0:h.zone)===t)return s;let r=Object.keys(e).filter(u=>{var p,g;return u.startsWith("sensor.")&&((g=(p=e[u])==null?void 0:p.attributes)==null?void 0:g.zone)===t}),o=(c=this.hass)==null?void 0:c.entities,n=o&&r.find(u=>{var p;return((p=o[u])==null?void 0:p.platform)===Ze})||r[0];return this._sensorId=n,n?e[n]:void 0}_current(){var e,t;return{sensor:this._resolveSensor(),climate:this._config?(t=(e=this.hass)==null?void 0:e.states)==null?void 0:t[this._config.entity]:void 0,lang:k(this.hass)}}render(){var A;let{sensor:e,climate:t,lang:s}=this._current(),r=!e||e.state==="unavailable"||e.state==="unknown"?"unavailable":e.state,o=(A=e==null?void 0:e.attributes)!=null?A:{},n=Array.isArray(o.today)?o.today:[],d=!!e&&!Qe.has(r)&&r!=="unavailable"&&n.length===96&&n.every(F),a=this._now,l=w(L(a),s),h=o.program==="work"||o.program==="holiday"?o.program:void 0,c=h?`${m(s,"today_day",{day:l})} \xB7 ${m(s,h)}`:ts(l),u=`${xe(a.getHours())}:${xe(a.getMinutes())}`,[p,g]=this._sentence(r,o,t,s);return y`<ha-card>
      <div class="header">
        <span class="title">${c}</span><span class="clock">${u}</span>
      </div>
      ${d?this._chart(r,n,o,t):_}
      <div class="sentence" style=${g}>${p}</div>
    </ha-card>`}_sentence(e,t,s,r){var u;let o=(u=s==null?void 0:s.attributes)==null?void 0:u.temperature,n=this._now,d=typeof t.next_step_at=="string"?new Date(t.next_step_at):void 0,a=!!d&&!isNaN(d.getTime())&&F(t.next_step_target),l=a?pe(d,n,r):"",h=a?x(t.next_step_target,r):"",c=(p,g)=>[m(r,p,g),""];switch(e){case"schedule":return F(t.program_target)?a?c("status_schedule",{temp:x(t.program_target,r),until:l,next:h}):c("status_schedule_flat",{temp:x(t.program_target,r)}):c("status_unavailable");case"forced":return F(o)?a?c("status_forced",{temp:x(o,r),until:l,next:h}):c("status_forced_flat",{temp:x(o,r)}):c("status_unavailable");case"zone_off":return[m(r,"status_zone_off"),"color: var(--error-color)"];case"zone_on_manual":return F(o)?c("status_zone_on_manual",{temp:x(o,r)}):c("status_unavailable");case"away":{let p=typeof t.return_at=="string"?new Date(t.return_at):void 0;return!p||isNaN(p.getTime())?c("status_away_no_return"):c("status_away",{when:_e(p,r)})}case"away_no_return":return c("status_away_no_return");case"off":return c("status_off");default:return c("status_unavailable")}}_chart(e,t,s,r){var st;let o=this._now,n=Se(o),d=(st=r==null?void 0:r.attributes)==null?void 0:st.temperature,a=e==="forced"&&F(d),[l,h]=dt(a?[...t,d]:t,Xe,Je),c={width:ut,height:et,min:l,max:h,padLeft:0,padBottom:0},u=Q(t,c),p=ut/96,g=_;if(a){let f=typeof s.next_step_at=="string"?new Date(s.next_step_at):void 0,it=f&&!isNaN(f.getTime())&&Ae(f)<=Ae(o)?Math.min(96,Math.max(n,Se(f))):96,Mt=Q([d],c).bars[0].y;g=T`<rect class="band" x=${$(n*p)} y=${$(Mt)}
        width=${$((it-n)*p)} height=${$(et-Mt)}></rect>`}let A=(o.getHours()*60+o.getMinutes())/1440*ut;return y`<div class="chart">
      <svg viewBox="0 0 ${ut} ${et}" preserveAspectRatio="none" aria-hidden="true">
        ${[6,12,18].map(f=>T`<line class="grid" x1=${f*20} x2=${f*20}
          y1="0" y2=${et}></line>`)}
        ${u.bars.map((f,rt)=>T`<rect class="bar ${rt<n?"past":""}"
          x=${$(f.x)} y=${$(f.y)} width=${$(f.w)}
          height=${$(f.h)}></rect>`)}
        ${g}
        <line class="now" x1=${$(A)} x2=${$(A)} y1="0" y2=${et}></line>
      </svg>
    </div>`}};K.properties={hass:{attribute:!1},_config:{state:!0},_now:{state:!0}},K.styles=j`
    :host {
      display: block;
    }
    ha-card {
      display: block;
      padding: 8px 10px;
      box-sizing: border-box;
      font-size: 15px;
      line-height: 20px;
      color: var(--primary-text-color);
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      color: var(--secondary-text-color);
    }
    .clock {
      white-space: nowrap;
    }
    .chart {
      margin: 6px 0;
      height: 100px;
    }
    .chart svg {
      display: block;
      width: 100%;
      height: 100px;
    }
    .grid {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.4));
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
    }
    .bar {
      fill: var(--chronothermostat-bar-color, #1d9e75);
    }
    .bar.past {
      opacity: 0.4;
    }
    .band {
      fill: var(--chronothermostat-cursor-color, #d85a30);
      opacity: 0.55;
    }
    .now {
      stroke: var(--primary-text-color);
      stroke-width: 2;
      vector-effect: non-scaling-stroke;
    }
    .sentence {
      margin-top: 6px;
      overflow-wrap: anywhere;
    }
  `;function Ee(i,e){customElements.get(i)||customElements.define(i,e)}function Ce(i){window.customCards=window.customCards||[],window.customCards.some(e=>e.type===i.type)||window.customCards.push(i)}Ee(Ht,I);Ce({type:Ht,name:"Chronothermostat editor",preview:!1});Ee(Lt,K);Ce({type:Lt,name:"Chronothermostat viewer",preview:!1});
