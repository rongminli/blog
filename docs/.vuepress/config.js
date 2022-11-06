module.exports = {
    base: '/blog/',
    title: 'LRM的博客',
    description: 'Just playing around',
    themeConfig: {
        sidebar: {
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
            ]

        },
        sidebarDepth: 2,
    },
    markdown: {
        lineNumbers: true
    }
}