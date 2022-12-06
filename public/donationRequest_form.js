var username = localStorage.getItem('username')
var socket =  io({
    query:{
        user: username
    }
})
var url = window.location.href
var content = url.split("/")[5]
var itemName = content.split("&")[0].split("?")[1]
var donor = content.split("&")[1].split("?")[1]
var capacity = content.split("&")[2].split("?")[1]
var donationID = content.split("&")[3].split("?")[1]


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

socket.on('newReply', function(requestID){
    var prev_newReplyList = JSON.parse(localStorage.getItem('newReply'))
    if(prev_newReplyList.indexOf(requestID)<=-1){
        prev_newReplyList.push(requestID)
    }
    localStorage.setItem('newReply', prev_newReplyList)
})

loadItemName(itemName)

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



function submitDonationRequest(){
    var requestNum = $('#requestNum').val()
    if(isNaN(requestNum)){
        alert("Please enter valid request number!")
        location.reload()
    }else if(parseInt(requestNum)<=0){
        alert("Please enter request number larger than 0!")
        location.reload()
    }
    else if(parseInt(requestNum) > parseInt(capacity)){
        //left number is not enough
        alert("You can not request more than "+capacity+" "+itemName+"!")
        location.reload()
    }else{

        var data = {
            'itemName': itemName,
            'capacity': capacity,
            'donor': donor,
            'donee': localStorage.getItem('username'),
            'reason': $('#reason').val(),
            'requestNum': requestNum,
            'donationID': donationID
        }
    
        //clear all the inputPlace
        document.getElementById("itemName").value="";
        document.getElementById("reason").value="";
        document.getElementById("requestNum").value="";
    
    
        $.ajax({
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data),
            type: 'post',
            url: '/donations/request',
            dataType: 'json',
            success: function (data) {
                var newRequest = data["data"]
                addRequestData = {
                    'donationID': donationID,
                    "requestID": newRequest._id
                }
    
                //after request creation, add it into the donation's request list
                $.ajax({
                    contentType: 'application/json; charset=UTF-8',
                    data: JSON.stringify(addRequestData),
                    type: 'put',
                    url: '/donations/addRequest',
                    dataType: 'json',
                    success: function () {
                        window.location.href = "/users/donation/"+localStorage.getItem('username')
                        //window.history.go(-1);
                    },
                    error: function(_, _, err){
                      alert("addd new request failed", err)
                        //console.log(username+" directory socket update failed")
                    }
                })
    
            },
            error: function(_, _, err){
              alert("submit new donations failed", err)
                //console.log(username+" directory socket update failed")
            }
        })
    }

  }

function loadItemName(itemName){
    document.getElementById("itemName").innerHTML = itemName

}

function jumpToPublicWall(){
    window.location.href = "/users/public/"+localStorage.getItem('username')
}

function jumpToDirectory(){
    window.location.href = "/users/directory/"+localStorage.getItem('username')
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