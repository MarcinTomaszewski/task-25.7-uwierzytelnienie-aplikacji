//przypisanie wymaganych paczek do zmiennych instalacja przy pomocy komendy (npm install express passport passport-google-oauth)
var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config.js');
var app = express();
var googleProfile = {};

//utworzenie ustawień początkowych wymaganych do uruchomienia passporta
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

//konfiguracja żądania autoryzacji do Google. Tworzymy instancje klasy GoogleStrategy i podajemy w niej dane z config.js. W odpowiedzi będziemy otrzymywać profil użytkownika, więc w tym miejscu przypiszemy go do zmiennej googleProfile.
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, cb) {
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName,            
        };
        cb(null, profile);
    }
));

//ustawienie silników widoku(pug) oraz inicjalizacja passporta
app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

//tworzenie odpowiednich endpointów aplikacji
//app routes
app.get('/', function (req, res) {
    res.render('index', { user: req.user });
});

app.get('/logged', function (req, res) {
    res.render('logged', { user: googleProfile });
});

//Passport routes
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/logged',
        failureRedirect: '/'
    }));

app.listen(3000);
