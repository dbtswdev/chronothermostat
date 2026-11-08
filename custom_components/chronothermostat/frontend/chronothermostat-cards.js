/*! chronothermostat-cards v0.1.0 */
var at=globalThis,dt=at.ShadowRoot&&(at.ShadyCSS===void 0||at.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$t=Symbol(),Yt=new WeakMap,V=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==$t)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(dt&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=Yt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Yt.set(t,e))}return e}toString(){return this.cssText}},Xt=i=>new V(typeof i=="string"?i:i+"",void 0,$t),D=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((r,s,o)=>r+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[o+1],i[0]);return new V(t,i,$t)},Qt=(i,e)=>{if(dt)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),s=at.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,i.appendChild(r)}},xt=dt?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return Xt(t)})(i):i;var{is:Ue,defineProperty:We,getOwnPropertyDescriptor:Ke,getOwnPropertyNames:Be,getOwnPropertySymbols:Ge,getPrototypeOf:je}=Object,T=globalThis,Jt=T.trustedTypes,Ve=Jt?Jt.emptyScript:"",wt=T.reactiveElementPolyfillSupport,q=(i,e)=>i,St={toAttribute(i,e){switch(e){case Boolean:i=i?Ve:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},ie=(i,e)=>!Ue(i,e),te={attribute:!0,type:String,converter:St,reflect:!1,useDefault:!1,hasChanged:ie},ee,re;(ee=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(re=T.litPropertyMetadata)!=null||(T.litPropertyMetadata=new WeakMap);var x=class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),((t=this.l)!=null?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=te){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&We(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){var n;let{get:s,set:o}=(n=Ke(this.prototype,e))!=null?n:{get(){return this[t]},set(d){this[t]=d}};return{get:s,set(d){let a=s==null?void 0:s.call(this);o==null||o.call(this,d),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){var t;return(t=this.elementProperties.get(e))!=null?t:te}static _$Ei(){if(this.hasOwnProperty(q("elementProperties")))return;let e=je(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(q("properties"))){let t=this.properties,r=[...Be(t),...Ge(t)];for(let s of r)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let s of r)t.unshift(xt(s))}else e!==void 0&&t.push(xt(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t,r;((t=this._$EO)!=null?t:this._$EO=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){var t;let e=(t=this.shadowRoot)!=null?t:this.attachShadow(this.constructor.shadowRootOptions);return Qt(e,this.constructor.elementStyles),e}connectedCallback(){var e,t;(e=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(r=>{var s;return(s=r.hostConnected)==null?void 0:s.call(r)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostDisconnected)==null?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){var o;let r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){let n=(((o=r.converter)==null?void 0:o.toAttribute)!==void 0?r.converter:St).toAttribute(t,r.type);this._$Em=e,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(e,t){var o,n,d;let r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let a=r.getPropertyOptions(s),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((o=a.converter)==null?void 0:o.fromAttribute)!==void 0?a.converter:St;this._$Em=s;let h=l.fromAttribute(t,a.type);this[s]=(d=h!=null?h:(n=this._$Ej)==null?void 0:n.get(s))!=null?d:h,this._$Em=null}}requestUpdate(e,t,r,s=!1,o){var n,d;if(e!==void 0){let a=this.constructor;if(s===!1&&(o=this[e]),r!=null||(r=a.getPropertyOptions(e)),!(((n=r.hasChanged)!=null?n:ie)(o,t)||r.useDefault&&r.reflect&&o===((d=this._$Ej)==null?void 0:d.get(e))&&!this.hasAttribute(a._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:o},n){var d,a,l;r&&!((d=this._$Ej)!=null?d:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,(a=n!=null?n:t)!=null?a:this[e]),o!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&((l=this._$Eq)!=null?l:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r,s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((r=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[n,d]of this._$Ep)this[n]=d;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,d]of o){let{wrapped:a}=d,l=this[n];a!==!0||this._$AL.has(n)||l===void 0||this.C(n,void 0,d,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(o=>{var n;return(n=o.hostUpdate)==null?void 0:n.call(o)}),this.update(t)):this._$EM()}catch(o){throw e=!1,this._$EM(),o}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}},se;x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[q("elementProperties")]=new Map,x[q("finalized")]=new Map,wt==null||wt({ReactiveElement:x}),((se=T.reactiveElementVersions)!=null?se:T.reactiveElementVersions=[]).push("2.1.2");var Y=globalThis,ne=i=>i,ct=Y.trustedTypes,oe=ct?ct.createPolicy("lit-html",{createHTML:i=>i}):void 0,pe="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,_e="?"+C,qe=`<${_e}>`,O=document,X=()=>O.createComment(""),Q=i=>i===null||typeof i!="object"&&typeof i!="function",Pt=Array.isArray,Ze=i=>Pt(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",At=`[ 	
\f\r]`,Z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ae=/-->/g,de=/>/g,R=RegExp(`>|${At}(?:([^\\s"'>=/]+)(${At}*=${At}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ce=/'/g,le=/"/g,fe=/^(?:script|style|textarea|title)$/i,Ot=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),m=Ot(1),k=Ot(2),wr=Ot(3),L=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),he=new WeakMap,P=O.createTreeWalker(O,129);function me(i,e){if(!Pt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return oe!==void 0?oe.createHTML(e):e}var Ye=(i,e)=>{let t=i.length-1,r=[],s,o=e===2?"<svg>":e===3?"<math>":"",n=Z;for(let d=0;d<t;d++){let a=i[d],l,h,c=-1,p=0;for(;p<a.length&&(n.lastIndex=p,h=n.exec(a),h!==null);)p=n.lastIndex,n===Z?h[1]==="!--"?n=ae:h[1]!==void 0?n=de:h[2]!==void 0?(fe.test(h[2])&&(s=RegExp("</"+h[2],"g")),n=R):h[3]!==void 0&&(n=R):n===R?h[0]===">"?(n=s!=null?s:Z,c=-1):h[1]===void 0?c=-2:(c=n.lastIndex-h[2].length,l=h[1],n=h[3]===void 0?R:h[3]==='"'?le:ce):n===le||n===ce?n=R:n===ae||n===de?n=Z:(n=R,s=void 0);let _=n===R&&i[d+1].startsWith("/>")?" ":"";o+=n===Z?a+qe:c>=0?(r.push(l),a.slice(0,c)+pe+a.slice(c)+C+_):a+C+(c===-2?d:_)}return[me(i,o+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},J=class i{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let o=0,n=0,d=e.length-1,a=this.parts,[l,h]=Ye(e,t);if(this.el=i.createElement(l,r),P.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=P.nextNode())!==null&&a.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(pe)){let p=h[n++],_=s.getAttribute(c).split(C),y=/([.?@])?(.*)/.exec(p);a.push({type:1,index:o,name:y[2],strings:_,ctor:y[1]==="."?Ct:y[1]==="?"?kt:y[1]==="@"?Dt:F}),s.removeAttribute(c)}else c.startsWith(C)&&(a.push({type:6,index:o}),s.removeAttribute(c));if(fe.test(s.tagName)){let c=s.textContent.split(C),p=c.length-1;if(p>0){s.textContent=ct?ct.emptyScript:"";for(let _=0;_<p;_++)s.append(c[_],X()),P.nextNode(),a.push({type:2,index:++o});s.append(c[p],X())}}}else if(s.nodeType===8)if(s.data===_e)a.push({type:2,index:o});else{let c=-1;for(;(c=s.data.indexOf(C,c+1))!==-1;)a.push({type:7,index:o}),c+=C.length-1}o++}}static createElement(e,t){let r=O.createElement("template");return r.innerHTML=e,r}};function z(i,e,t=i,r){var n,d,a;if(e===L)return e;let s=r!==void 0?(n=t._$Co)==null?void 0:n[r]:t._$Cl,o=Q(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((d=s==null?void 0:s._$AO)==null||d.call(s,!1),o===void 0?s=void 0:(s=new o(i),s._$AT(i,t,r)),r!==void 0?((a=t._$Co)!=null?a:t._$Co=[])[r]=s:t._$Cl=s),s!==void 0&&(e=z(i,s._$AS(i,e.values),s,r)),e}var Tt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var l;let{el:{content:t},parts:r}=this._$AD,s=((l=e==null?void 0:e.creationScope)!=null?l:O).importNode(t,!0);P.currentNode=s;let o=P.nextNode(),n=0,d=0,a=r[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new tt(o,o.nextSibling,this,e):a.type===1?h=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(h=new Rt(o,this,e)),this._$AV.push(h),a=r[++d]}n!==(a==null?void 0:a.index)&&(o=P.nextNode(),n++)}return P.currentNode=O,s}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},tt=class i{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,r,s){var o;this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=(o=s==null?void 0:s.isConnected)!=null?o:!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=z(this,e,t),Q(e)?e===f||e==null||e===""?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==L&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ze(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==f&&Q(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){var o;let{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=J.createElement(me(r.h,r.h[0]),this.options)),r);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(t);else{let n=new Tt(s,this),d=n.u(this.options);n.p(t),this.T(d),this._$AH=n}}_$AC(e){let t=he.get(e.strings);return t===void 0&&he.set(e.strings,t=new J(e)),t}k(e){Pt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,s=0;for(let o of e)s===t.length?t.push(r=new i(this.O(X()),this.O(X()),this,this.options)):r=t[s],r._$AI(o),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,t);e!==this._$AB;){let s=ne(e).nextSibling;ne(e).remove(),e=s}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},F=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,o){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=f}_$AI(e,t=this,r,s){let o=this.strings,n=!1;if(o===void 0)e=z(this,e,t,0),n=!Q(e)||e!==this._$AH&&e!==L,n&&(this._$AH=e);else{let d=e,a,l;for(e=o[0],a=0;a<o.length-1;a++)l=z(this,d[r+a],t,a),l===L&&(l=this._$AH[a]),n||(n=!Q(l)||l!==this._$AH[a]),l===f?e=f:e!==f&&(e+=(l!=null?l:"")+o[a+1]),this._$AH[a]=l}n&&!s&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}},Ct=class extends F{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}},kt=class extends F{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==f)}},Dt=class extends F{constructor(e,t,r,s,o){super(e,t,r,s,o),this.type=5}_$AI(e,t=this){var n;if((e=(n=z(this,e,t,0))!=null?n:f)===L)return;let r=this._$AH,s=e===f&&r!==f||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==f&&(r===f||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;typeof this._$AH=="function"?this._$AH.call((r=(t=this.options)==null?void 0:t.host)!=null?r:this.element,e):this._$AH.handleEvent(e)}},Rt=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){z(this,e)}};var Et=Y.litHtmlPolyfillSupport,ue;Et==null||Et(J,tt),((ue=Y.litHtmlVersions)!=null?ue:Y.litHtmlVersions=[]).push("3.3.3");var ge=(i,e,t)=>{var o,n;let r=(o=t==null?void 0:t.renderBefore)!=null?o:e,s=r._$litPart$;if(s===void 0){let d=(n=t==null?void 0:t.renderBefore)!=null?n:null;r._$litPart$=s=new tt(e.insertBefore(X(),d),d,void 0,t!=null?t:{})}return s._$AI(i),s};var H=globalThis,v=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let e=super.createRenderRoot();return(r=(t=this.renderOptions).renderBefore)!=null||(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ge(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return L}},ye;v._$litElement$=!0,v.finalized=!0,(ye=H.litElementHydrateSupport)==null||ye.call(H,{LitElement:v});var Lt=H.litElementPolyfillSupport;Lt==null||Lt({LitElement:v});var ve;((ve=H.litElementVersions)!=null?ve:H.litElementVersions=[]).push("4.2.2");var lt="chronothermostat";function ht(i){return i.callWS({type:`${lt}/info`})}function Ht(i,e,t){return i.callWS({type:`${lt}/get_program`,zone:e,program:t})}function be(i,e,t,r,s){return i.callService(lt,"set_program",{zone:e,program:t,weekday:r,values:s})}var M=i=>i<10?`0${i}`:String(i);function Xe(i){let e=-i.getTimezoneOffset(),t=e>=0?"+":"-",r=Math.abs(e);return`${i.getFullYear()}-${M(i.getMonth()+1)}-${M(i.getDate())}T${M(i.getHours())}:${M(i.getMinutes())}:${M(i.getSeconds())}${t}${M(Math.floor(r/60))}:${M(r%60)}`}function $e(i,e,t){let r={scenario:e};return t&&(r.return_at=Xe(t)),i.callService(lt,"set_scenario",r)}function ut(i,e,t){if(i.length===0)return[e,t];let r=Math.max(e,Math.floor(Math.min(...i))-1),s=Math.min(t,Math.ceil(Math.max(...i))+1);return s-r<5&&(s=Math.min(t,r+5),r=Math.max(e,s-5)),[r,s]}function et(i,e){let{width:t,height:r,min:s,max:o,padLeft:n,padBottom:d}=e,a=t-n,l=r-d,h=o-s||1,c=g=>l*(1-(Math.min(o,Math.max(s,g))-s)/h),p=a/96,_=i.map((g,nt)=>{let ot=c(g);return{x:n+nt*p,y:ot,w:p,h:l-ot}}),y=h<=6?1:h<=12?2:5,E=[];for(let g=Math.ceil(s/y)*y;g<=o;g+=y)E.push({y:c(g),label:String(g)});let it=[0,6,12,18,24].map(g=>({x:n+a*g/24,label:String(g)}));return{bars:_,yTicks:E,xTicks:it}}function xe(i,e){let t=Math.floor((i-e.padLeft)/(e.width-e.padLeft)*96);return Math.min(95,Math.max(0,t))}var we=(i,e,t)=>Math.min(t,Math.max(e,i));function Mt(i,e){return{...i,cursor:we(Math.round(e),0,95)}}function Nt(i,e){return Mt(i,i.cursor+e)}function It(i,e){let t=we(Math.round((i.values[i.cursor]+e)/.5)*.5,i.min,i.max),r=i.values.slice();return r[i.cursor]=t,{...i,values:r}}function Se(i){if(i.cursor>=95)return i;let e=i.values.slice();return e[i.cursor+1]=e[i.cursor],{...i,values:e,cursor:i.cursor+1}}function zt(i,e){return{...i,values:e.slice()}}function U(i){return i.values.length!==i.saved.length||i.values.some((e,t)=>e!==i.saved[t])}var rt=["mon","tue","wed","thu","fri","sat","sun"],Qe={it:{mon:["luned\xEC","Lun"],tue:["marted\xEC","Mar"],wed:["mercoled\xEC","Mer"],thu:["gioved\xEC","Gio"],fri:["venerd\xEC","Ven"],sat:["sabato","Sab"],sun:["domenica","Dom"]},en:{mon:["Monday","Mon"],tue:["Tuesday","Tue"],wed:["Wednesday","Wed"],thu:["Thursday","Thu"],fri:["Friday","Fri"],sat:["Saturday","Sat"],sun:["Sunday","Sun"]}};function w(i,e,t=!1){return Qe[e][i][t?1:0]}function N(i){return rt[(i.getDay()+6)%7]}var pt=i=>i<10?`0${i}`:String(i);function S(i,e){let t=i.toFixed(1);return`${e==="it"?t.replace(".",","):t} \xB0C`}function Ae(i){return`${pt(Math.floor(i/4))}:${pt(i%4*15)}`}var Ft=i=>`${pt(i.getHours())}:${pt(i.getMinutes())}`;function Ee(i,e,t){let r=Ft(i),s=a=>new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime(),o=new Date(e.getFullYear(),e.getMonth(),e.getDate()+1).getTime(),n=s(i);if(n<=s(e))return t==="it"?`fino alle ${r}`:`until ${r}`;if(n===o)return t==="it"?`fino a domani alle ${r}`:`until tomorrow at ${r}`;let d=w(N(i),t);return t==="it"?`fino a ${d} alle ${r}`:`until ${d} at ${r}`}function _t(i,e){let t=w(N(i),e);return e==="it"?`${t} ${i.getDate()} alle ${Ft(i)}`:`${t} ${i.getDate()} at ${Ft(i)}`}function Te(i,e,t={delay:450,interval:110}){let r,s=()=>{r!==void 0&&clearTimeout(r),r=void 0},o=()=>{e(),r=setTimeout(o,t.interval)},n=a=>{a.preventDefault(),s(),e(),r=setTimeout(o,t.delay)},d=a=>a.preventDefault();return i.addEventListener("pointerdown",n),i.addEventListener("pointerup",s),i.addEventListener("pointerleave",s),i.addEventListener("pointercancel",s),i.addEventListener("contextmenu",d),()=>{s(),i.removeEventListener("pointerdown",n),i.removeEventListener("pointerup",s),i.removeEventListener("pointerleave",s),i.removeEventListener("pointercancel",s),i.removeEventListener("contextmenu",d)}}var Je={none:"No changes",unsaved:"Unsaved changes",saved_day:"{day} program saved",editing:"Editing:",work:"Work",holiday:"Holiday",away:"Away",off:"Off",continue:"Continue",save:"Save",copy_from:"Copy from\u2026",copy_from_hint:"Copy the saved program of:",discard:"Discard",confirm:"Confirm",cancel:"Cancel",today:"Today",today_day:"Today, {day}",prev_slot:"Previous quarter hour",next_slot:"Next quarter hour",temp_down:"Lower temperature",temp_up:"Raise temperature",return_date:"Return date",return_time:"Return time",error_load:"Could not load the data.",error_save:"Could not save.",house_scenario:"House scenario",return_required:"Set the return day and time",house_work:"The house follows the Work program.",house_holiday:"The house follows the Holiday program.",house_away:"Heating off until {when}, then it switches to Work by itself.",house_away_no_return:"Away with no return: stays off until you set a return.",house_off:"Heating off until you pick another scenario.",status_schedule:"Schedule: {temp} {until}, then {next}.",status_schedule_flat:"Schedule: {temp}.",status_forced:"Forced to {temp} {until}, then back to the schedule ({next}).",status_forced_flat:"Forced to {temp}.",status_zone_off:"Switched off by you. The schedule resumes when you turn it back on.",status_away:"Away: off until {when}, then Work.",status_away_no_return:"Away with no return: stays off until you set a return.",status_off:"Heating off.",status_zone_on_manual:"Turned on by hand with the heating off: stays at {temp} until you turn it off or change scenario.",status_unavailable:"Thermostat unavailable.",config_entity:"Thermostat",config_name:"Name (optional)"},tr={none:"Nessuna modifica",unsaved:"Modifiche non salvate",saved_day:"Programma di {day} salvato",editing:"Stai modificando:",work:"Lavoro",holiday:"Ferie",away:"Fuori casa",off:"Spento",continue:"Prosegui",save:"Salva",copy_from:"Copia da\u2026",copy_from_hint:"Copia il programma salvato di:",discard:"Scarta",confirm:"Conferma",cancel:"Annulla",today:"Oggi",today_day:"Oggi, {day}",prev_slot:"Quarto d'ora precedente",next_slot:"Quarto d'ora successivo",temp_down:"Abbassa la temperatura",temp_up:"Alza la temperatura",return_date:"Giorno di rientro",return_time:"Ora di rientro",error_load:"Impossibile caricare i dati.",error_save:"Salvataggio non riuscito.",house_scenario:"Scenario della casa",return_required:"Indica giorno e ora del rientro",house_work:"La casa segue il programma Lavoro.",house_holiday:"La casa segue il programma Ferie.",house_away:"Impianto spento fino a {when}, poi passa da solo a Lavoro.",house_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",house_off:"Impianto spento finch\xE9 non scegli un altro scenario.",status_schedule:"Programma: {temp} {until}, poi {next}.",status_schedule_flat:"Programma: {temp}.",status_forced:"Forzato a {temp} {until}, poi torna al programma ({next}).",status_forced_flat:"Forzato a {temp}.",status_zone_off:"Spento da te. Il programma riparte quando lo riaccendi.",status_away:"Fuori casa: spento fino a {when}, poi Lavoro.",status_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",status_off:"Impianto spento.",status_zone_on_manual:"Acceso a mano con impianto spento: resta a {temp} finch\xE9 non lo spegni o cambi scenario.",status_unavailable:"Termostato non disponibile.",config_entity:"Termostato",config_name:"Nome (facoltativo)"},Ce={en:Je,it:tr};function b(i){var t,r,s;return((s=(r=(t=i==null?void 0:i.locale)==null?void 0:t.language)!=null?r:i==null?void 0:i.language)!=null?s:"").toLowerCase().startsWith("it")?"it":"en"}function u(i,e,t){var s,o,n;let r=(n=(o=(s=Ce[i])==null?void 0:s[e])!=null?o:Ce.en[e])!=null?n:e;return t?r.replace(/\{(\w+)\}/g,(d,a)=>a in t?String(t[a]):d):r}var ft="chronothermostat-zone-card-editor",mt="chronothermostat-viewer-card-editor",ke={name:"entity",selector:{entity:{domain:"climate"}}},Kt={name:"name",selector:{text:{}}},I=class extends v{constructor(){super(...arguments);this._label=t=>u(b(this.hass),t.name==="entity"?"config_entity":"config_name")}get schema(){return[ke,Kt]}setConfig(t){this._config=t}render(){return!this.hass||!this._config?f:m`<ha-form .hass=${this.hass} .data=${this._config} .schema=${this.schema}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`}_changed(t){t.stopPropagation();let r={...t.detail.value};r.name||delete r.name,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r},bubbles:!0,composed:!0}))}};I.properties={hass:{attribute:!1},_config:{state:!0}};var Ut=class extends I{},Wt=class extends I{get schema(){return[ke]}};customElements.get(ft)||customElements.define(ft,Ut);customElements.get(mt)||customElements.define(mt,Wt);var Bt="chronothermostat-editor-card",er=["work","holiday"],rr=["prev","next","cont","minus","plus"],De=.5,sr=3e3,ir=3e4,Re=150,Pe=8,gt=26,Oe=22,nr=452,Le=i=>i.charAt(0).toUpperCase()+i.slice(1),or=i=>i.getHours()*4+Math.floor(i.getMinutes()/15),A=i=>Math.round(i*100)/100,He=i=>rt.every(e=>{var t;return Array.isArray((t=i.weekdays)==null?void 0:t[e])&&i.weekdays[e].length===96}),ar=m`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M3 12h13M11 6l6 6-6 6M21 5v14" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`,W=class extends v{constructor(){super();this._lastLoadAttempt=0;this._loadToken=0;this._holds=new Map;this._observedChart=null;this._program="work",this._day=N(new Date),this._loadFailed=!1,this._copyOpen=!1,this._saving=!1,this._loading=!1,this._chartWidth=nr}static getConfigElement(){return document.createElement(ft)}static getStubConfig(t){var s;let r=Object.keys((s=t==null?void 0:t.states)!=null?s:{}).find(o=>o.startsWith("climate."));return{entity:r!=null?r:""}}setConfig(t){if(!t||typeof t.entity!="string"||t.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==t.entity&&this._reset(),this._config={...t}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this._holds.forEach(t=>t.detach()),this._holds.clear(),this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=null,this._clearSaved()}shouldUpdate(t){if(t.size===1&&t.has("hass")){let r=t.get("hass");return!r||b(r)!==b(this.hass)||this._needsLoad()}return!0}willUpdate(){this._needsLoad()&&this._load()}updated(){this.isConnected&&(this._syncHolds(),this._observeChart())}render(){if(!this._config)return f;let t=b(this.hass);if(this._loadFailed)return m`<ha-card><div class="load-error error">${u(t,"error_load")}</div></ha-card>`;let r=this._state;if(!r)return m`<ha-card></ha-card>`;let[s,o]=this._status(t,r);return m`<ha-card>
      <div class="row">
        <span class="label">${u(t,"editing")}</span>
        ${er.map(n=>m`<button class="chip program ${n===this._program?"on":""}"
          data-program=${n} aria-pressed=${n===this._program?"true":"false"}
          @click=${()=>this._select({program:n,day:this._day})}>${u(t,n)}</button>`)}
      </div>
      <div class="row days">
        ${rt.map(n=>m`<button class="chip day ${n===this._day?"on":""}"
          data-day=${n} aria-pressed=${n===this._day?"true":"false"}
          @click=${()=>this._select({program:this._program,day:n})}>
          ${w(n,t,!0)}
        </button>`)}
      </div>
      ${this._pending&&U(r)?this._renderDirtyBar(t):f}
      <div class="reading ${this._loading?"loading":""}">
        <span><span class="day-name">${Le(w(this._day,t))}</span><span
          class="time">${Ae(r.cursor)}</span></span>
        <span class="temp">${S(r.values[r.cursor],t)}</span>
      </div>
      ${this._renderChart(r)}
      <div class="controls">
        <button class="big hold" id="prev" ?disabled=${this._loading} aria-label=${u(t,"prev_slot")}>
          <span class="glyph" aria-hidden="true">‹</span>
        </button>
        <button class="big hold" id="next" ?disabled=${this._loading} aria-label=${u(t,"next_slot")}>
          <span class="glyph" aria-hidden="true">›</span>
        </button>
        <button class="big hold wide" id="cont" ?disabled=${this._loading}>
          ${ar}<span>${u(t,"continue")}</span>
        </button>
        <button class="big hold" id="minus" ?disabled=${this._loading} aria-label=${u(t,"temp_down")}>
          <span class="glyph" aria-hidden="true">−</span>
        </button>
        <button class="big hold" id="plus" ?disabled=${this._loading} aria-label=${u(t,"temp_up")}>
          <span class="glyph" aria-hidden="true">+</span>
        </button>
        <button class="big" id="copy" ?disabled=${this._loading}
          aria-expanded=${this._copyOpen?"true":"false"}
          @click=${this._toggleCopy}>${u(t,"copy_from")}</button>
        <button class="big save" id="save" ?disabled=${this._saving||this._loading}
          @click=${this._saveAndContinue}>
          ${u(t,"save")}
        </button>
      </div>
      <div class="footer">
        <span class="name">${this._zoneName()}</span>
        <span class="status ${o}">${s}</span>
      </div>
      ${this._copyOpen?this._renderCopyPanel(t):f}
    </ha-card>`}_renderDirtyBar(t){return m`<div class="dirty-bar">
      <span class="message">${u(t,"unsaved")}</span>
      <button class="big" id="bar-discard" @click=${this._discardPending}>${u(t,"discard")}</button>
      <button class="big save" id="bar-save" ?disabled=${this._saving}
        @click=${this._saveAndContinue}>
        ${u(t,"save")}
      </button>
    </div>`}_renderChart(t){let r=this._chartWidth,s=Re-Pe,[o,n]=ut(t.values,t.min,t.max),d=et(t.values,{width:r,height:s,min:o,max:n,padLeft:gt,padBottom:Oe}),a=s-Oe,l=d.bars[t.cursor],h=A(l.x+l.w/2),c=d.xTicks.length-1;return m`<div class="chart ${this._loading?"loading":""}">
      <svg viewBox="0 0 ${r} ${Re}" @pointerdown=${this._onChartDown}>
        <g transform="translate(0 ${Pe})">
          ${d.yTicks.map(p=>k`
            <line class="grid" x1=${gt} x2=${r}
              y1=${A(p.y)} y2=${A(p.y)}></line>
            <text class="axis" x=${gt-5} y=${A(p.y)} dy="0.35em"
              text-anchor="end">${p.label}</text>`)}
          ${d.bars.map((p,_)=>k`<rect class="bar ${_===t.cursor?"cursor":""}"
            x=${A(p.x)} y=${A(p.y)} width=${A(Math.max(0,p.w-.6))}
            height=${A(p.h)}></rect>`)}
          <line class="cursor-line" x1=${h} x2=${h} y1="0" y2=${a+4}></line>
          ${d.xTicks.map((p,_)=>k`<text class="axis" x=${A(p.x)} y=${a+18}
            text-anchor=${_===0?"start":_===c?"end":"middle"}>${p.label}</text>`)}
        </g>
      </svg>
    </div>`}_renderCopyPanel(t){return m`<div class="copy-panel">
      <div class="hint">${u(t,"copy_from_hint")}</div>
      <div class="copy-days">
        ${rt.filter(r=>r!==this._day).map(r=>m`<button class="chip" data-day=${r} @click=${()=>this._copyFrom(r)}>
            ${Le(w(r,t))}
          </button>`)}
      </div>
    </div>`}_status(t,r){return this._failure?[u(t,this._failure),"error"]:U(r)?[u(t,"unsaved"),"warning"]:this._savedDay?[u(t,"saved_day",{day:w(this._savedDay,t)}),"success"]:[u(t,"none"),""]}_zoneName(){let t=this._config;if(!t)return"";if(t.name)return t.name;let s=(this._info?this._info.zones:[]).find(o=>o.entity_id===t.entity);return s?s.name:""}_needsLoad(){return!this.hass||!this._config?!1:this._loadedFor!==this._config.entity?!0:this._loadFailed&&Date.now()-this._lastLoadAttempt>=ir}_reset(){this._loadToken++,this._loadedFor=void 0,this._shown=void 0,this._data=void 0,this._state=void 0,this._loading=!1,this._loadFailed=!1,this._failure=void 0,this._pending=void 0,this._copyOpen=!1,this._clearSaved()}async _load(){let t=this.hass,r=this._config;if(!t||!r)return;let s=r.entity;this._loadedFor=s,this._lastLoadAttempt=Date.now();let o;try{if(this._info||(this._info=await ht(t)),this._loadedFor!==s)return;if(!this._info.zones.some(l=>l.entity_id===s))throw new Error(`${s} is not a chronothermostat zone`);let d=this._info.scenario_entity_id,a=d?t.states[d]:void 0;o=a&&a.state==="holiday"?"holiday":"work"}catch{this._loadedFor===s&&this._firstLoadFailed();return}let n=new Date;await this._switchTo({program:o,day:N(n)},or(n))}_firstLoadFailed(){this._info=void 0,this._loadFailed=!0}_select(t){if(t.program===this._program&&t.day===this._day){this._pending=void 0;return}if(this._state&&U(this._state)){this._pending=t;return}this._switchTo(t)}async _switchTo(t,r){let s=this.hass,o=this._config;if(!s||!o)return;let n=++this._loadToken;this._pending=void 0,this._copyOpen=!1,this._program=t.program,this._day=t.day,this._loading=!0;try{let d=await Ht(s,o.entity,t.program);if(n!==this._loadToken)return;if(!He(d))throw new Error("Invalid program data");let a=r!==void 0?r:this._state?this._state.cursor:0;this._showDay(d,t,a)}catch{if(n!==this._loadToken)return;this._state&&this._shown?(this._program=this._shown.program,this._day=this._shown.day,this._failure="error_load"):this._firstLoadFailed()}finally{n===this._loadToken&&(this._loading=!1)}}_showDay(t,r,s){let o=t.weekdays[r.day];this._data=t,this._shown=r,this._loadFailed=!1,this._failure=void 0,this._state={values:o.slice(),saved:o.slice(),cursor:s,min:t.min_temp,max:t.max_temp}}_discardPending(){let t=this._pending;!t||!this._state||(this._state=zt(this._state,this._state.saved),this._switchTo(t))}_hold(t){let r=this._state;!r||this._loading||(t==="prev"?this._state=Nt(r,-1):t==="next"?this._state=Nt(r,1):t==="cont"?this._edit(Se(r)):t==="minus"?this._edit(It(r,-De)):this._edit(It(r,De)))}_edit(t){this._state=t,this._failure=void 0,this._clearSaved(),this._pending&&!U(t)&&(this._pending=void 0)}_onChartDown(t){let r=this._state,s=t.currentTarget.getBoundingClientRect();if(!r||this._loading||s.width<=0)return;let o=(t.clientX-s.left)/s.width*this._chartWidth,n=xe(o,{width:this._chartWidth,padLeft:gt});this._state=Mt(r,n)}_toggleCopy(){this._loading||(this._copyOpen=!this._copyOpen)}_copyFrom(t){this._copyOpen=!1,!(!this._state||!this._data||this._loading)&&this._edit(zt(this._state,this._data.weekdays[t]))}async _saveAndContinue(){if(!await this._save())return;let t=this._pending;t&&this._state&&!U(this._state)&&await this._switchTo(t)}async _save(){let t=this.hass,r=this._config,s=this._state,o=this._shown;if(!t||!r||!s||!o||this._saving||this._loading)return!1;let n=s.values.slice(),d=this._loadToken;this._saving=!0;try{await be(t,r.entity,o.program,o.day,n);let a=await Ht(t,r.entity,o.program);return d===this._loadToken&&this._state&&(He(a)&&(this._data=a),this._state={...this._state,saved:n}),this._failure=void 0,this._flashSaved(o.day),!0}catch{return this._failure="error_save",!1}finally{this._saving=!1}}_flashSaved(t){this._clearSaved(),this._savedDay=t,this._savedTimer=setTimeout(()=>{this._savedTimer=void 0,this._savedDay=void 0},sr)}_clearSaved(){this._savedTimer!==void 0&&clearTimeout(this._savedTimer),this._savedTimer=void 0,this._savedDay=void 0}_syncHolds(){for(let t of rr){let r=this.renderRoot.querySelector(`#${t}`),s=this._holds.get(t);s&&s.el===r||(s&&s.detach(),this._holds.delete(t),r&&this._holds.set(t,{el:r,detach:Te(r,()=>this._hold(t))}))}}_observeChart(){let t=this.renderRoot.querySelector(".chart");t!==this._observedChart&&(this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=t,!(!t||typeof ResizeObserver=="undefined")&&(this._resizeObserver||(this._resizeObserver=new ResizeObserver(r=>{let s=Math.round(r[0].contentRect.width);s>0&&(this._chartWidth=s)})),this._resizeObserver.observe(t)))}};W.properties={hass:{attribute:!1},_config:{state:!0},_program:{state:!0},_day:{state:!0},_state:{state:!0},_loadFailed:{state:!0},_failure:{state:!0},_savedDay:{state:!0},_pending:{state:!0},_copyOpen:{state:!0},_saving:{state:!0},_loading:{state:!0},_chartWidth:{state:!0}},W.styles=D`
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
  `;var Gt="chronothermostat-scenario-card",jt="chronothermostat-scenario-card-editor",Ne=["work","holiday","away","off"],dr=3e4,Me=i=>i<10?`0${i}`:String(i),cr=i=>Ne.includes(i);function lr(i){let e=new Date(i.getFullYear(),i.getMonth(),i.getDate()+1,19,0);return{date:`${e.getFullYear()}-${Me(e.getMonth()+1)}-${Me(e.getDate())}`,time:"19:00"}}function hr(i){let e=new Date(i.getTime());return e.setMinutes(Math.round(e.getMinutes()/15)*15,0,0),e}function ur(i,e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(i),r=/^(\d{2}):(\d{2})/.exec(e);if(!t||!r)return;let s=new Date(+t[1],+t[2]-1,+t[3],+r[1],+r[2]);return isNaN(s.getTime())?void 0:s}var B=class extends v{constructor(){super();this._infoPending=!1;this._infoTriedAt=0;this._config={},this._infoFailed=!1,this._busy=!1}static getConfigElement(){return document.createElement(jt)}static getStubConfig(){return{}}setConfig(t){this._config={...t!=null?t:{}}}getCardSize(){return 3}shouldUpdate(t){t.has("hass")&&this._ensureInfo();let r=this._current(),s=this._seen,o=!!s&&s.select===r.select&&s.returnAt===r.returnAt&&s.lang===r.lang;return this._seen=r,t.size===1&&t.has("hass")?!o:!0}_ensureInfo(){!this.hass||this._infoPending||this._info&&this._info.scenario_entity_id||this._infoTriedAt&&Date.now()-this._infoTriedAt<dr||(this._infoTriedAt=Date.now(),this._infoPending=!0,ht(this.hass).then(t=>{this._infoPending=!1,this._info=t,this._infoFailed=!(t!=null&&t.scenario_entity_id)},()=>{this._infoPending=!1,this._infoFailed=!0}))}_active(){var r;let t=(r=this._current().select)==null?void 0:r.state;return cr(t)?t:void 0}_current(){var o,n,d;let t=(n=(o=this.hass)==null?void 0:o.states)!=null?n:{},{scenario_entity_id:r,return_at_entity_id:s}=(d=this._info)!=null?d:{};return{select:r?t[r]:void 0,returnAt:s?t[s]:void 0,lang:b(this.hass)}}_tap(t){if(!this._busy){if(this._message=void 0,t==="away"||t==="off"){this._panel=this._panel===t?void 0:t;return}this._panel=void 0,t!==this._active()&&this._apply(t)}}async _apply(t,r){if(!(!this.hass||this._busy)){this._busy=!0,this._message=void 0;try{await $e(this.hass,t,r),(t==="away"||t==="off")&&(this._panel=void 0)}catch(s){let o=s instanceof Error?s.message:"";this._message=o||u(b(this.hass),"error_save")}finally{this._busy=!1}}}_confirmAway(){let t=o=>{var n,d;return(d=(n=this.renderRoot.querySelector(o))==null?void 0:n.value)!=null?d:""},r=ur(t('input[type="date"]'),t('input[type="time"]')),s=r&&hr(r);if(!s||s.getTime()<=Date.now()){this._message=u(b(this.hass),"return_required");return}this._apply("away",s)}render(){let t=b(this.hass),{returnAt:r}=this._current(),s=this._active(),o=this._config.name||u(t,"house_scenario"),n=this._infoFailed?"error_load":void 0;return m`<ha-card>
      <div class="label">${o}</div>
      <div class="chips">
        ${Ne.map(d=>m`<button
            class="chip ${d} ${s===d?"active":""}"
            data-scenario=${d}
            aria-pressed=${s===d?"true":"false"}
            ?disabled=${this._busy}
            @click=${()=>this._tap(d)}
          >${u(t,d)}</button>`)}
      </div>
      ${this._panel?this._renderPanel(this._panel,t):f}
      ${this._message?m`<div class="error">${this._message}</div>`:f}
      ${n?m`<div class="error">${u(t,n)}</div>`:f}
      ${!n&&s?m`<div class="sentence">${this._sentence(s,r,t)}</div>`:f}
    </ha-card>`}_renderPanel(t,r){let s=m`<div class="buttons">
      <button class="action confirm" ?disabled=${this._busy}
        @click=${()=>t==="off"?void this._apply("off"):this._confirmAway()}>${u(r,"confirm")}</button>
      <button class="action cancel" @click=${()=>{this._panel=void 0,this._message=void 0}}>${u(r,"cancel")}</button>
    </div>`;if(t==="off")return m`<div class="panel">${s}</div>`;let o=lr(new Date);return m`<div class="panel">
      <div class="fields">
        <label>${u(r,"return_date")}<input type="date" .value=${o.date} /></label>
        <label>${u(r,"return_time")}<input type="time" step="900" .value=${o.time} /></label>
      </div>
      ${s}
    </div>`}_sentence(t,r,s){var o;switch(t){case"work":return u(s,"house_work");case"holiday":return u(s,"house_holiday");case"off":return u(s,"house_off");default:{let n=new Date((o=r==null?void 0:r.state)!=null?o:"");return isNaN(n.getTime())||n.getTime()<=Date.now()?u(s,"house_away_no_return"):u(s,"house_away",{when:_t(n,s)})}}}};B.properties={hass:{attribute:!1},_config:{state:!0},_info:{state:!0},_infoFailed:{state:!0},_panel:{state:!0},_message:{state:!0},_busy:{state:!0}},B.styles=D`
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
    .label {
      color: var(--secondary-text-color);
    }
    .chips {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 6px;
      margin-top: 6px;
    }
    button {
      font: inherit;
      font-size: 15px;
      color: var(--primary-text-color);
      background: transparent;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      border-radius: 12px;
      min-height: 48px;
      padding: 0 4px;
      cursor: pointer;
      overflow-wrap: anywhere;
    }
    button:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .chip.active {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15);
      border-color: var(--primary-color);
      color: var(--primary-color);
      font-weight: 600;
    }
    .chip.away.active,
    .chip.off.active {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.15);
      border-color: var(--error-color, #db4437);
      color: var(--error-color, #db4437);
    }
    .panel {
      margin-top: 6px;
    }
    .fields {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .fields label {
      display: flex;
      flex: 1 1 140px;
      flex-direction: column;
      color: var(--secondary-text-color);
    }
    input {
      font: inherit;
      font-size: 16px;
      min-height: 48px;
      box-sizing: border-box;
      color: var(--primary-text-color);
      background: transparent;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      border-radius: 8px;
      padding: 0 8px;
    }
    .buttons {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
    .action {
      flex: 1;
    }
    .action.confirm {
      background: rgba(var(--rgb-error-color, 219, 68, 55), 0.15);
      border-color: var(--error-color, #db4437);
      color: var(--error-color, #db4437);
      font-weight: 600;
    }
    .error {
      margin-top: 6px;
      color: var(--error-color, #db4437);
    }
    .sentence {
      margin-top: 6px;
      overflow-wrap: anywhere;
    }
  `;var yt=class extends I{get schema(){return[Kt]}};var Vt="chronothermostat-viewer-card",pr="chronothermostat",_r=6e4,vt=480,st=100,fr=5,mr=35,gr=new Set(["away","away_no_return","off","zone_on_manual"]),Ie=i=>i<10?`0${i}`:String(i),yr=i=>i.charAt(0).toUpperCase()+i.slice(1),$=i=>Math.round(i*100)/100,ze=i=>i.getHours()*4+Math.floor(i.getMinutes()/15),G=i=>typeof i=="number"&&Number.isFinite(i),Fe=i=>new Date(i.getFullYear(),i.getMonth(),i.getDate()).getTime(),j=class extends v{constructor(){super(),this._now=new Date}static getConfigElement(){return document.createElement(mt)}static getStubConfig(e){var r;let t=Object.keys((r=e==null?void 0:e.states)!=null?r:{}).find(s=>s.startsWith("climate."));return{entity:t!=null?t:""}}setConfig(e){if(!e||typeof e.entity!="string"||e.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==e.entity&&(this._sensorId=void 0),this._config={...e}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this._now=new Date,this._timer=setInterval(()=>{this._now=new Date},_r)}disconnectedCallback(){super.disconnectedCallback(),this._timer!==void 0&&clearInterval(this._timer),this._timer=void 0}shouldUpdate(e){let t=this._current(),r=this._seen,s=!!r&&r.sensor===t.sensor&&r.climate===t.climate&&r.lang===t.lang;return this._seen=t,e.size===1&&e.has("hass")?!s:!0}_resolveSensor(){var d,a,l,h,c;let e=(a=(d=this.hass)==null?void 0:d.states)!=null?a:{},t=(l=this._config)==null?void 0:l.entity,r=this._sensorId?e[this._sensorId]:void 0;if(r&&((h=r.attributes)==null?void 0:h.zone)===t)return r;let s=Object.keys(e).filter(p=>{var _,y;return p.startsWith("sensor.")&&((y=(_=e[p])==null?void 0:_.attributes)==null?void 0:y.zone)===t}),o=(c=this.hass)==null?void 0:c.entities,n=o&&s.find(p=>{var _;return((_=o[p])==null?void 0:_.platform)===pr})||s[0];return this._sensorId=n,n?e[n]:void 0}_current(){var e,t;return{sensor:this._resolveSensor(),climate:this._config?(t=(e=this.hass)==null?void 0:e.states)==null?void 0:t[this._config.entity]:void 0,lang:b(this.hass)}}render(){var E;let{sensor:e,climate:t,lang:r}=this._current(),s=!e||e.state==="unavailable"||e.state==="unknown"?"unavailable":e.state,o=(E=e==null?void 0:e.attributes)!=null?E:{},n=Array.isArray(o.today)?o.today:[],d=!!e&&!gr.has(s)&&s!=="unavailable"&&n.length===96&&n.every(G),a=this._now,l=w(N(a),r),h=o.program==="work"||o.program==="holiday"?o.program:void 0,c=h?`${u(r,"today_day",{day:l})} \xB7 ${u(r,h)}`:yr(l),p=`${Ie(a.getHours())}:${Ie(a.getMinutes())}`,[_,y]=this._sentence(s,o,t,r);return m`<ha-card>
      <div class="header">
        <span class="title">${c}</span><span class="clock">${p}</span>
      </div>
      ${d?this._chart(s,n,o,t):f}
      <div class="sentence" style=${y}>${_}</div>
    </ha-card>`}_sentence(e,t,r,s){var p;let o=(p=r==null?void 0:r.attributes)==null?void 0:p.temperature,n=this._now,d=typeof t.next_step_at=="string"?new Date(t.next_step_at):void 0,a=!!d&&!isNaN(d.getTime())&&G(t.next_step_target),l=a?Ee(d,n,s):"",h=a?S(t.next_step_target,s):"",c=(_,y)=>[u(s,_,y),""];switch(e){case"schedule":return G(t.program_target)?a?c("status_schedule",{temp:S(t.program_target,s),until:l,next:h}):c("status_schedule_flat",{temp:S(t.program_target,s)}):c("status_unavailable");case"forced":return G(o)?a?c("status_forced",{temp:S(o,s),until:l,next:h}):c("status_forced_flat",{temp:S(o,s)}):c("status_unavailable");case"zone_off":return[u(s,"status_zone_off"),"color: var(--error-color)"];case"zone_on_manual":return G(o)?c("status_zone_on_manual",{temp:S(o,s)}):c("status_unavailable");case"away":{let _=typeof t.return_at=="string"?new Date(t.return_at):void 0;return!_||isNaN(_.getTime())?c("status_away_no_return"):c("status_away",{when:_t(_,s)})}case"away_no_return":return c("status_away_no_return");case"off":return c("status_off");default:return c("status_unavailable")}}_chart(e,t,r,s){var it;let o=this._now,n=ze(o),d=(it=s==null?void 0:s.attributes)==null?void 0:it.temperature,a=e==="forced"&&G(d),[l,h]=ut(a?[...t,d]:t,fr,mr),c={width:vt,height:st,min:l,max:h,padLeft:0,padBottom:0},p=et(t,c),_=vt/96,y=f;if(a){let g=typeof r.next_step_at=="string"?new Date(r.next_step_at):void 0,ot=g&&!isNaN(g.getTime())&&Fe(g)<=Fe(o)?Math.min(96,Math.max(n,ze(g))):96,Zt=et([d],c).bars[0].y;y=k`<rect class="band" shape-rendering="crispEdges" x=${$(n*_)} y=${$(Zt)}
        width=${$((ot-n)*_)} height=${$(st-Zt)}></rect>`}let E=(o.getHours()*60+o.getMinutes())/1440*vt;return m`<div class="chart">
      <svg viewBox="0 0 ${vt} ${st}" preserveAspectRatio="none" aria-hidden="true">
        ${[6,12,18].map(g=>k`<line class="grid" x1=${g*20} x2=${g*20}
          y1="0" y2=${st}></line>`)}
        ${p.bars.map((g,nt)=>k`<rect class="bar ${nt<n?"past":""}" shape-rendering="crispEdges"
          x=${$(g.x)} y=${$(g.y)} width=${$(g.w)}
          height=${$(g.h)}></rect>`)}
        ${y}
        <line class="now" x1=${$(E)} x2=${$(E)} y1="0" y2=${st}></line>
      </svg>
    </div>`}};j.properties={hass:{attribute:!1},_config:{state:!0},_now:{state:!0}},j.styles=D`
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
  `;function bt(i,e){customElements.get(i)||customElements.define(i,e)}function qt(i){window.customCards=window.customCards||[],window.customCards.some(e=>e.type===i.type)||window.customCards.push(i)}bt(Bt,W);qt({type:Bt,name:"Chronothermostat editor",preview:!1});bt(Vt,j);qt({type:Vt,name:"Chronothermostat viewer",preview:!1});bt(Gt,B);bt(jt,yt);qt({type:Gt,name:"Chronothermostat scenario",preview:!1});
