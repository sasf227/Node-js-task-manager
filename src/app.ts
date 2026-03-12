import express from 'express';
import login_Check from './check.ts';
import passHash from './passhash.ts'
import type {authetnicate_user_signup_request, keys, err} from './schemas.ts'
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

app.get('/signup', (_req, _res) => {
    _res.render('signup', {result: null});
});

app.post('/signup', (_req, _res) => {
    const body: authetnicate_user_signup_request = _req.body;
    const b_keys: keys<authetnicate_user_signup_request> = ['name', 'email', 'password', 'confirm_password'];
    const num_keys = ['name', 'email'];
    const signup = new login_Check(_req, _res, body);

    signup.emptyCheck(b_keys);
    signup.nameCheck(num_keys);
    signup.isMatchCheck('password', 'confirm_password');
    _res.send({url: '/home'})
    
});

app.get('/home', (_req, _res) => {
    _res.render('home')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));