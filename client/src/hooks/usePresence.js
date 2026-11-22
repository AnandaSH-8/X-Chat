import { useEffect, useState } from "react";
import { subscribeToPresence } from "../firebase/presenceService";

const usePresence = (userId) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const unsub = subscribeToPresence(userId, setIsOnline);
    return unsub;
  }, [userId]);

  return isOnline;
};

export default usePresence;
