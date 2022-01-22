const cors = require("cors");
const { MongoClient } = require("mongodb");
const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();
const port = process.env.PROT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://nur_it_server:thiI1ABU8fwPAqnu@cluster0.14uaf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("nur_it_server");
    const courseCollection = database.collection("Courses");

    // get db from mongodb
    app.get("/courses", async (req, res) => {
      const findCourse = courseCollection.find({});
      const courseArray = await findCourse.toArray();
      res.json(courseArray);
    });
    // get db from mongodb
    app.get("/course/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const findCourse = await courseCollection.findOne(query);
      res.json(findCourse);
    });
    // post db from mongodb
    app.post("/courses", async (req, res) => {
      const courseContent = req.body;
      const courseInsert = await courseCollection.insertOne(courseContent);
      res.json(courseInsert);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Hello from the server.nur IT");
});
app.listen(port, () => {
  console.log("Listening from the prot of", port);
});
