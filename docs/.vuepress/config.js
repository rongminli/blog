module.exports = {
    extendMarkdown(md) {
        md.set({ html: true });
        md.use(require("markdown-it-katex"));
    },
    head: [
        ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css' }],
        ['link', { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css" }]
    ],
    base: '/blog/',
    title: 'LRM的笔记',
    description: 'Just playing around',
    themeConfig: {
        sidebar: {
            '/vue/': [
                {
                    title: '手写`reactive(obj)`和`watchEffect(fn)`',
                    path: 'reactivity/reactive.md'
                },
            ],
            '/rust/': [
                {
                    title: '第六章 枚举和模式匹配',
                    path: '/rust/6_enums_and_pattern_matching/index',
                    children: [
                        {
                            title: '6.1 枚举的创建和Option<T>',
                            path: '6_enums_and_pattern_matching/6.1_define_an_enum',
                        },
                        {
                            title: '6.2 匹配控制流结构',
                            path: '6_enums_and_pattern_matching/6.2_The_match_control_flow_construct',
                        },
                        {
                            title: '6.3 简明控制流if let',
                            path: '6_enums_and_pattern_matching/6.3_concise_control_flow_with_if_let.md'

                        }
                    ],
                },
                {
                    title: '第六章 常用集合',
                    path: '/rust/8_common_collections/index',
                    children: [
                        {
                            title: '8.1 使用Vector来存储列表',
                            path: '8_common_collections/8.1_stores_list_with_vector',
                        },
                    ],
                },
            ],
            '/language/': [
                {
                    title: 'Null: 价值百亿的错误',
                    path: 'Null_The_Mistake'
                }
            ],
            '/design_pattern/': [
                {
                    title: '单例模式',
                    path: 'singleton'
                },
                {
                    title: '策略模式',
                    path: 'strategy'
                },
                {
                    title: '发布订阅模式（观察者模式)',
                    path: 'observer'
                }
            ],
            '/browser/': [
                {
                    title: '浏览器加载过程',
                    path: 'page_load'
                },
                {
                    title: "浏览器架构",
                    path: "multi_process"
                }
            ],
            '/ai/': [
                {
                    title: '什么是机器学习？',
                    path: 'what_is_machine_leaning'
                },
            ],
            '/algorithm/': [
                {
                    title: '排序算法',
                    path: 'sort.md'
                },
                {
                    title: '最大子数组',
                    path: 'max_subarray.md'
                },
            ]
        },
        sidebarDepth: 2,
    },
    markdown: {
        lineNumbers: true
    }
}