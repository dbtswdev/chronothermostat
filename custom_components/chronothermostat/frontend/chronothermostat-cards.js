/*! chronothermostat-cards v0.1.0 */
var K=globalThis,B=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),xt=new WeakMap,D=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(B&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=xt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&xt.set(t,e))}return e}toString(){return this.cssText}},wt=i=>new D(typeof i=="string"?i:i+"",void 0,Y),X=(i,...e)=>{let t=i.length===1?i[0]:e.reduce((r,s,n)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[n+1],i[0]);return new D(t,i,Y)},St=(i,e)=>{if(B)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),s=K.litNonce;s!==void 0&&r.setAttribute("nonce",s),r.textContent=t.cssText,i.appendChild(r)}},J=B?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return wt(t)})(i):i;var{is:ue,defineProperty:pe,getOwnPropertyDescriptor:me,getOwnPropertyNames:_e,getOwnPropertySymbols:fe,getPrototypeOf:ge}=Object,x=globalThis,At=x.trustedTypes,ye=At?At.emptyScript:"",Q=x.reactiveElementPolyfillSupport,H=(i,e)=>i,tt={toAttribute(i,e){switch(e){case Boolean:i=i?ye:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},Pt=(i,e)=>!ue(i,e),Et={attribute:!0,type:String,converter:tt,reflect:!1,useDefault:!1,hasChanged:Pt},Ct,Tt;(Ct=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(Tt=x.litPropertyMetadata)!=null||(x.litPropertyMetadata=new WeakMap);var v=class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),((t=this.l)!=null?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Et){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),s=this.getPropertyDescriptor(e,r,t);s!==void 0&&pe(this.prototype,e,s)}}static getPropertyDescriptor(e,t,r){var o;let{get:s,set:n}=(o=me(this.prototype,e))!=null?o:{get(){return this[t]},set(d){this[t]=d}};return{get:s,set(d){let a=s==null?void 0:s.call(this);n==null||n.call(this,d),this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){var t;return(t=this.elementProperties.get(e))!=null?t:Et}static _$Ei(){if(this.hasOwnProperty(H("elementProperties")))return;let e=ge(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(H("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H("properties"))){let t=this.properties,r=[..._e(t),...fe(t)];for(let s of r)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,s]of t)this.elementProperties.set(r,s)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let s=this._$Eu(t,r);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let s of r)t.unshift(J(s))}else e!==void 0&&t.push(J(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t,r;((t=this._$EO)!=null?t:this._$EO=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)==null||r.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){var t;let e=(t=this.shadowRoot)!=null?t:this.attachShadow(this.constructor.shadowRootOptions);return St(e,this.constructor.elementStyles),e}connectedCallback(){var e,t;(e=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(r=>{var s;return(s=r.hostConnected)==null?void 0:s.call(r)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var r;return(r=t.hostDisconnected)==null?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){var n;let r=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,r);if(s!==void 0&&r.reflect===!0){let o=(((n=r.converter)==null?void 0:n.toAttribute)!==void 0?r.converter:tt).toAttribute(t,r.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){var n,o,d;let r=this.constructor,s=r._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let a=r.getPropertyOptions(s),c=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:tt;this._$Em=s;let l=c.fromAttribute(t,a.type);this[s]=(d=l!=null?l:(o=this._$Ej)==null?void 0:o.get(s))!=null?d:l,this._$Em=null}}requestUpdate(e,t,r,s=!1,n){var o,d;if(e!==void 0){let a=this.constructor;if(s===!1&&(n=this[e]),r!=null||(r=a.getPropertyOptions(e)),!(((o=r.hasChanged)!=null?o:Pt)(n,t)||r.useDefault&&r.reflect&&n===((d=this._$Ej)==null?void 0:d.get(e))&&!this.hasAttribute(a._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:s,wrapped:n},o){var d,a,c;r&&!((d=this._$Ej)!=null?d:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,(a=o!=null?o:t)!=null?a:this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&((c=this._$Eq)!=null?c:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var r,s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((r=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,d]of this._$Ep)this[o]=d;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,d]of n){let{wrapped:a}=d,c=this[o];a!==!0||this._$AL.has(o)||c===void 0||this.C(o,void 0,d,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(r=>{var s;return(s=r.hostUpdated)==null?void 0:s.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}},kt;v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[H("elementProperties")]=new Map,v[H("finalized")]=new Map,Q==null||Q({ReactiveElement:v}),((kt=x.reactiveElementVersions)!=null?kt:x.reactiveElementVersions=[]).push("2.1.2");var R=globalThis,Ot=i=>i,j=R.trustedTypes,Mt=j?j.createPolicy("lit-html",{createHTML:i=>i}):void 0,Ut="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Wt="?"+w,ve=`<${Wt}>`,E=document,N=()=>E.createComment(""),z=i=>i===null||typeof i!="object"&&typeof i!="function",dt=Array.isArray,$e=i=>dt(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",et=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Dt=/-->/g,Ht=/>/g,S=RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Lt=/'/g,Rt=/"/g,It=/^(?:script|style|textarea|title)$/i,ct=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),f=ct(1),q=ct(2),Ue=ct(3),C=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Nt=new WeakMap,A=E.createTreeWalker(E,129);function Ft(i,e){if(!dt(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Mt!==void 0?Mt.createHTML(e):e}var be=(i,e)=>{let t=i.length-1,r=[],s,n=e===2?"<svg>":e===3?"<math>":"",o=L;for(let d=0;d<t;d++){let a=i[d],c,l,h=-1,u=0;for(;u<a.length&&(o.lastIndex=u,l=o.exec(a),l!==null);)u=o.lastIndex,o===L?l[1]==="!--"?o=Dt:l[1]!==void 0?o=Ht:l[2]!==void 0?(It.test(l[2])&&(s=RegExp("</"+l[2],"g")),o=S):l[3]!==void 0&&(o=S):o===S?l[0]===">"?(o=s!=null?s:L,h=-1):l[1]===void 0?h=-2:(h=o.lastIndex-l[2].length,c=l[1],o=l[3]===void 0?S:l[3]==='"'?Rt:Lt):o===Rt||o===Lt?o=S:o===Dt||o===Ht?o=L:(o=S,s=void 0);let _=o===S&&i[d+1].startsWith("/>")?" ":"";n+=o===L?a+ve:h>=0?(r.push(c),a.slice(0,h)+Ut+a.slice(h)+w+_):a+w+(h===-2?d:_)}return[Ft(i,n+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},U=class i{constructor({strings:e,_$litType$:t},r){let s;this.parts=[];let n=0,o=0,d=e.length-1,a=this.parts,[c,l]=be(e,t);if(this.el=i.createElement(c,r),A.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=A.nextNode())!==null&&a.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(Ut)){let u=l[o++],_=s.getAttribute(h).split(w),b=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:b[2],strings:_,ctor:b[1]==="."?it:b[1]==="?"?ot:b[1]==="@"?nt:P}),s.removeAttribute(h)}else h.startsWith(w)&&(a.push({type:6,index:n}),s.removeAttribute(h));if(It.test(s.tagName)){let h=s.textContent.split(w),u=h.length-1;if(u>0){s.textContent=j?j.emptyScript:"";for(let _=0;_<u;_++)s.append(h[_],N()),A.nextNode(),a.push({type:2,index:++n});s.append(h[u],N())}}}else if(s.nodeType===8)if(s.data===Wt)a.push({type:2,index:n});else{let h=-1;for(;(h=s.data.indexOf(w,h+1))!==-1;)a.push({type:7,index:n}),h+=w.length-1}n++}}static createElement(e,t){let r=E.createElement("template");return r.innerHTML=e,r}};function k(i,e,t=i,r){var o,d,a;if(e===C)return e;let s=r!==void 0?(o=t._$Co)==null?void 0:o[r]:t._$Cl,n=z(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==n&&((d=s==null?void 0:s._$AO)==null||d.call(s,!1),n===void 0?s=void 0:(s=new n(i),s._$AT(i,t,r)),r!==void 0?((a=t._$Co)!=null?a:t._$Co=[])[r]=s:t._$Cl=s),s!==void 0&&(e=k(i,s._$AS(i,e.values),s,r)),e}var st=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var c;let{el:{content:t},parts:r}=this._$AD,s=((c=e==null?void 0:e.creationScope)!=null?c:E).importNode(t,!0);A.currentNode=s;let n=A.nextNode(),o=0,d=0,a=r[0];for(;a!==void 0;){if(o===a.index){let l;a.type===2?l=new W(n,n.nextSibling,this,e):a.type===1?l=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(l=new at(n,this,e)),this._$AV.push(l),a=r[++d]}o!==(a==null?void 0:a.index)&&(n=A.nextNode(),o++)}return A.currentNode=E,s}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},W=class i{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,r,s){var n;this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=s,this._$Cv=(n=s==null?void 0:s.isConnected)!=null?n:!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),z(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==C&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):$e(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&z(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){var n;let{values:t,_$litType$:r}=e,s=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=U.createElement(Ft(r.h,r.h[0]),this.options)),r);if(((n=this._$AH)==null?void 0:n._$AD)===s)this._$AH.p(t);else{let o=new st(s,this),d=o.u(this.options);o.p(t),this.T(d),this._$AH=o}}_$AC(e){let t=Nt.get(e.strings);return t===void 0&&Nt.set(e.strings,t=new U(e)),t}k(e){dt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,s=0;for(let n of e)s===t.length?t.push(r=new i(this.O(N()),this.O(N()),this,this.options)):r=t[s],r._$AI(n),s++;s<t.length&&(this._$AR(r&&r._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)==null?void 0:r.call(this,!1,!0,t);e!==this._$AB;){let s=Ot(e).nextSibling;Ot(e).remove(),e=s}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,s,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=n,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=p}_$AI(e,t=this,r,s){let n=this.strings,o=!1;if(n===void 0)e=k(this,e,t,0),o=!z(e)||e!==this._$AH&&e!==C,o&&(this._$AH=e);else{let d=e,a,c;for(e=n[0],a=0;a<n.length-1;a++)c=k(this,d[r+a],t,a),c===C&&(c=this._$AH[a]),o||(o=!z(c)||c!==this._$AH[a]),c===p?e=p:e!==p&&(e+=(c!=null?c:"")+n[a+1]),this._$AH[a]=c}o&&!s&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}},it=class extends P{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},ot=class extends P{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},nt=class extends P{constructor(e,t,r,s,n){super(e,t,r,s,n),this.type=5}_$AI(e,t=this){var o;if((e=(o=k(this,e,t,0))!=null?o:p)===C)return;let r=this._$AH,s=e===p&&r!==p||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,n=e!==p&&(r===p||s);s&&this.element.removeEventListener(this.name,this,r),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;typeof this._$AH=="function"?this._$AH.call((r=(t=this.options)==null?void 0:t.host)!=null?r:this.element,e):this._$AH.handleEvent(e)}},at=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}};var rt=R.litHtmlPolyfillSupport,zt;rt==null||rt(U,W),((zt=R.litHtmlVersions)!=null?zt:R.litHtmlVersions=[]).push("3.3.3");var Kt=(i,e,t)=>{var n,o;let r=(n=t==null?void 0:t.renderBefore)!=null?n:e,s=r._$litPart$;if(s===void 0){let d=(o=t==null?void 0:t.renderBefore)!=null?o:null;r._$litPart$=s=new W(e.insertBefore(N(),d),d,void 0,t!=null?t:{})}return s._$AI(i),s};var T=globalThis,y=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let e=super.createRenderRoot();return(r=(t=this.renderOptions).renderBefore)!=null||(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Kt(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return C}},Bt;y._$litElement$=!0,y.finalized=!0,(Bt=T.litElementHydrateSupport)==null||Bt.call(T,{LitElement:y});var lt=T.litElementPolyfillSupport;lt==null||lt({LitElement:y});var jt;((jt=T.litElementVersions)!=null?jt:T.litElementVersions=[]).push("4.2.2");var ht="chronothermostat";function qt(i){return i.callWS({type:`${ht}/info`})}function ut(i,e,t){return i.callWS({type:`${ht}/get_program`,zone:e,program:t})}function Gt(i,e,t,r,s){return i.callService(ht,"set_program",{zone:e,program:t,weekday:r,values:s})}function Vt(i,e,t){if(i.length===0)return[e,t];let r=Math.max(e,Math.floor(Math.min(...i))-1),s=Math.min(t,Math.ceil(Math.max(...i))+1);return s-r<5&&(s=Math.min(t,r+5),r=Math.max(e,s-5)),[r,s]}function Zt(i,e){let{width:t,height:r,min:s,max:n,padLeft:o,padBottom:d}=e,a=t-o,c=r-d,l=n-s||1,h=g=>c*(1-(Math.min(n,Math.max(s,g))-s)/l),u=a/96,_=i.map((g,he)=>{let bt=h(g);return{x:o+he*u,y:bt,w:u,h:c-bt}}),b=l<=6?1:l<=12?2:5,$t=[];for(let g=Math.ceil(s/b)*b;g<=n;g+=b)$t.push({y:h(g),label:String(g)});let le=[0,6,12,18,24].map(g=>({x:o+a*g/24,label:String(g)}));return{bars:_,yTicks:$t,xTicks:le}}function Yt(i,e){let t=Math.floor((i-e.padLeft)/(e.width-e.padLeft)*96);return Math.min(95,Math.max(0,t))}var Xt=(i,e,t)=>Math.min(t,Math.max(e,i));function pt(i,e){return{...i,cursor:Xt(Math.round(e),0,95)}}function mt(i,e){return pt(i,i.cursor+e)}function _t(i,e){let t=Xt(Math.round((i.values[i.cursor]+e)/.5)*.5,i.min,i.max),r=i.values.slice();return r[i.cursor]=t,{...i,values:r}}function Jt(i){if(i.cursor>=95)return i;let e=i.values.slice();return e[i.cursor+1]=e[i.cursor],{...i,values:e,cursor:i.cursor+1}}function ft(i,e){return{...i,values:e.slice()}}function gt(i){return i.values.length!==i.saved.length||i.values.some((e,t)=>e!==i.saved[t])}var I=["mon","tue","wed","thu","fri","sat","sun"],xe={it:{mon:["luned\xEC","Lun"],tue:["marted\xEC","Mar"],wed:["mercoled\xEC","Mer"],thu:["gioved\xEC","Gio"],fri:["venerd\xEC","Ven"],sat:["sabato","Sab"],sun:["domenica","Dom"]},en:{mon:["Monday","Mon"],tue:["Tuesday","Tue"],wed:["Wednesday","Wed"],thu:["Thursday","Thu"],fri:["Friday","Fri"],sat:["Saturday","Sat"],sun:["Sunday","Sun"]}};function F(i,e,t=!1){return xe[e][i][t?1:0]}function yt(i){return I[(i.getDay()+6)%7]}var Qt=i=>i<10?`0${i}`:String(i);function te(i,e){let t=i.toFixed(1);return`${e==="it"?t.replace(".",","):t} \xB0C`}function ee(i){return`${Qt(Math.floor(i/4))}:${Qt(i%4*15)}`}function re(i,e,t={delay:450,interval:110}){let r,s=()=>{r!==void 0&&clearTimeout(r),r=void 0},n=()=>{e(),r=setTimeout(n,t.interval)},o=a=>{a.preventDefault(),s(),e(),r=setTimeout(n,t.delay)},d=a=>a.preventDefault();return i.addEventListener("pointerdown",o),i.addEventListener("pointerup",s),i.addEventListener("pointerleave",s),i.addEventListener("pointercancel",s),i.addEventListener("contextmenu",d),()=>{s(),i.removeEventListener("pointerdown",o),i.removeEventListener("pointerup",s),i.removeEventListener("pointerleave",s),i.removeEventListener("pointercancel",s),i.removeEventListener("contextmenu",d)}}var we={none:"No changes",unsaved:"Unsaved changes",saved_day:"{day} program saved",editing:"Editing:",work:"Work",holiday:"Holiday",away:"Away",off:"Off",continue:"Continue",save:"Save",copy_from:"Copy from\u2026",copy_from_hint:"Copy the saved program of:",discard:"Discard",confirm:"Confirm",cancel:"Cancel",today:"Today",today_day:"Today, {day}",prev_slot:"Previous quarter hour",next_slot:"Next quarter hour",temp_down:"Lower temperature",temp_up:"Raise temperature",return_date:"Return date",return_time:"Return time",error_load:"Could not load the data.",error_save:"Could not save.",house_scenario:"House scenario",return_required:"Set the return day and time",house_work:"The house follows the Work program.",house_holiday:"The house follows the Holiday program.",house_away:"Heating off until {when}, then it switches to Work by itself.",house_away_no_return:"Away with no return: stays off until you set a return.",house_off:"Heating off until you pick another scenario.",status_schedule:"Schedule: {temp} {until}, then {next}.",status_schedule_flat:"Schedule: {temp}.",status_forced:"Forced to {temp} {until}, then back to the schedule ({next}).",status_forced_flat:"Forced to {temp}.",status_zone_off:"Switched off by you. The schedule resumes when you turn it back on.",status_away:"Away: off until {when}, then Work.",status_away_no_return:"Away with no return: stays off until you set a return.",status_off:"Heating off.",status_zone_on_manual:"Turned on by hand with the heating off: stays at {temp} until you turn it off or change scenario.",status_unavailable:"Thermostat unavailable.",config_entity:"Thermostat",config_name:"Name (optional)"},Se={none:"Nessuna modifica",unsaved:"Modifiche non salvate",saved_day:"Programma di {day} salvato",editing:"Stai modificando:",work:"Lavoro",holiday:"Ferie",away:"Fuori casa",off:"Spento",continue:"Prosegui",save:"Salva",copy_from:"Copia da\u2026",copy_from_hint:"Copia il programma salvato di:",discard:"Scarta",confirm:"Conferma",cancel:"Annulla",today:"Oggi",today_day:"Oggi, {day}",prev_slot:"Quarto d'ora precedente",next_slot:"Quarto d'ora successivo",temp_down:"Abbassa la temperatura",temp_up:"Alza la temperatura",return_date:"Giorno di rientro",return_time:"Ora di rientro",error_load:"Impossibile caricare i dati.",error_save:"Salvataggio non riuscito.",house_scenario:"Scenario della casa",return_required:"Indica giorno e ora del rientro",house_work:"La casa segue il programma Lavoro.",house_holiday:"La casa segue il programma Ferie.",house_away:"Impianto spento fino a {when}, poi passa da solo a Lavoro.",house_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",house_off:"Impianto spento finch\xE9 non scegli un altro scenario.",status_schedule:"Programma: {temp} {until}, poi {next}.",status_schedule_flat:"Programma: {temp}.",status_forced:"Forzato a {temp} {until}, poi torna al programma ({next}).",status_forced_flat:"Forzato a {temp}.",status_zone_off:"Spento da te. Il programma riparte quando lo riaccendi.",status_away:"Fuori casa: spento fino a {when}, poi Lavoro.",status_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",status_off:"Impianto spento.",status_zone_on_manual:"Acceso a mano con impianto spento: resta a {temp} finch\xE9 non lo spegni o cambi scenario.",status_unavailable:"Termostato non disponibile.",config_entity:"Termostato",config_name:"Nome (facoltativo)"},se={en:we,it:Se};function O(i){var t,r,s;return((s=(r=(t=i==null?void 0:i.locale)==null?void 0:t.language)!=null?r:i==null?void 0:i.language)!=null?s:"").toLowerCase().startsWith("it")?"it":"en"}function m(i,e,t){var s,n,o;let r=(o=(n=(s=se[i])==null?void 0:s[e])!=null?n:se.en[e])!=null?o:e;return t?r.replace(/\{(\w+)\}/g,(d,a)=>a in t?String(t[a]):d):r}var V="chronothermostat-zone-card-editor",Ae=[{name:"entity",selector:{entity:{domain:"climate"}}},{name:"name",selector:{text:{}}}],G=class extends y{constructor(){super(...arguments);this._label=t=>m(O(this.hass),t.name==="entity"?"config_entity":"config_name")}setConfig(t){this._config=t}render(){return!this.hass||!this._config?p:f`<ha-form .hass=${this.hass} .data=${this._config} .schema=${Ae}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`}_changed(t){t.stopPropagation();let r={...t.detail.value};r.name||delete r.name,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r},bubbles:!0,composed:!0}))}};G.properties={hass:{attribute:!1},_config:{state:!0}};customElements.get(V)||customElements.define(V,G);var vt="chronothermostat-editor-card",Ce=["work","holiday"],Te=["prev","next","cont","minus","plus"],ie=.5,ke=3e3,oe=150,ne=8,Z=26,ae=22,Pe=452,de=i=>i.charAt(0).toUpperCase()+i.slice(1),Oe=i=>i.getHours()*4+Math.floor(i.getMinutes()/15),$=i=>Math.round(i*100)/100,ce=i=>I.every(e=>{var t;return Array.isArray((t=i.weekdays)==null?void 0:t[e])&&i.weekdays[e].length===96}),Me=f`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M3 12h13M11 6l6 6-6 6M21 5v14" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`,M=class extends y{constructor(){super();this._loadToken=0;this._holds=new Map;this._observedChart=null;this._program="work",this._day=yt(new Date),this._loadFailed=!1,this._copyOpen=!1,this._saving=!1,this._chartWidth=Pe}static getConfigElement(){return document.createElement(V)}static getStubConfig(t){var s;let r=Object.keys((s=t==null?void 0:t.states)!=null?s:{}).find(n=>n.startsWith("climate."));return{entity:r!=null?r:""}}setConfig(t){if(!t||typeof t.entity!="string"||t.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==t.entity&&this._reset(),this._config={...t}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this._holds.forEach(t=>t.detach()),this._holds.clear(),this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=null,this._clearSaved()}shouldUpdate(t){if(t.size===1&&t.has("hass")){let r=t.get("hass");return!r||O(r)!==O(this.hass)}return!0}willUpdate(){this.hass&&this._config&&this._loadedFor!==this._config.entity&&this._load()}updated(){this.isConnected&&(this._syncHolds(),this._observeChart())}render(){if(!this._config)return p;let t=O(this.hass);if(this._loadFailed)return f`<ha-card><div class="load-error error">${m(t,"error_load")}</div></ha-card>`;let r=this._state;if(!r)return f`<ha-card></ha-card>`;let[s,n]=this._status(t,r);return f`<ha-card>
      <div class="row">
        <span class="label">${m(t,"editing")}</span>
        ${Ce.map(o=>f`<button class="chip program ${o===this._program?"on":""}"
          data-program=${o} aria-pressed=${o===this._program?"true":"false"}
          @click=${()=>this._select({program:o,day:this._day})}>${m(t,o)}</button>`)}
      </div>
      <div class="row days">
        ${I.map(o=>f`<button class="chip day ${o===this._day?"on":""}"
          data-day=${o} aria-pressed=${o===this._day?"true":"false"}
          @click=${()=>this._select({program:this._program,day:o})}>
          ${F(o,t,!0)}
        </button>`)}
      </div>
      ${this._pending?this._renderDirtyBar(t):p}
      <div class="reading">
        <span><span class="day-name">${de(F(this._day,t))}</span><span
          class="time">${ee(r.cursor)}</span></span>
        <span class="temp">${te(r.values[r.cursor],t)}</span>
      </div>
      ${this._renderChart(r)}
      <div class="controls">
        <button class="big hold" id="prev" aria-label=${m(t,"prev_slot")}>
          <span class="glyph" aria-hidden="true">‹</span>
        </button>
        <button class="big hold" id="next" aria-label=${m(t,"next_slot")}>
          <span class="glyph" aria-hidden="true">›</span>
        </button>
        <button class="big hold wide" id="cont">
          ${Me}<span>${m(t,"continue")}</span>
        </button>
        <button class="big hold" id="minus" aria-label=${m(t,"temp_down")}>
          <span class="glyph" aria-hidden="true">−</span>
        </button>
        <button class="big hold" id="plus" aria-label=${m(t,"temp_up")}>
          <span class="glyph" aria-hidden="true">+</span>
        </button>
        <button class="big" id="copy" aria-expanded=${this._copyOpen?"true":"false"}
          @click=${this._toggleCopy}>${m(t,"copy_from")}</button>
        <button class="big save" id="save" ?disabled=${this._saving} @click=${this._onSave}>
          ${m(t,"save")}
        </button>
      </div>
      <div class="footer">
        <span class="name">${this._zoneName()}</span>
        <span class="status ${n}">${s}</span>
      </div>
      ${this._copyOpen?this._renderCopyPanel(t):p}
    </ha-card>`}_renderDirtyBar(t){return f`<div class="dirty-bar">
      <span class="message">${m(t,"unsaved")}</span>
      <button class="big" id="bar-discard" @click=${this._discardPending}>${m(t,"discard")}</button>
      <button class="big save" id="bar-save" ?disabled=${this._saving} @click=${this._savePending}>
        ${m(t,"save")}
      </button>
    </div>`}_renderChart(t){let r=this._chartWidth,s=oe-ne,[n,o]=Vt(t.values,t.min,t.max),d=Zt(t.values,{width:r,height:s,min:n,max:o,padLeft:Z,padBottom:ae}),a=s-ae,c=d.bars[t.cursor],l=$(c.x+c.w/2),h=d.xTicks.length-1;return f`<div class="chart">
      <svg viewBox="0 0 ${r} ${oe}" @pointerdown=${this._onChartDown}>
        <g transform="translate(0 ${ne})">
          ${d.yTicks.map(u=>q`
            <line class="grid" x1=${Z} x2=${r}
              y1=${$(u.y)} y2=${$(u.y)}></line>
            <text class="axis" x=${Z-5} y=${$(u.y)} dy="0.35em"
              text-anchor="end">${u.label}</text>`)}
          ${d.bars.map((u,_)=>q`<rect class="bar ${_===t.cursor?"cursor":""}"
            x=${$(u.x)} y=${$(u.y)} width=${$(Math.max(0,u.w-.6))}
            height=${$(u.h)}></rect>`)}
          <line class="cursor-line" x1=${l} x2=${l} y1="0" y2=${a+4}></line>
          ${d.xTicks.map((u,_)=>q`<text class="axis" x=${$(u.x)} y=${a+18}
            text-anchor=${_===0?"start":_===h?"end":"middle"}>${u.label}</text>`)}
        </g>
      </svg>
    </div>`}_renderCopyPanel(t){return f`<div class="copy-panel">
      <div class="hint">${m(t,"copy_from_hint")}</div>
      <div class="copy-days">
        ${I.filter(r=>r!==this._day).map(r=>f`<button class="chip" data-day=${r} @click=${()=>this._copyFrom(r)}>
            ${de(F(r,t))}
          </button>`)}
      </div>
    </div>`}_status(t,r){return this._failure?[m(t,this._failure),"error"]:gt(r)?[m(t,"unsaved"),"warning"]:this._savedDay?[m(t,"saved_day",{day:F(this._savedDay,t)}),"success"]:[m(t,"none"),""]}_zoneName(){let t=this._config;if(!t)return"";if(t.name)return t.name;let s=(this._info?this._info.zones:[]).find(n=>n.entity_id===t.entity);return s?s.name:""}_reset(){this._loadToken++,this._loadedFor=void 0,this._data=void 0,this._state=void 0,this._loadFailed=!1,this._failure=void 0,this._pending=void 0,this._copyOpen=!1,this._clearSaved()}async _load(){let t=this.hass,r=this._config;if(!t||!r)return;let s=r.entity;this._loadedFor=s;let n;try{if(this._info||(this._info=await qt(t)),this._loadedFor!==s)return;if(!this._info.zones.some(c=>c.entity_id===s))throw new Error(`${s} is not a chronothermostat zone`);let d=this._info.scenario_entity_id,a=d?t.states[d]:void 0;n=a&&a.state==="holiday"?"holiday":"work"}catch{this._loadedFor===s&&(this._loadFailed=!0);return}let o=new Date;await this._loadProgram({program:n,day:yt(o)},Oe(o))}async _loadProgram(t,r){let s=this.hass,n=this._config;if(!s||!n)return!1;let o=++this._loadToken;try{let d=await ut(s,n.entity,t.program);if(o!==this._loadToken)return!1;if(!ce(d))throw new Error("Invalid program data");return this._program=t.program,this._showDay(d,t.day,r),!0}catch{return o!==this._loadToken||(this._state?this._failure="error_load":this._loadFailed=!0),!1}}_showDay(t,r,s){let n=t.weekdays[r];this._data=t,this._day=r,this._failure=void 0,this._state={values:n.slice(),saved:n.slice(),cursor:s,min:t.min_temp,max:t.max_temp}}_select(t){if(t.program===this._program&&t.day===this._day){this._pending=void 0;return}if(this._state&&gt(this._state)){this._pending=t;return}this._switchTo(t)}async _switchTo(t){this._pending=void 0,this._copyOpen=!1;let r=this._state?this._state.cursor:0;if(t.program===this._program&&this._data){this._showDay(this._data,t.day,r);return}await this._loadProgram(t,r)}async _savePending(){await this._save()&&this._pending&&await this._switchTo(this._pending)}_discardPending(){let t=this._pending;!t||!this._state||(this._state=ft(this._state,this._state.saved),this._switchTo(t))}_hold(t){let r=this._state;r&&(t==="prev"?this._state=mt(r,-1):t==="next"?this._state=mt(r,1):t==="cont"?this._edit(Jt(r)):t==="minus"?this._edit(_t(r,-ie)):this._edit(_t(r,ie)))}_edit(t){this._state=t,this._failure=void 0,this._clearSaved()}_onChartDown(t){let r=this._state,s=t.currentTarget.getBoundingClientRect();if(!r||s.width<=0)return;let n=(t.clientX-s.left)/s.width*this._chartWidth,o=Yt(n,{width:this._chartWidth,padLeft:Z});this._state=pt(r,o)}_toggleCopy(){this._copyOpen=!this._copyOpen}_copyFrom(t){this._copyOpen=!1,!(!this._state||!this._data)&&this._edit(ft(this._state,this._data.weekdays[t]))}_onSave(){this._save()}async _save(){let t=this.hass,r=this._config,s=this._state;if(!t||!r||!s||this._saving)return!1;let n=this._program,o=this._day,d=s.values.slice();this._saving=!0;try{await Gt(t,r.entity,n,o,d);let a=await ut(t,r.entity,n),c=n===this._program&&o===this._day;return n===this._program&&ce(a)&&(this._data=a),c&&this._state&&(this._state={...this._state,saved:d}),this._failure=void 0,this._flashSaved(o),!0}catch{return this._failure="error_save",!1}finally{this._saving=!1}}_flashSaved(t){this._clearSaved(),this._savedDay=t,this._savedTimer=setTimeout(()=>{this._savedTimer=void 0,this._savedDay=void 0},ke)}_clearSaved(){this._savedTimer!==void 0&&clearTimeout(this._savedTimer),this._savedTimer=void 0,this._savedDay=void 0}_syncHolds(){for(let t of Te){let r=this.renderRoot.querySelector(`#${t}`),s=this._holds.get(t);s&&s.el===r||(s&&s.detach(),this._holds.delete(t),r&&this._holds.set(t,{el:r,detach:re(r,()=>this._hold(t))}))}}_observeChart(){let t=this.renderRoot.querySelector(".chart");t!==this._observedChart&&(this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=t,!(!t||typeof ResizeObserver=="undefined")&&(this._resizeObserver||(this._resizeObserver=new ResizeObserver(r=>{let s=Math.round(r[0].contentRect.width);s>0&&(this._chartWidth=s)})),this._resizeObserver.observe(t)))}};M.properties={hass:{attribute:!1},_config:{state:!0},_program:{state:!0},_day:{state:!0},_state:{state:!0},_loadFailed:{state:!0},_failure:{state:!0},_savedDay:{state:!0},_pending:{state:!0},_copyOpen:{state:!0},_saving:{state:!0},_chartWidth:{state:!0}},M.styles=X`
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
  `;function De(i,e){customElements.get(i)||customElements.define(i,e)}function He(i){window.customCards=window.customCards||[],window.customCards.some(e=>e.type===i.type)||window.customCards.push(i)}De(vt,M);He({type:vt,name:"Chronothermostat editor",preview:!1});
