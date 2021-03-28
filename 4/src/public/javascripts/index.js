function auth() {
    let name = $('#name_input').val()
    if (name === 'admin') {
        window.location.href = '/admin/adm_state'
    } else {
        console.log(name)
        $.get(`/users/auth/${name}`)
            .done((data) => {
                let obj = JSON.parse(data);
                if (obj) {
                    window.location.href = `/users/page/${obj.id}`
                } else {
                    $('#warning').css('display', 'block')
                }
            })
    }
}