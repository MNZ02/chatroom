import axios from "axios";
export const login = async (data: { username: string; password: string }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/login`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
  }
};
