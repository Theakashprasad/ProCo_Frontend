import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
interface User {
  email: string;
  role: string;
  isPro: boolean;
}

const useUser = () => {
  const token = Cookies.get("access_token");
  const [user, setUser] = useState<User | undefined>();
  useEffect(() => {
    if (token) {
      const {email, role} = jwtDecode<User>(token);
      setUser({email, role, isPro: role === 'profesional'})
    }
  }, [token]);

  return {user};
};

export default useUser;
