import axios from 'axios';

export const generateAIPassword = async () => {
  try {
    const response = await axios.post("http://localhost:3001/api/ai/password");
    return response.data.password;
  } catch (error) {
    console.error("❌ Failed to fetch password from server:", error);
    return null;
  }
};
