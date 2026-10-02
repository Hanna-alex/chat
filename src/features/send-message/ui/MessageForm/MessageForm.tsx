import {Input} from '@/shared/ui/Input/Input'
import {Button} from '@/shared/ui/Button/Button'
import styles from './MessageForm.module.scss'

interface MessageFormProps {
	message: string
	quotaExceeded: boolean
	isSending?: boolean
	error?: string
	onMessageChange: (value: string) => void
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export const MessageForm = ({
	message,
	quotaExceeded,
	isSending,
	onMessageChange,
	onSubmit,
	error,
}: MessageFormProps) => {
	return (
		<>
			<form onSubmit={onSubmit} className={styles.messageForm}>
				<Input
					error={error}
					type='text'
					placeholder='Введите сообщение'
					value={message}
					onChange={(e) => onMessageChange(e.target.value)}
					disabled={quotaExceeded || isSending}
					required
					maxLength={20000}
				/>

				<Button
					type='submit'
					variant='icon'
					disabled={quotaExceeded || isSending}>
					{isSending ? 'Отправка... ' : 'Отправить'}
				</Button>
			</form>

			{quotaExceeded && (
				<div>
					<h3>Лимит API исчерпан</h3>
					<p>
						Лимит запросов Green-API для текушего трарифа исчерпан. Получение
						новых сообщений временно недоступно.
					</p>
					<p>Попробуйте снова после обновления квоты</p>
				</div>
			)}
		</>
	)
}
