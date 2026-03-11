import express from 'express';
import bodyParser from 'body-parser';
import passHash from './passhash.ts'
import type {authetnicate_user_signup_request, keys, err} from './schemas.ts'
import { errorMonitor } from 'node:events';





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
    const isNum = !(isNaN(Number(body.name)) || isNaN(Number(body.email)));
    const pwd_match = body.password !== body.confirm_password;
    let error: err = {
            num_error: '',
            empty_error: '',
            pwd_error: '',
        };

    for (const key of b_keys) {
        if (!(key in body) ) {
            _res.status(400).send();
        } else if (!body[key]) {
            error.empty_error=`Field ${key} cannot be empty!`;
            _res.send(error);
        };
    };

    if (isNum) {
            error.num_error = 'Name or email cannot be a number!' 
            _res.send(error);
        } else if (pwd_match) {
            error.pwd_error = 'Passwords does not matches'
            _res.send(error);
    };
    _res.send({url: '/home'})
    
});

app.get('/home', (_req, _res) => {
    _res.render('home')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));