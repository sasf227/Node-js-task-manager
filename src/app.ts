import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.ts';
import { authMiddleware, homeAuthMiddleware } from './middleware/auth.middleware.ts';
import dotenv from 'dotenv';


const app: express.Application = express();
dotenv.config()
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes)

app.get('/', authMiddleware, (req, res) => {
    res.render('welcome')
})

app.get('/login', authMiddleware, (req, res) => {
    res.render('login')
})

app.get('/signup', authMiddleware, (req, res) => {
    res.render('signup')
})

app.get('/home', homeAuthMiddleware, (req, res) => {
    res.render('home', {user: req.user })
})

app.listen(3000);