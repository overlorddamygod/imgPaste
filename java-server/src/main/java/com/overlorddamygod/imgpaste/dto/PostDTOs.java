package com.overlorddamygod.imgpaste.dto;

import org.hibernate.validator.constraints.Length;
import jakarta.validation.constraints.*;

import com.overlorddamygod.imgpaste.model.Post;
import com.overlorddamygod.imgpaste.model.PostItem;
import com.overlorddamygod.imgpaste.model.User;

import java.util.UUID;

public class PostDTOs {
    public static class CreatePostRequest {
        @NotBlank(message = "Title is required")
        @Length(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
        public String title;
    }

    public static class AddPostItemRequest {
        @NotNull(message = "Post id is required")
        public UUID id;

        @NotBlank(message = "Type is required")
        @Pattern(regexp = "text|image", message = "Type must be 'text' or 'image'")
        public String type;

        // For text, must not be blank; for image, can be null (handled in controller)
        public String content;
    }

    public static class AuthorDto {
        public UUID id;
        public String username;
        public String email;

        public AuthorDto(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.email = user.getEmail();
        }
    }

    public static class PostDto {
        public UUID id;
        public String title;
        public Boolean published;
        public AuthorDto author;
        public java.util.List<PostItemDto> postItems;
        public java.time.LocalDateTime createdAt;

        public PostDto(Post post) {
            this.id = post.getId();
            this.title = post.getTitle();
            this.published = post.getPublished();
            this.author = post.getAuthor() != null ? new AuthorDto(post.getAuthor()) : null;
            this.createdAt = post.getCreatedAt();
            if (post.getPostItems() != null) {
                this.postItems = post.getPostItems().stream()
                        .map(PostItemDto::new)
                        .toList();
            }
        }
    }

    public static class PostResponse {
        private PostDto post;

        public PostResponse(Post post) {
            this.post = new PostDto(post);
        }

        public PostDto getPost() {
            return post;
        }

        public void setPost(PostDto post) {
            this.post = post;
        }
    }

    public static class PostItemDto {
        public UUID id;
        public String type;
        public String content;
        public UUID postId;
        public java.time.LocalDateTime createdAt;

        // public PostDto post;

        public PostItemDto(PostItem item) {
            this.id = item.getId();
            this.type = item.getType();
            this.content = item.getContent();
            this.postId = item.getPostId();
            this.createdAt = item.getCreatedAt();
            // this.post = new PostDto(item.getPost());
        }
    }

    public static class PostItemResponse {
        private PostItemDto postItem;

        public PostItemResponse(PostItem item) {
            this.postItem = new PostItemDto(item);
        }

        public PostItemDto getPostItem() {
            return postItem;
        }

        public void setPostItem(PostItemDto postItem) {
            this.postItem = postItem;
        }
    }
}
