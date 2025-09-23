package com.carthatamaz.carthatamaz.dto;

import com.carthatamaz.carthatamaz.entity.Message;

import java.time.LocalDateTime;

public class MessageResponse {

    private String id;
    private String content;
    private String senderId;
    private String senderName;
    private String senderPictureUrl;
    private String receiverId;
    private String receiverName;
    private String receiverPictureUrl;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private boolean read;
    private String conversationId;

    public MessageResponse() {}

    public MessageResponse(Message message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.senderId = message.getSender().getId();
        this.senderName = message.getSender().getFullName();
        this.senderPictureUrl = message.getSender().getPicture_url();
        this.receiverId = message.getReceiver().getId();
        this.receiverName = message.getReceiver().getFullName();
        this.receiverPictureUrl = message.getReceiver().getPicture_url();
        this.createdAt = message.getCreatedAt();
        this.readAt = message.getReadAt();
        this.read = message.isRead();
        this.conversationId = message.getConversationId();
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

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderPictureUrl() {
        return senderPictureUrl;
    }

    public void setSenderPictureUrl(String senderPictureUrl) {
        this.senderPictureUrl = senderPictureUrl;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverPictureUrl() {
        return receiverPictureUrl;
    }

    public void setReceiverPictureUrl(String receiverPictureUrl) {
        this.receiverPictureUrl = receiverPictureUrl;
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
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }
}