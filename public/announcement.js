var username = localStorage.getItem('username')
var socket =  io({
    query:{
        user: username
    }
})

var userLevel = localStorage.getItem('privilege')
if (userLevel.toLowerCase() == "citizen" ) {
  document.getElementById("annInput").style.display= 'None';
}

//as the user enters public wall page
var users;
var unreadList=[]


socket.on('connect',()=>{  
  updateUserSocketMap(username, socket)
})

socket.on('logout',()=>{

  var data = {'username' : 
              localStorage.getItem('username')}
  
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

// socket.on('newRequest', function(donationID){
//   console.log("gettting request now from socket")
//   localStorage.setItem('newRequest', donationID)
// })


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
drawAllAnnouncements();

function postAnnouncements(){
    var data = {
        'content': $('#formGroupExampleInput').val(),
        'sender': localStorage.getItem('username'),
        'time': Date.now(),
        "token": localStorage.getItem('token')
    };
    document.getElementById("formGroupExampleInput").value=""; 
    $.ajax({
        dataType:"json",
        contentType:'application/json;charset=UTF-8',
        data:JSON.stringify(data),
        type: 'post',
        url: '/announcements',
        success: function (data) {
          displaySingleAnnouncement(data.ret);
          window.scrollTo(0, 0);
        },
        error: function () {
          alert("post announcement failed");
        },
      });

}


function drawAllAnnouncements(){
  $.ajax({
    dataType:"json",
    contentType:'application/json;charset=UTF-8',
    type: 'get',
    url: '/announcements/all',
    success: function (data) {
      const announcements =data.ret;
      for (let i = Math.max(0, announcements.length-30); i < announcements.length; i++) {
  
        displaySingleAnnouncement(announcements[i]);
      }
      
    },
    error: function () {
      alert("draw announcement failed");
    },
  });
}



function displaySingleAnnouncement(data){
  const content = data.content
  const sender = data.sender
  var time = data.time
  const annoucementTitle = document.createElement("span");
  annoucementTitle.style = "float: left;padding-right: 5px;";
  annoucementTitle.innerText = sender;
  const annoucementTime = document.createElement("span");
  annoucementTime.style = "float: right;";
  // console.log(typeof(time))
  time = JSON.stringify(time).substring(1,11) + " " +  JSON.stringify(time).substring(12,20)
  annoucementTime.innerText = time;
  // annoucementTime.innerText = "mytime";

  const announcementCardHeader = document.createElement("div");
  announcementCardHeader.className = "card-header";
  announcementCardHeader.appendChild(annoucementTitle);
  announcementCardHeader.appendChild(annoucementTime);

  const announcementContent = document.createElement("p");
  announcementContent.className = "card-text";
  announcementContent.innerText = content;

  const announcementCardBody = document.createElement("div");
  announcementCardBody.className = "card-body";
  announcementCardBody.appendChild(announcementContent);


  const announcementCard = document.createElement("div");
  announcementCard.className = "card text-white bg-secondary mb-3";
  announcementCard.style = "max-width: 100%;";
  announcementCard.appendChild(announcementCardHeader);
  announcementCard.appendChild(announcementCardBody)
  
  const announcementList = document.getElementById("annoucementContainer");
  announcementList.prepend(announcementCard);

}
function searchInfo(){

  var searchContent = document.getElementById("searchInput").value;

$.ajax({
      contentType: 'application/json; charset=UTF-8',
      type: 'get',
      url: '/info/announcement?content='+searchContent,
      dataType: 'json',
      success: function (data) {
        //get public message search result and store it into localstorage
        announcements = [];
        for(i in data["data"]){
          announcements.push({"content":data["data"][i].content, "sender":data["data"][i].sender, "time":data["data"][i].time.substring(0,10) + " "+ data["data"][i].time.substring(11,19), "senderStatus":data["data"][i].senderStatus});
        }

        localStorage.setItem("searchAnnouncementResult", JSON.stringify(announcements));
        //jump to another page
        window.location.href = "/info/show/announcement";
      },
      error: function(jqXHR){
        console.log('fail to get public message search result');
        var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
        if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
            alert(erMsg);
          }
      }
  });

}


