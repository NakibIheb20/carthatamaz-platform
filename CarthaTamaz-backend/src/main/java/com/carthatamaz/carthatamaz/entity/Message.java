package com.carthatamaz.carthatamaz.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    private String content;

    @DBRef
    private User sender;

    @DBRef
    private User receiver;

    @CreatedDate
    private LocalDateTime createdAt;

    private LocalDateTime readAt;

    private boolean read = false;

    private String conversationId; // To group messages in conversations

    public Message() {
        this.createdAt = LocalDateTime.now();
    }

    public Message(String content, User sender, User receiver) {
        this();
        this.content = content;
        this.sender = sender;
        this.receiver = receiver;
        this.conversationId = generateConversationId(sender.getId(), receiver.getId());
    }

    public Message(String id, String content, User sender, User receiver) {
        this(content, sender, receiver);
        this.id = id;
    }

    private String generateConversationId(String userId1, String userId2) {
        // Create a consistent conversation ID regardless of who sends first
        return userId1.compareTo(userId2) < 0 ? userId1 + "_" + userId2 : userId2 + "_" + userId1;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
        this.read = readAt != null;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
        if (read && this.readAt == null) {
            this.readAt = LocalDateTime.now();
        }
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public void markAsRead() {
        this.read = true;
        this.readAt = LocalDateTime.now();
    }
}
