package com.carthatamaz.carthatamaz.dto;

// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Size;

public class MessageRequest {

    // @NotBlank(message = "Receiver ID is required")
    private String receiverId;

    // @NotBlank(message = "Message content is required")
    // @Size(max = 1000, message = "Message content cannot exceed 1000 characters")
    private String content;

    public MessageRequest() {}

    public MessageRequest(String receiverId, String content) {
        this.receiverId = receiverId;
        this.content = content;
    }

    // Getters and Setters

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}