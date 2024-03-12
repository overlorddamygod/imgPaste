export interface Author {
    id: number;
    email: string;
    username: string;
    password: string;
}

export interface Post {
    id: number;
    title: string;
    published: boolean;
    author: Author;
    authorId: number | null;
    createdAt: Date;
    updatedAt: Date;
    postItems: PostItem[];
}

export interface PostItem {
    id: number;
    type: string;
    content: string;
    postId: number;
    createdAt: Date;
    updatedAt: Date;
    post: Post;
}
