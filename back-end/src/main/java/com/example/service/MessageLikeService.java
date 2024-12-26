package com.example.service;

import com.example.entity.MessageLike;
import com.example.repository.MessageLikeRepository;
import com.example.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class MessageLikeService {
    @Autowired
    private MessageLikeRepository messageLikeRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    public MessageLikeService(MessageLikeRepository messageLikeRepository) {
        this.messageLikeRepository = messageLikeRepository;
    }

    public MessageLike addLike(String token, MessageLike messageLike) {
        validateTokenAndExtractUsername(token);
        MessageLike existingLike = messageLikeRepository.findByMessageIdAndLikedBy(messageLike.getMessageId(),
                messageLike.getLikedBy());
        if (existingLike != null) {
            return existingLike;
        }
        messageLike.setTimePostedEpoch(Instant.now().getEpochSecond());
        return messageLikeRepository.save(messageLike);
    }

    public void removeLike(String token, Integer messageId, Integer likedBy) {
        validateTokenAndExtractUsername(token);
        MessageLike like = messageLikeRepository.findByMessageIdAndLikedBy(messageId, likedBy);
        if (like == null) {
            throw new IllegalArgumentException("No like record found for this user and message.");
        }
        messageLikeRepository.delete(like);
    }

    public List<MessageLike> getLikesByMessageId(String token, Integer messageId) {
        validateTokenAndExtractUsername(token);
        return messageLikeRepository.findByMessageId(messageId);
    }

    public List<MessageLike> getLikesByUserId(Integer userId) {
        return messageLikeRepository.findByLikedBy(userId);
    }

    public boolean hasUserLikedMessage(String token, Integer messageId, Integer userId) {
        validateTokenAndExtractUsername(token);
        return messageLikeRepository.findByMessageIdAndLikedBy(messageId, userId) != null;
    }

    private String validateTokenAndExtractUsername(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid or expired token.");
        }
        return jwtUtil.extractUsername(token);
    }
}