const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json())// alternative of body parser

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.74aai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("glossy-glasses-101");
        const productsCollection = database.collection("products");
        const usersCollection = database.collection("users");
        const reviewsCollection = database.collection("reviews");
        const ordersCollection = database.collection("orders");

        console.log('database connected');

        // ========================= USERS ===================
        // GET API

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        app.post('/users', async (req, res) => {
            user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        })

        // ================= PRODUCTS ===============
        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({}).sort({ _id: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })

        // GET API With ID
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.send(result);
        })


        // POST API
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })

        // DELETE API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await productsCollection.deleteOne(query);
            res.send(result)
        })

        //============================ ORDERS ================
        //Get API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({}).sort({ _id: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })
        // POST API
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })
        //Update API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };;
            const updateDoc = {
                $set: {
                    status: `Approved`
                },
            };
            const result = await ordersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await ordersCollection.deleteOne(query);
            res.send(result)
        })

        // ================= REVIEWS ===============
        // GET API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({}).sort({ _id: -1 });
            const result = await cursor.toArray();
            res.send(result);
        })



        // POST API
        app.post('/reviews', async (req, res) => {
            const product = req.body;
            const result = await reviewsCollection.insertOne(product);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})