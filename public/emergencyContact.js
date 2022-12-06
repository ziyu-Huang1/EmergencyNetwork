var username = localStorage.getItem('username');
var socket =  io({
    query:{
        user: username
    }
})

var users;
var unreadList=[]

updateUserSocketMap(username, socket)

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



// function jumpToPublicWall(){
//     window.location.href = "/users/public/"+ username;
// }

// function jumpToDirectory(){
//     window.location.href = "/users/directory/"+ username;
// }

// function jumpToMeasure(){
//     window.location.href = "/users/measure/"+ username;
// }

// function jumpToAnnouncement(){
//     window.location.href = "/users/announcement/"+ username;
// }

// function jumpToProfile(){
//     window.location.href = "/users/profile/"+ username;
// }
// function jumpToEmergencyContact(){
//     window.location.href = "/emergencyContacts/"+username;
// }

// function cancleEdit(){

//     window.location.href = "/emergencyContacts/"+ username;

// }

loadContacts()

function loadContacts(){
    $.ajax({
      dataType:"json",
      contentType:'application/json;charset=UTF-8',
      headers: {'token': localStorage.getItem('token')},
      type: 'get',
      url: '/emergencyContacts/contacts/' + username,
      success: function (data, _, _) {
        if (data.data){
            const contact1 = data.data.contact1;
            const contact2 = data.data.contact2;
            const contact3 = data.data.contact3;
    
            console.log(contact1,contact2,contact3)
    
            if (contact1 != "undefined"){
                $('#contact1').val(contact1);
            }
            if (contact2 != "undefined"){
                $('#contact2').val(contact2);
            }
            if (contact3 != "undefined"){
                $('#contact3').val(contact3);
            }

        }
       
      },
      error: function () {
        alert("load contacts failed ");
      },
    });
  }



// check contact1 input
$( "#contact1" ).on("input",function() {
 
    if (($('#contact1').val() == username 
    || $('#contact1').val() == $('#contact2').val() 
    || $('#contact1').val() == $('#contact3').val()) && $('#contact1').val() != "") {
        $('#contact1').css("color", "red");
    }else {
        $('#contact1').css("color", "black");
    }
  });

// check contact2 input
  $( "#contact2" ).on("input",function() {
    if (($('#contact2').val() == username 
  || $('#contact2').val() == $('#contact1').val()
  || $('#contact2').val() == $('#contact3').val())&& $('#contact2').val() != "") {
        $('#contact2').css("color", "red");
    }else {
        $('#contact2').css("color", "black");
    }
  });

  // check contact3 input
  $( "#contact3" ).on("input",function() {
    if (($('#contact3').val() == username
  || $('#contact3').val() == $('#contact1').val()
  || $('#contact3').val() ==  $('#contact2').val()) && $('#contact3').val() != "") {
        $('#contact3').css("color", "red");
    }else {
        $('#contact3').css("color", "black");
    }
  });

function confirmEdit(){
    const contact1 = $('#contact1').val();
    const contact2 = $('#contact2').val();
    const contact3 = $('#contact3').val();
    // self emergency contact alert
    if (contact1 == username || contact2 == username || contact3 == username) 
    {
        alert("Cannot add youself as your Emergency Contact");
        return
    }

    // no repetition alert
    if ((contact1 == contact2 && contact1 != "") || 
        (contact1 == contact3 && contact1 != "")||
        (contact2 == contact3 && contact2 != "")){
        alert("You added the same person more than once");

        return 
    } 

    data = {'username': username, 'contact1': contact1, "contact2": contact2, 'contact3': contact3};
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'put',
        headers: {'token': localStorage.getItem('token')},
        url: '/emergencyContacts/contactLists/' + username,
        dataType: 'json',
        success: function () {
            window.location.href = "/emergencyContacts/"+localStorage.getItem('username')
        },
        error: function(jqXHR, _, _){
           
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg
            var contact = jQuery.parseJSON(jqXHR.responseText).errors[0].contact;
            if (jqXHR.status == 404 && erMsg == "No such user found" ) {
                if (contact1 == contact){
                    $('#contact1').css("color", "red");
                }
                if (contact2 == contact){
                    $('#contact2').css("color", "red");
                }
                if (contact3 == contact){
                    $('#contact3').css("color", "red");
                }
                alert(contact + " not found");
              }
        }
    })


}

function sendEmergencMessage(){
    const contact1 = $('#contact1').val();
    const contact2 = $('#contact2').val();
    const contact3 = $('#contact3').val();
    const message = $('#emergencyMessageInput').val()
    data = {'username': username, 'contact1': contact1, "contact2": contact2, 'contact3': contact3, "message" : message};
    if (message == ""){
        alert("your message is empty");
        return
    }
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'post',
        headers: {'token': localStorage.getItem('token')},
        url: '/emergencyContacts/messages',
        dataType: 'json',
        success: function () {
            alert('your message is sent to all contacts');
            $('#emergencyMessageInput').val("") ;
        },
        error: function(jqXHR, _, _){
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg
            var contact = jQuery.parseJSON(jqXHR.responseText).errors[0].contact;
            alert('cannot send messages');
                
        }
    })

}



function editForm(){
    window.location.href = "/emergencyContacts/contactLists/"+localStorage.getItem('username')

}