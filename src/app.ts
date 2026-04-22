import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.ts';
import createRoutes from './routes/taskCreate.routes.ts';
import { authMiddleware, homeAuthMiddleware, createMiddleware } from './middleware/auth.middleware.ts';
import dotenv from 'dotenv';


const app: express.Application = express();
dotenv.config()
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/create', createRoutes);

app.get('/', authMiddleware, (req, res) => {
    res.render('welcome')
});

app.get('/login', authMiddleware, (req, res) => {
    res.render('login')
});

app.get('/signup', authMiddleware, (req, res) => {
    res.render('signup')
});

app.get('/home', homeAuthMiddleware, (req, res) => {
    res.render('home', {user: req.user, tasks: req.tasks, dayType: req.dayType})
});

app.get('/newTask', createMiddleware, (req, res) => {
    res.render('newTask', {user: req.user })
})

app.listen(3000);