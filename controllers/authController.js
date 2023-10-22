const User = require("../models/User");
const jwt = require('jsonwebtoken');
const moment=require('moment');
const bcrypt = require('bcrypt');
const nodemailer=require('nodemailer');
const sendgrid = require('@sendgrid/mail');

// handle errors
const handleErrors = (err) => {
  //console.log(err.message, err.code);
  let errors = { email: '', password: '', mobile: '', username:'', cred:''};

  // duplicate error
  if (err.code === 11000) {
    console.log(err.message)
    errors.cred = 'These credentials already exist';
    return errors;
  }

  // incorrect username
  if (err.message === 'incorrect username') {
    errors.username = 'That username is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // validation errors
  if (err.message.includes('user validation failed')) {

    Object.values(err.errors).forEach(({ properties }) => {
 
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}
// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id },  process.env.jwt_secret, {
    expiresIn: maxAge
  });
};



// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  const token = req.cookies.jwt; 
    if (token) {
      jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          res.redirect('/welcome')
        }
      });   
    } else {
      res.render('login');
    }
}

module.exports.signup_post = async (req, res) => {
  const{ email, password, mobile, username } = req.body;

  try {
    const user = await User.create({ email, password, mobile, username });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const message = handleErrors(err);
    res.status(400).json({ message });
  }
 
}

module.exports.login_post = async (req, res) => {
  const {username, password} = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    console.log("ERROR")
    res.status(400).json({errors});
  }
}

module.exports.logout_get = (req, res) => {
  const token = req.cookies.jwt; 
  jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
      let user = await User.findById(decodedToken.id); 
      const event = 'User Logged Out';
      if(user)
      {user.history.push({event});
      user.save();}
  });
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

module.exports.welcome_get = (req, res) =>{
  const token = req.cookies.jwt; 
    if (token) {
      jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          let user = await User.findById(decodedToken.id); 
          let count = await User.estimatedDocumentCount();
          res.render('welcome',{userobj:user, moment:moment, count:count});
        }
      });   
    } else {
      res.redirect('/login');
    }
}

module.exports.deleteuser_get = (req, res) =>{
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
      res.redirect('/logout');
      let user = await User.findById(decodedToken.id);
      user.remove({_id:decodedToken.id});
    });
  }
}

module.exports.accounthistory_get = (req, res) =>{
  const token = req.cookies.jwt; 
    if (token) {
      jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect('/login');
        } else {
          let user = await User.findById(decodedToken.id); 
          res.render('accounthistory',{userobj:user, moment:moment});
        }
      });   
    } else {
      res.redirect('/login');
    }
}

module.exports.forgotpassword_get=(req,res)=>{
  res.render("forgotpassword");
}
module.exports.forgotpassword_post= async (req,res)=>{
  const {email} = req.body;
   const user=await User.findOne({email:email});
     if(user!=null){
      const token=jwt.sign({_id:user._id},process.env.RESET_PASSWORD_KEY,{expiresIn: '10m'});

        sendgrid.setApiKey(process.env.SEND_GRID);
          
        var mailOptions={
          from: 'hackthis404@gmail.com',
          to: email,
          subject : "Password reset",
          html :`<h2> Please click on given link to reset your password</h2>
                  <a href="${process.env.CLIENT_URL}/resetpassword/${token}">Click here</a>`
        };

        user.updateOne({resetlink:token},function(err,success){
          if(err){
            return res.status(404).json({message :"reset password link error"});
          }
          else{
            sendgrid.send(mailOptions).then(() => {
              res.status(200).json({ message: "Mail sent"});
             }, error => {
              console.error(error);
              res.status(200).json({ message: "Mail not sent" }); 
              if (error.response) {
                console.error(error.response.body)
              }
            });
          }
        });
     }
     else{
      res.status(404).json({ message: "That Email is not reg" });  

     }
}

module.exports.resetpassword_get= async(req,res)=>{
  var resettoken=req.params.token;
  if(resettoken){
    jwt.verify(resettoken,process.env.RESET_PASSWORD_KEY, async function(err,decoded_token){
      if(err){
        return res.status(401).json({error:"Incorrect token ot it is expired"});
      }
      const user=await User.findOne({resetlink:resettoken});
      if(user){
        res.render('resetpassword',{resetlink:resettoken});
      }
      else{
        return res.status(401).json({error:"user with this token doesn't exist"});
      }
    });
  }
  else{
    return res.status(401).json({error:"authentication error"});
  }
}

module.exports.resetpassword_post= async (req,res)=>{
  var {password,resetlink}=req.body;
  const user=await User.findOne({resetlink:resetlink});
  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(password, salt);
  user.updateOne({password:password},function(err,success){
   if(err){
    res.status(200).json({ status: false });  
   }
   else{
    const event = 'Master Password Reset Successful';
      user.history.push({event});
      user.save();
    res.status(200).json({ status: true });  
   }
   
  });

  user.updateOne({resetlink:null}, function(err,success){
    if(err){
    }
    else{
      //console.log("Success");
    }
  });

}