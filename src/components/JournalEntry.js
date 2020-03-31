import React from 'react'

const JournalEntry = ({ entry, toggleImportance }) => {
	const label = entry.important
		? 'make not important' : 'make important'
		
  return (
    <li className="journalEntry">
			{entry.date}: {entry.content}
			<button onClick={toggleImportance}>{label}</button>
		</li>
  )
}

export default JournalEntry