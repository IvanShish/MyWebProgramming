const Entity = {
    name: null,
    type: null,
    pos_x: 0,   //позиция объекта
    pos_y: 0,
    size_x: 0,  //размеры объекта
    size_y: 0,

    extend(extendProto) {   //расширение сущности
        let obj = Object.create(this);  //создание нового объекта
        for (let property in extendProto) { //для всех свойств нового объекта
            if (this.hasOwnProperty(property) || typeof obj[property] === 'undefined') {    //если их нет в родительском - добавить
                obj[property] = extendProto[property];
            }
        }
        return obj;
    }
}

const Player = Entity.extend({
    hp: 100,
    damage: 100,
    move_x: 0,  //направление движения
    move_y: 0,
    speed: 1,

    lastMove: "up",
    rocketsNum: 3,

    draw(ctx) { //прорисовка объекта
        let sprite = "player_";

        switch (this.lastMove) {
            case "left":
                sprite += "left";
                break;
            case "right":
                sprite += "right";
                break;
            case "up":
                sprite += "up";
                break;
            case "down":
                sprite += "down";
                break;
            default:
                sprite += "up";
        }

        spriteManager.drawSprite(ctx, sprite, this.pos_x, this.pos_y);
    },

    update() {  //обновление в цикле
        physicManager.update(this);
    },

    onTouchEntity(obj) {    //обработка встречи с препятствием
        if (obj.type === "HPBonus") {
            this.hp += 50;
            obj.kill();
            gameInfoManager.setHP(this.hp);
        }
        else if (obj.type === "SpeedBonus") {
            this.speed += 2;
            obj.kill();
            gameInfoManager.setSpeed(this.speed);
        }
        else if (obj.type === "SlowEnemiesBonus") {
            Enemy.speed -= 0.5;
            obj.kill();
        }
    },

    kill() {    //уничтожение объекта
        soundManager.playDestroy();
        gameManager.gameOver();
    },

    fire() {    //выстрел
        if (this.rocketsNum > 0) {
            this.rocketsNum--;
            let r = Object.create(Rocket);
            r.owner = this;
            r.sprite = "player_shot_";
            r.damage = this.damage;
            r.size_x = 16;
            r.size_y = 16;
            name = "rocket" + (++gameManager.fireNum);  //счетчик выстрелов

            switch (this.lastMove) {
                case "left":
                    r.pos_x = this.pos_x;
                    r.pos_y = this.pos_y + this.size_y / 2 - r.size_y / 2;
                    r.move_x = -1;
                    r.move_y = 0;
                    break;
                case "right":
                    r.pos_x = this.pos_x + r.size_x;
                    r.pos_y = this.pos_y + this.size_y / 2 - r.size_y / 2;
                    r.move_x = 1;
                    r.move_y = 0;
                    break;
                case "up":
                    r.pos_x = (this.pos_x + this.size_x / 2) - r.size_x / 2;
                    r.pos_y = this.pos_y;
                    r.move_x = 0;
                    r.move_y = -1;
                    break;
                case "down":
                    r.pos_x = (this.pos_x + this.size_x / 2) - r.size_x / 2;
                    r.pos_y = this.pos_y + r.size_y;
                    r.move_x = 0;
                    r.move_y = 1;
                    break;
                default:
                    r.pos_x = (this.pos_x + this.size_x / 2) - r.size_x / 2;
                    r.pos_y = this.pos_y;
                    r.move_x = 0;
                    r.move_y = -1;
            }
            gameManager.entities.push(r);
            soundManager.playShot();
        }
    }
});

const Enemy = Entity.extend({
    hp: 100,
    damage: 100,
    move_x: 0,
    move_y: 0,
    speed: 1,

    lastMove: "down",
    rocketsNum: 2,

    draw(ctx) {
        let sprite = "enemy_";

        switch (this.lastMove) {
            case "left":
                sprite += "left";
                break;
            case "right":
                sprite += "right";
                break;
            case "up":
                sprite += "up";
                break;
            case "down":
                sprite += "down";
                break;
            default:
                sprite += "up";
        }

        spriteManager.drawSprite(ctx, sprite, this.pos_x, this.pos_y);
    },

    update() {
        physicManager.update(this);
    },

    onTouchEntity(obj) {

    },

    kill() {
        gameManager.kill(this);
        soundManager.playDestroy();
        gameInfoManager.addScore(100);
    },

    fire() {
        if (this.rocketsNum > 0) {
            this.rocketsNum--;
            let r = Object.create(Rocket);
            r.owner = this;
            r.sprite = "enemy_shot_";
            r.damage = this.damage;
            r.size_x = 16;
            r.size_y = 16;
            name = "rocket" + (++gameManager.fireNum);

            switch (this.lastMove) {
                case "left":
                    r.pos_x = this.pos_x;
                    r.pos_y = this.pos_y + this.size_y / 2 - r.size_y / 2;
                    r.move_x = -1;
                    r.move_y = 0;
                    break;
                case "right":
                    r.pos_x = this.pos_x + r.size_x;
                    r.pos_y = this.pos_y + this.size_y / 2 - r.size_y / 2;
                    r.move_x = 1;
                    r.move_y = 0;
                    break;
                case "up":
                    r.pos_x = (this.pos_x + this.size_x / 2) - r.size_x / 2;
                    r.pos_y = this.pos_y;
                    r.move_x = 0;
                    r.move_y = -1;
                    break;
                case"down":
                    r.pos_x = (this.pos_x + this.size_x / 2) - r.size_x / 2;
                    r.pos_y = this.pos_y + r.size_y;
                    r.move_x = 0;
                    r.move_y = 1;
                    break;
                default:
                    r.pos_x = (this.pos_x + this.size_x / 2) - r.size_x / 2;
                    r.pos_y = this.pos_y;
                    r.move_x = 0;
                    r.move_y = -1;
            }
            gameManager.entities.push(r);
            soundManager.playShot();
        }
    }
});

const Rocket = Entity.extend({
    damage: 0,
    move_x: 0,
    move_y: 0,
    speed: 4,
    pos_x: 0,
    pos_y: 0,
    sprite: null,
    owner: null,

    draw(ctx) {
        let s = "";
        switch (this.move_x + 2 * this.move_y) {
            case -1:
                s = this.sprite + "left";
                break;
            case 1:
                s = this.sprite + "right";
                break;
            case -2:
                s = this.sprite + "up";
                break;
            case 2:
                s = this.sprite + "down";
                break;
            default:
                s = this.sprite + "down";
        }
        spriteManager.drawSprite(ctx, s, this.pos_x, this.pos_y);
    },

    update() {
        physicManager.update(this);
    },

    onTouchEntity(obj) {    //обработка встречи с препятствием
        gameManager.damage(obj, this.damage);
        this.kill();
    },

    onTouchMap() {  //обработка встречи со стеной
        this.kill();
    },

    kill() {    //уничтожение объекта
        this.owner.rocketsNum++;
        gameManager.kill(this);
    },
});


const Wall = Entity.extend( {
    draw(ctx) {
        spriteManager.drawSprite(ctx, "stone", this.pos_x, this.pos_y);
    },

    kill() {

    }
});

const SpeedBonus = Entity.extend({
    draw(ctx) {
        spriteManager.drawSprite(ctx, "speed_bonus", this.pos_x, this.pos_y);
    },

    kill() {
        gameManager.kill(this);
        gameInfoManager.addScore(50);
    }
});

const HPBonus = Entity.extend({
    draw(ctx) {
        spriteManager.drawSprite(ctx, "hp_bonus", this.pos_x, this.pos_y);
    },

    kill() {
        gameManager.kill(this);
        gameInfoManager.addScore(50);
    }
});

const SlowEnemiesBonus = Entity.extend({
    draw(ctx) {
        spriteManager.drawSprite(ctx, "slow_enemies_bonus", this.pos_x, this.pos_y);
    },

    kill() {
        gameManager.kill(this);
        gameInfoManager.addScore(50);
    }
});