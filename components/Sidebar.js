'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { getSharedLiveComplaints, fetchSharedLiveComplaints, subscribeToLiveComplaints } from '@/lib/citizenService';
import {
  LayoutDashboard, MapPin, ChevronRight, Building2,
  ClipboardList, LogOut
} from 'lucide-react';

export default function Sidebar({ currentProfile }) {
  const { profile: authProfile, logout } = useAuth();
  const profile = currentProfile || authProfile;
  const pathname = usePathname();
  const [complaintCount, setComplaintCount] = useState(0);

  useEffect(() => {
    function updateCount(live) {
      setComplaintCount(live ? live.length : 0);
    }
    updateCount(getSharedLiveComplaints(59));
    fetchSharedLiveComplaints(59).then(fresh => {
      if (fresh) updateCount(fresh);
    });
    const unsubscribe = subscribeToLiveComplaints((all) => {
      const cleanW = '59';
      const filtered = (all || []).filter(c => String(c.ward || c.wardNumber || '').replace(/\D/g, '') === cleanW);
      updateCount(filtered);
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    {
      href: '/parshad',
      label: 'वार्ड 59 डैशबोर्ड',
      sub: 'Dashboard Overview',
      icon: LayoutDashboard
    },
    {
      href: '/parshad/complaints',
      label: 'वार्ड शिकायतें',
      sub: 'Citizen Complaints',
      icon: ClipboardList,
      badge: String(complaintCount)
    },
    {
      href: '/parshad/departments',
      label: 'नगर पालिका शाखाएं व संपर्क',
      sub: 'Municipal Departments',
      icon: Building2,
      badge: '5'
    },
    {
      href: '/parshad/areas',
      label: 'वार्ड 59 क्षेत्र व मोहल्ले',
      sub: 'Localities & Beats',
      icon: MapPin,
      badge: '5'
    },
  ];

  return (
    <aside className="sidebar desktop-sidebar" style={{ background: '#ffffff' }}>
      {/* 1. Councillor / Admin Profile Header */}
      <div className="sidebar-profile-box" style={{ padding: '16px 14px', borderBottom: '1px solid #e2e8f0', background: '#faf5ff' }}>
        <div
          className="sidebar-profile-avatar"
          style={{
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1rem',
            width: 44,
            height: 44,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)',
            flexShrink: 0
          }}
        >
          प्र
        </div>
        <div className="sidebar-profile-info" style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.68rem', color: '#6b21a8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            वार्ड 59 पार्षद प्रतिनिधि
          </div>
          <div className="sidebar-profile-name" style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e1b4b' }}>
            श्री प्रमोद राजपुरोहित
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <span
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: 9999,
                background: '#f3e8ff',
                color: '#6b21a8',
                border: '1px solid #d8b4fe'
              }}
            >
              वार्ड पार्षद (निर्दलीय)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Primary Navigation Links */}
      <div className="sidebar-section" style={{ padding: '14px 10px', flex: 1, overflowY: 'auto' }}>
        <span
          className="sidebar-section-label"
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#64748b',
            letterSpacing: '0.06em',
            marginBottom: 8,
            paddingLeft: 6
          }}
        >
          वार्ड 59 पार्षद मेनू
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/parshad' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                marginBottom: 6,
                background: isActive ? '#f5f3ff' : 'transparent',
                border: isActive ? '1.5px solid #7c3aed' : '1px solid transparent',
                color: isActive ? '#6d28d9' : '#334155',
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isActive ? '#7c3aed' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={16} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: isActive ? 800 : 600, lineHeight: 1.25 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.68rem', color: isActive ? '#7c3aed' : '#94a3b8', marginTop: 1 }}>
                  {item.sub}
                </div>
              </div>

              {item.badge && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999,
                    background: isActive ? '#7c3aed' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#475569',
                    flexShrink: 0
                  }}
                >
                  {item.badge}
                </span>
              )}

              {isActive && <ChevronRight size={15} color="#7c3aed" style={{ flexShrink: 0 }} />}
            </Link>
          );
        })}
      </div>

      {/* 3. Official Chittorgarh Municipality Contact Box */}
      <div
        className="sidebar-footer-card"
        style={{
          margin: '10px 12px',
          padding: '12px 14px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 10
        }}
      >
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>🏛️</span>
          <span>नगर परिषद चित्तौड़गढ़</span>
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.45 }}>
          कंट्रोल रूम: <strong>01472-241246</strong><br />
          राजस्थान संपर्क: <strong>181</strong>
        </div>
      </div>

      {/* 4. Logout Action */}
      <div className="sidebar-bottom-action" style={{ padding: '12px 14px', borderTop: '1px solid #f1f5f9' }}>
        <button
          className="sidebar-logout-btn"
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '9px 12px',
            borderRadius: 8,
            border: '1px solid #fee2e2',
            background: '#fff5f5',
            color: '#dc2626',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          <LogOut size={15} />
          <span>लॉगआउट (Sign Out)</span>
        </button>
      </div>
    </aside>
  );
}
