import { createContext, useContext, useEffect, useState } from "react";
import { remoteConfig } from "../firebase";
import { fetchAndActivate, getBoolean, getString } from "firebase/remote-config";

const RemoteConfigContext = createContext();

export function RemoteConfigProvider({ children }) {
  const [config, setConfig] = useState({
    isAiEnabled: true,
    aiModel: "gemini-2.5-flash-lite",
    is_encrypted: false,
    is_light: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Set defaults explicitly in code as well
        remoteConfig.defaultConfig = {
          isAiEnabled: true,
          aiModel: "gemini-2.5-flash-lite",
          is_encrypted: false,
          is_light: false,
        };
        
        await fetchAndActivate(remoteConfig);
        
        setConfig({
          isAiEnabled: getBoolean(remoteConfig, "isAiEnabled"),
          aiModel: getString(remoteConfig, "aiModel"),
          is_encrypted: getBoolean(remoteConfig, "is_encrypted"),
          is_light: getBoolean(remoteConfig, "is_light"),
        });
      } catch (err) {
        console.error("Failed to fetch remote config:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <RemoteConfigContext.Provider value={{ config, loading }}>
      {children}
    </RemoteConfigContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRemoteConfig() {
  const context = useContext(RemoteConfigContext);
  if (context === undefined) {
    throw new Error("useRemoteConfig must be used within a RemoteConfigProvider");
  }
  return context;
}
