import axios from 'axios'

const baseUrl = '/api/journalEntries'

let token = null

const setToken = newToken => {
	token = `bearer ${newToken}`
}

const getAll = () => {
	const request = axios.get(baseUrl)
	return request.then(response => response.data)
}

const create = newEntry => {
	const config = {
		headers: { Authorization: token }
	}
	const request = axios.post(baseUrl, newEntry, config)
	return request.then(response => response.data)
}

const update = (id, newEntry) => {
	const request =  axios.put(`${baseUrl}/${id}`, newEntry)
	return request.then(response => response.data)
}

export default {
	getAll,
	create,
	update,
	setToken
}