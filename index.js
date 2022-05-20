const cors = require("cors");
const { MongoClient } = require("mongodb");
const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.14uaf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
    const commentsCollection = database.collection("comments");
    const testimonialsCollection = database.collection("testimonial");
    const blogsCollection = database.collection("blogs");

    // Post A New Course By Admin
    app.post("/courses", async (req, res) => {
      const courseContent = req.body;
      const result = await courseCollection.insertOne(courseContent);
      res.json(result);
    });

    app.get("/courses", async (req, res) => {
      let findCourse = courseCollection.find({});
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
    // makeadin data with google
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
      const content = req.body;
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateContent = {
        $set: {
          subTitle: content.subTitle,
          title: content.title,
          tag: content.tag,
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
      const options = { upsert: true };
      const result = await courseCollection.updateOne(
        query,
        updateContent,
        options
      );
      res.json(result);
    });
    // Make Admin
    app.put("/users/admin", async (req, res) => {
      const adminBody = req.body;
      const query = { email: adminBody.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(query, updateDoc);
      res.json(result);
    });
    // check admin status
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // get user by email
    app.get("/update-users/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = usersCollection.find({ email });
      const result = await cursor.toArray();
      res.json(result);
    });
    // update users
    app.put("/update-users/:email", async (req, res) => {
      const body = req.body;
      const query = { email: req.body.email };
      const updateContent = {
        $set: {
          displayName: body.displayName,
          phone: body.phone,
          photoURL: body.photoURL,
        },
      };
      const options = { upsert: true };
      const result = await usersCollection.updateOne(
        query,
        updateContent,
        options
      );
      res.json(result);
    });

    // Comment Push to db
    app.post("/comments", async (req, res) => {
      const body = req.body;
      const result = await commentsCollection.insertOne(body);
      res.json(result);
    });

    // testimonial get to db
    app.get("/testimonial", async (req, res) => {
      const cursor = testimonialsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // testimonial post to db
    app.post("/testimonial", async (req, res) => {
      const cursor = req.body;

      const result = await testimonialsCollection.insertOne(cursor);

      res.json(result);
    });

    /* Blog post section */
    // Blog post to db
    app.get("/blogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // POST A BLOG
    app.post("/blogs", async (req, res) => {
      const body = req.body;
      const result = await blogsCollection.insertOne(body);
      res.json(result);
    });
    // GET BLOG BY ID
    app.get("/blogs/blogs-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const findBlogs = await blogsCollection.findOne(query);
      res.json(findBlogs);
    });
    // DELETE BLOG BY ID
    app.delete("/blogs/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogsCollection.deleteOne(query);
      res.json(result);
    });
    // UPDATE BLOG BY ID
    app.put("/blogs/manage-blog/:id", async (req, res) => {
      const content = req.body;
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateContent = {
        $set: {
          left_side_p_img: content.left_side_p_img,
          right_side_p_img: content.right_side_p_img,
          blog_paragraph_last: content.blog_paragraph_last,
          left_side_paragraph: content.left_side_paragraph,
          right_side_paragraph: content.right_side_paragraph,
          left_side_heading_title: content.left_side_heading_title,
          right_side_heading_title: content.right_side_heading_title,
          under_the_text_of_cover_img_p: content.under_the_text_of_cover_img_p,
          cover_image_about_topic: content.cover_image_about_topic,
          blog_paragraph: content.blog_paragraph,
          sort_description: content.sort_description,
          cover_image: content.cover_image,
          card_image: content.card_image,
          author: content.author,
          tag: content.tag,
          title: content.title,
        },
      };
      const options = { upsert: true };
      const result = await blogsCollection.updateOne(
        query,
        updateContent,
        options
      );
      res.json(result);
    });
    /* Blog post section */
    // DASHBOARD USER
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // DASHBOARD USER
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
