"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ComponentType } from "react";
import { jwtDecode } from "jwt-decode";

const adminProtectedRoute = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const HOC = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); 
    useEffect(() => {
      const token = Cookies.get("access_Admin_token");
      const JwtToken = localStorage.getItem("adminToken");
      if (!JwtToken) {
        localStorage.removeItem("jwtToken");
       return router.push("/admin/adminLogin");
      } else {
        const decodedToken = jwtDecode(JwtToken); // Decode the JWT token
        const currentTime = Date.now() / 1000; // Current time in seconds (JWT exp is in seconds)
        console.log("decodedToken", decodedToken, currentTime);

        if (decodedToken?.exp && decodedToken.exp < currentTime) {
          localStorage.setItem("ProEmail", "");
          localStorage.removeItem("jwtToken");
          router.push("/login");
        } else {
          // Token is still valid
          setIsLoading(false);
        }      }
    }, [router]);

    if (isLoading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#191919] bg-opacity-75">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export default adminProtectedRoute;

