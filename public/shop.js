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

    var data = {'username' : 
                localStorage.getItem('username')}
    
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

socket.on('privilegeChange',(data)=>{
  var privilege  =JSON.parse(JSON.stringify(data))
  localStorage.setItem('privilege',privilege)
  if(privilege == "administrator"){

      socket.emit('showActiveUser')
  }else{

      socket.emit('showUser')
  }
})


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

function jumpToShop(){
    window.location.href = "/users/shop/"+localStorage.getItem('username')
}

function jumpToJoinDetail(){
  window.location.href = "/users/shop/detail/"+localStorage.getItem('username')
}
function jumpToShopPublish(){
  window.location.href = "/users/shop/event/"+localStorage.getItem('username')
}
function jumpToShopCart(){
  window.location.href = "/users/shop/cart/"+localStorage.getItem('username')
}
function publishEvent() {
  if($('#slotInput')[0].value < $('#minInput')[0].value){
    alert("Please make sure available slots is greater than the minimum number")
  }else if(isNaN($('#slotInput')[0].value) || isNaN($('#minInput')[0].value)){
    alert("Please make sure available slots and minimum number are numerical values")
  }else if($('#slotInput')[0].value <= 0 || $('#minInput')[0].value < 0){
    alert("Please make sure available slots is positive and minimum number is not less than 0")
  }else{
    var data = {
      'title': $('#eventTitleInput')[0].value,
      'description': $('#descriptionInput')[0].value,
      'max': $('#slotInput')[0].value,
      'min': $('#minInput')[0].value,
      'initiator': localStorage.getItem("username"),
      'member':[],
      'status': "in-progress"
    }
  
    $.ajax({
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(data),
      type: 'post',
      url: '/shop',
      success: function (data, status, jqXHR) {
        alert("You successfully published an event!")
        console.log("publish event success")
      },
      error: function (jqXHR, status, err) {
        console.log("publish event err")
    },
    });
  }
};

function addMember(title, newMember){
    var data = {
        'title': title,
        'newMember': newMember,
    }
      $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'post',
        url: '/shop/member',
        dataType: 'json',
        success: function (data, status, jqXHR) {
          console.log("member success")
          checkMemberByTitle(title)
        }
    });
}

function checkMemberByTitle(t){
  $.ajax({
    type: 'get',
    url: '/shop/title',
    data: {
      'title': t,
    },
    success: function (data) {
        var event = data['eventlst'][0]
        if (event['member'].length >= event['max']){
          updateStatus(t, "success")
        }
    },
    error: function (_, _, err) {
        console.log(err)
    },
});
}

function endEvent(t){
  $.ajax({
    type: 'get',
    url: '/shop/title',
    dataType: 'json',
    data: {
      'title': t,
    },
    success: function (data) {
        var event = data['eventlst'][0]
        if (event['member'].length >= event['min']){
          updateStatus(t, "success")
          alert("You successfully end an event!")
        }else{
          removeEvent(t)
          alert("Minimum of people is not reached, event canceled.")
        }
    },
    error: function (jqXHR, status, err) {
        console.log(err)
    },
});
}

function removeEvent(t){
  $.ajax({
    type: 'delete',
    url: '/shop/title',
    data: {
      'title': t,
    },
    success: function (data, status, jqXHR) {
      console.log("event removed")
    },
    error: function (jqXHR, status, err) {
        console.log(err)
    },
});
}

function updateStatus(title, newStatus){
    var data = {
        'title': title,
        'newStatus': newStatus,
    }
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'post',
        url: '/shop/status',
        dataType: 'json',
        success: function (data, status, jqXHR) {
          console.log("status success")
        },
        error: function (jqXHR, status, err) {
            console.log("?")
        },
    });

    console.log("update success")

}

function getAll(){
      $.ajax({
        type: 'get',
        url: '/shop',
        success: function (data, status, jqXHR) {
          for(var i=0; i<data['eventlst'].length; i++){
            var event = data['eventlst'][i]
            createEventCard(event)
          }
        },
        error: function (jqXHR, status, err) {
            console.log(err)
        },
    });
}



function createEventCard(event, white){
  // titleData, slotData, descriptionData
  var titleData = event['title']
  var slotData = 'slots: '+event['member'].length+'/'+event['max']
  var descriptionData = event['description']
  /* <div class="card text-white bg-secondary mb-3" >
<div class="card-header">
    <span style="float: left; padding-right: 5px;">Shopping Event Title</span>
    <span style="float: right;">slots: 2/5</span>
</div>
<div class="card-body">
<p class="card-text" style="float: left; width: 70%;">maybe part of description here xxxxxx</p>
<button type="button" onclick="jumpToJoinDetail()" class="btn btn-dark" style="float: right;"> <b>VIEW</b></button>
</div>
</div> */
  const card = document.createElement("div");
        card.style = "max-width: 100%;";
        card.className = "card text-white bg-secondary mb-3";
        if(white != null && white == "white"){
          card.className = "card bg-light mb-3";
        }

        const header = document.createElement("div")
        header.className = "card-header"

        const title = document.createElement("span")
        title.innerHTML = titleData
        title.style = "float: left;padding-right: 5px;"

        const slot = document.createElement("span")
        slot.innerHTML = slotData
        slot.style = "float: right"

        const body = document.createElement("div")
        body.className = "card-body"

        const description = document.createElement("p")
        if(descriptionData.length > 50){
          descriptionData = descriptionData.substring(0, 50) + "..."
        }
        description.innerHTML = descriptionData
        description.className = "card-text"
        description.style = "float: left; width: 70%;"

        const button = document.createElement("button")
        button.type = "button"
        button.className = "btn btn-dark"
        button.onclick = "jumpToJoinDetail()"
        button.style = "float: right"
        button.innerHTML = "VIEW"

        button.addEventListener("click", (e)=>{
          localStorage.setItem("shopTitle", titleData)
          jumpToJoinDetail()
      })

        header.appendChild(title)
        header.appendChild(slot)
        body.appendChild(description)
        body.appendChild(button)
        card.appendChild(header)
        card.appendChild(body)

        if(white == null){
          document.getElementById("eventContainer").appendChild(card)
        }else{
          document.getElementById("cardEventContainer").appendChild(card)
        }
        

}

function showEventDetail(event){
  // titleD, initiatorD, descriptionD, slotD, remainingD, statusD, memberD
  var titleD = event['title']
  var initiatorD = event['initiator']
  var descriptionD =event['description']
  var slotD = 'slots: '+event['member'].length+'/'+event['max']
  var remainingD = Math.max(0, event['min'] - event['member'].length)
  var statusD = event['status']
  var memberD = event['member']
//   <div id = "eventDetail" style="margin: 5%">
//   <h1 class="display-4" style="font-size: 40px">A Bag of Apples</h1>
//   <p class="lead">by Alice Smith</p>
//   <hr class="my-4">
//   <p> Some descriptions: It uses utility classes for typography and spacing to space content out within the larger container.</p>
//   <p> slots: 5/7</p>
//   <p> Need 5 more people to start!</p>
//   <p class="lead">
//     <a class="btn btn-dark" role="button" style="float: right;">Join Now!</a>
//   </p>
// </div>
  const title = document.createElement("h1");
  title.className = "display-4"
  title.style = "font-size: 40px"
  title.innerHTML = titleD

  const ini = document.createElement("p")
  ini.className = "lead"
  ini.innerHTML = "by " + initiatorD

  const hr = document.createElement("hr")
  hr.className = "my-4"

  const de = document.createElement("p")
  de.innerHTML = descriptionD

  const sl = document.createElement("p")
  sl.innerHTML = slotD

  const r = document.createElement("p")
  r.innerHTML = "Need "+ remainingD + " people to start!"

  const m = document.createElement("p")
  console.log(memberD)
  m.innerHTML = "Members Joined: "+ memberD

  const st = document.createElement("p")
  st.innerHTML =  "status: " + statusD.toUpperCase()
  if(statusD == "success"){
    st.style = "color: green"
  }else{
    st.style = "color: orange"
  }
  
  const end = document.createElement("p")
  end.className = "lead"

  const b = document.createElement("a")
  b.className = "btn btn-dark"
  b.role = "button"
  b.style = "float: right; color: white"

  if(localStorage.getItem("username") == initiatorD){ //if user is initiator
    b.innerHTML = "End Event"
    b.addEventListener("click", (e)=>{
      endEvent(titleD)
    })

    const b2 = document.createElement("a")
    b2.className = "btn btn-dark"
    b2.role = "button"
    b2.style = "margin-left: 30%;color: white"
    b2.innerHTML = "Cancel Event"
    b2.addEventListener("click", (e)=>{
      removeEvent(titleD)
      alert("You successfully canceled the event!")
    })
    end.appendChild(b2)
  }else{
    b.innerHTML = "Join Now!"
    b.addEventListener("click", (e)=>{
      addMember(titleD, localStorage.getItem("username"))
      alert("You successfully joined the event!")
    })
  }
  if(!(localStorage.getItem("username") != initiatorD && statusD == "success")){
    end.appendChild(b)
  }
  

  const ed = document.getElementById("eventDetail")
  ed.appendChild(title)
  ed.appendChild(ini)
  ed.appendChild(hr)
  ed.appendChild(de)
  ed.appendChild(sl)
  ed.appendChild(r)
  if(localStorage.getItem("username") == initiatorD){ 
    ed.append(m)
  }
  ed.appendChild(st)
  ed.appendChild(end)
}

function getByTitle(t){
  $.ajax({
    type: 'get',
    url: '/shop/title',
    data: {
      'title': t,
    },
    success: function (data) {
        var event = data['eventlst'][0]
        showEventDetail(event)
    },
    error: function (_, _, err) {
        console.log(err)
    },
});
}

function getByInitiator(initiator){
    $.ajax({
      type: 'get',
      url: '/shop/initiator',
      data: {
        'initiator': initiator,
      },
      success: function (data, status, jqXHR) {
        for(var i=0; i<data['eventlst'].length; i++){
          var event = data['eventlst'][i]
          createEventCard(event, "black")
        }
      },
      error: function (jqXHR, status, err) {
          console.log(err)
      },
  });
}

function getByMember(member){
    $.ajax({
      type: 'get',
      url: '/shop/member',
      data: {
        'member': member,
      },
      success: function (data, status, jqXHR) {
        for(var i=0; i<data['eventlst'].length; i++){
          var event = data['eventlst'][i]
          createEventCard(event,"white")
        }
      },
      error: function (jqXHR, status, err) {
          console.log(err)
      },
  });
}
