/* hope v1.0.1 - 2013/8/12
   https://github.com/soyjavi/hope
   Copyright (c) 2013 Javi Jimenez - Licensed MIT */
(function(){(function(n){var e,t,r,i,u;t=function(){this._callbacks=[];return this};i=function(n){var e,r,i,u,o,l,s;e=n.length;r=0;l=new t;i=[];s=[];o=function(n){return function(t,u){r+=1;i[n]=t;s[n]=u;if(r===e){return l.done(i,s)}}};u=0;while(u<e){n[u]().then(o(u));u++}return l};r=function(n,e,i,u){var o;o=new t;if(n.length===0||u!=null&&e!=null){o.done(e,i)}else{n[0](e,i).then(function(e,t){n.splice(0,1);return r(n,e,t,u).then(function(n,e){return o.done(n,e)})})}return o};u=function(n,e,t){return r(n,e,t,true)};t.prototype.then=function(n,e){var t;t=function(){return n.apply(e,arguments)};if(this._isdone){return t(this.error,this.result)}else{return this._callbacks.push(t)}};t.prototype.done=function(n,e){var t,r;this._isdone=true;this.error=n;this.result=e;t=0;r=this._callbacks.length;while(t<r){this._callbacks[t](n,e);t++}return this._callbacks=[]};e={Promise:t,join:i,chain:r,shield:u};if(typeof define==="function"&&define.amd){define(function(){return e})}else{n.Hope=e}if(typeof module!=="undefined"&&module!==null&&module.exports!=null){return module.exports=e}})(this)}).call(this);