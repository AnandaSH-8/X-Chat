import { useState, useRef, useEffect } from "react";
import { searchUsers } from "../../services/userService";
import useChat from "../../hooks/useChat";

const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { startChat } = useChat();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) { setResults([]); return; }
    try {
      const res = await searchUsers(val);
      setResults(res.data.data);
    } catch {
      setResults([]);
    }
  };

  const handleSelect = async (user) => {
    await startChat(user._id);
    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div id="user-search-modal" style={styles.modal}>
        <div style={styles.header}>
          <span style={styles.title}>Find People to Chat</span>
          <button id="close-search" onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.inputWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            id="search-input"
            ref={inputRef}
            type="text"
            placeholder="Search by name, username or email"
            value={query}
            onChange={handleSearch}
            style={styles.input}
          />
        </div>
        <div id="search-results-list" style={styles.results}>
          {results.map((u) => (
            <button
              key={u._id}
              id={`user-result-${u._id}`}
              onClick={() => handleSelect(u)}
              style={styles.resultItem}
            >
              <img src={u.avatar} alt="avatar" style={styles.avatar} />
              <div>
                <div style={styles.name}>{u.fullName}</div>
                <div style={styles.email}>{u.email}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#fff", borderRadius: 10, width: 340, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", overflow: "hidden" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #e5e7eb" },
  title: { fontWeight: 600, fontSize: 14 },
  closeBtn: { background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#6b7280" },
  inputWrap: { display: "flex", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" },
  searchIcon: { marginRight: 8, fontSize: 14 },
  input: { flex: 1, border: "none", outline: "none", fontSize: 14 },
  results: { maxHeight: 240, overflowY: "auto" },
  resultItem: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "none", background: "none", cursor: "pointer", textAlign: "left" },
  avatar: { width: 34, height: 34, borderRadius: "50%", objectFit: "cover" },
  name: { fontSize: 13, fontWeight: 600, color: "#111827" },
  email: { fontSize: 12, color: "#9ca3af" },
};

export default SearchModal;
