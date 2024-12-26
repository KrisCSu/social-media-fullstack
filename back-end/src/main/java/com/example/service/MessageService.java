package com.example.service;

import com.example.entity.*;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.repository.MessageRepository;
import com.example.util.JwtUtil;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message createMessage(String token, Message message) {
        validateTokenAndExtractUsername(token);
        validateMessageFields(message);
        return messageRepository.save(message);
    }
    
    public Message editMessage(String token, Integer id, Message updatedMessage) {
        validateTokenAndExtractUsername(token);
        Optional<Message> existingMessageOpt = messageRepository.findById(id);
        if (existingMessageOpt.isPresent()) {
            Message existingMessage = existingMessageOpt.get();
    
            if (updatedMessage.getTitle() != null && !updatedMessage.getTitle().isEmpty() && updatedMessage.getTitle().length() <= 255) {
                existingMessage.setTitle(updatedMessage.getTitle());
            }
    
            if (updatedMessage.getMessageText() != null && !updatedMessage.getMessageText().isEmpty() && updatedMessage.getMessageText().length() <= 255) {
                existingMessage.setMessageText(updatedMessage.getMessageText());
            }
    
            validateMessageFields(existingMessage);
            return messageRepository.save(existingMessage);
        } else {
            throw new IllegalArgumentException("Message not found with ID: " + id);
        }
    }

    public List<Message> searchMessagesByTitle(String token, String query) {
        validateTokenAndExtractUsername(token);
        return messageRepository.searchMessagesByTitleIgnoreCase(query); // case-insensitive search
    }

    public List<Message> getAllMessages(String token) {
        validateTokenAndExtractUsername(token);
        return messageRepository.findAll();
    }

    public Optional<Message> getMessageById(String token, Integer id) {
        validateTokenAndExtractUsername(token);
        return messageRepository.findById(id);
    }

    public Integer deleteMessage(String token, Integer id) {
        validateTokenAndExtractUsername(token);
        if (messageRepository.existsById(id)) {
            messageRepository.deleteById(id);
            return 1;
        }
        return 0;
    }

    public Integer updateMessage(Integer id, Message updatedMessage) {
        Optional<Message> existingMessage = messageRepository.findById(id);
        if (existingMessage.isPresent()) {
            Message messageToUpdate = existingMessage.get();
            if (updatedMessage.getTitle() != null && updatedMessage.getTitle().length() <= 255) {
                messageToUpdate.setTitle(updatedMessage.getTitle());
            } else {
                throw new IllegalArgumentException("Invalid title. Must be within 255 characters.");
            }
            if (updatedMessage.getMessageText() != null && updatedMessage.getMessageText().length() <= 255) {
                messageToUpdate.setMessageText(updatedMessage.getMessageText());
            } else {
                throw new IllegalArgumentException("Invalid message text. Must be within 255 characters.");
            }
            messageRepository.save(messageToUpdate);
            return 1;
        }
        return 0;
    }

    public List<Message> getMessagesByAccountId(Integer accountId) {
        return messageRepository.findByPostedBy(accountId);
    }

    private String validateTokenAndExtractUsername(String token) {
        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid or expired token.");
        }
        return jwtUtil.extractUsername(token);
    }

    private void validateMessageFields(Message message) {
        if (message.getTitle() == null || message.getTitle().isEmpty() || message.getTitle().length() > 255) {
            throw new IllegalArgumentException("Invalid title. Title must be non-empty and within 255 characters.");
        }
        if (message.getMessageText() == null || message.getMessageText().isEmpty() || message.getMessageText().length() > 255) {
            throw new IllegalArgumentException("Invalid message text. Text must be non-empty and within 255 characters.");
        }
    }
}