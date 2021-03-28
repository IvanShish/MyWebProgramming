document.addEventListener("DOMContentLoaded", function(event) {
    soundManager.init();
    soundManager.loadArray(["/audio/space_walk.ogg"]);
    soundManager.playSong();

    const str_json = localStorage["ufo.results"]
    let results = []
    if (str_json) {
        results = JSON.parse(str_json)
    }
    let username = document.getElementById('username').textContent;
    const res = parseInt(document.getElementById('score_label').textContent, 10)

    if (results.length < 5) {
        results.push({
            name: username,
            score: res
        })
        results.sort((a, b) => b.score - a.score)
        localStorage['ufo.results'] = JSON.stringify(results)
    } else if (results[4].score < res) {
        results[4] = {
            name: username,
            score: res
        }
        results.sort((a, b) => b.score - a.score)
        localStorage['ufo.results'] = JSON.stringify(results)
    }

    for (let i = 0; i < results.length; i++) {
        document.getElementById('tb_name_' + (i + 1)).textContent = results[i].name
        document.getElementById('tb_score_' + (i + 1)).textContent = results[i].score
    }
});