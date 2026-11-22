import { useEffect, useRef, useState } from "react";
import { setTyping, subscribeToTyping } from "../firebase/typingService";

const useTyping = (roomId, currentUserId) => {
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    const unsub = subscribeToTyping(roomId, currentUserId, setIsOtherTyping);
    return unsub;
  }, [roomId, currentUserId]);

  const handleTyping = () => {
    setTyping(roomId, currentUserId, true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping(roomId, currentUserId, false);
    }, 2000);
  };

  return { isOtherTyping, handleTyping };
};

export default useTyping;
