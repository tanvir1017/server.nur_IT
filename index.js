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

async function run() {
  try {
    await client.connect();
    const database = client.db("nur_it_server");
    const courseCollection = database.collection("Courses");
    const enrolledCourseCollection = database.collection("enrollCourse");
    const usersCollection = database.collection("users");

    // Post A New Course By Admin
    app.post("/courses", async (req, res) => {
      const courseContent = req.body;
      const result = await courseCollection.insertOne(courseContent);
      res.json(result);
    });
    // get db from mongodb
    app.get("/courses", async (req, res) => {
      const findCourse = courseCollection.find({});
      const courseArray = await findCourse.toArray();
      res.json(courseArray);
    });

    // Delete courses
    app.delete("/course/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await courseCollection.deleteOne(query);
      res.json(result);
    });

    // enroll course
    app.post("/enrollCourse", async (req, res) => {
      const enrolledCourse = req.body;
      const result = await enrolledCourseCollection.insertOne(enrolledCourse);
      res.json(result);
    });
    // See all enrolled course {admin}
    app.get("/enrollCourse", async (req, res) => {
      const findEnrolledCourse = enrolledCourseCollection.find({});
      const result = await findEnrolledCourse.toArray();
      res.json(result);
    });
    // See all enrolled course {single user}
    app.get("/email", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const findEnrolledCourse = enrolledCourseCollection.find(query);
      const result = await findEnrolledCourse.toArray();
      res.json(result);
    });

    // Delete user order
    app.delete("/enrollCourse/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cart = await enrolledCourseCollection.deleteOne(query);
      res.json(cart);
    });

    // makeAdmin data
    app.post("/users", async (req, res) => {
      const body = req.body;
      const result = await usersCollection.insertOne(body);
      res.json(result);
    });
    // makeadin data with googl
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // get db from mongodb
    app.get("/courses/mangeCourses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const findCourse = await courseCollection.findOne(query);
      res.json(findCourse);
    });
    // Update any course by admin
    app.put("/courses/mangeCourses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const content = req.body;
      const options = { upsert: true };
      const updateContent = {
        $set: {
          subTitle: content.subTitle,
          title: content.title,
          courseCover: content.courseCover,
          certificateImg: content.certificateImg,
          fee: content.fee,
          discountFee: content.discountFee,
          quize: content.quize,
          lession: content.lession,
          topic: content.topic,
          video: content.video,
          techingListTitle: content.techingListTitle,
          techingList1: content.techingList1,
          techingList2: content.techingList2,
          techingList3: content.techingList3,
          techingList4: content.techingList4,
          techingList5: content.techingList5,
          techingList6: content.techingList6,
          techingList7: content.techingList7,
          techingList8: content.techingList8,
          desc: content.desc,
          requirementDesc: content.requirementDesc,
          whoCanBuyTitle: content.whoCanBuyTitle,
          careerDesc: content.careerDesc,
          instructorName: content.instructorName,
          instructorSpecialty: content.instructorSpecialty,
          instructorIntroduction: content.instructorIntroduction,
          instructorRole: content.instructorRole,
        },
      };
      const result = await courseCollection.updateOne(
        query,
        updateContent,
        options
      );
      res.json(result);
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
