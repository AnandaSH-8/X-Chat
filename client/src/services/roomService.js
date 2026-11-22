import api from "./api";

export const initRoom = (otheruser) => api.post("/rooms/init", { otheruser });
export const getUserRooms = () => api.get("/rooms/userrooms");
