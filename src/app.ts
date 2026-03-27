import express from 'express';
import login_Check from './check.ts';
import dbOperations from './db_operations.ts';
import Authenticate from './authenticate.ts';
import jwtAuthorization from './jwt.ts'
import passHash from './passhash.ts'
import cookiesAuth from './cookies.ts'
import type {authenticate_user_signup_request, authenticate_user_login_reques, user_db_schema, keys} from './schemas.ts'
import bodyParser from 'body-parser';
import {pool} from './db_connect.ts'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { v4 } from 'uuid';
import dotenv from 'dotenv';



const app: express.Application = express();
dotenv.config();
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

app.post("/user/generateToken", async function n(_req, _res,) {

});

app.get("/user/validateToken", (_req, _res) => {

});


app.get('/login', async function login_page(_req, _res) {
    if (_req.cookies['JWT'] && _req.cookies['WsessionID']) {
        // variables
        const weeklySession = _req.cookies.WsessionID;

        // classes
        const jwt = new jwtAuthorization(_req, _res, 'gfg_jwt_secret_key', 'gfg_token_header_key');
        const db = new dbOperations;

        const verifyJWT = await jwt.verifyJWT()
        const JWT = await jwt.decodeJWT();
        const JWTstring = JSON.stringify(JWT);
        const data = JSON.parse(JWTstring);
        if (verifyJWT && data && data.WsessionID === weeklySession) {
            const check_result = await db.getByValue<user_db_schema> ('users', ['email'], data.email);
            const user = check_result.rows[0];
            if (user && user.username === data.username && user.email === data.email && user.uuid === data.uuid) {
                _req.session.user = {
                    uuid: data.uuid,
                    username: data.username,
                    email: data.email,
                };

                _res.cookie("sessionID", _req.sessionID);
                _res.redirect('/home')
            } else {_res.render('login', {result: null});};
        } else {_res.render('login', {result: null});};
    } else {
        _res.render('login', {result: null});
    };
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
    const jwt = new jwtAuthorization(_req, _res, 'gfg_jwt_secret_key', 'gfg_token_header_key')

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

            const user_data = {
                username: user.username,
                email: user.email,
                uuid: user.uuid,
                WsessionID: _req.sessionID
            };


            if (!(_req.cookies.WsessionID)) {
                _res.cookie("WsessionID", _req.sessionID, { maxAge: 7 * 24 * 60 * 60 * 1000 });
            };
            _res.cookie("sessionID", _req.sessionID);
            jwt.signJWT(user_data, 7 * 24);

            // redirect to home 
            return _res.send({url: "/home"});
        } else {
            return _res.status(400).json({ error: "Invalid email or password" });
        };
    };
});



app.get('/signup', async function signup_page(_req, _res) {
    // const cookies = new cookiesAuth(_req, _res, ['JWT', 'WsessionID'], 'gfg_jwt_secret_key', 'gfg_token_header_key');
    // const tokens = await cookies.cookiesObj();
    // const auth = await cookies.cookiesAuth(tokens, ['0/1/2/1', 'data/username/...']);
    // if (!auth) {
    //     _res.render('signup', {result: null});
    // } else {
    //     _res.send(`cookies found ${auth}`)

    // }
    
    if (_req.cookies['JWT'] && _req.cookies['WsessionID']) {
        // variables
        const weeklySession = _req.cookies.WsessionID;

        // classes
        const jwt = new jwtAuthorization(_req, _res, 'gfg_jwt_secret_key', 'gfg_token_header_key');
        const db = new dbOperations;

        const verifyJWT = await jwt.verifyJWT()
        const JWT = await jwt.decodeJWT();
        const JWTstring = JSON.stringify(JWT);
        const data = JSON.parse(JWTstring);
        if (verifyJWT && data && data.WsessionID === weeklySession) {
            const check_result = await db.getByValue<user_db_schema> ('users', ['email'], data.email);
            const user = check_result.rows[0];
            if (user && user.username === data.username && user.email === data.email && user.uuid === data.uuid) {
                _req.session.user = {
                    uuid: data.uuid,
                    username: data.username,
                    email: data.email,
                };

                _res.cookie("sessionID", _req.sessionID);
                _res.redirect('/home')
            } else {_res.render('signup', {result: null});};
        } else {_res.render('signup', {result: null});};
    } else {
        _res.render('signup', {result: null});
    };


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
    const jwt = new jwtAuthorization(_req, _res, 'gfg_jwt_secret_key', 'gfg_token_header_key');

    // frontend(right user data) check
    signup.signup(keys, num_keys, 'name', 'email', 'password', 'confirm_password')

    // password hash
    const hashed_pwd = await pwd.hashPassword(body.password);

    //db operation
    try {
        const result = await db.insertInto<user_db_schema> ('users', ['username', 'email', 'password', 'uuid'], [body.name, body.email, hashed_pwd, uuid,]);
    } catch (error) {
        if (error) {
            _res.send({error: "Unknownn error try again later!"})
        };
    };
    
    const check_result = await db.getByValue<user_db_schema> ('users', ['email'], body.email);
    const user = check_result.rows[0];
    
    

    // setting the cookies 
    if (!user) {
        _res.send({error: "Couldn't create a user, try again later!"});
    } else {
        // session data
        _req.session.user = {
            uuid: uuid,
            username: body.name,
            email: body.email,
        };

        // jwt data
        // const user_data= {
        //     data:{
        //         username: body.name,
        //         email: body.email,
        //         uuid: uuid,
        //     },
        //     WsessionData: {WsessionID: _req.sessionID},
        // }; 
        const user_data = {
            username: body.name,
            email: body.email,
            uuid: uuid,
            WsessionID: _req.sessionID
        };

        if (!(_req.cookies.WsessionID)) {
            _res.cookie("WsessionID", _req.sessionID, { maxAge: 7 * 24 * 60 * 60 * 1000 });
        };
        _res.cookie("sessionID", _req.sessionID);
        jwt.signJWT(user_data, 7 * 24);

        // redirecting home
        _res.send({url: '/home'});
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