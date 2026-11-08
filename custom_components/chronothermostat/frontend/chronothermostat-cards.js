/*! chronothermostat-cards v0.1.0 */
var ot=globalThis,dt=ot.ShadowRoot&&(ot.ShadyCSS===void 0||ot.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$t=Symbol(),Yt=new WeakMap,Y=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==$t)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(dt&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=Yt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&Yt.set(t,e))}return e}toString(){return this.cssText}},Xt=r=>new Y(typeof r=="string"?r:r+"",void 0,$t),P=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,a)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new Y(t,r,$t)},Qt=(r,e)=>{if(dt)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=ot.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},xt=dt?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return Xt(t)})(r):r;var{is:Ke,defineProperty:Be,getOwnPropertyDescriptor:Ge,getOwnPropertyNames:je,getOwnPropertySymbols:Ve,getPrototypeOf:qe}=Object,C=globalThis,Jt=C.trustedTypes,Ze=Jt?Jt.emptyScript:"",wt=C.reactiveElementPolyfillSupport,X=(r,e)=>r,St={toAttribute(r,e){switch(e){case Boolean:r=r?Ze:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},ie=(r,e)=>!Ke(r,e),te={attribute:!0,type:String,converter:St,reflect:!1,useDefault:!1,hasChanged:ie},ee,se;(ee=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(se=C.litPropertyMetadata)!=null||(C.litPropertyMetadata=new WeakMap);var S=class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),((t=this.l)!=null?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=te){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&Be(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){var n;let{get:i,set:a}=(n=Ge(this.prototype,e))!=null?n:{get(){return this[t]},set(d){this[t]=d}};return{get:i,set(d){let o=i==null?void 0:i.call(this);a==null||a.call(this,d),this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){var t;return(t=this.elementProperties.get(e))!=null?t:te}static _$Ei(){if(this.hasOwnProperty(X("elementProperties")))return;let e=qe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(X("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(X("properties"))){let t=this.properties,s=[...je(t),...Ve(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(xt(i))}else e!==void 0&&t.push(xt(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t,s;((t=this._$EO)!=null?t:this._$EO=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){var t;let e=(t=this.shadowRoot)!=null?t:this.attachShadow(this.constructor.shadowRootOptions);return Qt(e,this.constructor.elementStyles),e}connectedCallback(){var e,t;(e=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var a;let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(((a=s.converter)==null?void 0:a.toAttribute)!==void 0?s.converter:St).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){var a,n,d;let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),c=typeof o.converter=="function"?{fromAttribute:o.converter}:((a=o.converter)==null?void 0:a.fromAttribute)!==void 0?o.converter:St;this._$Em=i;let h=c.fromAttribute(t,o.type);this[i]=(d=h!=null?h:(n=this._$Ej)==null?void 0:n.get(i))!=null?d:h,this._$Em=null}}requestUpdate(e,t,s,i=!1,a){var n,d;if(e!==void 0){let o=this.constructor;if(i===!1&&(a=this[e]),s!=null||(s=o.getPropertyOptions(e)),!(((n=s.hasChanged)!=null?n:ie)(a,t)||s.useDefault&&s.reflect&&a===((d=this._$Ej)==null?void 0:d.get(e))&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:a},n){var d,o,c;s&&!((d=this._$Ej)!=null?d:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,(o=n!=null?n:t)!=null?o:this[e]),a!==!0||n!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&((c=this._$Eq)!=null?c:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[n,d]of this._$Ep)this[n]=d;this._$Ep=void 0}let a=this.constructor.elementProperties;if(a.size>0)for(let[n,d]of a){let{wrapped:o}=d,c=this[n];o!==!0||this._$AL.has(n)||c===void 0||this.C(n,void 0,d,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(a=>{var n;return(n=a.hostUpdate)==null?void 0:n.call(a)}),this.update(t)):this._$EM()}catch(a){throw e=!1,this._$EM(),a}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}},re;S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[X("elementProperties")]=new Map,S[X("finalized")]=new Map,wt==null||wt({ReactiveElement:S}),((re=C.reactiveElementVersions)!=null?re:C.reactiveElementVersions=[]).push("2.1.2");var J=globalThis,ne=r=>r,ct=J.trustedTypes,ae=ct?ct.createPolicy("lit-html",{createHTML:r=>r}):void 0,pe="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,_e="?"+k,Ye=`<${_e}>`,O=document,tt=()=>O.createComment(""),et=r=>r===null||typeof r!="object"&&typeof r!="function",Pt=Array.isArray,Xe=r=>Pt(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",At=`[ 	
\f\r]`,Q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,oe=/-->/g,de=/>/g,H=RegExp(`>|${At}(?:([^\\s"'>=/]+)(${At}*=${At}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ce=/'/g,le=/"/g,fe=/^(?:script|style|textarea|title)$/i,Ht=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),g=Ht(1),D=Ht(2),Es=Ht(3),M=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),he=new WeakMap,L=O.createTreeWalker(O,129);function me(r,e){if(!Pt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ae!==void 0?ae.createHTML(e):e}var Qe=(r,e)=>{let t=r.length-1,s=[],i,a=e===2?"<svg>":e===3?"<math>":"",n=Q;for(let d=0;d<t;d++){let o=r[d],c,h,p=-1,l=0;for(;l<o.length&&(n.lastIndex=l,h=n.exec(o),h!==null);)l=n.lastIndex,n===Q?h[1]==="!--"?n=oe:h[1]!==void 0?n=de:h[2]!==void 0?(fe.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=H):h[3]!==void 0&&(n=H):n===H?h[0]===">"?(n=i!=null?i:Q,p=-1):h[1]===void 0?p=-2:(p=n.lastIndex-h[2].length,c=h[1],n=h[3]===void 0?H:h[3]==='"'?le:ce):n===le||n===ce?n=H:n===oe||n===de?n=Q:(n=H,i=void 0);let f=n===H&&r[d+1].startsWith("/>")?" ":"";a+=n===Q?o+Ye:p>=0?(s.push(c),o.slice(0,p)+pe+o.slice(p)+k+f):o+k+(p===-2?d:f)}return[me(r,a+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},st=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let a=0,n=0,d=e.length-1,o=this.parts,[c,h]=Qe(e,t);if(this.el=r.createElement(c,s),L.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=L.nextNode())!==null&&o.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let p of i.getAttributeNames())if(p.endsWith(pe)){let l=h[n++],f=i.getAttribute(p).split(k),m=/([.?@])?(.*)/.exec(l);o.push({type:1,index:a,name:m[2],strings:f,ctor:m[1]==="."?Ct:m[1]==="?"?kt:m[1]==="@"?Dt:W}),i.removeAttribute(p)}else p.startsWith(k)&&(o.push({type:6,index:a}),i.removeAttribute(p));if(fe.test(i.tagName)){let p=i.textContent.split(k),l=p.length-1;if(l>0){i.textContent=ct?ct.emptyScript:"";for(let f=0;f<l;f++)i.append(p[f],tt()),L.nextNode(),o.push({type:2,index:++a});i.append(p[l],tt())}}}else if(i.nodeType===8)if(i.data===_e)o.push({type:2,index:a});else{let p=-1;for(;(p=i.data.indexOf(k,p+1))!==-1;)o.push({type:7,index:a}),p+=k.length-1}a++}}static createElement(e,t){let s=O.createElement("template");return s.innerHTML=e,s}};function U(r,e,t=r,s){var n,d,o;if(e===M)return e;let i=s!==void 0?(n=t._$Co)==null?void 0:n[s]:t._$Cl,a=et(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==a&&((d=i==null?void 0:i._$AO)==null||d.call(i,!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,t,s)),s!==void 0?((o=t._$Co)!=null?o:t._$Co=[])[s]=i:t._$Cl=i),i!==void 0&&(e=U(r,i._$AS(r,e.values),i,s)),e}var Tt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var c;let{el:{content:t},parts:s}=this._$AD,i=((c=e==null?void 0:e.creationScope)!=null?c:O).importNode(t,!0);L.currentNode=i;let a=L.nextNode(),n=0,d=0,o=s[0];for(;o!==void 0;){if(n===o.index){let h;o.type===2?h=new rt(a,a.nextSibling,this,e):o.type===1?h=new o.ctor(a,o.name,o.strings,this,e):o.type===6&&(h=new Rt(a,this,e)),this._$AV.push(h),o=s[++d]}n!==(o==null?void 0:o.index)&&(a=L.nextNode(),n++)}return L.currentNode=O,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},rt=class r{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,s,i){var a;this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=(a=i==null?void 0:i.isConnected)!=null?a:!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=U(this,e,t),et(e)?e===_||e==null||e===""?(this._$AH!==_&&this._$AR(),this._$AH=_):e!==this._$AH&&e!==M&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Xe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==_&&et(this._$AH)?this._$AA.nextSibling.data=e:this.T(O.createTextNode(e)),this._$AH=e}$(e){var a;let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=st.createElement(me(s.h,s.h[0]),this.options)),s);if(((a=this._$AH)==null?void 0:a._$AD)===i)this._$AH.p(t);else{let n=new Tt(i,this),d=n.u(this.options);n.p(t),this.T(d),this._$AH=n}}_$AC(e){let t=he.get(e.strings);return t===void 0&&he.set(e.strings,t=new st(e)),t}k(e){Pt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let a of e)i===t.length?t.push(s=new r(this.O(tt()),this.O(tt()),this,this.options)):s=t[i],s._$AI(a),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){let i=ne(e).nextSibling;ne(e).remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},W=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,a){this.type=1,this._$AH=_,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=a,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(e,t=this,s,i){let a=this.strings,n=!1;if(a===void 0)e=U(this,e,t,0),n=!et(e)||e!==this._$AH&&e!==M,n&&(this._$AH=e);else{let d=e,o,c;for(e=a[0],o=0;o<a.length-1;o++)c=U(this,d[s+o],t,o),c===M&&(c=this._$AH[o]),n||(n=!et(c)||c!==this._$AH[o]),c===_?e=_:e!==_&&(e+=(c!=null?c:"")+a[o+1]),this._$AH[o]=c}n&&!i&&this.j(e)}j(e){e===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}},Ct=class extends W{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===_?void 0:e}},kt=class extends W{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==_)}},Dt=class extends W{constructor(e,t,s,i,a){super(e,t,s,i,a),this.type=5}_$AI(e,t=this){var n;if((e=(n=U(this,e,t,0))!=null?n:_)===M)return;let s=this._$AH,i=e===_&&s!==_||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,a=e!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;typeof this._$AH=="function"?this._$AH.call((s=(t=this.options)==null?void 0:t.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}},Rt=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){U(this,e)}};var Et=J.litHtmlPolyfillSupport,ue;Et==null||Et(st,rt),((ue=J.litHtmlVersions)!=null?ue:J.litHtmlVersions=[]).push("3.3.3");var ge=(r,e,t)=>{var a,n;let s=(a=t==null?void 0:t.renderBefore)!=null?a:e,i=s._$litPart$;if(i===void 0){let d=(n=t==null?void 0:t.renderBefore)!=null?n:null;s._$litPart$=i=new rt(e.insertBefore(tt(),d),d,void 0,t!=null?t:{})}return i._$AI(r),i};var N=globalThis,b=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,s;let e=super.createRenderRoot();return(s=(t=this.renderOptions).renderBefore)!=null||(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ge(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return M}},ye;b._$litElement$=!0,b.finalized=!0,(ye=N.litElementHydrateSupport)==null||ye.call(N,{LitElement:b});var Lt=N.litElementPolyfillSupport;Lt==null||Lt({LitElement:b});var ve;((ve=N.litElementVersions)!=null?ve:N.litElementVersions=[]).push("4.2.2");var lt="chronothermostat";function ht(r){return r.callWS({type:`${lt}/info`})}function Ot(r,e,t){return r.callWS({type:`${lt}/get_program`,zone:e,program:t})}function be(r,e,t,s,i){return r.callService(lt,"set_program",{zone:e,program:t,weekday:s,values:i})}var I=r=>r<10?`0${r}`:String(r);function Je(r){let e=-r.getTimezoneOffset(),t=e>=0?"+":"-",s=Math.abs(e);return`${r.getFullYear()}-${I(r.getMonth()+1)}-${I(r.getDate())}T${I(r.getHours())}:${I(r.getMinutes())}:${I(r.getSeconds())}${t}${I(Math.floor(s/60))}:${I(s%60)}`}function $e(r,e,t){let s={scenario:e};return t&&(s.return_at=Je(t)),r.callService(lt,"set_scenario",s)}function ut(r,e,t){if(r.length===0)return[e,t];let s=Math.max(e,Math.floor(Math.min(...r))-1),i=Math.min(t,Math.ceil(Math.max(...r))+1);return i-s<5&&(i=Math.min(t,s+5),s=Math.max(e,i-5)),[s,i]}function it(r,e){let{width:t,height:s,min:i,max:a,padLeft:n,padBottom:d}=e,o=t-n,c=s-d,h=a-i||1,p=y=>c*(1-(Math.min(a,Math.max(i,y))-i)/h),l=o/96,f=r.map((y,v)=>{let Z=p(y);return{x:n+v*l,y:Z,w:l,h:c-Z}}),m=h<=6?1:h<=12?2:5,x=[];for(let y=Math.ceil(i/m)*m;y<=a;y+=m)x.push({y:p(y),label:String(y)});let R=[0,6,12,18,24].map(y=>({x:n+o*y/24,label:String(y)}));return{bars:f,yTicks:x,xTicks:R}}function xe(r,e){let t=Math.floor((r-e.padLeft)/(e.width-e.padLeft)*96);return Math.min(95,Math.max(0,t))}var we=(r,e,t)=>Math.min(t,Math.max(e,r));function Mt(r,e){return{...r,cursor:we(Math.round(e),0,95)}}function Nt(r,e){return Mt(r,r.cursor+e)}function It(r,e){let t=we(Math.round((r.values[r.cursor]+e)/.5)*.5,r.min,r.max),s=r.values.slice();return s[r.cursor]=t,{...r,values:s}}function Se(r){if(r.cursor>=95)return r;let e=r.values.slice();return e[r.cursor+1]=e[r.cursor],{...r,values:e,cursor:r.cursor+1}}function zt(r,e){return{...r,values:e.slice()}}function K(r){return r.values.length!==r.saved.length||r.values.some((e,t)=>e!==r.saved[t])}var nt=["mon","tue","wed","thu","fri","sat","sun"],ts={it:{mon:["luned\xEC","Lun"],tue:["marted\xEC","Mar"],wed:["mercoled\xEC","Mer"],thu:["gioved\xEC","Gio"],fri:["venerd\xEC","Ven"],sat:["sabato","Sab"],sun:["domenica","Dom"]},en:{mon:["Monday","Mon"],tue:["Tuesday","Tue"],wed:["Wednesday","Wed"],thu:["Thursday","Thu"],fri:["Friday","Fri"],sat:["Saturday","Sat"],sun:["Sunday","Sun"]}};function A(r,e,t=!1){return ts[e][r][t?1:0]}function z(r){return nt[(r.getDay()+6)%7]}var pt=r=>r<10?`0${r}`:String(r);function E(r,e){let t=r.toFixed(1);return`${e==="it"?t.replace(".",","):t} \xB0C`}function Ae(r){return`${pt(Math.floor(r/4))}:${pt(r%4*15)}`}var Ft=r=>`${pt(r.getHours())}:${pt(r.getMinutes())}`;function Ee(r,e,t){let s=Ft(r),i=o=>new Date(o.getFullYear(),o.getMonth(),o.getDate()).getTime(),a=new Date(e.getFullYear(),e.getMonth(),e.getDate()+1).getTime(),n=i(r);if(n<=i(e))return t==="it"?`fino alle ${s}`:`until ${s}`;if(n===a)return t==="it"?`fino a domani alle ${s}`:`until tomorrow at ${s}`;let d=A(z(r),t);return t==="it"?`fino a ${d} alle ${s}`:`until ${d} at ${s}`}function _t(r,e){let t=A(z(r),e);return e==="it"?`${t} ${r.getDate()} alle ${Ft(r)}`:`${t} ${r.getDate()} at ${Ft(r)}`}function Te(r,e,t={delay:450,interval:110}){let s,i=()=>{s!==void 0&&clearTimeout(s),s=void 0},a=()=>{e(),s=setTimeout(a,t.interval)},n=o=>{o.preventDefault(),i(),e(),s=setTimeout(a,t.delay)},d=o=>o.preventDefault();return r.addEventListener("pointerdown",n),r.addEventListener("pointerup",i),r.addEventListener("pointerleave",i),r.addEventListener("pointercancel",i),r.addEventListener("contextmenu",d),()=>{i(),r.removeEventListener("pointerdown",n),r.removeEventListener("pointerup",i),r.removeEventListener("pointerleave",i),r.removeEventListener("pointercancel",i),r.removeEventListener("contextmenu",d)}}var es={none:"No changes",unsaved:"Unsaved changes",saved_day:"{day} program saved",editing:"Editing:",work:"Work",holiday:"Holiday",away:"Away",off:"Off",continue:"Continue",save:"Save",copy_from:"Copy from\u2026",copy_from_hint:"Copy the saved program of:",discard:"Discard",confirm:"Confirm",cancel:"Cancel",today:"Today",today_day:"Today, {day}",prev_slot:"Previous quarter hour",next_slot:"Next quarter hour",temp_down:"Lower temperature",temp_up:"Raise temperature",return_date:"Return date",return_time:"Return time",error_load:"Could not load the data.",error_save:"Could not save.",house_scenario:"House scenario",return_required:"Set the return day and time",house_work:"The house follows the Work program.",house_holiday:"The house follows the Holiday program.",house_away:"Heating off until {when}, then it switches to Work by itself.",house_away_no_return:"Away with no return: stays off until you set a return.",house_off:"Heating off until you pick another scenario.",status_schedule:"Schedule: {temp} {until}, then {next}.",status_schedule_flat:"Schedule: {temp}.",status_forced:"Forced to {temp} {until}, then back to the schedule ({next}).",status_forced_flat:"Forced to {temp}.",status_zone_off:"Switched off by you. The schedule resumes when you turn it back on.",status_away:"Away: off until {when}, then Work.",status_away_no_return:"Away with no return: stays off until you set a return.",status_off:"Heating off.",status_zone_on_manual:"Turned on by hand with the heating off: stays at {temp} until you turn it off or change scenario.",status_unavailable:"Thermostat unavailable.",config_entity:"Thermostat",config_name:"Name (optional)"},ss={none:"Nessuna modifica",unsaved:"Modifiche non salvate",saved_day:"Programma di {day} salvato",editing:"Stai modificando:",work:"Lavoro",holiday:"Ferie",away:"Fuori casa",off:"Spento",continue:"Prosegui",save:"Salva",copy_from:"Copia da\u2026",copy_from_hint:"Copia il programma salvato di:",discard:"Scarta",confirm:"Conferma",cancel:"Annulla",today:"Oggi",today_day:"Oggi, {day}",prev_slot:"Quarto d'ora precedente",next_slot:"Quarto d'ora successivo",temp_down:"Abbassa la temperatura",temp_up:"Alza la temperatura",return_date:"Giorno di rientro",return_time:"Ora di rientro",error_load:"Impossibile caricare i dati.",error_save:"Salvataggio non riuscito.",house_scenario:"Scenario della casa",return_required:"Indica giorno e ora del rientro",house_work:"La casa segue il programma Lavoro.",house_holiday:"La casa segue il programma Ferie.",house_away:"Impianto spento fino a {when}, poi passa da solo a Lavoro.",house_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",house_off:"Impianto spento finch\xE9 non scegli un altro scenario.",status_schedule:"Programma: {temp} {until}, poi {next}.",status_schedule_flat:"Programma: {temp}.",status_forced:"Forzato a {temp} {until}, poi torna al programma ({next}).",status_forced_flat:"Forzato a {temp}.",status_zone_off:"Spento da te. Il programma riparte quando lo riaccendi.",status_away:"Fuori casa: spento fino a {when}, poi Lavoro.",status_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",status_off:"Impianto spento.",status_zone_on_manual:"Acceso a mano con impianto spento: resta a {temp} finch\xE9 non lo spegni o cambi scenario.",status_unavailable:"Termostato non disponibile.",config_entity:"Termostato",config_name:"Nome (facoltativo)"},Ce={en:es,it:ss};function $(r){var t,s,i;return((i=(s=(t=r==null?void 0:r.locale)==null?void 0:t.language)!=null?s:r==null?void 0:r.language)!=null?i:"").toLowerCase().startsWith("it")?"it":"en"}function u(r,e,t){var i,a,n;let s=(n=(a=(i=Ce[r])==null?void 0:i[e])!=null?a:Ce.en[e])!=null?n:e;return t?s.replace(/\{(\w+)\}/g,(d,o)=>o in t?String(t[o]):d):s}var ft="chronothermostat-zone-card-editor",mt="chronothermostat-viewer-card-editor",ke={name:"entity",selector:{entity:{domain:"climate"}}},Kt={name:"name",selector:{text:{}}},F=class extends b{constructor(){super(...arguments);this._label=t=>u($(this.hass),t.name==="entity"?"config_entity":"config_name")}get schema(){return[ke,Kt]}setConfig(t){this._config=t}render(){return!this.hass||!this._config?_:g`<ha-form .hass=${this.hass} .data=${this._config} .schema=${this.schema}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`}_changed(t){t.stopPropagation();let s={...t.detail.value};s.name||delete s.name,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}};F.properties={hass:{attribute:!1},_config:{state:!0}};var Ut=class extends F{},Wt=class extends F{get schema(){return[ke]}};customElements.get(ft)||customElements.define(ft,Ut);customElements.get(mt)||customElements.define(mt,Wt);var Bt="chronothermostat-editor-card",rs=["work","holiday"],is=["prev","next","cont","minus","plus"],De=.5,ns=3e3,as=3e4,Re=150,Pe=8,gt=26,He=22,os=452,Le=r=>r.charAt(0).toUpperCase()+r.slice(1),ds=r=>r.getHours()*4+Math.floor(r.getMinutes()/15),T=r=>Math.round(r*100)/100,Oe=r=>nt.every(e=>{var t;return Array.isArray((t=r.weekdays)==null?void 0:t[e])&&r.weekdays[e].length===96}),cs=g`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M3 12h13M11 6l6 6-6 6M21 5v14" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`,B=class extends b{constructor(){super();this._lastLoadAttempt=0;this._loadToken=0;this._holds=new Map;this._observedChart=null;this._program="work",this._day=z(new Date),this._loadFailed=!1,this._copyOpen=!1,this._saving=!1,this._loading=!1,this._chartWidth=os}static getConfigElement(){return document.createElement(ft)}static getStubConfig(t){var i;let s=Object.keys((i=t==null?void 0:t.states)!=null?i:{}).find(a=>a.startsWith("climate."));return{entity:s!=null?s:""}}setConfig(t){if(!t||typeof t.entity!="string"||t.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==t.entity&&this._reset(),this._config={...t}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this._holds.forEach(t=>t.detach()),this._holds.clear(),this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=null,this._clearSaved()}shouldUpdate(t){if(t.size===1&&t.has("hass")){let s=t.get("hass");return!s||$(s)!==$(this.hass)||this._needsLoad()}return!0}willUpdate(){this._needsLoad()&&this._load()}updated(){this.isConnected&&(this._syncHolds(),this._observeChart())}render(){if(!this._config)return _;let t=$(this.hass);if(this._loadFailed)return g`<ha-card><div class="load-error error">${u(t,"error_load")}</div></ha-card>`;let s=this._state;if(!s)return g`<ha-card></ha-card>`;let[i,a]=this._status(t,s);return g`<ha-card>
      <div class="row">
        <span class="label">${u(t,"editing")}</span>
        ${rs.map(n=>g`<button class="chip program ${n===this._program?"on":""}"
          data-program=${n} aria-pressed=${n===this._program?"true":"false"}
          @click=${()=>this._select({program:n,day:this._day})}>${u(t,n)}</button>`)}
      </div>
      <div class="row days">
        ${nt.map(n=>g`<button class="chip day ${n===this._day?"on":""}"
          data-day=${n} aria-pressed=${n===this._day?"true":"false"}
          @click=${()=>this._select({program:this._program,day:n})}>
          ${A(n,t,!0)}
        </button>`)}
      </div>
      ${this._pending&&K(s)?this._renderDirtyBar(t):_}
      <div class="reading ${this._loading?"loading":""}">
        <span><span class="day-name">${Le(A(this._day,t))}</span><span
          class="time">${Ae(s.cursor)}</span></span>
        <span class="temp">${E(s.values[s.cursor],t)}</span>
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
          ${cs}<span>${u(t,"continue")}</span>
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
        <span class="status ${a}">${i}</span>
      </div>
      ${this._copyOpen?this._renderCopyPanel(t):_}
    </ha-card>`}_renderDirtyBar(t){return g`<div class="dirty-bar">
      <span class="message">${u(t,"unsaved")}</span>
      <button class="big" id="bar-discard" @click=${this._discardPending}>${u(t,"discard")}</button>
      <button class="big save" id="bar-save" ?disabled=${this._saving}
        @click=${this._saveAndContinue}>
        ${u(t,"save")}
      </button>
    </div>`}_renderChart(t){let s=this._chartWidth,i=Re-Pe,[a,n]=ut(t.values,t.min,t.max),d=it(t.values,{width:s,height:i,min:a,max:n,padLeft:gt,padBottom:He}),o=i-He,c=d.bars[t.cursor],h=T(c.x+c.w/2),p=d.xTicks.length-1;return g`<div class="chart ${this._loading?"loading":""}">
      <svg viewBox="0 0 ${s} ${Re}" @pointerdown=${this._onChartDown}>
        <g transform="translate(0 ${Pe})">
          ${d.yTicks.map(l=>D`
            <line class="grid" x1=${gt} x2=${s}
              y1=${T(l.y)} y2=${T(l.y)}></line>
            <text class="axis" x=${gt-5} y=${T(l.y)} dy="0.35em"
              text-anchor="end">${l.label}</text>`)}
          ${d.bars.map((l,f)=>D`<rect class="bar ${f===t.cursor?"cursor":""}"
            x=${T(l.x)} y=${T(l.y)} width=${T(Math.max(0,l.w-.6))}
            height=${T(l.h)}></rect>`)}
          <line class="cursor-line" x1=${h} x2=${h} y1="0" y2=${o+4}></line>
          ${d.xTicks.map((l,f)=>D`<text class="axis" x=${T(l.x)} y=${o+18}
            text-anchor=${f===0?"start":f===p?"end":"middle"}>${l.label}</text>`)}
        </g>
      </svg>
    </div>`}_renderCopyPanel(t){return g`<div class="copy-panel">
      <div class="hint">${u(t,"copy_from_hint")}</div>
      <div class="copy-days">
        ${nt.filter(s=>s!==this._day).map(s=>g`<button class="chip" data-day=${s} @click=${()=>this._copyFrom(s)}>
            ${Le(A(s,t))}
          </button>`)}
      </div>
    </div>`}_status(t,s){return this._failure?[u(t,this._failure),"error"]:K(s)?[u(t,"unsaved"),"warning"]:this._savedDay?[u(t,"saved_day",{day:A(this._savedDay,t)}),"success"]:[u(t,"none"),""]}_zoneName(){let t=this._config;if(!t)return"";if(t.name)return t.name;let i=(this._info?this._info.zones:[]).find(a=>a.entity_id===t.entity);return i?i.name:""}_needsLoad(){return!this.hass||!this._config?!1:this._loadedFor!==this._config.entity?!0:this._loadFailed&&Date.now()-this._lastLoadAttempt>=as}_reset(){this._loadToken++,this._loadedFor=void 0,this._shown=void 0,this._data=void 0,this._state=void 0,this._loading=!1,this._loadFailed=!1,this._failure=void 0,this._pending=void 0,this._copyOpen=!1,this._clearSaved()}async _load(){let t=this.hass,s=this._config;if(!t||!s)return;let i=s.entity;this._loadedFor=i,this._lastLoadAttempt=Date.now();let a;try{if(this._info||(this._info=await ht(t)),this._loadedFor!==i)return;if(!this._info.zones.some(c=>c.entity_id===i))throw new Error(`${i} is not a chronothermostat zone`);let d=this._info.scenario_entity_id,o=d?t.states[d]:void 0;a=o&&o.state==="holiday"?"holiday":"work"}catch{this._loadedFor===i&&this._firstLoadFailed();return}let n=new Date;await this._switchTo({program:a,day:z(n)},ds(n))}_firstLoadFailed(){this._info=void 0,this._loadFailed=!0}_select(t){if(t.program===this._program&&t.day===this._day){this._pending=void 0;return}if(this._state&&K(this._state)){this._pending=t;return}this._switchTo(t)}async _switchTo(t,s){let i=this.hass,a=this._config;if(!i||!a)return;let n=++this._loadToken;this._pending=void 0,this._copyOpen=!1,this._program=t.program,this._day=t.day,this._loading=!0;try{let d=await Ot(i,a.entity,t.program);if(n!==this._loadToken)return;if(!Oe(d))throw new Error("Invalid program data");let o=s!==void 0?s:this._state?this._state.cursor:0;this._showDay(d,t,o)}catch{if(n!==this._loadToken)return;this._state&&this._shown?(this._program=this._shown.program,this._day=this._shown.day,this._failure="error_load"):this._firstLoadFailed()}finally{n===this._loadToken&&(this._loading=!1)}}_showDay(t,s,i){let a=t.weekdays[s.day];this._data=t,this._shown=s,this._loadFailed=!1,this._failure=void 0,this._state={values:a.slice(),saved:a.slice(),cursor:i,min:t.min_temp,max:t.max_temp}}_discardPending(){let t=this._pending;!t||!this._state||(this._state=zt(this._state,this._state.saved),this._switchTo(t))}_hold(t){let s=this._state;!s||this._loading||(t==="prev"?this._state=Nt(s,-1):t==="next"?this._state=Nt(s,1):t==="cont"?this._edit(Se(s)):t==="minus"?this._edit(It(s,-De)):this._edit(It(s,De)))}_edit(t){this._state=t,this._failure=void 0,this._clearSaved(),this._pending&&!K(t)&&(this._pending=void 0)}_onChartDown(t){let s=this._state,i=t.currentTarget.getBoundingClientRect();if(!s||this._loading||i.width<=0)return;let a=(t.clientX-i.left)/i.width*this._chartWidth,n=xe(a,{width:this._chartWidth,padLeft:gt});this._state=Mt(s,n)}_toggleCopy(){this._loading||(this._copyOpen=!this._copyOpen)}_copyFrom(t){this._copyOpen=!1,!(!this._state||!this._data||this._loading)&&this._edit(zt(this._state,this._data.weekdays[t]))}async _saveAndContinue(){if(!await this._save())return;let t=this._pending;t&&this._state&&!K(this._state)&&await this._switchTo(t)}async _save(){let t=this.hass,s=this._config,i=this._state,a=this._shown;if(!t||!s||!i||!a||this._saving||this._loading)return!1;let n=i.values.slice(),d=this._loadToken;this._saving=!0;try{await be(t,s.entity,a.program,a.day,n);let o=await Ot(t,s.entity,a.program);return d===this._loadToken&&this._state&&(Oe(o)&&(this._data=o),this._state={...this._state,saved:n}),this._failure=void 0,this._flashSaved(a.day),!0}catch{return this._failure="error_save",!1}finally{this._saving=!1}}_flashSaved(t){this._clearSaved(),this._savedDay=t,this._savedTimer=setTimeout(()=>{this._savedTimer=void 0,this._savedDay=void 0},ns)}_clearSaved(){this._savedTimer!==void 0&&clearTimeout(this._savedTimer),this._savedTimer=void 0,this._savedDay=void 0}_syncHolds(){for(let t of is){let s=this.renderRoot.querySelector(`#${t}`),i=this._holds.get(t);i&&i.el===s||(i&&i.detach(),this._holds.delete(t),s&&this._holds.set(t,{el:s,detach:Te(s,()=>this._hold(t))}))}}_observeChart(){let t=this.renderRoot.querySelector(".chart");t!==this._observedChart&&(this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=t,!(!t||typeof ResizeObserver=="undefined")&&(this._resizeObserver||(this._resizeObserver=new ResizeObserver(s=>{let i=Math.round(s[0].contentRect.width);i>0&&(this._chartWidth=i)})),this._resizeObserver.observe(t)))}};B.properties={hass:{attribute:!1},_config:{state:!0},_program:{state:!0},_day:{state:!0},_state:{state:!0},_loadFailed:{state:!0},_failure:{state:!0},_savedDay:{state:!0},_pending:{state:!0},_copyOpen:{state:!0},_saving:{state:!0},_loading:{state:!0},_chartWidth:{state:!0}},B.styles=P`
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
  `;var Gt="chronothermostat-scenario-card",jt="chronothermostat-scenario-card-editor",Ne=["work","holiday","away","off"],ls=3e4,Me=r=>r<10?`0${r}`:String(r),hs=r=>Ne.includes(r);function us(r){let e=new Date(r.getFullYear(),r.getMonth(),r.getDate()+1,19,0);return{date:`${e.getFullYear()}-${Me(e.getMonth()+1)}-${Me(e.getDate())}`,time:"19:00"}}function ps(r){let e=new Date(r.getTime());return e.setMinutes(Math.round(e.getMinutes()/15)*15,0,0),e}function _s(r,e){let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(r),s=/^(\d{2}):(\d{2})/.exec(e);if(!t||!s)return;let i=new Date(+t[1],+t[2]-1,+t[3],+s[1],+s[2]);return isNaN(i.getTime())?void 0:i}var j=class extends b{constructor(){super();this._infoPending=!1;this._infoTriedAt=0;this._config={},this._infoFailed=!1,this._busy=!1}static getConfigElement(){return document.createElement(jt)}static getStubConfig(){return{}}setConfig(t){this._config={...t!=null?t:{}}}getCardSize(){return 3}shouldUpdate(t){t.has("hass")&&this._ensureInfo();let s=this._current(),i=this._seen,a=!!i&&i.select===s.select&&i.returnAt===s.returnAt&&i.lang===s.lang;return this._seen=s,t.size===1&&t.has("hass")?!a:!0}_ensureInfo(){!this.hass||this._infoPending||this._info&&this._info.scenario_entity_id||this._infoTriedAt&&Date.now()-this._infoTriedAt<ls||(this._infoTriedAt=Date.now(),this._infoPending=!0,ht(this.hass).then(t=>{this._infoPending=!1,this._info=t,this._infoFailed=!(t!=null&&t.scenario_entity_id)},()=>{this._infoPending=!1,this._infoFailed=!0}))}_active(){var s;let t=(s=this._current().select)==null?void 0:s.state;return hs(t)?t:void 0}_current(){var a,n,d;let t=(n=(a=this.hass)==null?void 0:a.states)!=null?n:{},{scenario_entity_id:s,return_at_entity_id:i}=(d=this._info)!=null?d:{};return{select:s?t[s]:void 0,returnAt:i?t[i]:void 0,lang:$(this.hass)}}_tap(t){if(!this._busy){if(this._message=void 0,t==="away"||t==="off"){this._panel=this._panel===t?void 0:t;return}this._panel=void 0,t!==this._active()&&this._apply(t)}}async _apply(t,s){if(!(!this.hass||this._busy)){this._busy=!0,this._message=void 0;try{await $e(this.hass,t,s),(t==="away"||t==="off")&&(this._panel=void 0)}catch(i){let a=i instanceof Error?i.message:"";this._message=a||u($(this.hass),"error_save")}finally{this._busy=!1}}}_confirmAway(){let t=a=>{var n,d;return(d=(n=this.renderRoot.querySelector(a))==null?void 0:n.value)!=null?d:""},s=_s(t('input[type="date"]'),t('input[type="time"]')),i=s&&ps(s);if(!i||i.getTime()<=Date.now()){this._message=u($(this.hass),"return_required");return}this._apply("away",i)}render(){let t=$(this.hass),{returnAt:s}=this._current(),i=this._active(),a=this._config.name||u(t,"house_scenario"),n=this._infoFailed?"error_load":void 0;return g`<ha-card>
      <div class="label">${a}</div>
      <div class="chips">
        ${Ne.map(d=>g`<button
            class="chip ${d} ${i===d?"active":""}"
            data-scenario=${d}
            aria-pressed=${i===d?"true":"false"}
            ?disabled=${this._busy}
            @click=${()=>this._tap(d)}
          >${u(t,d)}</button>`)}
      </div>
      ${this._panel?this._renderPanel(this._panel,t):_}
      ${this._message?g`<div class="error">${this._message}</div>`:_}
      ${n?g`<div class="error">${u(t,n)}</div>`:_}
      ${!n&&i?g`<div class="sentence">${this._sentence(i,s,t)}</div>`:_}
    </ha-card>`}_renderPanel(t,s){let i=g`<div class="buttons">
      <button class="action confirm" ?disabled=${this._busy}
        @click=${()=>t==="off"?void this._apply("off"):this._confirmAway()}>${u(s,"confirm")}</button>
      <button class="action cancel" @click=${()=>{this._panel=void 0,this._message=void 0}}>${u(s,"cancel")}</button>
    </div>`;if(t==="off")return g`<div class="panel">${i}</div>`;let a=us(new Date);return g`<div class="panel">
      <div class="fields">
        <label>${u(s,"return_date")}<input type="date" .value=${a.date} /></label>
        <label>${u(s,"return_time")}<input type="time" step="900" .value=${a.time} /></label>
      </div>
      ${i}
    </div>`}_sentence(t,s,i){var a;switch(t){case"work":return u(i,"house_work");case"holiday":return u(i,"house_holiday");case"off":return u(i,"house_off");default:{let n=new Date((a=s==null?void 0:s.state)!=null?a:"");return isNaN(n.getTime())||n.getTime()<=Date.now()?u(i,"house_away_no_return"):u(i,"house_away",{when:_t(n,i)})}}}};j.properties={hass:{attribute:!1},_config:{state:!0},_info:{state:!0},_infoFailed:{state:!0},_panel:{state:!0},_message:{state:!0},_busy:{state:!0}},j.styles=P`
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
  `;var yt=class extends F{get schema(){return[Kt]}};var Vt="chronothermostat-viewer-card",fs="chronothermostat",ms=6e4,gs=5e3,vt=480,at=100,ys=5,vs=35,bs=new Set(["away","away_no_return","off","zone_on_manual"]),Ie=r=>r<10?`0${r}`:String(r),$s=r=>r.charAt(0).toUpperCase()+r.slice(1),w=r=>Math.round(r*100)/100,ze=r=>r.getHours()*4+Math.floor(r.getMinutes()/15),V=r=>typeof r=="number"&&Number.isFinite(r),Fe=r=>!!r&&r.state!=="unavailable"&&r.state!=="unknown",Ue=r=>new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime(),q=class extends b{constructor(){super();this._display={lang:"en"};this._now=new Date}static getConfigElement(){return document.createElement(mt)}static getStubConfig(t){var i;let s=Object.keys((i=t==null?void 0:t.states)!=null?i:{}).find(a=>a.startsWith("climate."));return{entity:s!=null?s:""}}setConfig(t){if(!t||typeof t.entity!="string"||t.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==t.entity&&(this._sensorId=void 0),this._config={...t}}getCardSize(){return 4}connectedCallback(){super.connectedCallback(),this._now=new Date,this._scheduleClock()}disconnectedCallback(){super.disconnectedCallback(),this._timer!==void 0&&clearTimeout(this._timer),this._timer=void 0,this._graceTimer!==void 0&&clearTimeout(this._graceTimer),this._graceTimer=void 0,this._held=void 0}_scheduleClock(){let t=new Date,s=ms-(t.getSeconds()*1e3+t.getMilliseconds());this._timer=setTimeout(()=>{this._now=new Date,this._scheduleClock()},s)}shouldUpdate(t){let s=this._current(),i=this._seen,a=!!i&&i.sensor===s.sensor&&i.climate===s.climate&&i.lang===s.lang;return this._seen=s,t.size===1&&t.has("hass")?!a:!0}willUpdate(t){t.has("hass")&&(this._now=new Date),this._display=this._shown()}_resolveSensor(){var o,c,h,p,l;let t=(c=(o=this.hass)==null?void 0:o.states)!=null?c:{},s=(h=this._config)==null?void 0:h.entity,i=this._sensorId?t[this._sensorId]:void 0;if(i&&((p=i.attributes)==null?void 0:p.zone)===s)return i;let a=Object.keys(t).filter(f=>{var m,x;return f.startsWith("sensor.")&&((x=(m=t[f])==null?void 0:m.attributes)==null?void 0:x.zone)===s}),n=(l=this.hass)==null?void 0:l.entities,d=n&&a.find(f=>{var m;return((m=n[f])==null?void 0:m.platform)===fs})||a[0];return this._sensorId=d,d?t[d]:void 0}_current(){var t,s;return{sensor:this._resolveSensor(),climate:this._config?(s=(t=this.hass)==null?void 0:t.states)==null?void 0:s[this._config.entity]:void 0,lang:$(this.hass)}}_shown(){let t=this._current();return Fe(t.sensor)?(this._held={sensor:t.sensor,climate:t.climate},this._graceTimer!==void 0&&clearTimeout(this._graceTimer),this._graceTimer=void 0,t):this._held?(this._graceTimer===void 0&&(this._graceTimer=setTimeout(()=>{this._graceTimer=void 0,this._held=void 0,this.requestUpdate()},gs)),{...this._held,lang:t.lang}):t}render(){var R;let{sensor:t,climate:s,lang:i}=this._display,a=Fe(t)?t.state:"unavailable",n=(R=t==null?void 0:t.attributes)!=null?R:{},d=Array.isArray(n.today)?n.today:[],o=!!t&&!bs.has(a)&&a!=="unavailable"&&d.length===96&&d.every(V),c=this._now,h=A(z(c),i),p=n.program==="work"||n.program==="holiday"?n.program:void 0,l=p?`${u(i,"today_day",{day:h})} \xB7 ${u(i,p)}`:$s(h),f=`${Ie(c.getHours())}:${Ie(c.getMinutes())}`,[m,x]=this._sentence(a,n,s,i);return g`<ha-card>
      <div class="header">
        <span class="title">${l}</span><span class="clock">${f}</span>
      </div>
      ${o?this._chart(a,d,n,s):_}
      <div class="sentence" style=${x}>${m}</div>
    </ha-card>`}_sentence(t,s,i,a){var f;let n=(f=i==null?void 0:i.attributes)==null?void 0:f.temperature,d=this._now,o=typeof s.next_step_at=="string"?new Date(s.next_step_at):void 0,c=!!o&&!isNaN(o.getTime())&&V(s.next_step_target),h=c?Ee(o,d,a):"",p=c?E(s.next_step_target,a):"",l=(m,x)=>[u(a,m,x),""];switch(t){case"schedule":return V(s.program_target)?c?l("status_schedule",{temp:E(s.program_target,a),until:h,next:p}):l("status_schedule_flat",{temp:E(s.program_target,a)}):l("status_unavailable");case"forced":return V(n)?c?l("status_forced",{temp:E(n,a),until:h,next:p}):l("status_forced_flat",{temp:E(n,a)}):l("status_unavailable");case"zone_off":return[u(a,"status_zone_off"),"color: var(--error-color)"];case"zone_on_manual":return V(n)?l("status_zone_on_manual",{temp:E(n,a)}):l("status_unavailable");case"away":{let m=typeof s.return_at=="string"?new Date(s.return_at):void 0;return!m||isNaN(m.getTime())?l("status_away_no_return"):l("status_away",{when:_t(m,a)})}case"away_no_return":return l("status_away_no_return");case"off":return l("status_off");default:return l("status_unavailable")}}_chart(t,s,i,a){var y;let n=this._now,d=ze(n),o=(y=a==null?void 0:a.attributes)==null?void 0:y.temperature,c=t==="forced"&&V(o),[h,p]=ut(c?[...s,o]:s,ys,vs),l={width:vt,height:at,min:h,max:p,padLeft:0,padBottom:0},f=it(s,l),m=vt/96,x=_;if(c){let v=typeof i.next_step_at=="string"?new Date(i.next_step_at):void 0,We=v&&!isNaN(v.getTime())&&Ue(v)<=Ue(n)?Math.min(96,Math.max(d,ze(v))):96,Zt=it([o],l).bars[0].y;x=D`<rect class="band" shape-rendering="crispEdges" x=${w(d*m)} y=${w(Zt)}
        width=${w((We-d)*m)} height=${w(at-Zt)}></rect>`}let R=(n.getHours()*60+n.getMinutes())/1440*vt;return g`<div class="chart">
      <svg viewBox="0 0 ${vt} ${at}" preserveAspectRatio="none" aria-hidden="true">
        ${[6,12,18].map(v=>D`<line class="grid" x1=${v*20} x2=${v*20}
          y1="0" y2=${at}></line>`)}
        ${f.bars.map((v,Z)=>D`<rect class="bar ${Z<d?"past":""}" shape-rendering="crispEdges"
          x=${w(v.x)} y=${w(v.y)} width=${w(v.w)}
          height=${w(v.h)}></rect>`)}
        ${x}
        <line class="now" x1=${w(R)} x2=${w(R)} y1="0" y2=${at}></line>
      </svg>
    </div>`}};q.properties={hass:{attribute:!1},_config:{state:!0},_now:{state:!0}},q.styles=P`
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
  `;function bt(r,e){customElements.get(r)||customElements.define(r,e)}function qt(r){window.customCards=window.customCards||[],window.customCards.some(e=>e.type===r.type)||window.customCards.push(r)}bt(Bt,B);qt({type:Bt,name:"Chronothermostat editor",preview:!1});bt(Vt,q);qt({type:Vt,name:"Chronothermostat viewer",preview:!1});bt(Gt,j);bt(jt,yt);qt({type:Gt,name:"Chronothermostat scenario",preview:!1});
