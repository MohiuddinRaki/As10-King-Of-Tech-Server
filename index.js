const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware:
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxjjt.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandAddCollection = client.db("brandUDB").collection("brandU");
    const productCollection = client.db("productDB").collection("product");
    const cartCollection = client.db("cardDB").collection("cart");
    const userCollection = client.db("userDB").collection("user");
    const feedBackCollection = client.db("feedbackDB").collection("feedback");
    const teamCollection = client.db("teamDB").collection("team");

    // for home page data:
    app.post("/brandU", async (req, res) => {
      const newBrandU = req.body;
      console.log(newBrandU);
      const result = await brandAddCollection.insertOne(newBrandU);
      res.send(result);
    });

    app.get("/brandU", async (req, res) => {
      const cursor = brandAddCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // for all products of brands:
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // for get specify brand products when click any brand:
    app.get("product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = productCollection.findOne(query);
      res.send(result);
    });

    // for update:
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          brand: updateProduct.brand,
          type: updateProduct.type,
          price: updateProduct.price,
          description: updateProduct.description,
          rating: updateProduct.rating,
          photo: updateProduct.photo,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });

    // Add to Cart:
    app.post("/cart", async (req, res) => {
      const newCart = req.body;
      console.log(newCart);
      const result = await cartCollection.insertOne(newCart);
      res.send(result);
    });

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // for delete:
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // for user:
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // for FeedBack:
    app.post("/feedback", async (req, res) => {
      const newFeedBack = req.body;
      console.log(newFeedBack);
      const result = await feedBackCollection.insertOne(newFeedBack);
      res.send(result);
    });

    app.get("/feedback", async (req, res) => {
      const cursor = feedBackCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // for Add Team:
    app.post("/team", async (req, res) => {
      const newTeam = req.body;
      console.log(newTeam);
      const result = await teamCollection.insertOne(newTeam);
      res.send(result);
    });

    app.get("/team", async (req, res) => {
      const cursor = teamCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("As-10 Server is running");
});
app.listen(port, () => {
  console.log(`As-10 Server is running on port: ${port}`);
});
