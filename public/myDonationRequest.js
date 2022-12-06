console.log("enterinnnnn")
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

getAndShowMyDonationRequest()
console.log("enterinnnnn")
function updateUserSocketMap(username, socket){
    console.log("enterinnnnn")
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

function getAndShowMyDonationRequest(){
    var data = {'donee': localStorage.getItem('username')};
    console.log("local:"+localStorage.getItem('username'))
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'put', 
        url: "/donations/myRequests" ,
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data, status, jqXHR) {
            const myDonationRquests = data.data
            for(let i = Math.max(0, myDonationRquests.length-30); i < myDonationRquests.length; i++){
                displaySinglePublicDonation(myDonationRquests[i].itemName, myDonationRquests[i].status)
            }
        },
        error: function(jqXHR, status, err){
            alert("myDonationRquests loading failed", err);
        }
      })
}

function displaySingleMyDonationRequest(itemName, status){
//     <!-- <div class="card text-white bg-secondary mb-3" style="max-width: 100%;" onclick="location.href = '/views_refactor_temp/private_chat.html'"> 
//     <div class="card-header">
//         <p id="itemName" style="float: left;padding-right: 5px;">User1</p>
//         <p id="status" style="float: right">pending</p>
//     </div>
//   </div>
    const myDonationRequestItemName = document.createElement('p')
    myDonationRequestItemName.id = "itemName"
    myDonationRequestItemName.style = "float: left;padding-right: 5px;"
    myDonationRequestItemName.innerHTML = itemName


    const myDonationRequestStatus = document.createElement('p')
    myDonationRequestStatus.id = "status"
    myDonationRequestStatus.style = "float: right"
    myDonationRequestStatus.status = status

    const myDonationRequestCardHeader = document.createElement('div')
    myDonationRequestCardHeader.class = "card-header"
    myDonationRequestCardHeader.appendChild(myDonationRequestItemName)
    myDonationRequestCardHeader.appendChild(myDonationRequestStatus)

    const myDonationRequestCard = document.createElement('div')
    myDonationRequestCard.class = "card text-white bg-secondary mb-3"
    myDonationRequestCard.style = "max-width: 100%;"
    myDonationRequestCard.appendChild(myDonationRequestCardHeader)

    const myDonationRequestList = document.getElementById("myDonationRequestContainer")
    myDonationRequestList.prepend(myDonationRequestCard)
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