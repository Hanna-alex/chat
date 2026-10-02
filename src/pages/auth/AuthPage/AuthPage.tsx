import {ConnectApiForm} from '@/features/connect-api/ui/ConnectApiForm/ConnectApiForm'
import {Text} from '@/shared/ui/Text/Text'
import styles from './AuthPage.module.scss'

export const AuthPage = () => {
	return (
		<main className={styles.page}>
			<section className={styles.auth}>
				<div className={styles.intro}>
					<h1>
						<span className={styles.brandColor}>WhatsApp</span> чат
					</h1>

					<h4 className={styles.subtitle}>Вход по данным GREEN-API</h4>

					<Text variant='description'>
						Введите ваши учетные данные для работы с WhatsApp
					</Text>
				</div>

				<ConnectApiForm />

				<Text variant='description'>
					Ваши данные сохраняются в браузере и используются только для работы с
					GREEN-API
				</Text>
			</section>
		</main>
	)
}
