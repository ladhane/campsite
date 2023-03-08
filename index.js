if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require("express");
const PORT = 8084;
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");
const mongoose = require("mongoose");
const passport = require('passport');
const localStrategy = require('passport-local');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const User = require('./models/user');
const MongoStore = require('connect-mongo');

mongoose.set('strictQuery', false);
// const dbUrl = process.env.DB_URL;
const dbUrl = 'mongodb://127.0.0.1:27017/yelpcamp';
mongoose.connect(dbUrl);


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const sessionConfig = {
   store: MongoStore.create({
    mongoUrl: dbUrl,
    secret: 'ThisShouldBeABetterSecret!',
    touchAfter: 24 * 60 * 60
  }),
    name:'session',
    secret: 'ThisShouldBeABetterSecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (1000 * 60 * 60 *24 *7),
        maxAge: 1000 * 60 * 60 *24 *7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // make sure to use passport.session() after app.use(session());

passport.use(new localStrategy(User.authenticate())); // authenticate method is not defined in user model but it comes from passportLocalMongoose used in the model

passport.serializeUser(User.serializeUser()); // method to tell how to store a user in session
passport.deserializeUser(User.deserializeUser()); // method to tell how to get a user out of a session


app.use((req,res,next)=>{
    if (!['/login', '/register', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',users);
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.get("/", (req, res) => {
  res.render("home");
});


app.all("*", async (req, res, next) => {
  next(new ExpressError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).render("error", { err });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});
