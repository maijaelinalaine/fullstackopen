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
  const [notificationMessage, setNotificationMessage] = useState(null);

  const showMessage = (message) => {
    setNotificationMessage(message);
    setTimeout(() => {
      setNotificationMessage(null);
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
  const handleNumberReplace = (name) => {
    const personToReplace = persons.find((person) => person.name === name);
    const updatedPerson = { ...personToReplace, number: newNumber };

    numberService.update(personToReplace.id, updatedPerson).then((response) => {
      setPersons(
        persons.map((person) =>
          person.id !== personToReplace.id ? person : response.data,
        ),
      );
      showMessage(`Updated ${response.data.name}'s number`);
      setNewName("");
      setNewNumber("");
    });
  };

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
      handleNumberReplace(newName);
    } else if (newName.trim() && newNumber.trim()) {
      const newPerson = { name: newName, number: newNumber };

      numberService.create(newPerson).then((response) => {
        setPersons(persons.concat(response.data));
        showMessage(`Added ${response.data.name}`);
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
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
