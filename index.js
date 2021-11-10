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
        const ordersCollection = database.collection("orders");

        console.log('database connected');
        // GET API
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