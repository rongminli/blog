# 发布订阅模式（观察者模式）
第一点说明发布—订阅模式可以广泛应用于异步编程中，这是一种替代传递回调函数的方案。
在异步编程中使用发布—订阅模式，我们就无需过多关注对象在异步运行期间的内部状态，而只需要订阅感兴趣的事件发生点。

明发布—订阅模式可以取代对象之间硬编码的通知机制，一个对象不用再显式地调
用另外一个对象的某个接口。

发布—订阅模式的优点非常明显，一为时间上的解耦，二为对象之间的解耦。

## 通用发布订阅模型
我们可以把发布—订阅的功能提取出来，放在一个单独的对象内：
``` js
var event = { 
    clientList: [], 
    listen: function( key, fn ){ 
        if ( !this.clientList[ key ] ){ 
            this.clientList[ key ] = []; 
        } 
        this.clientList[ key ].push( fn ); // 订阅的消息添加进缓存列表
    }, 
    trigger: function(){ 
        var key = Array.prototype.shift.call( arguments ), // (1); 
        fns = this.clientList[ key ]; 
        if ( !fns || fns.length === 0 ){ // 如果没有绑定对应的消息
            return false; 
        } 
        for( var i = 0, fn; fn = fns[ i++ ]; ){ 
            fn.apply( this, arguments ); // (2) // arguments 是 trigger 时带上的参数
        } 
    },
    remove:function( key, fn ){ 
        var fns = this.clientList[ key ]; 
        if ( !fns ){ // 如果 key 对应的消息没有被人订阅，则直接返回
            return false; 
        } 
        if ( !fn ){ // 如果没有传入具体的回调函数，表示需要取消 key 对应消息的所有订阅
            fns && ( fns.length = 0 ); 
        }else{ 
            for ( var l = fns.length - 1; l >=0; l-- ){ // 反向遍历订阅的回调函数列表
                var _fn = fns[ l ]; 
                if ( _fn === fn ){ 
                    fns.splice( l, 1 ); // 删除订阅者的回调函数
                } 
            } 
        } 
    }
};
```

再定义一个 installEvent 函数，这个函数可以给所有的对象都动态安装发布—订阅功能：

``` js
var installEvent = function( obj ){ 
    for ( var i in event ){ 
        obj[ i ] = event[ i ]; 
    } 
}; 
```

## 一个示例

``` js
var salesOffices = {}; 
installEvent( salesOffices ); 
salesOffices.listen( 'squareMeter88', function( price ){ // 小明订阅消息
    console.log( '价格= ' + price ); 
}); 
salesOffices.listen( 'squareMeter100', function( price ){ // 小红订阅消息
    console.log( '价格= ' + price ); 
}); 
salesOffices.trigger( 'squareMeter88', 2000000 ); // 输出：2000000 
salesOffices.trigger( 'squareMeter100', 3000000 ); // 输出：3000000 

salesOffices.remove( 'squareMeter88', fn1 ); // 删除小明的订阅
salesOffices.trigger( 'squareMeter88', 2000000 ); // 输出：2000000
```

## 全局的发布－订阅对象

发布—订阅模式可以用一个全局的 Event 对象来实现，订阅者不需要了解消息来自哪个发布者，发布者也不知道消息会推送给哪些订阅者，Event 作为一个类似“中介者”的角色，把订阅者和发布者联系起来。见如下代码：

``` js
var Event = (function () {
    var clientList = {},
        listen,
        trigger,
        remove;
    listen = function (key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };
    trigger = function () {
        var key = Array.prototype.shift.call(arguments),
            fns = clientList[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    };
    remove = function (key, fn) {
        var fns = clientList[key];
        if (!fns) {
            return false;
        }
        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (var l = fns.length - 1; l >= 0; l--) {
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1);
                }
            }
        }
    };
    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    }
})();
Event.listen('squareMeter88', function (price) { // 小红订阅消息
    console.log('价格= ' + price); // 输出：'价格=2000000' 
});
Event.trigger('squareMeter88', 2000000); // 售楼处发布消息
```

## 全局事件的命名冲突

全局的发布—订阅对象里只有一个 clinetList 来存放消息名和回调函数，大家都通过它来订
阅和发布各种消息，久而久之，难免会出现事件名冲突的情况，所以我们还可以给 Event 对象提供创建命名空间的功能。

在提供最终的代码之前，我们来感受一下怎么使用这两个新增的功能。

``` js
Event.trigger('click', 1);
Event.listen('click', function (a) {
    console.log(a); // 输出：1 
});
/************** 使用命名空间 ********************/
Event.create('namespace1').listen('click', function (a) {
    console.log(a); // 输出：1 
});
Event.create('namespace1').trigger('click', 1);
Event.create('namespace2').listen('click', function (a) {
    console.log(a); // 输出：2 
});
Event.create('namespace2').trigger('click', 2); 
```

具体实现代码如下：

``` js
var Event = (function () {
    var global = this;
    var Event;
    var _default = 'default';
    Event = function () {
        var _listen;
        var _trigger;
        var _remove;
        var _slice = Array.prototype.slice;
        var _shift = Array.prototype.shift;
        var _unshift = Array.prototype.unshift;
        var namespaceCache = {};
        var _create;
        var find;
        var each = function (ary, fn) {
            var ret;
            for (var i = 0, l = ary.length; i < l; i++) {
                var n = ary[i];
                ret = fn.call(n, i, n);
            }
            return ret;
        };
        _listen = function (key, fn, cache) {
            if (!cache[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };
        _remove = function (key, cache, fn) {
            if (cache[key]) {
                if (fn) {
                    for (var i = cache[key].length; i >= 0; i--) {
                        if (cache[key][i] === fn) {
                            cache[key].splice(i, 1);
                        }
                    }
                } else {
                    cache[key] = [];
                }
            }
        };
        _trigger = function (...args) {
            var cache = _shift.call(args);
            var key = _shift.call(args);
            var _self = this;
            var ret;
            var stack = cache[key];
            if (!(stack?.length)) {
                return;
            }
            return each(stack, function () {
                return this.apply(_self, args);
            });
        };
        _create = function (namespace) {
            var namespace = namespace || _default;
            var cache = {};
            var offlineStack = []; // 离线事件 
            var ret = {
                listen: function (key, fn, last) {
                    _listen(key, fn, cache);
                    if (offlineStack === null) {
                        return;
                    }
                    if (last === 'last') {
                        offlineStack.length && offlineStack.pop()();
                    } else {
                        each(offlineStack, function () {
                            this();
                        });
                    }
                    offlineStack = null;
                },
                one: function (key, fn, last) {
                    _remove(key, cache);
                    this.listen(key, fn, last);
                },
                remove: function (key, fn) {
                    _remove(key, cache, fn);
                },
                trigger: function (...args) {
                    var fn;
                    var args;
                    var _self = this;
                    _unshift.call(args, cache);
                    args = args;
                    fn = function () {
                        return _trigger.apply(_self, args);
                    };
                    if (offlineStack) {
                        return offlineStack.push(fn);
                    }
                    return fn();
                }
            };
            return namespace ?
                (namespaceCache[namespace] ? namespaceCache[namespace] :
                    namespaceCache[namespace] = ret)
                : ret;
        };
        return {
            create: _create,
            one: function (key, fn, last) {
                var event = this.create();
                event.one(key, fn, last);
            },
            remove: function (key, fn) {
                var event = this.create();
                event.remove(key, fn);
            },
            listen: function (key, fn, last) {
                var event = this.create();
                event.listen(key, fn, last);
            },
            trigger: function (...args) {
                var event = this.create();
                event.trigger.apply(this, args);
            }
        };
    }();
    return Event;
})(); 
```

## javaScript 实现发布－订阅模式的便利性
这里要提出的是，我们一直讨论的发布—订阅模式，跟一些别的语言（比如 Java）中的实现
还是有区别的。在 Java 中实现一个自己的发布—订阅模式，通常会把订阅者对象自身当成引用传
入发布者对象中，同时订阅者对象还需提供一个名为诸如 update 的方法，供发布者对象在适合的
时候调用。而在 JavaScript 中，我们用注册回调函数的形式来代替传统的发布—订阅模式，显得更
加优雅和简单。
另外，在 JavaScript 中，我们无需去选择使用推模型还是拉模型。推模型是指在事件发生时，
发布者一次性把所有更改的状态和数据都推送给订阅者。拉模型不同的地方是，发布者仅仅通知
订阅者事件已经发生了，此外发布者要提供一些公开的接口供订阅者来主动拉取数据。拉模型的
好处是可以让订阅者“按需获取”，但同时有可能让发布者变成一个“门户大开”的对象，同时
增加了代码量和复杂度。
刚好在 JavaScript 中，arguments 可以很方便地表示参数列表，所以我们一般都会选择推模型，
使用 Function.prototype.apply 方法把所有参数都推送给订阅者。