reform = document.getElementById('resetpassword_form');
reform.addEventListener('submit', async (e) => {
  e.preventDefault(); 
  const resetlink = document.getElementById('relink').value;
  var password=document.getElementById("Pass").value;
  var repassword=document.getElementById("Re_Pass").value;
  const passwordError = document.getElementById('password_error');

  var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  if(password == "" || password == null){
      passwordError.textContent = 'Password Field Empty';
      return false;
  }
  else if(!regularExpression.test(password)) {
      passwordError.textContent = 'Password should contain atleast one number and one special character';
      return false;
  }
  else if(repassword == "" || repassword == null){
    passwordError.textContent = 'Repeat password field empty!!';
      return false;
  }
  else if(password != repassword){
      passwordError.textContent = 'Password match error';

      return false;
  } 
  
  try {
      const res = await fetch('/resetpassword', { 
        method: 'POST', 
        body: JSON.stringify({password,resetlink}),
        headers: {'Content-Type': 'application/json'}
      });
      const data = await res.json();
      console.log(data.status);
      if (data.status) {
          location.assign('/');

      }
 
    }
    catch (err) {
      console.log(err);
    }
});
  
  
  
//   async function resetPasswordClicked(resetlink){
  
// }