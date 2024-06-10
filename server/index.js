const express = require('express')
const app = express()
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_API_PK);
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')

const port = process.env.PORT || 8000

// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://stayvista-50bac.web.app', 'https://stayvista-50bac.firebaseapp.com'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token
  console.log(token)
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.goboxhh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {




    // auth related api
    app.post('/jwt', async (req, res) => {
      const user = req.body
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })
    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
        console.log('Logout successful')
      } catch (err) {
        res.status(500).send(err)
      }
    })

    const roomsCollection = client.db('stayvistaDb').collection('rooms')
    const usersCollection = client.db('stayvistaDb').collection('users')
    const bokingsCollection = client.db('stayvistaDb').collection('bokings')



    //verifyAdmin MiddleWare
    const verifyAdmin =async (req, res, next)=>{
      const user = req.user
      const query = {email : user?.email}
      const result = await usersCollection.findOne(query)
      if(!result || result.role !== 'admin'){
        return res.status(401).send({message: "Unauthorized Access"})
      }
      next()

    }
    //verifyHost MiddleWare
    const verifyHost =async (req, res, next)=>{
      const user = req.user
      const query = {email : user?.email}
      const result = await usersCollection.findOne(query)
      if(!result || result.role !== 'host'){
        return res.status(401).send({message: "Unauthorized Access"})
      }
      next()

    }

    
    app.get('/rooms', async(req, res)=>{
      const category = req.query.category
      let query = {}
      if(category && category !== 'null') query = {category: category}
      const result = await roomsCollection.find(query).toArray()
      res.send(result)
    })

    //get single room by id
    app.get('/room/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await roomsCollection.findOne(query)
      res.send(result)
    })

    //post a room
    app.post('/room', verifyToken, verifyHost, async(req, res)=>{
      const room = req.body;
      const result = await roomsCollection.insertOne(room)
      res.send(result)
    })

    //get rooms by a user
    app.get('/my-Listings/:email', verifyToken, verifyHost, async(req, res)=>{
      const email = req.params.email;
      const query = {'host.email' : email}
   
      const result = await roomsCollection.find(query).toArray()
      res.send(result)
    })

    //delete rooms 
    app.delete('/room/:id', verifyToken, verifyHost, async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await roomsCollection.deleteOne(query)
      res.send(result)
    })
    //save user
    app.put('/user', async(req, res)=>{
      const user = req.body;
      const query = {email: user?.email}
      const isExist = await usersCollection.findOne(query)
      if(isExist){
        if(user.status === "Requested"){
          const result = await usersCollection.updateOne(query, {$set: {status : user?.status}})
          return res.send(result)
        }
        else{
          return res.send(isExist)
        }
      }
      if(isExist) return res.send(isExist)

        const options = {upsert: true}
        const updateDoc = {
          $set: {
            ...user,
            timestamp: Date.now()
          }
        }
      const result = await usersCollection.updateOne(query, updateDoc, options)
      res.send(result)
    })

    app.get('/users', verifyToken, verifyAdmin, async(req, res)=>{
      const user = req.body;
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    //get user
    app.get('/user/:email', async(req, res)=>{
      const email = req.params.email;
      const query = {email : email}
      const result = await usersCollection.findOne(query)
      res.send(result)
    })

    //update user role
    app.patch('/users/update/:email', async(req, res)=>{
      const email = req.params.email;
      const user = req.body;
      const query = {email : email}
      const updatedDoc = {
        $set: {
          ...user, timestamp: Date.now()
        }
      }
      const result = await usersCollection.updateOne(query, updatedDoc)
      res.send(result)
    })

    //bookingS collection apis
    app.post('/booking', async(req, res)=>{
      const paymentInfo = req.body;
      const result = await bokingsCollection.insertOne(paymentInfo)
      res.send(result)
    })

    //update the room status
    app.patch('/room/status/:id', async(req, res)=>{
      const id = req.params.id
      const status = req.body.status
      console.log(status);
      const query = {_id: new ObjectId(id)}
      const updatedDoc = {
        $set: {booked : status},
      }
      const result = await roomsCollection.updateOne(query, updatedDoc)
      res.send(result)
    })
    //payment related apis
    app.post('/create-payment-intent', async(req, res)=>{
      const {price} = req.body;
     const amount = price 
     console.log(amount);
     const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency : 'usd',
      payment_method_types : ['card']
     })

     res.send({clientSecret: paymentIntent.client_secret})
    })
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from StayVista Server..')
})

app.listen(port, () => {
  console.log(`StayVista is running on port ${port}`)
})
