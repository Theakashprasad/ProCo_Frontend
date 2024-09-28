import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const fetchUserById = async (token: string, userId:string) => {
  console.log("userId",userId);
  
    const response = await axios.get(`${BASE_URL}/api/userById/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    console.log(response,'fron')
    return response.data;
  
  };



