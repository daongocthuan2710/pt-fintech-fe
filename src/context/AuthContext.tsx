// 'use client';

// import { createContext, useState, useEffect } from 'react';
// import { User } from '@/types/user';
// import { getProfileAPI, loginAPI } from '@/features/auth/api';
// import { getToken, removeToken, saveToken } from '@/utils/token';

// type AuthContextType = {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
// };

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(getToken());

//   const isAuthenticated = !!token;

//   useEffect(() => {
//     if (token) {
//       getProfileAPI()
//         .then(setUser)
//         .catch(() => logout());
//     }
//   }, [token]);

//   const login = async (email: string, password: string) => {
//     const res = await loginAPI(email, password);
//     saveToken(res.token);
//     setToken(res.token);
//   };

//   const logout = () => {
//     removeToken();
//     setToken(null);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
