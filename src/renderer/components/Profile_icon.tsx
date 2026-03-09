import { useEffect, useState } from "react";
import { supabase } from "../auth/supabaseClient";

export const Profile_icon = () => {
  const [avatar_icon_url, setAvatar_icon_url] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      //Hämtar Icon url:en från användarens metadata i sessionen
      setAvatar_icon_url(user?.user_metadata?.avatar_url || null);
    };
    fetchProfile();
  }, []);

  return (
    <div>
      {avatar_icon_url ?
        <img
          src={avatar_icon_url}
          alt="Google Icon"
          style={{ width: "80px", height: "80px", borderRadius: "50%" }}
          referrerPolicy="no-referrer"
        />
      : <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#8d2626",
          }}
        />
      }
    </div>
  );
};
