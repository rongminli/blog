# 手写`reactive(obj)`和`watchEffect(fn)`

话不多说，我们直接开始。

## 第一步 我们想要做什么？

我们知道，`reactive(obj)`接收一个对象作为参数，并返回这个对象的一个代理，当我通过这个代理更改这个对象的属性的值的时候，这个对象的“副作用（Effect)”将会被触发，就像下面的代码展示的那样。

```js
// 这是我们的状态对象。
const state = {
    count: 0
}
// 通过reactive()函数得到一个状态对象的一个响应式代理。
const reactivityState = reactive({
    count: 0
})
// 通过watchEffect()函数将一个函数注册为副作用。
watchEffect(() => {
    console.log(`目前count的值为：${reactivityState.count}`)
})

// 更改state的值会触发副作用。
state.count++
```

在vue中，调用上面的`watchEffect(fn)`函数时，`watchEffect(fn)`函数内部将执行一次我们所传入的函数，**并把我们所传入的函数当作一个“副作用”注册到我们的函数内部所访问到的所有响应式属性当中去**。这句话有点长有点拗口，不过我们慢慢来。

现在我们知道的是：

1. `reactive(obj)`将返回给定对象的一个代理，当你通过这个代理访问它的属性时，这个代理将收集当前所访问的属性的“副作用”，当你通过这个代理更改它的属性值时，这个代理将触发之前收集到的该属性的“副作用”。
2. `watchEffect(fn)`函数将会把函数`fn`作为“副作用”，注册到其内部所访问到的所有响应式属性中。

## 第二步 我们该怎么做？

通过ES6的`Proxy`代理对象，我们可以拦截对目标对象的访问和修改，示例代码如下：

```js
const state = {
        count: 0
    }

const proxy = new Proxy(state, {
    get(target, prop, receiver) {
        console.log(`拦截到对目标对象属性值为${prop}的访问。`)
        return target[prop]
    },
    set(target, prop, value) {
        console.log(`拦截到对目标对象属性值为${prop}的修改，新的值为${value}。`)
    }
})

proxy.count     // ->拦截到对目标对象属性值为count的访问。
proxy.count++   // -> 拦截到对目标对象属性值为count的访问。(修改之前要先访问一下)
                // -> 拦截到对目标对象属性值为count的修改，新的值为1。
```

我们把上面的代码整理到`reactive()`函数里面：

``` js
function reactive(target) {
    return new Proxy(target, {
        get(target, prop, receiver) {
            console.log(`拦截到对目标对象属性值为${prop}的访问。`)
            return target[prop]
        },
        set(target, prop, value) {
            console.log(`拦截到对目标对象属性值为${prop}的修改，新的值为${value}。`)
        }
    })
}

const state = {
        count: 0
    }
const reactivityState = reactive(state)
reactivityState.count     // ->拦截到对目标对象属性值为count的访问。
reactivityState.count++   // -> 拦截到对目标对象属性值为count的访问。(修改之前要先访问一下)
                          // -> 拦截到对目标对象属性值为count的修改，新的值为1。
```

我们已经知道了如何拦截对象的访问了，那么我们要怎么收集依赖呢？

Vue是通过把“副作用”函数放到一个约定好的位置来收集的。代码如下：

```js
// 当有“副作用”需要收集时，放到这里。
let currentEffect = null

```

收集到的依赖怎么存放呢？Vue把它放到了一个`WeakMap`中：

```js
// 收集到的依赖放到这里
const targetEffectMap = new WeekMap()
```

## 第三步 开始实现

`watchEffect(fn)`函数很简单，就像这样：

``` js
let currentEffect = null
function watchEffect(fn) {
    currentEffect = fn  // 先把函数放到约定的地方
    fn()
}
```

先把`fn`放到约定好的地方，然后调用`fn`。

接下来我们来完成`reactive(obj)`函数：

``` js
const targetEffectMap = new WeekMap()
let currentEffect = null

function reactive(target) {
    return new Proxy(target, {
        get(target, prop, receiver) {
            console.log(`拦截到对目标对象属性值为${prop}的访问,开始收集依赖。`)
            // 收集依赖
            if (currentEffect !== null) {
                let propEffectMap = targetEffectMap.get(target)
                if (!propEffectMap) {
                    // 这里还是一个Map，用来存放具体prop的effect数组
                    propEffectMap = new Map()
                    targetEffectMap.set(target, propEffectMap)
                }
                let propEffectArray = propEffectMap.get(prop)
                if (!propEffectArray) {
                    propEffectArray = []
                    propEffectMap.set(prop, propEffectArray)
                }
                propEffectArray.push(currentEffect)
                currentEffect = null
            }
            return target[prop]
        },
        set(target, prop, value) {
            console.log(`拦截到对目标对象属性值为${prop}的修改,新的值为${value},尝试触发副作用。`)
            target[prop] = value

            //寻找并触发全部的依赖
            let propEffectMap = targetEffectMap.get(target)
            if (!propEffectMap) {
                return
            }
            let propEffectArray = propEffectMap.get(prop)
            if (propEffectArray) {
                propEffectArray.forEach(effect => {
                    effect()
                })
            }
        }
    })
}
```

还是那句老话，在get时收集依赖，在set时触发依赖。

这样一个简单的响应式功能就这样完成了，当然Vue的源码比这个复杂的多，但是基本的过程就是这样的。

以下是全部的代码：

``` js
let currentEffect = null
const targetEffectMap = new WeakMap()

function reactive(target) {
    return new Proxy(target, {
        get(target, prop, receiver) {
            console.log(`拦截到对目标对象属性值为${prop}的访问,开始收集依赖。`)
            // 收集依赖
            if (currentEffect !== null) {
                let propEffectMap = targetEffectMap.get(target)
                if (!propEffectMap) {
                    propEffectMap = new Map()
                    targetEffectMap.set(target, propEffectMap)
                }
                let propEffectArray = propEffectMap.get(prop)
                if (!propEffectArray) {
                    propEffectArray = []
                    propEffectMap.set(prop, propEffectArray)
                }
                propEffectArray.push(currentEffect)
                currentEffect = null
            }
            return target[prop]
        },
        set(target, prop, value) {
            console.log(`拦截到对目标对象属性值为${prop}的修改,新的值为${value},尝试触发副作用`)
            target[prop] = value

            //寻找并触发全部的依赖
            let propEffectMap = targetEffectMap.get(target)
            if (!propEffectMap) {
                return
            }
            let propEffectArray = propEffectMap.get(prop)
            if (propEffectArray) {
                propEffectArray.forEach(effect => {
                    effect()
                })
            }
        }
    })
}

function watchEffect(fn) {
    currentEffect = fn  // 先把函数放到约定的地方
    fn()
}

const state = {
    count: 0
}

const reactivityState = reactive(state)

watchEffect(() => {
    console.log(`这里是副作用函数，当前count的值是${state.count}。`)
})

reactivityState.count++   
                              
// -> 这里是副作用函数，当前count的值是0
// -> 拦截到对目标对象属性值为count的访问。
// -> 拦截到对目标对象属性值为count的访问。
// -> 拦截到对目标对象属性值为count的修改，新的值为1。
// -> reactive.html:105 这里是副作用函数，当前count的值是1
```
