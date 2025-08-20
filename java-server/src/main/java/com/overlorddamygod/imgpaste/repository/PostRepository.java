package com.overlorddamygod.imgpaste.repository;

import com.overlorddamygod.imgpaste.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
}
