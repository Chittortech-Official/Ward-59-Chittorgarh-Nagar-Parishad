'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, ROLE_DEMO_USERS } from '@/lib/authContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import GovLoadingScreen from './GovLoadingScreen';

const ROLE_LOADING_MESSAGES = {
  citizen: 'नागरिक पोर्टल लोड हो रहा है...',
  parshad: 'वार्ड 59 पार्षद पोर्टल लोड हो रहा है...',
};

export default function DashboardShell({
  children,
  requiredRole,
  allowedRoles,
  hideBottomNav = false,
  guestMode = false,
  currentProfile,
  loadingMessage,
}) {
  const { profile, loading, switchRole } = useAuth();
  const router = useRouter();
  const [shellMounted, setShellMounted] = useState(false);

  // Direct role assignment: Each portal route operates directly with its own role
  const effectiveProfile = guestMode
    ? null
    : (currentProfile !== undefined
        ? currentProfile
        : (requiredRole && ROLE_DEMO_USERS[requiredRole] ? ROLE_DEMO_USERS[requiredRole] : profile || ROLE_DEMO_USERS.citizen)
      );

  const activeRole = guestMode ? 'guest' : (requiredRole || effectiveProfile?.role || 'citizen');
  const isParshad = (activeRole === 'parshad' || requiredRole === 'parshad') && !guestMode;

  useEffect(() => {
    // Brief official government emblem loading screen for initial mount
    const timer = setTimeout(() => {
      setShellMounted(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Render official Rajasthan emblem loading screen on initial mount
  if (!guestMode && !shellMounted) {
    const displayMsg = loadingMessage || ROLE_LOADING_MESSAGES[activeRole] || 'पोर्टल लोड हो रहा है...';
    return (
      <div className={`app-shell ${isParshad ? 'desktop-mode' : 'mobile-mode'}`}>
        <Navbar currentProfile={effectiveProfile} guestMode={guestMode} />
        <main className={`app-main ${isParshad ? 'admin-app-main' : 'mobile-app-main'}`}>
          <GovLoadingScreen message={displayMsg} />
        </main>
      </div>
    );
  }

  return (
    <div className={`app-shell ${isParshad ? 'desktop-mode' : (guestMode ? 'guest-mode' : 'mobile-mode')}`}>
      {/* Top Navbar */}
      <Navbar currentProfile={effectiveProfile} guestMode={guestMode} />

      {/* Left Sidebar for Parshad portal */}
      {isParshad && <Sidebar currentProfile={effectiveProfile} />}

      {/* Main Content Area */}
      <main
        className={`app-main ${isParshad ? 'admin-app-main' : (guestMode ? 'guest-app-main' : 'mobile-app-main')}`}
        style={guestMode ? { paddingBottom: 0 } : undefined}
      >
        <div className={isParshad ? 'page-container' : (guestMode ? 'guest-full-container' : 'mobile-container')}>
          {children}
        </div>
      </main>

      {/* Mobile bottom nav for phone screens */}
      {!hideBottomNav && !guestMode && <MobileBottomNav role={activeRole} />}
    </div>
  );
}
