import React, { useState, useEffect } from 'react';
import JournalEntry from './components/JournalEntry';
import Notification from './components/Notification';
import journalEntryService from './services/journalEntryService'
import loginService from './services/loginService';

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
  const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
			const user = await loginService.login({
				username, password
			})

			journalEntryService.setToken(user.token)
			setUser(user)
			setUsername('')
			setPassword('')
		} catch (exception) {
			setErrorMessage('Wrong credentials')
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}
	
	const loginForm = () => (
		<form onSubmit={handleLogin}>
			<h2>Login</h2>
			<div>
				username
					<input
					type="text"
					value={username}
					name="Username"
					onChange={({ target }) => setUsername(target.value)}
				/>
			</div>
			<div>
				password
					<input
					type="password"
					value={password}
					name="Password"
					onChange={({ target }) => setPassword(target.value)}
				/>
			</div>
			<button type="submit">login</button>
		</form>
	)

	const addJournalEntryForm = () => (
		<form onSubmit={addEntry}>
			<input
				value={newEntry}
				onChange={handleEntryChange}
			/>
			<button type="submit">save</button>
		</form>
	)

  return (
    <div>
      <h1>Journal</h1>
      <Notification message={errorMessage} />
      
			{user === null ?
				loginForm() :
				<div>
					<p>Hello {user.name}</p>
					{addJournalEntryForm()}
				</div>
			}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {rows()}
      </ul>
      
      <Footer />
    </div>
  )
}

export default App;