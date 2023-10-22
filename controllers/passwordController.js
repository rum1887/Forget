const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
var {encrypt, decrypt} = require('../models/aescrypto');

module.exports.addpassword_get = (req, res) => {
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
      } else {
          let user = await User.findById(decodedToken.id);
           res.render('addpassword', {userobj:user});  
      }
    });
  }
  else{
    res.redirect('/login');
  }
  }
module.exports.accesspassword_get = (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
          if (err) {
            res.locals.user = null;
          } else {
              let user = await User.findById(decodedToken.id);
               res.render('accesspassword', {allpasswords:user.addpassword, decrypt:decrypt, userobj:user});  
          }
        });
      } else {
        res.redirect('/login');
      }
}
module.exports.addpassword_post = async (req, res) => {
  const { password_category, username_a, password_hint, password_a, password_strength } = req.body;
  try {
    
   // const addp = {password_category, username_a, password_hint, password_a, password_strength, total_strength };
    const token = req.cookies.jwt;
    let totalstrength; 
    if (token) {
      jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
        } else {
            let user = await User.findById(decodedToken.id);
             if(user.addpassword.length==0)
              totalstrength = Math.round((password_strength/16)*100);
            else
              totalstrength = Math.round((((user.total_strength*16*user.addpassword.length/100) + password_strength)/(16*(user.addpassword.length+1)))*100);
            user.updateOne({total_strength:totalstrength},function(err,success){
                  if(err){
                   //res.status(200).json({ status: false });  
                  }
                  else{
                   
                  }
            });
            const addp = {password_category, username_a, password_hint, password_a, password_strength};
            addp.password_a = encrypt(addp.password_a);
            user.addpassword.push(addp);
            const event = 'New Password Category: '+ password_category + ' Added';
            user.history.push({event});
            const updated = await user.save();   
        }
      });
    } else {
      res.redirect('/login');
    }
  }
  catch(err) {
      console.log(err);
  }
  }
  module.exports.delpassword_post = async(req, res) =>{
    const { id, password } = req.body;
    const token = req.cookies.jwt;
    if(password != null){
    if(token){
        jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
            if (err) {
            //   res.locals.user = null;
            } else {
                let user = await User.findById(decodedToken.id);
                let pass = user.addpassword.id(id);
                const auth = await bcrypt.compare(password, user.password);
                if(auth){
                let ts = Math.round((((user.total_strength*16*user.addpassword.length/100) - pass.password_strength)/(16*(user.addpassword.length-1)))*100);
                const event = 'Delete Password Category: '+pass.password_category +' SUCCESSFUL';
                user.addpassword.remove({_id:id});
                user.updateOne({total_strength:ts},function(err,success){
                  if(err){
                   //res.status(200).json({ status: false });  
                  }
                  else{
                   //const event = 'Username Updated';
                     //user.history.push({event});
                     //user.save();
                   //res.status(200).json({ status: true });  
                  }
                });
                user.history.push({event});
                user.save(); 
                res.status(200).json({ status: true });  
                }
                else{
                  const event = 'Delete Password Category: '+pass.password_category +'  FAILED';
                  user.history.push({event});
                  user.save(); 
                  res.status(200).json({ status:false });
                }
            }
          });
    }
  }
  }

  module.exports.displaydeets_post = async(req, res) =>{
    const { id , password} = req.body;
    const token = req.cookies.jwt;
    if(password != null){ 
    if(token){
        jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
            if (err) {
            //   res.locals.user = null;
            } else {
                let user = await User.findById(decodedToken.id);
                let pass = user.addpassword.id(id);
                const auth = await bcrypt.compare(password, user.password);
                if(auth){
                const event = 'Access to Password Category: '+pass.password_category +' Request SUCCESSFUL';
                user.history.push({event});
                user.save(); 
                res.status(200).json({ status:true });  
                }
                else{
                  const event = 'Access to Password Category: '+pass.password_category +' Request FAILED';
                  user.history.push({event});
                  user.save(); 
                  res.status(200).json({ status:false });
                }
            }
          });
    }
  }
  }
module.exports.userprofile_get = async (req, res) =>{
  const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
          if (err) {
            res.locals.user = null;
          } else {
              let user = await User.findById(decodedToken.id);
              res.render('userprofile', {userobj:user});  
          }
        });
      } else {
        res.redirect('/login');
      }
}

module.exports.settings_get = async (req, res) => {
  const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
          if (err) {
            res.locals.user = null;
          } else {
              let user = await User.findById(decodedToken.id);
              res.render('settings', {userobj:user});  
          }
        });
      } else {
        res.redirect('/login');
      }
}

module.exports.checkuser_post = async (req, res) => {
  const {password} = req.body;
    const token = req.cookies.jwt;
    if(password != null){ 
    if(token){
        jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
            if (err) {
            //   res.locals.user = null;
            } else {
                let user = await User.findById(decodedToken.id);
                const auth = await bcrypt.compare(password, user.password);
                if(auth){
                res.status(200).json({ status:true });  
                }
                else{
                  console.log("wrong")
                  res.status(200).json({ status:false });
                }
            }
          });
    }
  }
}

module.exports.passwordstrength_get = async (req, res) =>{
  const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
          if (err) {
            res.locals.user = null;
          } else {
              let user = await User.findById(decodedToken.id);
               res.render('passwordstrength', {allpassword:user.addpassword, decrypt:decrypt, userobj: user});  
          }
        });
      } else {
        res.locals.user = null;
      }
}

module.exports.update_post = async (req, res) => {
  const {n_username,n_email,n_number} = req.body;
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.jwt_secret, async (err, decodedToken) => {
            if (err) {
            } else {
                let user = await User.findById(decodedToken.id);
                
               if(n_username!=null && n_username!=""){
                user.updateOne({username:n_username},function(err,success){
                  if(err){
                   //res.status(200).json({ status: false });  
                  }
                  else{
                   const event = 'Username Updated';
                     user.history.push({event});
                     user.save();
                   //res.status(200).json({ status: true });  
                  }
            });
               }
               if(n_email!=null && n_email!=""){
                user.updateOne({email:n_email},function(err,success){
                  if(err){
                   //res.status(200).json({ status: false });  
                  }
                  else{
                   const event = 'Email Updated';
                     user.history.push({event});
                     user.save();
                   //res.status(200).json({ status: true });  
                  }
            });
               }
               if(n_number!=null && n_number!=""){
                user.updateOne({mobile:n_number},function(err,success){
                  if(err){
                   //res.status(200).json({ status: false });  
                  }
                  else{
                   const event = 'Phone number Updated';
                     user.history.push({event});
                     user.save();
                   //res.status(200).json({ status: true });  
                  }
            });
               }
          }
    });
  }
  res.json({status : true});

}