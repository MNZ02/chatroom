import axios from "axios";

export const getAllUsers = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/users`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting all users");
  }
};
