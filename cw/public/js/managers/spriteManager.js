const spriteManager = {
    image: new Image(), //рисунок с объектами
    sprites: [],        //массив объектов для отображения
    imgLoaded: false,   //изображения загружены
    jsonLoaded: false,  // JSON загружен

    loadAtlas(jsonUrl, imgUrl) {    //загрузка атласа изображения
        let request = new XMLHttpRequest(); //подготовить запрос на разбор атласа
        request.onreadystatechange = () => {
            if(request.readyState === 4) {  //успешно получили атлас
                spriteManager.parseAtlas(request.responseText);
            }
        }

        request.open("GET", jsonUrl, true); //асинхронный запрос на разбор атласа
        request.send();
        this.loadImg(imgUrl);   //загрузка изображения
    },

    loadImg(imgUrl) {   //загрузка изображения, на вход - путь к изображению
        this.image.onload = () => {
            spriteManager.imgLoaded = true; //когда изображения загружено - установить в true
        };

        this.image.src = imgUrl;    //загрузка изображения
    },

    parseAtlas(atlasJSON) {     //разобрать атлас с объектами
        let atlas = JSON.parse(atlasJSON);
        for (let name in atlas.frames) {    //проход по всем именам в frames
            let frame = atlas.frames[name].frame;   //получение спрайта
            // соранение характеристик frame в виде объекта
            this.sprites.push({name: name, x: frame.x, y:frame.y, w:frame.w, h:frame.h});
        }
        this.jsonLoaded = true; //когда разобрали весь атлас - true
    },

    drawSprite(ctx, name, x, y) {   //отображение спрайтов, на вход - контекст холста, имя спрайта, и координаты
        if (!this.imgLoaded ||!this.jsonLoaded) {
            setTimeout(() => {  //если изображение не загружено, то повторить запрос через 100 мсек
                spriteManager.drawSprite(ctx, name, x, y);
            }, 100);
        } else {
            let sprite = this.getSprite(name);  //получить спрайт по имени

            if(!mapManager.isVisible(x, y, sprite.w, sprite.h)) {
                return; //не рисуем за пределами видимой зоны
            }
            // сдвигаем видимую зону

            x -= mapManager.view.x;
            y -= mapManager.view.y;
            // отображаем спрайт на холсте

            ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
            // if (name.includes("player_shot") || name.includes("enemy_shot")) {
            //     // console.log (sprite.x, sprite.y, x, y)
            //     setTimeout(() => {
            //         // x -= 10;
            //         ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
            //     }, 10);
            // }
        }
    },

    getSprite(name) {   //получить объект по имени
        for (let i = 0; i < this.sprites.length; i++) {
            let s = this.sprites[i];
            if (s.name === name) {  //имя совпало - вернуть объект
                return s;
            }
        }
        return null;
    }
}