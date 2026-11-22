import { db } from "./firebaseConfig";
import { ref, set, onValue, off } from "firebase/database";

export const setTyping = (roomId, userId, isTyping) =>
  set(ref(db, `typing/${roomId}/${userId}`), isTyping);

export const subscribeToTyping = (roomId, currentUserId, callback) => {
  const typingRef = ref(db, `typing/${roomId}`);
  onValue(typingRef, (snap) => {
    const data = snap.val() || {};
    callback(Object.entries(data).some(([uid, val]) => uid !== currentUserId && val === true));
  });
  return () => off(typingRef);
};
