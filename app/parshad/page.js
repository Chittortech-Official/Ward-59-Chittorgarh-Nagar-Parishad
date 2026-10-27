'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/lib/authContext';
import { getSharedLiveComplaints, fetchSharedLiveComplaints, subscribeToLiveComplaints } from '@/lib/citizenService';
import {
  FileText, CheckCircle, Clock, AlertTriangle,
  MapPin, Phone, ArrowRight, ChevronRight, Image,
  ShieldCheck, Sparkles, Building2, PhoneCall
} from 'lucide-react';
import Link from 'next/link';

const INITIAL_WARD_STATS = {
  wardNumber: 59,
  wardName: 'किला ढलान एवं मीरा मार्ग क्षेत्र',
  total: 0,
  pending: 0,
  inProgress: 0,
  resolved: 0,
};

const MUNICIPAL_DEPARTMENTS_CONFIG = [
  { id: 'sanitation', name: 'स्वास्थ्य एवं स्वच्छता शाखा', head: 'श्री सुरेश शर्मा (मुख्य स्वास्थ्य निरीक्षक)', phone: '01472-241246', ext: '101', icon: '🧹', color: '#16a34a', bg: '#f0fdf4', matchCats: ['कचरा', 'सफाई', 'सीवरेज', 'नाली', 'Garbage', 'Drainage'] },
  { id: 'electrical', name: 'विद्युत एवं प्रकाश व्यवस्था', head: 'श्री मुकेश टेलर (कनिष्ठ अभियंता विद्युत)', phone: '01472-241246', ext: '104', icon: '💡', color: '#d97706', bg: '#fffbeb', matchCats: ['लाइट', 'विद्युत', 'Street Light', 'Electrical'] },
  { id: 'water',      name: 'जल प्रदाय शाखा', head: 'श्री राजेंद्र जोशी (सहायक अभियंता जल)', phone: '01472-241246', ext: '103', icon: '🚰', color: '#0284c7', bg: '#f0f9ff', matchCats: ['जल', 'पानी', 'पाइपलाइन', 'Water'] },
  { id: 'civil',      name: 'निर्माण एवं सड़क अनुभाग', head: 'श्री मोहन लाल खटीक (अधिशासी अभियंता)', phone: '01472-241246', ext: '102', icon: '🛣️', color: '#2563eb', bg: '#eff6ff', matchCats: ['सड़क', 'गड्ढा', 'पुलिया', 'Road', 'Pothole'] },
  { id: 'garden',     name: 'उद्यान एवं पर्यावरण विकास', head: 'श्री श्याम सुंदर (उद्यान अधीक्षक)', phone: '01472-241246', ext: '105', icon: '🌳', color: '#65a30d', bg: '#f7fee7', matchCats: ['पार्क', 'उद्यान', 'झाड़ियां', 'Park'] },
];

export default function ParshadPage() {
  const { profile } = useAuth();
  const [complaintsList, setComplaintsList] = useState([]);
  const [s, setStats] = useState(INITIAL_WARD_STATS);

  useEffect(() => {
    function formatAndSet(live) {
      const formatted = (live || []).map(c => ({
        id: c.id || c.code,
        code: c.code,
        category: c.category,
        status: c.status || 'submitted',
        location: c.location,
        date: c.date,
        citizen: c.citizenName || 'राजेश कुमार शर्मा',
        photo: !!c.hasPhoto,
        dept: c.dept,
        isNew: true,
      }));
      setComplaintsList(formatted);
      const pendingCount = formatted.filter(c => ['submitted', 'in_progress', 'assigned', 'reopened'].includes(c.status)).length;
      const inProgressCount = formatted.filter(c => ['in_progress', 'assigned'].includes(c.status)).length;
      const resolvedCount = formatted.filter(c => ['resolved', 'closed'].includes(c.status)).length;
      setStats({
        wardNumber: 59,
        wardName: 'किला ढलान एवं मीरा मार्ग क्षेत्र',
        total: formatted.length,
        pending: pendingCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
      });
    }

    // 1. Initial cached load
    formatAndSet(getSharedLiveComplaints(59));

    // 2. Fetch fresh live data from Supabase
    fetchSharedLiveComplaints(59).then(fresh => {
      if (fresh) formatAndSet(fresh);
    });

    // 3. Subscribe to real-time events & storage updates
    const unsubscribe = subscribeToLiveComplaints((all) => {
      const cleanW = '59';
      const filtered = (all || []).filter(c => String(c.ward || c.wardNumber || '').replace(/\D/g, '') === cleanW);
      formatAndSet(filtered);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <DashboardShell requiredRole="parshad">
      {/* 1. Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '16px 20px',
        marginBottom: 14,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <MapPin size={16} color="#7c3aed" />
              <span style={{ color: '#7c3aed', fontWeight: 800, fontSize: '0.85rem' }}>
                वार्ड संख्या {s.wardNumber} — {s.wardName}
              </span>
            </div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 2, fontWeight: 800 }}>
              वार्ड 59 पार्षद पोर्टल
            </h1>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
              वार्ड पार्षद: <strong>{profile?.full_name || 'श्री प्रमोद राजपुरोहित (निर्दलीय)'}</strong> • नगर परिषद चित्तौड़गढ़
            </p>
          </div>
          <span className="badge badge-parshad" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            वार्ड 59 पार्षद
          </span>
        </div>
      </div>

      {/* 2. Ward Complaint Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 18 }}>
        <Link href="/parshad/complaints" className="card" style={{ padding: '16px 14px', textAlign: 'center', borderTop: '4px solid #1e3a8a', textDecoration: 'none', color: 'inherit', borderRadius: 12 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1 }}>{s.total}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, marginTop: 6 }}>कुल वार्ड शिकायतें</div>
        </Link>

        <Link href="/parshad/complaints" className="card" style={{ padding: '16px 14px', textAlign: 'center', borderTop: '4px solid #d97706', textDecoration: 'none', color: 'inherit', borderRadius: 12 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{s.pending}</div>
          <div style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 700, marginTop: 6 }}>निस्तारण लंबित</div>
        </Link>

        <Link href="/parshad/complaints" className="card" style={{ padding: '16px 14px', textAlign: 'center', borderTop: '4px solid #7c3aed', textDecoration: 'none', color: 'inherit', borderRadius: 12 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', lineHeight: 1 }}>{s.inProgress}</div>
          <div style={{ fontSize: '0.8rem', color: '#7c3aed', fontWeight: 700, marginTop: 6 }}>प्रगति पर</div>
        </Link>

        <Link href="/parshad/complaints" className="card" style={{ padding: '16px 14px', textAlign: 'center', borderTop: '4px solid #16a34a', textDecoration: 'none', color: 'inherit', borderRadius: 12 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>{s.resolved}</div>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginTop: 6 }}>समाधान पूर्ण</div>
        </Link>
      </div>

      {/* 4. Recent Ward Complaints with Direct Page Links */}
      <div className="card" style={{ marginBottom: 16, padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: '1 1 200px' }}>
            <h2 style={{ fontSize: '1.05rem', color: '#1e3a8a', fontWeight: 800, margin: 0 }}>
              हालिया वार्ड 59 शिकायतें
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
              शिकायत पर क्लिक कर नागरिक विवरण, फोटो व कार्रवाई स्थिति देखें
            </div>
          </div>
          <Link
            href="/parshad/complaints"
            style={{
              fontSize: '0.8rem',
              color: '#0284c7',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            समस्त {s.total} देखें <ChevronRight size={14} />
          </Link>
        </div>

        {complaintsList.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1.5px dashed #cbd5e1',
            borderRadius: 12,
            padding: '24px 16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🌿</div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#16a34a', marginBottom: 4 }}>
              वार्ड 59 में वर्तमान में कोई लंबित शिकायत नहीं है (All Clear)
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
              नागरिक ई-सेवा पोर्टल से जैसे ही वार्ड 59 की नई समस्या दर्ज होगी, वह यहाँ रियल-टाइम में प्रदर्शित होगी।
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {complaintsList.map(c => (
              <Link
                key={c.code || c.id}
                href={`/parshad/complaints/${c.code || c.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <div
                  style={{
                    border: c.isNew ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '14px 16px',
                    background: c.isNew ? '#fffbeb' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                    boxShadow: c.isNew ? '0 4px 12px rgba(245, 158, 11, 0.15)' : '0 1px 2px rgba(0,0,0,0.02)',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#f0f9ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = c.isNew ? '#f59e0b' : '#e2e8f0'; e.currentTarget.style.background = c.isNew ? '#fffbeb' : '#ffffff'; }}
                >
                  {/* Top Row: Token + Category + Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#1e3a8a', fontWeight: 800, background: '#eff6ff', padding: '2px 8px', borderRadius: 4 }}>
                        {c.code}
                      </span>
                      <strong style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.94rem' }}>
                        {c.category}
                      </strong>
                      {c.isNew && (
                        <span style={{
                          background: '#fef3c7',
                          color: '#b45309',
                          border: '1px solid #fde68a',
                          padding: '2px 8px',
                          borderRadius: 9999,
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}>
                          ✨ अभी-अभी दर्ज (Just Reported)
                        </span>
                      )}
                      {c.photo && (
                        <span style={{
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '2px 8px',
                          borderRadius: 9999,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}>
                          📷 फोटो
                        </span>
                      )}
                    </div>
                    <StatusBadge status={c.status} />
                  </div>

                  {/* Bottom Row: Location + Citizen + Date + Action */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    flexWrap: 'wrap',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: 8,
                    fontSize: '0.78rem',
                    color: '#64748b'
                  }}>
                    <div>
                      📍 {c.location} • नागरिक: <strong style={{ color: '#334155' }}>{c.citizen}</strong> • {c.date}
                    </div>
                    <span style={{ color: '#0284c7', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: '0.8rem' }}>
                      विवरण देखें <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 5. Municipal Departments Status & Performance for Ward 59 */}
      <div className="card" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: '1 1 200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Building2 size={16} color="#1e3a8a" />
              <h2 style={{ fontSize: '1.05rem', color: '#1e3a8a', fontWeight: 800, margin: 0 }}>
                नगरपालिका विभाग कार्य स्थिति (वार्ड 59)
              </h2>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              वार्ड 59 की शिकायतों पर नगर पालिका विभागों की जवाबदेही, प्रभारी अधिकारी संपर्क एवं प्रगति
            </div>
          </div>
          <Link
            href="/parshad/departments"
            style={{
              fontSize: '0.8rem',
              color: '#0284c7',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            विस्तृत विभाग रिपोर्ट <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MUNICIPAL_DEPARTMENTS_CONFIG.map(dept => {
            const deptComplaints = complaintsList.filter(c => {
              const cat = (c.category || '') + (c.dept || '');
              return dept.matchCats.some(m => cat.includes(m));
            });
            const deptResolved = deptComplaints.filter(c => ['resolved', 'closed'].includes(c.status)).length;
            const deptPending = deptComplaints.length - deptResolved;

            return (
              <div
                key={dept.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: '12px 14px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: dept.bg,
                      border: `1.5px solid ${dept.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0,
                    }}>
                      {dept.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem', lineHeight: 1.2 }}>
                        {dept.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 2 }}>
                        {dept.head}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: 9999,
                      background: deptPending > 0 ? '#fffbeb' : '#dcfce7',
                      color: deptPending > 0 ? '#b45309' : '#15803d',
                      border: `1px solid ${deptPending > 0 ? '#fde68a' : '#86efac'}`,
                    }}>
                      {deptPending > 0 ? `${deptPending} लंबित` : 'सभी निस्तारित ✓'}
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: 8,
                  flexWrap: 'wrap',
                }}>
                  <a
                    href={`tel:${dept.phone}`}
                    style={{
                      background: '#1e3a8a',
                      color: '#ffffff',
                      padding: '6px 12px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Phone size={12} />
                    <span>कॉल: {dept.phone} Ext. {dept.ext}</span>
                  </a>

                  <Link
                    href={`/parshad/complaints?dept=${dept.id}`}
                    style={{
                      fontSize: '0.75rem',
                      color: '#0284c7',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    वार्ड 59 प्रकरण देखें →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
