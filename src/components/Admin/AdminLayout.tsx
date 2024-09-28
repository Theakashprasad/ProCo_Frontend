import React from "react";
import AdminNav from "./AdminNav";

const AdminLayout = ({ children }: any) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
