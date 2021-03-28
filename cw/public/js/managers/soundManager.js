const soundManager = {
    clips: {},  //звуковые эффекты
    context: null,  //аудиоконтекст
    gainNode: null, //главный узел
    loaded: null,   //все звуки загружены

    init() {    //инициализация менеджера звука
        this.context = new AudioContext();
        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination);
    },

    load(path, callback) {  //загрузка одного аудиофайла, callback - функция, которая должна быть вызвана, если файл загружен
        if (this.clips[path]) {     //проверка, что загружены
            if (callback) {
                callback(this.clips[path]); //вызов загруженного
            }
            return;
        }
        let clip = {path: path, buffer: null, loaded: false};
        clip.play = function (volume, loop) {
            soundManager.play(this.path, {looping: loop?loop:false, volume: volume?volume:1});
        }
        this.clips[path] = clip;
        let request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            soundManager.context.decodeAudioData(request.response,
                function (buffer) {
                    clip.buffer = buffer;
                    clip.loaded = true;
                    if (callback) {
                        callback(clip);
                    }
                });
        }

        request.send();
    },

    loadArray(array) {  //загрузить массив звуков
        for (let i = 0; i < array.length; i++) {
            soundManager.load(array[i], () => {
                if (array.length === Object.keys(soundManager.clips).length) {  //если подготовили для загрузки все звуки
                    for (let sd in soundManager.clips) {
                        if(!soundManager.clips[sd].loaded) {
                            return;
                        }
                    }
                    soundManager.loaded = true; //все звуки загружены
                }
            });
        }
    },

    play(path, settings) {  //проигрывание файла
        if (!soundManager.loaded) { //если все еще не загрузили
            setTimeout(function () { soundManager.play(path, settings); },
                1000);
            return;
        }

        let looping = false;    //значения по умолчанию
        let volume = 1;
        if (settings) { //если переопределны, то настраиваем значения
            if (settings.looping) {
                looping = settings.looping;
            }
            if (settings.volume) {
                volume = settings.volume;
            }
        }
        let sd = this.clips[path];  //получаем звуковой эффект
        if (sd === null) {
            return false;
        }
        //создаем новый экземпляр проигрывателя BufferSource
        let sound = soundManager.context.createBufferSource();
        sound. buffer = sd. buffer;
        sound.connect(soundManager.gainNode);
        sound.loop = looping;
        soundManager.gainNode.gain.value = volume;
        sound.start(0);
        return true;
    },

    toggleMute() {
        if (this.gainNode.gain.value > 0) {
            this.gainNode.gain.value = 0;
        } else {
            this.gainNode.gain.value = 1;
        }
    },

    stopAll() {
        this.gainNode.disconnect();
        this.gainNode = this.context.createGainNode(0);
        this.gainNode.connect(this.context.destination);
    },

    playShot() {
        this.play("/audio/burst_fire.mp3", {looping: false, volume: 0.2});
    },

    playDestroy() {
        this.play("/audio/death.wav", {looping: false, volume: 0.2})
    },

    playSong() {
        this.play("/audio/space_walk.ogg", {looping: true, volume: 0.15})
    }
}