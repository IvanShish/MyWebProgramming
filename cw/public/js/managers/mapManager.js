const mapManager = {
    mapData: null, //переменная для хранения карты
    tLayer: null, //переменная для хранения ссылки на блоки карты
    xCount: 0, //количество блоков по горизонтали
    yCount: 0, //количество блоков по вертикали
    tSize: {x:32, y:32}, //размер блока
    mapSize: {x:640, y:960}, //размер карты в пикселях
    tilesets: [], //массив описаний блоков карты
    imgLoadCount: 0,    //количество загруженны изображений
    imgLoaded: false,   //все изображения загружены (изначально - false)
    jsonLoaded: false,
    view: {x: 0, y: 960, w: 640, h: 640},  //видимая область с координатами левого нижнего угла

    getTilesetIdx(x, y){
        let idx = Math.floor(y / this.tSize.y) * this.xCount + Math.floor(x / this.tSize.x);
        return this.tLayer.data[idx];
    },

    getTileset (tileIndex) {
        for (let i = mapManager.tilesets.length - 1; i >= 0; i--) {
            //в каждом tilesets[i].firstgid записано число, с которого начинается нумерация блоков
            if (mapManager.tilesets[i].firstgid <= tileIndex) {
                return mapManager.tilesets[i];
            }
        }
        return null;    //возвращается найденный tileset
    },

    getTile (tileIndex) {  //индекс блока
        let tile = {
            img: null,
            px: 0,  //координаты блока в tileset
            py: 0
        }
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex - tileset.firstgid;
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * mapManager.tSize.x;
        tile.py = y * mapManager.tSize.y;
        return tile;
    },

    isVisible(x, y, width, height) {   //не рисуем за пределами видимой зоны
        if (x +width < this.view.x || y + height < this.view.y || x > this.view.x + this.view.w ||
            y > this.view.y + this.view.h)
            return false;
        return true;
    },

    draw(ctx) {    //нарисовать карту в контексте
        //если карта не загружена, то повторить прорисовку через 100 мсек
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function() {
                mapManager.draw(ctx);
            }, 100);
        }
        else {
            if (this.tLayer === null) { //проверить, что tLayer настроен
                for (let id = 0; id < this.mapData.layers.length; id++) {   //проходим по всем layer карты
                    let layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") {
                        this.tLayer = layer;
                        break;
                    }
                }
            }
            for (let i = 0; i < this.tLayer.data.length; i++) { //пройти по всей карте
                if (this.tLayer.data[i] !== 0) {
                    let tile = this.getTile(this.tLayer.data[i]);   //получение блока по индексу
                    let pX = (i % this.xCount) * this.tSize.x;  //вычисляем х в пикселях
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;  //вычисляем y в пикселях

                    if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y)) continue;  //не рисуем за пределами видимой зоны
                    pX -= this.view.x;  //сдвигаем видимую зону
                    pY -= this.view.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }
            }
        }
    },

    parseMap(tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);   //разобрать JSON
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;    //вычисление размера карты
        this.mapSize.y = this.yCount * this.tSize.y;
        for (let i = 0; i < this.mapData.tilesets.length; i++) {
            let img = new Image()
            img.onload = function () {
                mapManager.imgLoadCount++;
                if (mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
                    mapManager.imgLoaded = true;    //загружены все изображения
                }
            };

            if (this.mapData.tilesets[i].image) {
                img.src = this.mapData.tilesets[i].image;
            }
            else {
                mapManager.imgLoadCount++;
            }

            let t = this.mapData.tilesets[i];   //забираем tileset из карты
            let ts = {  //создаем свой объект tileset
                firstgid: t.firstgid,   //firstgid - с чего начинается нумерация в data
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / mapManager.tSize.x),  //горизонталь
                yCount: Math.floor(t.imagewidth / mapManager.tSize.y)  //вертикаль
            }
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;
    },

    loadMap(path) {
        let request = new XMLHttpRequest(); //создание ajax-запроса
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                //Получен ответ, результат можно обрабатывать mapManager.parseMap(request.responseText);
                mapManager.parseMap(request.responseText);
            }
        };
        request.open("GET", path, true);
        request.send();
    },

    parseEntities() {
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () {
                mapManager.parseEntities();
            }, 100);
        }
        else {
            for (let j = 0; j < this.mapData.layers.length; j++) {
                if (this.mapData.layers[j].type === 'objectgroup') {
                    let entities = this.mapData.layers[j];
                    for (let i = 0; i < entities.objects.length; i++) {
                        let e = entities.objects[i];
                        try {
                            if (e.type.includes('Enemy')) e.type = 'Enemy'
                            let obj = Object.create(gameManager.factory[e.type]);
                            obj.name = e.name;
                            obj.type = e.type;
                            obj.pos_x = e.x;
                            obj.pos_y = e.y;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            gameManager.entities.push(obj);
                            if (obj.name === "Player") {
                                gameManager.initPlayer(obj);
                            }
                            else if(obj.type === "Enemy") {
                                enemyManager.enemies.push(obj);
                            }
                        } catch (ex) {
                            console.log("Error while creating: [" + e.gid + "]" + e.type + "," + ex);
                        }
                    }
                }
            }
        }
    },

    centerAt(x, y) {
        if (x < this. view.w / 2) {
            this.view.x = 0;
        }
        else if (x > this.mapSize.x - this.view.w / 2) {
            this.view.x = this.mapSize.x - this.view.w;
        }
        else {
            this.view.x = x - (this.view.w / 2);
        }

        if (y < this.view.h / 2) {
            this.view.y = 0;
        } else if (y > this. mapSize.y - this.view.h / 2) {
            this.view.y = this.mapSize.y - this.view.h;
        }
        else {
            this.view.y = y - (this.view.h / 2);
        }
    }
};