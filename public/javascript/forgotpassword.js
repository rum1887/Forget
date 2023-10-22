const fform = document.getElementById('forgotpassword_form');

fform.addEventListener('submit', async (e) => {
  e.preventDefault();
  var email=document.getElementById('email').value;
    const email_clarifiy = document.getElementById('email_clarify');
    email_clarifiy.textContent = '';
    email_clarifiy.textContent = "Please wait, do not refresh or resubmit";
    try {
        const res = await fetch('/forgotpassword', { 
          method: 'POST', 
          body: JSON.stringify({email}),
          headers: {'Content-Type': 'application/json'}
        });
        const data = await res.json();
        console.log(data);
        email_clarifiy.textContent = '';
        email_clarifiy.textContent = data.message;
      }
      catch (err) {
        //console.log(err);
      }
});
