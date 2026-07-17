import { useEffect, useState } from "react";
import Search from "./components/Search";
import AddPersonForm from "./components/AddPersonForm";
import PersonsList from "./components/PersonsList";
import numberService from "./services/numbers";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  const showMessage = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };

  useEffect(() => {
    numberService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);

  const handleDeletePerson = (id, name) => {
    const doDelete = window.confirm(`Delete ${name}?`);
    if (!doDelete) {
      return;
    }

    numberService.remove(id).then(() => {
      setPersons(persons.filter((person) => person.id !== id));
      showMessage(`Deleted ${name}`);
    });
  };

  const handleAddPerson = (e) => {
    e.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      showMessage(`${newName} is already added to phonebook`, "error");
      return;
    }

    if (!newName.trim() || !newNumber.trim()) {
      showMessage("Name or number missing", "error");
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    numberService.create(newPerson).then((response) => {
      setPersons(persons.concat(response.data));
      showMessage(`Added ${response.data.name}`);
      setNewName("");
      setNewNumber("");
    });
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Search value={searchTerm} onChange={handleSearch} />
      <AddPersonForm
        onSubmit={handleAddPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <PersonsList persons={personsToShow} onDelete={handleDeletePerson} />
    </div>
  );
};

export default App;
