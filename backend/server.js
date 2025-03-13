require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io')
const  http  = require('http')

const authRoutes = require('./routes/authRoutes');
const budgetSocket = require('./controllers/budgetSocketController')
const insuranceClaimSocket = require('./controllers/insuranceClaimsSocketController')
const accountRoutes = require('./routes/accountRoutes')
const billingRoutes = require('./routes/billingRoute')
const budgetRoutes = require('./routes/budgetRoutes')
const cashManageRoute = require('./routes/cashManageRoute')
const insuranceClaimsRoutes = require('./routes/insuranceClaimsRoutes')
const financialRoutes = require('./routes/financialRoutes')
const financialReportRoutes = require('./routes/financialReportRoutes')


//Middlewares
const app = express();

const server = http.createServer(app)
const io = new Server(server, {
  cors:{
    origin:'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
})

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use((req,res,next) => {
    console.log(`PATH: ${req.path} METHOD: ${req.method}`)
    next()
})
app.use((req, res, next) => {
  req.io = io;
  next();
})

// Routes
app.use('/auth-api', authRoutes);
app.use('/accounts', accountRoutes);
app.use('/billing', billingRoutes);
app.use('/budget', budgetRoutes)
app.use('/cash', cashManageRoute)
app.use('/insurance', insuranceClaimsRoutes)
app.use('/financial', financialRoutes)
app.use('/financial-reports', financialReportRoutes)


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

