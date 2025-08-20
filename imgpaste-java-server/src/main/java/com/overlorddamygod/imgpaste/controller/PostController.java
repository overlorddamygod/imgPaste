package com.overlorddamygod.imgpaste.controller;

import com.overlorddamygod.imgpaste.model.*;
import com.overlorddamygod.imgpaste.service.*;
import com.overlorddamygod.imgpaste.dto.ApiResponse;
import com.overlorddamygod.imgpaste.dto.PostDTOs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/post")
public class PostController {
    @Autowired
    private PostService postService;
    @Autowired
    private UserService userService;

    private UUID getUserId(HttpServletRequest req) {
        Claims claims = (Claims) req.getAttribute("user");
        if (claims == null)
            return null;
        Object idObj = claims.get("id");
        if (idObj instanceof UUID) {
            return (UUID) idObj;
        } else if (idObj instanceof String) {
            try {
                return UUID.fromString((String) idObj);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PostDTOs.PostResponse>> createPost(
            @Valid @RequestBody PostDTOs.CreatePostRequest req, HttpServletRequest request) {
        String title = req.title;
        UUID userId = getUserId(request);
        if (title == null || userId == null)
            return ResponseEntity.badRequest().body(new ApiResponse<>("Title is required or unauthorized"));

        try {
            User author = userService.findByUsername((String) ((Claims) request.getAttribute("user")).get("username"))
                    .orElse(null);
            Post post = postService.createPost(title, author);
            return ResponseEntity.ok(new ApiResponse<>("Post created successfully.", new PostDTOs.PostResponse(post)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>("Post creation failed: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostDTOs.PostResponse>> getPost(@PathVariable UUID id,
            HttpServletRequest request) {
        try {
            var postOpt = postService.getPost(id);
            if (postOpt.isEmpty())
                return ResponseEntity.badRequest().body(new ApiResponse<>("Post not found."));
            Post post = postOpt.get();
            // Do not check authorization for GET, allow access regardless of Authorization
            // header
            return ResponseEntity.ok(new ApiResponse<>(null, new PostDTOs.PostResponse(post)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ApiResponse<>("Get post failed: " + e.getMessage()));
        }
    }

    @GetMapping("/postItem/{id}")
    public ResponseEntity<ApiResponse<PostDTOs.PostItemResponse>> getPostItem(@PathVariable UUID id,
            HttpServletRequest request) {
        try {
            var itemOpt = postService.getPostItem(id);
            if (itemOpt.isEmpty())
                return ResponseEntity.badRequest().body(new ApiResponse<>("Post not found."));
            return ResponseEntity.ok(new ApiResponse<>(null, new PostDTOs.PostItemResponse(itemOpt.get())));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>("Get post item failed: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/addPostItem/text", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Void>> addTextPostItem(
            @Valid @RequestBody PostDTOs.AddPostItemRequest req,
            HttpServletRequest request) {
        UUID postId = req.id;
        String postType = req.type;
        String postContent = req.content;

        if (postId == null || postType == null)
            return ResponseEntity.badRequest().body(new ApiResponse<>("Post id and type are required."));

        UUID userId = getUserId(request);
        var postOpt = postService.getPost(postId);
        if (postOpt.isEmpty())
            return ResponseEntity.badRequest().body(new ApiResponse<>("Post not found."));
        Post post = postOpt.get();
        if (!java.util.Objects.equals(post.getAuthor().getId(), userId))
            return ResponseEntity.badRequest().body(new ApiResponse<>("Unauthorized"));

        try {
            if ("text".equals(postType)) {
                if (postContent == null || postContent.isEmpty())
                    return ResponseEntity.badRequest().body(new ApiResponse<>("Content is required."));
                postService.addPostItem(postId, postType, postContent, null);
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid type."));
            }
            return ResponseEntity.ok(new ApiResponse<>("Post item added successfully."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>("Failed to add post item: " + e.getMessage()));
        }
    }

    @PostMapping(value = "/addPostItem/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> addImagePostItem(
            @RequestParam("id") UUID id,
            @RequestParam("type") String type,
            @RequestParam("content") MultipartFile file,
            HttpServletRequest request) {
        if (id == null || type == null)
            return ResponseEntity.badRequest().body(new ApiResponse<>("Post id and type are required."));

        UUID userId = getUserId(request);
        var postOpt = postService.getPost(id);
        if (postOpt.isEmpty())
            return ResponseEntity.badRequest().body(new ApiResponse<>("Post not found."));
        Post post = postOpt.get();
        if (!java.util.Objects.equals(post.getAuthor().getId(), userId))
            return ResponseEntity.badRequest().body(new ApiResponse<>("Unauthorized"));

        try {
            if ("image".equals(type)) {
                if (file == null)
                    return ResponseEntity.badRequest().body(new ApiResponse<>("Image is required."));
                postService.addPostItem(id, type, null, file);
            } else {
                return ResponseEntity.badRequest().body(new ApiResponse<>("Invalid type."));
            }
            return ResponseEntity.ok(new ApiResponse<>("Post item added successfully."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>("Failed to add post item: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable UUID id, HttpServletRequest request) {
        UUID userId = getUserId(request);
        var postOpt = postService.getPost(id);
        if (postOpt.isEmpty())
            return ResponseEntity.badRequest().body(new ApiResponse<>("Post not found."));
        Post post = postOpt.get();
        if (!java.util.Objects.equals(post.getAuthor().getId(), userId))
            return ResponseEntity.badRequest().body(new ApiResponse<>("Unauthorized"));
        try {
            postService.deletePost(id);
            return ResponseEntity.ok(new ApiResponse<>("Post deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>("Failed to delete post: " + e.getMessage()));
        }
    }

    @DeleteMapping("/postItem/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePostItem(@PathVariable UUID id, HttpServletRequest request) {
        UUID userId = getUserId(request);
        var itemOpt = postService.getPostItem(id);
        if (itemOpt.isEmpty())
            return ResponseEntity.badRequest().body(new ApiResponse<>("Post Item not found."));
        PostItem item = itemOpt.get();
        if (!java.util.Objects.equals(item.getPost().getAuthor().getId(), userId))
            return ResponseEntity.badRequest().body(new ApiResponse<>("Unauthorized"));
        try {
            postService.deletePostItem(id);
            return ResponseEntity.ok(new ApiResponse<>("Post Item deleted successfully."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse<>("Failed to delete post item: " + e.getMessage()));
        }
    }
}