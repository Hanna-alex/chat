import type {ApiCredentials, ApiStateResponse} from './types'

export const getStateInstance = async (
	credentials: ApiCredentials,
): Promise<ApiStateResponse> => {
	const {apiUrl, idInstance, apiTokenInstance} = credentials

	const url =
		`${apiUrl}/waInstance${idInstance}` + `/getStateInstance/${apiTokenInstance}`

	const response = await fetch(url)

	if (!response.ok) {
		throw new Error(`HTTP error: ${response.status}`)
	}

	return response.json()
}

export const sendMessage = async (
	credentials: ApiCredentials,
	chatId: string,
	message: string,
) => {
	const {apiUrl, idInstance, apiTokenInstance} = credentials

	const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			chatId,
			message,
		}),
	})

	if (!response.ok) {
		throw new Error(`${response.status === 466 ? 'Квота исчерпана' : ''}`)
	}

	return response.json()
}

export const receiveNotification = async (credentials: ApiCredentials) => {
	const {apiUrl, idInstance, apiTokenInstance} = credentials

	const url = `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=30`

	const response = await fetch(url)

	if (response.status === 408) {
		return null
	}

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(
			`HTTP error:  ${response.status} ${errorText ? `: ${errorText}` : ''}`,
		)
	}

	const text = await response.text()

	if (!text) {
		return null
	}

	return JSON.parse(text)
}

export const deleteNotification = async (
	credentials: ApiCredentials,
	receiptId: number,
) => {
	const {apiUrl, idInstance, apiTokenInstance} = credentials

	const url = `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`

	const response = await fetch(url, {
		method: 'DELETE',
	})

	if (!response.ok) {
		throw new Error(`HTTP error: ${response.status}`)
	}

	const data = await response.json()

	console.log('Удаление уведомления: ', data)
	return data
}
