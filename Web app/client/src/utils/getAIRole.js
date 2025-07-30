import axios from 'axios';

export const getAIRole = async (email) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/ai/role`, { email });
    return res.data.role;
  } catch (err) {
    console.error("Failed to get role from AI:", err);
    return null;
  }
};