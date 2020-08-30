// Our initial setup (package requires, port number setup)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require("cors");
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const mongoose = require("mongoose");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require("./model/econ-po04/user");

const Private = require('./private')

const MONGODB_URL = process.env.MONGODB_URL || Private.db;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sessions'
});
const csrfProtection = csrf();


const corsOptions = {
    origin: Private.url,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};

// Route setup. You can implement more in the future!
const po04Routes = require('./routes/po04');
const authRoutes = require('./routes/auth');

app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(bodyParser({ extended: false })) // For parsing the body of a POST
    .use(
        session({
            secret: Private.mySecreat,
            resave: false,
            saveUninitialized: false,
            store: store
        })
    )
    .use(csrfProtection)
    .use(flash())
    .use((req, res, next) => {
        if (!req.session.user) {
            return next();
        }
        User.findById(req.session.user._id)
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => console.log(err));
    })
    .use((req, res, next) => {
        res.locals.isAuthenticated = req.session.isLoggedIn;
        res.locals.csrfToken = req.csrfToken();
        next();
    })

app.use(po04Routes)
    .use(authRoutes)
    // .use((error, req, res, next) => {
    //     res.status(404).render('pages/500')
    // })
    // .use((req, res, next) => {
    //     // 404 page
    //     res.status(404).render('pages/404');
    // })
mongoose
    .connect(
        MONGODB_URL, options
    )
    .then(result => {
        app.listen(PORT);
        console.log("Running on: localhost:5000")
    })
    .catch(err => {
        console.log(err);
    });