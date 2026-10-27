'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  Home, PlusCircle, ClipboardList, Building2, MapPin, LogOut
} from 'lucide-react';

const MOBILE_NAV_CONFIG = {
  citizen: [
    { href: '/citizen',            label: 'होम',        sub: 'Dashboard',   icon: Home },
    { href: '/citizen/report',     label: 'समस्या दर्ज', sub: 'Report',      icon: PlusCircle },
    { href: '/citizen/complaints', label: 'मेरी शिकायतें', sub: 'Complaints',  icon: ClipboardList },
  ],
  parshad: [
    { href: '/parshad',            label: 'वार्ड 59',    sub: 'Overview',   icon: Home },
    { href: '/parshad/complaints', label: 'शिकायतें',    sub: 'Complaints', icon: ClipboardList },
    { href: '/parshad/departments',label: 'विभाग डाटा',  sub: 'Depts',      icon: Building2 },
    { href: '/parshad/areas',      label: 'वार्ड क्षेत्र',sub: 'Areas',      icon: MapPin },
  ],
};

export default function MobileBottomNav({ role }) {
  const pathname = usePathname();
  const { logout, profile } = useAuth();
  const navItems = MOBILE_NAV_CONFIG[role] || [];

  if (!navItems.length) return null;

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item ${isActive ? 'active' : ''} ${item.highlight ? 'highlight' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <Icon size={item.highlight ? 22 : 20} />
            </div>
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        );
      })}

      {/* Logout button */}
      <button
        onClick={logout}
        className="mobile-nav-item"
        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        title="Logout"
      >
        <div className="mobile-nav-icon-wrap">
          <LogOut size={18} color="#ef4444" />
        </div>
        <span className="mobile-nav-label" style={{ color: '#ef4444' }}>लॉगआउट</span>
      </button>
    </nav>
  );
}
