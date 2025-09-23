package com.carthatamaz.carthatamaz.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ConversationResponse {

    private String conversationId;
    private String otherUserId;
    private String otherUserName;
    private String otherUserPictureUrl;
    private MessageResponse lastMessage;
    private long unreadCount;
    private LocalDateTime lastActivity;
    private List<MessageResponse> messages;

    public ConversationResponse() {}

    public ConversationResponse(String conversationId, String otherUserId, String otherUserName, 
                               String otherUserPictureUrl, MessageResponse lastMessage, 
                               long unreadCount, LocalDateTime lastActivity) {
        this.conversationId = conversationId;
        this.otherUserId = otherUserId;
        this.otherUserName = otherUserName;
        this.otherUserPictureUrl = otherUserPictureUrl;
        this.lastMessage = lastMessage;
        this.unreadCount = unreadCount;
        this.lastActivity = lastActivity;
    }

    // Getters and Setters

    public String getConversationId() {
        return conversationId;
    }

    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }

    public String getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(String otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserName() {
        return otherUserName;
    }

    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }

    public String getOtherUserPictureUrl() {
        return otherUserPictureUrl;
    }

    public void setOtherUserPictureUrl(String otherUserPictureUrl) {
        this.otherUserPictureUrl = otherUserPictureUrl;
    }

    public MessageResponse getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(MessageResponse lastMessage) {
        this.lastMessage = lastMessage;
    }

    public long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }

    public LocalDateTime getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }

    public List<MessageResponse> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageResponse> messages) {
        this.messages = messages;
    }
}