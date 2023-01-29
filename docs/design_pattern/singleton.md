# 单例模式
顾名思义，单例模式就是确保在整个应用的生命周期内，你只能获取到某个“类”的单个实例。

在js中，我们实现一个通用的单例模式，代码如下：
``` js
var getSingle = function( fn ){ 
    var result; 
    return function(){ 
        return result || ( result = fn .apply(this, arguments ) ); 
    } 
}; 
```

假设我们有一个“类”（姑且这么说，js中没有像java那样的类的概念）。如下：

``` js
function Person() {
    this.name = ''
    this.age = 0
}
```

那么我们就可以创建这个类的单例模式，如下所示：

``` js
var getSinglePerson = getSingle(Person)
var p1 = getSinglePerson()
var p2 = getSinglePerson()

console.log(p1 === p2) // true
```

也就是说，如果我们想要获得某个“类”的单例，我们只需要用`getSingle`方法加工以下它就好了。
