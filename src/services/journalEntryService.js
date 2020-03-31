import axios from 'axios'

const baseUrl = '/api/journalEntries'

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}

const create = newEntry => {
	const request = axios.post(baseUrl, newEntry)
	return request.then(response => response.data)
}

const update = (id, newEntry) => {
	const request =  axios.put(`${baseUrl}/${id}`, newEntry)
	return request.then(response => response.data)
}

export default {
	getAll,
	create,
	update
}