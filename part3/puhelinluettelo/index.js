const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Person = require("./models/person");
const unknownEndpoint = require("./middleware/unknownEndpoint");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.error("error connecting to MongoDB:", error.message);
  });

app.get("/api/persons", async (request, response) => {
  const persons = await Person.find({});
  response.json(persons);
});

app.post("/api/persons", async (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    const error = new Error("name or number missing");
    error.status = 400;
    return next(error);
  }

  const person = new Person({
    name,
    number,
  });

  const savedPerson = await person.save();
  response.status(201).json(savedPerson);
});

app.get("/api/persons/:id", async (request, response) => {
  const person = await Person.findById(request.params.id);

  if (!person) {
    return response.status(404).json({ error: "person not found" });
  }

  response.json(person);
});

app.delete("/api/persons/:id", async (request, response) => {
  const person = await Person.findByIdAndDelete(request.params.id);

  if (!person) {
    return response.status(404).json({ error: "person not found" });
  }

  response.status(204).end();
});

app.get("/info", async (request, response) => {
  const personCount = await Person.countDocuments();
  const now = new Date();
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString("en-GB");
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  response.send(`
    <p>Phonebook has info for ${personCount} people</p>
    <p>${date} ${time} ${timeZone}</p>
  `);
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
