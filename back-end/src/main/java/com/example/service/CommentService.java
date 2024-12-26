package com.example.service;

import com.example.entity.Comment;
import com.example.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import com.example.util.JwtUtil;


@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment createComment(String token, Comment comment) {
        validateTokenAndExtractUsername(token);
        if (comment.getCommentText() == null || comment.getCommentText().isEmpty()) {
            throw new IllegalArgumentException("Empty comment content!");
        }
        if (comment.getCommentText().length() > 255) {
            throw new IllegalArgumentException("Comment text cannot exceed 255 characters.");
        }
        comment.setTimePostedEpoch(Instant.now().getEpochSecond());
        return commentRepository.save(comment);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getCommentById(Integer id) {
        return commentRepository.findById(id);
    }

    public Integer deleteComment(Integer id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return 1;
        }
        return 0;
    }

    public Integer updateComment(Integer id, Comment text) {
        Optional<Comment> updatedComment = commentRepository.findById(id);
        if (!updatedComment.isPresent() || text.getCommentText().length() > 255 || text.getCommentText().isEmpty()) {
            return 0;
        } else {
            updatedComment.get().setCommentText(text.getCommentText());
            commentRepository.save(updatedComment.get());
            return 1;
        }
    }

    public List<Comment> getCommentsByAccountId(Integer accountId) {
        return commentRepository.findByPostedBy(accountId);
    }

    public List<Comment> getCommentsByMessageId(String token, Integer messageId) {
        validateTokenAndExtractUsername(token);
        return commentRepository.findByMessageId(messageId);
    }

    private String validateTokenAndExtractUsername(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid or expired token.");
        }
        return jwtUtil.extractUsername(token);
    }
}