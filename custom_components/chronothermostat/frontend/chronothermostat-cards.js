/*! chronothermostat-cards v0.1.0 */
var B=globalThis,j=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X=Symbol(),xt=new WeakMap,D=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==X)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(j&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=xt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&xt.set(t,e))}return e}toString(){return this.cssText}},wt=r=>new D(typeof r=="string"?r:r+"",void 0,X),J=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new D(t,r,X)},St=(r,e)=>{if(j)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=B.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},Q=j?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return wt(t)})(r):r;var{is:ue,defineProperty:pe,getOwnPropertyDescriptor:_e,getOwnPropertyNames:me,getOwnPropertySymbols:fe,getPrototypeOf:ge}=Object,x=globalThis,At=x.trustedTypes,ye=At?At.emptyScript:"",tt=x.reactiveElementPolyfillSupport,R=(r,e)=>r,et={toAttribute(r,e){switch(e){case Boolean:r=r?ye:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},Pt=(r,e)=>!ue(r,e),Et={attribute:!0,type:String,converter:et,reflect:!1,useDefault:!1,hasChanged:Pt},Ct,Tt;(Ct=Symbol.metadata)!=null||(Symbol.metadata=Symbol("metadata")),(Tt=x.litPropertyMetadata)!=null||(x.litPropertyMetadata=new WeakMap);var v=class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),((t=this.l)!=null?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Et){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&pe(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){var o;let{get:i,set:n}=(o=_e(this.prototype,e))!=null?o:{get(){return this[t]},set(d){this[t]=d}};return{get:i,set(d){let a=i==null?void 0:i.call(this);n==null||n.call(this,d),this.requestUpdate(e,a,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){var t;return(t=this.elementProperties.get(e))!=null?t:Et}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let e=ge(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let t=this.properties,s=[...me(t),...fe(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(Q(i))}else e!==void 0&&t.push(Q(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t,s;((t=this._$EO)!=null?t:this._$EO=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&((s=e.hostConnected)==null||s.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){var t;let e=(t=this.shadowRoot)!=null?t:this.attachShadow(this.constructor.shadowRootOptions);return St(e,this.constructor.elementStyles),e}connectedCallback(){var e,t;(e=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostConnected)==null?void 0:i.call(s)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var n;let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:et).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){var n,o,d;let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let a=s.getPropertyOptions(i),l=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)==null?void 0:n.fromAttribute)!==void 0?a.converter:et;this._$Em=i;let c=l.fromAttribute(t,a.type);this[i]=(d=c!=null?c:(o=this._$Ej)==null?void 0:o.get(i))!=null?d:c,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){var o,d;if(e!==void 0){let a=this.constructor;if(i===!1&&(n=this[e]),s!=null||(s=a.getPropertyOptions(e)),!(((o=s.hasChanged)!=null?o:Pt)(n,t)||s.useDefault&&s.reflect&&n===((d=this._$Ej)==null?void 0:d.get(e))&&!this.hasAttribute(a._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},o){var d,a,l;s&&!((d=this._$Ej)!=null?d:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,(a=o!=null?o:t)!=null?a:this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&((l=this._$Eq)!=null?l:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s,i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if((s=this.renderRoot)!=null||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[o,d]of this._$Ep)this[o]=d;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[o,d]of n){let{wrapped:a}=d,l=this[o];a!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,d,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(i=this._$EO)==null||i.forEach(n=>{var o;return(o=n.hostUpdate)==null?void 0:o.call(n)}),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}},kt;v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[R("elementProperties")]=new Map,v[R("finalized")]=new Map,tt==null||tt({ReactiveElement:v}),((kt=x.reactiveElementVersions)!=null?kt:x.reactiveElementVersions=[]).push("2.1.2");var N=globalThis,Ot=r=>r,q=N.trustedTypes,Lt=q?q.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ut="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Wt="?"+w,ve=`<${Wt}>`,E=document,z=()=>E.createComment(""),U=r=>r===null||typeof r!="object"&&typeof r!="function",lt=Array.isArray,$e=r=>lt(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",st=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Mt=/-->/g,Dt=/>/g,S=RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Rt=/'/g,Ht=/"/g,Ft=/^(?:script|style|textarea|title)$/i,ct=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),f=ct(1),G=ct(2),We=ct(3),C=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Nt=new WeakMap,A=E.createTreeWalker(E,129);function It(r,e){if(!lt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Lt!==void 0?Lt.createHTML(e):e}var be=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",o=H;for(let d=0;d<t;d++){let a=r[d],l,c,h=-1,u=0;for(;u<a.length&&(o.lastIndex=u,c=o.exec(a),c!==null);)u=o.lastIndex,o===H?c[1]==="!--"?o=Mt:c[1]!==void 0?o=Dt:c[2]!==void 0?(Ft.test(c[2])&&(i=RegExp("</"+c[2],"g")),o=S):c[3]!==void 0&&(o=S):o===S?c[0]===">"?(o=i!=null?i:H,h=-1):c[1]===void 0?h=-2:(h=o.lastIndex-c[2].length,l=c[1],o=c[3]===void 0?S:c[3]==='"'?Ht:Rt):o===Ht||o===Rt?o=S:o===Mt||o===Dt?o=H:(o=S,i=void 0);let m=o===S&&r[d+1].startsWith("/>")?" ":"";n+=o===H?a+ve:h>=0?(s.push(l),a.slice(0,h)+Ut+a.slice(h)+w+m):a+w+(h===-2?d:m)}return[It(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},W=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,o=0,d=e.length-1,a=this.parts,[l,c]=be(e,t);if(this.el=r.createElement(l,s),A.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=A.nextNode())!==null&&a.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(Ut)){let u=c[o++],m=i.getAttribute(h).split(w),b=/([.?@])?(.*)/.exec(u);a.push({type:1,index:n,name:b[2],strings:m,ctor:b[1]==="."?ot:b[1]==="?"?nt:b[1]==="@"?at:P}),i.removeAttribute(h)}else h.startsWith(w)&&(a.push({type:6,index:n}),i.removeAttribute(h));if(Ft.test(i.tagName)){let h=i.textContent.split(w),u=h.length-1;if(u>0){i.textContent=q?q.emptyScript:"";for(let m=0;m<u;m++)i.append(h[m],z()),A.nextNode(),a.push({type:2,index:++n});i.append(h[u],z())}}}else if(i.nodeType===8)if(i.data===Wt)a.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(w,h+1))!==-1;)a.push({type:7,index:n}),h+=w.length-1}n++}}static createElement(e,t){let s=E.createElement("template");return s.innerHTML=e,s}};function k(r,e,t=r,s){var o,d,a;if(e===C)return e;let i=s!==void 0?(o=t._$Co)==null?void 0:o[s]:t._$Cl,n=U(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((d=i==null?void 0:i._$AO)==null||d.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?((a=t._$Co)!=null?a:t._$Co=[])[s]=i:t._$Cl=i),i!==void 0&&(e=k(r,i._$AS(r,e.values),i,s)),e}var rt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var l;let{el:{content:t},parts:s}=this._$AD,i=((l=e==null?void 0:e.creationScope)!=null?l:E).importNode(t,!0);A.currentNode=i;let n=A.nextNode(),o=0,d=0,a=s[0];for(;a!==void 0;){if(o===a.index){let c;a.type===2?c=new F(n,n.nextSibling,this,e):a.type===1?c=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(c=new dt(n,this,e)),this._$AV.push(c),a=s[++d]}o!==(a==null?void 0:a.index)&&(n=A.nextNode(),o++)}return A.currentNode=E,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},F=class r{get _$AU(){var e,t;return(t=(e=this._$AM)==null?void 0:e._$AU)!=null?t:this._$Cv}constructor(e,t,s,i){var n;this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=(n=i==null?void 0:i.isConnected)!=null?n:!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),U(e)?e===p||e==null||e===""?(this._$AH!==p&&this._$AR(),this._$AH=p):e!==this._$AH&&e!==C&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):$e(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==p&&U(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){var n;let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=W.createElement(It(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(t);else{let o=new rt(i,this),d=o.u(this.options);o.p(t),this.T(d),this._$AH=o}}_$AC(e){let t=Nt.get(e.strings);return t===void 0&&Nt.set(e.strings,t=new W(e)),t}k(e){lt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(z()),this.O(z()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e!==this._$AB;){let i=Ot(e).nextSibling;Ot(e).remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=p,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(e,t=this,s,i){let n=this.strings,o=!1;if(n===void 0)e=k(this,e,t,0),o=!U(e)||e!==this._$AH&&e!==C,o&&(this._$AH=e);else{let d=e,a,l;for(e=n[0],a=0;a<n.length-1;a++)l=k(this,d[s+a],t,a),l===C&&(l=this._$AH[a]),o||(o=!U(l)||l!==this._$AH[a]),l===p?e=p:e!==p&&(e+=(l!=null?l:"")+n[a+1]),this._$AH[a]=l}o&&!i&&this.j(e)}j(e){e===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e!=null?e:"")}},ot=class extends P{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===p?void 0:e}},nt=class extends P{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==p)}},at=class extends P{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){var o;if((e=(o=k(this,e,t,0))!=null?o:p)===C)return;let s=this._$AH,i=e===p&&s!==p||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,s;typeof this._$AH=="function"?this._$AH.call((s=(t=this.options)==null?void 0:t.host)!=null?s:this.element,e):this._$AH.handleEvent(e)}},dt=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}};var it=N.litHtmlPolyfillSupport,zt;it==null||it(W,F),((zt=N.litHtmlVersions)!=null?zt:N.litHtmlVersions=[]).push("3.3.3");var Kt=(r,e,t)=>{var n,o;let s=(n=t==null?void 0:t.renderBefore)!=null?n:e,i=s._$litPart$;if(i===void 0){let d=(o=t==null?void 0:t.renderBefore)!=null?o:null;s._$litPart$=i=new F(e.insertBefore(z(),d),d,void 0,t!=null?t:{})}return i._$AI(r),i};var T=globalThis,y=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,s;let e=super.createRenderRoot();return(s=(t=this.renderOptions).renderBefore)!=null||(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Kt(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return C}},Bt;y._$litElement$=!0,y.finalized=!0,(Bt=T.litElementHydrateSupport)==null||Bt.call(T,{LitElement:y});var ht=T.litElementPolyfillSupport;ht==null||ht({LitElement:y});var jt;((jt=T.litElementVersions)!=null?jt:T.litElementVersions=[]).push("4.2.2");var ut="chronothermostat";function qt(r){return r.callWS({type:`${ut}/info`})}function pt(r,e,t){return r.callWS({type:`${ut}/get_program`,zone:e,program:t})}function Gt(r,e,t,s,i){return r.callService(ut,"set_program",{zone:e,program:t,weekday:s,values:i})}function Vt(r,e,t){if(r.length===0)return[e,t];let s=Math.max(e,Math.floor(Math.min(...r))-1),i=Math.min(t,Math.ceil(Math.max(...r))+1);return i-s<5&&(i=Math.min(t,s+5),s=Math.max(e,i-5)),[s,i]}function Zt(r,e){let{width:t,height:s,min:i,max:n,padLeft:o,padBottom:d}=e,a=t-o,l=s-d,c=n-i||1,h=g=>l*(1-(Math.min(n,Math.max(i,g))-i)/c),u=a/96,m=r.map((g,he)=>{let bt=h(g);return{x:o+he*u,y:bt,w:u,h:l-bt}}),b=c<=6?1:c<=12?2:5,$t=[];for(let g=Math.ceil(i/b)*b;g<=n;g+=b)$t.push({y:h(g),label:String(g)});let ce=[0,6,12,18,24].map(g=>({x:o+a*g/24,label:String(g)}));return{bars:m,yTicks:$t,xTicks:ce}}function Yt(r,e){let t=Math.floor((r-e.padLeft)/(e.width-e.padLeft)*96);return Math.min(95,Math.max(0,t))}var Xt=(r,e,t)=>Math.min(t,Math.max(e,r));function _t(r,e){return{...r,cursor:Xt(Math.round(e),0,95)}}function mt(r,e){return _t(r,r.cursor+e)}function ft(r,e){let t=Xt(Math.round((r.values[r.cursor]+e)/.5)*.5,r.min,r.max),s=r.values.slice();return s[r.cursor]=t,{...r,values:s}}function Jt(r){if(r.cursor>=95)return r;let e=r.values.slice();return e[r.cursor+1]=e[r.cursor],{...r,values:e,cursor:r.cursor+1}}function gt(r,e){return{...r,values:e.slice()}}function O(r){return r.values.length!==r.saved.length||r.values.some((e,t)=>e!==r.saved[t])}var I=["mon","tue","wed","thu","fri","sat","sun"],xe={it:{mon:["luned\xEC","Lun"],tue:["marted\xEC","Mar"],wed:["mercoled\xEC","Mer"],thu:["gioved\xEC","Gio"],fri:["venerd\xEC","Ven"],sat:["sabato","Sab"],sun:["domenica","Dom"]},en:{mon:["Monday","Mon"],tue:["Tuesday","Tue"],wed:["Wednesday","Wed"],thu:["Thursday","Thu"],fri:["Friday","Fri"],sat:["Saturday","Sat"],sun:["Sunday","Sun"]}};function K(r,e,t=!1){return xe[e][r][t?1:0]}function yt(r){return I[(r.getDay()+6)%7]}var Qt=r=>r<10?`0${r}`:String(r);function te(r,e){let t=r.toFixed(1);return`${e==="it"?t.replace(".",","):t} \xB0C`}function ee(r){return`${Qt(Math.floor(r/4))}:${Qt(r%4*15)}`}function se(r,e,t={delay:450,interval:110}){let s,i=()=>{s!==void 0&&clearTimeout(s),s=void 0},n=()=>{e(),s=setTimeout(n,t.interval)},o=a=>{a.preventDefault(),i(),e(),s=setTimeout(n,t.delay)},d=a=>a.preventDefault();return r.addEventListener("pointerdown",o),r.addEventListener("pointerup",i),r.addEventListener("pointerleave",i),r.addEventListener("pointercancel",i),r.addEventListener("contextmenu",d),()=>{i(),r.removeEventListener("pointerdown",o),r.removeEventListener("pointerup",i),r.removeEventListener("pointerleave",i),r.removeEventListener("pointercancel",i),r.removeEventListener("contextmenu",d)}}var we={none:"No changes",unsaved:"Unsaved changes",saved_day:"{day} program saved",editing:"Editing:",work:"Work",holiday:"Holiday",away:"Away",off:"Off",continue:"Continue",save:"Save",copy_from:"Copy from\u2026",copy_from_hint:"Copy the saved program of:",discard:"Discard",confirm:"Confirm",cancel:"Cancel",today:"Today",today_day:"Today, {day}",prev_slot:"Previous quarter hour",next_slot:"Next quarter hour",temp_down:"Lower temperature",temp_up:"Raise temperature",return_date:"Return date",return_time:"Return time",error_load:"Could not load the data.",error_save:"Could not save.",house_scenario:"House scenario",return_required:"Set the return day and time",house_work:"The house follows the Work program.",house_holiday:"The house follows the Holiday program.",house_away:"Heating off until {when}, then it switches to Work by itself.",house_away_no_return:"Away with no return: stays off until you set a return.",house_off:"Heating off until you pick another scenario.",status_schedule:"Schedule: {temp} {until}, then {next}.",status_schedule_flat:"Schedule: {temp}.",status_forced:"Forced to {temp} {until}, then back to the schedule ({next}).",status_forced_flat:"Forced to {temp}.",status_zone_off:"Switched off by you. The schedule resumes when you turn it back on.",status_away:"Away: off until {when}, then Work.",status_away_no_return:"Away with no return: stays off until you set a return.",status_off:"Heating off.",status_zone_on_manual:"Turned on by hand with the heating off: stays at {temp} until you turn it off or change scenario.",status_unavailable:"Thermostat unavailable.",config_entity:"Thermostat",config_name:"Name (optional)"},Se={none:"Nessuna modifica",unsaved:"Modifiche non salvate",saved_day:"Programma di {day} salvato",editing:"Stai modificando:",work:"Lavoro",holiday:"Ferie",away:"Fuori casa",off:"Spento",continue:"Prosegui",save:"Salva",copy_from:"Copia da\u2026",copy_from_hint:"Copia il programma salvato di:",discard:"Scarta",confirm:"Conferma",cancel:"Annulla",today:"Oggi",today_day:"Oggi, {day}",prev_slot:"Quarto d'ora precedente",next_slot:"Quarto d'ora successivo",temp_down:"Abbassa la temperatura",temp_up:"Alza la temperatura",return_date:"Giorno di rientro",return_time:"Ora di rientro",error_load:"Impossibile caricare i dati.",error_save:"Salvataggio non riuscito.",house_scenario:"Scenario della casa",return_required:"Indica giorno e ora del rientro",house_work:"La casa segue il programma Lavoro.",house_holiday:"La casa segue il programma Ferie.",house_away:"Impianto spento fino a {when}, poi passa da solo a Lavoro.",house_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",house_off:"Impianto spento finch\xE9 non scegli un altro scenario.",status_schedule:"Programma: {temp} {until}, poi {next}.",status_schedule_flat:"Programma: {temp}.",status_forced:"Forzato a {temp} {until}, poi torna al programma ({next}).",status_forced_flat:"Forzato a {temp}.",status_zone_off:"Spento da te. Il programma riparte quando lo riaccendi.",status_away:"Fuori casa: spento fino a {when}, poi Lavoro.",status_away_no_return:"Fuori casa senza rientro: resta spento finch\xE9 non imposti il rientro.",status_off:"Impianto spento.",status_zone_on_manual:"Acceso a mano con impianto spento: resta a {temp} finch\xE9 non lo spegni o cambi scenario.",status_unavailable:"Termostato non disponibile.",config_entity:"Termostato",config_name:"Nome (facoltativo)"},ie={en:we,it:Se};function L(r){var t,s,i;return((i=(s=(t=r==null?void 0:r.locale)==null?void 0:t.language)!=null?s:r==null?void 0:r.language)!=null?i:"").toLowerCase().startsWith("it")?"it":"en"}function _(r,e,t){var i,n,o;let s=(o=(n=(i=ie[r])==null?void 0:i[e])!=null?n:ie.en[e])!=null?o:e;return t?s.replace(/\{(\w+)\}/g,(d,a)=>a in t?String(t[a]):d):s}var Z="chronothermostat-zone-card-editor",Ae=[{name:"entity",selector:{entity:{domain:"climate"}}},{name:"name",selector:{text:{}}}],V=class extends y{constructor(){super(...arguments);this._label=t=>_(L(this.hass),t.name==="entity"?"config_entity":"config_name")}setConfig(t){this._config=t}render(){return!this.hass||!this._config?p:f`<ha-form .hass=${this.hass} .data=${this._config} .schema=${Ae}
      .computeLabel=${this._label} @value-changed=${this._changed}></ha-form>`}_changed(t){t.stopPropagation();let s={...t.detail.value};s.name||delete s.name,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0}))}};V.properties={hass:{attribute:!1},_config:{state:!0}};customElements.get(Z)||customElements.define(Z,V);var vt="chronothermostat-editor-card",Ce=["work","holiday"],Te=["prev","next","cont","minus","plus"],re=.5,ke=3e3,Pe=3e4,oe=150,ne=8,Y=26,ae=22,Oe=452,de=r=>r.charAt(0).toUpperCase()+r.slice(1),Le=r=>r.getHours()*4+Math.floor(r.getMinutes()/15),$=r=>Math.round(r*100)/100,le=r=>I.every(e=>{var t;return Array.isArray((t=r.weekdays)==null?void 0:t[e])&&r.weekdays[e].length===96}),Me=f`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M3 12h13M11 6l6 6-6 6M21 5v14" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`,M=class extends y{constructor(){super();this._lastLoadAttempt=0;this._loadToken=0;this._holds=new Map;this._observedChart=null;this._program="work",this._day=yt(new Date),this._loadFailed=!1,this._copyOpen=!1,this._saving=!1,this._loading=!1,this._chartWidth=Oe}static getConfigElement(){return document.createElement(Z)}static getStubConfig(t){var i;let s=Object.keys((i=t==null?void 0:t.states)!=null?i:{}).find(n=>n.startsWith("climate."));return{entity:s!=null?s:""}}setConfig(t){if(!t||typeof t.entity!="string"||t.entity==="")throw new Error("entity is required");this._config&&this._config.entity!==t.entity&&this._reset(),this._config={...t}}getCardSize(){return 8}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.requestUpdate()}disconnectedCallback(){super.disconnectedCallback(),this._holds.forEach(t=>t.detach()),this._holds.clear(),this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=null,this._clearSaved()}shouldUpdate(t){if(t.size===1&&t.has("hass")){let s=t.get("hass");return!s||L(s)!==L(this.hass)||this._needsLoad()}return!0}willUpdate(){this._needsLoad()&&this._load()}updated(){this.isConnected&&(this._syncHolds(),this._observeChart())}render(){if(!this._config)return p;let t=L(this.hass);if(this._loadFailed)return f`<ha-card><div class="load-error error">${_(t,"error_load")}</div></ha-card>`;let s=this._state;if(!s)return f`<ha-card></ha-card>`;let[i,n]=this._status(t,s);return f`<ha-card>
      <div class="row">
        <span class="label">${_(t,"editing")}</span>
        ${Ce.map(o=>f`<button class="chip program ${o===this._program?"on":""}"
          data-program=${o} aria-pressed=${o===this._program?"true":"false"}
          @click=${()=>this._select({program:o,day:this._day})}>${_(t,o)}</button>`)}
      </div>
      <div class="row days">
        ${I.map(o=>f`<button class="chip day ${o===this._day?"on":""}"
          data-day=${o} aria-pressed=${o===this._day?"true":"false"}
          @click=${()=>this._select({program:this._program,day:o})}>
          ${K(o,t,!0)}
        </button>`)}
      </div>
      ${this._pending&&O(s)?this._renderDirtyBar(t):p}
      <div class="reading ${this._loading?"loading":""}">
        <span><span class="day-name">${de(K(this._day,t))}</span><span
          class="time">${ee(s.cursor)}</span></span>
        <span class="temp">${te(s.values[s.cursor],t)}</span>
      </div>
      ${this._renderChart(s)}
      <div class="controls">
        <button class="big hold" id="prev" ?disabled=${this._loading} aria-label=${_(t,"prev_slot")}>
          <span class="glyph" aria-hidden="true">‹</span>
        </button>
        <button class="big hold" id="next" ?disabled=${this._loading} aria-label=${_(t,"next_slot")}>
          <span class="glyph" aria-hidden="true">›</span>
        </button>
        <button class="big hold wide" id="cont" ?disabled=${this._loading}>
          ${Me}<span>${_(t,"continue")}</span>
        </button>
        <button class="big hold" id="minus" ?disabled=${this._loading} aria-label=${_(t,"temp_down")}>
          <span class="glyph" aria-hidden="true">−</span>
        </button>
        <button class="big hold" id="plus" ?disabled=${this._loading} aria-label=${_(t,"temp_up")}>
          <span class="glyph" aria-hidden="true">+</span>
        </button>
        <button class="big" id="copy" ?disabled=${this._loading}
          aria-expanded=${this._copyOpen?"true":"false"}
          @click=${this._toggleCopy}>${_(t,"copy_from")}</button>
        <button class="big save" id="save" ?disabled=${this._saving||this._loading}
          @click=${this._saveAndContinue}>
          ${_(t,"save")}
        </button>
      </div>
      <div class="footer">
        <span class="name">${this._zoneName()}</span>
        <span class="status ${n}">${i}</span>
      </div>
      ${this._copyOpen?this._renderCopyPanel(t):p}
    </ha-card>`}_renderDirtyBar(t){return f`<div class="dirty-bar">
      <span class="message">${_(t,"unsaved")}</span>
      <button class="big" id="bar-discard" @click=${this._discardPending}>${_(t,"discard")}</button>
      <button class="big save" id="bar-save" ?disabled=${this._saving}
        @click=${this._saveAndContinue}>
        ${_(t,"save")}
      </button>
    </div>`}_renderChart(t){let s=this._chartWidth,i=oe-ne,[n,o]=Vt(t.values,t.min,t.max),d=Zt(t.values,{width:s,height:i,min:n,max:o,padLeft:Y,padBottom:ae}),a=i-ae,l=d.bars[t.cursor],c=$(l.x+l.w/2),h=d.xTicks.length-1;return f`<div class="chart ${this._loading?"loading":""}">
      <svg viewBox="0 0 ${s} ${oe}" @pointerdown=${this._onChartDown}>
        <g transform="translate(0 ${ne})">
          ${d.yTicks.map(u=>G`
            <line class="grid" x1=${Y} x2=${s}
              y1=${$(u.y)} y2=${$(u.y)}></line>
            <text class="axis" x=${Y-5} y=${$(u.y)} dy="0.35em"
              text-anchor="end">${u.label}</text>`)}
          ${d.bars.map((u,m)=>G`<rect class="bar ${m===t.cursor?"cursor":""}"
            x=${$(u.x)} y=${$(u.y)} width=${$(Math.max(0,u.w-.6))}
            height=${$(u.h)}></rect>`)}
          <line class="cursor-line" x1=${c} x2=${c} y1="0" y2=${a+4}></line>
          ${d.xTicks.map((u,m)=>G`<text class="axis" x=${$(u.x)} y=${a+18}
            text-anchor=${m===0?"start":m===h?"end":"middle"}>${u.label}</text>`)}
        </g>
      </svg>
    </div>`}_renderCopyPanel(t){return f`<div class="copy-panel">
      <div class="hint">${_(t,"copy_from_hint")}</div>
      <div class="copy-days">
        ${I.filter(s=>s!==this._day).map(s=>f`<button class="chip" data-day=${s} @click=${()=>this._copyFrom(s)}>
            ${de(K(s,t))}
          </button>`)}
      </div>
    </div>`}_status(t,s){return this._failure?[_(t,this._failure),"error"]:O(s)?[_(t,"unsaved"),"warning"]:this._savedDay?[_(t,"saved_day",{day:K(this._savedDay,t)}),"success"]:[_(t,"none"),""]}_zoneName(){let t=this._config;if(!t)return"";if(t.name)return t.name;let i=(this._info?this._info.zones:[]).find(n=>n.entity_id===t.entity);return i?i.name:""}_needsLoad(){return!this.hass||!this._config?!1:this._loadedFor!==this._config.entity?!0:this._loadFailed&&Date.now()-this._lastLoadAttempt>=Pe}_reset(){this._loadToken++,this._loadedFor=void 0,this._shown=void 0,this._data=void 0,this._state=void 0,this._loading=!1,this._loadFailed=!1,this._failure=void 0,this._pending=void 0,this._copyOpen=!1,this._clearSaved()}async _load(){let t=this.hass,s=this._config;if(!t||!s)return;let i=s.entity;this._loadedFor=i,this._lastLoadAttempt=Date.now();let n;try{if(this._info||(this._info=await qt(t)),this._loadedFor!==i)return;if(!this._info.zones.some(l=>l.entity_id===i))throw new Error(`${i} is not a chronothermostat zone`);let d=this._info.scenario_entity_id,a=d?t.states[d]:void 0;n=a&&a.state==="holiday"?"holiday":"work"}catch{this._loadedFor===i&&this._firstLoadFailed();return}let o=new Date;await this._switchTo({program:n,day:yt(o)},Le(o))}_firstLoadFailed(){this._info=void 0,this._loadFailed=!0}_select(t){if(t.program===this._program&&t.day===this._day){this._pending=void 0;return}if(this._state&&O(this._state)){this._pending=t;return}this._switchTo(t)}async _switchTo(t,s){let i=this.hass,n=this._config;if(!i||!n)return;let o=++this._loadToken;this._pending=void 0,this._copyOpen=!1,this._program=t.program,this._day=t.day,this._loading=!0;try{let d=await pt(i,n.entity,t.program);if(o!==this._loadToken)return;if(!le(d))throw new Error("Invalid program data");let a=s!==void 0?s:this._state?this._state.cursor:0;this._showDay(d,t,a)}catch{if(o!==this._loadToken)return;this._state&&this._shown?(this._program=this._shown.program,this._day=this._shown.day,this._failure="error_load"):this._firstLoadFailed()}finally{o===this._loadToken&&(this._loading=!1)}}_showDay(t,s,i){let n=t.weekdays[s.day];this._data=t,this._shown=s,this._loadFailed=!1,this._failure=void 0,this._state={values:n.slice(),saved:n.slice(),cursor:i,min:t.min_temp,max:t.max_temp}}_discardPending(){let t=this._pending;!t||!this._state||(this._state=gt(this._state,this._state.saved),this._switchTo(t))}_hold(t){let s=this._state;!s||this._loading||(t==="prev"?this._state=mt(s,-1):t==="next"?this._state=mt(s,1):t==="cont"?this._edit(Jt(s)):t==="minus"?this._edit(ft(s,-re)):this._edit(ft(s,re)))}_edit(t){this._state=t,this._failure=void 0,this._clearSaved(),this._pending&&!O(t)&&(this._pending=void 0)}_onChartDown(t){let s=this._state,i=t.currentTarget.getBoundingClientRect();if(!s||this._loading||i.width<=0)return;let n=(t.clientX-i.left)/i.width*this._chartWidth,o=Yt(n,{width:this._chartWidth,padLeft:Y});this._state=_t(s,o)}_toggleCopy(){this._loading||(this._copyOpen=!this._copyOpen)}_copyFrom(t){this._copyOpen=!1,!(!this._state||!this._data||this._loading)&&this._edit(gt(this._state,this._data.weekdays[t]))}async _saveAndContinue(){if(!await this._save())return;let t=this._pending;t&&this._state&&!O(this._state)&&await this._switchTo(t)}async _save(){let t=this.hass,s=this._config,i=this._state,n=this._shown;if(!t||!s||!i||!n||this._saving||this._loading)return!1;let o=i.values.slice(),d=this._loadToken;this._saving=!0;try{await Gt(t,s.entity,n.program,n.day,o);let a=await pt(t,s.entity,n.program);return d===this._loadToken&&this._state&&(le(a)&&(this._data=a),this._state={...this._state,saved:o}),this._failure=void 0,this._flashSaved(n.day),!0}catch{return this._failure="error_save",!1}finally{this._saving=!1}}_flashSaved(t){this._clearSaved(),this._savedDay=t,this._savedTimer=setTimeout(()=>{this._savedTimer=void 0,this._savedDay=void 0},ke)}_clearSaved(){this._savedTimer!==void 0&&clearTimeout(this._savedTimer),this._savedTimer=void 0,this._savedDay=void 0}_syncHolds(){for(let t of Te){let s=this.renderRoot.querySelector(`#${t}`),i=this._holds.get(t);i&&i.el===s||(i&&i.detach(),this._holds.delete(t),s&&this._holds.set(t,{el:s,detach:se(s,()=>this._hold(t))}))}}_observeChart(){let t=this.renderRoot.querySelector(".chart");t!==this._observedChart&&(this._resizeObserver&&this._resizeObserver.disconnect(),this._observedChart=t,!(!t||typeof ResizeObserver=="undefined")&&(this._resizeObserver||(this._resizeObserver=new ResizeObserver(s=>{let i=Math.round(s[0].contentRect.width);i>0&&(this._chartWidth=i)})),this._resizeObserver.observe(t)))}};M.properties={hass:{attribute:!1},_config:{state:!0},_program:{state:!0},_day:{state:!0},_state:{state:!0},_loadFailed:{state:!0},_failure:{state:!0},_savedDay:{state:!0},_pending:{state:!0},_copyOpen:{state:!0},_saving:{state:!0},_loading:{state:!0},_chartWidth:{state:!0}},M.styles=J`
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
  `;function De(r,e){customElements.get(r)||customElements.define(r,e)}function Re(r){window.customCards=window.customCards||[],window.customCards.some(e=>e.type===r.type)||window.customCards.push(r)}De(vt,M);Re({type:vt,name:"Chronothermostat editor",preview:!1});
