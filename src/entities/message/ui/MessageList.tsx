import type {Message} from '../model/type'
import styles from './MessageList.module.scss'

interface MessageProps {
	messages: Message[]
}

export const MessageList = ({messages}: MessageProps) => {
	return (
		<ul className={styles.list}>
			{messages.map((message) => (
				<li
					key={message.id}
					className={`${styles.message} ${message.fromMe ? styles.outgoing : styles.incoming}`}>
					{message.text}
				</li>
			))}
		</ul>
	)
}
