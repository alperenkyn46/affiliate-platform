"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell } from "@/components/admin";
import { Button } from "@/components/ui";
import { Mail, Trash2, Check, Eye, Clock } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  created_at: string;
}

export default function MessagesPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (token) {
      loadMessages();
    }
  }, [token]);

  const loadMessages = async () => {
    if (!token) return;
    try {
      const response = await api.getMessages(token);
      if (response.success && response.data) {
        setMessages(response.data as Message[]);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    if (!token) return;
    try {
      const response = await api.updateMessageStatus(token, id, status);
      if (response.success) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: status as Message["status"] } : m));
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status: status as Message["status"] });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try {
      const response = await api.deleteMessage(token, id);
      if (response.success) {
        setMessages(messages.filter(m => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (message.status === "new") {
      handleStatusChange(message.id, "read");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs">Yeni</span>;
      case "read":
        return <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">Okundu</span>;
      case "replied":
        return <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Yanıtlandı</span>;
      default:
        return null;
    }
  };

  const newCount = messages.filter(m => m.status === "new").length;

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <Mail className="w-7 h-7 text-gold" />
          Mesajlar
          {newCount > 0 && (
            <span className="px-2 py-1 rounded-full bg-blue-500 text-white text-sm">
              {newCount} yeni
            </span>
          )}
        </h1>
        <p className="text-gray-400">İletişim formundan gelen mesajları yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message List */}
        <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-lg font-semibold text-white">Gelen Kutusu</h3>
          </div>
          
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Henüz mesaj bulunmuyor
            </div>
          ) : (
            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => openMessage(message)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-white/5 ${
                    selectedMessage?.id === message.id ? "bg-white/10" : ""
                  } ${message.status === "new" ? "border-l-4 border-blue-500" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium truncate ${message.status === "new" ? "text-white" : "text-gray-300"}`}>
                          {message.name}
                        </span>
                        {getStatusBadge(message.status)}
                      </div>
                      <p className={`text-sm truncate ${message.status === "new" ? "text-gray-200" : "text-gray-400"}`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.created_at).toLocaleString("tr-TR")}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(message.id);
                      }}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
          {selectedMessage ? (
            <>
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{selectedMessage.subject}</h3>
                  {getStatusBadge(selectedMessage.status)}
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-gold font-bold text-lg">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{selectedMessage.name}</p>
                      <a href={`mailto:${selectedMessage.email}`} className="text-gold text-sm hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(selectedMessage.created_at).toLocaleString("tr-TR")}
                  </p>
                </div>

                <div className="bg-background rounded-lg p-4 mb-6">
                  <p className="text-gray-200 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    onClick={() => handleStatusChange(selectedMessage.id, "replied")}
                    className="flex-1"
                  >
                    <Button className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Yanıtla
                    </Button>
                  </a>
                  {selectedMessage.status !== "replied" && (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatusChange(selectedMessage.id, "replied")}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Yanıtlandı İşaretle
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Görüntülemek için bir mesaj seçin</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
