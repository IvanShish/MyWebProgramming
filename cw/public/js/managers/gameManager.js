function updateWorld() {
    gameManager.update();
    // window.requestAnimationFrame(updateWorld);
}

const gameManager = {
    factory: {},    //фабрика объектов на карте
    entities:[],    //объекты на карте
    fireNum: 0,     //идентификатор выстрела
    player: null,   //указатель на объект игрока
    laterKill: [],  //отложенное уничтожение объекта
    canvas: null,
    nextLvlUrl: null,

    initPlayer(obj) {   //инициализация игрока
        this.player = obj;
    },

    kill(obj) {
        this.laterKill.push(obj);
    },

    update() {
        if (this.player === null) {
            return;
        }
        //по умолчанию игрок никуда не двигается
        this.player.move_x = 0;
        this.player.move_y = 0;
        //поймали событие - обрабатывем
        if (eventsManager.action['up']) {
            this.player.move_y = -1;
            this.player.lastMove = "up";
        }
        if (eventsManager.action['down']) {
            this.player.move_y = 1;
            this.player.lastMove = "down";
        }
        if (eventsManager.action['left']) {
            this.player.move_x = -1;
            this.player.lastMove = "left";
        }
        if (eventsManager.action['right']) {
            this.player.move_x = 1;
            this.player.lastMove = "right";
        }
        //стреляем
        if (eventsManager.action['fire']) {
            this.player.fire();
        }

        let isWin = true;
        //обновление информации по всем объектам на карте
        this.entities.forEach((e) => {
            if (e.type === "Enemy") {
                isWin = false;
            }
            try {   //защита от ошибок при выполнении update
                e.update();
            }
            catch (ex) {

            }
            e.draw(this.canvas.getContext('2d'));
        })

        if (isWin) {
            this.win();
        }

        //удаление всех объектов, попавших в laterKill
        for(let i = 0; i < this.laterKill.length; i++) {
            let entityForKill = this.laterKill[i]
            let idx= this.entities.indexOf(entityForKill);
            if (idx > -1) {
                this.entities.splice(idx, 1);
                if (entityForKill.type === "Enemy") {
                    console.log("enemy killed")
                    idx = enemyManager.enemies.indexOf(entityForKill);
                    if (idx > -1) {     //элемент в массиве найден
                        enemyManager.enemies.splice(idx, 1);
                    }
                }
            }
        }

        if(this.laterKill.length > 0) { //очистка массива laterKill
            this.laterKill = [];
        }

        let ctx = this.canvas.getContext('2d');
        mapManager.draw(ctx);   //функция отображения карты
        mapManager.centerAt(this.player.pos_x, this.player.pos_y);  //функция изменения видимой области в зависимости от позиции игрока

        this.draw(ctx); //отображение всех объектов, размещенных на карте
    },

    draw(ctx) {
        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(ctx);
        }
    },

    loadManagers(mapPath, spritePath, jsonSpritePath, canvas, nextLvlUrl) {  //для корректной работы всех менеджеров игры
        soundManager.init();
        soundManager.loadArray(["/audio/burst_fire.mp3", "/audio/death.wav"]);

        gameInfoManager.init();
        // if (this.points) {
        //     gameInfoManager.addScore(this.points);
        // }

        this.canvas = canvas;
        this.nextLvlUrl = nextLvlUrl;
        mapManager.loadMap(mapPath);    //загрузка карты
        spriteManager.loadAtlas(jsonSpritePath, spritePath);
        gameManager.factory['Player'] = Player; //инициализация фабрики
        gameManager.factory['Enemy'] = Enemy;
        gameManager.factory['SpeedBonus'] = SpeedBonus;
        gameManager.factory['HPBonus'] = HPBonus;
        gameManager.factory['SlowEnemiesBonus'] = SlowEnemiesBonus;
        gameManager.factory['Rocket'] = Rocket;
        gameManager.factory['wall'] = Wall;

        mapManager.parseEntities(); //разбор сущностей карты
        mapManager.draw(canvas.getContext('2d'));   //отобразить карту
        eventsManager.setup();  //настройка событий
    },

    play() {
        setInterval(updateWorld, 30);  //каждые x мс
        // window.requestAnimationFrame(updateWorld);
        enemyManager.start();
    },

    damage(obj, damage) {
        if (obj.hp) {
            obj.hp -= damage;
            if (obj.name === "Player") {
                gameInfoManager.setHP(obj.hp);
            }
            if (obj.hp <= 0) {
                obj.kill();
            }
        }
    },

    win() {
        window.location.href = this.nextLvlUrl + `/${gameInfoManager.scoreLabel.innerHTML}`;
        alert('Level completed!')
    },

    gameOver() {
        window.location.href = `/game/end_game/${gameInfoManager.nameLabel.innerHTML}/${gameInfoManager.scoreLabel.innerHTML}`;
        alert('Game over!')
    }
}