const LocalStrategy=require('passport-local').Strategy
const User=require('../models/user')
module.exports = function(passport) {
passport.use(
    new LocalStrategy((username,password,done)=>{
      User.findOne(
          {username},(err,user)=>{
            if(err)
            {
                return done(err)
            }
            if(!user || !user.validatePassword(password))
             {
                return done(null,false,{message : 'Not registered user!!Check Passord and username again'})
             }
             return done(null,user)
          }
      ).populate("roles", "-__v")   
    })
    
)
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
}); 
}