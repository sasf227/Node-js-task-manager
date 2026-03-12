import express from 'express';
import login_Check from './check.ts';
import passHash from './passhash.ts'
import type {authenticate_user_signup_request, authenticate_user_login_reques , keys} from './schemas.ts'
import bodyParser from 'body-parser';







const app: express.Application = express();
const port: number = 3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())


app.get('/', (_req, _res) => {
    _res.render('index', {result: null});
});

app.get('/login', (_req, _res) => {
    _res.render('login', {result: null});
});

app.post('/login', (_req, _res) => {
    const body: authenticate_user_login_reques = _req.body;
    const keys: keys<authenticate_user_login_reques> = ['email', 'password'];
    const num_keys = ['email'];
    const login = new login_Check(_req, _res, body);

    login.login(keys, num_keys, 'email', 'password')
});


app.get('/signup', (_req, _res) => {
    _res.render('signup', {result: null});
});

app.post('/signup', (_req, _res) => {
    const body: authenticate_user_signup_request = _req.body;
    const keys: keys<authenticate_user_signup_request> = ['name', 'email', 'password', 'confirm_password'];
    const num_keys = ['name', 'email'];
    const signup = new login_Check(_req, _res, body);

    // protected from backend
    signup.signup(keys, num_keys, 'name', 'email', 'password', 'confirm_password')
    _res.send({url: '/home'})
    
});

app.get('/home', (_req, _res) => {
    _res.render('home')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));