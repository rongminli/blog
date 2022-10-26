---
sidebar: auto
---

# Rust
## [第六章 枚举和模式匹配](rust/6.enums_and_pattern_matching.md)  

## [第八章 常用集合](rust/8.common_collections.md)  
rust标准库中包含一些非常有用的集合数据类型。大多数其他的数据类型表示一个特定的值，但是集合可以包含多个值。与内建的array和tuple类型不同，集合类型的数据储存在堆中，这意味着集合里面的数据量可以在运行时增加或者减少。不同的集合类型拥有不同的功能和性能。在本章中，我们将讨论三个十分常用的集合类型。
- vector 以连续的方式存储多个值
- string 是字符的集合。之前我们见过这个类型，本章我们将进一步讨论它。
- 用hash map你可以在一个值和另一个值之间建立联系。它是另一个更通用的数据类型map的一个特殊实现。

本章我们将讨论如何创建和更新vector、string和hash map，以及它们的特殊之处。

可一个查看[官方文档](https://doc.rust-lang.org/std/collections/index.html)来学习标准库中提供的其他集合类型。 
