import api from "./api";

export const searchUsers = (searchTerm) =>
  api.get("/users/search", { params: { searchTerm } });
