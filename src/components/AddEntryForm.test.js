import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AddEntryForm from './AddEntryForm'

test('<AddEntryForm/> updates parent state and call onSubmit', () => {
	const createEntry = jest.fn()

	const component = render(
		<AddEntryForm createEntry={createEntry}/>
	)

	const input = component.container.querySelector('input')
	const form = component.container.querySelector('form')

	fireEvent.change(input, {
		target: { value: 'testing of forms could be easier' }
	})
	fireEvent.submit(form)

	expect(createEntry.mock.calls).toHaveLength(1)
	expect(createEntry.mock.calls[0][0].content).toBe('testing of forms could be easier')
})