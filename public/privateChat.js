
var unreadList = []
var username = localStorage.getItem('username')
var sender //for future code clean up (technical debt lol)
var receiver
var socket =  io({
    query:{
        user: username
    }
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

socket.on('logout',()=>{

    var data = {'username' : localStorage.getItem('username')}
    
    $.ajax({
        type: 'put',
        url: "/users/offline",
        data: JSON.stringify(data),
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

socket.on('refreshOtherUserName', (data)=>{

    var dataPassed  =JSON.parse(JSON.stringify(data))
    var currentName = localStorage.getItem('username')
    var formerUsername = dataPassed.formerUsername
    if(currentName === formerUsername){
        var newUsername = dataPassed.username
        localStorage.setItem('username', newUsername)
        //window.location.href = "/users/directory/"+newUsername
    }else{
        window.location.reload()
    } 
})


var unreadList=[]

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

getPrivateChat()

function updateUserSocketMap(username, socket){
    
    var data = {
        'username': username,
        'socket':socket.id
    }
    console.log(socket.id);
    
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'put',
        url: '/messages/public/socketUpdate',
        dataType: 'json',
        success: function (data, status, jqXHR) {
        },
        error: function(jqXHR, status, err){
        }
    })

}


function getPrivateChat(){

    url = window.location.href;
    var strs = url.split('/');
    var username = localStorage.getItem("username")
    // console.log(strs[5].split('&')[1]+"getprivatechat "+receiver)
    receiver = strs[5].split('&')[1].substring(9);
    sender = username

    document.getElementById('receiver_name').innerHTML = receiver;
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/messages/private',
        data: {
            'sender': username, 
            'receiver': receiver,
        },
        success: function (res) {

            for(var i=0; i<res.msglist.length; i++){
                if(res.msglist[i].sender===sender && res.msglist[i].receiver===receiver){
                    showMyMessage(sender, res.msglist[i].time.substring(0, 10)+" "+res.msglist[i].time.substring(11, 19), res.msglist[i].content, res.msglist[i].senderStatus);
                }
                else{
                    showOtherMessage(receiver, res.msglist[i].time.substring(0, 10)+" "+res.msglist[i].time.substring(11, 19), res.msglist[i].content, res.msglist[i].senderStatus);
                }
                
            }
        }
    });

}

function searchInfo(){
    var searchContent = document.getElementById("searchInput").value;
    var sender =localStorage.getItem("username")
    var receiver = url.split('/')[5].split('&')[1].substring(9);
   

    console.log("send private search request")
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/info/messages/private?content='+searchContent+"&sender="+sender+"&receiver="+receiver,
        dataType: 'json',
        success: function (data, status, jqXHR) {
            if(searchContent =="status"){
                messages = [];
                for(i in data["data"]){
                    messages.push({"username":data['data'][i].username, "time":data['data'][i].time, "fromStatus":data['data'][i].fromStatus, "toStatus":data['data'][i].toStatus});
                }
                localStorage.setItem("searchStatusHistoryResult", JSON.stringify(messages));
                //jump to another page
                window.location.href = "/info/show/statusHistory";

            }else{
                messages = [];
                for(i in data["data"]){
                    messages.push({"content":data['data'][i].content, "sender":data['data'][i].sender, "receiver":data['data'][i].receiver,"time":data['data'][i].time, "senderStatus":data['data'][i].senderStatus});
                }
                localStorage.setItem("searchPrivateResult", JSON.stringify(messages));
                //jump to another page
                window.location.href = "/info/show/private";
            }

        },
        error: function(jqXHR, status, err){

            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
            if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                alert(erMsg);
            }
        }
    });
  }


socket.on('privateMsg', msg => {
    console.log("socket receive message!!!!!!!!!!!!!")
    showOtherMessage(msg.sender, msg.time.substring(0, 10) + " " + msg.time.substring(11, 19), msg.content, msg.senderStatus);
    console.log(document.getElementById('receiver_name').innerText)
    if(document.getElementById('privateBox').hidden === false && msg.sender === document.getElementById('receiver_name').innerText ){
        console.log("UPDATE UNREAD");
        updateIfread(msg.sender)
    }
    else{
        console.log("ELSE");
        unreadFromAll(msg.sender)
        reloadDirectory()
    }
})

function updateIfread(username){
    url = window.location.href;
    var strs = url.split('/');
    sender = strs[strs.length - 1];
    receiver = username
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/messages/private/updateIfread',
        data: {
            'sender': strs[strs.length - 1],
            'receiver': receiver,
        },
        success: function (res) {
            // console.log("chat privately get req");
            // console.log(res)
        }
    });
}


function reloadMsg(){
    console.log(document.getElementById("privateMessageContainer"))
    document.getElementById("privateMessageContainer").innerHTML = "";

}

function sendPrivateMessage(){

    var receiver =  document.getElementById('receiver_name').innerText
    url = window.location.href;
    var strs = url.split('/');
    var data = {
        'message' :  $('#sendMessage').val(),
        'sender': localStorage.getItem('username'),
        'receiver': receiver, 
        'type': "private",
        'status' : localStorage.getItem('status'),
        'time' : new Date()
    }

    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'post',
        url: '/messages/private',
        dataType: 'json',
        success: function (res) {
            console.log("fornt end")
            //if successfully sent
            console.log("sendPrivateMessage");
            showMyMessage(res.ret.sender, res.ret.time.substring(0, 10) + " "+ res.ret.time.substring(11, 19), res.ret.content, res.ret.senderStatus);
        },
        error: function (jqXHR, status, err) {
            console.log('messages/private fail');
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg
            if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                alert(erMsg);
              }
        }
    });


    $('#sendMessage').val("");

}

function showMyMessage(sender, time, content, status){
    const card = document.createElement("div");
        card.style = "max-width: 80%; margin-left: 20%"
        card.className = "card text-white bg-secondary mb-3"

    showBothMessage(sender, time, content, status, card)
}

function showOtherMessage(sender, time, content, status){
    const card = document.createElement("div");
    card.style = "max-width: 80%;"
    card.className = "card bg-light mb-3"

    showBothMessage(sender, time, content, status,card)
}

function showBothMessage(sender, time, content, status, card){
    const header = document.createElement("div")
    header.className = "card-header"

    const username = document.createElement("span")
    username.innerHTML = sender
    username.style = "float: left;padding-right: 5px;"

    const img = document.createElement("img")
    switch(status){
        case "ok":
            img.src = "/pic/green_dot.png"
            break;
        case "help":
            img.src = "/pic/yellow_dot.png"
            break;
        case "emergency":
            img.src = "/pic/red_dot.png"
            break;
        default:
            img.src = "/pic/green_dot.png"
    }
    img.width = "10"
    img.height = "10"

    const cardtime = document.createElement("span")
    cardtime.innerHTML = time
    cardtime.style = "float: right"

    const body = document.createElement("div")
    body.className = "card-body"

    const text = document.createElement("p")
    text.className = "card-text"
    text.innerHTML = content

    body.appendChild(text)

    header.appendChild(username)
    header.appendChild(img)
    header.appendChild(cardtime)

    card.appendChild(header)
    card.appendChild(body)
    document.getElementById("privateMessageContainer").append(card)

    var pw = document.getElementById("privateMessageContainer");
    $(window).scrollTop(pw.scrollHeight);
}

function unreadFromAll(sender){
    unreadList.push(sender);
    console.log("unreadList " + unreadList[0]);
    for(i in users){
        if(users[i].username == sender){
            users[i].unread = true;
        }
    }
}

function updateUnread(username){
    for(u in users){
        if(users[u].username == username){
            users[u].unread = false;
        }
    }
    reloadDirectory();
}

function jumpToPublicWall(){
    window.location.href = "/users/public/"+localStorage.getItem('username')
}

function jumpToDirectory(){
    window.location.href = "/users/directory/"+localStorage.getItem('username')
}

function jumpToShelter(){
    window.location.href = "/users/shelters/"+localStorage.getItem('username')
}

function jumpToMeasure(){
    window.location.href = "/users/measure/"+localStorage.getItem('username')
}

function jumpToAnnouncement(){
    window.location.href = "/users/announcement/"+localStorage.getItem('username')
}

function jumpToProfile(){
    window.location.href = "/users/profile/"+localStorage.getItem('username')
}

function jumpToDonation(){
    window.location.href = "/users/donation/"+localStorage.getItem('username')
}

function jumpToEmergencyContact(){
    window.location.href = "/emergencyContacts/"+localStorage.getItem('username')
}
