async function deleteuser(){
    try {
        const res = await fetch('/deleteuser', { 
          method: 'POST', 
          headers: {'Content-Type': 'application/json'}
        });
        location.assign('/login');
      }
      catch (err) {
        console.log(err); 
      }
}

function showform(){
    showPrompt("Enter Master Password ", function(value) {
      let password = value;
      deletepassword(password);
  });
}