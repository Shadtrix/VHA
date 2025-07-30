import axios from 'axios';

export const generateAIPassword = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/ai/password');
    return response.data.password;
  } catch (err) {
    console.error("❌ Failed to generate password:", err);
    return null;
  }
};
export const getAIRole = async (email) => {
  try {
    const response = await axios.post('http://localhost:3001/api/ai/role', { email });
    return response.data.role;
  } catch (err) {
    console.error("❌ Failed to get role from AI:", err);
    return null;
  }
};