import React, { useState, useEffect } from 'react';
import JournalEntry from './components/JournalEntry';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm'
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
	const [loginVisible, setLoginVisible] = useState(false)

  useEffect(() => {
    journalEntryService
      .getAll()
      .then(initialEntries => {
        setEntries(initialEntries)
      })
	}, [])
	
	useEffect(() => {
		const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
		if (loggedInUserJSON) {
			const user = JSON.parse(loggedInUserJSON)
			setUser(user)
			journalEntryService.setToken(user.token)
		}
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

			window.localStorage.setItem('loggedInUser', JSON.stringify(user))
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

	const handleLogout = () => {
		setUser(null)
		window.localStorage.removeItem('loggedInUser')
	}
	
	const loginForm = () => {
		const hideWhenVisible = { display: loginVisible ? 'none' : '' }
		const showWhenVisible = { display: loginVisible ? '' : 'none'}

		return (
			<div>
				<div style={hideWhenVisible}>
					<button onClick={() => setLoginVisible(true)}>log in</button>
				</div>
				<div style={showWhenVisible}>
					<LoginForm
						username={username}
						password={password}
						handleUsernameChange={({ target}) => setUsername(target.value)}
						handlePasswordChange={({ target }) => setPassword(target.value)}
						handleSubmit={handleLogin}
					/>
					<button onClick={() => setLoginVisible(false)}>cancel</button>
				</div>
			</div>
		)
	}

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
					<button onClick={() => handleLogout()}>logout</button>
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