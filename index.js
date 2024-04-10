const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://naveenterance:nst@cluster0.ytqaasm.mongodb.net/movie?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define a schema for the movie rating
const movieRatingSchema = new mongoose.Schema({
  username: String,
  movieId: String,
  rating: Number,
});

const MovieRating = mongoose.model("MovieRating", movieRatingSchema);

// Middleware
app.use(bodyParser.json());

// Retrieve all entries by a given username
app.get("/movies/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const movies = await MovieRating.find({ username });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add new entries
app.post("/movies", async (req, res) => {
  const { username, movieId, rating } = req.body;
  try {
    const newMovieRating = new MovieRating({ username, movieId, rating });
    await newMovieRating.save();
    res.status(201).json({ message: "Movie rating added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
