package com.example.service;

import com.example.entity.*;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.repository.MessageRepository;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message createMessage(Message message) {
        if (message.getTitle() == null || message.getTitle().isEmpty() || message.getTitle().length() > 255) {
            throw new IllegalArgumentException("Invalid title. Title must be non-empty and within 255 characters.");
        }
        if (message.getMessageText() == null || message.getMessageText().isEmpty()
                || message.getMessageText().length() > 255) {
            throw new IllegalArgumentException(
                    "Invalid message text. Text must be non-empty and within 255 characters.");
        }
        return messageRepository.save(message);
    }

    public List<Message> searchMessagesByTitle(String query) {
        return messageRepository.searchMessagesByTitleIgnoreCase(query); // case-insensitive search
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public Optional<Message> getMessageById(Integer id) {
        return messageRepository.findById(id);
    }

    public Integer deleteMessage(Integer id) {
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
}