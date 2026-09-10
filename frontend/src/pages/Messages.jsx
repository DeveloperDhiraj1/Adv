import { useState, useEffect, useRef } from "react";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import DashboardPageHeader from "../components/DashboardPageHeader";
import { apiFetch } from "../lib/api";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const result = await apiFetch("/chat/chats");
        const convList = result?.data || [];
        setConversations(convList);
        if (convList.length > 0) {
          setActive(0);
        }
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Load messages when conversation changes
  useEffect(() => {
    if (active !== null && conversations[active]) {
      const loadMessages = async () => {
        try {
          const conversationId = conversations[active]._id;
          const result = await apiFetch(`/chat/messages/${conversationId}`);
          setMessages(result?.data || []);
        } catch (err) {
          console.error("Failed to load messages", err);
        }
      };

      loadMessages();
    }
  }, [active, conversations]);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || active === null) return;

    setSending(true);
    try {
      const conversationId = conversations[active]._id;
      const result = await apiFetch("/chat/message", {
        method: "POST",
        body: JSON.stringify({
          conversationId,
          text: messageText
        })
      });

      if (result.success) {
        setMessages([...messages, result.data]);
        setMessageText("");
        // Update last message in conversation
        const updatedConversations = [...conversations];
        updatedConversations[active].lastMessage = messageText;
        updatedConversations[active].lastMessageTime = new Date();
        setConversations(updatedConversations);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getCurrentUserId = () => localStorage.getItem("userId");

  const getOtherParticipant = (conv) => {
    const currentUserId = getCurrentUserId();
    return conv.participants.find(p => p._id !== currentUserId);
  };

  return (
    <div>
      <DashboardPageHeader title="Messages" description="Conversations with experts and clients." />

      {loading ? (
        <div className="mt-6 text-sm text-muted">Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <p className="rounded-xl2 border border-dashed border-line bg-card p-10 text-center text-muted">
          No conversations yet. Book a session to start chatting.
        </p>
      ) : (
        <div className="grid grid-cols-1 overflow-hidden rounded-xl2 border border-line bg-card shadow-card sm:grid-cols-[280px_1fr]">
          <div className="border-b border-line sm:border-b-0 sm:border-r max-h-[600px] overflow-y-auto">
            {conversations.map((conv, i) => {
              const otherUser = getOtherParticipant(conv);
              if (!otherUser) return null;

              return (
                <button
                  key={conv._id}
                  onClick={() => setActive(i)}
                  className={`flex w-full items-center gap-3 border-b border-line p-4 text-left last:border-0 ${
                    active === i ? "bg-emerald/5" : "hover:bg-ink/[0.03]"
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
                    alt={otherUser.name}
                    className="h-10 w-10 flex-none rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold text-ink">{otherUser.name}</p>
                      <span className="flex-none text-xs text-muted">{formatTime(conv.lastMessageTime)}</span>
                    </div>
                    <p className="truncate text-xs text-muted">{conv.lastMessage || "No messages yet"}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {active !== null && conversations[active] && (
            <div className="flex h-[600px] flex-col">
              {(() => {
                const otherUser = getOtherParticipant(conversations[active]);
                return (
                  <>
                    <div className="flex items-center gap-3 border-b border-line p-4">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
                        alt=""
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <p className="text-sm font-semibold text-ink">{otherUser?.name || "User"}</p>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto p-4 bg-surface">
                      {messages.length === 0 ? (
                        <p className="text-center text-sm text-muted">No messages yet. Start the conversation!</p>
                      ) : (
                        messages.map((msg, idx) => {
                          const isOwn = msg.sender._id === getCurrentUserId();
                          return (
                            <div
                              key={msg._id || idx}
                              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                                  isOwn
                                    ? "rounded-tr-sm bg-emerald text-navy"
                                    : "rounded-tl-sm bg-ink/5 text-ink"
                                }`}
                              >
                                {msg.text}
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-line p-3">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="w-full rounded-full border border-line px-4 py-2.5 text-sm focus:border-emerald focus:outline-none"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={sending || !messageText.trim()}
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-emerald text-navy hover:bg-emerald-light disabled:opacity-50"
                        aria-label="Send"
                      >
                        <HiOutlinePaperAirplane className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
