var username = localStorage.getItem('username')
var curShelter = ""
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

function postShelter(){
    if (checkInput()){
        let food = "true"
        if ($('#food').val().toLocaleString() == "no"){
            food = "false"
        }
        let medicine = "true"
        if ($('#medicine').val().toLocaleString() == "no"){
            medicine = "fasle"
        }
        var data = {
            'address': $('#address').val(),
            'creator': username,
            'maxCapacity': $("#maxCapacity").val(),
            'foodProvided': food,
            'medicineProvided': medicine
        }
        $.ajax({
            dataType:"json",
            contentType:'application/json;charset=UTF-8',
            data:JSON.stringify(data),
            type: 'post',
            url: '/shelters',
            success: function (data) {
                displaySingleShelter(data.ret);
                window.scrollTo(0, 0);
            },
            error: function () {
                alert("post shelter failed");
            },
        });

        $('#address').val("")
        $("#maxCapacity").val("")
        $('#food').val("")
        $('#medicine').val("")
    }
}

function checkInput(){
    const numReg = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
    let capacityValidity = numReg.test($("#maxCapacity").val());
    if (!capacityValidity){
        alert("Please enter numbers for capacity");
        $("#maxCapacity").focus();

        return false;
    }
    if ($('#address').val().length == 0){
        alert("Please input address");
        $("#address").focus();

        return false;
    }
    if ($('#food').val().toLocaleString() != "yes" && $('#food').val().toLocaleString() != "no"){
        alert("Please enter appropriate input");
        $("#food").focus();

        return false;
    }
    if ($('#medicine').val().toLocaleString() != "yes" && $('#medicine').val().toLocaleString() != "no"){
        alert("Please enter appropriate input");
        $("#medicine").focus();

        return false;
    }
    return true;
}

function drawAllShelters(){
    $.ajax({
        dataType:"json",
        contentType:'application/json;charset=UTF-8',
        type: 'get',
        url: '/shelters/',
        success: function (data) {
            const shelters =data.ret;
            
            document.getElementById("shelterContainer").innerHTML = "";
            for (let i = Math.max(0, shelters.length-30); i < shelters.length; i++) {
               

                displaySingleShelter(shelters[i]);
            }

        },
        error: function () {
            alert("draw shelters failed");
        },
    });
}


function joinShelter(shelterAddress) {
    var data = {
        'address': shelterAddress,
        'username': username
    }
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'put',
        url: '/shelters/join',
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.ret == "join success"){
                curShelter = shelterAddress;
            }
            joinConfirm(data.ret)
            drawAllShelters();
        },
        error: function(){
            joinConfirm("The shelter might be deleted, please find another")
            drawAllShelters();
        }
    })
}

function leaveShelter() {
    var data = {
        'address': curShelter,
        'username': username
    }
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'put',
        url: '/shelters/leave',
        dataType: 'json',
        async: false,
        success: function () {
            curShelter = "";
            leaveHide();
            drawAllShelters();
        },
        error: function(){
            joinConfirm("The shelter might be deleted, you leave the shelter automatically")
            curShelter = "";
            leaveHide();
            drawAllShelters();
        }
    })
}

function deleteShelter() {
    const deleteAddress = document.getElementById("confirm-modal_body").innerHTML
    var data = {
        'address': deleteAddress,
        'username': username
    }
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'delete',
        url: '/shelters/delete',
        dataType: 'json',
        success: function () {
            hide();
            drawAllShelters();
        },
        error: function(){
            console.log(username+"delete shelter failed")
        }
    })
}

function deleteConfirm(address){
    $("#confirm-modal_body").html(address);
    $('#confirmModal').modal('show');
}

function leaveConfirm(){
    $("#confirm-modal_body-leave").html("Address: " + curShelter);
    $('#confirmLeaveModal').modal('show');
}

function joinConfirm(result){
    $("#model-totle-join").html(result);
    $('#confirmJoinModal').modal('show');
}

function hide(){
    $('#confirmModal').modal('hide');
}

function leaveHide(){
    $('#confirmLeaveModal').modal('hide');
}

function joinHide(){
    $('#confirmJoinModal').modal('hide');
}

function displaySingleShelter(shelter){
    const shelterAddress = document.createElement("span");
    shelterAddress.style = "float: left;padding-right: 5px;";
    shelterAddress.innerText = "Address: " + shelter.address;

    const creator = document.createElement("span");
    creator.style = "float: right;";
    creator.innerText = "Creator: " + shelter.creator;

    const shelterCardHeader = document.createElement("div");
    shelterCardHeader.className = "card-header";
    shelterCardHeader.appendChild(shelterAddress);
    shelterCardHeader.appendChild(creator);

    const shelterContentMax = document.createElement("p");
    shelterContentMax.className = "card-text";
    shelterContentMax.innerText = "Max capacity: " + shelter.maxCapacity;

    const shelterContentCur = document.createElement("p");
    shelterContentCur.className = "card-text";
    shelterContentCur.innerText = "Cur capacity: " + shelter.curCapacity;

    const shelterContentFood = document.createElement("p");
    shelterContentFood.className = "card-text";
    shelterContentFood.innerText = "Food provided: " + shelter.foodProvided;

    const shelterContentMedicine = document.createElement("p");
    shelterContentMedicine.className = "card-text";
    shelterContentMedicine.innerText = "Medicine provided: " + shelter.medicineProvided;

    const buttonPlace = document.createElement("p");

    if (curShelter == shelter.address){
        const leaveButton = document.createElement("button");
        leaveButton.className = "btn btn-primary";
        leaveButton.innerText = "leave"
        leaveButton.style = "margin: 4px"
        leaveButton.onclick = function () {
            
            leaveConfirm();
        }
        buttonPlace.appendChild(leaveButton)
    }
    else{
        const joinButton = document.createElement("button");
        joinButton.className = "btn btn-primary";
        joinButton.innerText = "Join"
        joinButton.style = "margin: 4px"
        joinButton.onclick = function () {
            joinShelter(shelter.address);
        }
        buttonPlace.appendChild(joinButton)
    }

    if (username == shelter.creator){
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-primary";
        deleteButton.innerText = "delete"
        deleteButton.style = "margin: 4px"
        deleteButton.onclick = function () {
            
            deleteConfirm(shelter.address)
        }
        buttonPlace.appendChild(deleteButton)
    }

    const shelterCardBody = document.createElement("div");
    shelterCardBody.className = "card-body";
    shelterCardBody.appendChild(shelterContentMax);
    shelterCardBody.appendChild(shelterContentCur);
    shelterCardBody.appendChild(shelterContentFood);
    shelterCardBody.appendChild(shelterContentMedicine);
    shelterCardBody.appendChild(buttonPlace);

    const shelterCard = document.createElement("div");
    shelterCard.className = "card text-white bg-secondary mb-3";
    shelterCard.style = "max-width: 100%;";
    shelterCard.appendChild(shelterCardHeader);
    shelterCard.appendChild(shelterCardBody)

    const shelterList = document.getElementById("shelterContainer");
    shelterList.prepend(shelterCard);
}

function stateCheck(){

    $.ajax({
        dataType:"json",
        contentType:'application/json;charset=UTF-8',
        type: 'get',
        url: '/shelters/state',
        data: {
            'username': username
        },
        async: false,
        success: function (data) {
            
            curShelter = data.ret[0].shelter

        },
        error: function () {
            alert("get state failed");
        },
    });

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
function jumpToShop(){
    window.location.href = "/users/shop/"+localStorage.getItem('username')
}

function jumpToEmergencyContact(){
    window.location.href = "/emergencyContacts/"+localStorage.getItem('username')
}

function jumpToDonation(){
    window.location.href = "/users/donation/"+localStorage.getItem('username')
}

stateCheck()

drawAllShelters();