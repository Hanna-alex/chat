import {useState, useRef, useCallback} from 'react'
import {receiveNotification, deleteNotification} from '@/shared/api/greenApi'
import type {Message} from '@/entities/message/model/type'

export const useReceiveMessage = (
	chatId: string,
	onMessageReceive: (message: Message) => void,
) => {
	const [receiveError, setReceiveError] = useState('')
	const [quotaExceeded, setQuotaExceeded] = useState(false)

	const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const isPollingRef = useRef(false)

	const handleReceive = useCallback(async (): Promise<
		Message | 'quotaExceeded' | null
	> => {
		setReceiveError('')

		const credentials = JSON.parse(sessionStorage.getItem('apiCredentials') || '{}')

		try {
			const data = await receiveNotification(credentials)

			if (!data) {
				return null
			}

			if (data.body?.typeWebhook === 'quotaExceeded') {
				setQuotaExceeded(true)

				console.log('Квота GREEN API исчерпана')

				return 'quotaExceeded'
			}

			const incomingChatId = data.body?.senderData?.chatId
			const receiptId = data.receiptId

			if (incomingChatId !== chatId) {
				if (receiptId) {
					await deleteNotification(credentials, receiptId)
				}
				return null
			}

			if (
				data.body?.typeWebhook === 'incomingMessageReceived' &&
				data.body?.messageData?.typeMessage === 'textMessage'
			) {
				const text = data.body?.messageData?.textMessageData?.textMessage
				const id = data.body?.idMessage

				if (text && id) {
					setQuotaExceeded(false)

					const message: Message = {
						id,
						text,
						fromMe: false,
					}

					onMessageReceive(message)
				}
			}

			if (receiptId) {
				await deleteNotification(credentials, receiptId)
			}

			return null
		} catch (error) {
			if (error instanceof Error && error.message.includes('408')) {
				return null
			}
			setReceiveError(`Ошибка получения уведомления: ${error}`)

			return null
		}
	}, [onMessageReceive, chatId])

	const stopPolling = useCallback(() => {
		isPollingRef.current = false

		const timeoutId = pollingRef.current

		if (timeoutId !== null) {
			clearTimeout(timeoutId)
			pollingRef.current = null
		}
	}, [])

	const startPolling = useCallback(() => {
		if (isPollingRef.current) {
			return
		}

		isPollingRef.current = true

		const poll = async () => {
			if (!isPollingRef.current) {
				return
			}

			const result = await handleReceive()

			if (!isPollingRef.current) {
				return
			}

			if (result === 'quotaExceeded') {
				stopPolling()
				return
			}

			pollingRef.current = window.setTimeout(poll, 1000)
		}

		poll()
	}, [handleReceive, stopPolling])

	return {
		handleReceive,
		quotaExceeded,
		startPolling,
		stopPolling,
		receiveError,
	}
}
