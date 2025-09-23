package com.carthatamaz.carthatamaz.controller;

import com.carthatamaz.carthatamaz.dto.ConversationResponse;
import com.carthatamaz.carthatamaz.dto.MessageRequest;
import com.carthatamaz.carthatamaz.dto.MessageResponse;
import com.carthatamaz.carthatamaz.service.MessageService;
import com.carthatamaz.carthatamaz.util.ValidationUtil;
// import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Send message (available to all authenticated users)
    @PostMapping("/messages")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest request) {
        try {
            // Validate request
            List<String> validationErrors = ValidationUtil.validateMessageRequest(request);
            if (!validationErrors.isEmpty()) {
                return ResponseEntity.badRequest().body("Validation errors: " + String.join(", ", validationErrors));
            }

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String senderId = auth.getName();
            
            MessageResponse message = messageService.sendMessage(request, senderId);
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error sending message: " + e.getMessage());
        }
    }

    // Get all conversations for the authenticated user
    @GetMapping("/messages/conversations")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<List<ConversationResponse>> getUserConversations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        List<ConversationResponse> conversations = messageService.getUserConversations(userId);
        return ResponseEntity.ok(conversations);
    }

    // Get conversation between two users
    @GetMapping("/messages/conversations/{otherUserId}")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<?> getConversation(@PathVariable String otherUserId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        ConversationResponse conversation = messageService.getConversationWithMessages(userId, otherUserId);
        
        if (conversation == null) {
            return ResponseEntity.ok(List.of()); // Return empty list if no conversation exists
        }
        
        return ResponseEntity.ok(conversation);
    }

    // Get messages between two users (simple list)
    @GetMapping("/messages/with/{otherUserId}")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<List<MessageResponse>> getMessagesWith(@PathVariable String otherUserId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        List<MessageResponse> messages = messageService.getConversation(userId, otherUserId);
        return ResponseEntity.ok(messages);
    }

    // Get all messages for the authenticated user
    @GetMapping("/messages")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<List<MessageResponse>> getUserMessages() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        List<MessageResponse> messages = messageService.getMessagesByUserId(userId);
        return ResponseEntity.ok(messages);
    }

    // Get sent messages
    @GetMapping("/messages/sent")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<List<MessageResponse>> getSentMessages() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        List<MessageResponse> messages = messageService.getSentMessages(userId);
        return ResponseEntity.ok(messages);
    }

    // Get received messages
    @GetMapping("/messages/received")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<List<MessageResponse>> getReceivedMessages() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        List<MessageResponse> messages = messageService.getReceivedMessages(userId);
        return ResponseEntity.ok(messages);
    }

    // Get unread messages
    @GetMapping("/messages/unread")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<List<MessageResponse>> getUnreadMessages() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        List<MessageResponse> messages = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(messages);
    }

    // Get unread message count
    @GetMapping("/messages/unread/count")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<Map<String, Long>> getUnreadMessageCount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        long count = messageService.getUnreadMessageCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    // Mark message as read
    @PutMapping("/messages/{messageId}/read")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<?> markMessageAsRead(@PathVariable String messageId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            MessageResponse message = messageService.markMessageAsRead(messageId, userId);
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Mark entire conversation as read
    @PutMapping("/messages/conversations/{conversationId}/read")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<?> markConversationAsRead(@PathVariable String conversationId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            messageService.markConversationAsRead(conversationId, userId);
            return ResponseEntity.ok().body("Conversation marked as read");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Delete message
    @DeleteMapping("/messages/{messageId}")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<?> deleteMessage(@PathVariable String messageId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userId = auth.getName();
            
            messageService.deleteMessage(messageId, userId);
            return ResponseEntity.ok().body("Message deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Get specific message by ID
    @GetMapping("/messages/{messageId}")
    @PreAuthorize("hasAnyRole('GUEST', 'OWNER', 'ADMIN')")
    public ResponseEntity<?> getMessageById(@PathVariable String messageId) {
        Optional<MessageResponse> message = messageService.getMessageById(messageId);
        
        if (message.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        // Check if user is involved in this message
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();
        
        MessageResponse msg = message.get();
        if (!msg.getSenderId().equals(userId) && !msg.getReceiverId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        
        return ResponseEntity.ok(msg);
    }

    // Guest-specific endpoints
    @PostMapping("/guest/messages/to-owner/{ownerId}")
    @PreAuthorize("hasRole('GUEST')")
    public ResponseEntity<?> sendMessageToOwner(@PathVariable String ownerId, 
                                              @RequestBody MessageRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String guestId = auth.getName();
            
            // Override the receiver ID to ensure it's the owner
            request.setReceiverId(ownerId);
            
            MessageResponse message = messageService.sendMessage(request, guestId);
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Owner-specific endpoints
    @PostMapping("/owner/messages/to-guest/{guestId}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> sendMessageToGuest(@PathVariable String guestId, 
                                              @RequestBody MessageRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String ownerId = auth.getName();
            
            // Override the receiver ID to ensure it's the guest
            request.setReceiverId(guestId);
            
            MessageResponse message = messageService.sendMessage(request, ownerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Exception handlers
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Internal server error: " + e.getMessage());
    }
}