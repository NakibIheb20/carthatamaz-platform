package com.carthatamaz.carthatamaz.service;

import com.carthatamaz.carthatamaz.dto.ConversationResponse;
import com.carthatamaz.carthatamaz.dto.MessageRequest;
import com.carthatamaz.carthatamaz.dto.MessageResponse;
import com.carthatamaz.carthatamaz.entity.Message;
import com.carthatamaz.carthatamaz.entity.User;
import com.carthatamaz.carthatamaz.repository.MessageRepository;
import com.carthatamaz.carthatamaz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public MessageResponse sendMessage(MessageRequest request, String senderId) {
        // Validate sender
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        // Validate receiver
        User receiver = userRepository.findById(request.getReceiverId())
            .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        // Create and save message
        Message message = new Message(request.getContent(), sender, receiver);
        Message saved = messageRepository.save(message);

        return new MessageResponse(saved);
    }

    public List<MessageResponse> getConversation(String userId1, String userId2) {
        List<Message> messages = messageRepository.findConversationBetweenUsers(userId1, userId2);
        
        // Sort by creation date
        messages.sort(Comparator.comparing(Message::getCreatedAt));
        
        return messages.stream()
            .map(MessageResponse::new)
            .collect(Collectors.toList());
    }

    public List<ConversationResponse> getUserConversations(String userId) {
        List<Message> userMessages = messageRepository.findByUserInvolved(userId);
        
        // Group messages by conversation
        Map<String, List<Message>> conversationGroups = userMessages.stream()
            .collect(Collectors.groupingBy(Message::getConversationId));

        List<ConversationResponse> conversations = new ArrayList<>();

        for (Map.Entry<String, List<Message>> entry : conversationGroups.entrySet()) {
            String conversationId = entry.getKey();
            List<Message> messages = entry.getValue();

            // Sort messages by date to get the latest
            messages.sort(Comparator.comparing(Message::getCreatedAt).reversed());
            Message lastMessage = messages.get(0);

            // Determine the other user
            String otherUserId = lastMessage.getSender().getId().equals(userId) 
                ? lastMessage.getReceiver().getId() 
                : lastMessage.getSender().getId();
            
            User otherUser = lastMessage.getSender().getId().equals(userId) 
                ? lastMessage.getReceiver() 
                : lastMessage.getSender();

            // Count unread messages for this user
            long unreadCount = messages.stream()
                .filter(msg -> msg.getReceiver().getId().equals(userId) && !msg.isRead())
                .count();

            ConversationResponse conversation = new ConversationResponse(
                conversationId,
                otherUserId,
                otherUser.getFullName(),
                otherUser.getPicture_url(),
                new MessageResponse(lastMessage),
                unreadCount,
                lastMessage.getCreatedAt()
            );

            conversations.add(conversation);
        }

        // Sort conversations by last activity
        conversations.sort(Comparator.comparing(ConversationResponse::getLastActivity).reversed());

        return conversations;
    }

    public List<MessageResponse> getMessagesByUserId(String userId) {
        List<Message> messages = messageRepository.findByUserInvolved(userId);
        return messages.stream()
            .map(MessageResponse::new)
            .sorted(Comparator.comparing(MessageResponse::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public List<MessageResponse> getSentMessages(String senderId) {
        List<Message> messages = messageRepository.findBySenderId(senderId);
        return messages.stream()
            .map(MessageResponse::new)
            .sorted(Comparator.comparing(MessageResponse::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public List<MessageResponse> getReceivedMessages(String receiverId) {
        List<Message> messages = messageRepository.findByReceiverId(receiverId);
        return messages.stream()
            .map(MessageResponse::new)
            .sorted(Comparator.comparing(MessageResponse::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public List<MessageResponse> getUnreadMessages(String receiverId) {
        List<Message> messages = messageRepository.findUnreadMessagesByReceiver(receiverId);
        return messages.stream()
            .map(MessageResponse::new)
            .sorted(Comparator.comparing(MessageResponse::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public long getUnreadMessageCount(String receiverId) {
        return messageRepository.countByReceiverIdAndReadFalse(receiverId);
    }

    public MessageResponse markMessageAsRead(String messageId, String userId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new IllegalArgumentException("Message not found"));

        // Only the receiver can mark a message as read
        if (!message.getReceiver().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only mark your own received messages as read");
        }

        message.markAsRead();
        Message updated = messageRepository.save(message);
        return new MessageResponse(updated);
    }

    public void markConversationAsRead(String conversationId, String userId) {
        List<Message> messages = messageRepository.findConversationBetweenUsers(
            userId, getOtherUserIdFromConversationId(conversationId, userId));
        
        messages.stream()
            .filter(msg -> msg.getReceiver().getId().equals(userId) && !msg.isRead())
            .forEach(msg -> {
                msg.markAsRead();
                messageRepository.save(msg);
            });
    }

    public void deleteMessage(String messageId, String userId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new IllegalArgumentException("Message not found"));

        // Only sender can delete their message
        if (!message.getSender().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own messages");
        }

        messageRepository.delete(message);
    }

    public Optional<MessageResponse> getMessageById(String messageId) {
        return messageRepository.findById(messageId)
            .map(MessageResponse::new);
    }

    public ConversationResponse getConversationWithMessages(String userId1, String userId2) {
        List<MessageResponse> messages = getConversation(userId1, userId2);
        
        if (messages.isEmpty()) {
            return null;
        }

        // Get other user info
        User otherUser = userRepository.findById(userId2)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String conversationId = generateConversationId(userId1, userId2);
        long unreadCount = messages.stream()
            .filter(msg -> msg.getReceiverId().equals(userId1) && !msg.isRead())
            .count();

        ConversationResponse conversation = new ConversationResponse(
            conversationId,
            userId2,
            otherUser.getFullName(),
            otherUser.getPicture_url(),
            messages.get(messages.size() - 1), // Last message
            unreadCount,
            messages.get(messages.size() - 1).getCreatedAt()
        );

        conversation.setMessages(messages);
        return conversation;
    }

    private String generateConversationId(String userId1, String userId2) {
        return userId1.compareTo(userId2) < 0 ? userId1 + "_" + userId2 : userId2 + "_" + userId1;
    }

    private String getOtherUserIdFromConversationId(String conversationId, String userId) {
        String[] userIds = conversationId.split("_");
        return userIds[0].equals(userId) ? userIds[1] : userIds[0];
    }
}
