/**
 * Created by xiaoyi on 2015/5/11.
 */
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = "311294709063394";
var FACEBOOK_APP_SECRET = "12da188967046fa29d0ab7e3e946e331";
passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://www.example.com/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(accessToken);
    }
));