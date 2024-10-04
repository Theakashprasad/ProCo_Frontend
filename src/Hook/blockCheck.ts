import axios from "axios";
import { useEffect, useState } from "react";
import useUser from "./useUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const useDataMain = () => {
  const { user } = useUser();
  const [email, setEmail] = useState(user?.email);
  const [userDatas, setUserData] = useState();
  const [pro, setPro] = useState(user?.isPro);
  const router = useRouter();

  useEffect(() => {
    console.log("user?.isPro", user?.isPro);
    setEmail(user?.email);
    setPro(user?.isPro);
  }, [user, setPro]);

  useEffect(() => {
    const fetchData = async () => {
      if (email && !pro) {
        try {
          const res = await axios.post(
            `${BASE_URL}/api/userDataMain`,
            { email },
            { withCredentials: true }
          );
          setUserData(res.data.userData);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
              toast.error(
                error?.response?.data.message ||
                  "An error occurred. Please try again.",
                { position: "top-left" }
              );
              router.replace("/login");
            } else {
              toast.error(
                error?.response?.data.message ||
                  "An error occurred. Please try again.",
                { position: "top-left" }
              );
            }
          } else {
            console.log("An unexpected error occurred:", error);
          }
        }
      }
    };

    fetchData();
  }, [email, pro, router]);

  return { userDatas };
};

export default useDataMain;
