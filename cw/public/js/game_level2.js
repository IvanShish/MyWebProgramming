document.addEventListener("DOMContentLoaded", function(event) {
    let username = document.getElementById('username').textContent;
    let points = document.getElementById('score_label').textContent;
    const canvas = document.getElementById('canvasId');
    gameManager.points = parseInt(points);
    gameManager.name = username;
    gameManager.loadManagers("/map/myTiles2.json", "/map/spritesheet.png", "/map/sprites.json", canvas, `/game/end_game/${username}`);
    gameManager.play();
});