package com.overlorddamygod.imgpaste.repository;

import com.overlorddamygod.imgpaste.model.PostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PostItemRepository extends JpaRepository<PostItem, UUID> {
}
