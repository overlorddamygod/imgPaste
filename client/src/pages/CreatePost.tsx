import React, { useState } from 'react'
import { PrimaryButton } from '../components/Button'
import { axiosClient } from '../lib/axiosClient'
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
	const navigate = useNavigate();
	const [message, setMessage] = useState('');

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.currentTarget
		const title = form.title.value
		if (!title) {
			setMessage('Title is required');
			return;
		}

		try {
			const response = await axiosClient.post('/post/create', {
				title
			})
			console.log('Post Created')

			navigate(`/p/${response.data.data.id}`)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div>
			<form className="py-5 lg:w-2/6 flex flex-col gap-3" onSubmit={onSubmit}>
				<h1 className="text-4xl">Create a Post</h1>
				{message && <p className="text-red-500">{message}</p>}
				<div className="form-group">
					<label htmlFor="title" className="block">Title</label>
					<input type="text" id="title" name="title" className="form-control p-2 rounded text-black w-full" />
				</div>
				<PrimaryButton type="submit">Create</PrimaryButton>
			</form>
		</div>
	)
}

export default CreatePost