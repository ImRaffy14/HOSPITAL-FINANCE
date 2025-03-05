require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io')
const  http  = require('http')

const authRoutes = require('./routes/authRoutes');
const budgetSocket = require('./controllers/budgetSocketController')
const insuranceClaimSocket = require('./controllers/insuranceClaimsSocketController')
const accountRoutes = require('./routes/accountRoutes')


//Middlewares
const app = express();

const server = http.createServer(app)
const io = new Server(server, {
  cors:{
    origin:'*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  }
})

app.use(cors());
app.use(express.json());
app.use((req,res,next) => {
    console.log(`PATH: ${req.path} METHOD: ${req.method}`)
    next()
})

// Routes
app.use('/auth-api', authRoutes);
app.use('/accounts', accountRoutes)



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {

  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);

    io.on('connection', (socket) => {
      console.log(`Client Connected: ${socket.id}`)

      budgetSocket(socket, io)
      insuranceClaimSocket(socket, io)


      socket.on('disconnect', () => {
        console.log(`Client disconnected ${socket.id}` )
      })
    })
  });

  })

  .catch(err => console.log(err));

