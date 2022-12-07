var username = localStorage.getItem('username')
var socket =  io({
    query:{
        user: username
    }
})
socket.on('connect',()=>{  
    updateUserSocketMap(username, socket)
})


publicDonation = []
getAndShowPublicDonation()

socket.on('refreshOtherUserName', (data)=>{

    var dataPassed  =JSON.parse(JSON.stringify(data))
    var currentName = localStorage.getItem('username')
    var formerUsername = dataPassed.formerUsername
    if(currentName === formerUsername){
        var newUsername = dataPassed.username
        localStorage.setItem('username', newUsername)
        window.location.href = "/users/donation/"+newUsername
    }else{
        window.location.reload()
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

socket.on(
    'privilegeChange'
    ,(data)=>{
    var privilege  =
        JSON.parse(
            JSON.stringify(data))
    localStorage.setItem('privilege',privilege)
    if(privilege == "administrator"){

        socket.emit('showActiveUser')
    }else{

        socket.emit('showUser')
    }
})

socket.on('newDonation', function(data){
    var newDonation = JSON.parse(JSON.stringify(data))
    displaySinglePublicDonation(newDonation.itemName, newDonation.description, newDonation.capacity,newDonation.donor, newDonation._id)
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
    location.reload()
})

socket.on('refreshDonation',function(){
        //the donation capactiy should be changed
    location.reload()
})


function getAndShowPublicDonation(){
    $.ajax({
        type: 'get', 
        url: "/donations" ,
        dataType: "json",
        success: function (data, status, jqXHR) {
            const publicDonations = data.data
            for(let i = Math.max(0, publicDonations.length-30); i < publicDonations.length; i++){
                displaySinglePublicDonation(publicDonations[i].itemName, publicDonations[i].description, publicDonations[i].capacity, publicDonations[i].donor, publicDonations[i]._id)
            }
        },
        error: function(jqXHR, status, err){
            alert("public donation wall loading failed", err);
        }
      })
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
        },
        error: function(jqXHR, status, err){
        }
    })
  
}

//item name, description, capacity, donor
function displaySinglePublicDonation(itemName, description, capactiy, donor, donationID){


    const donationItemName = document.createElement('p')
    donationItemName.id ="itemName"
    donationItemName.innerHTML = "Item Name: "+ itemName

    const donationDescription = document.createElement('p')
    donationDescription.id  ="description"
    donationDescription.innerHTML = "Description: "+description

    const donationCapactiy = document.createElement('p')
    donationCapactiy.id="capacity"
    donationCapactiy.innerHTML = "Item left: "+ capactiy

    const donationDonor = document.createElement('p')
    donationDonor.id = "donor"
    donationDonor.innerHTML = "Donor: "+donor

    const donationSubmitBtn = document.createElement("button")
    donationSubmitBtn.className = "btn btn-light"
    donationSubmitBtn.style = "float:right"
    donationSubmitBtn.innerHTML = "Apply"

    donationSubmitBtn.addEventListener("click", (e)=>{
        var itemName = e.currentTarget.parentElement.children[0].innerHTML.substr(11)
        var donor = e.currentTarget.parentElement.children[3].innerHTML.substr(7)
        var capacity = e.currentTarget.parentElement.children[2].innerHTML.substr(11)
        var donationID = e.currentTarget.parentElement.id
        //jump to creating a new request page
        window.location.href = "/users/donationRequest/itemName?"+itemName+"&donor?"+donor+"&capacity?"+capacity+"&donationID?"+donationID

    })

    const donationCardHeader = document.createElement("div")
    donationCardHeader.className = "card-header"

    donationCardHeader.id = donationID
    donationCardHeader.appendChild(donationItemName)
    donationCardHeader.appendChild(donationDescription)
    donationCardHeader.appendChild(donationCapactiy)
    donationCardHeader.appendChild(donationDonor)
    donationCardHeader.appendChild(donationSubmitBtn)

    const donationCard = document.createElement("div")
    donationCard.className = "card text-white bg-secondary mb-3"
    donationCard.style = "max-width: 100%;"
    donationCard.appendChild(donationCardHeader)


    const donationList = document.getElementById("donationContainer");
    donationList.prepend(donationCard)


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


