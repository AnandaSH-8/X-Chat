import { db } from "./firebaseConfig";
import { ref, push, onValue, off, serverTimestamp } from "firebase/database";

export const sendMessage = (roomId, senderId, content) =>
  push(ref(db, `messages/${roomId}`), { content, senderId, timestamp: serverTimestamp() });

export const subscribeToMessages = (roomId, callback) => {
  const msgRef = ref(db, `messages/${roomId}`);
  onValue(msgRef, (snap) => {
    const data = snap.val();
    callback(data ? Object.entries(data).map(([id, m]) => ({ id, ...m })) : []);
  });
  return () => off(msgRef);
};
