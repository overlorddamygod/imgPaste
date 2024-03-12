import { axiosClient } from "../lib/axiosClient";
import Copy from '../assets/copy.svg'
import Download from '../assets/download.svg'
import Share from '../assets/share.svg'
import Delete from '../assets/delete.svg'
import { PostItem } from "../types";
import { FC, ReactNode } from "react";
import { copyToClipboard } from "../lib/clipboard";

interface PostItemProps {
    postItem: PostItem
    refresh?: () => void
    children?: ReactNode
    isOwner: () => boolean
}

export const PostText: FC<PostItemProps> = (prop) => {
    return <PostItemLayout {...prop}>{prop.postItem.content}</PostItemLayout>
}
export const PostImage: FC<PostItemProps> = (prop) => {
    return <PostItemLayout {...prop}>
        <img src={getImageUrl(prop.postItem.content)} alt="postItem" />
    </PostItemLayout>
}

const getImageUrl = (content: string) => {
    return `${import.meta.env.VITE_SERVER_URL}${content}`;
}

const PostItemLayout: FC<PostItemProps> = ({ postItem, refresh = () => { }, isOwner, children }) => {
    const onDelete = async () => {
        try {
            await axiosClient.delete(`/post/postItem/${postItem.id}`)
            refresh();
        } catch (error) {
            console.log(error);
        }
    }
    return <div className="bg-white text-black rounded">
        <div className="p-2 flex justify-between items-center border-b">
            <div className="">
                {new Date(postItem.createdAt).toDateString()}
            </div>
            <div className="flex gap-2">
                {/* add copy content, delete Button */}
                {postItem.type == "text" && <button onClick={() => copyToClipboard(postItem.content)}><img src={Copy} alt="copy" className="w-6" /></button>}
                {postItem.type == "image" && <button onClick={() => {
                    fetch(getImageUrl(postItem.content))
                        .then(response => response.blob())
                        .then(blob => {
                            const blobUrl = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = blobUrl;
                            a.download = `p-${postItem.postId}-i-${postItem.id}-${postItem.content.split('/').pop()}`; // Set the download filename

                            a.click();

                            URL.revokeObjectURL(blobUrl);
                        })
                        .catch(error => {
                            console.error('Error downloading image:', error);
                        });
                }}><img src={Download} alt="download" className="w-6" /></button>}
                <button onClick={() => copyToClipboard(window.location.host + `/p/${postItem.postId}/i/${postItem.id}`)}><img src={Share} alt="share" className="w-6" /></button>

                {isOwner() && <button onClick={onDelete}><img src={Delete} alt="delete" className="w-6" /></button>}
            </div>
        </div>
        <div className="p-2">{children}</div>
    </div>
}