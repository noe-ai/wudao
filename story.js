window.storySystem = {
    // 序章
    prologue: {
        text: `传说，上古有仙。
        
        他们御剑飞行，追逐云霞；炼丹修道，寻求长生；参悟天机，洞察万物。
        
        然而，仙路断绝已久，世间早已不见真仙踪迹。
        
        直到那一夜，你在老梅树下打坐，忽见一道微光落入掌心...
        
        这一刻，你仿佛听到了天地大道的呼唤。
        
        修仙之路漫漫，从此刻启程。`,
        image: 'prologue'
    },

    // 日常事件
    dailyEvents: {
        '打坐': [
            {
                text: "远处传来阵阵钟声，让你的心神格外宁静...",
                effect: "神识提升",
                spirit: 10,
                image: 'meditation'
            },
            {
                text: "一缕阳光洒在你身上，温暖而不炙热...",
                effect: "修为提升",
                power: 15,
                image: 'meditation'
            },
            {
                text: "一只蝴蝶落在你肩头，与你同享这份宁静...",
                effect: "双重提升",
                power: 10,
                spirit: 5,
                image: 'meditation'
            },
            {
                text: "微风轻拂，带来远处青竹的沙沙声...",
                effect: "小有收获",
                power: 5,
                image: 'meditation'
            },
            {
                text: "云层中透出一缕金光，恰好笼罩在你身上...",
                effect: "修为提升",
                power: 12,
                image: 'meditation'
            },
            {
                text: "清晨的露珠滴落在草叶上，发出轻微的响声...",
                effect: "心神宁静",
                spirit: 8,
                image: 'meditation'
            },
            {
                text: "你静静地感受着天地间流动的灵气...",
                effect: "稳步提升",
                power: 8,
                image: 'meditation'
            }
        ],

        '习武': [
            {
                text: "一片树叶随风飘落，让你领悟了轻身之法...",
                effect: "体魄提升",
                strength: 10,
                image: 'practice'
            },
            {
                text: "看到竹子在风中摇曳，你明白了以柔克刚...",
                effect: "全面提升",
                power: 10,
                strength: 8,
                image: 'practice'
            },
            {
                text: "一群飞鸟掠过天际，让你想到了剑阵变化...",
                effect: "修为提升",
                power: 15,
                image: 'practice'
            },
            {
                text: "你专注地重复着招式，渐入佳境...",
                effect: "基础提升",
                power: 8,
                image: 'practice'
            },
            {
                text: "汗水滴落在地上，你依然沉浸在修炼中...",
                effect: "体魄增强",
                strength: 6,
                image: 'practice'
            },
            {
                text: "晨露打湿了衣衫，却丝毫不影响你的练习...",
                effect: "稳步提升",
                power: 7,
                image: 'practice'
            }
        ],

        '采药': [
            {
                text: "你发现了一株普通的药草，或许对修炼有帮助...",
                items: { '灵草': 1 },
                image: 'gathering'
            },
            {
                text: "山涧处有一簇不知名的灵芝，散发着淡淡药香...",
                items: { '灵草': 2 },
                image: 'gathering'
            },
            {
                text: "遇到一位采药老人，教了你一些辨药之法...",
                items: { '灵草': 1 },
                spirit: 5,
                image: 'gathering'
            },
            {
                text: "你安静地寻找着药草的踪迹...",
                effect: "专注修炼",
                power: 5,
                image: 'gathering'
            },
            {
                text: "清晨的露水打湿了草药的叶子...",
                effect: "继续搜寻",
                power: 3,
                image: 'gathering'
            },
            {
                text: "一只小鸟叼来一片奇特的树叶...",
                items: { '灵草': 1 },
                spirit: 3,
                image: 'gathering'
            },
            {
                text: "你在老树根下发现了几株珍贵的药草...",
                items: { '灵草': 2 },
                image: 'gathering'
            }
        ],

        '寻宝': [
            {
                text: "溪水冲刷下露出一块温润的玉石...",
                items: { '灵石': 2 },
                image: 'treasure'
            },
            {
                text: "一只小狐狸留下了一颗晶莹的珠子...",
                items: { '灵石': 3 },
                image: 'treasure'
            },
            {
                text: "你在山洞中发现了一个布满灰尘的木箱，里面放着一颗丹药...",
                items: { '灵石': 5, '丹药': 1 },
                image: 'treasure'
            },
            {
                text: "一块石壁后露出一个暗格，里面放着一件古旧的法器...",
                items: { '灵石': 3, '法器': 1 },
                image: 'treasure'
            },
            {
                text: "你意外发现了一处隐秘的药园遗迹...",
                items: { '灵石': 4, '丹药': 2 },
                image: 'treasure'
            }
        ]
    }
};

