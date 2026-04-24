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

app.get('/signIn', authMiddleware, (req, res) => {
    res.render('signIn')
});

app.get('/home/totalTasks', homeAuthMiddleware, (req, res) => {
    res.render('totalTasks', {user: req.user, tasks: req.tasks, dayType: req.dayType})
})

app.get('/home', homeAuthMiddleware, (req, res) => {
    res.render('home', {user: req.user, tasks: req.tasks, dayType: req.dayType})
});

app.get('/home/completedTasks', homeAuthMiddleware, (req, res) => {
    res.render('completedTasks', {user: req.user, tasks: req.tasks, dayType: req.dayType})
})

app.get('/home/incompletedTasks', homeAuthMiddleware, (req, res) => {
    res.render('incompletedTasks', {user: req.user, tasks: req.tasks, dayType: req.dayType})
})

app.get('/newTask', createMiddleware, (req, res) => {
    res.render('newTask', {user: req.user })
})

app.get('/howTo', (req, res) => {
    res.render('howto')
})

app.listen(3000);