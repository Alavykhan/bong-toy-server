const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g0rz6ma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const toyCollection = client.db('bongToys').collection('toys')
    const bookingCollection = client.db('bongToys').collection('toyBookings')


    app.get('/toys', async(req, res)=>{
        const cursor = toyCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/toys/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result= await toyCollection.findOne(query);
        res.send(result);
    })

    //bookings

    app.get('/toyBookings', async(req, res)=>{
      console.log(req.query.email);

      let query= {}
      if(req.query?.email){
        query= {email: req.query?.email}
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/toyBookings', async(req, res)=>{
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
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


app.get('/', (req, res)=>{
    res.send('Bong Toys is running')
})

app.listen(port, ()=>{
    console.log(`port is running on ${port}`);
})