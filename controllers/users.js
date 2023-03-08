const User = require('../models/user');

module.exports.showRegisterForm = (req,res)=>{
    res.render('users/register');
}

module.exports.registerAUser = async(req,res)=>{
    try{ 
        const {email,username,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err =>{
            if(err) return next(err);
            req.flash('success',"Welcome to Yelpcamp!");
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

module.exports.showLoginForm = (req,res)=>{
    res.render('users/login');
}

module.exports.loginAUser = (req,res)=>{
    req.flash('success',"Welcome Back!!");
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next)=> {
    req.logout((err) => {
      if (err) { 
        return next(err); 
        }
      req.flash('success',"GoodBye!!");
      res.redirect('/campgrounds');
    });
  }