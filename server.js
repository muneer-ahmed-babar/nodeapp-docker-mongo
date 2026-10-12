const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3030;

// DB address comes from an environment variable
const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) { console.error("MONGO_URL is not set"); process.exit(1); }
const client = new MongoClient(MONGO_URL);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")); });

// GET all users
app.get("/getUsers", async (req, res) => {
    try {
        const data = await client.db("my-sample-db").collection("users").find({}).toArray();
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not fetch users");
    }
});

// POST new user (form submit)
app.post("/addUser", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        await client.db("my-sample-db").collection("users").insertOne({ email, username, password });
        res.send("User added. <a href='/'>Go back</a>");
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not add user");
    }
});

// Connect to DB once, then start the server
client.connect()
    .then(() => { app.listen(PORT, () => { console.log(`server running on port ${PORT}`); }); })
    .catch((err) => { console.error("DB connection failed:", err.message); process.exit(1); });