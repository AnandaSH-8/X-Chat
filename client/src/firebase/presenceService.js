import { db } from "./firebaseConfig";
import { ref, set, onValue, off, onDisconnect } from "firebase/database";

export const setOnline = (userId) => {
  const r = ref(db, `presence/${userId}`);
  set(r, true);
  onDisconnect(r).set(false);
};

export const setOffline = (userId) => set(ref(db, `presence/${userId}`), false);

export const subscribeToPresence = (userId, callback) => {
  const r = ref(db, `presence/${userId}`);
  onValue(r, (snap) => callback(snap.val() === true));
  return () => off(r);
};
