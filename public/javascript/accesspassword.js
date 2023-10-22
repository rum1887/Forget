async function displaydeets(id,password){
  var x = document.getElementById("div_"+id);
      try {
      const res = await fetch('/displaydeets', { 
        method: 'POST', 
        body: JSON.stringify({id, password}),
        headers: {'Content-Type': 'application/json'}
      });
      const data = await res.json();
      console.log(data);
      if (data.status) {
          x.className += " w3-show";
      }
      else{
          alert('Invalid Password');
      }
    }
    catch (err) {
      console.log(err);
    }

}
function hidedata(x){
  x.className = x.className.replace(" w3-show", "");

}
async function deletepassword(id,password){
  try {
      const res = await fetch('/delpassword', { 
        method: 'POST', 
        body: JSON.stringify({id,password}),
        headers: {'Content-Type': 'application/json'}
      });
      const data = await res.json();
      console.log(data);
      if (data.status) {
        location.assign('/accesspassword');
      }
      else {
          alert('Invalid Password');
      }
    }
    catch (err) {
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



 function showform(id,c){
if(c==1){
  var x = document.getElementById("div_"+id);
  if (x.className.indexOf("w3-show") == -1){
  showPrompt("Enter Master Password ", function(value) {
    let password =  value;
    displaydeets(id,password);
  });
}
else{
  hidedata(x);
}
}
else if(c==2){
  showPrompt("Enter Master Password ", function(value) {
    let password = value;
    deletepassword(id,password);
  });
}

}

function myFunction() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
      } else {
          li[i].style.display = "none";
      }
  }
}
