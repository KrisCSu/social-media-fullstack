package com.example.service;

import com.example.entity.MessageLike;
import com.example.repository.MessageLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class MessageLikeService {

    private final MessageLikeRepository messageLikeRepository;

    @Autowired
    public MessageLikeService(MessageLikeRepository messageLikeRepository) {
        this.messageLikeRepository = messageLikeRepository;
    }
    
    public MessageLike addLike(MessageLike messageLike) {
        if (messageLikeRepository.findByMessageIdAndLikedBy(messageLike.getMessageId(), messageLike.getLikedBy()) != null) {
            throw new IllegalArgumentException("User has already liked this message.");
        }
        messageLike.setTimePostedEpoch(Instant.now().getEpochSecond());
        return messageLikeRepository.save(messageLike);
    }
    
    public void removeLike(Integer messageId, Integer likedBy) {
        MessageLike like = messageLikeRepository.findByMessageIdAndLikedBy(messageId, likedBy);
        if (like == null) {
            throw new IllegalArgumentException("No like record found for this user and message.");
        }
        messageLikeRepository.delete(like);
    }
    
    public List<MessageLike> getLikesByMessageId(Integer messageId) {
        return messageLikeRepository.findByMessageId(messageId);
    }
    
    public List<MessageLike> getLikesByUserId(Integer userId) {
        return messageLikeRepository.findByLikedBy(userId);
    }

    public boolean hasUserLikedMessage(Integer messageId, Integer userId) {
        return messageLikeRepository.findByMessageIdAndLikedBy(messageId, userId) != null;
    }
}