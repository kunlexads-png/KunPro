import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User;
  organization: Organization | null;
  isAuthenticated: boolean; // True for Super Admin, Business Owner, Analyst. False for Viewer.
  isLoginModalOpen: boolean;
  loginModalReason: string;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  openLoginModal: (reason?: string) => void;
  closeLoginModal: () => void;
  requireRole: (allowedRoles: UserRole[], actionDescription?: string) => boolean;
}

const guestViewer: User = {
  id: 'usr-guest-viewer',
  name: 'Guest Viewer',
  email: 'viewer@cerebrobi.io',
  role: 'Viewer',
  organizationId: 'org-cerebro-01',
  avatarUrl: '',
  lastLogin: 'Read-only viewer session',
};

const defaultOrg: Organization = {
  id: 'org-cerebro-01',
  name: 'Apex Global Technologies Corp.',
  plan: 'Enterprise Autonomous BI',
  currency: 'USD ($)',
  fiscalYearStart: 'January',
  timezone: 'America/New_York (UTC-5)',
  memberCount: 24,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(guestViewer);
  const [organization, setOrganization] = useState<Organization | null>(defaultOrg);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginModalReason, setLoginModalReason] = useState<string>('');

  useEffect(() => {
    // Check if user previously logged in
    const storedToken = localStorage.getItem('cerebro_token');
    if (storedToken && storedToken !== 'viewer_token') {
      api.getMe()
        .then((res) => {
          if (res.user && res.user.role !== 'Viewer') {
            setUser(res.user);
          } else {
            setUser(guestViewer);
          }
          if (res.organization) setOrganization(res.organization);
        })
        .catch(() => {
          setUser(guestViewer);
        });
    } else {
      setUser(guestViewer);
    }
  }, []);

  const isAuthenticated = user.role !== 'Viewer';

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      api.setToken(res.token);
      setUser(res.user);
      if (res.organization) setOrganization(res.organization);
      setIsLoginModalOpen(false);
      setLoginModalReason('');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(guestViewer);
    localStorage.removeItem('cerebro_token');
  };

  const openLoginModal = (reason?: string) => {
    setLoginModalReason(reason || 'Standard enterprise login is required to access administrative and analytical features.');
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginModalReason('');
  };

  const requireRole = (allowedRoles: UserRole[], actionDescription?: string): boolean => {
    if (allowedRoles.includes(user.role)) {
      return true;
    }

    openLoginModal(
      `Access Restricted: Standard login as ${allowedRoles.join(' or ')} is required to ${actionDescription || 'perform this operation'}. Viewers have read-only access to browse the dashboards and reports.`
    );
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isAuthenticated,
        isLoginModalOpen,
        loginModalReason,
        isLoading,
        login,
        logout,
        openLoginModal,
        closeLoginModal,
        requireRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
