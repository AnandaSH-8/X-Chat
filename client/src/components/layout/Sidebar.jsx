import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useChat from "../../hooks/useChat";
import usePresence from "../../hooks/usePresence";
import SearchModal from "../user/SearchModal";

const Sidebar = () => {
  const { user, handleLogout } = useAuth();
  const { rooms, activeRoom, setActiveRoom } = useChat();
  const [showSearch, setShowSearch] = useState(false);

  const getOther = (room) => room.members?.find((m) => m._id !== user?._id);

  return (
    <div style={s.sidebar}>
      <div style={s.header}>
        <div style={s.userInfo}>
          <div style={s.avatarWrap}>
            {user?.avatar
              ? <img src={user.avatar} alt="avatar" style={s.avatar} />
              : <div style={s.avatarFallback}>{user?.fullName?.[0]}</div>}
            <span style={s.onlineDot} />
          </div>
          <div>
            <div id="user-name" style={s.userName}>{user?.fullName}</div>
            <div id="user-username" style={s.userUsername}>@{user?.username}</div>
          </div>
        </div>
        <button id="logout-button" onClick={handleLogout} style={s.logoutBtn} title="Logout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>

      <div style={s.newChatWrap}>
        <button id="new-chat-button" onClick={() => setShowSearch(true)} style={s.newChatBtn}>
          ⊕ New Chat
        </button>
      </div>

      <div style={s.sectionLabel}>RECENT CHATS</div>
      <div id="chat-rooms-list" style={s.roomsList}>
        {rooms.length === 0 ? (
          <div style={s.empty}>
            <span style={s.emptyIcon}>💬</span>
            <div style={s.emptyText}>No conversations yet</div>
            <div style={s.emptySubtext}>Search for users to start chatting</div>
          </div>
        ) : (
          rooms.map((room) => (
            <RoomItem
              key={room._id}
              room={room}
              other={getOther(room)}
              isActive={activeRoom?._id === room._id}
              onClick={() => setActiveRoom(room)}
            />
          ))
        )}
      </div>

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
};

const RoomItem = ({ room, other, isActive, onClick }) => {
  const isOnline = usePresence(other?._id);
  return (
    <button
      id={`room-${room._id}`}
      onClick={onClick}
      style={{ ...s.roomItem, background: isActive ? "#ede9fe" : "transparent" }}
    >
      <div style={s.roomAvatarWrap}>
        {other?.avatar
          ? <img src={other.avatar} alt="avatar" style={s.roomAvatar} />
          : <div style={{ ...s.roomAvatar, ...s.avatarFallback }}>{other?.fullName?.[0]}</div>}
        {isOnline && <span style={s.onlineDotSmall} />}
      </div>
      <div style={s.roomInfo}>
        <div style={s.roomName}>{other?.fullName}</div>
        <div style={s.roomSub}>{isOnline ? "Online" : "Offline"}</div>
      </div>
    </button>
  );
};

const s = {
  sidebar: { width: 240, minWidth: 240, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", height: "100vh" },
  header: { background: "#7c3aed", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  userInfo: { display: "flex", alignItems: "center", gap: 10 },
  avatarWrap: { position: "relative" },
  avatar: { width: 36, height: 36, borderRadius: "50%", objectFit: "cover" },
  avatarFallback: { width: 36, height: 36, borderRadius: "50%", background: "#5b21b6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15 },
  onlineDot: { position: "absolute", bottom: 1, right: 1, width: 10, height: 10, background: "#22c55e", borderRadius: "50%", border: "2px solid #7c3aed" },
  userName: { color: "#fff", fontWeight: 600, fontSize: 14, lineHeight: 1.3 },
  userUsername: { color: "#ddd6fe", fontSize: 12 },
  logoutBtn: { background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" },
  newChatWrap: { padding: "10px 12px" },
  newChatBtn: { width: "100%", padding: "8px 0", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  sectionLabel: { fontSize: 11, fontWeight: 600, color: "#9ca3af", padding: "4px 14px 4px", letterSpacing: 1 },
  roomsList: { flex: 1, overflowY: "auto" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 16px", color: "#9ca3af" },
  emptyIcon: { fontSize: 28, marginBottom: 8 },
  emptyText: { fontSize: 13, fontWeight: 500, color: "#6b7280" },
  emptySubtext: { fontSize: 12, textAlign: "center", marginTop: 4, color: "#9ca3af" },
  roomItem: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "none", cursor: "pointer", textAlign: "left" },
  roomAvatarWrap: { position: "relative", flexShrink: 0 },
  roomAvatar: { width: 36, height: 36, borderRadius: "50%", objectFit: "cover" },
  onlineDotSmall: { position: "absolute", bottom: 1, right: 1, width: 9, height: 9, background: "#22c55e", borderRadius: "50%", border: "2px solid #fff" },
  roomInfo: { overflow: "hidden" },
  roomName: { fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  roomSub: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
};

export default Sidebar;
