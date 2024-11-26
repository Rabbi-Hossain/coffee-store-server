const express = require('express');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.dqtrbnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeMasterDB').collection('coffee')
    const usersCollection = client.db('coffeeMasterDB').collection('users')

    app.get('/coffees', async (req, res) => {
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/coffees/:id', async (req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    app.post('/coffees', async (req, res) => {
      const id = req.body;
      console.log(id)
      const result = await coffeeCollection.insertOne(id)
      res.send(result)
    })

    app.put('/coffees/:id', async(req, res)=>{
      const id = req.params.id;
      const users = req.body;
      console.log(id, users)
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedUsers = {
        $set: {
          name: users.name,
          chep: users.chep,
          supplier: users.supplier,
           taste: users.taste,
            category: users.category,
            details: users.details,
            photo: users.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, updatedUsers, options)
      res.send(result)

    })

    app.delete('/coffees/:id', async(req, res)=>{
      const id = req.params.id
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)

    })

    // user information crud

    app.get('/users', async(req, res)=>{
      const usersId = usersCollection.find()
      const result = await usersId.toArray()
      res.send(result)
    })

    app.get('/users/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.findOne(query)
      res.send(result)
    })

    app.post('/users', async(req, res)=>{
      const users = req.body;
      console.log(users)
      const result = await usersCollection.insertOne(users)
      res.send(result)

    })

    app.patch('/users', async(req, res)=>{
      const users = req.body
      console.log(users)
      const options = {upsert: true}
      const filter = {email: users.email}
      const usersUpdate = {
        $set: {
          lastSignInTime: users.lastSignInTime
        }
      }

      const result = await usersCollection.updateOne(filter, usersUpdate, options)
      res.send(result)

    })

    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id
      console.log(id)
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('coffee server home page')
})


app.listen(port, () => {
  console.log(`server is running prot:${port}`)
})