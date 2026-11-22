import { useState, useRef, useEffect } from "react";
import useChat from "../../hooks/useChat";
import useAuth from "../../hooks/useAuth";
import useMessages from "../../hooks/useMessages";
import useTyping from "../../hooks/useTyping";
import usePresence from "../../hooks/usePresence";

const ChatWindow = () => {
  const { activeRoom } = useChat();
  const { user } = useAuth();
  const { messages, send } = useMessages(activeRoom?._id, user?._id);
  const { isOtherTyping, handleTyping } = useTyping(activeRoom?._id, user?._id);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const other = activeRoom?.members?.find((m) => m._id !== user?._id);
  const isOnline = usePresence(other?._id);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    send(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeRoom) {
    return (
      <div id="chat-window" style={s.empty}>
        <div style={s.emptyInner}>
          <div style={s.emptyIcon}>💬</div>
          <div style={s.emptyTitle}>No chat selected</div>
          <div style={s.emptySubtitle}>
            Select a conversation from the sidebar or start a new chat to begin messaging
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="chat-window" style={s.window}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.avatarWrap}>
            {other?.avatar
              ? <img src={other.avatar} alt="avatar" style={s.avatar} />
              : <div style={s.avatarFallback}>{other?.fullName?.[0]}</div>}
            {isOnline && <span style={s.onlineDot} />}
          </div>
          <div>
            <div style={s.headerName}>{other?.fullName}</div>
            <div style={s.headerStatus}>{isOnline ? "Online" : "Offline"}</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={s.messages}>
        {messages.length === 0 ? (
          <div style={s.noMessages}>
            <div style={s.noMsgIcon}>💬</div>
            <div style={s.noMsgText}>No messages yet</div>
            <div style={s.noMsgSub}>Send a message to start the conversation</div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.senderId === user?._id;
            return (
              <div key={msg.id} style={{ ...s.msgRow, justifyContent: isMine ? "flex-end" : "flex-start" }}>
                <div style={{ ...s.bubble, background: isMine ? "#7c3aed" : "#fff", color: isMine ? "#fff" : "#111827" }}>
                  {msg.content}
                  <div style={{ ...s.msgTime, color: isMine ? "#ddd6fe" : "#9ca3af" }}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {isOtherTyping && (
          <div id="typing-indicator" style={s.typing}>
            {other?.fullName} is typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={s.inputBar}>
        <input
          id="message-input"
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => { setText(e.target.value); handleTyping(); }}
          onKeyDown={handleKeyDown}
          style={s.input}
        />
        <button id="send-button" onClick={handleSend} style={s.sendBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const s = {
  empty: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9fafb" },
  emptyInner: { textAlign: "center" },
  emptyIcon: { fontSize: 48, marginBottom: 16, opacity: 0.4 },
  emptyTitle: { fontSize: 20, fontWeight: 600, color: "#374151", marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: "#9ca3af", maxWidth: 320 },
  window: { flex: 1, display: "flex", flexDirection: "column", height: "100vh", background: "#f9fafb" },
  header: { background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  avatarWrap: { position: "relative" },
  avatar: { width: 38, height: 38, borderRadius: "50%", objectFit: "cover" },
  avatarFallback: { width: 38, height: 38, borderRadius: "50%", background: "#7c3aed", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 },
  onlineDot: { position: "absolute", bottom: 1, right: 1, width: 10, height: 10, background: "#22c55e", borderRadius: "50%", border: "2px solid #fff" },
  headerName: { fontWeight: 600, fontSize: 15, color: "#111827" },
  headerStatus: { fontSize: 12, color: "#9ca3af" },
  messages: { flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8, backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "20px 20px" },
  noMessages: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "auto", textAlign: "center", background: "#fff", borderRadius: 12, padding: "32px 40px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  noMsgIcon: { fontSize: 32, marginBottom: 8, opacity: 0.5 },
  noMsgText: { fontWeight: 600, fontSize: 15, color: "#374151" },
  noMsgSub: { fontSize: 13, color: "#9ca3af", marginTop: 4 },
  msgRow: { display: "flex" },
  bubble: { maxWidth: "65%", padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.5, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" },
  msgTime: { fontSize: 11, marginTop: 4, textAlign: "right" },
  typing: { fontSize: 12, color: "#9ca3af", fontStyle: "italic", padding: "4px 0" },
  inputBar: { background: "#fff", borderTop: "1px solid #e5e7eb", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 },
  input: { flex: 1, border: "1px solid #e5e7eb", borderRadius: 20, padding: "10px 16px", fontSize: 14, outline: "none", background: "#f9fafb" },
  sendBtn: { width: 40, height: 40, borderRadius: "50%", background: "#2563eb", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 },
};

export default ChatWindow;
