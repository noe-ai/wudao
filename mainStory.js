window.mainStory = {
    // 主线剧情触发条件
    triggerRules: {
        'first_enlightenment': {
            condition: { power: 100 },  // 修为达到100时触发启蒙剧情
            prerequisite: null
        },
        'qi_early': {
            condition: { power: 500 },  // 修为达到500时触发练气初期剧情
            prerequisite: 'first_enlightenment'
        },
        'qi_middle': {
            condition: { power: 1000 }, // 修为达到1000时触发
            prerequisite: 'qi_early'
        },
        'qi_late': {
            condition: { power: 2000 }, // 修为达到2000时触发
            prerequisite: 'qi_middle'
        },
        'foundation': {
            condition: { power: 3000 }, // 修为达到3000时触发
            prerequisite: 'qi_late'
        },
        'golden_core': {
            condition: { power: 5000 }, // 修为达到5000时触发
            prerequisite: 'foundation'
        }
    },

    // 剧情内容
    stories: {
        'first_enlightenment': {
            title: "凡人启蒙",
            scenes: [
                {
                    text: `你静坐在老梅树下，回想着这段时间的修炼。

忽然，一阵清风拂过，梅花随风飘落。就在这一刻，你感觉到体内似有一丝异样的感觉...`,
                    image: 'mortal',
                    choices: [
                        { text: '细细体会', nextScene: 1 },
                        { text: '静心感受', nextScene: 1 }
                    ]
                },
                {
                    text: `那是一种前所未有的感觉，仿佛有一股暖流在体内缓缓流动。

这就是传说中的"灵气"吗？你终于迈出了修仙的第一步！`,
                    image: 'mortal',
                    choices: [{
                        text: '领悟',
                        reward: {
                            spirit: 50,
                            power: 50,
                            description: '获得启蒙感悟'
                        }
                    }]
                }
            ]
        },

        'qi_early': {
            title: "练气初期",
            scenes: [
                {
                    text: `经过不断修炼，你已经能够清晰地感知到体内的灵气流动。

某日清晨，你忽然发现灵气在体内形成了一个小小的漩涡...`,
                    image: 'qi_early',
                    choices: [{
                        text: '继续',
                        reward: {
                            power: 100,
                            spirit: 50,
                            description: '进入练气初期'
                        }
                    }]
                }
            ]
        },

        'qi_middle': {
            title: "练气中期",
            scenes: [
                {
                    text: `随着修为的提升，你对灵气的掌控越来越纯熟。

这天打坐时，你忽然感觉到周围的灵气开始主动向你聚集...`,
                    image: 'qi_middle',
                    choices: [{
                        text: '突破',
                        reward: {
                            power: 200,
                            spirit: 100,
                            description: '晋升练气中期'
                        }
                    }]
                }
            ]
        },

        'qi_late': {
            title: "练气后期",
            scenes: [
                {
                    text: `你的修为已经达到了练气期的巅峰。

体内的灵气越发充盈，经脉中传来阵阵胀痛，仿佛在预示着某种突破...`,
                    image: 'qi_late',
                    choices: [{
                        text: '突破',
                        reward: {
                            power: 300,
                            spirit: 150,
                            description: '晋升练气后期'
                        }
                    }]
                }
            ]
        },

        'foundation': {
            title: "筑基期",
            scenes: [
                {
                    text: `多年苦修，你终于触及到了更高的境界。

丹田中的灵气开始凝结成一个金色的小球，这是筑基的征兆！`,
                    image: 'foundation',
                    choices: [{
                        text: '突破',
                        reward: {
                            power: 500,
                            spirit: 200,
                            description: '晋升筑基期'
                        }
                    }]
                }
            ]
        },

        'golden_core': {
            title: "金丹期",
            scenes: [
                {
                    text: `经过漫长的积累，你终于迎来了质的飞跃。

丹田中的金色小球开始剧烈震动，一股强大的力量即将喷薄而出...`,
                    image: 'golden_core',
                    choices: [{
                        text: '突破',
                        reward: {
                            power: 1000,
                            spirit: 500,
                            description: '晋升金丹期'
                        }
                    }]
                }
            ]
        }
    }
}; 