
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

const sform = document.getElementById('signupform');
const emailError = document.getElementById('email_error');
const passwordError = document.getElementById('password_error');
const nameError = document.getElementById('username_error');
const mobileError = document.getElementById('number_error');
const credError = document.getElementById('cred_error')
  sform.addEventListener('submit', async (e) => {
    e.preventDefault();
    // reset errors
    emailError.textContent = '';
    passwordError.textContent = '';
    nameError.textContent = '';
    mobileError.textContent = '';

    // get values
    const email = sform.email.value;
    const password = sform.password.value;
    const mobile = sform.mobile.value;
    const username = sform.username.value;
	  const repassword = sform.repassword.value;

    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
	var phone_pattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  var email_regularExpression=/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if(username == null || username == ""){
		nameError.textContent = 'username cannot be blank';
		return false;
	}
	else if(username.length<8){
		nameError.textContent = 'username should be atleast 8 characters long';
		return false;
	}
	else if(!(/^[0-9a-zA-Z_.-]+$/.test(username))){
			nameError.textContent = 'username should not have spaces';
			return false;
		}
	else if(!email_regularExpression.test(email)){
		emailError.textContent = 'Please enter a valid e-mail address';
		return false;
	}
	else if (!phone_pattern.test(mobile)) {
        mobileError.textContent = 'It is not valid mobile number';
        return false;
     }
    else if(password == "" || password == null){
    	passwordError.textContent = 'Password Field Empty';
    	return false;
    }
	else if(!regularExpression.test(password)) {
        passwordError.textContent = 'password should contain atleast one number and one special character';
        return false;
    }
    else if(repassword == "" || repassword == null){
    	alert("repeat password field empty!!")
    	return false;
    }
	else if(password != repassword){
		alert("password match error");
		return false;
	} 

    try {
      const res = await fetch('/signup', { 
        method: 'POST', 
        body: JSON.stringify({ email, password, mobile, username }),
        headers: {
          'Content-Type': 'application/json'}
      });
      const data = await res.json();
      if (data.message) {
        credError.textContent =data.message.cred;
      }
      if (data.user) {
        location.assign('/welcome');
      }
    }
    catch (err) {
      console.log(err);
    }
  });

const lform = document.getElementById('loginform');
const lnameError = document.getElementById('name_error_login');
const lpasswordError = document.getElementById('password_error_login');

  lform.addEventListener('submit', async (e) => {
    e.preventDefault();
    // reset errors
    lnameError.textContent = '';
    lpasswordError.textContent = '';
    // get values
    const username = lform.username.value;
    const password = lform.password.value;

    if(username == null || username == ""){
      lnameError.textContent = 'username cannot be blank';
      return false;
    }
    else if(password == "" || password == null){
    	lpasswordError.textContent = 'Password Field Empty';
    	return false;
    }

    try {
      const res = await fetch('/login', { 
        method: 'POST', 
        body: JSON.stringify({ username, password}),
        headers: {'Content-Type': 'application/json'}
      });
      const data = await res.json();
      console.log(data);
      if (data.errors) {
        lnameError.textContent = data.errors.username;
        lpasswordError.textContent = data.errors.password;
      }
      if (data.user) {
        location.assign('/welcome');
      }
    }
    catch (err) {
      console.log(err);
    }
  });