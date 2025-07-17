const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); // Защита HTTP-заголовков
const rateLimit = require('express-rate-limit'); // Ограничение числа запросов
const csurf = require('csurf'); // CSRF-защита
const fs = require('fs');
const https = require('https');
require('dotenv').config();
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('./models/user-model');

const app = express();
const PORT = process.env.PORT || 5000;

// Helmet — безопасные заголовки (XSS, clickjacking и др.)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://jwt.io", "https://developers.google.com"],
            connectSrc: ["'self'", "http://localhost:5000", "https://localhost:5000", "ws://localhost:5000"],
            fontSrc: ["'self'", "data:"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"]
        }
    }
}));

// Rate limiting — ограничение числа запросов (например, 100 в 15 минут с одного IP)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // лимит на 100 запросов
    standardHeaders: true,
    legacyHeaders: false,
}));

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
app.use(cookieParser());

// CSRF — защита от межсайтовых запросов (только для production)
if (process.env.NODE_ENV === 'production') {
    app.use(csurf({ cookie: true }));
}

// Сессии для passport (можно заменить на JWT, но для Google OAuth требуется session для initial flow)
app.use(session({
    secret: process.env.SESSION_SECRET || 'jwt-auth-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // для production: true + https
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await UserModel.findOne({ googleId: profile.id });
        if (!user) {
            // Если email уже есть — связываем
            user = await UserModel.findOne({ email: profile.emails[0].value });
            if (user) {
                user.googleId = profile.id;
                user.displayName = profile.displayName;
                user.avatar = profile.photos?.[0]?.value;
                await user.save();
            } else {
                user = await UserModel.create({
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    displayName: profile.displayName,
                    avatar: profile.photos?.[0]?.value,
                    isActivated: true
                });
            }
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        // Временно всегда запускать HTTPS для локальной разработки
        if (true) { // if (process.env.NODE_ENV === 'production') {
            // HTTPS only in production (или всегда для теста)
            const key = fs.readFileSync('./certs/server.key');
            const cert = fs.readFileSync('./certs/server.cert');
            https.createServer({ key, cert }, app).listen(PORT, () =>
                console.log(`HTTPS server started on port: ${PORT}`)
            );
        } else {
            app.listen(PORT, () => console.log(`Server started on port: ${PORT} `));
        }
    } catch (e) {
        console.log(e);
    }
}

start()
