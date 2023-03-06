const express = require('express');
const cors = require('cors')
const helmet = require('helmet')

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//routers
const contactRouter = require("./routers/contact")
const projectRouter = require("./routers/project")
const productRouter = require("./routers/product")
const orderRouter = require("./routers/order")
const userRouter = require("./routers/user")
const authRouter = require("./routers/auth")
const trafficRouter = require("./routers/traffic")

const middleware = require("./utils/middleware")
const socketMiddleware = require("./utils/socketMiddleware")

app.use(helmet());


if(process.env.NODE_ENV === "production"){
  app.set('trust proxy', 1)
  // app.enable('trust proxy');
}

app.use(cors({
  origin: process.env.NODE_ENV !== "production" ? ['http://localhost:3000','http://localhost:3001','http://localhost:3002']: ['https://www.ombayus.com','https://admin.ombayus.com'],
  credentials: true
}));


app.use(express.json())

// app.use(express.static('build'))

//connect database
require("./utils/mongo")


app.get("/",(req,res)=>{
  res.send("ombayus")
})

//using outers
app.use("/api/auth",authRouter)
app.use("/api/contact",contactRouter)
app.use("/api/project",projectRouter)
app.use("/api/order",orderRouter)
app.use("/api/product",productRouter)
app.use("/api/user",userRouter)
app.use("/api/traffic",trafficRouter)

app.use(middleware.unknownEndpoint)


app.use(middleware.errorHandler)



io.on('connection', (socket) => {

  socket.on("sendMsg",(data)=>{
    const auth = socketMiddleware.authExactor(data.token)
    if(!auth.error){
      socket.emit("sendMsg",true)
      io.sockets.emit("Msg",data.msg)
    }
    else{
      socket.emit("sendMsg",false)
    }
  })
});

const PORT = process.env.PORT || 80

server.listen(PORT, () => {
  console.log('listening the server on ' + PORT);
});



// app.listen(PORT, () => {
//   console.log('listening the server on '+PORT);
// });
