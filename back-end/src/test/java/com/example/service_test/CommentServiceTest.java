package com.example.service_test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.entity.Comment;
import com.example.repository.CommentRepository;
import com.example.service.CommentService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

public class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    private Comment comment;

    @BeforeEach
    public void setUp() {
        // Initialize mocks
        MockitoAnnotations.openMocks(this);

        // Prepare a test Comment object
        comment = new Comment();
        comment.setCommentId(1);
        comment.setPostedBy(1);
        comment.setMessageId(1);
        comment.setCommentText("Test Comment");
        comment.setTimePostedEpoch(1633036800L);
    }

    @Test
    public void testCreateComment() {
        // Mock repository save behavior
        when(commentRepository.save(comment)).thenReturn(comment);

        // Call the method under test
        Comment createdComment = commentService.createComment(null, comment);

        // Verify results
        assertNotNull(createdComment);
        assertEquals("Test Comment", createdComment.getCommentText());

        // Verify interactions
        verify(commentRepository).save(comment);
    }

    @Test
    public void testCreateComment_EmptyText() {
        comment.setCommentText("");

        // Expect exception for empty comment text
        assertThrows(IllegalArgumentException.class, () -> commentService.createComment(null, comment));

        // Verify no interactions with the repository
        verify(commentRepository, never()).save(any());
    }

    @Test
    public void testCreateComment_TextTooLong() {
        comment.setCommentText("A".repeat(256)); // Comment text exceeds 255 characters

        // Expect exception for too long comment text
        assertThrows(IllegalArgumentException.class, () -> commentService.createComment(null, comment));

        // Verify no interactions with the repository
        verify(commentRepository, never()).save(any());
    }

    @Test
    public void testGetCommentById() {
        // Mock repository behavior
        when(commentRepository.findById(1)).thenReturn(Optional.of(comment));

        // Call the method under test
        Optional<Comment> retrievedComment = commentService.getCommentById(1);

        // Verify results
        assertTrue(retrievedComment.isPresent());
        assertEquals("Test Comment", retrievedComment.get().getCommentText());

        // Verify interactions
        verify(commentRepository).findById(1);
    }

    @Test
    public void testDeleteComment() {
        // Mock repository behavior
        when(commentRepository.existsById(1)).thenReturn(true);

        // Call the method under test
        int result = commentService.deleteComment(1);

        // Verify results
        assertEquals(1, result);

        // Verify interactions
        verify(commentRepository).deleteById(1);
    }

    @Test
    public void testDeleteComment_NotFound() {
        // Mock repository behavior
        when(commentRepository.existsById(1)).thenReturn(false);

        // Call the method under test
        int result = commentService.deleteComment(1);

        // Verify results
        assertEquals(0, result);

        // Verify no deletion in the repository
        verify(commentRepository, never()).deleteById(any());
    }

    @Test
    public void testUpdateComment() {
        Comment updatedComment = new Comment();
        updatedComment.setCommentText("Updated Comment");

        // Mock repository behavior
        when(commentRepository.findById(1)).thenReturn(Optional.of(comment));

        // Call the method under test
        int result = commentService.updateComment(1, updatedComment);

        // Verify results
        assertEquals(1, result);
        assertEquals("Updated Comment", comment.getCommentText());

        // Verify interactions
        verify(commentRepository).save(comment);
    }

    @Test
    public void testUpdateComment_Invalid() {
        Comment updatedComment = new Comment();
        updatedComment.setCommentText(""); // Invalid comment text

        // Mock repository behavior
        when(commentRepository.findById(1)).thenReturn(Optional.of(comment));

        // Call the method under test
        int result = commentService.updateComment(1, updatedComment);

        // Verify results
        assertEquals(0, result);

        // Verify no update in the repository
        verify(commentRepository, never()).save(any());
    }

    @Test
    public void testGetCommentsByAccountId() {
        // Mock repository behavior
        when(commentRepository.findByPostedBy(1)).thenReturn(List.of(comment));

        // Call the method under test
        List<Comment> comments = commentService.getCommentsByAccountId(1);

        // Verify results
        assertNotNull(comments);
        assertEquals(1, comments.size());
        assertEquals("Test Comment", comments.get(0).getCommentText());

        // Verify interactions
        verify(commentRepository).findByPostedBy(1);
    }

    @Test
    public void testGetCommentsByMessageId() {
        // Mock repository behavior
        when(commentRepository.findByMessageId(1)).thenReturn(List.of(comment));

        // Call the method under test
        List<Comment> comments = commentService.getCommentsByMessageId(null, 1);

        // Verify results
        assertNotNull(comments);
        assertEquals(1, comments.size());
        assertEquals("Test Comment", comments.get(0).getCommentText());

        // Verify interactions
        verify(commentRepository).findByMessageId(1);
    }
}