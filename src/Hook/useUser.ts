import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
interface User {
  email: string;
  role: string;
  isPro: boolean;
}

const useUser = () => {
  // const token = Cookies.get("access_token");
  const [user, setUser] = useState<User | undefined>();
  // useEffect(() => {
  //   if (token) {
  //     const {email, role} = jwtDecode<User>(token);
  //     setUser({email, role, isPro: role === 'profesional'})
  //   }
  // }, [token]);

  // const [userdata, setUserdata] = useState<User | null>();
  useEffect(() => {
    const storedUserDetail = typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
    if (storedUserDetail) {
      const initialUserState = storedUserDetail
        ? JSON.parse(storedUserDetail)
        : null;
        const {email, role} = initialUserState
        setUser({email, role, isPro: role === 'profesional'})

    }
  }, [setUser]);
  return {user};
};

export default useUser;
