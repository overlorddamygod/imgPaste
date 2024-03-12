import { useEffect, useState } from 'react'
import { axiosClient } from '../lib/axiosClient'
import { useNavigate, useParams } from 'react-router-dom';
import Plus from '../assets/plus.svg'
import { PrimaryButton, SecondaryButton } from '../components/Button';

import Delete from '../assets/delete.svg'
import Share from '../assets/share.svg'
import { Post } from '../types';
import { copyToClipboard } from '../lib/clipboard';
import { PostImage, PostText } from '../components/Post';
import { useAuth } from '../state';

const PostPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const {user, isLoggedIn} = useAuth();
	const [post, setPost] = useState<Post | null>(null);
	const [postItemType, setPostItemType] = useState<string | null>(null);

	useEffect(() => {
		fetchPost();
	}, []);

	const fetchPost = async () => {
		try {
			const response = await axiosClient.get(`/post/${id}`);
			console.log("here")
			setPost(response.data.data.post);
		} catch (error) {
			if (error.response.status === 404) {
				navigate('/404');
			}
		}
	}

	if (!post) {
		return <div>Loading...</div>;
	}

	const handlePostItemSelect = async (type: string) => {
		setPostItemType(type);
	}

	const onCancel = () => {
		setPostItemType(null);
	}

	const onTextSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const content = form.content.value;
		console.log(content)
		if (!content) {
			return;
		}

		try {
			const response = await axiosClient.post(`/post/addPostItem`, {
				id,
				type: "text",
				content
			});
			console.log(response.data);
			fetchPost();
			setPostItemType(null);
		} catch (error) {
			console.log(error);
		}
	}

	const onImageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const content = form.content.files[0];
		console.log(content)
		if (!content) {
			return;
		}

		const formData = new FormData();

		formData.append('id', id!);
		formData.append('type', "image");
		formData.append('content', content);

		try {
			const response = await axiosClient.post(`/post/addPostItem`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
				}
			});

			console.log(response.data);
			fetchPost();
			setPostItemType(null);
		} catch (error) {
			console.log(error);
		}
	}

	const deletePost = async () => {
		try {
			await axiosClient.delete(`/post/${id}`)
		} catch (error) {
			console.log(error);
		}
		navigate('/');
	}

	const isOwner = () => {
		return isLoggedIn() ? post.author.id === user!.id : false;
	}

	return (
		<div>
			<div className="flex justify-between items-center">
				<h1 className="text-4xl">{post.title}</h1>
				<div className="flex gap-2">
					<button onClick={() => copyToClipboard(window.location.href)}><img src={Share} alt="share" className="w-6" /></button>
					{isOwner() &&<button onClick={deletePost} className="bg-white"><img src={Delete} alt="delete" className="w-6" /></button>}
				</div>
			</div>
			<div className="flex gap-4">
				<div className="w-3/5">
					{isOwner() && (postItemType == null ?
						<div className="w-full h-64 bg-primary text-white rounded group cursor-pointer mt-4">
							<div className="flex flex-col justify-center items-center h-full group-hover:hidden ">
								<img src={Plus} alt="Plus" className="w-1/4 block fill-white" />
								<div>Add Item</div>
							</div>
							<div className="hidden group-hover:flex h-full justify-around items-center">
								<div onClick={() => handlePostItemSelect("text")}>Text</div>
								<div onClick={() => handlePostItemSelect("image")}>Image</div>
							</div>
						</div> : (postItemType == "text" ? <form onSubmit={onTextSubmit}>
							<textarea className="p-2 rounded text-black w-1/2 block" id="content" name="content" rows={10}>

							</textarea>
							<div className="flex gap-2 mt-4">
								<PrimaryButton type="submit">Add</PrimaryButton>
								<SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
							</div>
						</form> : <form onSubmit={onImageSubmit} encType="multipart/form-data">
							<input type="file" name="content" />
							<div className="flex gap-2 mt-4">
								<PrimaryButton type="submit">Add</PrimaryButton>
								<SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
							</div>
						</form>)
					)} 

					<div className="flex flex-col gap-4 my-4">
						{post.postItems.map((item, index) => {
							return (
								<div key={index}>
									{item.type == "text" ? <PostText postItem={item} refresh={fetchPost} isOwner={isOwner}/> : <PostImage postItem={item} refresh={fetchPost} isOwner={isOwner}/>}
								</div>
							)
						})}
					</div>
				</div>
				<div className="flex-1 mt-4">
					<div className="bg-white p-2 rounded text-black">
						<div>
							Author: {post.author.username}
						</div>
						<div>
							Created At: {new Date(post.createdAt).toDateString()}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PostPage