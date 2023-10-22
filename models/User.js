const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const addPasswordSchema = new mongoose.Schema({
  
  password_category: {
    type: String,
    required: [true, 'please enter a category'],
  },

  username_a :{
      type: String,
      required: [true, 'please enter a user name'],
  },

  password_hint:{
      type: String,
      required : false
  },

  password_a:{
      type: String,
      required: [true, 'please enter a password']
  },
  password_strength:{
    type: Number,
  }
})

const historySchema = new mongoose.Schema({
  event : {
    type : String,
  },
  time : {
    type : Date,
    default : Date.now
  }
})

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'please enter a email'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true, 
    minlength: 6
  },
  mobile: {
    type: Number,
    required: [true, 'please enter a mobile number'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'please enter a username'],
    unique: true,
    lowercase: true
  },
  addpassword : [addPasswordSchema],
  numberOfVisits:{
    type: Number,
  },
  history : [historySchema],
  resetlink:{
    type:String,
    default:"",
  },
  total_strength:{
    type:Number,
  }
});


// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  if(!this.isModified("password")){
    return next;
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  this.numberOfVisits = 1;
  const event = 'Account Created';
  this.history.push({event});
  next();
});

// static method to login user
userSchema.statics.login = async function(username, password) {
  const user = await this.findOne({username});
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      user.numberOfVisits = user.numberOfVisits+ 1;
      const event = 'User Logged In';
      user.history.push({event});
      user.save();
      //console.log(user.numberOfVisits);
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect username');
};


const User = mongoose.model('user', userSchema);
module.exports = User;