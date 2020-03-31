import React, { useState, useEffect } from 'react';
import JournalEntry from './components/JournalEntry';
import Notification from './components/Notification';
import journalEntryService from './services/journalEntryService'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
    </div>
  )
}

const App = () => {
  const [entries, setEntries] = useState([])
  const [newEntry, setNewEntry] = useState('new entry...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    journalEntryService
      .getAll()
      .then(initialEntries => {
        setEntries(initialEntries)
      })
  }, [])

  const entriesToShow = showAll
    ? entries
    : entries.filter(entry => entry.important === true)

  const toggleImportanceOf = id => {
    const entry = entries.find(entry => entry.id === id)
    const changedEntry = { ...entry, important: !entry.important }

    journalEntryService
      .update(id, changedEntry)
      .then(returnedEntry => {
        setEntries(entries.map(entry => entry.id !== id ? entry : returnedEntry))
      })
      .catch(error => {
        setErrorMessage(
          `Journal entry '${entry.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setEntries(entries.filter(entry => entry.id !== id))
      })
  }

  const rows = () => entriesToShow.map(entry =>
    <JournalEntry
      key={entry.id}
      entry={entry}
      toggleImportance={() => toggleImportanceOf(entry.id)}
    />
  )

  const addEntry = (event) => {
    event.preventDefault()
    const entryObject = {
      content: newEntry,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    }

    // Note: there is a diff b/w entryObject and response.data is that id attribute is automatically created in response.data
    journalEntryService
      .create(entryObject)
      .then(returnedEntry => {
        setEntries(entries.concat(returnedEntry))
        setNewEntry('')
      })
  }

  const handleEntryChange = (event) => {
    setNewEntry(event.target.value)
  }

  return (
    <div>
      <h1>Journal</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {rows()}
      </ul>
      <form onSubmit={addEntry}>
        <input
          value={newEntry}
          onChange={handleEntryChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App;