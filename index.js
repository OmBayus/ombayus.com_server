const express = require('express');
const session = require("express-session")
const cors = require('cors')
const helmet = require('helmet')

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const {SESSION_SECRET} = require("./utils/config")

//routers
const contactRouter = require("./routers/contact")
const projectRouter = require("./routers/project")
const productRouter = require("./routers/product")
const userRouter = require("./routers/user")
const authRouter = require("./routers/auth")

const middleware = require("./utils/middleware")

app.use(helmet());

app.set('trust proxy', 1)
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  proxy:true,
  saveUninitialized: true,
  cookie: { secure: true, maxAge:  6*60*60*1000,sameSite:false},
  unset: 'destroy'
}));

app.use(cors({
  origin: ['http://localhost:3000','https://www.ombayus.com','https://admin.ombayus.com'],
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}));


app.use(express.json())

// app.use(express.static('build'))

//connect database
require("./utils/mongo")

app.get("/",(req,res)=>{
  res.send("Hello")
})

//using outers
app.use("/api/contact",contactRouter)
app.use("/api/project",projectRouter)
app.use("/api/product",productRouter)
app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)

app.use(middleware.unknownEndpoint)


app.use(middleware.errorHandler)



io.on('connection', (socket) => {
  console.log('a user connected');
});

const PORT = process.env.PORT || 80

server.listen(PORT, () => {
  console.log('listening the server on ' + PORT);
});



// app.listen(PORT, () => {
//   console.log('listening the server on '+PORT);
// });
