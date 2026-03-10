import express from 'express';
import bodyParser from 'body-parser';
import passHash from './passhash.ts'
import type authetnicate_user_signup_request from './schemas.ts'

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
    if(Number.isNaN(body.name) || Number.isNaN(body.email) ) {
        _res.send({error: 'Name or email cannot be just a number'})
    }
    
    // for (const [key, value] of Object.entries(body)) {
    //     console.log(key, value, Number(value))
    // }
    console.log(body, Number(body.name), Number(body.email), Number(body.password), Number(body.confirm_password))
    
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));