const express = require('express');
const routes = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//models 
const User = require('../models/User');

//Login Page
routes.get('/login' , (req , res) =>{
    res.render('login');
});

//Register Page
routes.get('/register' , (req , res)=>{
    res.render('register');
})

//Register Handler 
routes.post('/register' , (req , res)=>{
    const {name , email , password , password2 } = req.body;
    let errors = [] ;

    //Validation check 
    if(!name || !email || !password || !password2){
        errors.push({msg : 'Please fill in all filed'});
    }

    if(password  !== password2){
        errors.push({msg : 'Passworded should be same'});
    }

    if(password.length < 3){
        errors.push({msg : 'Password length should be greater than 6 character'});
    }

    if(errors.length > 0 ){
        res.render('register' , {
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        User.findOne({email : email})
        .then( user => {
            if(user){
                //User exist
                errors.push({msg : 'Email is already registered'});
                res.render('register' , {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = User({
                    name,
                    email,
                    password
                });

                //Hash password
                bcrypt.genSalt(10 , (err , salt )=>
                   bcrypt.hash(newUser.password , salt , (err , hash)=>{
                        if(err) throw err;
                        //set Passworded to hashed
                        newUser.password = hash;

                        newUser.save()
                        .then( user => {
                            req.flash('success_msg','You are now registered and can log in');
                            res.redirect('/user/login');
                        })
                        .catch(err => console.log(err));
                   })
                );
            }
        })
        .catch(err => console.log(err) );
    }
});

// Login
routes.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/user/login',
      failureFlash: true
    })(req, res, next);
  });
  
  // Logout
  routes.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
  });

module.exports = routes;