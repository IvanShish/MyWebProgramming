const eventsManager = {
    bind: [],   //сопоставление клавиш действиям
    action: [], //действия (строки), а в качестве значения - true (действие необходимо выполнить) и false (действие нужно прекратить)

    setup() {   //настройка сопоставления. Так как нет действий мышкой - canvas передавать необязательно
        this.bind[32] = 'fire'; //пробел
        this.bind[37] = 'left'; //стрелка влево
        this.bind[38] = 'up';   //стрелка вверх
        this.bind[39] = 'right';//стрелка вправо
        this.bind[40] = 'down'; //стрелка вниз
        //контроль событий клавиатуры
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    },

    onKeyDown(event) {  //нажали на кнопку на клавиатуре, проверили, есть ли сопоставление действию для события с кодом keyCode
        let action = eventsManager.bind[event.keyCode];
        if (action) {
            eventsManager.action = [];
            eventsManager.action[action] = true;    //согласились выполнять действие
        }
    },

    onKeyUp(event) {    //отпустили кнопку на клавиатуре
        let action = eventsManager.bind[event.keyCode]; //проверили наличие действия
        if(action) {
            eventsManager.action[action] = false;   //отменили действие
        }
    }
}