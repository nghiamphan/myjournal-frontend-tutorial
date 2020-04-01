import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import JournalEntry from './JournalEntry'

test('renders content', () => {
	const entry = {
		content: 'Component testing is done with react-testing-library',
		important: true
	}

	const component = render(
		<JournalEntry entry={entry}/>
	)

	//component.debug()

	// const li = component.container.querySelector('li')
	// console.log(prettyDOM(li))

	expect(component.container).toHaveTextContent(
		'Component testing is done with react-testing-library'
	)
})

test('clicking the button calls event handler once', () => {
	const entry = {
		content: 'Component testing is done with react-testing-library',
		important: true
	}

	const mockHandler = jest.fn()

	const component = render(
		<JournalEntry entry={entry} toggleImportance={mockHandler}/>
	)

	const button = component.getByText('make not important')
	fireEvent.click(button)

	expect(mockHandler.mock.calls).toHaveLength(1)
})