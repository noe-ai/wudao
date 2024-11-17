window.specialEvents = {
    // 特殊事件触发条件
    triggerRules: {
        minLevel: '练气初期'
    },

    // 特殊事件列表
    events: {
        'whispers_wind': {
            title: "风中絮语",
            condition: { level: '练气初期', spirit: 100 },
            text: `山风拂过，带来缥缈的絮语。你凝神静气，试图捕捉那若隐若现的话语，隐约听到"秘境"、"月圆"之类的字眼...`,
            choices: [
                {
                    text: "凝神倾听（消耗10灵石）",
                    cost: { 灵石: 10 },
                    risk: 0.5,
                    success: {
                        text: "你屏气凝神，将灵石捏碎，借其灵气增强感知。渐渐地，那缥缈的话语在耳边清晰起来：'月圆之夜，叩击古树三下，自有玄机'",
                        reward: { 
                            spirit: 100,
                            description: "获得神秘指引"
                        }
                    },
                    failure: {
                        text: "山风陡然变大，那缥缈的话语消散在呼啸的风声中。你徒劳地想要分辨，却只觉心神俱疲",
                        penalty: { 
                            spirit: -20,
                            description: "心神消耗"
                        }
                    }
                },
                {
                    text: "记下感悟",
                    reward: { 
                        spirit: 30,
                        description: "留下一些灵感" 
                    }
                }
            ]
        },

        'ancient_reflection': {
            title: "水中倒影",
            condition: { level: '练气中期', spirit: 300 },
            text: `山涧清澈见底，水面平如镜。忽然，一道奇异的波纹泛起，水中倒影竟凝成一道古老的手印。你心中一动，似乎察觉到其中蕴含的玄机...`,
            choices: [
                {
                    text: "以灵石引气（消耗20灵石）",
                    cost: { 灵石: 20 },
                    risk: 0.6,
                    success: {
                        text: "灵石化作一缕缕灵气，随着你的手印流转。水面忽然泛起金光，一股玄妙的感悟涌入心神，仿佛打开了新的修行之门",
                        reward: {
                            power: 200,
                            spirit: 100,
                            description: "领悟水镜功法"
                        }
                    },
                    failure: {
                        text: "手印刚结到一半，一股反噬之力突然袭来。你只觉经脉剧痛，体内灵力逆流，水中倒影也随之破碎",
                        penalty: {
                            power: -50,
                            spirit: -30,
                            description: "灵力逆流"
                        }
                    }
                },
                {
                    text: "默记手印",
                    reward: {
                        spirit: 50,
                        description: "记住手印变化"
                    }
                }
            ]
        },

        'stone_scripture': {
            title: "石壁天书",
            condition: { level: '练气后期', spirit: 800 },
            text: `山腹中发现一面古老石壁，上面刻满密密麻麻的符文。
            
            "欲解此法，需以灵石三十枚祭炼..."`,
            choices: [
                {
                    text: "祭炼符文（消耗30灵石）",
                    cost: { 灵石: 30 },
                    risk: 0.7,
                    success: {
                        text: "符文光芒大作，化作一道道玄奥信息烙印心神：'天地有五行，周而复始，变化无穷...'",
                        reward: {
                            power: 300,
                            spirit: 150,
                            description: "领悟五行变化之术"
                        }
                    },
                    failure: {
                        text: "符文太过深奥，一时难以参透...",
                        penalty: { spirit: -50 }
                    }
                },
                {
                    text: "仔细研究",
                    reward: {
                        spirit: 80,
                        description: "理解部分符文"
                    }
                }
            ]
        },

        'immortal_remnant': {
            title: "仙人遗府",
            condition: { level: '练气后期', power: 1000 },
            text: `你发现一处隐秘洞府，门前有一个蒙尘的阵盘。
            
            阵盘上刻着："五十灵石启阵，得我毕生所学..."`,
            choices: [
                {
                    text: "激活阵盘（消耗50灵石）",
                    cost: { 灵石: 50 },
                    risk: 0.5,
                    success: {
                        text: "阵盘光芒万丈，一道神识传承涌入脑海：'吾观天地之道，悟长生之法，今传与有缘人...'",
                        reward: {
                            power: 400,
                            spirit: 200,
                            description: "获得仙人传承"
                        }
                    },
                    failure: {
                        text: "阵盘年代太久，传承残缺不全...",
                        penalty: { power: -100 }
                    }
                },
                {
                    text: "查看洞府",
                    reward: {
                        spirit: 50,
                        description: "获得一些线索"
                    }
                }
            ]
        }
    },

    // 特殊事件历史记录
    history: new Map()
};