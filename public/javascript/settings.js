var error=document.getElementById("error");
var confirm_button=document.getElementById("confirm");
var n_username,n_email,n_number;

confirm_button.addEventListener("click",async(e)=>{
  location.assign('/settings');
});
function showform(){
  document.getElementById("prompt_input").type = "password";

  showPrompt("Enter Master Password ", function(value) {
    let password = value;
    check_password(password);
  
  });
}
async function check_password(password){
  try {
      const res = await fetch('/checkuser', { 
      method: 'POST', 
      body: JSON.stringify({password}),
      headers: {'Content-Type': 'application/json'}
    });
    const data = await res.json();
 
    if( data.status){
      error.innerHTML="click lock details to apply the changes";
      document.getElementById("button-username").disabled=false;
      document.getElementById("button-email").disabled=false;
      document.getElementById("button-number").disabled=false;
    }
    else{
        error.innerHTML="Enter correct Password";
    }
    
  }
  catch (err) {
      console.log(err);
    }
}
function change(id){
  
  var username_pattern=/^[0-9a-zA-Z_.-]+$/;
	var phone_pattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  var email_regularExpression=/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if(id=="button-username"){  
      document.getElementById("prompt_input").type = "text";
      showPrompt("Enter new username", function(value){
        if(!username_pattern.test(value)){
          error.innerHTML='username should not have spaces';
        return;
        }
        if(value.length<8){
          error.innerHTML='username should be atleast 8 characters long';
        return;
        }
        error.innerHTML="";
        n_username=value;
        update(n_username, null, null);

      });

    
  }
  if(id=="button-email"){
      document.getElementById("prompt_input").type = "email";
      showPrompt("Enter new email", function(value){
        if(!email_regularExpression.test(value)){
          error.innerHTML= 'Please enter a valid e-mail address';
        return;
        }
        error.innerHTML="";
        n_email=value;
        update(null, n_email, null);
      });
    
  }
  if(id=="button-number"){
    document.getElementById("prompt_input").type = "tel";
      showPrompt("Enter new number", function(value){
        if(!phone_pattern.test(value)){
          error.innerHTML= 'It is not valid mobile number';
        return;
        }
        error.innerHTML="";
        n_number=value;
        update(null, null, n_number);
      });
  }
  
}
async function update(n_username,n_email,n_number){
      try{
          const res = await fetch('/update', { 
          method: 'POST', 
          body: JSON.stringify({n_username,n_email,n_number}),
          headers: {'Content-Type': 'application/json'}
      });
          const data = await res.json();
          if(data.status){
          
      }
   }
   catch (err){
       console.log(err);
      }
   
}


function showCover() {
  let coverDiv = document.createElement('div');
  coverDiv.id = 'cover-div';

  // make the page unscrollable while the modal form is open
  document.body.style.overflowY = 'hidden';

  document.body.append(coverDiv);
}

function hideCover() {
  document.getElementById('cover-div').remove();
  document.body.style.overflowY = '';
}

function showPrompt(text, callback) {
  showCover();
  let form = document.getElementById('prompt-form');
  let container = document.getElementById('prompt-form-container');
  document.getElementById('prompt-message').innerHTML = text;
  form.text.value = '';

  function complete(value) {
    hideCover();
    container.style.display = 'none';
    document.onkeydown = null;
    callback(value);
  }

  form.onsubmit = function() {
    let value = form.text.value;
    if (value == '') return false; // ignore empty submit

    complete(value);
    return false;
  };

  form.cancel.onclick = function() {
    complete(null);
  };

  document.onkeydown = function(e) {
    if (e.key == 'Escape') {
      complete(null);
    }
  };

  let lastElem = form.elements[form.elements.length - 1];
  let firstElem = form.elements[0];

  lastElem.onkeydown = function(e) {
    if (e.key == 'Tab' && !e.shiftKey) {
      firstElem.focus();
      return false;
    }
  };

  firstElem.onkeydown = function(e) {
    if (e.key == 'Tab' && e.shiftKey) {
      lastElem.focus();
      return false;
    }
  };

  container.style.display = 'block';
  form.elements.text.focus();
}
