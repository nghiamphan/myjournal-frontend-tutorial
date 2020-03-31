import React, { useState, useEffect } from 'react'
import JournalEntry from './components/JournalEntry'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import AddEntryForm from './components/AddEntryForm'
import Toggleable from './components/Toggleable'
import journalEntryService from './services/journalEntryService'
import loginService from './services/loginService'

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
	const [showAll, setShowAll] = useState(true)
	const [errorMessage, setErrorMessage] = useState('')
	const [user, setUser] = useState(null)

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
			.catch(() => {
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

	const addEntry = (entryObject) => {
		addEntryFormRef.current.toggleVisibility()
		// Note: there is a diff b/w entryObject and response.data is that id attribute is automatically created in response.data
		journalEntryService
			.create(entryObject)
			.then(returnedEntry => {
				setEntries(entries.concat(returnedEntry))
			})
	}

	const handleLogin = async (userObject) => {
		try {
			const user = await loginService.login(userObject)
			window.localStorage.setItem('loggedInUser', JSON.stringify(user))
			journalEntryService.setToken(user.token)
			setUser(user)
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
		return (
			<Toggleable buttonLabel='login'>
				<LoginForm
					handleLogin={handleLogin}
				/>
			</Toggleable>
		)
	}

	const addEntryFormRef = React.createRef()

	const addJournalEntryForm = () => (
		<Toggleable
			buttonLabel="new entry"
			ref={addEntryFormRef}>
			<AddEntryForm createEntry={addEntry}/>
		</Toggleable>
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

export default App