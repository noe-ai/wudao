class Game {
    constructor() {
        this.state = {
            power: 0,
            spirit: 0,
            strength: 0,
            level: '凡人',
            items: {
                灵石: 0,
                灵草: 0,
                法器: 0,
                丹药: 0
            },
            completedStories: new Set(),
            currentStory: null
        };
        
        this.levelThresholds = {
            '凡人': 0,// mortal.jpg
            '练气初期': 100,//qi_early.jpg
            '练气中期': 500,// qi_middle.jpg
            '练气后期': 1000,// qi_late.jpg
            '筑基期': 2000,// foundation.jpg
            '金丹期': 5000// golden_core.jpg
        };

        this.images = {
            meditation: './images/meditation.jpg',
            practice: './images/practice.jpg',
            gathering: './images/gathering.jpg',
            treasure: './images/treasure.jpg',
            battle_beast: './images/battle_beast.jpg',
            battle_monster: './images/battle_monster.jpg',
            battle_evil: './images/battle_evil.jpg',
            battle_victory: './images/battle_victory.jpg',
            battle_defeat: './images/battle_defeat.jpg',
            levelup: './images/levelup.jpg',
            prologue: './images/prologue.jpg',
            first_enlightenment: './images/first_enlightenment.jpg',
            qi_enlightenment: './images/qi_enlightenment.jpg',
            cave_discovery: './images/cave_discovery.jpg',
            master_meeting: './images/master_meeting.jpg',
            foundation_building: './images/foundation_building.jpg',
            golden_core: './images/golden_core.jpg',
            mortal: './images/mortal.jpg',
            qi_early: './images/qi_early.jpg',
            qi_middle: './images/qi_middle.jpg',
            qi_late: './images/qi_late.jpg',
            foundation: './images/foundation.jpg',
            golden_core: './images/golden_core.jpg'
        };

        this.loadedImages = new Set();

        this.items = {
            '灵石': { type: 'currency', description: '修仙界通用货币' },
            '灵草': { 
                type: 'healing', 
                effect: { strength: 5 }, 
                description: '服用后可提升体魄'
            },
            '丹药': { 
                type: 'buff', 
                effect: { power: 20, spirit: 10 }, 
                description: '服用后可提升修为和神识'
            },
            '法器': { 
                type: 'weapon', 
                effect: { attack: 30 }, 
                description: '装备后可提升战斗力'
            }
        };

        this.battleState = null;

        this.STORY_TRIGGERS = {
            'first_enlightenment': {
                condition: { level: '凡人', spirit: 50 },
                description: '当神识达到50时触发启蒙剧情'
            },
            'qi_enlightenment': {
                condition: { level: '练气初期', power: 100 },
                description: '当修为达到100时触发练气入门剧情'
            },
            'cave_discovery': {
                condition: { level: '练气中期', power: 600 },
                description: '当修为达到600时触发洞府剧情'
            },
            'master_meeting': {
                condition: { level: '练气后期', power: 1000 },
                description: '当修为达到1000时触发遇师剧情'
            },
            'foundation_building': {
                condition: { level: '练气后期', power: 2000 },
                description: '当修为达到2000时触发筑基剧情'
            },
            'golden_core': {
                condition: { level: '筑基期', power: 5000 },
                description: '当修为达到5000时触发金丹剧情'
            }
        };

        this.mainStoryOrder = [
            'first_enlightenment',   
            'qi_enlightenment',      
            'cave_discovery',        
            'master_meeting',        
            'foundation_building',   
            'golden_core'           
        ];

        this.currentMainStoryIndex = 0;

        this.actionImages = {
            '打坐': 'meditation',
            '习武': 'practice',
            '采药': 'gathering',
            '寻宝': 'treasure'
        };
    }

    async initializeGame() {
        try {
            // 1. 加载图片
            await this.preloadImages();
            
            // 2. 加载游戏存档
            this.loadGame();
            
            // 3. 初始化界面和事件
            this.initializeUI();
            this.initializeBagAndBattle();
            
            // 4. 显示序章
            this.startPrologue();
            
            // 5. 更新界面
            this.updateUI();
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    initializeUI() {
        document.getElementById('meditate').onclick = () => this.performAction('打坐');
        document.getElementById('practice').onclick = () => this.performAction('习武');
        document.getElementById('gather').onclick = () => this.performAction('采药');
        document.getElementById('explore').onclick = () => this.performAction('寻宝');
        document.getElementById('reset-game').onclick = () => {
            if (confirm('确定要重置游戏吗？所有进度将丢失')) {
                localStorage.removeItem('gameState');
                this.state = this.getDefaultState();
                this.updateUI();
                this.startPrologue();
            }
        };
        this.updateUI();
    }

    updateUI() {
        // Ensure values are numbers and not NaN
        this.state.power = Number(this.state.power) || 0;
        this.state.spirit = Number(this.state.spirit) || 0;
        this.state.strength = Number(this.state.strength) || 0;

        document.getElementById('power').textContent = Math.floor(this.state.power);
        document.getElementById('spirit').textContent = Math.floor(this.state.spirit);
        document.getElementById('strength').textContent = Math.floor(this.state.strength);
        document.getElementById('level').textContent = this.state.level;

        // Ensure item values are numbers
        Object.keys(this.state.items).forEach(key => {
            this.state.items[key] = Number(this.state.items[key]) || 0;
        });

        document.getElementById('lingshi').textContent = this.state.items.灵石;
        document.getElementById('lingcao').textContent = this.state.items.灵草;
        document.getElementById('faqi').textContent = this.state.items.法器;
        document.getElementById('danyao').textContent = this.state.items.丹药;

        this.checkStoryTriggers();
    }

    saveGame() {
        const saveState = {
            ...this.state,
            completedStories: Array.from(this.state.completedStories),
            currentMainStoryIndex: this.currentMainStoryIndex
        };
        localStorage.setItem('gameState', JSON.stringify(saveState));
    }

    loadGame() {
        try {
            const savedState = localStorage.getItem('gameState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                this.state = {
                    ...parsedState,
                    completedStories: new Set(parsedState.completedStories)
                };
                
                this.currentMainStoryIndex = parsedState.currentMainStoryIndex || 0;
                
                // Ensure numeric values
                this.state.power = Number(this.state.power) || 0;
                this.state.spirit = Number(this.state.spirit) || 0;
                this.state.strength = Number(this.state.strength) || 0;
                
                Object.keys(this.state.items).forEach(key => {
                    this.state.items[key] = Number(this.state.items[key]) || 0;
                });
            }
        } catch (error) {
            console.error('Failed to load game:', error);
            this.state = this.getDefaultState();
            this.currentMainStoryIndex = 0;
        }
    }

    getDefaultState() {
        return {
            power: 0,
            spirit: 0,
            strength: 0,
            level: '凡人',
            items: {
                灵石: 0,
                灵草: 0,
                法器: 0,
                丹药: 0
            },
            completedStories: new Set(),
            currentStory: null,
            currentMainStoryIndex: 0
        };
    }

    startPrologue() {
        const prologue = window.storySystem.prologue;
        if (!this.state.completedStories.has('prologue')) {
            // 直接显示序章文本和图片
            const storyPanel = document.getElementById('story-text');
            const imagePanel = document.getElementById('story-image');
            
            // 显示序章文本
            storyPanel.innerHTML = prologue.text;
            
            // 显示序章图片
            if (prologue.image) {
                this.showImage(prologue.image, imagePanel);
            }
            
            // 标记序章为已完成
            this.state.completedStories.add('prologue');
            this.saveGame();
        }
    }

    showStory(story) {
        const storyPanel = document.getElementById('story-text');
        const choicesPanel = document.getElementById('choices');
        const imagePanel = document.getElementById('story-image');

        // 设置图片
        if (story.image) {
            this.showImage(story.image, imagePanel);
        } else {
            imagePanel.style.display = 'none';
        }

        // 显示文本
        storyPanel.innerHTML = story.text;
        choicesPanel.innerHTML = '';

        // 如果有选择钮且不是序章，才显示按钮
        if (story.choices && story.choices.length > 0 && this.currentStory) {
            story.choices.forEach(choice => {
                const button = document.createElement('button');
                button.textContent = choice.text;
                button.onclick = () => this.makeChoice(choice);
                choicesPanel.appendChild(button);
            });
        }
    }

    makeChoice(choice) {
        if (this.currentStory && choice.nextScene !== undefined) {
            const nextScene = this.currentStory.scenes[choice.nextScene];
            if (nextScene) {
                this.currentStory.currentScene = choice.nextScene;
                this.showStory({
                    ...nextScene,
                    image: this.currentStory.id
                });
                return;
            } else if (choice.reward) {
                // 剧情结束
                this.state.completedStories.add(this.currentStory.id);
                this.currentMainStoryIndex++;
                
                // 应用奖
                Object.entries(choice.reward).forEach(([stat, value]) => {
                    if (stat !== 'description' && typeof value === 'number') {
                        this.state[stat] = (Number(this.state[stat]) || 0) + value;
                    }
                });

                // 隐藏线剧情面板
                document.getElementById('story-panel-main').classList.add('hidden');
                this.currentStory = null;
            }
        }

        if (choice.risk) {
            // 检查是否需要消耗灵石
            if (choice.cost && choice.cost.灵石) {
                if (this.state.items.灵石 < choice.cost.灵石) {
                    this.showStory({
                        text: `灵石不足，需要${choice.cost.灵石}灵石`,
                        choices: [{text: '继续'}]
                    });
                    return;
                }
                this.state.items.灵石 -= choice.cost.灵石;
            }

            const success = Math.random() > choice.risk;
            const result = success ? choice.success : choice.failure;
            
            if (success) {
                if (result.reward) {
                    Object.entries(result.reward).forEach(([stat, value]) => {
                        if (stat !== 'description') {
                            this.state[stat] = (Number(this.state[stat]) || 0) + value;
                        }
                    });
                }
            } else {
                if (result.penalty) {
                    Object.entries(result.penalty).forEach(([stat, value]) => {
                        this.state[stat] = (Number(this.state[stat]) || 0) + value;
                    });
                }
            }
            
            this.showStory({
                text: result.text,
                choices: [{text: '继续'}]
            });
        } else {
            // 处理普通选择效果
            if (choice.effect) {
                if (typeof choice.effect === 'string') {
                    this.showStory({
                        text: choice.effect,
                        choices: [{text: '继续'}]
                    });
                } else {
                    Object.entries(choice.effect).forEach(([stat, value]) => {
                        if (typeof value === 'number') {
                            this.state[stat] = (Number(this.state[stat]) || 0) + value;
                        }
                    });
                }
            }

            // 处理奖励
            if (choice.reward) {
                Object.entries(choice.reward).forEach(([stat, value]) => {
                    if (stat !== 'description' && typeof value === 'number') {
                        this.state[stat] = (Number(this.state[stat]) || 0) + value;
                    }
                });
            }

            this.checkLevelUp();
            this.updateUI();
            this.saveGame();
        }
    }

    performAction(action) {
        // 先检查战斗触发
        if (action === '采药' || action === '寻宝') {
            // 采药和寻宝时有20%几率触发战斗
            if (Math.random() < 0.2) {
                const enemies = [
                    {
                        name: '野兽',
                        hp: 100,
                        attack: 10,
                        rewards: { '灵石': 10, '灵草': 1 }
                    },
                    {
                        name: '妖兽',
                        hp: 200,
                        attack: 20,
                        rewards: { '灵石': 20, '灵草': 2 }
                    },
                    {
                        name: '邪修',
                        hp: 300,
                        attack: 30,
                        rewards: { '灵石': 30, '法器': 1 }
                    }
                ];
                
                const enemy = enemies[Math.floor(Math.random() * enemies.length)];
                this.startBattle(enemy);
                return;  // 遇到战斗时不继续执行后面的代码
            }
        }

        // 如果没有触发战斗，继续执行日常事件
        const events = window.storySystem.dailyEvents[action];
        const event = events[Math.floor(Math.random() * events.length)];
        
        // 先显示图片
        const imagePanel = document.getElementById('story-image');
        const imageId = this.actionImages[action];
        if (imageId) {
            // 先清除旧图片
            imagePanel.style.backgroundImage = 'none';
            imagePanel.style.display = 'none';
            
            // 显示新图片
            this.showImage(imageId, imagePanel);
        }
        
        // 格式化显示文本
        let displayText = event.text + '\n\n';  // 事件  本加两个换行
        
        // 添加效果和属性变化
        if (event.effect) {
            displayText += event.effect;
        }
        
        let changes = [];
        if (event.power) changes.push(`修为 +${event.power}`);
        if (event.spirit) changes.push(`神识 +${event.spirit}`);
        if (event.strength) changes.push(`体魄 +${event.strength}`);
        
        if (changes.length > 0) {
            displayText += '\n' + changes.join(' ');
        }

        // 添加物品信息
        if (event.items) {
            displayText += '\n\n';  // 物品信息前空两行
            Object.entries(event.items).forEach(([item, amount]) => {
                displayText += `${item} x${amount}`;  // 移除额外的换行
            });
        }

        // 显示事件文本
        const storyPanel = document.getElementById('story-text');
        storyPanel.innerHTML = displayText;

        // 应用效果前先检查当前属性值
        console.log('当前属性:', {
            power: this.state.power,
            spirit: this.state.spirit,
            strength: this.state.strength
        });

        // 应用效果
        if (event.power) {
            this.state.power = Math.floor(Number(this.state.power || 0) + Number(event.power));
            console.log(`修为变化: ${this.state.power}`);
        }
        if (event.spirit) {
            this.state.spirit = Math.floor(Number(this.state.spirit || 0) + Number(event.spirit));
        }
        if (event.strength) {
            this.state.strength = Math.floor(Number(this.state.strength || 0) + Number(event.strength));
        }

        // 检查境界提升
        this.checkLevelUp();
        
        // 应用物品效果
        if (event.items) {
            Object.entries(event.items).forEach(([item, amount]) => {
                this.state.items[item] = Number(this.state.items[item] || 0) + Number(amount);
            });
        }

        // 检查属性变化
        console.log('属性变化后:', {
            power: this.state.power,
            spirit: this.state.spirit,
            strength: this.state.strength
        });

        // 更新界面和检查剧情触发
        this.updateUI();
        this.checkLevelUp();
        this.checkStoryTriggers();
        this.checkSpecialEvents();  // 添加特殊事件检查
        this.saveGame();

        // 显示事件文本和效果
        let effectText = '';
        if (event.effect) {
            effectText = `\n\n${event.effect}`;
            if (event.power) effectText += `\n修为 +${event.power}`;
            if (event.spirit) effectText += `\n神识 +${event.spirit}`;
            if (event.strength) effectText += `\n体魄 +${event.strength}`;
        }

        this.showStory({
            text: event.text + effectText,
            image: this.actionImages[action],
            choices: [{text: ''}]
        });

        // 更新界面和保存
        this.checkLevelUp();
        this.updateUI();
        this.saveGame();
    }

    checkLevelUp() {
        console.log("检查境界提升 - 当前修为:", this.state.power); // 添加日志
        
        const levels = Object.entries(this.levelThresholds).sort((a, b) => b[1] - a[1]);
        for (const [level, threshold] of levels) {
            if (this.state.power >= threshold) {
                if (this.state.level !== level) {
                    console.log(`准备提升境界: ${this.state.level} -> ${level}`); // 添加日志
                    
                    const oldLevel = this.state.level;
                    this.state.level = level;
                    
                    // 显示境界提升画面
                    const storyPanel = document.getElementById('story-text');
                    const imagePanel = document.getElementById('story-image');
                    
                    // 先显示文本
                    storyPanel.innerHTML = `恭喜！你的境界提升到了${level}！`;
                    
                    // 根据境界选择对应的图片
                    const levelImages = {
                        '凡人': 'mortal',
                        '练气初期': 'qi_early',
                        '练气中期': 'qi_middle',
                        '练气后期': 'qi_late',
                        '筑基期': 'foundation',
                        '金丹期': 'golden_core'
                    };
                    
                    // 显示对应境界的图片
                    const imageId = levelImages[level];
                    if (imageId) {
                        console.log(`显示境界提升图片: ${imageId}`); // 添加日志
                        this.showImage(imageId, imagePanel);
                    }
                    
                    // 保存游戏状态
                    this.saveGame();
                    
                    // 延迟后检查特殊事件和主线剧情
                    setTimeout(() => {
                        // 先检查特殊事件
                        this.checkSpecialEvents();
                        // 再检查主线剧情
                        this.checkStoryTriggers();
                    }, 1000);
                    
                    return;
                }
                break;
            }
        }
    }

    async preloadImages() {
        console.log('开始加载图片...');
        const loadImage = async (src) => {
            if (this.loadedImages.has(src)) return true;

            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`成功加载图片: ${src}`);
                    this.loadedImages.add(src);
                    resolve(true);
                };
                img.onerror = () => {
                    console.error(`加载图片失败: ${src}`);
                    resolve(false);
                };
                img.src = src;
            });
        };

        // 先加载所有图片
        for (const [key, src] of Object.entries(this.images)) {
            await loadImage(src);
        }
    }

    showImage(imageId, element) {
        if (!imageId || !element) {
            console.log(`缺少图片ID或元素: ${imageId}`);
            return;
        }

        const imageSrc = this.images[imageId];
        if (!imageSrc) {
            console.log(`找不到图片源: ${imageId}`);
            return;
        }

        // 先清除旧图片
        element.style.backgroundImage = 'none';
        element.style.display = 'none';

        // 确保图片已加载
        if (this.loadedImages.has(imageSrc)) {
            requestAnimationFrame(() => {
                element.style.backgroundImage = `url(${imageSrc})`;
                element.style.display = 'block';
                console.log(`显示图片: ${imageId}`);
            });
        } else {
            // 如果图片未加载，重新加载
            console.log(`重新加载图片: ${imageId}`);
            const img = new Image();
            img.onload = () => {
                this.loadedImages.add(imageSrc);
                requestAnimationFrame(() => {
                    element.style.backgroundImage = `url(${imageSrc})`;
                    element.style.display = 'block';
                    console.log(`延迟加载并显示图片: ${imageId}`);
                });
            };
            img.src = imageSrc;
        }
    }

    initializeBagAndBattle() {
        // 背包按钮事件
        const openBagBtn = document.getElementById('open-bag');
        const closeBagBtn = document.getElementById('close-bag');
        
        if (openBagBtn) {
            openBagBtn.onclick = () => this.openBag(false);
        }
        if (closeBagBtn) {
            closeBagBtn.onclick = () => this.closeBag();
        }

        // 战斗按钮事件
        document.getElementById('normal-attack').onclick = () => this.performBattleAction('normal');
        document.getElementById('skill-attack').onclick = () => this.performBattleAction('skill');
        document.getElementById('use-item').onclick = () => this.openBag(true);  // 战斗中背包
        document.getElementById('escape').onclick = () => this.tryEscape();
    }

    switchBagTab(type) {
        // 更新标签状态
        document.querySelectorAll('.bag-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.type === type);
        });

        // 重新显示物品
        this.showBagItems(type);
    }

    showBagItems() {
        const bagContent = document.querySelector('.bag-content');
        if (!bagContent) return;
        
        bagContent.innerHTML = '';

        Object.entries(this.state.items).forEach(([name, count]) => {
            if (count > 0) {
                const itemCard = document.createElement('div');
                itemCard.className = 'item-card';
                
                const item = this.items[name];
                itemCard.innerHTML = `
                    <div class="item-info">
                        <div class="item-name">${name}</div>
                        <div class="item-count">数量: ${count}</div>
                        <div class="item-desc">${item.description}</div>
                    </div>
                    <button class="item-use">使用</button>
                `;
                
                const useButton = itemCard.querySelector('.item-use');
                if (useButton) {
                    useButton.onclick = (e) => {
                        e.stopPropagation();
                        this.useItem(name, this.battleState !== null);
                    };
                }
                
                bagContent.appendChild(itemCard);
            }
        });

        if (bagContent.children.length === 0) {
            bagContent.innerHTML = '<div style="text-align: center; padding: 20px;">背包为空</div>';
        }
    }

    openBag(inBattle = false) {
        const bagPanel = document.getElementById('bag-panel');
        if (!bagPanel) return;
        
        bagPanel.classList.remove('hidden');
        this.showBagItems();
    }

    useItem(itemName, inBattle) {
        if (this.state.items[itemName] <= 0) return;

        const item = this.items[itemName];
        let used = false;
        let message = '';

        if (inBattle && this.battleState) {
            // 战斗中使用物品
            if (item.type === 'healing') {
                const healAmount = 50; // 灵草恢复量
                this.battleState.playerCurrentHp = Math.min(
                    this.battleState.playerCurrentHp + healAmount,
                    this.battleState.playerMaxHp
                );
                message = `使用${itemName}，恢复了${healAmount}点气血`;
                used = true;
            }
        } else {
            // 非战斗时使用物品
            if (item.effect) {
                Object.entries(item.effect).forEach(([stat, value]) => {
                    this.state[stat] = (Number(this.state[stat]) || 0) + value;
                });
                message = `使用${itemName}，${item.description}`;
                used = true;
            }
        }

        if (used) {
            // 减物品数量
            this.state.items[itemName]--;
            
            if (inBattle) {
                this.addBattleLog(message);
                this.updateBattleUI();
            } else {
                const storyPanel = document.getElementById('story-text');
                storyPanel.innerHTML = message;
            }
            
            // 更新界面
            this.updateUI();
            // 保存游戏
            this.saveGame();
            // 更新背包显示
            this.showBagItems();
        }
    }

    closeBag() {
        const bagPanel = document.getElementById('bag-panel');
        if (bagPanel) {
            bagPanel.classList.add('hidden');
        }
    }

    // 战斗系统
    startBattle(enemy) {
        if (this.battleState) return;
        
        document.getElementById('battle-log').innerHTML = '';
        
        this.battleState = {
            enemy: {...enemy},
            playerHp: 100 + this.state.strength * 2,
            playerMaxHp: 100 + this.state.strength * 2,
            playerMp: 100 + this.state.spirit * 2,
            playerMaxMp: 100 + this.state.spirit * 2,
            turn: 1,
            ended: false,
            canAct: true
        };

        // 修复战斗图片显示
        const battleImage = document.getElementById('battle-image');
        const enemyImageMap = {
            '野兽': 'battle_beast',
            '妖兽': 'battle_monster',
            '邪修': 'battle_evil'
        };
        
        const imageId = enemyImageMap[enemy.name];
        if (imageId) {
            this.showImage(imageId, battleImage);
        }

        document.getElementById('battle-panel').classList.remove('hidden');
        this.updateBattleUI();
        this.addBattleLog(`遭遇了${enemy.name}！`);
    }

    performBattleAction(type) {
        if (!this.battleState || this.battleState.ended || !this.battleState.canAct) return;

        this.battleState.canAct = false;

        let damage = 0;
        let mpCost = 0;
        let actionText = '';

        switch(type) {
            case 'normal':
                damage = 10 + this.state.strength;
                actionText = '你使用普通攻击！';
                break;
            case 'skill':
                if (this.battleState.playerMp < 30) {
                    this.addBattleLog('法力不足！');
                    this.battleState.canAct = true;
                    return;
                }
                damage = 20 + this.state.power * 0.5;
                mpCost = 30;
                actionText = '你使用法术攻击！';
                break;
        }

        // 玩家回合
        this.addBattleLog(actionText);
        
        // 立即扣除法力值和造成伤害
        this.battleState.playerMp -= mpCost;
        this.battleState.enemy.hp -= damage;
        this.addBattleLog(`造成了${Math.floor(damage)}点伤害！`);
        this.updateBattleUI();

        // 检查敌人是否败北
        if (this.battleState.enemy.hp <= 0) {
            this.battleVictory();
            return;
        }

        // 敌人回合，缩短延迟时间
        setTimeout(() => {
            if (!this.battleState || this.battleState.ended) return;

            this.addBattleLog(`\n${this.battleState.enemy.name}发动攻击！`);
            const enemyDamage = this.battleState.enemy.attack;
            this.battleState.playerHp -= enemyDamage;
            this.addBattleLog(`你受到了${enemyDamage}点伤害！`);
            this.updateBattleUI();

            // 检查玩家是否败北
            if (this.battleState.playerHp <= 0) {
                this.battleDefeat();
                return;
            }

            this.battleState.turn++;
            this.battleState.canAct = true; // 恢复行动能力
        }, 300); // 缩短延迟时间
    }

    addBattleLog(message) {
        const log = document.getElementById('battle-log');
        if (message.startsWith('\n')) {
            log.innerHTML += message;  // 如果消息以换行开头，接添加
        } else {
            log.innerHTML += `<div>${message}</div>`;  // 否则添加到新的div
        }
        log.scrollTop = log.scrollHeight;
    }

    updateBattleUI() {
        document.getElementById('player-hp').textContent = Math.floor(this.battleState.playerHp);
        document.getElementById('player-mp').textContent = Math.floor(this.battleState.playerMp);
        document.getElementById('enemy-hp').textContent = Math.floor(this.battleState.enemy.hp);
        document.getElementById('enemy-name').textContent = this.battleState.enemy.name;
    }

    battleVictory() {
        if (!this.battleState || this.battleState.ended) return;
        
        this.battleState.ended = true;
        
        // 显示胜利图片
        const battleImage = document.getElementById('battle-image');
        const victorySrc = this.images['battle_victory'];
        if (victorySrc && this.loadedImages.has(victorySrc)) {
            battleImage.style.backgroundImage = `url(${victorySrc})`;
        }
        
        // 显示战利品信息
        const rewards = this.battleState.enemy.rewards;
        this.addBattleLog('\n战斗胜利！');
        this.addBattleLog('\n获得战利品：');
        
        Object.entries(rewards).forEach(([item, amount]) => {
            this.addBattleLog(`${item} x${amount}`);
            this.state.items[item] = (Number(this.state.items[item]) || 0) + Number(amount);
        });
        
        // 缩短结束延迟
        setTimeout(() => {
            this.endBattle();
        }, 500);
    }

    battleDefeat() {
        if (!this.battleState || this.battleState.ended) return;
        
        this.battleState.ended = true;
        
        // 显示失败图片
        const battleImage = document.getElementById('battle-image');
        const defeatSrc = this.images['battle_defeat'];
        if (defeatSrc && this.loadedImages.has(defeatSrc)) {
            battleImage.style.backgroundImage = `url(${defeatSrc})`;
        }
        
        this.addBattleLog('\n战斗失败！');
        
        // 缩短结束延迟
        setTimeout(() => {
            this.endBattle();
        }, 500);
    }

    tryEscape() {
        const escapeChance = 0.3 + this.state.spirit * 0.01;
        if (Math.random() < escapeChance) {
            this.addBattleLog('成功逃脱！');
            setTimeout(() => {
                this.endBattle();
            }, 1000);
        } else {
            this.addBattleLog('逃跑失败！');
            // 敌人获得一次免费攻击
            const damage = this.battleState.enemy.attack;
            this.battleState.playerHp -= damage;
            this.addBattleLog(`${this.battleState.enemy.name}对你造成了${damage}点伤害！`);
            this.updateBattleUI();
        }
    }

    checkStoryTriggers() {
        // 只在没有战斗和特殊事件时检查剧
        if (this.battleState || this.currentStory) {
            console.log('战斗或剧情进行中，跳过剧情检查');
            return;
        }
        
        // 根据修为值触发剧情
        const powerTriggers = {
            100: 'first_enlightenment',   // 启蒙
            500: 'qi_early',              // 练气初期
            1000: 'qi_middle',            // 练气中期
            2000: 'qi_late',              // 练气后期
            3000: 'foundation',           // 筑基期
            5000: 'golden_core'           // 金丹期
        };

        // 检查每个触发点
        for (const [power, storyId] of Object.entries(powerTriggers)) {
            if (this.state.power >= Number(power) && !this.state.completedStories.has(storyId)) {
                const story = window.mainStory.stories[storyId];
                if (story) {
                    console.log(`触发剧情: ${storyId}, 当前修为: ${this.state.power}`);  // 添加日志
                    
                    // 显示主线剧情面板
                    document.getElementById('main-story-panel').classList.remove('hidden');
                    
                    // 设置标题
                    document.querySelector('.story-title').textContent = story.title;
                    
                    this.currentStory = {
                        id: storyId,
                        scenes: story.scenes,
                        currentScene: 0
                    };
                    
                    // 显示第一个场景
                    this.showStory({
                        ...story.scenes[0],
                        image: storyId
                    });
                    return;
                }
            }
        }
    }

    // 添加新方法：结束战斗
    endBattle() {
        // 只有战斗结束  能回
        if (!this.battleState || !this.battleState.ended) return;
        
        // 隐藏战斗面板
        document.getElementById('battle-panel').classList.add('hidden');
        // 清理战斗日志
        document.getElementById('battle-log').innerHTML = '';
        // 重置战斗图片
        const battleImage = document.getElementById('battle-image');
        battleImage.style.backgroundImage = 'none';
        // 清理战斗状态
        this.battleState = null;
        // 更新界面
        this.updateUI();
    }

    // 修改特殊事件检查方法
    checkSpecialEvents() {
        if (this.battleState || this.currentStory) {
            console.log('战斗或剧情进行中，跳过特殊事件检查');
            return;
        }
        
        console.log(`检查特殊事件 - 当前境界: ${this.state.level}, 神识: ${this.state.spirit}`); // 添加日志
        
        // 检查每个特殊事件
        for (const [eventId, event] of Object.entries(window.specialEvents.events)) {
            // 检查是否已触发过
            if (window.specialEvents.history.has(eventId)) {
                console.log(`特殊事件 ${eventId} 已触发过`);
                continue;
            }
            
            // 检查境界和神识条件
            if (event.condition && 
                (!event.condition.level || this.state.level === event.condition.level) &&
                (!event.condition.spirit || this.state.spirit >= event.condition.spirit)) {
                
                console.log(`触发特殊事件: ${eventId}`);
                
                // 显示特殊事件
                const storyPanel = document.getElementById('story-text');
                const imagePanel = document.getElementById('story-image');
                
                // 显示文本和图片
                storyPanel.innerHTML = event.text;
                if (event.image) {
                    this.showImage(event.image, imagePanel);
                }
                
                // 记录事件已触发
                window.specialEvents.history.set(eventId, Date.now());
                return;
            }
        }
    }
}

window.onload = () => {
    window.game = new Game();
    window.game.initializeGame();
}; 