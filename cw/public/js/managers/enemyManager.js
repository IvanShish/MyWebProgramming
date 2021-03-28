const enemyManager = {
    enemies: [],
    interval: null,
    lastEnemy: null,

    start() {
        this.interval = setInterval(this.makeMoveForAll, 500);
    },

    makeMoveForAll() {
        for (let i = 0; i < enemyManager.enemies.length; i++) {
            let curEnemy = enemyManager.enemies[i];
            if (curEnemy !== enemyManager.lastEnemy || enemyManager.enemies.length === 1) {
                enemyManager.makeDecision(curEnemy);
                enemyManager.lastEnemy = curEnemy;
            }
        }
    },

    makeDecision(enemy) {
        let tmpRocket = {
            name: "tmp",
            size_x: 16,
            size_y: 16
        }
        let xBlock = Math.floor((enemy.pos_x + enemy.size_x / 2) / mapManager.tSize.x);
        let yBlock = Math.floor((enemy.pos_y + enemy.size_y / 2) / mapManager.tSize.y);

        let playerXBlock = Math.floor((gameManager.player.pos_x + gameManager.player.size_x / 2) / mapManager.tSize.x);
        let playerYBlock = Math.floor((gameManager.player.pos_y + gameManager.player.size_y / 2) / mapManager.tSize.y);

        if (xBlock === playerXBlock) { //ниже или выше
            if (playerYBlock > yBlock){
                let flag = true;
                for (let y = yBlock + 1; y < playerYBlock; y++) {
                    let entity = physicManager.entityAtXY(tmpRocket, xBlock * mapManager.tSize.x + enemy.size_x / 2, y * mapManager.tSize.y);
                    if (entity && entity.name !== enemy.name && entity.name !== gameManager.player.name) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    console.log("выстрел вниз");
                    this.turnAndFire(enemy, 0, 1);
                }
                else {
                    this.makeMove(enemy);
                }
            }
            else {
                let flag = true;
                for (let y = yBlock - 1; y > playerYBlock; y--) {
                    let entity = physicManager.entityAtXY(tmpRocket, xBlock * mapManager.tSize.x + enemy.size_x/2, y * mapManager.tSize.y);
                    if (entity && entity.name !== enemy.name && entity.name !== gameManager.player.name) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    console.log("выстрел вверх");
                    this.turnAndFire(enemy, 0, -1);
                }
                else {
                    this.makeMove(enemy);
                }
            }
        }
        else if (yBlock === playerYBlock) { //левее или правее
            if (playerXBlock > xBlock){
                let flag = true;
                for (let x = xBlock + 1; x < playerXBlock; x++) {
                    let entity = physicManager.entityAtXY(tmpRocket, x * mapManager.tSize.x, yBlock * mapManager.tSize.y + + enemy.size_y/2);
                    if (entity && entity.name !== enemy.name && entity.name !== gameManager.player.name) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    console.log("выстрел вправо");
                    this.turnAndFire(enemy, 1, 0);
                }
                else {
                    this.makeMove(enemy);
                }
            }
            else {
                let flag = true;
                for (let x = xBlock - 1; x > playerXBlock; x--) {
                    let entity = physicManager.entityAtXY(tmpRocket, x * mapManager.tSize.x, yBlock * mapManager.tSize.y + enemy.size_y/2);
                    if (entity && entity.name !== enemy.name && entity.name !== gameManager.player.name) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    console.log("выстрел влево");
                    this.turnAndFire(enemy, -1, 0);
                }
                else {
                    this.makeMove(enemy);
                }
            }
        }
        else {
            this.makeMove(enemy);
        }
    },

    turnAndFire(enemy, move_x, move_y) {
        enemy.move_x = move_x;
        enemy.move_y = move_y;
        if (move_x === 1) {
            enemy.lastMove = "right";
        }
        else if (move_x === -1) {
            enemy.lastMove = "left";
        }
        else if (move_y === 1) {
            enemy.lastMove = "down";
        }
        else if (move_y === -1) {
            enemy.lastMove = "up";
        }
        setTimeout(() => {
            enemy.fire();
            enemy.move_x = 0;
            enemy.move_y = 0;
        }, 150);
    },

    makeMove(enemy) {
        let currentAction = {move_x: 1, move_y: 0};
        let actions = [{move_x: 1, move_y: 0}, {move_x: -1, move_y: 0},
            {move_x: 0, move_y: 1}, {move_x: 0, move_y: -1}];

        currentAction = actions[Math.floor(Math.random() * actions.length)];
        enemy.move_x = currentAction.move_x;
        enemy.move_y = currentAction.move_y;
        if (currentAction.move_x === 1) {
            enemy.lastMove = "right";
        }
        else if (currentAction.move_x === -1) {
            enemy.lastMove = "left";
        }
        else if (currentAction.move_y === 1) {
            enemy.lastMove = "down";
        }
        else if (currentAction.move_y === -1) {
            enemy.lastMove = "up";
        }
    }
}