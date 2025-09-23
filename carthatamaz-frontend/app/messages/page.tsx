"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/auth/auth-guard";
import apiClient from "@/lib/api";
import EnhancedMessaging from "@/components/messaging/enhanced-messaging";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getConversations();
        setConversations(data);
        
        // Sélectionner automatiquement la première conversation s'il y en a
        if (data.length > 0) {
          setSelectedConversation(data[0].id);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Impossible de charger vos conversations. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  if (loading) {
    return (
      <AuthGuard allowedRoles={["GUEST"]}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard allowedRoles={["GUEST"]}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={["GUEST"]}>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        {conversations.length === 0 ? (
          <div className="text-center p-8 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Aucune conversation</h2>
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore de conversations. Commencez par contacter un hôte ou un invité.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 border-b bg-muted">
                <h2 className="font-semibold">Conversations</h2>
              </div>
              <div className="divide-y">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                      selectedConversation === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="font-medium">{conversation.participantName}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage || "Aucun message"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2">
              {selectedConversation ? (
                <EnhancedMessaging
                  conversationId={selectedConversation}
                  recipientId={
                    conversations.find((c) => c.id === selectedConversation)?.participantId || ""
                  }
                />
              ) : (
                <div className="flex items-center justify-center h-full border rounded-lg p-8">
                  <p className="text-muted-foreground">
                    Sélectionnez une conversation pour afficher les messages
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
