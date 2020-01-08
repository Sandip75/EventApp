const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to DB
// mongoose.connect(db , {useNewUrlParser:true})
// .then(()=> console.log('MongoDB connected'))
// .catch( err => console.log(err));
mongoose.connect(
        db,
    {useNewUrlParser : true },
    ()=>{
       console.log('Connect to DB!');
    });

//EJS
app.use(expressLayout);
app.set('view engine' , 'ejs');

//Body parser
app.use(express.urlencoded({extended:false}));

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash 
app.use(flash());

//Global Variable
app.use((req , res , next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes 
app.use('/' , require('./routes/index'));
app.use('/user' , require('./routes/user'));


const PORT = process.env.PORT ||  4069 ;

app.listen(PORT , console.log(`Server started on port ${PORT}`));