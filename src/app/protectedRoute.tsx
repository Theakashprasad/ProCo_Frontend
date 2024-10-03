"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ComponentType } from "react";

const withProtectedRoute = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const HOC = (props: P) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); 
    useEffect(() => {
      const token = Cookies.get("access_token");  
      const JwtToken = localStorage.getItem("jwtToken");

      console.log('checking if the token exist or not', JwtToken);
      
      if (!token || !JwtToken) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
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

export default withProtectedRoute;
