import type {ButtonHTMLAttributes} from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant
}

export const Button = ({children, variant, ...props}: ButtonProps) => {
	return (
		<button className={`${styles.btn} ${variant ? styles[variant] : ''}`} {...props}>
			{children}
		</button>
	)
}
