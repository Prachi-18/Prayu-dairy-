var passport = require('passport');
var User = require('../models/user');
const e = require('express');
var LocalStrategy = require('passport-local').Strategy;
var valuesArray = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C',
'D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','@','-','!','_','0','1','2','3','4','5','6'
,'7','8','9'];
passport.serializeUser(function(user,done){
    done(null,user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err,user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'mobile',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, mobile, password, done){
        var fname = req.body.fname;
        var lname = req.body.lname;
        var email = req.body.email;
        
        req.checkBody('mobile','Invalid mobile no.').notEmpty().isMobilePhone();
       // req.checkBody('password','Invalid password. Use min. 8 digits, alphanumeric, and _ @ - ! characters only.').notEmpty().isLength({min:8}).isIn(valuesArray);
        req.checkBody('email','Write email in email format').isEmail();
        var errors = req.validationErrors();
        if(errors){
            var messages = [];
            errors.forEach(function(error){
                messages.push(error.msg);
            });
            return done(null,false,req.flash('error',messages));
        }
        User.findOne({'mobile':mobile}, function(err, user){
          if(err){
              return done(err);
          }  

          if(user){
              return done(null, false, {message: 'Account already exists with this mobile no.'});
          }

          

          var newUser = new User();
          newUser.fname = fname;
          newUser.lname = lname;
          newUser.mobile = mobile;
          newUser.email = email;
          newUser.password = newUser.encryptPassword(password);
          newUser.save(function(err,result){
            if(err){
                return done(err);
            }
            return done(null,newUser);
          });
        });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'mobile',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, mobile, password, done){
    req.checkBody('mobile','Invalid mobile no.').notEmpty().isMobilePhone();
    req.checkBody('password','Invalid password. Use min. 8 digits, alphanumeric, and _ @ - ! characters only.').notEmpty();
    
     var errors = req.validationErrors();
     if(errors){
         var messages = [];
         errors.forEach(function(error){
             messages.push(error.msg);
         });
         return done(null,false,req.flash('error',messages));
     }

     User.findOne({'mobile':mobile}, function(err, user){
        if(err){
            return done(err);
        }  

        if(!user){
            return done(null, false, {message: 'No user found'});
        }
        if(!user.validPassword(password)){
            return done(null, false, {message: 'Incorrect password. Try again'}); 
        }
        
          return done(null,user);
        
      });
}));
