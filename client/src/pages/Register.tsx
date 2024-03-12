import { useState } from 'react';
import { PrimaryButton } from '../components/Button'
import { axiosClient } from '../lib/axiosClient'
import {useNavigate} from 'react-router-dom';

const Register = () => {
	const navigate = useNavigate();
	const [message, setMessage] = useState('');

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.currentTarget
		const username = form.username.value
		const email = form.email.value
		const password = form.password.value
		const confirmPassword = form.confirmPassword.value

		try {
			await axiosClient.post('/auth/register', {
				username,
				email,
				password,
				confirmPassword
			})

			navigate('/login?message=Account Created Succesfully. Please Log in.')
		} catch (error) {
			console.log(error)
			setMessage(error.response.data.message)
		}
	}

	return (
		<div className="flex justify-center items-center">
			<form className="p-5 w-1/4 flex flex-col gap-3" onSubmit={onSubmit}>
				<h1 className="text-3xl">Register</h1>
				{message && <p className="text-red-500">{message}</p>}
				<div className="form-group">
					<label htmlFor="username" className="block">Username</label>
					<input type="text" id="username" name="username" className="p-2 rounded text-black w-full" />
				</div>
				<div className="form-group">
					<label htmlFor="email" className="block">Email</label>
					<input type="email" id="email" name="email" className="p-2 rounded text-black w-full" />
				</div>
				<div className="form-group">
					<label htmlFor="password" className="block">Password</label>
					<input type="password" id="password" name="password" className="form-control p-2 rounded text-black w-full" />
				</div>
				<div className="form-group mb-2">
					<label htmlFor="confirmPassword" className="block">Confirm Password</label>
					<input type="password" id="confirmPassword" name="confirmPassword" className="form-control p-2 rounded text-black w-full" />
				</div>
				<PrimaryButton type="submit">Register</PrimaryButton>
			</form>
		</div>
	)
}

export default Register