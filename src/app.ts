import express from 'express';
import login_Check from './check.ts';
import dbOperations from './db_operations.ts';
import Authenticate from './authenticate.ts';
import passHash from './passhash.ts'
import type {authenticate_user_signup_request, authenticate_user_login_reques, user_db_schema, keys} from './schemas.ts'
import bodyParser from 'body-parser';
import {pool} from './db_connect.ts'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { v4 } from 'uuid';
import { error } from 'node:console';


export const app: express.Application = express();
const port: number = 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
}));

app.get('/', (_req, _res) => {
    _res.render('index', {result: null});
});

app.get('/login', (_req, _res) => {
    _res.render('login', {result: null});
});

app.post('/login', express.urlencoded({extended: true}), async function login(_req, _res) {
    // variables
    const body: authenticate_user_login_reques = _req.body;
    const keys: keys<authenticate_user_login_reques> = ['email', 'password'];
    const num_keys = ['email'];

    //classes
    const login = new login_Check(_req, _res, body);
    const db = new dbOperations;
    const pwd = new passHash;

    //db operation
    const result = await db.getByValue<user_db_schema> ('users', ['email'], body.email);
    const user = result.rows[0];    

    // frontend(right user data) check
    login.login(keys, num_keys, 'email', 'password');

    //check of credentials
    if (!user) {
        return _res.status(400).json({ error: "User not found" });
    } else { 
        // password hash check
        const check_pwd = await pwd.checkPassword(body.password, user.password);

        if (check_pwd) { // if password hach is match, creates session and redirects to home
            // setting the cookies
            _req.session.user = {
                uuid: user.uuid,
                username: user.username,
                email: user.email,
            };
            _res.cookie("sessionID", _req.sessionID);

            // redirect to home 
            return _res.send({url: "/home"});
        } else {
            return _res.status(400).json({ error: "Invalid email or password" });
        };
    };
});


app.get('/signup', (_req, _res) => {
    _res.render('signup', {result: null});
});

app.post('/signup', async function signup(_req, _res) {
    // variables
    const body: authenticate_user_signup_request = _req.body;
    const keys: keys<authenticate_user_signup_request> = ['name', 'email', 'password', 'confirm_password'];
    const num_keys = ['name', 'email'];
    const uuid = v4();
    // classes
    const signup = new login_Check(_req, _res, body);
    const db = new dbOperations;
    const pwd = new passHash;

    // frontend(right user data) check
    signup.signup(keys, num_keys, 'name', 'email', 'password', 'confirm_password')

    // password hash
    const hashed_pwd = await pwd.hashPassword(body.password);

    //db operation
    db.insertInto<user_db_schema> ('users', ['username', 'email', 'password', 'uuid'], [body.name, body.email, hashed_pwd, uuid,]);
    const result = await db.getByValue<user_db_schema> ('users', ['email'], body.email);
    const user = result.rows[0];

    // setting the cookies 
    if (!user) {
        _res.send({error: "Couldn't create a user, try again later!"})
    } else {
        _req.session.user = {
            uuid: uuid,
            username: body.name,
            email: body.email,
        };
        _res.cookie("sessionID", _req.sessionID);

        // redirecting home
        _res.send({url: '/home'})
    };
});

app.get('/home', async function home(_req, _res) {
    if (_req.session.user) {
        const userData = _req.session.user
        _res.render('home', {uuid: userData.uuid, username: userData.username, email: userData.email})
    } else {
        _res.redirect('/login') 
    };

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));