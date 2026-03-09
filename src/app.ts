import express from 'express';
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

app.post('/authorise', (_req, _res) => {
    const {name, email, password, confirm_password} = _req.body;
    console.log(name, email, password, confirm_password)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));