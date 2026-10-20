(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,998183,(e,t,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0});var r={assign:function(){return l},searchParamsToUrlQuery:function(){return s},urlQueryToSearchParams:function(){return i}};for(var n in r)Object.defineProperty(o,n,{enumerable:!0,get:r[n]});function s(e){let t={};for(let[o,r]of e.entries()){let e=t[o];void 0===e?t[o]=r:Array.isArray(e)?e.push(r):t[o]=[e,r]}return t}function a(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function i(e){let t=new URLSearchParams;for(let[o,r]of Object.entries(e))if(Array.isArray(r))for(let e of r)t.append(o,a(e));else t.set(o,a(r));return t}function l(e,...t){for(let o of t){for(let t of o.keys())e.delete(t);for(let[t,r]of o.entries())e.append(t,r)}return e}},718967,(e,t,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0});var r={DecodeError:function(){return w},MiddlewareNotFoundError:function(){return v},MissingStaticPage:function(){return k},NormalizeError:function(){return b},PageNotFoundError:function(){return g},SP:function(){return m},ST:function(){return f},WEB_VITALS:function(){return s},execOnce:function(){return a},getDisplayName:function(){return u},getLocationOrigin:function(){return c},getURL:function(){return p},isAbsoluteUrl:function(){return l},isResSent:function(){return h},loadGetInitialProps:function(){return y},normalizeRepeatedSlashes:function(){return d},stringifyError:function(){return x}};for(var n in r)Object.defineProperty(o,n,{enumerable:!0,get:r[n]});let s=["CLS","FCP","FID","INP","LCP","TTFB"];function a(e){let t,o=!1;return(...r)=>(o||(o=!0,t=e(...r)),t)}let i=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>i.test(e);function c(){let{protocol:e,hostname:t,port:o}=window.location;return`${e}//${t}${o?":"+o:""}`}function p(){let{href:e}=window.location,t=c();return e.substring(t.length)}function u(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function h(e){return e.finished||e.headersSent}function d(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function y(e,t){let o=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await y(t.Component,t.ctx)}:{};let r=await e.getInitialProps(t);if(o&&h(o))return r;if(!r)throw Object.defineProperty(Error(`"${u(e)}.getInitialProps()" should resolve to an object. But found "${r}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return r}let m="u">typeof performance,f=m&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class w extends Error{}class b extends Error{}class g extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class k extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class v extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function x(e){return JSON.stringify({message:e.message,stack:e.stack})}},233525,(e,t,o)=>{"use strict";Object.defineProperty(o,"__esModule",{value:!0}),Object.defineProperty(o,"warnOnce",{enumerable:!0,get:function(){return r}});let r=e=>{}},709361,e=>{"use strict";let t=BigInt(0x100000000-1),o=BigInt(32);e.s(["add",0,function(e,t,o,r){let n=(t>>>0)+(r>>>0);return{h:e+o+(n/0x100000000|0)|0,l:0|n}},"add3H",0,(e,t,o,r)=>t+o+r+(e/0x100000000|0)|0,"add3L",0,(e,t,o)=>(e>>>0)+(t>>>0)+(o>>>0),"add4H",0,(e,t,o,r,n)=>t+o+r+n+(e/0x100000000|0)|0,"add4L",0,(e,t,o,r)=>(e>>>0)+(t>>>0)+(o>>>0)+(r>>>0),"add5H",0,(e,t,o,r,n,s)=>t+o+r+n+s+(e/0x100000000|0)|0,"add5L",0,(e,t,o,r,n)=>(e>>>0)+(t>>>0)+(o>>>0)+(r>>>0)+(n>>>0),"rotlBH",0,(e,t,o)=>t<<o-32|e>>>64-o,"rotlBL",0,(e,t,o)=>e<<o-32|t>>>64-o,"rotlSH",0,(e,t,o)=>e<<o|t>>>32-o,"rotlSL",0,(e,t,o)=>t<<o|e>>>32-o,"rotrBH",0,(e,t,o)=>e<<64-o|t>>>o-32,"rotrBL",0,(e,t,o)=>e>>>o-32|t<<64-o,"rotrSH",0,(e,t,o)=>e>>>o|t<<32-o,"rotrSL",0,(e,t,o)=>e<<32-o|t>>>o,"shrSH",0,(e,t,o)=>e>>>o,"shrSL",0,(e,t,o)=>e<<32-o|t>>>o,"split",0,function(e,r=!1){let n=e.length,s=new Uint32Array(n),a=new Uint32Array(n);for(let i=0;i<n;i++){let{h:n,l}=function(e,r=!1){return r?{h:Number(e&t),l:Number(e>>o&t)}:{h:0|Number(e>>o&t),l:0|Number(e&t)}}(e[i],r);[s[i],a[i]]=[n,l]}return[s,a]}])},470525,e=>{"use strict";let t="object"==typeof globalThis&&"crypto"in globalThis?globalThis.crypto:void 0;function o(e){if(!Number.isSafeInteger(e)||e<0)throw Error("positive integer expected, got "+e)}function r(e,...t){if(!(e instanceof Uint8Array||ArrayBuffer.isView(e)&&"Uint8Array"===e.constructor.name))throw Error("Uint8Array expected");if(t.length>0&&!t.includes(e.length))throw Error("Uint8Array expected of length "+t+", got length="+e.length)}let n=68===new Uint8Array(new Uint32Array([0x11223344]).buffer)[0]?e=>e:function(e){for(let o=0;o<e.length;o++){var t;e[o]=(t=e[o])<<24&0xff000000|t<<8&0xff0000|t>>>8&65280|t>>>24&255}return e};function s(e){return"string"==typeof e&&(e=function(e){if("string"!=typeof e)throw Error("string expected");return new Uint8Array(new TextEncoder().encode(e))}(e)),r(e),e}e.s(["Hash",0,class{},"abytes",0,r,"aexists",0,function(e,t=!0){if(e.destroyed)throw Error("Hash instance has been destroyed");if(t&&e.finished)throw Error("Hash#digest() has already been called")},"ahash",0,function(e){if("function"!=typeof e||"function"!=typeof e.create)throw Error("Hash should be wrapped by utils.createHasher");o(e.outputLen),o(e.blockLen)},"anumber",0,o,"aoutput",0,function(e,t){r(e);let o=t.outputLen;if(e.length<o)throw Error("digestInto() expects output buffer of length at least "+o)},"clean",0,function(...e){for(let t=0;t<e.length;t++)e[t].fill(0)},"concatBytes",0,function(...e){let t=0;for(let o=0;o<e.length;o++){let n=e[o];r(n),t+=n.length}let o=new Uint8Array(t);for(let t=0,r=0;t<e.length;t++){let n=e[t];o.set(n,r),r+=n.length}return o},"createHasher",0,function(e){let t=t=>e().update(s(t)).digest(),o=e();return t.outputLen=o.outputLen,t.blockLen=o.blockLen,t.create=()=>e(),t},"createView",0,function(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)},"createXOFer",0,function(e){let t=(t,o)=>e(o).update(s(t)).digest(),o=e({});return t.outputLen=o.outputLen,t.blockLen=o.blockLen,t.create=t=>e(t),t},"randomBytes",0,function(e=32){if(t&&"function"==typeof t.getRandomValues)return t.getRandomValues(new Uint8Array(e));if(t&&"function"==typeof t.randomBytes)return Uint8Array.from(t.randomBytes(e));throw Error("crypto.getRandomValues must be defined")},"rotr",0,function(e,t){return e<<32-t|e>>>t},"swap32IfBE",0,n,"toBytes",0,s,"u32",0,function(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}],470525)},5450,e=>{"use strict";let t=BigInt(0),o=BigInt(1);function r(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&"Uint8Array"===e.constructor.name}function n(e){if(!r(e))throw Error("Uint8Array expected")}function s(e){if("string"!=typeof e)throw Error("hex string expected, got "+typeof e);return""===e?t:BigInt("0x"+e)}let a="function"==typeof Uint8Array.from([]).toHex&&"function"==typeof Uint8Array.fromHex,i=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,"0"));function l(e){if(n(e),a)return e.toHex();let t="";for(let o=0;o<e.length;o++)t+=i[e[o]];return t}function c(e){return e>=48&&e<=57?e-48:e>=65&&e<=70?e-55:e>=97&&e<=102?e-87:void 0}function p(e){if("string"!=typeof e)throw Error("hex string expected, got "+typeof e);if(a)return Uint8Array.fromHex(e);let t=e.length,o=t/2;if(t%2)throw Error("hex string expected, got unpadded hex of length "+t);let r=new Uint8Array(o);for(let t=0,n=0;t<o;t++,n+=2){let o=c(e.charCodeAt(n)),s=c(e.charCodeAt(n+1));if(void 0===o||void 0===s)throw Error('hex string expected, got non-hex character "'+(e[n]+e[n+1])+'" at index '+n);r[t]=16*o+s}return r}function u(e,t){return p(e.toString(16).padStart(2*t,"0"))}function h(...e){let t=0;for(let o=0;o<e.length;o++){let r=e[o];n(r),t+=r.length}let o=new Uint8Array(t);for(let t=0,r=0;t<e.length;t++){let n=e[t];o.set(n,r),r+=n.length}return o}let d=e=>"bigint"==typeof e&&t<=e;function y(e,t,o){return d(e)&&d(t)&&d(o)&&t<=e&&e<o}let m=e=>new Uint8Array(e),f={bigint:e=>"bigint"==typeof e,function:e=>"function"==typeof e,boolean:e=>"boolean"==typeof e,string:e=>"string"==typeof e,stringOrUint8Array:e=>"string"==typeof e||r(e),isSafeInteger:e=>Number.isSafeInteger(e),array:e=>Array.isArray(e),field:(e,t)=>t.Fp.isValid(e),hash:e=>"function"==typeof e&&Number.isSafeInteger(e.outputLen)};e.s(["aInRange",0,function(e,t,o,r){if(!y(t,o,r))throw Error("expected valid "+e+": "+o+" <= n < "+r+", got "+t)},"abool",0,function(e,t){if("boolean"!=typeof t)throw Error(e+" boolean expected, got "+t)},"abytes",0,n,"bitLen",0,function(e){let r;for(r=0;e>t;e>>=o,r+=1);return r},"bitMask",0,e=>(o<<BigInt(e))-o,"bytesToHex",0,l,"bytesToNumberBE",0,function(e){return s(l(e))},"bytesToNumberLE",0,function(e){return n(e),s(l(Uint8Array.from(e).reverse()))},"concatBytes",0,h,"createHmacDrbg",0,function(e,t,o){if("number"!=typeof e||e<2)throw Error("hashLen must be a number");if("number"!=typeof t||t<2)throw Error("qByteLen must be a number");if("function"!=typeof o)throw Error("hmacFn must be a function");let r=m(e),n=m(e),s=0,a=()=>{r.fill(1),n.fill(0),s=0},i=(...e)=>o(n,r,...e),l=(e=m(0))=>{let t;if(n=i((t=[0],Uint8Array.from(t)),e),r=i(),0!==e.length){let t;n=i((t=[1],Uint8Array.from(t)),e),r=i()}},c=()=>{if(s++>=1e3)throw Error("drbg: tried 1000 values");let e=0,o=[];for(;e<t;){let t=(r=i()).slice();o.push(t),e+=r.length}return h(...o)};return(e,t)=>{let o;for(a(),l(e);!(o=t(c()));)l();return a(),o}},"ensureBytes",0,function(e,t,o){let n;if("string"==typeof t)try{n=p(t)}catch(t){throw Error(e+" must be hex string or Uint8Array, cause: "+t)}else if(r(t))n=Uint8Array.from(t);else throw Error(e+" must be hex string or Uint8Array");let s=n.length;if("number"==typeof o&&s!==o)throw Error(e+" of length "+o+" expected, got "+s);return n},"equalBytes",0,function(e,t){if(e.length!==t.length)return!1;let o=0;for(let r=0;r<e.length;r++)o|=e[r]^t[r];return 0===o},"hexToBytes",0,p,"inRange",0,y,"isBytes",0,r,"memoized",0,function(e){let t=new WeakMap;return(o,...r)=>{let n=t.get(o);if(void 0!==n)return n;let s=e(o,...r);return t.set(o,s),s}},"numberToBytesBE",0,u,"numberToBytesLE",0,function(e,t){return u(e,t).reverse()},"numberToHexUnpadded",0,function(e){let t=e.toString(16);return 1&t.length?"0"+t:t},"utf8ToBytes",0,function(e){if("string"!=typeof e)throw Error("string expected");return new Uint8Array(new TextEncoder().encode(e))},"validateObject",0,function(e,t,o={}){let r=(t,o,r)=>{let n=f[o];if("function"!=typeof n)throw Error("invalid validator function");let s=e[t];if((!r||void 0!==s)&&!n(s,e))throw Error("param "+String(t)+" is invalid. Expected "+o+", got "+s)};for(let[e,o]of Object.entries(t))r(e,o,!1);for(let[e,t]of Object.entries(o))r(e,t,!0);return e}])},321960,e=>{"use strict";let t=(0,e.i(538463).defineChain)({id:1,name:"Ethereum",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},blockTime:12e3,rpcUrls:{default:{http:["https://eth.merkle.io"]}},blockExplorers:{default:{name:"Etherscan",url:"https://etherscan.io",apiUrl:"https://api.etherscan.io/api"}},contracts:{ensUniversalResolver:{address:"0xeeeeeeee14d718c2b47d9923deab1335e144eeee",blockCreated:0x16041f6},multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:0xdb04c1}}});e.s(["mainnet",0,t])},611573,e=>{"use strict";var t=e.i(569934);class o extends t.BaseError{constructor({docsPath:e}={}){super("Could not find an Account to execute with this Action.\nPlease provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client.",{docsPath:e,docsSlug:"account",name:"AccountNotFoundError"})}}class r extends t.BaseError{constructor({docsPath:e,metaMessages:t,type:o}){super(`Account type "${o}" is not supported.`,{docsPath:e,metaMessages:t,name:"AccountTypeNotSupportedError"})}}e.s(["AccountNotFoundError",0,o,"AccountTypeNotSupportedError",0,r])},478492,(e,t,o)=>{"use strict";var r=Object.prototype.hasOwnProperty,n="~";function s(){}function a(e,t,o){this.fn=e,this.context=t,this.once=o||!1}function i(e,t,o,r,s){if("function"!=typeof o)throw TypeError("The listener must be a function");var i=new a(o,r||e,s),l=n?n+t:t;return e._events[l]?e._events[l].fn?e._events[l]=[e._events[l],i]:e._events[l].push(i):(e._events[l]=i,e._eventsCount++),e}function l(e,t){0==--e._eventsCount?e._events=new s:delete e._events[t]}function c(){this._events=new s,this._eventsCount=0}Object.create&&(s.prototype=Object.create(null),new s().__proto__||(n=!1)),c.prototype.eventNames=function(){var e,t,o=[];if(0===this._eventsCount)return o;for(t in e=this._events)r.call(e,t)&&o.push(n?t.slice(1):t);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(e)):o},c.prototype.listeners=function(e){var t=n?n+e:e,o=this._events[t];if(!o)return[];if(o.fn)return[o.fn];for(var r=0,s=o.length,a=Array(s);r<s;r++)a[r]=o[r].fn;return a},c.prototype.listenerCount=function(e){var t=n?n+e:e,o=this._events[t];return o?o.fn?1:o.length:0},c.prototype.emit=function(e,t,o,r,s,a){var i=n?n+e:e;if(!this._events[i])return!1;var l,c,p=this._events[i],u=arguments.length;if(p.fn){switch(p.once&&this.removeListener(e,p.fn,void 0,!0),u){case 1:return p.fn.call(p.context),!0;case 2:return p.fn.call(p.context,t),!0;case 3:return p.fn.call(p.context,t,o),!0;case 4:return p.fn.call(p.context,t,o,r),!0;case 5:return p.fn.call(p.context,t,o,r,s),!0;case 6:return p.fn.call(p.context,t,o,r,s,a),!0}for(c=1,l=Array(u-1);c<u;c++)l[c-1]=arguments[c];p.fn.apply(p.context,l)}else{var h,d=p.length;for(c=0;c<d;c++)switch(p[c].once&&this.removeListener(e,p[c].fn,void 0,!0),u){case 1:p[c].fn.call(p[c].context);break;case 2:p[c].fn.call(p[c].context,t);break;case 3:p[c].fn.call(p[c].context,t,o);break;case 4:p[c].fn.call(p[c].context,t,o,r);break;default:if(!l)for(h=1,l=Array(u-1);h<u;h++)l[h-1]=arguments[h];p[c].fn.apply(p[c].context,l)}}return!0},c.prototype.on=function(e,t,o){return i(this,e,t,o,!1)},c.prototype.once=function(e,t,o){return i(this,e,t,o,!0)},c.prototype.removeListener=function(e,t,o,r){var s=n?n+e:e;if(!this._events[s])return this;if(!t)return l(this,s),this;var a=this._events[s];if(a.fn)a.fn!==t||r&&!a.once||o&&a.context!==o||l(this,s);else{for(var i=0,c=[],p=a.length;i<p;i++)(a[i].fn!==t||r&&!a[i].once||o&&a[i].context!==o)&&c.push(a[i]);c.length?this._events[s]=1===c.length?c[0]:c:l(this,s)}return this},c.prototype.removeAllListeners=function(e){var t;return e?(t=n?n+e:e,this._events[t]&&l(this,t)):(this._events=new s,this._eventsCount=0),this},c.prototype.off=c.prototype.removeListener,c.prototype.addListener=c.prototype.on,c.prefixed=n,c.EventEmitter=c,t.exports=c},595932,87246,e=>{"use strict";var t=e.i(478492);t.default,e.s([],595932),e.s(["EventEmitter",()=>t.default],87246)},356836,e=>{"use strict";var t=`{
  "connect_wallet": {
    "label": "Connect Wallet",
    "wrong_network": {
      "label": "Wrong network"
    }
  },

  "intro": {
    "title": "What is a Wallet?",
    "description": "A wallet is used to send, receive, store, and display digital assets. It's also a new way to log in, without needing to create new accounts and passwords on every website.",
    "digital_asset": {
      "title": "A Home for your Digital Assets",
      "description": "Wallets are used to send, receive, store, and display digital assets like Ethereum and NFTs."
    },
    "login": {
      "title": "A New Way to Log In",
      "description": "Instead of creating new accounts and passwords on every website, just connect your wallet."
    },
    "get": {
      "label": "Get a Wallet"
    },
    "learn_more": {
      "label": "Learn More"
    }
  },

  "sign_in": {
    "label": "Verify your account",
    "description": "To finish connecting, you must sign a message in your wallet to verify that you are the owner of this account.",
    "message": {
      "send": "Sign message",
      "preparing": "Preparing message...",
      "cancel": "Cancel",
      "preparing_error": "Error preparing message, please retry!"
    },
    "signature": {
      "waiting": "Waiting for signature...",
      "verifying": "Verifying signature...",
      "signing_error": "Error signing message, please retry!",
      "verifying_error": "Error verifying signature, please retry!",
      "oops_error": "Oops, something went wrong!"
    }
  },

  "connect": {
    "label": "Connect",
    "title": "Connect a Wallet",
    "new_to_ethereum": {
      "description": "New to Ethereum wallets?",
      "learn_more": {
        "label": "Learn More"
      }
    },
    "learn_more": {
      "label": "Learn more"
    },
    "recent": "Recent",
    "status": {
      "opening": "Opening %{wallet}...",
      "connecting": "Connecting",
      "connect_mobile": "Continue in %{wallet}",
      "not_installed": "%{wallet} is not installed",
      "not_available": "%{wallet} is not available",
      "confirm": "Confirm connection in the extension",
      "confirm_mobile": "Accept connection request in the wallet"
    },
    "secondary_action": {
      "get": {
        "description": "Don't have %{wallet}?",
        "label": "GET"
      },
      "install": {
        "label": "INSTALL"
      },
      "retry": {
        "label": "RETRY"
      }
    },
    "walletconnect": {
      "description": {
        "full": "Need the official WalletConnect modal?",
        "compact": "Need the WalletConnect modal?"
      },
      "open": {
        "label": "OPEN"
      }
    }
  },

  "connect_scan": {
    "title": "Scan with %{wallet}",
    "fallback_title": "Scan with your phone"
  },

  "connector_group": {
    "installed": "Installed",
    "recommended": "Recommended",
    "other": "Other",
    "popular": "Popular",
    "more": "More",
    "others": "Others"
  },

  "get": {
    "title": "Get a Wallet",
    "action": {
      "label": "GET"
    },
    "mobile": {
      "description": "Mobile Wallet"
    },
    "extension": {
      "description": "Browser Extension"
    },
    "mobile_and_extension": {
      "description": "Mobile Wallet and Extension"
    },
    "mobile_and_desktop": {
      "description": "Mobile and Desktop Wallet"
    },
    "looking_for": {
      "title": "Not what you're looking for?",
      "mobile": {
        "description": "Select a wallet on the main screen to get started with a different wallet provider."
      },
      "desktop": {
        "compact_description": "Select a wallet on the main screen to get started with a different wallet provider.",
        "wide_description": "Select a wallet on the left to get started with a different wallet provider."
      }
    }
  },

  "get_options": {
    "title": "Get started with %{wallet}",
    "short_title": "Get %{wallet}",
    "mobile": {
      "title": "%{wallet} for Mobile",
      "description": "Use the mobile wallet to explore the world of Ethereum.",
      "download": {
        "label": "Get the app"
      }
    },
    "extension": {
      "title": "%{wallet} for %{browser}",
      "description": "Access your wallet right from your favorite web browser.",
      "download": {
        "label": "Add to %{browser}"
      }
    },
    "desktop": {
      "title": "%{wallet} for %{platform}",
      "description": "Access your wallet natively from your powerful desktop.",
      "download": {
        "label": "Add to %{platform}"
      }
    }
  },

  "get_mobile": {
    "title": "Install %{wallet}",
    "description": "Scan with your phone to download on iOS or Android",
    "continue": {
      "label": "Continue"
    }
  },

  "get_instructions": {
    "mobile": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "extension": {
      "refresh": {
        "label": "Refresh"
      },
      "learn_more": {
        "label": "Learn More"
      }
    },
    "desktop": {
      "connect": {
        "label": "Connect"
      },
      "learn_more": {
        "label": "Learn More"
      }
    }
  },

  "chains": {
    "title": "Switch Networks",
    "wrong_network": "Wrong network detected, switch or disconnect to continue.",
    "confirm": "Confirm in Wallet",
    "switching_not_supported": "Your wallet does not support switching networks from %{appName}. Try switching networks from within your wallet instead.",
    "switching_not_supported_fallback": "Your wallet does not support switching networks from this app. Try switching networks from within your wallet instead.",
    "disconnect": "Disconnect",
    "connected": "Connected"
  },

  "profile": {
    "disconnect": {
      "label": "Disconnect"
    },
    "copy_address": {
      "label": "Copy Address",
      "copied": "Copied!"
    },
    "explorer": {
      "label": "View more on explorer"
    },
    "transactions": {
      "description": "%{appName} transactions will appear here...",
      "description_fallback": "Your transactions will appear here...",
      "recent": {
        "title": "Recent Transactions"
      },
      "clear": {
        "label": "Clear All"
      }
    }
  },

  "wallet_connectors": {
    "ready": {
      "qr_code": {
        "step1": {
          "description": "Add Ready to your home screen for faster access to your wallet.",
          "title": "Open the Ready app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "berasig": {
      "extension": {
        "step1": {
          "title": "Install the BeraSig extension",
          "description": "We recommend pinning BeraSig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "best": {
      "qr_code": {
        "step1": {
          "title": "Open the Best Wallet app",
          "description": "Add Best Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "bifrost": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bifrost Wallet on your home screen for quicker access.",
          "title": "Open the Bifrost Wallet app"
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "bitget": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bitget Wallet on your home screen for quicker access.",
          "title": "Open the Bitget Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Bitget Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitget Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitski": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Bitski to your taskbar for quicker access to your wallet.",
          "title": "Install the Bitski extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "bitverse": {
      "qr_code": {
        "step1": {
          "title": "Open the Bitverse Wallet app",
          "description": "Add Bitverse Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "bloom": {
      "desktop": {
        "step1": {
          "title": "Open the Bloom Wallet app",
          "description": "We recommend putting Bloom Wallet on your home screen for quicker access."
        },
        "step2": {
          "description": "Create or import a wallet using your recovery phrase.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you have a wallet, click on Connect to connect via Bloom. A connection prompt in the app will appear for you to confirm the connection.",
          "title": "Click on Connect"
        }
      }
    },

    "bybit": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Bybit on your home screen for faster access to your wallet.",
          "title": "Open the Bybit app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Bybit Wallet for easy access.",
          "title": "Install the Bybit Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Bybit Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "binance": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Binance on your home screen for faster access to your wallet.",
          "title": "Open the Binance app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Binance Wallet extension",
          "description": "We recommend pinning Binance Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "coin98": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coin98 Wallet on your home screen for faster access to your wallet.",
          "title": "Open the Coin98 Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "Click at the top right of your browser and pin Coin98 Wallet for easy access.",
          "title": "Install the Coin98 Wallet extension"
        },
        "step2": {
          "description": "Create a new wallet or import an existing one.",
          "title": "Create or Import a wallet"
        },
        "step3": {
          "description": "Once you set up Coin98 Wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "coinbase": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Coinbase Wallet on your home screen for quicker access.",
          "title": "Open the Coinbase Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Coinbase Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Coinbase Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "compass": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Compass Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Compass Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "core": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Core on your home screen for faster access to your wallet.",
          "title": "Open the Core app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Core to your taskbar for quicker access to your wallet.",
          "title": "Install the Core extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "fox": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting FoxWallet on your home screen for quicker access.",
          "title": "Open the FoxWallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "frontier": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Frontier Wallet on your home screen for quicker access.",
          "title": "Open the Frontier Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Frontier Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Frontier Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "im_token": {
      "qr_code": {
        "step1": {
          "title": "Open the imToken app",
          "description": "Put imToken app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "iopay": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting ioPay on your home screen for faster access to your wallet.",
          "title": "Open the ioPay app"
        },
        "step2": {
          "description": "You can easily backup your wallet using our backup feature on your phone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the WalletConnect button"
        }
      }
    },

    "kaikas": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Kaikas to your taskbar for quicker access to your wallet.",
          "title": "Install the Kaikas extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Kaikas app",
          "description": "Put Kaikas app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "kaia": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Kaia to your taskbar for quicker access to your wallet.",
          "title": "Install the Kaia extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Kaia app",
          "description": "Put Kaia app on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap Scanner Icon in top right corner",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "kraken": {
      "qr_code": {
        "step1": {
          "title": "Open the Kraken Wallet app",
          "description": "Add Kraken Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "kresus": {
      "qr_code": {
        "step1": {
          "title": "Open the Kresus Wallet app",
          "description": "Add Kresus Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "magicEden": {
      "extension": {
        "step1": {
          "title": "Install the Magic Eden extension",
          "description": "We recommend pinning Magic Eden to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "metamask": {
      "qr_code": {
        "step1": {
          "title": "Open the MetaMask app",
          "description": "We recommend putting MetaMask on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the MetaMask extension",
          "description": "We recommend pinning MetaMask to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "nestwallet": {
      "extension": {
        "step1": {
          "title": "Install the NestWallet extension",
          "description": "We recommend pinning NestWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "okx": {
      "qr_code": {
        "step1": {
          "title": "Open the OKX Wallet app",
          "description": "We recommend putting OKX Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the OKX Wallet extension",
          "description": "We recommend pinning OKX Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "omni": {
      "qr_code": {
        "step1": {
          "title": "Open the Omni app",
          "description": "Add Omni to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your home screen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "1inch": {
      "qr_code": {
        "step1": {
          "description": "Put 1inch Wallet on your home screen for faster access to your wallet.",
          "title": "Open the 1inch Wallet app"
        },
        "step2": {
          "description": "Create a wallet and username, or import an existing wallet.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "token_pocket": {
      "qr_code": {
        "step1": {
          "title": "Open the TokenPocket app",
          "description": "We recommend putting TokenPocket on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the TokenPocket extension",
          "description": "We recommend pinning TokenPocket to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "trust": {
      "qr_code": {
        "step1": {
          "title": "Open the Trust Wallet app",
          "description": "Put Trust Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Trust Wallet extension",
          "description": "Click at the top right of your browser and pin Trust Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up Trust Wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "uniswap": {
      "qr_code": {
        "step1": {
          "title": "Open the Uniswap app",
          "description": "Add Uniswap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "zerion": {
      "qr_code": {
        "step1": {
          "title": "Open the Zerion app",
          "description": "We recommend putting Zerion on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },

      "extension": {
        "step1": {
          "title": "Install the Zerion extension",
          "description": "We recommend pinning Zerion to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rainbow": {
      "qr_code": {
        "step1": {
          "title": "Open the Rainbow app",
          "description": "We recommend putting Rainbow on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "You can easily backup your wallet using our backup feature on your phone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "enkrypt": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Enkrypt Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Enkrypt Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "frame": {
      "extension": {
        "step1": {
          "description": "We recommend pinning Frame to your taskbar for quicker access to your wallet.",
          "title": "Install Frame & the companion extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "one_key": {
      "extension": {
        "step1": {
          "title": "Install the OneKey Wallet extension",
          "description": "We recommend pinning OneKey Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "paraswap": {
      "qr_code": {
        "step1": {
          "title": "Open the ParaSwap app",
          "description": "Add ParaSwap Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      }
    },

    "phantom": {
      "extension": {
        "step1": {
          "title": "Install the Phantom extension",
          "description": "We recommend pinning Phantom to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "rabby": {
      "extension": {
        "step1": {
          "title": "Install the Rabby extension",
          "description": "We recommend pinning Rabby to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "ronin": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting Ronin Wallet on your home screen for quicker access.",
          "title": "Open the Ronin Wallet app"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      },

      "extension": {
        "step1": {
          "description": "We recommend pinning Ronin Wallet to your taskbar for quicker access to your wallet.",
          "title": "Install the Ronin Wallet extension"
        },
        "step2": {
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          "title": "Refresh your browser"
        }
      }
    },

    "ramper": {
      "extension": {
        "step1": {
          "title": "Install the Ramper extension",
          "description": "We recommend pinning Ramper to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safeheron": {
      "extension": {
        "step1": {
          "title": "Install the Core extension",
          "description": "We recommend pinning Safeheron to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "taho": {
      "extension": {
        "step1": {
          "title": "Install the Taho extension",
          "description": "We recommend pinning Taho to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "wigwam": {
      "extension": {
        "step1": {
          "title": "Install the Wigwam extension",
          "description": "We recommend pinning Wigwam to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "talisman": {
      "extension": {
        "step1": {
          "title": "Install the Talisman extension",
          "description": "We recommend pinning Talisman to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import an Ethereum Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "ctrl": {
      "extension": {
        "step1": {
          "title": "Install the CTRL Wallet extension",
          "description": "We recommend pinning CTRL Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "zeal": {
      "qr_code": {
        "step1": {
          "title": "Open the Zeal app",
          "description": "Add Zeal Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the QR icon and scan",
          "description": "Tap the QR icon on your homescreen, scan the code and confirm the prompt to connect."
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Zeal extension",
          "description": "We recommend pinning Zeal to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "safepal": {
      "extension": {
        "step1": {
          "title": "Install the SafePal Wallet extension",
          "description": "Click at the top right of your browser and pin SafePal Wallet for easy access."
        },
        "step2": {
          "title": "Create or Import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up SafePal Wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SafePal Wallet app",
          "description": "Put SafePal Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Choose New Connection, then scan the QR code and confirm the prompt to connect."
        }
      }
    },

    "desig": {
      "extension": {
        "step1": {
          "title": "Install the Desig extension",
          "description": "We recommend pinning Desig to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "subwallet": {
      "extension": {
        "step1": {
          "title": "Install the SubWallet extension",
          "description": "We recommend pinning SubWallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the SubWallet app",
          "description": "We recommend putting SubWallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "clv": {
      "extension": {
        "step1": {
          "title": "Install the CLV Wallet extension",
          "description": "We recommend pinning CLV Wallet to your taskbar for quicker access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the CLV Wallet app",
          "description": "We recommend putting CLV Wallet on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "okto": {
      "qr_code": {
        "step1": {
          "title": "Open the Okto app",
          "description": "Add Okto to your home screen for quick access"
        },
        "step2": {
          "title": "Create an MPC Wallet",
          "description": "Create an account and generate a wallet"
        },
        "step3": {
          "title": "Tap WalletConnect in Settings",
          "description": "Tap the Scan QR icon at the top right and confirm the prompt to connect."
        }
      }
    },

    "ledger": {
      "desktop": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "Set up a new Ledger or connect to an existing one."
        },
        "step3": {
          "title": "Connect",
          "description": "A connection prompt will appear for you to connect your wallet."
        }
      },
      "qr_code": {
        "step1": {
          "title": "Open the Ledger Live app",
          "description": "We recommend putting Ledger Live on your home screen for quicker access."
        },
        "step2": {
          "title": "Set up your Ledger",
          "description": "You can either sync with the desktop app or connect your Ledger."
        },
        "step3": {
          "title": "Scan the code",
          "description": "Tap WalletConnect then Switch to Scanner. After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "valora": {
      "qr_code": {
        "step1": {
          "title": "Open the Valora app",
          "description": "We recommend putting Valora on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or import a wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "gate": {
      "qr_code": {
        "step1": {
          "title": "Open the Gate app",
          "description": "We recommend putting Gate on your home screen for quicker access."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      },
      "extension": {
        "step1": {
          "title": "Install the Gate extension",
          "description": "We recommend pinning Gate to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Be sure to back up your wallet using a secure method. Never share your secret recovery phrase with anyone."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you set up your wallet, click below to refresh the browser and load up the extension."
        }
      }
    },

    "gemini": {
      "qr_code": {
        "step1": {
          "title": "Open keys.gemini.com",
          "description": "Visit keys.gemini.com on your mobile browser - no app download required."
        },
        "step2": {
          "title": "Create Your Wallet Instantly",
          "description": "Set up your smart wallet in seconds using your device's built-in authentication."
        },
        "step3": {
          "title": "Scan to Connect",
          "description": "Scan the QR code to instantly connect your wallet - it just works."
        }
      },
      "extension": {
        "step1": {
          "title": "Go to keys.gemini.com",
          "description": "No extensions or downloads needed - your wallet lives securely in the browser."
        },
        "step2": {
          "title": "One-Click Setup",
          "description": "Create your smart wallet instantly with passkey authentication - easier than any wallet out there."
        },
        "step3": {
          "title": "Connect and Go",
          "description": "Approve the connection and you're ready - the unopinionated wallet that just works."
        }
      }
    },

    "xportal": {
      "qr_code": {
        "step1": {
          "description": "Put xPortal on your home screen for faster access to your wallet.",
          "title": "Open the xPortal app"
        },
        "step2": {
          "description": "Create a wallet or import an existing one.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the Scan QR button"
        }
      }
    },

    "mew": {
      "qr_code": {
        "step1": {
          "description": "We recommend putting MEW Wallet on your home screen for quicker access.",
          "title": "Open the MEW Wallet app"
        },
        "step2": {
          "description": "You can easily backup your wallet using the cloud backup feature.",
          "title": "Create or Import a Wallet"
        },
        "step3": {
          "description": "After you scan, a connection prompt will appear for you to connect your wallet.",
          "title": "Tap the scan button"
        }
      }
    },

    "zilpay": {
      "qr_code": {
        "step1": {
          "title": "Open the ZilPay app",
          "description": "Add ZilPay to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "nova": {
      "qr_code": {
        "step1": {
          "title": "Open the Nova Wallet app",
          "description": "Add Nova Wallet to your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "meco": {
      "qr_code": {
        "step1": {
          "title": "Open the MeCo Wallet app",
          "description": "Put MeCo Wallet on your home screen for faster access to your wallet."
        },
        "step2": {
          "title": "Create or Import a Wallet",
          "description": "Create a new wallet or import an existing one."
        },
        "step3": {
          "title": "Tap the scan button",
          "description": "After you scan, a connection prompt will appear for you to connect your wallet."
        }
      }
    },

    "anchorage_digital": {
      "extension": {
        "step1": {
          "title": "Install the Anchorage Digital extension",
          "description": "We recommend pinning Anchorage Digital to your taskbar for easier access to your wallet."
        },
        "step2": {
          "title": "Scan the QR code to login",
          "description": "Securely connect your organization's wallets to dApps with institutional-grade security."
        },
        "step3": {
          "title": "Refresh your browser",
          "description": "Once you log in, click below to refresh the browser and load up the extension."
        }
      }
    }
  }
}
`;e.s(["en_US_default",0,t])},101139,e=>{e.v(t=>Promise.all(["static/chunks/38-a303zmbh9_.js"].map(t=>e.l(t))).then(()=>t(109963)))},625932,e=>{e.v(e=>Promise.resolve().then(()=>e(776267)))},66216,e=>{e.v(t=>Promise.all(["static/chunks/3_uoxzkncsz0l.js","static/chunks/1a8eulhorwa-_.js","static/chunks/3y7q50__aq573.js"].map(t=>e.l(t))).then(()=>t(477350)))},224814,e=>{e.v(t=>Promise.all(["static/chunks/100p3vzdksb-6.js","static/chunks/42uuz-qgo69uf.js"].map(t=>e.l(t))).then(()=>t(653806)))},470308,e=>{e.v(t=>Promise.all(["static/chunks/2ckz0h200nstf.js"].map(t=>e.l(t))).then(()=>t(915618)))},474683,e=>{e.v(t=>Promise.all(["static/chunks/15bpaf4cea591.js"].map(t=>e.l(t))).then(()=>t(289329)))},381024,e=>{e.v(t=>Promise.all(["static/chunks/09sf540bed75w.js","static/chunks/2q3oeu29ky6uv.js"].map(t=>e.l(t))).then(()=>t(607627)))},437436,e=>{e.v(t=>Promise.all(["static/chunks/3xn999kp2wtpv.js"].map(t=>e.l(t))).then(()=>t(887763)))},677892,e=>{e.v(t=>Promise.all(["static/chunks/1d25ayb7vj873.js"].map(t=>e.l(t))).then(()=>t(92211)))},939802,e=>{e.v(t=>Promise.all(["static/chunks/44x3e6wzshf50.js"].map(t=>e.l(t))).then(()=>t(639484)))},594369,e=>{e.v(t=>Promise.all(["static/chunks/3hgqk7r4-z4-p.js"].map(t=>e.l(t))).then(()=>t(360030)))},667221,e=>{e.v(t=>Promise.all(["static/chunks/0lrf-ypkomy06.js"].map(t=>e.l(t))).then(()=>t(521546)))},412515,e=>{e.v(t=>Promise.all(["static/chunks/0fkm5_x05ul3r.js"].map(t=>e.l(t))).then(()=>t(702592)))},411020,e=>{e.v(t=>Promise.all(["static/chunks/3omacbposmmav.js"].map(t=>e.l(t))).then(()=>t(494205)))},406565,e=>{e.v(t=>Promise.all(["static/chunks/3jrnpxhploir8.js"].map(t=>e.l(t))).then(()=>t(696599)))},955428,e=>{e.v(t=>Promise.all(["static/chunks/3pss6c2afu4by.js"].map(t=>e.l(t))).then(()=>t(757128)))},908553,e=>{e.v(t=>Promise.all(["static/chunks/3e4n-srtx4l5-.js"].map(t=>e.l(t))).then(()=>t(672849)))},204101,e=>{e.v(t=>Promise.all(["static/chunks/0b8xao3dfhazf.js"].map(t=>e.l(t))).then(()=>t(238087)))},262330,e=>{e.v(t=>Promise.all(["static/chunks/31g80r4ncvgdn.js"].map(t=>e.l(t))).then(()=>t(348365)))},631199,e=>{e.v(t=>Promise.all(["static/chunks/02weoc2kx_z4e.js"].map(t=>e.l(t))).then(()=>t(276241)))},850866,e=>{e.v(t=>Promise.all(["static/chunks/00sezwngrh-wg.js"].map(t=>e.l(t))).then(()=>t(979249)))},438815,e=>{e.v(t=>Promise.all(["static/chunks/1ca9xwy43dtnb.js"].map(t=>e.l(t))).then(()=>t(499412)))},558014,e=>{e.v(t=>Promise.all(["static/chunks/1uaurc3n3c9on.js"].map(t=>e.l(t))).then(()=>t(114824)))},640066,e=>{e.v(t=>Promise.all(["static/chunks/364y9kw91rrqe.js"].map(t=>e.l(t))).then(()=>t(556693)))},35808,e=>{e.v(t=>Promise.all(["static/chunks/2ck4tr4sul7lk.js"].map(t=>e.l(t))).then(()=>t(887831)))},891149,e=>{e.v(t=>Promise.all(["static/chunks/3j50u-54_4gny.js"].map(t=>e.l(t))).then(()=>t(135597)))},442086,e=>{e.v(t=>Promise.all(["static/chunks/1eo-u8lcxe8df.js"].map(t=>e.l(t))).then(()=>t(67881)))},105872,e=>{e.v(t=>Promise.all(["static/chunks/3ocds84852zjh.js"].map(t=>e.l(t))).then(()=>t(864976)))},271711,e=>{e.v(t=>Promise.all(["static/chunks/0rkdxx_921-u8.js"].map(t=>e.l(t))).then(()=>t(29311)))},567031,e=>{e.v(t=>Promise.all(["static/chunks/16fq-4pibj5ol.js"].map(t=>e.l(t))).then(()=>t(75789)))},575685,e=>{e.v(t=>Promise.all(["static/chunks/2h23jxsa84hnf.js"].map(t=>e.l(t))).then(()=>t(786882)))},604414,e=>{e.v(t=>Promise.all(["static/chunks/21zagllswvalt.js"].map(t=>e.l(t))).then(()=>t(352164)))},777210,e=>{e.v(t=>Promise.all(["static/chunks/2t_slrlg28ijq.js"].map(t=>e.l(t))).then(()=>t(745141)))},230454,e=>{e.v(t=>Promise.all(["static/chunks/30qp7ferf9rds.js"].map(t=>e.l(t))).then(()=>t(516267)))},80911,e=>{e.v(t=>Promise.all(["static/chunks/2n15pxj02ir7h.js"].map(t=>e.l(t))).then(()=>t(138783)))},197615,e=>{e.v(t=>Promise.all(["static/chunks/0z0ya6bj85zjv.js"].map(t=>e.l(t))).then(()=>t(540804)))},485284,e=>{e.v(t=>Promise.all(["static/chunks/1219jhtddw96z.js"].map(t=>e.l(t))).then(()=>t(303962)))},346977,e=>{e.v(t=>Promise.all(["static/chunks/06cd6kneei-dm.js"].map(t=>e.l(t))).then(()=>t(370564)))},736033,e=>{e.v(t=>Promise.all(["static/chunks/3kaqe5sourirx.js"].map(t=>e.l(t))).then(()=>t(472299)))},557289,e=>{e.v(t=>Promise.all(["static/chunks/3uxtyy5mp0zoc.js"].map(t=>e.l(t))).then(()=>t(920685)))},649149,e=>{e.v(t=>Promise.all(["static/chunks/0-u_t85jfjkd4.js"].map(t=>e.l(t))).then(()=>t(418891)))},9974,e=>{e.v(t=>Promise.all(["static/chunks/3gpq03ow4ar0b.js"].map(t=>e.l(t))).then(()=>t(761011)))},485155,e=>{e.v(t=>Promise.all(["static/chunks/3-p8lccpwm8uc.js"].map(t=>e.l(t))).then(()=>t(421618)))},759968,e=>{e.v(t=>Promise.all(["static/chunks/1lo3jzh8u12ej.js"].map(t=>e.l(t))).then(()=>t(251012)))},38898,e=>{e.v(t=>Promise.all(["static/chunks/3_f-bei7vvzov.js"].map(t=>e.l(t))).then(()=>t(900368)))},822574,e=>{e.v(t=>Promise.all(["static/chunks/3-k8l8a56nv6d.js"].map(t=>e.l(t))).then(()=>t(248530)))},101716,e=>{e.v(t=>Promise.all(["static/chunks/25fj2e_ldl_kw.js"].map(t=>e.l(t))).then(()=>t(839444)))},24530,e=>{e.v(t=>Promise.all(["static/chunks/3ds788e_-go_r.js"].map(t=>e.l(t))).then(()=>t(723557)))},768769,e=>{e.v(t=>Promise.all(["static/chunks/0ueo7d-utgdf-.js"].map(t=>e.l(t))).then(()=>t(880804)))},667285,e=>{e.v(t=>Promise.all(["static/chunks/3ore2fkoc-xd9.js"].map(t=>e.l(t))).then(()=>t(804453)))},193126,e=>{e.v(t=>Promise.all(["static/chunks/24hk49unil2f-.js"].map(t=>e.l(t))).then(()=>t(973024)))},708036,e=>{e.v(t=>Promise.all(["static/chunks/0zevxpooegnwz.js"].map(t=>e.l(t))).then(()=>t(481675)))},811338,e=>{e.v(t=>Promise.all(["static/chunks/2shl2etacx5zo.js"].map(t=>e.l(t))).then(()=>t(385710)))},321625,e=>{e.v(t=>Promise.all(["static/chunks/12fl8owu_9a2d.js"].map(t=>e.l(t))).then(()=>t(656395)))},345304,e=>{e.v(t=>Promise.all(["static/chunks/32k_q_3f-7qzb.js"].map(t=>e.l(t))).then(()=>t(382042)))},738278,e=>{e.v(t=>Promise.all(["static/chunks/244kayuvonipp.js"].map(t=>e.l(t))).then(()=>t(619124)))},792872,e=>{e.v(t=>Promise.all(["static/chunks/2wc04zvxzmp6k.js"].map(t=>e.l(t))).then(()=>t(371659)))},226755,e=>{e.v(t=>Promise.all(["static/chunks/42kxf23fzreuv.js"].map(t=>e.l(t))).then(()=>t(446495)))},504937,e=>{e.v(t=>Promise.all(["static/chunks/16kgxkqa3o7ir.js"].map(t=>e.l(t))).then(()=>t(156255)))},410758,e=>{e.v(t=>Promise.all(["static/chunks/2zvu3bjeml7m-.js"].map(t=>e.l(t))).then(()=>t(908254)))},886422,e=>{e.v(t=>Promise.all(["static/chunks/2u08t9afwj4xs.js"].map(t=>e.l(t))).then(()=>t(652860)))},274604,e=>{e.v(t=>Promise.all(["static/chunks/18r70f8bjj6vi.js"].map(t=>e.l(t))).then(()=>t(505209)))},426975,e=>{e.v(t=>Promise.all(["static/chunks/2zo36hoa91n5r.js"].map(t=>e.l(t))).then(()=>t(6938)))},106369,e=>{e.v(t=>Promise.all(["static/chunks/0q38e1huqs7p6.js"].map(t=>e.l(t))).then(()=>t(358134)))},507518,e=>{e.v(t=>Promise.all(["static/chunks/2zqkgj9bejmem.js"].map(t=>e.l(t))).then(()=>t(221274)))},396057,e=>{e.v(t=>Promise.all(["static/chunks/0r-xr1tierkv5.js"].map(t=>e.l(t))).then(()=>t(432867)))},192150,e=>{e.v(t=>Promise.all(["static/chunks/2un65l8pu-7li.js"].map(t=>e.l(t))).then(()=>t(42941)))},703354,e=>{e.v(t=>Promise.all(["static/chunks/3s3rbh21v-zvv.js"].map(t=>e.l(t))).then(()=>t(185157)))},422316,e=>{e.v(t=>Promise.all(["static/chunks/3kyu8091-dgd8.js"].map(t=>e.l(t))).then(()=>t(460012)))},932219,e=>{e.v(t=>Promise.all(["static/chunks/1nbllzl34v2w-.js"].map(t=>e.l(t))).then(()=>t(467138)))},437039,e=>{e.v(t=>Promise.all(["static/chunks/0rn-2-_8k-441.js"].map(t=>e.l(t))).then(()=>t(21043)))},31273,e=>{e.v(t=>Promise.all(["static/chunks/256wrjyjynv2s.js"].map(t=>e.l(t))).then(()=>t(444733)))},812921,e=>{e.v(t=>Promise.all(["static/chunks/3ccwp_vsyerie.js"].map(t=>e.l(t))).then(()=>t(327052)))},93305,e=>{e.v(t=>Promise.all(["static/chunks/0wng78tmxaeet.js"].map(t=>e.l(t))).then(()=>t(823233)))},65212,e=>{e.v(t=>Promise.all(["static/chunks/330rksbx2upcf.js"].map(t=>e.l(t))).then(()=>t(879917)))},961315,e=>{e.v(t=>Promise.all(["static/chunks/3q2magz47p0eg.js"].map(t=>e.l(t))).then(()=>t(4245)))},588300,e=>{e.v(t=>Promise.all(["static/chunks/3-vw04yn52pjs.js"].map(t=>e.l(t))).then(()=>t(227574)))},801705,e=>{e.v(t=>Promise.all(["static/chunks/229c0fbjg88zu.js"].map(t=>e.l(t))).then(()=>t(211722)))},630764,e=>{e.v(t=>Promise.all(["static/chunks/2faib_itbpb8a.js"].map(t=>e.l(t))).then(()=>t(558160)))},254566,e=>{e.v(t=>Promise.all(["static/chunks/0hn2dw42izlix.js"].map(t=>e.l(t))).then(()=>t(164540)))},873830,e=>{e.v(t=>Promise.all(["static/chunks/3fe_wbzg4y_j0.js"].map(t=>e.l(t))).then(()=>t(631690)))},554610,e=>{e.v(t=>Promise.all(["static/chunks/2kr1u4c0370vl.js"].map(t=>e.l(t))).then(()=>t(93227)))},810066,e=>{e.v(t=>Promise.all(["static/chunks/0zw_z6hxro1jx.js"].map(t=>e.l(t))).then(()=>t(57182)))},74634,e=>{e.v(t=>Promise.all(["static/chunks/2ydftx3bvmoja.js"].map(t=>e.l(t))).then(()=>t(841203)))},317949,e=>{e.v(t=>Promise.all(["static/chunks/2yw_zokx-m_yh.js"].map(t=>e.l(t))).then(()=>t(199770)))}]);