---
sidebar: auto
---

# 我的博客

## 设计模式
### [单例模式](design_pattern/singleton.md)

### [策略模式](design_pattern/strategy.md)

### [发布订阅模式（观察者模式)](design_pattern/observer.md)

## Rust
### [第六章 枚举和模式匹配](rust/6_enums_and_pattern_matching/6.1_define_an_enum)  
本章我们将讨论枚举。枚举允许你通过例举类型可能的变体来定义类型。首先，我们定义并使用一个枚举来演示enum如何表示数据的意义。下一步我们将探索一个特别有用的枚举，叫做`Option`,它表示一个值可能是某种东西或者什么也不是。然后我们将看看如何使用`match`进行模式匹配，从而轻松的根据一个enum的不同值去执行不同的代码。最后，我们将介绍if let构造如何成为在代码中处理枚举的另一个方便而简洁的习惯用法。


### [第八章 常用集合](rust/8_common_collections/8.1_stores_list_with_vector)  
rust标准库中包含一些非常有用的集合数据类型。大多数其他的数据类型表示一个特定的值，但是集合可以包含多个值。与内建的array和tuple类型不同，集合类型的数据储存在堆中，这意味着集合里面的数据量可以在运行时增加或者减少。不同的集合类型拥有不同的功能和性能。在本章中，我们将讨论三个十分常用的集合类型。
- vector 以连续的方式存储多个值
- string 是字符的集合。之前我们见过这个类型，本章我们将进一步讨论它。
- 用hash map你可以在一个值和另一个值之间建立联系。它是另一个更通用的数据类型map的一个特殊实现。

本章我们将讨论如何创建和更新vector、string和hash map，以及它们的特殊之处。

可一个查看[官方文档](https://doc.rust-lang.org/std/collections/index.html)来学习标准库中提供的其他集合类型。 

## 编程语言
### [编程语言中的null值问题](language/Null_The_Mistak.md)

## 浏览器
### [网页加载过程](browser/page_load.md)
### [多进程架构](browser/multi_process.md)

