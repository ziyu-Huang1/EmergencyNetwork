var username = localStorage.getItem('username')
var socket =  io({
    query:{
        user: username
    }
})

socket.on('connect',()=>{  
    updateUserSocketMap(username, socket)
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

socket.on('refreshOtherUserName', (data)=>{

    var dataPassed  =JSON.parse(JSON.stringify(data))
    var currentName = localStorage.getItem('username')
    var formerUsername = dataPassed.formerUsername
    if(currentName === formerUsername){
        var newUsername = dataPassed.username
        localStorage.setItem('username', newUsername)
        window.location.href = "/users/public/"+newUsername
    }else{
        window.location.reload()
    } 
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

//as the user enters public wall page
//each time it change page, the usermap(socket should be updated)
socket.emit('showWall')

socket.on('allMsg', msg => {
    show(msg);
})


socket.emit('showUser');
socket.on('allUsers', users => {
  console.log("on allUser");
  showUser(users);
});


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

var users;
function showUser(allusers) {

    users = [];
    var HTML = "";
    for(u in allusers){
        
        if(unreadList.includes(allusers[u].username)){
            users.push({"username": allusers[u].username,"online":allusers[u].online, "status":allusers[u].status, "unread": true});
        }else{
            users.push({"username": allusers[u].username,"online":allusers[u].online, "status":allusers[u].status, "unread": false});
        }
        
    }
    reloadDirectory();
    
}


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
            //console.log(username+" socket update success")
        },
        error: function(jqXHR, status, err){
            //console.log(username+" socket update failed")
        }
    })

}

function reloadDirectory(){
    console.log("reload directory")

    for(var i=0 ; i < users.length;i++){

        var usernamedata =users[i].username;
        var statusdata = users[i].status;
        var unreaddata = users[i].unread;
        
        const card = document.createElement("div");
        card.style = "max-width: 100%;";
        card.className = "card text-white bg-secondary mb-3";
        if(users[i].online == false){
            card.className = "card bg-light mb-3"; 
        }
 

        const header = document.createElement("div")
        header.className = "card-header"

        const username = document.createElement("span")
        username.innerHTML = usernamedata
        username.style = "float: left;padding-right: 5px;"

        const statusimg = document.createElement("img")
        switch(statusdata){
            case "ok":
                statusimg.src = "/pic/green_dot.png"
                break;
            case "help":
                statusimg.src = "/pic/yellow_dot.png"
                break;
            case "emergency":
                statusimg.src = "/pic/red_dot.png"
                break;
            default:
                statusimg.src = "/pic/green_dot.png"
        }
        statusimg.width = "10"
        statusimg.height = "10"

        const userUnread = document.createElement("img")
        userUnread.style = "float: right;";
        userUnread.src = "/pic/unread.png"
        userUnread.width = "30"
        userUnread.height = "30"


        //read or not
        if(unreaddata==true){
            userUnread.hidden = false;
        }else{
            userUnread.hidden = true;
        }


        header.appendChild(username)
        header.appendChild(statusimg)
        header.appendChild(userUnread)

        card.appendChild(header)

        document.getElementById("efg").appendChild(card)

    }
}




function show(msg){

    
    data = [];
    var HTML = "";
    for(p in msg){
        data.push({"sender": msg[p].sender, 
        "content": msg[p].content, 
        "time": msg[p].time.substring(0, 10) + " " + msg[p].time.substring(11, 19), 
        "status": msg[p].senderStatus});
    }
    document.getElementById("publicWallContainer").innerHTML = ""

    for(var i=0;i<data.length;i++){
        
        const time = data[i].time;
        const content = data[i].content;
        const sender = data[i].sender;
        const status = data[i].status;

        const card = document.createElement("div");
        card.style = "max-width: 100%;"
        card.className = "card text-white bg-secondary mb-3"

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

        document.getElementById("publicWallContainer").appendChild(card)

        var pw = document.getElementById("publicWallContainer");
        $(window).scrollTop(pw.scrollHeight);

    }
}


function postPublicMessage() {

    var data = {
      'content': $('#postMessage').val(),
      'sender': localStorage.getItem('username'),
      'receiver': "",
      'type': 'public',
      'status':localStorage.getItem('status'),
    }

    $.ajax({
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(data),
      type: 'post',
      url: '/messages/public',
      dataType: 'json',
      success: function (data, status, jqXHR) {
        socket.emit("showWall");
      }
    });
    $('#postMessage').val("");
  };

function getUnreadList(){
    url = window.location.href;
    var strs = url.split('/');
    username = strs[strs.length - 1];
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/messages/public/alarmList',
        data: {
            'username': username,
        },
        success: function (res) {
            
            for(var i=0; i<res.senderlist.length; i++){
                
                unreadFromAll(res.senderlist[i])
            }
        }
    });
}

function searchInfo(){
    var searchContent = document.getElementById("searchInput").value;

    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/info/messages/public?content='+searchContent,
        dataType: 'json',
        success: function (data, status, jqXHR) {
            messages = [];
            for(i in data["data"]){
                messages.push({"content":data['data'][i].content, "sender":data['data'][i].sender, "time":data['data'][i].time,"senderStatus":data['data'][i].senderStatus});
            }
            localStorage.setItem("searchPublicResult", JSON.stringify(messages));
            //jump to another page
            window.location.href = "/info/show/publicMessages";
        },
        error: function(jqXHR, status, err){
            console.log('fail to get public message result');
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
            if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                alert(erMsg);
            }
        }
    });
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

