import { useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import useChat from "../hooks/useChat";

const Home = () => {
  const { loadRooms } = useChat();

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <div id="chat-layout" style={styles.layout}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

const styles = {
  layout: { display: "flex", height: "100vh", overflow: "hidden", background: "#f9fafb" },
};

export default Home;
