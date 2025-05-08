// import { useContext } from 'react';
// import { AuthContext } from '@/context/AuthContext';
// import { Role } from '@/constants/roles';

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }

//   const { user, token, login, logout, isAuthenticated } = context;

//   const hasRole = (roles: Role[]) => {
//     if (!user?.role) return false;
//     return roles.includes(user.role);
//   };

//   return {
//     user,
//     token,
//     login,
//     logout,
//     isAuthenticated,
//     hasRole,
//   };
// };
