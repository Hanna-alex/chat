export const normalizePhone = (value: string) => {
	return value.replace(/\D/g, '')
}

export const isValidPhone = (value: string) => {
	const phone = normalizePhone(value)

	return phone.length >= 10 && phone.length <= 15
}
