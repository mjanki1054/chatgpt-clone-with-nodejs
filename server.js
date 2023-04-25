const PORT = 8800;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/data");
  console.log("DB Connected");
}

const userSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const User = mongoose.model("User", userSchema);

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY;

app.post("/completions", async (req, res) => {

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content:req.body.message  }],
      max_tokens: 500,
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    console.log(response, "response");
    const data = await response.json();
    const user = new User({
      question: req.body.message,
      answer: data.choices[0].message.content,
    });
    await user.save();
    res.send(data);
  } catch (error) {
    console.error(error, "this is an error from server-side");
  }
});

// create an API endpoint to retrieve all the data from the MongoDB collection
app.get("/users", async (req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (error) {
      console.error(error, "this is an error from server-side");
      res.status(500).send("Internal Server Error");
    }
  });

app.get("/", (req, res) => res.send("hello world"));
app.listen(PORT, () => console.log(`YOUR SERVER IS RUNNING ON PORT:${PORT}`));