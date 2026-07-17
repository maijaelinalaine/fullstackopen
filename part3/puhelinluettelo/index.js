const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];

const generateId = () => {
  let id;

  do {
    id = Math.floor(Math.random() * 1000000);
  } while (persons.some((person) => person.id === id));

  return id;
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const nameExists = persons.some((person) => person.name === name);

  if (nameExists) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = {
    id: generateId(),
    name,
    number,
  };

  persons = persons.concat(person);
  response.status(201).json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return response.status(404).json({ error: "person not found" });
  }

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personExists = persons.some((person) => person.id === id);

  if (!personExists) {
    return response.status(404).json({ error: "person not found" });
  }

  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  const now = new Date();
  const date = now.toLocaleDateString("en-GB");
  const time = now.toLocaleTimeString("en-GB");
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date} ${time} ${timeZone}</p>
  `);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
