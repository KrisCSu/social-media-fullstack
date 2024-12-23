package com.example.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.entity.MessageLike;

public interface MessageLikeRepository extends JpaRepository<MessageLike, Integer> {

    List<MessageLike> findByMessageId(Integer messageId);

    List<MessageLike> findByLikedBy(Integer accountId);

    MessageLike findByMessageIdAndLikedBy(Integer messageId, Integer accountId);

    void deleteByMessageIdAndLikedBy(Integer messageId, Integer accountId);
}