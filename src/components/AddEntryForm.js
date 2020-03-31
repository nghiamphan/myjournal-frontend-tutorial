import React, { useState } from 'react'

const AddEntryForm = ({ createEntry }) => {
	const [newEntryContent, setNewEntryContent] = useState('')

	const handleEntryContentChange = (event) => {
		setNewEntryContent(event.target.value)
	}

	const addEntry = (event) => {
		event.preventDefault()
		createEntry({
			content: newEntryContent,
			important: Math.random() > 0.5
		})

		setNewEntryContent('')
	}
	
	return (
		<div>
			<h2>Create a new entry</h2>

			<form onSubmit={addEntry}>
				<input
					value={newEntryContent}
					onChange={handleEntryContentChange}
				/>
				<button type="submit">save</button>
			</form>
		</div>
	)
}

export default AddEntryForm