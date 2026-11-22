import { useState, useEffect } from "react";
import { subscribeToMessages, sendMessage } from "../firebase/messageService";

const useMessages = (roomId, currentUserId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!roomId) return;
    setMessages([]);
    const unsub = subscribeToMessages(roomId, setMessages);
    return unsub;
  }, [roomId]);

  const send = (content) => {
    if (!content.trim() || !roomId) return;
    sendMessage(roomId, currentUserId, content);
  };

  return { messages, send };
};

export default useMessages;
