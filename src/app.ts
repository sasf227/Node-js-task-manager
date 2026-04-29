import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.ts';
import createRoutes from './routes/taskCreate.routes.ts';
import { authMiddleware, homeAuthMiddleware, createMiddleware } from './middleware/auth.middleware.ts';
import dotenv from 'dotenv';
import * as http from 'http';
import { Server } from 'socket.io';
import { comparePassword } from './utils/hash.ts';
import { verifyToken } from './utils/jwt.ts';





export const app: express.Application = express();
const server = http.createServer(app);
const io = new Server(server)
dotenv.config();
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
});

app.get('/home', homeAuthMiddleware, (req, res) => {
    res.render('home', {user: req.user, tasks: req.tasks, dayType: req.dayType})
});

app.get('/home/completedTasks', homeAuthMiddleware, (req, res) => {
    res.render('completedTasks', {user: req.user, tasks: req.tasks, dayType: req.dayType})
});

app.get('/home/incompletedTasks', homeAuthMiddleware, (req, res) => {
    res.render('incompletedTasks', {user: req.user, tasks: req.tasks, dayType: req.dayType})
});

app.get('/chat', homeAuthMiddleware, (req, res) => {
    res.render('chat', {token: req.token})
})

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('handshake', (jwt: string) => {
        if (!jwt) return;
        try {
            const user = verifyToken(jwt)
            if (typeof user === 'string' || !user || typeof (user as any).email !== 'string') {
                return res.redirect('/login');
            }
        } catch (error) {
            
        }
    })
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (username, msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', username, msg); // Broadcast the message to all connected clients
    });
});

app.get('/newTask', createMiddleware, (req, res) => {
    res.render('newTask', {user: req.user })
})



app.get('/howTo', (req, res) => {
    res.render('howto')
})

server.listen(3000);