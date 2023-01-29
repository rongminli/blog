# 策略模式
**策略模式指的是定义一系列的算法，把它们一个个封装起来**。将不变的部分和变化的部分隔开是每个设计模式的主题，策略模式也不例外，**策略模式的目的就是将算法的使用与算法的实现分离开来。**

## 一个例子
在编程工作中，我们往往需要根据不同的情形，组合不同的策略，去完成同一个目标。

例如前端开发中的输入校验，用户名、密码、电话号码或者邮箱等等都需要使用不同的校验策略，但是我们最终的目的都是要知道当前的输入是否合法。

现在假设我们正在编写一个注册的页面，在点击注册按钮之前，有如下几条校验逻辑。
- 用户名不能为空。
- 密码长度不能少于 6 位。
- 手机号码必须符合格式。

我们把这些规则封装成不同的策略，代码如下。
``` js

var strategies = {
    isNonEmpty : (value, errorMsg) => {
        if(value === '') {
            return errorMsg
        }
    },
    minLength : (value, length, errorMsg) => {
        if(value.length < length) {
            return errorMsg
        }
    },
    isMobile : (value, errorMsg) => {
        if ( !/(^1[3|5|8][0-9]{9}$)/.test(  value ) ){ 
            return errorMsg; 
        }
    }
}

```

接下来我们准备实现 Validator 类。Validator 类在这里作为 Context，负责接收用户的请求并委托给 strategy 对象。在给出 Validator 类的代码之前，有必要提前了解用户是如何向 Validator类发送请求的，这有助于我们知道如何去编写 Validator 类的代码。代码如下：

``` js
var validataFunc = function() {
    var validator = new Validator();

    validator.add( registerForm.userName, 'isNonEmpty', '用户名不能为空');
    validator.add( registerForm.password, 'minLength:8', '密码长度不能小于八位');
    validator.add( registerForm.userName, 'phoneNumber', '手机号码格式不正确');

    var result = validator.start();
    return errorMsg;
}

var registerForm = document.getElementById('registerForm');
registerForm.onsubmit = function() {
    var errorMsg = validataFunc();
    if(errorMsg) {
        aller(errorMsg);
        return false;
    }
}
```

最后是 Validator 类的实现：

``` js
var Validator = function {
    this.cache = []
}

Validator.prototype.add = function( dom, rule, errorMsg ) {
    var ary = rule.split(':');
    this.cache.push(function(){
        var strategy = ary.shift();
        ary.unshift( dom.value) ;
        ary.push( errorMsg );
        return strategies[ strategy ].apply( dom, ary );
    })
}

Validator.prototype.start = function() {
    for(var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
        var msg = validatorFunc();
        if(msg) {
            return msg
        }
    }
}
```

使用策略模式重构代码之后，我们仅仅通过“配置”的方式就可以完成一个表单的校验，
这些校验规则也可以复用在程序的任何地方，还能作为插件的形式，方便地被移植到其他项
目中。
在修改某个校验规则的时候，只需要编写或者改写少量的代码。比如我们想将用户名输入框
的校验规则改成用户名不能少于 4 个字符。可以看到，这时候的修改是毫不费力的。代码如下：

``` js
validator.add( registerForm.userName, 'isNonEmpty', '用户名不能为空' ); 
// 改成：
validator.add( registerForm.userName, 'minLength:10', '用户名长度不能小于 10 位' );


```

## 策略模式的优缺点
策略模式是一种常用且有效的设计模式，本章提供了计算奖金、缓动动画、表单校验这三个
例子来加深大家对策略模式的理解。从这三个例子中，我们可以总结出策略模式的一些优点。
- 策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句。
- 策略模式提供了对开放—封闭原则的完美支持，将算法封装在独立的 strategy 中，使得它
们易于切换，易于理解，易于扩展。
- 策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作。
- 在策略模式中利用组合和委托来让 Context 拥有执行算法的能力，这也是继承的一种更轻
便的替代方案。
当然，策略模式也有一些缺点，但这些缺点并不严重。
首先，使用策略模式会在程序中增加许多策略类或者策略对象，但实际上这比把它们负责的
逻辑堆砌在 Context 中要好。
其次，要使用策略模式，必须了解所有的 strategy，必须了解各个 strategy 之间的不同点，
这样才能选择一个合适的 strategy。比如，我们要选择一种合适的旅游出行路线，必须先了解选
择飞机、火车、自行车等方案的细节。此时 strategy 要向客户暴露它的所有实现，这是违反最少
知识原则的。 