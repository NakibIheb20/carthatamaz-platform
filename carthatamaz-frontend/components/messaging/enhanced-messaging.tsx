"use client";

import { useState, useEffect, useRef } from "react";
import { Message, MessageRequest } from "@/types";
import apiClient from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Paperclip, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EnhancedMessagingProps {
  conversationId: string;
  recipientId: string;
}

export default function EnhancedMessaging({ conversationId, recipientId }: EnhancedMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        setLoading(true);
        const messages = await apiClient.getConversation(conversationId);
        setMessages(Array.isArray(messages) ? messages : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching conversation:", err);
        setError("Impossible de charger la conversation. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();

    // Polling for new messages every 10 seconds
    const interval = setInterval(fetchConversation, 10000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !attachment) return;

    try {
      setSending(true);
      const messageData: MessageRequest = {
        receiverId: recipientId,
        content: newMessage.trim()
      };

      let sentMessage;
      if (attachment) {
        sentMessage = await apiClient.sendMessageWithAttachment(messageData, attachment);
      } else {
        sentMessage = await apiClient.sendMessage(messageData);
      }

      setMessages([...messages, sentMessage]);
      setNewMessage("");
      setAttachment(null);
      setError(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Impossible d'envoyer le message. Veuillez réessayer plus tard.");
    } finally {
      setSending(false);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Aucun message. Commencez la conversation !
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === recipientId ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`flex max-w-[80%] ${
                  message.senderId === recipientId ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <Avatar className={`h-8 w-8 ${message.senderId === recipientId ? "mr-2" : "ml-2"}`}>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>
                    {message.senderName?.substring(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.senderId === recipientId
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p>{message.content}</p>
                    {message.attachmentUrl && (
                      <div className="mt-2">
                        <a
                          href={message.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Pièce jointe
                        </a>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(message.timestamp), "d MMM, HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        {attachment && (
          <div className="mb-2 p-2 bg-muted rounded flex justify-between items-center">
            <span className="text-sm truncate">{attachment.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAttachment(null)}
            >
              ×
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAttachmentClick}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
          />
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1"
            disabled={sending}
          />
          <Button type="submit" disabled={sending || (!newMessage.trim() && !attachment)}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}