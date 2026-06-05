import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.ts';
import createRoutes from './routes/taskCreate.routes.ts';
import { authMiddleware, homeAuthMiddleware, createMiddleware, chatAuthMiddleware, ticketsMiddleware } from './middleware/auth.middleware.ts';
import dotenv from 'dotenv';
import * as http from 'http';
import { Server } from 'socket.io';
import { verifyToken } from './utils/jwt.ts';
import { getUserByEmail } from './db/commands/user.commands.ts';
import type { User, UserToken } from './db/models/user.model.ts';
import type { JwtPayload } from 'jsonwebtoken';
import chatRoutes from './routes/chat.routes.ts'
import { getRoom } from './utils/getRoom.ts';
import cors from "cors";



export const app: express.Application = express();
const server = http.createServer(app);
const io = new Server(server)
app.use(cors({
  origin: "http://10.0.0.85:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

dotenv.config();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/create', createRoutes);
app.use('/chat', chatRoutes)

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

app.get('/chat',  (req, res) => {
    res.render('chat', {user: req.user, token: req.token, chats: req.chats})
})

io.on('connection', (socket) => {
    console.log('User connected');

    

    socket.on('handshake', async (jwt: string) => {
        try {
            const user: UserToken | JwtPayload | string  = verifyToken(jwt);
            if (typeof user === 'string') return socket.disconnect()
            
            const dbUser = await getUserByEmail(user.email);

            if (!dbUser) return socket.disconnect();

            // ✅ store user on socket
            socket.data.user = dbUser;

            console.log('Authenticated:', dbUser.email);

        } catch (err) {
            socket.disconnect();
        }
    });

    socket.on('new chat', async (emailTo: string) => {
        const user = socket.data.user;
        if (!user) return;

        const room = getRoom(user.email, emailTo)

        socket.join(room);

        console.log(`${user.email} joined ${room}`);

        // optional: notify user
        socket.emit('chat message', 'System', `Chat opened with ${emailTo}`);
    });


    socket.on('chat message', (emailTo: string, msg: string) => {
        const user = socket.data.user;
        if (!user) return;

        const room = getRoom(user.email, emailTo);

        io.to(room).emit('chat message', {
            sender: user.username,
            email: user.email,
            message: msg
        });

        console.log(`${user.email} -> ${emailTo}: ${msg}`);
    });

    socket.on('disconnect_server',() => {
        socket.disconnect();
        console.log("User disconnected")
    })
});

app.get('/help', ticketsMiddleware, (req, res) => {
    res.render('tickets', {tickets: req.tickets})
})

app.get('/ticket', (req, res) => {
    res.render('create-ticket')
})

app.get('/newTask', createMiddleware, (req, res) => {
    res.render('newTask', {user: req.user })
})
import nodemailer from "nodemailer";
import { getConversationId, getConversationFromId, updateMetaTicket, updateTicketAttr  } from './db/commands/libredesk.command.ts';


// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: "taskflowapp.support@gmail.com",
//         pass: process.env.LIBREDESK
//     }
// });
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "taskflowapp.support@gmail.com",
    pass: process.env.LIBREDESK,
  },
});

app.post("/api/tickets", async (req, res) => {
    const verify = verifyToken(req.cookies['JWT'])
    try {
        const result = await transporter.sendMail({
            from: "taskflowapp.support@gmail.com",
            to: "taskflowapp.support@gmail.com",
            subject: `${req.body.title}`,
            text: `${req.body.description}`,
        });


        async function retry(tries = 5, delayMs = 3000) {
            setTimeout(async () => {
                try {
                    const source_id = result.messageId.replace(/^<|>$/g, "")
                    const conversationId = await getConversationId(source_id)
                    if (typeof conversationId === 'undefined') {
                        return retry()
                    }
                    console.log(conversationId)
                    const setTicketAttr = await updateTicketAttr({
                        email: `${verify.email}`,
                        category: `${req.body.category}`, 
                        pretended_priority: `${req.body.priority}`,
                        description: `${req.body.description}`}, conversationId.conversation_id);
                    console.log(setTicketAttr)
                    res.json({ result })
                } catch (error) {
                    res.json({ error })
                }
            }, delayMs)
        }

        retry()

    } catch (error) {
        res.json({error})
    }
    
});



app.get('/howTo', (req, res) => {
    res.render('howto')
})

server.listen(3000);