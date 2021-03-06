var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

function isAdminAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect("/error");
	}
}

router.get('/logout', isAdminAuthenticated, function(req, res, next) {
	res.redirect('/logout');
});

router.post('/delete', isAdminAuthenticated, function(req, res, next) {
	var ret = {};
	User.remove({username: req.body.username}, function(err){
		if(err) {
			ret.success = false;
			ret.err = err;
		}else{
			ret.success = true;
		}
		res.send(ret);
	});
});

router.get('/', isAdminAuthenticated, function(req, res, next) {
	var ret = {};
	User.find({isAdmin: false}, function(err, users) {
		if(err) {
			ret.success = false;
			ret.err = err;
		}else{
			ret.success = true;
			ret.data = users;
		}
		res.send(JSON.stringify(ret));
	});
});

router.post('/auth', passport.authenticate('local', { failureRedirect: '/error' }), function(req, res) {
	if(req.user.isAdmin) {
		res.redirect("/good");
	}else{
		res.redirect("/error");
	}
});

module.exports = router;
