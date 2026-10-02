import {Navigate, Route, Routes} from 'react-router-dom'
import {AuthPage} from '@/pages/auth/AuthPage/AuthPage'
import {ChatPage} from '@/pages/chat/ChatPage/ChatPage'
// import styles from './App.module.scss'

const App = () => {
	return (
		<Routes>
			<Route path='/auth' element={<AuthPage />} />
			<Route path='/chat' element={<ChatPage />} />
			<Route path='*' element={<Navigate to='/auth' replace />} />
		</Routes>
	)
}
export default App
