package com.example.service_test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.example.entity.MessageLike;
import com.example.repository.MessageLikeRepository;
import com.example.service.MessageLikeService;
import com.example.util.JwtUtil;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public class MessageLikeServiceTest {

    @Mock
    private MessageLikeRepository messageLikeRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private MessageLikeService messageLikeService;

    private MessageLike messageLike;

    @BeforeEach
    public void setUp() {
        // Initialize mocks
        MockitoAnnotations.openMocks(this);

        // Prepare a test MessageLike object
        messageLike = new MessageLike();
        messageLike.setMessageLikeId(1);
        messageLike.setMessageId(1);
        messageLike.setLikedBy(1);
        messageLike.setTimePostedEpoch(Instant.now().getEpochSecond());

        // Mock JwtUtil behavior
        when(jwtUtil.validateToken("valid-token")).thenReturn(true);
        when(jwtUtil.validateToken("invalid-token")).thenReturn(false);
        when(jwtUtil.extractUsername("valid-token")).thenReturn("testuser");
    }

    @Test
    public void testAddLike_NewLike() {
        String token = "valid-token";

        // Mock repository behavior
        when(messageLikeRepository.findByMessageIdAndLikedBy(1, 1)).thenReturn(null);
        when(messageLikeRepository.save(any(MessageLike.class))).thenReturn(messageLike);

        // Call the method under test
        MessageLike addedLike = messageLikeService.addLike(token, messageLike);

        // Verify results
        assertNotNull(addedLike);
        assertEquals(1, addedLike.getMessageId());
        assertEquals(1, addedLike.getLikedBy());

        // Verify interactions
        verify(jwtUtil).validateToken(token);
        verify(messageLikeRepository).findByMessageIdAndLikedBy(1, 1);
        verify(messageLikeRepository).save(messageLike);
    }

    @Test
    public void testAddLike_ExistingLike() {
        String token = "valid-token";

        // Mock repository behavior
        when(messageLikeRepository.findByMessageIdAndLikedBy(1, 1)).thenReturn(messageLike);

        // Call the method under test
        MessageLike existingLike = messageLikeService.addLike(token, messageLike);

        // Verify results
        assertNotNull(existingLike);
        assertEquals(1, existingLike.getMessageId());

        // Verify interactions
        verify(jwtUtil).validateToken(token);
        verify(messageLikeRepository).findByMessageIdAndLikedBy(1, 1);
        verify(messageLikeRepository, never()).save(any());
    }

    @Test
    public void testRemoveLike() {
        String token = "valid-token";

        // Mock repository behavior
        when(messageLikeRepository.findByMessageIdAndLikedBy(1, 1)).thenReturn(messageLike);

        // Call the method under test
        messageLikeService.removeLike(token, 1, 1);

        // Verify interactions
        verify(jwtUtil).validateToken(token);
        verify(messageLikeRepository).findByMessageIdAndLikedBy(1, 1);
        verify(messageLikeRepository).delete(messageLike);
    }

    @Test
    public void testRemoveLike_NotFound() {
        String token = "valid-token";

        // Mock repository behavior
        when(messageLikeRepository.findByMessageIdAndLikedBy(1, 1)).thenReturn(null);

        // Call the method under test and expect an exception
        assertThrows(IllegalArgumentException.class, () -> messageLikeService.removeLike(token, 1, 1));

        // Verify interactions
        verify(jwtUtil).validateToken(token);
        verify(messageLikeRepository).findByMessageIdAndLikedBy(1, 1);
        verify(messageLikeRepository, never()).delete(any());
    }

    @Test
    public void testGetLikesByMessageId() {
        String token = "valid-token";

        // Mock repository behavior
        when(messageLikeRepository.findByMessageId(1)).thenReturn(List.of(messageLike));

        // Call the method under test
        List<MessageLike> likes = messageLikeService.getLikesByMessageId(token, 1);

        // Verify results
        assertNotNull(likes);
        assertEquals(1, likes.size());
        assertEquals(1, likes.get(0).getMessageId());

        // Verify interactions
        verify(jwtUtil).validateToken(token);
        verify(messageLikeRepository).findByMessageId(1);
    }

    @Test
    public void testGetLikesByUserId() {
        // Mock repository behavior
        when(messageLikeRepository.findByLikedBy(1)).thenReturn(List.of(messageLike));

        // Call the method under test
        List<MessageLike> likes = messageLikeService.getLikesByUserId(1);

        // Verify results
        assertNotNull(likes);
        assertEquals(1, likes.size());
        assertEquals(1, likes.get(0).getLikedBy());

        // Verify interactions
        verify(messageLikeRepository).findByLikedBy(1);
    }

    @Test
    public void testHasUserLikedMessage() {
        String token = "valid-token";

        // Mock repository behavior
        when(messageLikeRepository.findByMessageIdAndLikedBy(1, 1)).thenReturn(messageLike);

        // Call the method under test
        boolean hasLiked = messageLikeService.hasUserLikedMessage(token, 1, 1);

        // Verify results
        assertTrue(hasLiked);

        // Verify interactions
        verify(jwtUtil).validateToken(token);
        verify(messageLikeRepository).findByMessageIdAndLikedBy(1, 1);
    }

    @Test
    public void testHasUserLikedMessage_NotLiked() {
        String token = "valid-token";

        // Mock repository behavior
        when(messageLikeRepository.findByMessageIdAndLikedBy(1, 1)).thenReturn(null);

        // Call the method under test
        boolean hasLiked = messageLikeService.hasUserLikedMessage(token, 1, 1);

        // Verify results
        assertFalse(hasLiked);

        // Verify interactions
        verify(jwtUtil).validateToken(token);
        verify(messageLikeRepository).findByMessageIdAndLikedBy(1, 1);
    }
}