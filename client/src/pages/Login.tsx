import { useLocation, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/Button'
import { useState } from 'react';
import { axiosClient } from '../lib/axiosClient';
import { useAuth } from '../state';

const Login = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [message,setMessage] = useState(new URLSearchParams(location.search).get('message'));
	const { login } = useAuth();
	
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.currentTarget
		const email = form.email.value
		const password = form.password.value

		try {
			const response = await axiosClient.post('/auth/login', {
				email,
				password
			})

			const accessToken = response.data.data.token
			
			login(accessToken);
			console.log(accessToken)

			navigate('/')
		} catch (error) {
			console.log(error)
			setMessage(error.response.data.message)
		}
	}
	
	return (
		<div className="flex justify-center items-center">

			<form className="p-5 w-1/4 flex flex-col gap-3" onSubmit={onSubmit}>
				<h1 className="text-3xl">Login</h1>
				{message && <p className="text-red-500">{message}</p>}
				<div className="form-group">
					<label htmlFor="email" className="block">Email</label>
					<input type="email" id="email" name="email" className="p-2 rounded text-black w-full" />
				</div>
				<div className="form-group">
					<label htmlFor="password" className="block">Password</label>
					<input type="password" id="password" name="password" className="form-control p-2 rounded text-black w-full" />
				</div>
				<PrimaryButton type="submit">Login</PrimaryButton>
			</form>
		</div>
	)
}

export default Login