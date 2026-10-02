import {useState} from 'react'
import {type ApiCredentials, sendMessage} from '@/shared/api/greenApi'
import type {Message} from '@/entities/message/model/type'

export const useSendMessage = (
	chatId: string,
	onMessageSent: (message: Message) => void,
) => {
	const [isSending, setIsSending] = useState(false)
	const [sendError, setSendError] = useState('')

	const handleSendMessage = async (message: string) => {
		setSendError('')

		const storedCredentials = sessionStorage.getItem('apiCredentials')

		if (!storedCredentials) {
			return
		}

		const credentials: ApiCredentials = JSON.parse(storedCredentials)

		try {
			setIsSending(true)

			const data = await sendMessage(credentials, chatId, message)

			onMessageSent({
				id: data.idMessage,
				text: message,
				fromMe: true,
			})
		} catch (error) {
			setSendError(
				`Ошибка отправки сообщения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
			)
		} finally {
			setIsSending(false)
		}
	}
	return {
		handleSendMessage,
		isSending,
		sendError,
	}
}
