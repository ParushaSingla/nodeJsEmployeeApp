var express = require('express');
var router = express.Router();
const authJwt = require("../middlewares/authJwt");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Parusha`s express' });
});
//GET Registeration Page
router.get('/register',function(req,res,next){
  res.render('./../views/registerForm',{
    message:"Registeration Page"
  })
})
//GET Login Page
router.get('/login',function(req,res,next){
  res.render('./../views/loginForm',{
    message:"Login Page"
  })
})
//LOGOUT from portal
router.get('/logout',authJwt.verifyToken,(req,res)=>{
req.flash('success_msg','Now logged out');
req.session.destroy(function() {
  res.clearCookie('session-key');
  res.clearCookie('jwt');
  res.redirect('/login');
});
})
//GET create opening pages
router.get('/createOpening',[authJwt.verifyToken,authJwt.isManager],function(req,res,next){
    res.render('./../views/createOpening',{
      message:"Create Opening",
      opening:"",
      buttonName:"CREATE"
    })
  })  

module.exports = router;
