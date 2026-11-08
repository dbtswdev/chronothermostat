/*! chronothermostat-cards v0.1.0 */
var at=globalThis,dt=at.ShadowRoot&&(at.ShadyCSS===void 0||at.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yt=Symbol(),Bt=new WeakMap,V=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==yt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(dt&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Bt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Bt.set(t,e))}return e}toString(){return this.cssText}},jt=i=>new V(typeof i=="string"?i:i+"",void 0,yt),R=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new V(t,i,yt)},Gt=(i,e)=>{if(dt)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),r=at.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}},vt=dt?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return jt(t)})(i):i;var{is:He,defineProperty:Le,getOwnPropertyDescriptor:Me,getOwnPropertyNames:Ne,getOwnPropertySymbols:ze,getPrototypeOf:Ie}=Object,C=globalThis,Vt=C.trustedTypes,Fe=Vt?Vt.emptyScript:"",bt=C.reactiveElementPolyfillSupport,q=(i,e)=>i,$t={toAttribute(i,e){switch(e){case Boolean:i=i?Fe:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},Jt=(i,e)=>!He(i,e),qt={attribute:!0,type:String,converter:$t,reflect:!1,useDefault:!1,hasChanged:Jt},Zt,Yt;(Zt=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(Yt=C.litPropertyMetadata)!=null||(C.litPropertyMetadata=new WeakMap);var w=class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),((t=this.l)!=null?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=qt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),r=this.getPropertyDescriptor(e,s,t);r!==void 0&&Le(this.prototype,e,r)}}static getPropertyDescriptor(e,t,s){var o;let{get:r,set:n}=(o=Me(this.prototype,e))!=null?o:{get(){return this[t]},set(d){this[t]=d}};return{get:r,set(d){let a=r==null?void 0:r.call(this);n==null||n.call(this,d),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){var t;return(t=this.elementProperties.get(e))!=null?t:qt}static _$Ei(){if(this.hasOwnProperty(q("elementProperties")))return;let e=Ie(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(q("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(q("properties"))){let t=this.properties,s=[...Ne(t),...ze(t)];for(let r of s)this.createProperty(r,t[r])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,r]of t)this.elementProperties.set(s,r)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let r=this._$Eu(t,s);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let r of s)t.unshift(vt(r))}else e!==void 0&&t.push(vt(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t,s;((t=this._$EO)!=null?t:this._$EO=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){var t;let e=(t=this.shadowRoot)!=null?t:this.attachShadow(this.constructor.shadowRootOptions);return Gt(e,this.constructor.elementStyles),e}connectedCallback(){var e,t;(e=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostConnected)==null?void 0:r.call(s)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var n;let s=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,s);if(r!==void 0&&s.reflect===!0){let o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:$t).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){var n,o,d;let s=this.constructor,r=s._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let a=s.getPropertyOptions(r),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:$t;this._$Em=r;let h=l.fromAttribute(t,a.type);this[r]=(d=h!=null?h:(o=this._$Ej)==null?void 0:o.get(r))!=null?d:h,this._$Em=null}}requestUpdate(e,t,s,r=!1,n){var o,d;if(e!==void 0){let a=this.constructor;if(r===!1&&(n=this[e]),s!=null||(s=a.getPropertyOptions(e)),!(((o=s.hasChanged)!=null?o:Jt)(n,t)||s.useDefault&&s.reflect&&n===((d=this._$Ej)==null?void 0:d.get(e))&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:r,wrapped:n},o){var d,a,l;s&&!((d=this._$Ej)!=null?d:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,(a=o!=null?o:t)!=null?a:this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&((l=this._$Eq)!=null?l:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,r;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,d]of this._$Ep)this[o]=d;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,d]of n){let{wrapped:a}=d,l=this[o];a!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,d,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(r=this._$EO)==null||r.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}},Xt;w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[q("elementProperties")]=new Map,w[q("finalized")]=new Map,bt==null||bt({ReactiveElement:w}),((Xt=C.reactiveElementVersions)!=null?Xt:C.reactiveElementVersions=[]).push("2.1.2");var Y=globalThis,Qt=i=>i,ct=Y.trustedTypes,te=ct?ct.createPolicy("lit-html",{createHTML:i=>i}):void 0,ae="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,de="?"+T,Ue=`<${de}>`,O=document,X=()=>O.createComment(""),J=i=>i===null||typeof i!="object"&&typeof i!="function",kt=Array.isArray,We=i=>kt(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",wt=`[ 	
\f\r]`,Z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ee=/-->/g,se=/>/g,D=RegExp(`>|${wt}(?:([^\\s"'>=/]+)(${wt}*=${wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),re=/'/g,ie=/"/g,ce=/^(?:script|style|textarea|title)$/i,Rt=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),m=Rt(1),k=Rt(2),ms=Rt(3),H=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),ne=new WeakMap,P=O.createTreeWalker(O,129);function le(i,e){if(!kt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return te!==void 0?te.createHTML(e):e}var Ke=(i,e)=>{let t=i.length-1,s=[],r,n=e===2?"<svg>":e===3?"<math>":"",o=Z;for(let d=0;d<t;d++){let a=i[d],l,h,c=-1,p=0;for(;p<a.length&&(o.lastIndex=p,h=o.exec(a),h!==null);)p=o.lastIndex,o===Z?h[1]==="!--"?o=ee:h[1]!==void 0?o=se:h[2]!==void 0?(ce.test(h[2])&&(r=RegExp("</"+h[2],"g")),o=D):h[3]!==void 0&&(o=D):o===D?h[0]===">"?(o=r!=null?r:Z,c=-1):h[1]===void 0?c=-2:(c=o.lastIndex-h[2].length,l=h[1],o=h[3]===void 0?D:h[3]==='"'?ie:re):o===ie||o===re?o=D:o===ee||o===se?o=Z:(o=D,r=void 0);let _=o===D&&i[d+1].startsWith("/>")?" ":"";n+=o===Z?a+Ue:c>=0?(s.push(l),a.slice(0,c)+ae+a.slice(c)+T+_):a+T+(c===-2?d:_)}return[le(i,n+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},Q=class i{constructor({strings:e,_$litType$:t},s){let r;this.parts=[];let n=0,o=0,d=e.length-1,a=this.parts,[l,h]=Ke(e,t);if(this.el=i.createElement(l,s),P.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=P.nextNode())!==null&&a.length<d;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith(ae)){let p=h[o++],_=r.getAttribute(c).split(T),y=/([.?@])?(.*)/.exec(p);a.push({type:1,index:n,name:y[2],strings:_,ctor:y[1]==="."?At:y[1]==="?"?Et:y[1]==="@"?Ct:I}),r.removeAttribute(c)}else c.startsWith(T)&&(a.push({type:6,index:n}),r.removeAttribute(c));if(ce.test(r.tagName)){let c=r.textContent.split(T),p=c.length-1;if(p>0){r.textContent=ct?ct.emptyScript:"";for(let _=0;_<p;_++)r.append(c[_],X()),P.nextNode(),a.push({type:2,index:++n});r.append(c[p],X())}}}else if(r.nodeType===8)if(r.data===de)a.push({type:2,index:n});else{let c=-1;for(;(c=r.data.indexOf(T,c+1))!==-1;)a.push({type:7,index:n}),c+=T.length-1}n++}}static createElement(e,t){let s=O.createElement("template");return s.innerHTML=e,s}};function z(i,e,t=i,s){var o,d,a;if(e===H)return e;let r=s!==void 0?(o=t._$Co)==null?void 0:o[s]:t._$Cl,n=J(e)?void 0:e._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((d=r==null?void 0:r._$AO)==null||d.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,t,s)),s!==void 0?((a=t._$Co)!=null?a:t._$Co=[])[s]=r:t._$Cl=r),r!==void 0&&(e=z(i,r._$AS(i,e.values),r,s)),e}var St=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var l;let{el:{content:t},parts:s}=this._$AD,r=((l=e==null?void 0:e.creationScope)!=null?l:O).importNode(t,!0);P.currentNode=r;let n=P.nextNode(),o=0,d=0,a=s[0];for(;a!==void 0;){if(o===a.index){let h;a.type===2?h=new tt(n,n.nextSibling,this,e):a.type===1?h=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(h=new Tt(n,this,e)),this._$AV.push(h),a=s[++d]}o!==(a==null?void 0:a.index)&&(n=P.nextNode(),o++)}return P.currentNode=O,r}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},tt=class i{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,s,r){var n;this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=r,this._$Cv=(n=r==null?void 0:r.isConnected)!=null?n:!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=z(this,e,t),J(e)?e===f||e==null||e===""?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==H&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):We(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==f&&J(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){var n;let{values:t,_$litType$:s}=e,r=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=Q.createElement(le(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(t);else{let o=new St(r,this),d=o.u(this.options);o.p(t),this.T(d),this._$AH=o}}_$AC(e){let t=ne.get(e.strings);return t===void 0&&ne.set(e.strings,t=new Q(e)),t}k(e){kt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,r=0;for(let n of e)r===t.length?t.push(s=new i(this.O(X()),this.O(X()),this,this.options)):s=t[r],s._$AI(n),r++;r<t.length&&(this._$AR(s&&s._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){let r=Qt(e).nextSibling;Qt(e).remove(),e=r}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},I=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,r,n){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=f}_$AI(e,t=this,s,r){let n=this.strings,o=!1;if(n===void 0)e=z(this,e,t,0),o=!J(e)||e!==this._$AH&&e!==H,o&&(this._$AH=e);else{let d=e,a,l;for(e=n[0],a=0;a<n.length-1;a++)l=z(this,d[s+a],t,a),l===H&&(l=this._$AH[a]),o||(o=!J(l)||l!==this._$AH[a]),l===f?e=f:e!==f&&(e+=(l!=null?l:"")+n[a+1]),this._$AH[a]=l}o&&!r&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}},At=class extends I{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}},Et=class extends I{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==f)}},Ct=class extends I{constructor(e,t,s,r,n){super(e,t,s,r,n),this.type=5}_$AI(e,t=this){var o;if((e=(o=z(this,e,t,0))!=null?o:f)===H)return;let s=this._$AH,r=e===f&&s!==f||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==f&&(s===f||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;typeof this._$AH=="function"?this._$AH.call((s=(t=this.options)==null?void 0:t.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}},Tt=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){z(this,e)}};var xt=Y.litHtmlPolyfillSupport,oe;xt==null||xt(Q,tt),((oe=Y.litHtmlVersions)!=null?oe:Y.litHtmlVersions=[]).push("3.3.3");var he=(i,e,t)=>{var n,o;let s=(n=t==null?void 0:t.renderBefore)!=null?n:e,r=s._$litPart$;if(r===void 0){let d=(o=t==null?void 0:t.renderBefore)!=null?o:null;s._$litPart$=r=new tt(e.insertBefore(X(),d),d,void 0,t!=null?t:{})}return r._$AI(i),r};var L=globalThis,v=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,s;let e=super.createRenderRoot();return(s=(t=this.renderOptions).renderBefore)!=null||(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=he(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return H}},ue;v._$litElement$=!0,v.finalized=!0,(ue=L.litElementHydrateSupport)==null||ue.call(L,{LitElement:v});var Dt=L.litElementPolyfillSupport;Dt==null||Dt({LitElement:v});var pe;((pe=L.litElementVersions)!=null?pe:L.litElementVersions=[]).push("4.2.2");var lt="chronothermostat";function ht(i){return i.callWS({type:`${lt}/info`})}function Pt(i,e,t){return i.callWS({type:`${lt}/get_program`,zone:e,program:t})}function _e(i,e,t,s,r){return i.callService(lt,"set_program",{zone:e,program:t,weekday:s,values:r})}var M=i=>i<10?`0${i}`:String(i);function Be(i){let e=-i.getTimezoneOffset(),t=e>=0?"+":"-",s=Math.abs(e);return`${i.getFullYear()}-${M(i.getMonth()+1)}-${M(i.getDate())}T${M(i.getHours())}:${M(i.getMinutes())}:${M(i.getSeconds())}${t}${M(Math.floor(s/60))}:${M(s%60)}`}function fe(i,e,t){let s={scenario:e};return t&&(s.return_at=Be(t)),i.callService(lt,"set_scenario",s)}function ut(i,e,t){if(i.length===0)return[e,t];let s=Math.max(e,Math.floor(Math.min(...i))-1),r=Math.min(t,Math.ceil(Math.max(...i))+1);return r-s<5&&(r=Math.min(t,s+5),s=Math.max(e,r-5)),[s,r]}function et(i,e){let{width:t,height:s,min:r,max:n,padLeft:o,padBottom:d}=e,a=t-o,l=s-d,h=n-r||1,c=g=>l*(1-(Math.min(n,Math.max(r,g))-r)/h),p=a/96,_=i.map((g,nt)=>{let ot=c(g);return{x:o+nt*p,y:ot,w:p,h:l-ot}}),y=h<=6?1:h<=12?2:5,E=[];for(let g=Math.ceil(r/y)*y;g<=n;g+=y)E.push({y:c(g),label:String(g)});let it=[0,6,12,18,24].map(g=>({x:o+a*g/24,label:String(g)}));return{bars:_,yTicks:E,xTicks:it}}function me(i,e){let t=Math.floor((i-e.padLeft)/(e.width-e.padLeft)*96);return Math.min(95,Math.max(0,t))}var ge=(i,e,t)=>Math.min(t,Math.max(e,i));function Ot(i,e){return{...i,cursor:ge(Math.round(e),0,95)}}function Ht(i,e){return Ot(i,i.cursor+e)}function Lt(i,e){let t=ge(Math.round((i.values[i.cursor]+e)/.5)*.5,i.min,i.max),s=i.values.slice();return s[i.cursor]=t,{...i,values:s}}function ye(i){if(i.cursor>=95)return i;let e=i.values.slice();return e[i.cursor+1]=e[i.cursor],{...i,values:e,cursor:i.cursor+1}}function Mt(i,e){return{...i,values:e.slice()}}function F(i){return i.values.length!==i.saved.length||i.values.some((e,t)=>e!==i.saved[t])}var st=["mon","tue","wed","thu","fri","sat","sun"],je={it:{mon:["luned\xEC","Lun"],tue:["marted\xEC","Mar"],wed:["mercoled\xEC","Mer"],thu:["gioved\xEC","Gio"],fri:["venerd\xEC","Ven"],sat:["sabato","Sab"],sun:["domenica","Dom"]},en:{mon:["Monday","Mon"],tue:["Tuesday","Tue"],wed:["Wednesday","Wed"],thu:["Thursday","Thu"],fri:["Friday","Fri"],sat:["Saturday","Sat"],sun:["Sunday","Sun"]}};function x(i,e,t=!1){return je[e][i][t?1:0]}function N(i){return st[(i.getDay()+6)%7]}var pt=i=>i<10?`0${i}`:String(i);function S(i,e){let t=i.toFixed(1);return`${e==="it"?t.replace(".",","):t} \xB0C`}function ve(i){return`${pt(Math.floor(i/4))}:${pt(i%4*15)}`}var Nt=i=>`${pt(i.getHours())}:${pt(i.getMinutes())}`;function be(i,e,t){let s=Nt(i),r=a=>new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime(),n=new Date(e.getFullYear(),e.getMonth(),e.getDate()+1).getTime(),o=r(i);if(o<=r(e))return t==="it"?`fino alle ${s}`:`until ${s}`;if(o===n)return t==="it"?`fino a domani alle ${s}`:`until tomorrow at ${s}`;let d=x(N(i),t);return t==="it"?`fino a ${d} alle ${s}`:`until ${d} at ${s}`}function _t(i,e){let t=x(N(i),e);return e==="it"?`${t} ${i.getDate()} alle ${Nt(i)}`:`${t} ${i.getDate()} at ${Nt(i)}`}function $e(i,e,t={delay:450,interval:110}){let s,r=()=>{s!==void 0&&clearTimeout(s),s=void 0},n=()=>{e(),s=setTimeout(n,t.interval)},o=a=>{a.preventDefault(),r(),e(),s=setTimeout(n,t.delay)},d=a=>a.preventDefault();return i.addEventListener("pointerdown",o),i.addEventListener("pointerup",r),i.addEventListener("pointerleave",r),i.addEventListener("pointercancel",r),i.addEventListener("contextmenu",d),()=>{r(),i.removeEventListener("pointerdown",o),i.removeEventListener("pointerup",r),i.removeEventListener("pointerleave",r),i.removeEventListener("pointercancel",r),i.removeEventListener("contextmenu",d)}}var Ge={none:"No changes",unsaved:"Unsaved changes",saved_day:"{day} program saved",editing:"Editing:",work:"Work",holiday:"Holiday",away:"Away",off:"Off",continue:"Continue",save:"Save",copy_from:"Copy from\u2026",copy_from_hint:"Copy the saved program of:",discard:"Discard",confirm:"Confirm",cancel:"Cancel",today:"Today",today_day:"Today, {day}",prev_slot:"Previous quarter hour",next_slot:"Next quarter hour",temp_down:"Lower temperature",temp_up:"Raise temperature",return_date:"Return date",return_time:"Return time",error_load:"Could not load the data.",error_save:"Could not save.",house_scenario:"House scenario",return_required:"Set the return day and time",house_work:"The house follows the Work program.",house_holiday:"The house follows the Holiday program.",house_away:"Heating off until {when}, then it switches to Work by itself.",house_away_no_return:"Away with no return: stays off until you set a return.",house_off:"Heating off until you pick another scenario.",status_schedule:"Schedule: {temp} {until}, then {next}.",status_schedule_flat:"Schedule: {temp}.",status_forced:"Forced to {temp} {until}, then back to the schedule ({next}).",status_forced_flat:"Forced to {temp}.",status_zone_off:"Switched off by you. The schedule resumes when you turn it back on.",status_away:"Away: off until {when}, then Work.",status_away_no_return:"Away with no return: stays off until you set a return.",status_off:"Heating off.",status_zone_on_manual:"Turned on by hand with the heating off: stays at {temp} until you turn it off or change scenario.",status_unavailable:"Thermostat unavailable.",config_entity:"Thermostat",config_name:"Name (optional)"},Ve={none:"Nessuna modifica",unsaved:"Modifiche non salvate",saved_day:"Programma di {day} salvato",editing:"Stai modificando:",work:"Lavoro",holiday:"Ferie",away:"Fuori casa",off:"Spento",continue:"Prosegui",save:"Salva",copy_from:"Copia da\u2026",copy_from_hint:"Copia il programma salvato di:",discard:"Scarta",confirm:"Conferma",cancel:"Annulla",today:"Oggi",today_day:"Oggi, {day}",prev_slot:"Quarto d'ora precedente",next_slot:"Quarto d'ora successivo",temp_down:"Abbassa la temperatura",temp_up:"Alza la temperatura",return_date:"Giorno di rientro",return_time:"Ora di rientro",error_load:"Impossibile caricare i dati.",error_save:"Salvataggio non riuscito.",house_scenario:"Scenario della casa",return_required:"Indica giorno e ora del rientro",house_work:"La casa segue il programma Lavoro.",house_holiday:"La casa segue il programma Ferie.",house_away:"Impianto spento fino a {when}, poi passa da solo a Lavoro.",house_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",house_off:"Impianto spento finch\xE9 non scegli un altro scenario.",status_schedule:"Programma: {temp} {until}, poi {next}.",status_schedule_flat:"Programma: {temp}.",status_forced:"Forzato a {temp} {until}, poi torna al programma ({next}).",status_forced_flat:"Forzato a {temp}.",status_zone_off:"Spento da te. Il programma riparte quando lo riaccendi.",status_away:"Fuori casa: spento fino a {when}, poi Lavoro.",status_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",status_off:"Impianto spento.",status_zone_on_manual:"Acceso a mano con impianto spento: resta a {temp} finch\xE9 non lo spegni o cambi scenario.",status_unavailable:"Termostato non disponibile.",config_entity:"Termostato",config_name:"Nome (facoltativo)"},we={en:Ge,it:Ve};function b(i){var t,s,r;return((r=(s=(t=i==null?void 0:i.locale)==null?void 0:t.language)!=null?s:i==null?void 0:i.language)!=null?r:"").toLowerCase().startsWith("it")?"it":"en"}function u(i,e,t){var r,n,o;let s=(o=(n=(r=we[i])==null?void 0:r[e])!=null?n:we.en[e])!=null?o:e;return t?s.replace(/\{(\w+)\}/g,(d,a)=>a in t?String(t[a]):d):s}var U="chronothermostat-zone-card-editor",qe=[{name:"entity",selector:{entity:{domain:"climate"}}},{name:"name",selector:{text:{}}}],ft=class extends v{constructor(){super(...arguments);this._label=t=>u(b(this.hass),t.name==="entity"?"config_entity":"config_name")}setConfig(t){this._config=t}render(){return!this.hass||!this._config?f:m`<ha-form .hass=${this.hass} .data=${this._config} .schema=${qe}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`}_changed(t){t.stopPropagation();let s={...t.detail.value};s.name||delete s.name,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}};ft.properties={hass:{attribute:!1},_config:{state:!0}};customElements.get(U)||customElements.define(U,ft);var zt="chronothermostat-editor-card",Ze=["work","holiday"],Ye=["prev","next","cont","minus","plus"],xe=.5,Xe=3e3,Je=3e4,Se=150,Ae=8,mt=26,Ee=22,Qe=452,Ce=i=>i.charAt(0).toUpperCase()+i.slice(1),ts=i=>i.getHours()*4+Math.floor(i.getMinutes()/15),A=i=>Math.round(i*100)/100,Te=i=>st.every(e=>{var t;return Array.isArray((t=i.weekdays)==null?void 0:t[e])&&i.weekdays[e].length===96}),es=m`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M3 12h13M11 6l6 6-6 6M21 5v14" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`,W=class extends v{constructor(){super();this._lastLoadAttempt=0;this._loadToken=0;this._holds=new Map;this._observedChart=null;this._program="work",this._day=N(new Date),this._loadFailed=!1,this._copyOpen=!1,this._saving=!1,this._loading=!1,this._chartWidth=Qe}static getConfigElement(){return document.createElement(U)}static getStubConfig(t){var r;let s=Object.keys((r=t==null?void 0:t.states)!=null?r:{}).find(n=>n.startsWith("climate."));return{entity:s!=null?s:""}}setConfig(t){if(!t||typeof t.entity!="string"||t.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==t.entity&&this._reset(),this._config={...t}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this._holds.forEach(t=>t.detach()),this._holds.clear(),this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=null,this._clearSaved()}shouldUpdate(t){if(t.size===1&&t.has("hass")){let s=t.get("hass");return!s||b(s)!==b(this.hass)||this._needsLoad()}return!0}willUpdate(){this._needsLoad()&&this._load()}updated(){this.isConnected&&(this._syncHolds(),this._observeChart())}render(){if(!this._config)return f;let t=b(this.hass);if(this._loadFailed)return m`<ha-card><div class="load-error error">${u(t,"error_load")}</div></ha-card>`;let s=this._state;if(!s)return m`<ha-card></ha-card>`;let[r,n]=this._status(t,s);return m`<ha-card>
      <div class="row">
        <span class="label">${u(t,"editing")}</span>
        ${Ze.map(o=>m`<button class="chip program ${o===this._program?"on":""}"
          data-program=${o} aria-pressed=${o===this._program?"true":"false"}
          @click=${()=>this._select({program:o,day:this._day})}>${u(t,o)}</button>`)}
      </div>
      <div class="row days">
        ${st.map(o=>m`<button class="chip day ${o===this._day?"on":""}"
          data-day=${o} aria-pressed=${o===this._day?"true":"false"}
          @click=${()=>this._select({program:this._program,day:o})}>
          ${x(o,t,!0)}
        </button>`)}
      </div>
      ${this._pending&&F(s)?this._renderDirtyBar(t):f}
      <div class="reading ${this._loading?"loading":""}">
        <span><span class="day-name">${Ce(x(this._day,t))}</span><span
          class="time">${ve(s.cursor)}</span></span>
        <span class="temp">${S(s.values[s.cursor],t)}</span>
      </div>
      ${this._renderChart(s)}
      <div class="controls">
        <button class="big hold" id="prev" ?disabled=${this._loading} aria-label=${u(t,"prev_slot")}>
          <span class="glyph" aria-hidden="true">‹</span>
        </button>
        <button class="big hold" id="next" ?disabled=${this._loading} aria-label=${u(t,"next_slot")}>
          <span class="glyph" aria-hidden="true">›</span>
        </button>
        <button class="big hold wide" id="cont" ?disabled=${this._loading}>
          ${es}<span>${u(t,"continue")}</span>
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
        <span class="status ${n}">${r}</span>
      </div>
      ${this._copyOpen?this._renderCopyPanel(t):f}
    </ha-card>`}_renderDirtyBar(t){return m`<div class="dirty-bar">
      <span class="message">${u(t,"unsaved")}</span>
      <button class="big" id="bar-discard" @click=${this._discardPending}>${u(t,"discard")}</button>
      <button class="big save" id="bar-save" ?disabled=${this._saving}
        @click=${this._saveAndContinue}>
        ${u(t,"save")}
      </button>
    </div>`}_renderChart(t){let s=this._chartWidth,r=Se-Ae,[n,o]=ut(t.values,t.min,t.max),d=et(t.values,{width:s,height:r,min:n,max:o,padLeft:mt,padBottom:Ee}),a=r-Ee,l=d.bars[t.cursor],h=A(l.x+l.w/2),c=d.xTicks.length-1;return m`<div class="chart ${this._loading?"loading":""}">
      <svg viewBox="0 0 ${s} ${Se}" @pointerdown=${this._onChartDown}>
        <g transform="translate(0 ${Ae})">
          ${d.yTicks.map(p=>k`
            <line class="grid" x1=${mt} x2=${s}
              y1=${A(p.y)} y2=${A(p.y)}></line>
            <text class="axis" x=${mt-5} y=${A(p.y)} dy="0.35em"
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
        ${st.filter(s=>s!==this._day).map(s=>m`<button class="chip" data-day=${s} @click=${()=>this._copyFrom(s)}>
            ${Ce(x(s,t))}
          </button>`)}
      </div>
    </div>`}_status(t,s){return this._failure?[u(t,this._failure),"error"]:F(s)?[u(t,"unsaved"),"warning"]:this._savedDay?[u(t,"saved_day",{day:x(this._savedDay,t)}),"success"]:[u(t,"none"),""]}_zoneName(){let t=this._config;if(!t)return"";if(t.name)return t.name;let r=(this._info?this._info.zones:[]).find(n=>n.entity_id===t.entity);return r?r.name:""}_needsLoad(){return!this.hass||!this._config?!1:this._loadedFor!==this._config.entity?!0:this._loadFailed&&Date.now()-this._lastLoadAttempt>=Je}_reset(){this._loadToken++,this._loadedFor=void 0,this._shown=void 0,this._data=void 0,this._state=void 0,this._loading=!1,this._loadFailed=!1,this._failure=void 0,this._pending=void 0,this._copyOpen=!1,this._clearSaved()}async _load(){let t=this.hass,s=this._config;if(!t||!s)return;let r=s.entity;this._loadedFor=r,this._lastLoadAttempt=Date.now();let n;try{if(this._info||(this._info=await ht(t)),this._loadedFor!==r)return;if(!this._info.zones.some(l=>l.entity_id===r))throw new Error(`${r} is not a chronothermostat zone`);let d=this._info.scenario_entity_id,a=d?t.states[d]:void 0;n=a&&a.state==="holiday"?"holiday":"work"}catch{this._loadedFor===r&&this._firstLoadFailed();return}let o=new Date;await this._switchTo({program:n,day:N(o)},ts(o))}_firstLoadFailed(){this._info=void 0,this._loadFailed=!0}_select(t){if(t.program===this._program&&t.day===this._day){this._pending=void 0;return}if(this._state&&F(this._state)){this._pending=t;return}this._switchTo(t)}async _switchTo(t,s){let r=this.hass,n=this._config;if(!r||!n)return;let o=++this._loadToken;this._pending=void 0,this._copyOpen=!1,this._program=t.program,this._day=t.day,this._loading=!0;try{let d=await Pt(r,n.entity,t.program);if(o!==this._loadToken)return;if(!Te(d))throw new Error("Invalid program data");let a=s!==void 0?s:this._state?this._state.cursor:0;this._showDay(d,t,a)}catch{if(o!==this._loadToken)return;this._state&&this._shown?(this._program=this._shown.program,this._day=this._shown.day,this._failure="error_load"):this._firstLoadFailed()}finally{o===this._loadToken&&(this._loading=!1)}}_showDay(t,s,r){let n=t.weekdays[s.day];this._data=t,this._shown=s,this._loadFailed=!1,this._failure=void 0,this._state={values:n.slice(),saved:n.slice(),cursor:r,min:t.min_temp,max:t.max_temp}}_discardPending(){let t=this._pending;!t||!this._state||(this._state=Mt(this._state,this._state.saved),this._switchTo(t))}_hold(t){let s=this._state;!s||this._loading||(t==="prev"?this._state=Ht(s,-1):t==="next"?this._state=Ht(s,1):t==="cont"?this._edit(ye(s)):t==="minus"?this._edit(Lt(s,-xe)):this._edit(Lt(s,xe)))}_edit(t){this._state=t,this._failure=void 0,this._clearSaved(),this._pending&&!F(t)&&(this._pending=void 0)}_onChartDown(t){let s=this._state,r=t.currentTarget.getBoundingClientRect();if(!s||this._loading||r.width<=0)return;let n=(t.clientX-r.left)/r.width*this._chartWidth,o=me(n,{width:this._chartWidth,padLeft:mt});this._state=Ot(s,o)}_toggleCopy(){this._loading||(this._copyOpen=!this._copyOpen)}_copyFrom(t){this._copyOpen=!1,!(!this._state||!this._data||this._loading)&&this._edit(Mt(this._state,this._data.weekdays[t]))}async _saveAndContinue(){if(!await this._save())return;let t=this._pending;t&&this._state&&!F(this._state)&&await this._switchTo(t)}async _save(){let t=this.hass,s=this._config,r=this._state,n=this._shown;if(!t||!s||!r||!n||this._saving||this._loading)return!1;let o=r.values.slice(),d=this._loadToken;this._saving=!0;try{await _e(t,s.entity,n.program,n.day,o);let a=await Pt(t,s.entity,n.program);return d===this._loadToken&&this._state&&(Te(a)&&(this._data=a),this._state={...this._state,saved:o}),this._failure=void 0,this._flashSaved(n.day),!0}catch{return this._failure="error_save",!1}finally{this._saving=!1}}_flashSaved(t){this._clearSaved(),this._savedDay=t,this._savedTimer=setTimeout(()=>{this._savedTimer=void 0,this._savedDay=void 0},Xe)}_clearSaved(){this._savedTimer!==void 0&&clearTimeout(this._savedTimer),this._savedTimer=void 0,this._savedDay=void 0}_syncHolds(){for(let t of Ye){let s=this.renderRoot.querySelector(`#${t}`),r=this._holds.get(t);r&&r.el===s||(r&&r.detach(),this._holds.delete(t),s&&this._holds.set(t,{el:s,detach:$e(s,()=>this._hold(t))}))}}_observeChart(){let t=this.renderRoot.querySelector(".chart");t!==this._observedChart&&(this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=t,!(!t||typeof ResizeObserver=="undefined")&&(this._resizeObserver||(this._resizeObserver=new ResizeObserver(s=>{let r=Math.round(s[0].contentRect.width);r>0&&(this._chartWidth=r)})),this._resizeObserver.observe(t)))}};W.properties={hass:{attribute:!1},_config:{state:!0},_program:{state:!0},_day:{state:!0},_state:{state:!0},_loadFailed:{state:!0},_failure:{state:!0},_savedDay:{state:!0},_pending:{state:!0},_copyOpen:{state:!0},_saving:{state:!0},_loading:{state:!0},_chartWidth:{state:!0}},W.styles=R`
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
  `;var It="chronothermostat-scenario-card",Re=["work","holiday","away","off"],ss=3e4,ke=i=>i<10?`0${i}`:String(i),rs=i=>Re.includes(i);function is(i){let e=new Date(i.getFullYear(),i.getMonth(),i.getDate()+1,19,0);return{date:`${e.getFullYear()}-${ke(e.getMonth()+1)}-${ke(e.getDate())}`,time:"19:00"}}function ns(i,e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(i),s=/^(\d{2}):(\d{2})/.exec(e);if(!t||!s)return;let r=new Date(+t[1],+t[2]-1,+t[3],+s[1],+s[2]);return isNaN(r.getTime())?void 0:r}var B=class extends v{constructor(){super();this._infoPending=!1;this._infoTriedAt=0;this._config={},this._infoFailed=!1,this._busy=!1}static getStubConfig(){return{}}setConfig(t){this._config={...t!=null?t:{}}}getCardSize(){return 3}shouldUpdate(t){t.has("hass")&&this._ensureInfo();let s=this._current(),r=this._seen,n=!!r&&r.select===s.select&&r.returnAt===s.returnAt&&r.lang===s.lang;return this._seen=s,t.size===1&&t.has("hass")?!n:!0}_ensureInfo(){!this.hass||this._infoPending||this._info&&this._info.scenario_entity_id||this._infoTriedAt&&Date.now()-this._infoTriedAt<ss||(this._infoTriedAt=Date.now(),this._infoPending=!0,ht(this.hass).then(t=>{this._infoPending=!1,this._info=t,this._infoFailed=!(t!=null&&t.scenario_entity_id)},()=>{this._infoPending=!1,this._infoFailed=!0}))}_current(){var n,o,d;let t=(o=(n=this.hass)==null?void 0:n.states)!=null?o:{},{scenario_entity_id:s,return_at_entity_id:r}=(d=this._info)!=null?d:{};return{select:s?t[s]:void 0,returnAt:r?t[r]:void 0,lang:b(this.hass)}}_tap(t){if(!this._busy){if(this._message=void 0,t==="away"||t==="off"){this._panel=this._panel===t?void 0:t;return}this._panel=void 0,this._apply(t)}}async _apply(t,s){if(!(!this.hass||this._busy)){this._busy=!0,this._message=void 0;try{await fe(this.hass,t,s),(t==="away"||t==="off")&&(this._panel=void 0)}catch(r){let n=r instanceof Error?r.message:"";this._message=n||u(b(this.hass),"error_save")}finally{this._busy=!1}}}_confirmAway(){let t=r=>{var n,o;return(o=(n=this.renderRoot.querySelector(r))==null?void 0:n.value)!=null?o:""},s=ns(t('input[type="date"]'),t('input[type="time"]'));if(!s||s.getTime()<=Date.now()){this._message=u(b(this.hass),"return_required");return}this._apply("away",s)}render(){let t=b(this.hass),{select:s,returnAt:r}=this._current(),n=rs(s==null?void 0:s.state)?s==null?void 0:s.state:void 0,o=this._config.name||u(t,"house_scenario"),d=this._infoFailed?"error_load":void 0;return m`<ha-card>
      <div class="label">${o}</div>
      <div class="chips">
        ${Re.map(a=>m`<button
            class="chip ${a} ${n===a?"active":""}"
            data-scenario=${a}
            aria-pressed=${n===a?"true":"false"}
            ?disabled=${this._busy}
            @click=${()=>this._tap(a)}
          >${u(t,a)}</button>`)}
      </div>
      ${this._panel?this._renderPanel(this._panel,t):f}
      ${this._message?m`<div class="error">${this._message}</div>`:f}
      ${d?m`<div class="error">${u(t,d)}</div>`:f}
      ${!d&&n?m`<div class="sentence">${this._sentence(n,r,t)}</div>`:f}
    </ha-card>`}_renderPanel(t,s){let r=m`<div class="buttons">
      <button class="action confirm" ?disabled=${this._busy}
        @click=${()=>t==="off"?void this._apply("off"):this._confirmAway()}>${u(s,"confirm")}</button>
      <button class="action cancel" @click=${()=>{this._panel=void 0,this._message=void 0}}>${u(s,"cancel")}</button>
    </div>`;if(t==="off")return m`<div class="panel">${r}</div>`;let n=is(new Date);return m`<div class="panel">
      <div class="fields">
        <label>${u(s,"return_date")}<input type="date" .value=${n.date} /></label>
        <label>${u(s,"return_time")}<input type="time" step="900" .value=${n.time} /></label>
      </div>
      ${r}
    </div>`}_sentence(t,s,r){var n;switch(t){case"work":return u(r,"house_work");case"holiday":return u(r,"house_holiday");case"off":return u(r,"house_off");default:{let o=new Date((n=s==null?void 0:s.state)!=null?n:"");return isNaN(o.getTime())||o.getTime()<=Date.now()?u(r,"house_away_no_return"):u(r,"house_away",{when:_t(o,r)})}}}};B.properties={hass:{attribute:!1},_config:{state:!0},_info:{state:!0},_infoFailed:{state:!0},_panel:{state:!0},_message:{state:!0},_busy:{state:!0}},B.styles=R`
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
  `;var Ft="chronothermostat-viewer-card",os="chronothermostat",as=6e4,gt=480,rt=100,ds=5,cs=35,ls=new Set(["away","away_no_return","off","zone_on_manual"]),De=i=>i<10?`0${i}`:String(i),hs=i=>i.charAt(0).toUpperCase()+i.slice(1),$=i=>Math.round(i*100)/100,Pe=i=>i.getHours()*4+Math.floor(i.getMinutes()/15),j=i=>typeof i=="number"&&Number.isFinite(i),Oe=i=>new Date(i.getFullYear(),i.getMonth(),i.getDate()).getTime(),G=class extends v{constructor(){super(),this._now=new Date}static getConfigElement(){return document.createElement(U)}static getStubConfig(e){var s;let t=Object.keys((s=e==null?void 0:e.states)!=null?s:{}).find(r=>r.startsWith("climate."));return{entity:t!=null?t:""}}setConfig(e){if(!e||typeof e.entity!="string"||e.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==e.entity&&(this._sensorId=void 0),this._config={...e}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this._now=new Date,this._timer=setInterval(()=>{this._now=new Date},as)}disconnectedCallback(){super.disconnectedCallback(),this._timer!==void 0&&clearInterval(this._timer),this._timer=void 0}shouldUpdate(e){let t=this._current(),s=this._seen,r=!!s&&s.sensor===t.sensor&&s.climate===t.climate&&s.lang===t.lang;return this._seen=t,e.size===1&&e.has("hass")?!r:!0}_resolveSensor(){var d,a,l,h,c;let e=(a=(d=this.hass)==null?void 0:d.states)!=null?a:{},t=(l=this._config)==null?void 0:l.entity,s=this._sensorId?e[this._sensorId]:void 0;if(s&&((h=s.attributes)==null?void 0:h.zone)===t)return s;let r=Object.keys(e).filter(p=>{var _,y;return p.startsWith("sensor.")&&((y=(_=e[p])==null?void 0:_.attributes)==null?void 0:y.zone)===t}),n=(c=this.hass)==null?void 0:c.entities,o=n&&r.find(p=>{var _;return((_=n[p])==null?void 0:_.platform)===os})||r[0];return this._sensorId=o,o?e[o]:void 0}_current(){var e,t;return{sensor:this._resolveSensor(),climate:this._config?(t=(e=this.hass)==null?void 0:e.states)==null?void 0:t[this._config.entity]:void 0,lang:b(this.hass)}}render(){var E;let{sensor:e,climate:t,lang:s}=this._current(),r=!e||e.state==="unavailable"||e.state==="unknown"?"unavailable":e.state,n=(E=e==null?void 0:e.attributes)!=null?E:{},o=Array.isArray(n.today)?n.today:[],d=!!e&&!ls.has(r)&&r!=="unavailable"&&o.length===96&&o.every(j),a=this._now,l=x(N(a),s),h=n.program==="work"||n.program==="holiday"?n.program:void 0,c=h?`${u(s,"today_day",{day:l})} \xB7 ${u(s,h)}`:hs(l),p=`${De(a.getHours())}:${De(a.getMinutes())}`,[_,y]=this._sentence(r,n,t,s);return m`<ha-card>
      <div class="header">
        <span class="title">${c}</span><span class="clock">${p}</span>
      </div>
      ${d?this._chart(r,o,n,t):f}
      <div class="sentence" style=${y}>${_}</div>
    </ha-card>`}_sentence(e,t,s,r){var p;let n=(p=s==null?void 0:s.attributes)==null?void 0:p.temperature,o=this._now,d=typeof t.next_step_at=="string"?new Date(t.next_step_at):void 0,a=!!d&&!isNaN(d.getTime())&&j(t.next_step_target),l=a?be(d,o,r):"",h=a?S(t.next_step_target,r):"",c=(_,y)=>[u(r,_,y),""];switch(e){case"schedule":return j(t.program_target)?a?c("status_schedule",{temp:S(t.program_target,r),until:l,next:h}):c("status_schedule_flat",{temp:S(t.program_target,r)}):c("status_unavailable");case"forced":return j(n)?a?c("status_forced",{temp:S(n,r),until:l,next:h}):c("status_forced_flat",{temp:S(n,r)}):c("status_unavailable");case"zone_off":return[u(r,"status_zone_off"),"color: var(--error-color)"];case"zone_on_manual":return j(n)?c("status_zone_on_manual",{temp:S(n,r)}):c("status_unavailable");case"away":{let _=typeof t.return_at=="string"?new Date(t.return_at):void 0;return!_||isNaN(_.getTime())?c("status_away_no_return"):c("status_away",{when:_t(_,r)})}case"away_no_return":return c("status_away_no_return");case"off":return c("status_off");default:return c("status_unavailable")}}_chart(e,t,s,r){var it;let n=this._now,o=Pe(n),d=(it=r==null?void 0:r.attributes)==null?void 0:it.temperature,a=e==="forced"&&j(d),[l,h]=ut(a?[...t,d]:t,ds,cs),c={width:gt,height:rt,min:l,max:h,padLeft:0,padBottom:0},p=et(t,c),_=gt/96,y=f;if(a){let g=typeof s.next_step_at=="string"?new Date(s.next_step_at):void 0,ot=g&&!isNaN(g.getTime())&&Oe(g)<=Oe(n)?Math.min(96,Math.max(o,Pe(g))):96,Kt=et([d],c).bars[0].y;y=k`<rect class="band" x=${$(o*_)} y=${$(Kt)}
        width=${$((ot-o)*_)} height=${$(rt-Kt)}></rect>`}let E=(n.getHours()*60+n.getMinutes())/1440*gt;return m`<div class="chart">
      <svg viewBox="0 0 ${gt} ${rt}" preserveAspectRatio="none" aria-hidden="true">
        ${[6,12,18].map(g=>k`<line class="grid" x1=${g*20} x2=${g*20}
          y1="0" y2=${rt}></line>`)}
        ${p.bars.map((g,nt)=>k`<rect class="bar ${nt<o?"past":""}"
          x=${$(g.x)} y=${$(g.y)} width=${$(g.w)}
          height=${$(g.h)}></rect>`)}
        ${y}
        <line class="now" x1=${$(E)} x2=${$(E)} y1="0" y2=${rt}></line>
      </svg>
    </div>`}};G.properties={hass:{attribute:!1},_config:{state:!0},_now:{state:!0}},G.styles=R`
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
  `;function Ut(i,e){customElements.get(i)||customElements.define(i,e)}function Wt(i){window.customCards=window.customCards||[],window.customCards.some(e=>e.type===i.type)||window.customCards.push(i)}Ut(zt,W);Wt({type:zt,name:"Chronothermostat editor",preview:!1});Ut(Ft,G);Wt({type:Ft,name:"Chronothermostat viewer",preview:!1});Ut(It,B);Wt({type:It,name:"Chronothermostat scenario",preview:!1});
