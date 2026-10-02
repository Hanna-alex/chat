import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getStateInstance, type ApiCredentials} from '@/shared/api/greenApi'
import {Button} from '@/shared/ui/Button/Button'
import {Input} from '@/shared/ui/Input/Input'

import styles from './ConnectApiForm.module.scss'

export const ConnectApiForm = () => {
	const navigate = useNavigate()
	const [credentials, setCredentials] = useState<ApiCredentials>({
		apiUrl: '',
		idInstance: '',
		apiTokenInstance: '',
	})
	const [error, setError] = useState('')

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const {name, value} = event.target

		setCredentials((prev) => ({...prev, [name]: value}))
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError('')

		try {
			const data = await getStateInstance(credentials)

			if (data.stateInstance === 'authorized') {
				sessionStorage.setItem('apiCredentials', JSON.stringify(credentials))

				navigate('/chat')
			}
		} catch (error) {
			setError(
				'Не удалось подключится к GREEN-API. Проверте ID Instance, API Token Instance, API Url',
			)
			console.error('Ошибка подключения: ', error)
		}
	}

	return (
		<>
			<form className={styles.form} onSubmit={handleSubmit}>
				<label>
					<span>ID Instance</span>
					<Input
						type='text'
						name='idInstance'
						id='idInstance'
						placeholder='Введите idInstance'
						value={credentials.idInstance}
						onChange={handleChange}
						required
					/>
				</label>
				<label>
					<span>API Token Instance</span>
					<Input
						type='password'
						name='apiTokenInstance'
						id='apiTokenInstance'
						placeholder='Введите apiTokenInstance '
						value={credentials.apiTokenInstance}
						onChange={handleChange}
						required
					/>
				</label>
				<label>
					<span>API Url</span>
					<Input
						type='text'
						name='apiUrl'
						id='apiUrl'
						placeholder='Введите apiUrl'
						value={credentials.apiUrl}
						onChange={handleChange}
						required
					/>
				</label>
				<Button type='submit'>Подключиться</Button>
			</form>

			{error && <div className={styles.error}>{error}</div>}
		</>
	)
}
