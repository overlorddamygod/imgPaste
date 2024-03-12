import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { PostItem } from '../types';
import { PostImage, PostText } from '../components/Post';
import { axiosClient } from '../lib/axiosClient';

const PostItemPage = () => {
	const {  postItemId } = useParams();
	const navigate = useNavigate();
	const [postItem, setPostItem] = useState<PostItem | null>(null);

	const fetchPostItem = async () => {
		console.log(postItemId)
		try {
			const response = await axiosClient.get(`/post/postItem/${postItemId}`);
			console.log("here")
			console.log(response.data)
			setPostItem(response.data.data.postItem);
		} catch (error) {
			if (error.response.status === 404) {
				navigate('/404');
			}
		}
	}

	useEffect(() => {
		fetchPostItem();
	}, [])

	if (!postItem) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{postItem.type == "text" ? <PostText postItem={postItem} /> : <PostImage postItem={postItem} />}
		</div>
	)
}

export default PostItemPage