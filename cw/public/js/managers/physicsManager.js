const physicManager = {
    update(obj) {
        if (obj.move_x === 0 && obj.move_y === 0) {
            return "stop";  //скорости движения нулевые
        }

        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed * 4);
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed * 4);
        // if(obj.name == null) {
        //     console.log(obj.pos_x, obj.pos_y, newX, newY, obj.speed)
        // }
        //анализ пространства на карте по направлению движения
        let ts = mapManager.getTilesetIdx(newX + obj.size_x/2, newY + obj.size_y/2);
        let e = this.entityAtXY(obj, newX, newY);   //объект на пути

        if (e !== null && obj.onTouchEntity) {  //если етсь конфликт
            obj.onTouchEntity(e);   //разбор конфликта внутри объекта
        }
        // if (obj.onTouchMap) {   //есть препятствие
        //     obj.onTouchMap(ts); //разбор конфликта с препятствием внутри объекта
        // }
        if(e === null && !this.isEnd(newX, newY, obj)) {
            obj.pos_x = newX;   //перемещаем объект на свободное место
            obj.pos_y = newY;
        }
        // else if (e !== null){ //дальше двигаться нельзя
        //     obj.onTouchEntity(e);
        //     return 'break';
        // }
        else if (this.isEnd(newX, newY, obj)){
            obj.onTouchMap();
            return "break";
        }
        return "move";  //двигаемся
    },

    entityAtXY(obj, x, y) { //fункция для определения столкновения с объектом по заданным координатам
        for(let i = 0; i < gameManager.entities.length; i++) {  //все объекты карты
            let e = gameManager.entities[i];
            if (e.name !== obj.name) {
                if (x + obj.size_x <= e.pos_x || y + obj.size_y <= e.pos_y || x >= e.pos_x + e.size_x || y >= e.pos_y + e.size_y) {
                    continue;   //не пересекаются
                }
                return e;
            }
        }
        return null;
    },

    isEnd(x, y, obj) {
        return x + obj.size_x > (mapManager.xCount) * mapManager.tSize.x || x < 0 || y < 0 || y + obj.size_y > (mapManager.yCount) * mapManager.tSize.y;
    }
}