const express = require('express');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const config = require('./config');
const session = require('express-session');
const bodyParser = require('body-parser');



const app = express();

app.use(bodyParser.json());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.secret
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new Auth0Strategy({
    domain: config.auth0.domain,
    clientID: config.auth0.clientID,
    clientSecret: config.auth0.clientSecret,
    callbackURL: '/auth/callback'
}, function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
}));

const port = 3000;


app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',
    passport.authenticate('auth0', { successRedirect: '/', failureRedirect: '/auth' })

)

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.get('/me', function(req, res) {
    if (!req.user) return res.sendStatus(404);
    console.log(req.user)
    res.status(200).send(req.user);
})




app.listen(3000, function() {
    console.log('Listening on port', port)
})