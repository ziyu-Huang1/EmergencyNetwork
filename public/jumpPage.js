var userLevel = localStorage.getItem('privilege')

console.log("hiide");
if (userLevel.toLowerCase() != "administrator") {
    document.getElementById("jumpToMeasure").style.display= 'None';
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
function jumpToShelter(){
    window.location.href = "/users/shelters/"+localStorage.getItem('username')
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

function jumpToDelivery(){
    var url = window.location.href;
    var strs = url.split('/');
    username = strs[strs.length - 1];
    window.location.href = "/users/deliverys/"+username
}