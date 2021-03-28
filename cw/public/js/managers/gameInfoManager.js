const gameInfoManager = {
    nameLabel: null,
    hpLabel: null,
    speedLabel: null,
    scoreLabel: null,

    init() {
        this.nameLabel = document.getElementById('username');
        this.hpLabel = document.getElementById('hp_label');
        this.speedLabel = document.getElementById('speed_label');
        this.scoreLabel = document.getElementById('score_label');
    },

    setHP(hp) {
        this.hpLabel.innerHTML = hp;
    },

    setSpeed(speed) {
        this.speedLabel.innerHTML = speed;
    },

    addScore(dif) {
        this.scoreLabel.innerHTML = parseInt(this.scoreLabel.innerHTML) + dif;
    }
}