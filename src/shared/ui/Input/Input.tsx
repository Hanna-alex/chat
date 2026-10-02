import type {InputHTMLAttributes} from 'react'
import styles from './Input.module.scss'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: string
}

export const Input = ({error, ...props}: InputProps) => {
	return (
		<div className={styles.wrapper}>
			<input
				className={`${styles.input} ${error ? styles.error : ''}`}
				{...props}
			/>
			{error && <span className={styles.errorMessage}>{error}</span>}
		</div>
	)
}
