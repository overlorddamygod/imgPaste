package com.overlorddamygod.imgpaste.service;

import com.overlorddamygod.imgpaste.model.*;
import com.overlorddamygod.imgpaste.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepo;
    @Autowired
    private PostItemRepository postItemRepo;

    public Post createPost(String title, User author) {
        Post post = new Post(title, author);
        return postRepo.save(post);
    }

    public Optional<Post> getPost(UUID id) {
        return postRepo.findById(id);
    }

    public Optional<PostItem> getPostItem(UUID id) {
        return postItemRepo.findById(id);
    }

    public PostItem addPostItem(UUID postId, String type, String content, MultipartFile file) throws IOException {
        Post post = postRepo.findById(postId).orElseThrow();
        String finalContent = content;
        if ("image".equals(type) && file != null) {
            String publicDir = "./public";
            Path publicPath = Paths.get(publicDir);
            if (!Files.exists(publicPath)) {
                Files.createDirectories(publicPath);
            }
            String extension = "";
            String originalName = file.getOriginalFilename();
            int dotIdx = originalName != null ? originalName.lastIndexOf('.') : -1;
            if (dotIdx != -1) {
                extension = originalName.substring(dotIdx);
            }
            String randomName = UUID.randomUUID().toString() + extension;
            String imagePath = publicDir + "/" + randomName;
            file.transferTo(Paths.get(imagePath));
            finalContent = imagePath.replaceFirst("\\.", "");
        }
        PostItem item = new PostItem(type, finalContent, post);
        return postItemRepo.save(item);
    }

    public void deletePost(UUID id) {
        postRepo.deleteById(id);
    }

    public void deletePostItem(UUID id) {
        postItemRepo.deleteById(id);
    }
}
