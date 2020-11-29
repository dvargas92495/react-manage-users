import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  name: string;
  email: string;
  accessToken: string;
  avatarUrl: string;
};

const UserContext = createContext<{
  user?: User;
  setUser?: (u?: User) => void;
}>({});

export const UserProvider = ({
  children,
  autoLoginConfig,
  handleError,
}: {
  children: React.ReactNode;
  handleError: (msg: string) => void;
  autoLoginConfig: {
    getToken: () => string;
    getUser: (accessToken: string) => Promise<Omit<User, "accessToken">>;
  }[];
}) => {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    for (const config of autoLoginConfig) {
      const accessToken = config.getToken();
      if (accessToken && !user) {
        config
          .getUser(accessToken)
          .then((u) =>
            setUser({
              accessToken,
              ...u,
            })
          )
          .catch((e) => handleError(e.response?.data || e.message));
        return;
      }
    }
  }, [setUser, handleError]);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext).user;

export const useLogout = () => {
  const setUser = useContext(UserContext).setUser;
  if (!setUser) {
    return () => {};
  }
  return useCallback(() => setUser(), [setUser]);
};
