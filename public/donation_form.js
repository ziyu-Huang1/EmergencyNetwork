var username = localStorage.getItem('username')
var socket =  io({
    query:{
        user: username
    }
})

socket.on('logout',()=>{

    var data = {'username' : localStorage.getItem(
        'username'
    )}
    
    $.ajax({
        type: 'put',
        url: "/users/offline",
        data:
        JSON.stringify(data),
        dataType: "json",
        headers: { "token": localStorage.getItem('token') },
        success: function (data, status, jqXHR) {
            socket.emit('showUser');
            console.log('logout success');
            alert("you has been set to be inactive")
            // localStorage.setItem('token', jqXHR.responseText);
            localStorage.setItem('token', jqXHR.responseText);
            window.location.href = "/";
        },
        error: function (jqXHR, status, err) {
            console.log('logout fail');
        }
    })

})
socket.on('privilegeChange',(data)=>{
    var privilege  =JSON.parse(JSON.stringify(data))
    localStorage.setItem('privilege',privilege)
    if(privilege == "administrator"){

        socket.emit('showActiveUser')
    }else{

        socket.emit('showUser')
    }
})

socket.on('connect',()=>{  
    updateUserSocketMap(username, socket)
})

socket.on('newRequest', function(donationID){
    var prev_newRequestList= JSON.parse(localStorage.getItem('newRequest'))
    if(prev_newRequestList.indexOf(donationID)<=-1){
        prev_newRequestList.push(donationID)
    }
    localStorage.setItem('newRequest', prev_newRequestList)
})

socket.on('newReply', function(requestID){
    var prev_newReplyList = JSON.parse(localStorage.getItem('newReply'))
    if(prev_newReplyList.indexOf(requestID)<=-1){
        prev_newReplyList.push(requestID)
    }
    localStorage.setItem('newReply', prev_newReplyList)
})


function updateUserSocketMap(username, socket){
    var data = {
        'username': username,
        'socket':socket.id
    }
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'put',
        url: '/messages/public/socketUpdate',
        dataType: 'json',
        success: function (data, status, jqXHR) {
            //console.log(username+" directory socket update success")
        },
        error: function(jqXHR, status, err){
            //console.log(username+" directory socket update failed")
        }
    })
  
}


