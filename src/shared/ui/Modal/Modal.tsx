import {createPortal} from 'react-dom'
import type {ReactNode} from 'react'
import styles from './Modal.module.scss'

interface ModalProps {
	children: ReactNode
	onClose?: () => void
}

export const Modal = ({children, onClose}: ModalProps) => {
	return createPortal(
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>,
		document.body,
	)
}
