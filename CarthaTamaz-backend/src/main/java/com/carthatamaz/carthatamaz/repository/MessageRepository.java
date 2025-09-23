package com.carthatamaz.carthatamaz.repository;

import com.carthatamaz.carthatamaz.entity.Message;
import com.carthatamaz.carthatamaz.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySender(User sender);
    List<Message> findByReceiver(User receiver);
    List<Message> findBySenderId(String senderId);
    List<Message> findByReceiverId(String receiverId);
    
    @Query("{'$or': [{'sender.id': ?0, 'receiver.id': ?1}, {'sender.id': ?1, 'receiver.id': ?0}]}")
    List<Message> findConversationBetweenUsers(String userId1, String userId2);
    
    @Query("{'$or': [{'sender.id': ?0}, {'receiver.id': ?0}]}")
    List<Message> findByUserInvolved(String userId);
    
    @Query("{'receiver.id': ?0, 'read': false}")
    List<Message> findUnreadMessagesByReceiver(String receiverId);
    
    long countByReceiverIdAndReadFalse(String receiverId);
}
