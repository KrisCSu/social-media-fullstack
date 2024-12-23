package com.example.service;

import com.example.entity.Comment;
import com.example.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    /**
     * Create a new comment.
     *
     * @param comment the comment entity to be created
     * @return the saved comment entity
     * @throws IllegalArgumentException if the commentText is null, empty, or exceeds 255 characters
     */
    public Comment createComment(Comment comment) {
        if (comment.getCommentText() == null || comment.getCommentText().isEmpty()) {
            throw new IllegalArgumentException("Empty comment content!");
        }
        if (comment.getCommentText().length() > 255) {
            throw new IllegalArgumentException("Comment text cannot exceed 255 characters.");
        }
        comment.setTimePostedEpoch(Instant.now().getEpochSecond());
        return commentRepository.save(comment);
    }

    /**
     * Retrieve all comments.
     *
     * @return a list of all comments
     */
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    /**
     * Retrieve a comment by its ID.
     *
     * @param id the ID of the comment
     * @return an Optional containing the comment if found
     */
    public Optional<Comment> getCommentById(Integer id) {
        return commentRepository.findById(id);
    }

    /**
     * Delete a comment by its ID.
     *
     * @param id the ID of the comment
     * @return 1 if the comment was deleted, 0 otherwise
     */
    public Integer deleteComment(Integer id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return 1;
        }
        return 0;
    }

    /**
     * Update a comment's text by its ID.
     *
     * @param id   the ID of the comment to update
     * @param text the new text of the comment
     * @return 1 if the comment was updated, 0 otherwise
     */
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

    /**
     * Retrieve comments by the account ID of the user who posted them.
     *
     * @param accountId the ID of the account
     * @return a list of comments posted by the specified account
     */
    public List<Comment> getCommentsByAccountId(Integer accountId) {
        return commentRepository.findByPostedBy(accountId);
    }

    /**
     * Retrieve comments associated with a specific message.
     *
     * @param messageId the ID of the message
     * @return a list of comments for the specified message
     */
    public List<Comment> getCommentsByMessageId(Integer messageId) {
        return commentRepository.findByMessageId(messageId);
    }
}