document.addEventListener("DOMContentLoaded", function(event) {
    const canvas = document.getElementById('canvasId');
    let username = document.getElementById('username').textContent;
    gameManager.name = username;
    gameManager.loadManagers("/map/myTiles.json", "/map/spritesheet.png", "/map/sprites.json", canvas, `/game/lvl2/${username}`);
    gameManager.play();
});