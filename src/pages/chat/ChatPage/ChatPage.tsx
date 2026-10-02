import {useState, useEffect, useCallback} from 'react'
import {Modal} from '@/shared/ui/Modal/Modal'
import {Input} from '@/shared/ui/Input/Input'
import {Button} from '@/shared/ui/Button/Button'
import {normalizePhone, isValidPhone} from '@/shared/lib/phone/phone'
import type {Message} from '@/entities/message/model/type'
import {useSendMessage} from '@/features/send-message/model/useSendMessage'
import {useReceiveMessage} from '@/features/receive-message/model/useReceiveMessage'
import {MessageList} from '@/entities/message/ui/MessageList'
import {MessageForm} from '@/features/send-message/ui/MessageForm/MessageForm'
import styles from './ChatPage.module.scss'

export const ChatPage = () => {
	const [phoneNumber, setPhoneNumber] = useState('')
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<Message[]>([])
	const [chatId, setChatId] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(true)
	const [isValidatedPhone, setIsValidatedPhone] = useState(true)

	const {handleSendMessage, isSending, sendError} = useSendMessage(
		chatId,
		(message) => {
			setMessages((prev) => {
				if (prev.some((item) => item.id === message.id)) {
					return prev
				}

				return [...prev, message]
			})
		},
	)

	const handleReceiveMessage = useCallback((message: Message) => {
		setMessages((prev) => {
			if (prev.some((item) => item.id === message.id)) {
				return prev
			}

			return [...prev, message]
		})
	}, [])

	const {quotaExceeded, startPolling, stopPolling} = useReceiveMessage(
		chatId,
		handleReceiveMessage,
	)

	const handleCreateChat = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setIsValidatedPhone(true)

		if (!isValidPhone(phoneNumber)) {
			setIsValidatedPhone(false)

			return
		}

		const newChatId = `${normalizePhone(phoneNumber)}@c.us`

		setChatId(newChatId)
		setIsModalOpen(false)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!message.trim()) {
			return
		}

		await handleSendMessage(message)

		setMessage('')
	}

	useEffect(() => {
		if (!chatId) {
			return
		}

		startPolling()

		return () => {
			stopPolling()
		}
	}, [chatId, startPolling, stopPolling])

	return (
		<section className={styles.chatPage}>
			<div className={styles.modal}></div>

			<header className={styles.header}>
				<h2>WhatsApp чат {!isModalOpen ? ` c ${phoneNumber}` : null}</h2>
			</header>

			<MessageList messages={messages} />

			<MessageForm
				message={message}
				quotaExceeded={quotaExceeded}
				isSending={isSending}
				onMessageChange={setMessage}
				onSubmit={handleSubmit}
				error={sendError}
			/>

			{isModalOpen && (
				<Modal>
					<h1>Создать чат</h1>
					<form onSubmit={handleCreateChat} className={styles.form}>
						<label>
							<span>Введите номер получателя</span>
							<Input
								error={
									isValidatedPhone ? '' : 'Формат телефона не верный'
								}
								type='tel'
								placeholder='Введите номер телефона'
								value={phoneNumber}
								onChange={(e) => {
									setPhoneNumber(e.target.value)
									setIsValidatedPhone(true)
								}}
								required
							/>
						</label>
						<Button type='submit'>Начать чат</Button>
					</form>
				</Modal>
			)}
		</section>
	)
}
