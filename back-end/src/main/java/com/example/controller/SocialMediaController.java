package com.example.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.example.entity.Account;
import com.example.entity.Comment;
import com.example.entity.Follow;
import com.example.entity.Message;
import com.example.entity.MessageLike;
import com.example.service.AccountService;
import com.example.service.CommentService;
import com.example.service.FollowService;
import com.example.service.MessageLikeService;
import com.example.service.MessageService;
import com.example.util.JwtUtil;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping()
public class SocialMediaController {

    private final AccountService accountService;
    private final MessageService messageService;
    private final CommentService commentService;
    private final MessageLikeService messageLikeService;
    private final FollowService followService;
    private final JwtUtil jwtUtil;

    @Autowired
    public SocialMediaController(
            AccountService accountService,
            MessageService messageService,
            CommentService commentService,
            MessageLikeService messageLikeService,
            FollowService followService,
            JwtUtil jwtUtil) {
        this.accountService = accountService;
        this.messageService = messageService;
        this.commentService = commentService;
        this.messageLikeService = messageLikeService;
        this.followService = followService;
        this.jwtUtil = jwtUtil;
    }

    // ---------------- Account Endpoints ----------------

    @PostMapping(value = "/register", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Account> register(@RequestBody Account newAccount) {
        try {
            Account account = accountService.register(newAccount);
            return ResponseEntity.ok(account);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).build();
        }
    }

    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody Account account) {
        try {
            Account validAccount = accountService.login(account.getUsername(), account.getPassword());
            String token = jwtUtil.generateToken(validAccount.getUsername());
            return ResponseEntity.ok(new LoginResponse(token, validAccount.getAccountId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body("Invalid username or password.");
        }
    }

    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<?> getAccountById(@PathVariable String accountId) {
        try {
            Integer id = Integer.parseInt(accountId);
            return accountService.getAccountById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid account ID: must be an integer.");
        }
    }

    @PatchMapping(value = "/accounts/{accountId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer accountId, @RequestBody Account updatedAccount) {
        String token = authorizationHeader.replace("Bearer ", "");
        try {
            Account account = accountService.updateProfile(token, accountId, updatedAccount.getUsername(),
                    updatedAccount.getBio());
            return ResponseEntity.ok(account);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update profile");
        }
    }

    // ---------------- Message Endpoints ----------------

    @PostMapping(value = "/messages", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> createMessage(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Message message) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            Message newMessage = messageService.createMessage(token, message);
            return ResponseEntity.ok(newMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create message.");
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getAllMessages(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        List<Message> messages = messageService.getAllMessages(token);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/messages/{messageId}")
    public ResponseEntity<Message> getMessageById(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer messageId) {
        String token = authorizationHeader.replace("Bearer ", "");
        return messageService.getMessageById(token, messageId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<String> deleteMessage(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer messageId) {
        String token = authorizationHeader.replace("Bearer ", "");
        if (messageService.deleteMessage(token, messageId) == 1) {
            return ResponseEntity.ok("Message deleted");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Message not found");
    }

    @PatchMapping("/messages/{messageId}")
    public ResponseEntity<?> updateMessage(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer messageId,
            @RequestBody Message updatedMessage) {
        String token = authorizationHeader.replace("Bearer ", "");
        try {
            Message updated = messageService.editMessage(token, messageId, updatedMessage);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating message.");
        }
    }

    // ---------------- Comment Endpoints ----------------

    @PostMapping(value = "/comments", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> createComment(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Comment comment) {
        String token = authorizationHeader.replace("Bearer ", "");
        try {
            Comment newComment = commentService.createComment(token, comment);
            return ResponseEntity.ok(newComment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid comment");
        }
    }

    @GetMapping("/messages/{messageId}/comments")
    public ResponseEntity<List<Comment>> getCommentsForMessage(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer messageId) {
        String token = authorizationHeader.replace("Bearer ", "");
        List<Comment> comments = commentService.getCommentsByMessageId(token, messageId);
        return ResponseEntity.ok(comments);
    }

    // ---------------- Like Endpoints ----------------

    @GetMapping("/likes/{messageId}")
    public ResponseEntity<?> getLikesByMessageId(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer messageId) {
        String token = authorizationHeader.replace("Bearer ", "");
        try {
            List<MessageLike> likes = messageLikeService.getLikesByMessageId(token, messageId);
            return ResponseEntity.ok(likes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch likes.");
        }
    }

    @PostMapping(value = "/likes", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> likeMessage(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody MessageLike messageLike) {
        String token = authorizationHeader.replace("Bearer ", "");
        try {
            MessageLike createdLike = messageLikeService.addLike(token, messageLike);
            return ResponseEntity.ok(createdLike);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to like message: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @DeleteMapping("/likes")
    public ResponseEntity<?> unlikeMessage(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestParam Integer messageId, 
        @RequestParam Integer likedBy) {
        String token = authorizationHeader.replace("Bearer ", "");
        try {
            messageLikeService.removeLike(token, messageId, likedBy);
            return ResponseEntity.ok("Like removed successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to remove like");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred.");
        }
    }

    @GetMapping("/likes/status")
    public ResponseEntity<?> checkLikeStatus(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestParam Integer messageId, 
        @RequestParam Integer likedBy) {
        String token = authorizationHeader.replace("Bearer ", "");
        try {
            boolean isLiked = messageLikeService.hasUserLikedMessage(token, messageId, likedBy);
            return ResponseEntity.ok(Collections.singletonMap("liked", isLiked));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to check like status.");
        }
    }

    // ---------------- Follow Endpoints ----------------

    @PostMapping(value = "/follows", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> followUser(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestBody Follow follow) {
        String token = authorizationHeader.replace("Bearer ", "");
        try {
            followService.followUser(token, follow);
            return ResponseEntity.ok("Followed successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to follow user.");
        }
    }

    @DeleteMapping(value = "/follows/{followerId}/{followeeId}", produces = "application/json")
    public ResponseEntity<?> unfollowUser(
        @RequestHeader("Authorization") String authorizationHeader,
        @PathVariable Integer followerId,
        @PathVariable Integer followeeId) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            followService.unfollowUser(token, followerId, followeeId);
            return ResponseEntity.ok("Unfollowed successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to unfollow user.");
        }
    }

    @GetMapping(value = "/follows/status", produces = "application/json")
    public ResponseEntity<?> checkFollowStatus(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestParam Integer followerId,
        @RequestParam Integer followeeId) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            boolean isFollowing = followService.isFollowing(token, followerId, followeeId);
            boolean isFollowedBy = followService.isFollowing(token, followeeId, followerId);
            return ResponseEntity.ok(new FollowStatus(isFollowing, isFollowedBy));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to check follow status.");
        }
    }

    // ---------------- Search Endpoint ----------------
    @GetMapping("/search")
    public ResponseEntity<List<Object>> search(
        @RequestHeader("Authorization") String authorizationHeader,
        @RequestParam String query) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            List<Object> results = new ArrayList<>();

            List<Message> messages = messageService.searchMessagesByTitle(token, query);
            results.addAll(messages);

            List<Account> accounts = accountService.searchAccountsByUsername(token, query);
            results.addAll(accounts);

            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // ---------------- Exception Handlers ----------------

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid parameter type: " + ex.getMessage());
    }

    // ---------------- DTOs ----------------

    public static class LoginResponse {
        private final String token;
        private final Integer accountId;

        public LoginResponse(String token, Integer accountId) {
            this.token = token;
            this.accountId = accountId;
        }

        public String getToken() {
            return token;
        }

        public Integer getAccountId() {
            return accountId;
        }
    }

    // DTO for follow status
    public static class FollowStatus {
        private final boolean isFollowing;
        private final boolean isFollowedBy;

        public FollowStatus(boolean isFollowing, boolean isFollowedBy) {
            this.isFollowing = isFollowing;
            this.isFollowedBy = isFollowedBy;
        }

        public boolean getIsFollowing() {
            return isFollowing;
        }

        public boolean getIsFollowedBy() {
            return isFollowedBy;
        }
    }
}