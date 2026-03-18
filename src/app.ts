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
import { emitWarning } from 'process';


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

app.post('/login', async function login(_req, _res) {
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
    const user = result.rows[0]

    // password hash check
    const check_pwd = await pwd.checkPassword(body.password, user.password);

    // frontend(right user data) check
    login.login(keys, num_keys, 'email', 'password')

    //check of credentials
    if (!user) {
        return _res.status(400).json({ error: "User not found" });
    } else if (check_pwd) { // if password hash = true redirect to home page
        return _res.send({url: "/home"});
    } else {
        return _res.status(400).json({ error: "Invalid email or password" });
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

    // classes
    const signup = new login_Check(_req, _res, body);
    const db = new dbOperations;
    const pwd = new passHash;

    // frontend(right user data) check
    signup.signup(keys, num_keys, 'name', 'email', 'password', 'confirm_password')

    // password hash
    const hashed_pwd = await pwd.hashPassword(body.password);

    //db operation
    db.insertInto<user_db_schema> ('users', ['username', 'email', 'password'], [body.name, body.email, hashed_pwd])

    // redirecting home
    _res.send({url: '/home'})
    
});

app.get('/home', async function home(_req, _res) {
    if (_req.session.user) {
        _res.render('home')
    } else {
        _res.send({url: '/login'}) 
    }

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));