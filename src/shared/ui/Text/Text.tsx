import type {ReactNode} from 'react'
import styles from './Text.module.scss'

type TextVariant = 'description'

interface TextProps {
	children: ReactNode
	variant?: TextVariant
}

export const Text = ({variant, children}: TextProps) => {
	return (
		<p className={variant === 'description' ? styles.description : ''}>{children}</p>
	)
}
