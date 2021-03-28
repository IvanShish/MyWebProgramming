document.addEventListener("DOMContentLoaded", function(event) {
    soundManager.init();
    soundManager.loadArray(["/audio/space_walk.ogg"]);
    soundManager.playSong();

    get_name();
});


function on_enter_clicked() {
    const name = document.getElementById('name-input').value
    if (name) {
        document.getElementById('error_text').style.visibility = "hidden"
        console.log("name:" + name)
        store_name(name)
        window.location.href = `/game/lvl1/${name}`
    } else {
        console.log("noname")
        document.getElementById('error_text').style.visibility = "visible"
    }
}

function store_name(name) {
    localStorage["ufo.username"] = name
}

function get_name() {
    const name = localStorage["ufo.username"]
    if (name) {
        document.getElementById('name-input').value = name
    }
}