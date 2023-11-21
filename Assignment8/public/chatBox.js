const socket = io()
let isNickSet = false
// chat event
socket.on('chat', function (data) {
    $('textarea').val($('textarea').val()+data+'\n')
});


$(function() {
    // Set nickname
    $('#nick').on('click', function(event) {
        event.preventDefault() // stop refresh
        socket.emit('nick', $('#nickText').val());
        $('#nick').hide()
        isNickSet = true
    });

    // Send chat message
    $('#chat').on('click', function(event) {
        event.preventDefault()
        if(isNickSet){
            socket.emit('chat', {
                    message:$('#chatText').val()
            });
        }
        $('#chatText').val('')
    });
});