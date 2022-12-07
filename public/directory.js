var url = window.location.href;
var strs = url.split('/');
var curUserName = strs[strs.length - 1];
var isAdmin = false;

if(curUserName == "ESNAdmin"){
    localStorage.setItem('privilege', "administrator") 
}


var username = localStorage.getItem('username')
var socket =  io({
    query:{
        user: username
    }
})

//as the user enters public wall page
var users = [];
var unreadList=[]


socket.on('logout',()=>{

    var data = {'username' : localStorage.getItem('username')}
    
    $.ajax({
        type: 'put',
        url: "/users/offline",
        data: JSON.stringify(data),
        dataType: "json",
        headers: { "token": localStorage.getItem('token') },
        success: function (_, _, jqXHR) {
            socket.emit('showUser');
            alert("you has been set to be inactive")
            localStorage.setItem('token', jqXHR.responseText);
            window.location.href = "/";
        },
        error: function () {
            console.log('logout fail');
        }
    })

})


socket.on('connect',()=>{  
    updateUserSocketMap(username, socket)
})

function unreadFromAll(sender){
    unreadList.push(sender);
    console.log("unreadList " + unreadList);
    for(i in users){
        if(users[i].username == sender){
            users[i].unread = true;
        }
    }
}

socket.on('privilegeChange'
          ,(data)=>{
    var privilege  =
        JSON.parse(JSON.stringify(data))
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
        window.location.href = "/users/directory/"+newUsername
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



if(localStorage.getItem('privilege') == "administrator"){
    socket.emit('showUser');
    socket.on('allUsers', users => {
        showUser(users);
    });

}else{
    socket.emit('showActiveUser');
    socket.on('allActiveUsers', users => {
        showUser(users);
    });
}




socket.on('privateMsg', msg => {
    
    getUnreadList();


})

getUnreadList();


function showUser(allusers) {
    users = [];
    var HTML = "";

    for(u in allusers){
        // console.log(msg[p].sender);
        if(unreadList.includes(allusers[u].username)){
            users.push({"username": allusers[u].username,"online":allusers[u].online, "status":allusers[u].status, "unread": true});
        }else{
            users.push({"username": allusers[u].username,"online":allusers[u].online, "status":allusers[u].status, "unread": false});
        }
        
    }
    getUserProfile();

}

function getUnreadList(){
    
    username =localStorage.getItem("username")
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/messages/public/alarmList',
        data: {
            'username': username,
        },
        success: function (res) {

            for(var i=0; i<res.senderlist.length; i++){
                console.log("senderlist: "+res.senderlist[i]);
                unreadFromAll(res.senderlist[i])
            }
            reloadDirectory();
        }
    });
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
        success: function () {
            console.log(username+" directory socket update success", socket.id)
        },
        error: function(){
        }
    })

}

function enterAdminUserProfile(userToEdit){
    console.log(userToEdit);
    localStorage.setItem("userToEdit", userToEdit);
    window.location.href = "/users/adminUserProfile/" + curUserName;
}

function displayCard(users){
    var usernamedata =users.username;

        var statusdata = users.status;
        var unreaddata = users.unread;
        var online = users.online;

        
        const card = document.createElement("div");
        card.style = "max-width: 100%;";
        card.className = "card text-white bg-secondary mb-3";
        if(users.online == true){
            card.className = "card bg-light mb-3"; 
        }


        const header = document.createElement("div")
        header.className = "card-header"
        header.style = "display:flex; justify-content: center;align-items: center;";

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
                statusimg.src = "/pic/black_dot.png"
        }
        statusimg.width = "10"
        statusimg.height = "10"

        const userUnread = document.createElement("img")
        userUnread.style = "float: right;";
        userUnread.src = "/pic/unread.png"
        userUnread.width = "30"
        userUnread.height = "30"

        const cardBody = document.createElement("div");
        cardBody.style = "float: left; width:90%;";
        cardBody.appendChild(username);
        cardBody.appendChild(statusimg);
        cardBody.appendChild(userUnread);
        
        cardBody.addEventListener("click", (e)=>{ 
            var myname = localStorage.getItem("username")
            enterPrivateChat(usernamedata, myname);
        })

        header.appendChild(cardBody);
        //read or not
        if(unreaddata==true){
            userUnread.hidden = false;
        }else{
            userUnread.hidden = true;
        }




        if(localStorage.getItem('privilege') == "administrator"){
            const edit = document.createElement("img")
            edit.style = "float: right;";
            edit.src = "/pic/edit.png";
            edit.width = "30";
            edit.height = "30";
            edit.onclick = function(){
                enterAdminUserProfile(usernamedata);
               
            }
            
           header.appendChild(edit);
        };

        card.appendChild(header)
        // card.appendChild(cardBody);
        document.getElementById("directoryContainer").appendChild(card)

}

function reloadDirectory(){
    document.getElementById("directoryContainer").innerHTML = "";
   
    for(var i=0 ; i < users.length;i++){
        displayCard(users[i]);
    }
}


function enterPrivateChat(username, myname){
    

    sender =  myname;
    receiver = username
    window.location.href = "/messages/private/sender="+sender+'&receiver='+receiver

}





function getUserProfile(){
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/admin?username=' + curUserName,
        dataType: 'json',
        headers: { "token": localStorage.getItem('token') },
        success: function (data) {
          if(data.ret.length){
            var prevPrivilege = data.ret[0].privilege;
            if(prevPrivilege){
                prevPrivilege = prevPrivilege.toLowerCase();
            }
            if(prevPrivilege == "administrator"){
                isAdmin = true;
            }
          }
          reloadDirectory();
        },
        error: function(jqXHR){
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
            console.log(erMsg);
            if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                alert(erMsg);
            }
        }
    });


}
