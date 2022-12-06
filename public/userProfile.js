var username = localStorage.getItem('username')
var socket =  io({
    query:{
        user: username
    }
})
socket.on('connect',()=>{  
    updateUserSocketMap(username, socket)
})


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
            console.log('logout success');
            alert("you has been set to be inactive")
            // localStorage.setItem('token', jqXHR.responseText);
            localStorage.setItem('token', jqXHR.responseText);
            window.location.href = "/";
        },
        error: function () {
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

socket.on('newRequest', function(donationID){
    var prev_newRequestList= JSON.parse(localStorage.getItem('newRequest'))
    if(prev_newRequestList.indexOf(donationID)<=-1){
        prev_newRequestList.push(donationID)
    }console.log("newwww"+prev_newRequestList)
    if(prev_newRequestList.length>0) document.getElementById("myDonation").hidden=false
    localStorage.setItem('newRequest', prev_newRequestList)
})

socket.on('newReply', function(requestID){
    var prev_newReplyList = JSON.parse(localStorage.getItem('newReply'))
    if(prev_newReplyList.indexOf(requestID)<=-1){
        prev_newReplyList.push(requestID)
    }
    if(len(prev_newReplyList)>0) document.getElementById("myRequest").hidden=false
    localStorage.setItem('newReply', prev_newReplyList)
})

getNewRequestList()
getNewReplyList()

function getNewRequestList(){
    //if(localStorage.getItem('newRequest') === null){
        username =localStorage.getItem("username")
        $.ajax({
            contentType: 'application/json; charset=UTF-8',
            type: 'get',
            url: '/donations/otherRequest/pendingList',
            data: {
                'username': username,
            },
            success: function (res) {
                if(res.data.length>0){
                    document.getElementById("myDonation").hidden=false
                }else{
                    document.getElementById("myDonation").hidden=true
                }
                var list = []
                for(var i=0; i<res.data.length; i++){
                    console.log("getNewRequestList: "+res.data[i]);
                    list.push(res.data[i])
                }
                localStorage.setItem('newRequest', JSON.stringify(list))
            }
        });
    //}
}

function getNewReplyList(){
    username =localStorage.getItem("username")
    var data={
        'username': username,
    }
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'put',
        url: '/donations/unreadReplyList',
        dataType: 'json',
        success: function (data) {
            //console.log()
            if(data["data"].length>0){
                document.getElementById("myRequest").hidden=false
            }else{
                document.getElementById("myRequest").hidden=true
            }
            var list = []
            if(data["data"] == null) return;
            for(var i=0; i<data["data"].length; i++){
                console.log("getNewRequestList: iiiiiiiiiiiiiiiiiiiii"+data["data"][i]);
                list.push(data["data"][i])
            }
            localStorage.setItem('newReply', JSON.stringify(list))
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
            //console.log(username+" directory socket update success")
        },
        error: function(){
            //console.log(username+" directory socket update failed")
        }
    })

}

function selectShareStatus(){
    var statusGroup=document.getElementsByName('status');
    var curstatus;
    for(i = 0; i < statusGroup.length; i++){
        if(statusGroup[i].checked){
            curstatus=statusGroup[i].id;
        }
    }

    url = window.location.href;
    var strs = url.split('/');
    var data = {
        'sender': strs[strs.length-1],
        'time': new window.Date(),
        'status': curstatus
    }
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'post',
        url: '/status',
        dataType: 'json',
        headers: { "token": localStorage.getItem('token') },
        success: function () {
            console.log("users status is set to " + curstatus);
            localStorage.setItem('status', curstatus);
        }
    });
}
function jumpToMyRequest(){
    window.location.href = "/users/donation/myRequest/"+localStorage.getItem('username')
}

function jumpToMyDonations(){
    window.location.href = "/users/donation/myDonations/"+localStorage.getItem('username')
}




function sendPutRequestToLogout() {
    updateUserSocketMap(username, socket)
    url = window.location.href;
    var strs = url.split('/');
    var data = { 'username': strs[strs.length - 1] };
    console.log('jqXHR.responseText'+localStorage.getItem('token'));

    // console.log(localStorage.getItem("token"));
    $.ajax({
        type: 'put',
        url: "/users/offline",
        data: JSON.stringify(data),
        dataType: "json",
        headers: { "token": localStorage.getItem('token') },
        success: function (_, _, jqXHR) {
            socket.emit('showUser');
            console.log('logout success');
            // localStorage.setItem('token', jqXHR.responseText);
            localStorage.setItem('token', jqXHR.responseText);
            window.location.href = "/";
        },
        error: function () {
            console.log('logout fail');
        }
    })
}

function backToChatPage(){
    url = window.location.href;
    var strs = url.split('/');
    var username=strs[strs.length - 1];
    window.location.href= "/users/" + username;
};

// function jumpToPublicWall(){
//     window.location.href = "/users/public/"+localStorage.getItem('username')
// }

// function jumpToDirectory(){
//     window.location.href = "/users/directory/"+localStorage.getItem('username')
// }

// function jumpToMeasure(){
//     window.location.href = "/users/measure/"+localStorage.getItem('username')
// }

// function jumpToAnnouncement(){
//     window.location.href = "/users/announcement/"+localStorage.getItem('username')
// }

// function jumpToProfile(){
//     window.location.href = "/users/profile/"+localStorage.getItem('username')
// }

// function jumpToDonation(){
// window.location.href = "/users/donation/"+localStorage.getItem('username')
// }