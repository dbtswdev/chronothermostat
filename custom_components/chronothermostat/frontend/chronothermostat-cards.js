/*! chronothermostat-cards v0.2.2 | third-party licences: THIRD-PARTY-NOTICES.txt */
var le=globalThis,de=le.ShadowRoot&&(le.ShadyCSS===void 0||le.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$e=Symbol(),tt=new WeakMap,J=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==$e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(de&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=tt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&tt.set(e,t))}return t}toString(){return this.cssText}},rt=s=>new J(typeof s=="string"?s:s+"",void 0,$e),L=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((r,i,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[n+1],s[0]);return new J(e,s,$e)},st=(s,t)=>{if(de)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),i=le.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=e.cssText,s.appendChild(r)}},Se=de?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return rt(e)})(s):s;var{is:rr,defineProperty:sr,getOwnPropertyDescriptor:ir,getOwnPropertyNames:nr,getOwnPropertySymbols:or,getPrototypeOf:ar}=Object,k=globalThis,it=k.trustedTypes,cr=it?it.emptyScript:"",Ae=k.reactiveElementPolyfillSupport,ee=(s,t)=>s,Ce={toAttribute(s,t){switch(t){case Boolean:s=s?cr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},lt=(s,t)=>!rr(s,t),nt={attribute:!0,type:String,converter:Ce,reflect:!1,useDefault:!1,hasChanged:lt},ot,at;(ot=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(at=k.litPropertyMetadata)!=null||(k.litPropertyMetadata=new WeakMap);var S=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),((e=this.l)!=null?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=nt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(t,r,e);i!==void 0&&sr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,r){var o;let{get:i,set:n}=(o=ir(this.prototype,t))!=null?o:{get(){return this[e]},set(c){this[e]=c}};return{get:i,set(c){let a=i==null?void 0:i.call(this);n==null||n.call(this,c),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return(e=this.elementProperties.get(t))!=null?e:nt}static _$Ei(){if(this.hasOwnProperty(ee("elementProperties")))return;let t=ar(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ee("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ee("properties"))){let e=this.properties,r=[...nr(e),...or(e)];for(let i of r)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,i]of e)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let i=this._$Eu(e,r);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let i of r)e.unshift(Se(i))}else t!==void 0&&e.push(Se(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e,r;((e=this._$EO)!=null?e:this._$EO=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&((r=t.hostConnected)==null||r.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var e;let t=(e=this.shadowRoot)!=null?e:this.attachShadow(this.constructor.shadowRootOptions);return st(t,this.constructor.elementStyles),t}connectedCallback(){var t,e;(t=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(r=>{var i;return(i=r.hostConnected)==null?void 0:i.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var r;return(r=e.hostDisconnected)==null?void 0:r.call(e)})}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){var n;let r=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,r);if(i!==void 0&&r.reflect===!0){let o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:Ce).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n,o,c;let r=this.constructor,i=r._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let a=r.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:Ce;this._$Em=i;let d=l.fromAttribute(e,a.type);this[i]=(c=d!=null?d:(o=this._$Ej)==null?void 0:o.get(i))!=null?c:d,this._$Em=null}}requestUpdate(t,e,r,i=!1,n){var o,c;if(t!==void 0){let a=this.constructor;if(i===!1&&(n=this[t]),r!=null||(r=a.getPropertyOptions(t)),!(((o=r.hasChanged)!=null?o:lt)(n,e)||r.useDefault&&r.reflect&&n===((c=this._$Ej)==null?void 0:c.get(t))&&!this.hasAttribute(a._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:i,wrapped:n},o){var c,a,l;r&&!((c=this._$Ej)!=null?c:this._$Ej=new Map).has(t)&&(this._$Ej.set(t,(a=o!=null?o:e)!=null?a:this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&((l=this._$Eq)!=null?l:this._$Eq=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((r=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,c]of this._$Ep)this[o]=c;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,c]of n){let{wrapped:a}=c,l=this[o];a!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,c,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(e)):this._$EM()}catch(n){throw t=!1,this._$EM(),n}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(r=>{var i;return(i=r.hostUpdated)==null?void 0:i.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}},ct;S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[ee("elementProperties")]=new Map,S[ee("finalized")]=new Map,Ae==null||Ae({ReactiveElement:S}),((ct=k.reactiveElementVersions)!=null?ct:k.reactiveElementVersions=[]).push("2.1.2");var re=globalThis,dt=s=>s,he=re.trustedTypes,ht=he?he.createPolicy("lit-html",{createHTML:s=>s}):void 0,yt="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,vt="?"+R,lr=`<${vt}>`,H=document,se=()=>H.createComment(""),ie=s=>s===null||typeof s!="object"&&typeof s!="function",Oe=Array.isArray,dr=s=>Oe(s)||typeof(s==null?void 0:s[Symbol.iterator])=="function",Te=`[ 	
\f\r]`,te=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ut=/-->/g,pt=/>/g,P=RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),mt=/'/g,_t=/"/g,bt=/^(?:script|style|textarea|title)$/i,He=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),_=He(1),A=He(2),Wr=He(3),M=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),ft=new WeakMap,O=H.createTreeWalker(H,129);function xt(s,t){if(!Oe(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return ht!==void 0?ht.createHTML(t):t}var hr=(s,t)=>{let e=s.length-1,r=[],i,n=t===2?"<svg>":t===3?"<math>":"",o=te;for(let c=0;c<e;c++){let a=s[c],l,d,u=-1,h=0;for(;h<a.length&&(o.lastIndex=h,d=o.exec(a),d!==null);)h=o.lastIndex,o===te?d[1]==="!--"?o=ut:d[1]!==void 0?o=pt:d[2]!==void 0?(bt.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=P):d[3]!==void 0&&(o=P):o===P?d[0]===">"?(o=i!=null?i:te,u=-1):d[1]===void 0?u=-2:(u=o.lastIndex-d[2].length,l=d[1],o=d[3]===void 0?P:d[3]==='"'?_t:mt):o===_t||o===mt?o=P:o===ut||o===pt?o=te:(o=P,i=void 0);let f=o===P&&s[c+1].startsWith("/>")?" ":"";n+=o===te?a+lr:u>=0?(r.push(l),a.slice(0,u)+yt+a.slice(u)+R+f):a+R+(u===-2?c:f)}return[xt(s,n+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},ne=class s{constructor({strings:t,_$litType$:e},r){let i;this.parts=[];let n=0,o=0,c=t.length-1,a=this.parts,[l,d]=hr(t,e);if(this.el=s.createElement(l,r),O.currentNode=this.el.content,e===2||e===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=O.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(yt)){let h=d[o++],f=i.getAttribute(u).split(R),g=/([.?@])?(.*)/.exec(h);a.push({type:1,index:n,name:g[2],strings:f,ctor:g[1]==="."?Re:g[1]==="?"?De:g[1]==="@"?Le:V}),i.removeAttribute(u)}else u.startsWith(R)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(bt.test(i.tagName)){let u=i.textContent.split(R),h=u.length-1;if(h>0){i.textContent=he?he.emptyScript:"";for(let f=0;f<h;f++)i.append(u[f],se()),O.nextNode(),a.push({type:2,index:++n});i.append(u[h],se())}}}else if(i.nodeType===8)if(i.data===vt)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(R,u+1))!==-1;)a.push({type:7,index:n}),u+=R.length-1}n++}}static createElement(t,e){let r=H.createElement("template");return r.innerHTML=t,r}};function W(s,t,e=s,r){var o,c,a;if(t===M)return t;let i=r!==void 0?(o=e._$Co)==null?void 0:o[r]:e._$Cl,n=ie(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((c=i==null?void 0:i._$AO)==null||c.call(i,!1),n===void 0?i=void 0:(i=new n(s),i._$AT(s,e,r)),r!==void 0?((a=e._$Co)!=null?a:e._$Co=[])[r]=i:e._$Cl=i),i!==void 0&&(t=W(s,i._$AS(s,t.values),i,r)),t}var ke=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var l;let{el:{content:e},parts:r}=this._$AD,i=((l=t==null?void 0:t.creationScope)!=null?l:H).importNode(e,!0);O.currentNode=i;let n=O.nextNode(),o=0,c=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new oe(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Pe(n,this,t)),this._$AV.push(d),a=r[++c]}o!==(a==null?void 0:a.index)&&(n=O.nextNode(),o++)}return O.currentNode=H,i}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},oe=class s{get _$AU(){var t,e;return(e=(t=this._$AM)==null?void 0:t._$AU)!=null?e:this._$Cv}constructor(t,e,r,i){var n;this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=i,this._$Cv=(n=i==null?void 0:i.isConnected)!=null?n:!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=W(this,t,e),ie(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==M&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):dr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&ie(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var n;let{values:e,_$litType$:r}=t,i=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=ne.createElement(xt(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{let o=new ke(i,this),c=o.u(this.options);o.p(e),this.T(c),this._$AH=o}}_$AC(t){let e=ft.get(t.strings);return e===void 0&&ft.set(t.strings,e=new ne(t)),e}k(t){Oe(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,i=0;for(let n of t)i===e.length?e.push(r=new s(this.O(se()),this.O(se()),this,this.options)):r=e[i],r._$AI(n),i++;i<e.length&&(this._$AR(r&&r._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,e);t!==this._$AB;){let i=dt(t).nextSibling;dt(t).remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},V=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,i,n){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=m}_$AI(t,e=this,r,i){let n=this.strings,o=!1;if(n===void 0)t=W(this,t,e,0),o=!ie(t)||t!==this._$AH&&t!==M,o&&(this._$AH=t);else{let c=t,a,l;for(t=n[0],a=0;a<n.length-1;a++)l=W(this,c[r+a],e,a),l===M&&(l=this._$AH[a]),o||(o=!ie(l)||l!==this._$AH[a]),l===m?t=m:t!==m&&(t+=(l!=null?l:"")+n[a+1]),this._$AH[a]=l}o&&!i&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t!=null?t:"")}},Re=class extends V{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},De=class extends V{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},Le=class extends V{constructor(t,e,r,i,n){super(t,e,r,i,n),this.type=5}_$AI(t,e=this){var o;if((t=(o=W(this,t,e,0))!=null?o:m)===M)return;let r=this._$AH,i=t===m&&r!==m||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,n=t!==m&&(r===m||i);i&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,r;typeof this._$AH=="function"?this._$AH.call((r=(e=this.options)==null?void 0:e.host)!=null?r:this.element,t):this._$AH.handleEvent(t)}},Pe=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){W(this,t)}};var Ee=re.litHtmlPolyfillSupport,gt;Ee==null||Ee(ne,oe),((gt=re.litHtmlVersions)!=null?gt:re.litHtmlVersions=[]).push("3.3.3");var wt=(s,t,e)=>{var n,o;let r=(n=e==null?void 0:e.renderBefore)!=null?n:t,i=r._$litPart$;if(i===void 0){let c=(o=e==null?void 0:e.renderBefore)!=null?o:null;r._$litPart$=i=new oe(t.insertBefore(se(),c),c,void 0,e!=null?e:{})}return i._$AI(s),i};var N=globalThis,b=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,r;let t=super.createRenderRoot();return(r=(e=this.renderOptions).renderBefore)!=null||(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=wt(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return M}},$t;b._$litElement$=!0,b.finalized=!0,($t=N.litElementHydrateSupport)==null||$t.call(N,{LitElement:b});var Me=N.litElementPolyfillSupport;Me==null||Me({LitElement:b});var St;((St=N.litElementVersions)!=null?St:N.litElementVersions=[]).push("4.2.2");var ue="chronothermostat";function pe(s){return s.callWS({type:`${ue}/info`})}function Ne(s,t,e){return s.callWS({type:`${ue}/get_program`,zone:t,program:e})}function At(s,t,e,r,i){return s.callService(ue,"set_program",{zone:t,program:e,weekday:r,values:i})}var F=s=>s<10?`0${s}`:String(s);function ur(s){let t=-s.getTimezoneOffset(),e=t>=0?"+":"-",r=Math.abs(t);return`${s.getFullYear()}-${F(s.getMonth()+1)}-${F(s.getDate())}T${F(s.getHours())}:${F(s.getMinutes())}:${F(s.getSeconds())}${e}${F(Math.floor(r/60))}:${F(r%60)}`}function Ct(s,t,e){let r={scenario:t};return e&&(r.return_at=ur(e)),s.callService(ue,"set_scenario",r)}function me(s,t,e){if(s.length===0)return[t,e];let r=Math.max(t,Math.floor(Math.min(...s))-1),i=Math.min(e,Math.ceil(Math.max(...s))+1);return i-r<5&&(i=Math.min(e,r+5),r=Math.max(t,i-5)),[r,i]}function ae(s,t){let{width:e,height:r,min:i,max:n,padLeft:o,padBottom:c}=t,a=e-o,l=r-c,d=n-i||1,u=v=>l*(1-(Math.min(n,Math.max(i,v))-i)/d),h=a/96,f=s.map((v,we)=>{let Q=u(v);return{x:o+we*h,y:Q,w:h,h:l-Q}}),g=d<=6?1:d<=12?2:5,$=[];for(let v=Math.ceil(i/g)*g;v<=n;v+=g)$.push({y:u(v),label:String(v)});let D=[0,6,12,18,24].map(v=>({x:o+a*v/24,label:String(v)}));return{bars:f,yTicks:$,xTicks:D}}function Tt(s,t){let e=Math.floor((s-t.padLeft)/(t.width-t.padLeft)*96);return Math.min(95,Math.max(0,e))}var Et=(s,t,e)=>Math.min(e,Math.max(t,s));function Fe(s,t){return{...s,cursor:Et(Math.round(t),0,95)}}function Ie(s,t){return Fe(s,s.cursor+t)}function ze(s,t){let e=Et(Math.round((s.values[s.cursor]+t)/.5)*.5,s.min,s.max),r=s.values.slice();return r[s.cursor]=e,{...s,values:r}}function kt(s){if(s.cursor>=95)return s;let t=s.values.slice();return t[s.cursor+1]=t[s.cursor],{...s,values:t,cursor:s.cursor+1}}function Ue(s,t){return{...s,values:t.slice()}}function K(s){return s.values.length!==s.saved.length||s.values.some((t,e)=>t!==s.saved[e])}var ce=["mon","tue","wed","thu","fri","sat","sun"],pr={it:{mon:["luned\xEC","Lun"],tue:["marted\xEC","Mar"],wed:["mercoled\xEC","Mer"],thu:["gioved\xEC","Gio"],fri:["venerd\xEC","Ven"],sat:["sabato","Sab"],sun:["domenica","Dom"]},en:{mon:["Monday","Mon"],tue:["Tuesday","Tue"],wed:["Wednesday","Wed"],thu:["Thursday","Thu"],fri:["Friday","Fri"],sat:["Saturday","Sat"],sun:["Sunday","Sun"]}};function C(s,t,e=!1){return pr[t][s][e?1:0]}function I(s){return ce[(s.getDay()+6)%7]}var _e=s=>s<10?`0${s}`:String(s);function T(s,t){let e=s.toFixed(1);return`${t==="it"?e.replace(".",","):e} \xB0C`}function Rt(s){return`${_e(Math.floor(s/4))}:${_e(s%4*15)}`}var We=s=>`${_e(s.getHours())}:${_e(s.getMinutes())}`;function Dt(s,t,e){let r=We(s),i=a=>new Date(a.getFullYear(),a.getMonth(),a.getDate()).getTime(),n=new Date(t.getFullYear(),t.getMonth(),t.getDate()+1).getTime(),o=i(s);if(o<=i(t))return e==="it"?`fino alle ${r}`:`until ${r}`;if(o===n)return e==="it"?`fino a domani alle ${r}`:`until tomorrow at ${r}`;let c=C(I(s),e);return e==="it"?`fino a ${c} alle ${r}`:`until ${c} at ${r}`}function fe(s,t){let e=C(I(s),t);return t==="it"?`${e} ${s.getDate()} alle ${We(s)}`:`${e} ${s.getDate()} at ${We(s)}`}var Lt=["pointerup","pointerleave","pointercancel","lostpointercapture","blur"];function Pt(s,t,e={delay:450,interval:110}){let r,i=()=>{r!==void 0&&clearTimeout(r),r=void 0},n=()=>{t(),r=setTimeout(n,e.interval)},o=l=>{l.preventDefault(),i(),t(),r=setTimeout(n,e.delay)},c=l=>{let d=l.key;d!=="Enter"&&d!==" "||(l.preventDefault(),t())},a=l=>l.preventDefault();s.addEventListener("pointerdown",o);for(let l of Lt)s.addEventListener(l,i);return s.addEventListener("keydown",c),s.addEventListener("contextmenu",a),()=>{i(),s.removeEventListener("pointerdown",o);for(let l of Lt)s.removeEventListener(l,i);s.removeEventListener("keydown",c),s.removeEventListener("contextmenu",a)}}var mr={none:"No changes",unsaved:"Unsaved changes",saved_day:"{day} program saved",editing:"Editing:",work:"Work",holiday:"Holiday",away:"Away",off:"Off",continue:"Continue",save:"Save",copy_from:"Copy from\u2026",copy_from_hint:"Copy the saved program of:",discard:"Discard",confirm:"Confirm",cancel:"Cancel",today:"Today",today_day:"Today, {day}",prev_slot:"Previous quarter hour",next_slot:"Next quarter hour",temp_down:"Lower temperature",temp_up:"Raise temperature",return_date:"Return date",return_time:"Return time",error_load:"Could not load the data.",error_save:"Could not save.",house_scenario:"House scenario",return_required:"Set the return day and time",house_work:"The house follows the Work program.",house_holiday:"The house follows the Holiday program.",house_away:"Heating off until {when}, then it switches to Work by itself.",house_away_no_return:"Away with no return: stays off until you set a return.",house_off:"Heating off until you pick another scenario.",status_schedule:"Schedule: {temp} {until}, then {next}.",status_schedule_flat:"Schedule: {temp}.",status_forced:"Forced to {temp} {until}, then back to the schedule ({next}).",status_forced_flat:"Forced to {temp}.",status_zone_off:"Switched off by you. The schedule resumes when you turn it back on.",status_away:"Away: off until {when}, then Work.",status_away_no_return:"Away with no return: stays off until you set a return.",status_off:"Heating off.",status_zone_on_manual:"Turned on by hand with the heating off: stays at {temp} until you turn it off or change scenario.",status_unavailable:"Thermostat unavailable.",config_entity:"Thermostat",config_name:"Name (optional)",config_show_temperature_axis:"Show temperature labels",config_show_time_axis:"Show hour labels",config_scale:"Chart height",config_scale_auto:"Automatic (follows the day's values)",config_scale_fixed:"Fixed range",config_scale_min:"Lowest temperature",config_scale_max:"Highest temperature",config_error_missing:"Enter a value.",config_error_below:"The thermostat allows no less than {limit} \xB0C.",config_error_above:"The thermostat allows no more than {limit} \xB0C.",config_error_order:"Must be higher than the lowest temperature."},_r={none:"Nessuna modifica",unsaved:"Modifiche non salvate",saved_day:"Programma di {day} salvato",editing:"Stai modificando:",work:"Lavoro",holiday:"Ferie",away:"Fuori casa",off:"Spento",continue:"Prosegui",save:"Salva",copy_from:"Copia da\u2026",copy_from_hint:"Copia il programma salvato di:",discard:"Scarta",confirm:"Conferma",cancel:"Annulla",today:"Oggi",today_day:"Oggi, {day}",prev_slot:"Quarto d'ora precedente",next_slot:"Quarto d'ora successivo",temp_down:"Abbassa la temperatura",temp_up:"Alza la temperatura",return_date:"Giorno di rientro",return_time:"Ora di rientro",error_load:"Impossibile caricare i dati.",error_save:"Salvataggio non riuscito.",house_scenario:"Scenario della casa",return_required:"Indica giorno e ora del rientro",house_work:"La casa segue il programma Lavoro.",house_holiday:"La casa segue il programma Ferie.",house_away:"Impianto spento fino a {when}, poi passa da solo a Lavoro.",house_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",house_off:"Impianto spento finch\xE9 non scegli un altro scenario.",status_schedule:"Programma: {temp} {until}, poi {next}.",status_schedule_flat:"Programma: {temp}.",status_forced:"Forzato a {temp} {until}, poi torna al programma ({next}).",status_forced_flat:"Forzato a {temp}.",status_zone_off:"Spento da te. Il programma riparte quando lo riaccendi.",status_away:"Fuori casa: spento fino a {when}, poi Lavoro.",status_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",status_off:"Impianto spento.",status_zone_on_manual:"Acceso a mano con impianto spento: resta a {temp} finch\xE9 non lo spegni o cambi scenario.",status_unavailable:"Termostato non disponibile.",config_entity:"Termostato",config_name:"Nome (facoltativo)",config_show_temperature_axis:"Mostra le temperature",config_show_time_axis:"Mostra le ore",config_scale:"Altezza del grafico",config_scale_auto:"Automatica (segue i valori del giorno)",config_scale_fixed:"Range fisso",config_scale_min:"Temperatura minima",config_scale_max:"Temperatura massima",config_error_missing:"Inserisci un valore.",config_error_below:"Il termostato non scende sotto {limit} \xB0C.",config_error_above:"Il termostato non sale sopra {limit} \xB0C.",config_error_order:"Deve essere pi\xF9 alta della temperatura minima."},Ot={en:mr,it:_r};function w(s){var e,r,i;return((i=(r=(e=s==null?void 0:s.locale)==null?void 0:e.language)!=null?r:s==null?void 0:s.language)!=null?i:"").toLowerCase().startsWith("it")?"it":"en"}function p(s,t,e){var i,n,o;let r=(o=(n=(i=Ot[s])==null?void 0:i[t])!=null?n:Ot.en[t])!=null?o:t;return e?r.replace(/\{(\w+)\}/g,(c,a)=>a in e?String(e[a]):c):r}var fr=5,gr=35,yr=[5,30],z=s=>typeof s=="number"&&Number.isFinite(s);function Ht(s){let t=s.scale==="fixed"&&z(s.scale_min)&&z(s.scale_max)?[s.scale_min,s.scale_max]:void 0;return{temperatureAxis:s.show_temperature_axis!==!1,timeAxis:s.show_time_axis!==!1,fixed:t}}function Mt(s,t){return s!=null?s:me(t,fr,gr)}function Nt(s){let t=s==null?void 0:s.min_temp,e=s==null?void 0:s.max_temp;return z(t)&&z(e)&&t<e?[t,e]:yr}function Ft(s){if(s.scale===void 0||s.scale==="auto")return;if(s.scale!=="fixed")return'scale must be "auto" or "fixed"';for(let r of["scale_min","scale_max"]){if(s[r]===void 0)return`${r} is required with a fixed scale`;if(!z(s[r]))return`${r} must be a number`}let{scale_min:t,scale_max:e}=s;if(t>=e)return"scale_min must be lower than scale_max"}var vr=7;function It(s){for(let t of[1,2,4,10,20,40,100])if(Math.ceil(s.length/t)<=vr)return s.filter((e,r)=>r%t===0);return s.filter((t,e)=>e===0||e===s.length-1)}function Ve([s,t],[e,r]){let i=Math.min(r,Math.max(e,s)),n=Math.min(r,Math.max(e,t));return i<n?[i,n]:[e,r]}function zt(s,[t,e]){if(s.scale!=="fixed")return;let{scale_min:r,scale_max:i}=s;if(!z(r))return{field:"scale_min",key:"config_error_missing"};if(!z(i))return{field:"scale_max",key:"config_error_missing"};if(r<t)return{field:"scale_min",key:"config_error_below"};if(r>e)return{field:"scale_min",key:"config_error_above"};if(i>e)return{field:"scale_max",key:"config_error_above"};if(i<t)return{field:"scale_max",key:"config_error_below"};if(r>=i)return{field:"scale_max",key:"config_error_order"}}var ge="chronothermostat-zone-card-editor",ye="chronothermostat-viewer-card-editor",Ut={name:"entity",selector:{entity:{domain:"climate"}}},Ge={name:"name",selector:{text:{}}},U=class extends b{constructor(){super();this._label=e=>p(this.uiLang,`config_${e.name}`);this._errors={}}schema(e){return[Ut,Ge]}formData(e){return e}prepare(e){let r={...e};return r.name||delete r.name,{shown:e,config:r,errors:{}}}get uiLang(){return w(this.hass)}setConfig(e){this._config=e}render(){return!this.hass||!this._config?m:_`<ha-form .hass=${this.hass} .data=${this.formData(this._config)}
      .schema=${this.schema(this._config)} .error=${this._errors}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`}_changed(e){e.stopPropagation();let{shown:r,config:i,errors:n}=this.prepare(e.detail.value);this._config=r,this._errors=n,i&&this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}};U.properties={hass:{attribute:!1},_config:{state:!0},_errors:{state:!0}};var Ke=class extends U{},br=[16,22],Be=class extends U{_bounds(t){var e,r,i;return Nt((i=(r=(e=this.hass)==null?void 0:e.states)==null?void 0:r[t.entity])==null?void 0:i.attributes)}schema(t){let e=this.uiLang,r=[Ut,{name:"show_temperature_axis",selector:{boolean:{}}},{name:"show_time_axis",selector:{boolean:{}}},{name:"scale",selector:{select:{mode:"list",options:[{value:"auto",label:p(e,"config_scale_auto")},{value:"fixed",label:p(e,"config_scale_fixed")}]}}}];if(t.scale!=="fixed")return r;let[i,n]=this._bounds(t),o={number:{min:i,max:n,step:.5,mode:"box",unit_of_measurement:"\xB0C"}};return[...r,{name:"scale_min",selector:o},{name:"scale_max",selector:o}]}formData(t){return{show_temperature_axis:!0,show_time_axis:!0,scale:"auto",...t}}prepare(t){let e={...t},r=this._config,i=this._bounds(e),[n,o]=i,c=e.scale==="fixed",a=([u,h])=>{e.scale_min=u,e.scale_max=h};c&&(r==null?void 0:r.scale)!=="fixed"&&e.scale_min===void 0&&e.scale_max===void 0?a(Ve(br,i)):c&&r&&r.entity!==e.entity&&typeof e.scale_min=="number"&&typeof e.scale_max=="number"&&a(Ve([e.scale_min,e.scale_max],i));let l=zt(e,[n,o]);if(l){let u=l.key==="config_error_below"?n:o,h=p(this.uiLang,l.key,{limit:u.toLocaleString(this.uiLang)});return{shown:e,errors:{[l.field]:h}}}let d={...e};return d.name||delete d.name,d.show_temperature_axis!==!1&&delete d.show_temperature_axis,d.show_time_axis!==!1&&delete d.show_time_axis,d.scale!=="fixed"&&(delete d.scale,delete d.scale_min,delete d.scale_max),{shown:e,config:d,errors:{}}}};customElements.get(ge)||customElements.define(ge,Ke);customElements.get(ye)||customElements.define(ye,Be);var je="chronothermostat-editor-card",xr=["work","holiday"],wr=["prev","next","cont","minus","plus"],Wt=.5,$r=3e3,Sr=3e4,Vt=150,Kt=8,ve=26,Bt=22,Ar=452,Gt=s=>s.charAt(0).toUpperCase()+s.slice(1),Cr=s=>s.getHours()*4+Math.floor(s.getMinutes()/15),E=s=>Math.round(s*100)/100,jt=s=>ce.every(t=>{var e;return Array.isArray((e=s.weekdays)==null?void 0:e[t])&&s.weekdays[t].length===96}),Tr=_`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M3 12h13M11 6l6 6-6 6M21 5v14" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`,B=class extends b{constructor(){super();this._lastLoadAttempt=0;this._loadToken=0;this._holds=new Map;this._observedChart=null;this._program="work",this._day=I(new Date),this._loadFailed=!1,this._copyOpen=!1,this._saving=!1,this._loading=!1,this._chartWidth=Ar}static getConfigElement(){return document.createElement(ge)}static getStubConfig(e){var i;let r=Object.keys((i=e==null?void 0:e.states)!=null?i:{}).find(n=>n.startsWith("climate."));return{entity:r!=null?r:""}}setConfig(e){if(!e||typeof e.entity!="string"||e.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==e.entity&&this._reset(),this._config={...e}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this._holds.forEach(e=>e.detach()),this._holds.clear(),this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=null,this._clearSaved()}shouldUpdate(e){if(e.size===1&&e.has("hass")){let r=e.get("hass");return!r||w(r)!==w(this.hass)||this._needsLoad()}return!0}willUpdate(){this._needsLoad()&&this._load()}updated(){this.isConnected&&(this._syncHolds(),this._observeChart())}render(){if(!this._config)return m;let e=w(this.hass);if(this._loadFailed)return _`<ha-card><div class="load-error error">${p(e,"error_load")}</div></ha-card>`;let r=this._state;if(!r)return _`<ha-card></ha-card>`;let[i,n]=this._status(e,r);return _`<ha-card>
      <div class="row">
        <span class="label">${p(e,"editing")}</span>
        ${xr.map(o=>_`<button class="chip program ${o===this._program?"on":""}"
          data-program=${o} aria-pressed=${o===this._program?"true":"false"}
          @click=${()=>this._select({program:o,day:this._day})}>${p(e,o)}</button>`)}
      </div>
      <div class="row days">
        ${ce.map(o=>_`<button class="chip day ${o===this._day?"on":""}"
          data-day=${o} aria-pressed=${o===this._day?"true":"false"}
          @click=${()=>this._select({program:this._program,day:o})}>
          ${C(o,e,!0)}
        </button>`)}
      </div>
      ${this._pending&&K(r)?this._renderDirtyBar(e):m}
      <div class="reading ${this._loading?"loading":""}">
        <span><span class="day-name">${Gt(C(this._day,e))}</span><span
          class="time">${Rt(r.cursor)}</span></span>
        <span class="temp">${T(r.values[r.cursor],e)}</span>
      </div>
      ${this._renderChart(r)}
      <div class="controls">
        <button class="big hold" id="prev" ?disabled=${this._loading} aria-label=${p(e,"prev_slot")}>
          <span class="glyph" aria-hidden="true">‹</span>
        </button>
        <button class="big hold" id="next" ?disabled=${this._loading} aria-label=${p(e,"next_slot")}>
          <span class="glyph" aria-hidden="true">›</span>
        </button>
        <button class="big hold wide" id="cont" ?disabled=${this._loading}>
          ${Tr}<span>${p(e,"continue")}</span>
        </button>
        <button class="big hold" id="minus" ?disabled=${this._loading} aria-label=${p(e,"temp_down")}>
          <span class="glyph" aria-hidden="true">−</span>
        </button>
        <button class="big hold" id="plus" ?disabled=${this._loading} aria-label=${p(e,"temp_up")}>
          <span class="glyph" aria-hidden="true">+</span>
        </button>
        <button class="big" id="copy" ?disabled=${this._loading}
          aria-expanded=${this._copyOpen?"true":"false"}
          @click=${this._toggleCopy}>${p(e,"copy_from")}</button>
        <button class="big save" id="save" ?disabled=${this._saving||this._loading}
          @click=${this._saveAndContinue}>
          ${p(e,"save")}
        </button>
      </div>
      <div class="footer">
        <span class="name">${this._zoneName()}</span>
        <span class="status ${n}">${i}</span>
      </div>
      ${this._copyOpen?this._renderCopyPanel(e):m}
    </ha-card>`}_renderDirtyBar(e){return _`<div class="dirty-bar">
      <span class="message">${p(e,"unsaved")}</span>
      <button class="big" id="bar-discard" @click=${this._discardPending}>${p(e,"discard")}</button>
      <button class="big save" id="bar-save" ?disabled=${this._saving}
        @click=${this._saveAndContinue}>
        ${p(e,"save")}
      </button>
    </div>`}_renderChart(e){let r=this._chartWidth,i=Vt-Kt,[n,o]=me(e.values,e.min,e.max),c=ae(e.values,{width:r,height:i,min:n,max:o,padLeft:ve,padBottom:Bt}),a=i-Bt,l=c.bars[e.cursor],d=E(l.x+l.w/2),u=c.xTicks.length-1;return _`<div class="chart ${this._loading?"loading":""}">
      <svg viewBox="0 0 ${r} ${Vt}" @pointerdown=${this._onChartDown}>
        <g transform="translate(0 ${Kt})">
          ${c.yTicks.map(h=>A`
            <line class="grid" x1=${ve} x2=${r}
              y1=${E(h.y)} y2=${E(h.y)}></line>
            <text class="axis" x=${ve-5} y=${E(h.y)} dy="0.35em"
              text-anchor="end">${h.label}</text>`)}
          ${c.bars.map((h,f)=>A`<rect class="bar ${f===e.cursor?"cursor":""}"
            x=${E(h.x)} y=${E(h.y)} width=${E(Math.max(0,h.w-.6))}
            height=${E(h.h)}></rect>`)}
          <line class="cursor-line" x1=${d} x2=${d} y1="0" y2=${a+4}></line>
          ${c.xTicks.map((h,f)=>A`<text class="axis" x=${E(h.x)} y=${a+18}
            text-anchor=${f===0?"start":f===u?"end":"middle"}>${h.label}</text>`)}
        </g>
      </svg>
    </div>`}_renderCopyPanel(e){return _`<div class="copy-panel">
      <div class="hint">${p(e,"copy_from_hint")}</div>
      <div class="copy-days">
        ${ce.filter(r=>r!==this._day).map(r=>_`<button class="chip" data-day=${r} @click=${()=>this._copyFrom(r)}>
            ${Gt(C(r,e))}
          </button>`)}
      </div>
    </div>`}_status(e,r){return this._failure?[p(e,this._failure),"error"]:K(r)?[p(e,"unsaved"),"warning"]:this._savedDay?[p(e,"saved_day",{day:C(this._savedDay,e)}),"success"]:[p(e,"none"),""]}_zoneName(){let e=this._config;if(!e)return"";if(e.name)return e.name;let i=(this._info?this._info.zones:[]).find(n=>n.entity_id===e.entity);return i?i.name:""}_needsLoad(){return!this.hass||!this._config?!1:this._loadedFor!==this._config.entity?!0:this._loadFailed&&Date.now()-this._lastLoadAttempt>=Sr}_reset(){this._loadToken++,this._loadedFor=void 0,this._shown=void 0,this._data=void 0,this._state=void 0,this._loading=!1,this._loadFailed=!1,this._failure=void 0,this._pending=void 0,this._copyOpen=!1,this._clearSaved()}async _load(){let e=this.hass,r=this._config;if(!e||!r)return;let i=r.entity;this._loadedFor=i,this._lastLoadAttempt=Date.now();let n;try{if(this._info||(this._info=await pe(e)),this._loadedFor!==i)return;if(!this._info.zones.some(l=>l.entity_id===i))throw new Error(`${i} is not a chronothermostat zone`);let c=this._info.scenario_entity_id,a=c?e.states[c]:void 0;n=a&&a.state==="holiday"?"holiday":"work"}catch{this._loadedFor===i&&this._firstLoadFailed();return}let o=new Date;await this._switchTo({program:n,day:I(o)},Cr(o))}_firstLoadFailed(){this._info=void 0,this._loadFailed=!0}_select(e){if(e.program===this._program&&e.day===this._day){this._pending=void 0;return}if(this._state&&K(this._state)){this._pending=e;return}this._switchTo(e)}async _switchTo(e,r){let i=this.hass,n=this._config;if(!i||!n)return;let o=++this._loadToken;this._pending=void 0,this._copyOpen=!1,this._program=e.program,this._day=e.day,this._loading=!0;try{let c=await Ne(i,n.entity,e.program);if(o!==this._loadToken)return;if(!jt(c))throw new Error("Invalid program data");let a=r!==void 0?r:this._state?this._state.cursor:0;this._showDay(c,e,a)}catch{if(o!==this._loadToken)return;this._state&&this._shown?(this._program=this._shown.program,this._day=this._shown.day,this._failure="error_load"):this._firstLoadFailed()}finally{o===this._loadToken&&(this._loading=!1)}}_showDay(e,r,i){let n=e.weekdays[r.day];this._data=e,this._shown=r,this._loadFailed=!1,this._failure=void 0,this._state={values:n.slice(),saved:n.slice(),cursor:i,min:e.min_temp,max:e.max_temp}}_discardPending(){let e=this._pending;!e||!this._state||(this._state=Ue(this._state,this._state.saved),this._switchTo(e))}_hold(e){let r=this._state;!r||this._loading||(e==="prev"?this._state=Ie(r,-1):e==="next"?this._state=Ie(r,1):e==="cont"?this._edit(kt(r)):e==="minus"?this._edit(ze(r,-Wt)):this._edit(ze(r,Wt)))}_edit(e){this._state=e,this._failure=void 0,this._clearSaved(),this._pending&&!K(e)&&(this._pending=void 0)}_onChartDown(e){let r=this._state,i=e.currentTarget.getBoundingClientRect();if(!r||this._loading||i.width<=0)return;let n=(e.clientX-i.left)/i.width*this._chartWidth,o=Tt(n,{width:this._chartWidth,padLeft:ve});this._state=Fe(r,o)}_toggleCopy(){this._loading||(this._copyOpen=!this._copyOpen)}_copyFrom(e){this._copyOpen=!1,!(!this._state||!this._data||this._loading)&&this._edit(Ue(this._state,this._data.weekdays[e]))}async _saveAndContinue(){if(!await this._save())return;let e=this._pending;e&&this._state&&!K(this._state)&&await this._switchTo(e)}async _save(){let e=this.hass,r=this._config,i=this._state,n=this._shown;if(!e||!r||!i||!n||this._saving||this._loading)return!1;let o=i.values.slice(),c=this._loadToken;this._saving=!0;try{await At(e,r.entity,n.program,n.day,o);let a=await Ne(e,r.entity,n.program);return c===this._loadToken&&this._state&&(jt(a)&&(this._data=a),this._state={...this._state,saved:o}),this._failure=void 0,this._flashSaved(n.day),!0}catch{return this._failure="error_save",!1}finally{this._saving=!1}}_flashSaved(e){this._clearSaved(),this._savedDay=e,this._savedTimer=setTimeout(()=>{this._savedTimer=void 0,this._savedDay=void 0},$r)}_clearSaved(){this._savedTimer!==void 0&&clearTimeout(this._savedTimer),this._savedTimer=void 0,this._savedDay=void 0}_syncHolds(){for(let e of wr){let r=this.renderRoot.querySelector(`#${e}`),i=this._holds.get(e);i&&i.el===r||(i&&i.detach(),this._holds.delete(e),r&&this._holds.set(e,{el:r,detach:Pt(r,()=>this._hold(e))}))}}_observeChart(){let e=this.renderRoot.querySelector(".chart");e!==this._observedChart&&(this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=e,!(!e||typeof ResizeObserver=="undefined")&&(this._resizeObserver||(this._resizeObserver=new ResizeObserver(r=>{let i=Math.round(r[0].contentRect.width);i>0&&(this._chartWidth=i)})),this._resizeObserver.observe(e)))}};B.properties={hass:{attribute:!1},_config:{state:!0},_program:{state:!0},_day:{state:!0},_state:{state:!0},_loadFailed:{state:!0},_failure:{state:!0},_savedDay:{state:!0},_pending:{state:!0},_copyOpen:{state:!0},_saving:{state:!0},_loading:{state:!0},_chartWidth:{state:!0}},B.styles=L`
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
  `;var qe="chronothermostat-scenario-card",Ye="chronothermostat-scenario-card-editor",Yt=["work","holiday","away","off"],Er=3e4,qt=s=>s<10?`0${s}`:String(s),kr=s=>Yt.includes(s);function Rr(s){let t=new Date(s.getFullYear(),s.getMonth(),s.getDate()+1,19,0);return{date:`${t.getFullYear()}-${qt(t.getMonth()+1)}-${qt(t.getDate())}`,time:"19:00"}}function Dr(s){let t=new Date(s.getTime());return t.setMinutes(Math.round(t.getMinutes()/15)*15,0,0),t}function Lr(s,t){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s),r=/^(\d{2}):(\d{2})/.exec(t);if(!e||!r)return;let i=new Date(+e[1],+e[2]-1,+e[3],+r[1],+r[2]);return isNaN(i.getTime())?void 0:i}var j=class extends b{constructor(){super();this._infoPending=!1;this._infoTriedAt=0;this._config={},this._infoFailed=!1,this._busy=!1}static getConfigElement(){return document.createElement(Ye)}static getStubConfig(){return{}}setConfig(e){this._config={...e!=null?e:{}}}getCardSize(){return 3}shouldUpdate(e){e.has("hass")&&this._ensureInfo();let r=this._current(),i=this._seen,n=!!i&&i.select===r.select&&i.returnAt===r.returnAt&&i.lang===r.lang;return this._seen=r,e.size===1&&e.has("hass")?!n:!0}_ensureInfo(){!this.hass||this._infoPending||this._info&&this._info.scenario_entity_id||this._infoTriedAt&&Date.now()-this._infoTriedAt<Er||(this._infoTriedAt=Date.now(),this._infoPending=!0,pe(this.hass).then(e=>{this._infoPending=!1,this._info=e,this._infoFailed=!(e!=null&&e.scenario_entity_id)},()=>{this._infoPending=!1,this._infoFailed=!0}))}_active(){var r;let e=(r=this._current().select)==null?void 0:r.state;return kr(e)?e:void 0}_current(){var n,o,c;let e=(o=(n=this.hass)==null?void 0:n.states)!=null?o:{},{scenario_entity_id:r,return_at_entity_id:i}=(c=this._info)!=null?c:{};return{select:r?e[r]:void 0,returnAt:i?e[i]:void 0,lang:w(this.hass)}}_tap(e){if(!this._busy){if(this._message=void 0,e==="away"||e==="off"){this._panel=this._panel===e?void 0:e;return}this._panel=void 0,e!==this._active()&&this._apply(e)}}async _apply(e,r){if(!(!this.hass||this._busy)){this._busy=!0,this._message=void 0;try{await Ct(this.hass,e,r),(e==="away"||e==="off")&&(this._panel=void 0)}catch(i){let n=i instanceof Error?i.message:"";this._message=n||p(w(this.hass),"error_save")}finally{this._busy=!1}}}_confirmAway(){let e=n=>{var o,c;return(c=(o=this.renderRoot.querySelector(n))==null?void 0:o.value)!=null?c:""},r=Lr(e('input[type="date"]'),e('input[type="time"]')),i=r&&Dr(r);if(!i||i.getTime()<=Date.now()){this._message=p(w(this.hass),"return_required");return}this._apply("away",i)}render(){let e=w(this.hass),{returnAt:r}=this._current(),i=this._active(),n=this._config.name||p(e,"house_scenario"),o=this._infoFailed?"error_load":void 0;return _`<ha-card>
      <div class="label">${n}</div>
      <div class="chips">
        ${Yt.map(c=>_`<button
            class="chip ${c} ${i===c?"active":""}"
            data-scenario=${c}
            aria-pressed=${i===c?"true":"false"}
            ?disabled=${this._busy}
            @click=${()=>this._tap(c)}
          >${p(e,c)}</button>`)}
      </div>
      ${this._panel?this._renderPanel(this._panel,e):m}
      ${this._message?_`<div class="error">${this._message}</div>`:m}
      ${o?_`<div class="error">${p(e,o)}</div>`:m}
      ${!o&&i?_`<div class="sentence">${this._sentence(i,r,e)}</div>`:m}
    </ha-card>`}_renderPanel(e,r){let i=_`<div class="buttons">
      <button class="action confirm" ?disabled=${this._busy}
        @click=${()=>e==="off"?void this._apply("off"):this._confirmAway()}>${p(r,"confirm")}</button>
      <button class="action cancel" @click=${()=>{this._panel=void 0,this._message=void 0}}>${p(r,"cancel")}</button>
    </div>`;if(e==="off")return _`<div class="panel">${i}</div>`;let n=Rr(new Date);return _`<div class="panel">
      <div class="fields">
        <label>${p(r,"return_date")}<input type="date" .value=${n.date} /></label>
        <label>${p(r,"return_time")}<input type="time" step="900" .value=${n.time} /></label>
      </div>
      ${i}
    </div>`}_sentence(e,r,i){var n;switch(e){case"work":return p(i,"house_work");case"holiday":return p(i,"house_holiday");case"off":return p(i,"house_off");default:{let o=new Date((n=r==null?void 0:r.state)!=null?n:"");return isNaN(o.getTime())||o.getTime()<=Date.now()?p(i,"house_away_no_return"):p(i,"house_away",{when:fe(o,i)})}}}};j.properties={hass:{attribute:!1},_config:{state:!0},_info:{state:!0},_infoFailed:{state:!0},_panel:{state:!0},_message:{state:!0},_busy:{state:!0}},j.styles=L`
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
  `;var be=class extends U{schema(){return[Ge]}};var Ze="chronothermostat-viewer-card",Pr="chronothermostat",Or=6e4,Hr=5e3,q=480,Y=100,Mr=new Set(["away","away_no_return","off","zone_on_manual"]),Zt=s=>s<10?`0${s}`:String(s),Nr=s=>s.charAt(0).toUpperCase()+s.slice(1),x=s=>Math.round(s*100)/100,Xt=s=>s.getHours()*4+Math.floor(s.getMinutes()/15),Z=s=>typeof s=="number"&&Number.isFinite(s),Qt=s=>!!s&&s.state!=="unavailable"&&s.state!=="unknown",Jt=s=>new Date(s.getFullYear(),s.getMonth(),s.getDate()).getTime(),X=class extends b{constructor(){super();this._display={lang:"en"};this._now=new Date}static getConfigElement(){return document.createElement(ye)}static getStubConfig(e){var i;let r=Object.keys((i=e==null?void 0:e.states)!=null?i:{}).find(n=>n.startsWith("climate."));return{entity:r!=null?r:""}}setConfig(e){if(!e||typeof e.entity!="string"||e.entity==="")throw new Error("entity is required");let r=Ft(e);if(r)throw new Error(r);this._config&&this._config.entity!==e.entity&&(this._sensorId=void 0),this._config={...e}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this._now=new Date,this._scheduleClock()}disconnectedCallback(){super.disconnectedCallback(),this._timer!==void 0&&clearTimeout(this._timer),this._timer=void 0,this._graceTimer!==void 0&&clearTimeout(this._graceTimer),this._graceTimer=void 0,this._held=void 0}_scheduleClock(){let e=new Date,r=Or-(e.getSeconds()*1e3+e.getMilliseconds());this._timer=setTimeout(()=>{this._now=new Date,this._scheduleClock()},r)}shouldUpdate(e){let r=this._current(),i=this._seen,n=!!i&&i.sensor===r.sensor&&i.climate===r.climate&&i.lang===r.lang;return this._seen=r,e.size===1&&e.has("hass")?!n:!0}willUpdate(e){e.has("hass")&&(this._now=new Date),this._display=this._shown()}_resolveSensor(){var a,l,d,u,h;let e=(l=(a=this.hass)==null?void 0:a.states)!=null?l:{},r=(d=this._config)==null?void 0:d.entity,i=this._sensorId?e[this._sensorId]:void 0;if(i&&((u=i.attributes)==null?void 0:u.zone)===r)return i;let n=Object.keys(e).filter(f=>{var g,$;return f.startsWith("sensor.")&&(($=(g=e[f])==null?void 0:g.attributes)==null?void 0:$.zone)===r}),o=(h=this.hass)==null?void 0:h.entities,c=o&&n.find(f=>{var g;return((g=o[f])==null?void 0:g.platform)===Pr})||n[0];return this._sensorId=c,c?e[c]:void 0}_current(){var e,r;return{sensor:this._resolveSensor(),climate:this._config?(r=(e=this.hass)==null?void 0:e.states)==null?void 0:r[this._config.entity]:void 0,lang:w(this.hass)}}_shown(){let e=this._current();return Qt(e.sensor)?(this._held={sensor:e.sensor,climate:e.climate},this._graceTimer!==void 0&&clearTimeout(this._graceTimer),this._graceTimer=void 0,e):this._held?(this._graceTimer===void 0&&(this._graceTimer=setTimeout(()=>{this._graceTimer=void 0,this._held=void 0,this.requestUpdate()},Hr)),{...this._held,lang:e.lang}):e}render(){var D;let{sensor:e,climate:r,lang:i}=this._display,n=Qt(e)?e.state:"unavailable",o=(D=e==null?void 0:e.attributes)!=null?D:{},c=Array.isArray(o.today)?o.today:[],a=!!e&&!Mr.has(n)&&n!=="unavailable"&&c.length===96&&c.every(Z),l=this._now,d=C(I(l),i),u=o.program==="work"||o.program==="holiday"?o.program:void 0,h=u?`${p(i,"today_day",{day:d})} \xB7 ${p(i,u)}`:Nr(d),f=`${Zt(l.getHours())}:${Zt(l.getMinutes())}`,[g,$]=this._sentence(n,o,r,i);return _`<ha-card>
      <div class="header">
        <span class="title">${h}</span><span class="clock">${f}</span>
      </div>
      ${a?this._chart(n,c,o,r):m}
      <div class="sentence" style=${$}>${g}</div>
    </ha-card>`}_sentence(e,r,i,n){var f;let o=(f=i==null?void 0:i.attributes)==null?void 0:f.temperature,c=this._now,a=typeof r.next_step_at=="string"?new Date(r.next_step_at):void 0,l=!!a&&!isNaN(a.getTime())&&Z(r.next_step_target),d=l?Dt(a,c,n):"",u=l?T(r.next_step_target,n):"",h=(g,$)=>[p(n,g,$),""];switch(e){case"schedule":return Z(r.program_target)?l?h("status_schedule",{temp:T(r.program_target,n),until:d,next:u}):h("status_schedule_flat",{temp:T(r.program_target,n)}):h("status_unavailable");case"forced":return Z(o)?l?h("status_forced",{temp:T(o,n),until:d,next:u}):h("status_forced_flat",{temp:T(o,n)}):h("status_unavailable");case"zone_off":return[p(n,"status_zone_off"),"color: var(--error-color)"];case"zone_on_manual":return Z(o)?h("status_zone_on_manual",{temp:T(o,n)}):h("status_unavailable");case"away":{let g=typeof r.return_at=="string"?new Date(r.return_at):void 0;return!g||isNaN(g.getTime())?h("status_away_no_return"):h("status_away",{when:fe(g,n)})}case"away_no_return":return h("status_away_no_return");case"off":return h("status_off");default:return h("status_unavailable")}}_chart(e,r,i,n){var Qe;let o=this._now,c=Xt(o),a=(Qe=n==null?void 0:n.attributes)==null?void 0:Qe.temperature,l=e==="forced"&&Z(a),d=Ht(this._config),[u,h]=Mt(d.fixed,l?[...r,a]:r),f={width:q,height:Y,min:u,max:h,padLeft:0,padBottom:0},g=ae(r,f),$=q/96,D=m;if(l){let y=typeof i.next_step_at=="string"?new Date(i.next_step_at):void 0,tr=y&&!isNaN(y.getTime())&&Jt(y)<=Jt(o)?Math.min(96,Math.max(c,Xt(y))):96,et=ae([a],f).bars[0].y;D=A`<rect class="band" shape-rendering="crispEdges" x=${x(c*$)} y=${x(et)}
        width=${x((tr-c)*$)} height=${x(Y-et)}></rect>`}let v=(o.getHours()*60+o.getMinutes())/1440*q,we=y=>`${x(y/Y*100)}%`,Q=It(g.yTicks),er=[d.temperatureAxis?"with-temperatures":"",d.timeAxis?"with-time":""].join(" ");return _`<div class="chart ${er}">
      <div class="plot">
        ${d.temperatureAxis?_`<div class="y-labels" aria-hidden="true">
              ${Q.map(y=>_`<span style="top: ${we(y.y)}">${y.label}°</span>`)}
            </div>`:m}
        <svg viewBox="0 0 ${q} ${Y}" preserveAspectRatio="none" aria-hidden="true">
        ${d.temperatureAxis?Q.map(y=>A`<line class="hgrid" x1="0" x2=${q}
              y1=${x(y.y)} y2=${x(y.y)}></line>`):m}
        ${[6,12,18].map(y=>A`<line class="grid" x1=${y*20} x2=${y*20}
          y1="0" y2=${Y}></line>`)}
        ${g.bars.map((y,Je)=>A`<rect class="bar ${Je<c?"past":""}" shape-rendering="crispEdges"
          x=${x(y.x)} y=${x(y.y)} width=${x(y.w)}
          height=${x(y.h)}></rect>`)}
        ${D}
        <line class="now" x1=${x(v)} x2=${x(v)} y1="0" y2=${Y}></line>
        </svg>
      </div>
      ${d.timeAxis?_`<div class="x-labels ${d.temperatureAxis?"indent":""}" aria-hidden="true">
            ${g.xTicks.map(y=>_`<span style="left: ${x(y.x/q*100)}%"
              >${y.label}</span>`)}
          </div>`:m}
    </div>`}};X.properties={hass:{attribute:!1},_config:{state:!0},_now:{state:!0}},X.styles=L`
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
      display: flex;
      flex-direction: column;
    }
    /* Room above the plot for half of the top temperature label. */
    .chart.with-temperatures {
      margin-top: 10px;
    }
    /* ...and below it for half of the bottom one when no hour labels sit there. */
    .chart.with-temperatures:not(.with-time) {
      margin-bottom: 10px;
    }
    .plot {
      flex: 1;
      min-height: 0;
      display: flex;
    }
    .chart svg {
      display: block;
      flex: 1;
      min-width: 0;
      height: 100%;
    }
    .y-labels,
    .x-labels {
      position: relative;
      font-size: 11px;
      line-height: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .y-labels {
      flex: none;
      width: 28px;
    }
    .y-labels span {
      position: absolute;
      right: 4px;
      transform: translateY(-50%);
    }
    .x-labels {
      flex: none;
      height: 14px;
    }
    .x-labels.indent {
      margin-left: 28px;
    }
    .x-labels span {
      position: absolute;
      top: 2px;
      transform: translateX(-50%);
    }
    .x-labels span:first-child {
      transform: none;
    }
    .x-labels span:last-child {
      transform: translateX(-100%);
    }
    .hgrid {
      stroke: var(--divider-color, rgba(127, 127, 127, 0.4));
      stroke-width: 1;
      stroke-dasharray: 2 3;
      vector-effect: non-scaling-stroke;
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
  `;function xe(s,t){customElements.get(s)||customElements.define(s,t)}function Xe(s){window.customCards=window.customCards||[],window.customCards.some(t=>t.type===s.type)||window.customCards.push(s)}xe(je,B);Xe({type:je,name:"Chronothermostat editor",preview:!1});xe(Ze,X);Xe({type:Ze,name:"Chronothermostat viewer",preview:!1});xe(qe,j);xe(Ye,be);Xe({type:qe,name:"Chronothermostat scenario",preview:!1});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
