import { useChatContext } from "../context/ChatContext";
import { getUserRooms, initRoom } from "../services/roomService";

const useChat = () => {
  const { rooms, setRooms, activeRoom, setActiveRoom } = useChatContext();

  const loadRooms = async () => {
    const res = await getUserRooms();
    setRooms(res.data.data);
  };

  const startChat = async (otherUserId) => {
    const res = await initRoom(otherUserId);
    const room = res.data.data;
    setRooms((prev) => {
      const exists = prev.find((r) => r._id === room._id);
      return exists ? prev : [room, ...prev];
    });
    setActiveRoom(room);
    return room;
  };

  return { rooms, activeRoom, setActiveRoom, loadRooms, startChat };
};

export default useChat;
