const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`listening to port: ${port}`);
});

app.get("/", (req, res) => {
  res.send("Rollin Rust is running");
});

// codu
// PaY9e49j5FRP1IKt

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tyocyp7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    // Creating Database Collections
    const servicesCollection = client.db("rollin_rust").collection("services");
    const bookingsCollection = client.db("rollin_rust").collection("bookings");

    // API routes
    // API route to get all services data
    app.get("/services", async (req, res) => {
      const query = {};
      const services = await servicesCollection.find(query).toArray();
      res.send(services);
    });

    // API route to get individual service
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    // API route to get Booking Data
    app.get("/bookings", async (req, res) => {
      let query = {};
      // Query Logic to find user specific Booking Data
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });

    // API route to store Booking Data
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    // API route to delete Booking Data
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);
