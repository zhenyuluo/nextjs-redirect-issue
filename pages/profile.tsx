import React from "react";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const router = useRouter();

  return (
    <div>
      <button onClick={() => router.push(`/antd`)}>
        Login
      </button>
    </div>
  );
};

export default ProfilePage;
