'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { getSharedLiveComplaints, fetchSharedLiveComplaints, subscribeToLiveComplaints } from '@/lib/citizenService';
import {
  Building2, Phone, ArrowLeft, CheckCircle, Clock,
  FileText, ShieldCheck, ChevronRight, AlertCircle, PhoneCall
} from 'lucide-react';
import Link from 'next/link';

const DEPARTMENTS = [
  {
    id: 'sanitation',
    name: 'स्वास्थ्य एवं स्वच्छता शाखा (Sanitation & Health)',
    officer: 'श्री सुरेश शर्मा (मुख्य स्वास्थ्य निरीक्षक)',
    phone: '01472-241246 Ext. 101',
    mobile: '98290-44101',
    color: '#16a34a',
    bg: '#f0fdf4',
    icon: '🧹',
    matchCats: ['कचरा', 'सफाई', 'सीवरेज', 'नाली', 'Garbage', 'Drainage'],
    scope: 'दैनिक डोर-टू-डोर कचरा संग्रहण, खुली नालियों की डीसिल्टिंग, चूना छिड़काव एवं स्वच्छता निगरानी।'
  },
  {
    id: 'electrical',
    name: 'विद्युत एवं प्रकाश व्यवस्था (Street Lighting & Electrical)',
    officer: 'श्री मुकेश टेलर (कनिष्ठ अभियंता विद्युत)',
    phone: '01472-241246 Ext. 104',
    mobile: '98290-44104',
    color: '#d97706',
    bg: '#fffbeb',
    icon: '💡',
    matchCats: ['लाइट', 'विद्युत', 'Street Light', 'Electrical'],
    scope: 'वार्ड के सभी खंभों पर एलईडी स्ट्रीट लाइट दुरुस्ती, टाइमर स्विचिंग, फॉल्ट सुधार व नई लाइट स्थापना।'
  },
  {
    id: 'water',
    name: 'जल प्रदाय शाखा (Water Supply & Drainage)',
    officer: 'श्री राजेंद्र जोशी (सहायक अभियंता जल)',
    phone: '01472-241246 Ext. 103',
    mobile: '98290-44103',
    color: '#0284c7',
    bg: '#f0f9ff',
    icon: '🚰',
    matchCats: ['जल', 'पानी', 'पाइपलाइन', 'Water'],
    scope: 'पेयजल आपूर्ति लाइन लीकेज मरम्मत, प्रेशर जांच, दूषित जल निवारण एवं मुख्य वाल्व संचालन।'
  },
  {
    id: 'civil',
    name: 'निर्माण एवं सड़क अनुभाग (Engineering & Roads)',
    officer: 'श्री मोहन लाल खटीक (अधिशासी अभियंता)',
    phone: '01472-241246 Ext. 102',
    mobile: '98290-44102',
    color: '#2563eb',
    bg: '#eff6ff',
    icon: '🛣️',
    matchCats: ['सड़क', 'गड्ढा', 'पुलिया', 'Road', 'Pothole'],
    scope: 'डामर सड़क गड्ढा पैचवर्क, सीसी रोड मरम्मत, पुलिया सुरक्षा दीवार, नाली स्लैब व इंटरलॉकिंग कार्य।'
  },
  {
    id: 'garden',
    name: 'उद्यान एवं पर्यावरण विकास (Parks & Greenery)',
    officer: 'श्री श्याम सुंदर (उद्यान अधीक्षक)',
    phone: '01472-241246 Ext. 105',
    mobile: '98290-44105',
    color: '#65a30d',
    bg: '#f7fee7',
    icon: '🌳',
    matchCats: ['पार्क', 'उद्यान', 'झाड़ियां', 'Park'],
    scope: 'वार्ड के सार्वजनिक पार्कों का रखरखाव, सूखी झाड़ियां व खरपतवार कटाई, वृक्षारोपण एवं सिंचाई।'
  },
];

export default function ParshadDepartmentsPage() {
  const [complaintsList, setComplaintsList] = useState([]);

  useEffect(() => {
    function load(data) {
      setComplaintsList(data || []);
    }
    load(getSharedLiveComplaints(59));
    fetchSharedLiveComplaints(59).then(fresh => {
      if (fresh) load(fresh);
    });
    const unsubscribe = subscribeToLiveComplaints((all) => {
      const cleanW = '59';
      const filtered = (all || []).filter(c => String(c.ward || c.wardNumber || '').replace(/\D/g, '') === cleanW);
      load(filtered);
    });
    return () => unsubscribe();
  }, []);

  const total = complaintsList.length;
  const resolved = complaintsList.filter(c => ['resolved', 'closed'].includes(c.status)).length;
  const pending = total - resolved;

  return (
    <DashboardShell requiredRole="parshad">
      {/* 1. Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '16px 20px',
        marginBottom: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Building2 size={16} color="#7c3aed" />
              <span style={{ color: '#7c3aed', fontWeight: 800, fontSize: '0.85rem' }}>
                नगर परिषद चित्तौड़गढ़ • वार्ड 59 समन्वय
              </span>
            </div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 2, fontWeight: 800 }}>
              नगर परिषद विभाग व संपर्क सूत्र
            </h1>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
              वार्ड 59 समस्याओं के त्वरित समाधान हेतु 5 प्रमुख शाखाओं के प्रभारी अधिकारी व दूरभाष संपर्क
            </p>
          </div>
          <span className="badge badge-parshad" style={{ fontSize: '0.78rem', padding: '5px 14px' }}>
            5 नगर परिषद शाखाएं
          </span>
        </div>
      </div>

      {/* 2. Department Summary KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 18 }}>
        <div className="card" style={{ padding: '16px 14px', textAlign: 'center', borderTop: '4px solid #1e3a8a', borderRadius: 12 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, marginTop: 6 }}>कुल वार्ड शिकायतें</div>
        </div>
        <div className="card" style={{ padding: '16px 14px', textAlign: 'center', borderTop: '4px solid #d97706', borderRadius: 12 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', lineHeight: 1 }}>{pending}</div>
          <div style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 700, marginTop: 6 }}>निस्तारण लंबित</div>
        </div>
        <div className="card" style={{ padding: '16px 14px', textAlign: 'center', borderTop: '4px solid #16a34a', borderRadius: 12 }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a', lineHeight: 1 }}>{resolved}</div>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginTop: 6 }}>समाधान पूर्ण</div>
        </div>
      </div>

      {/* 3. Departments Directory List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {DEPARTMENTS.map(dept => {
          const deptComplaints = complaintsList.filter(c => {
            const cat = (c.category || '') + (c.dept || '');
            return dept.matchCats.some(m => cat.includes(m));
          });
          const deptRes = deptComplaints.filter(c => ['resolved', 'closed'].includes(c.status)).length;
          const deptPend = deptComplaints.length - deptRes;

          return (
            <div
              key={dept.id}
              className="card"
              style={{
                padding: '18px 20px',
                border: '1px solid #e2e8f0',
                borderLeft: `5px solid ${dept.color}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                borderRadius: 12,
              }}
            >
              {/* Top Row: Icon + Name + Pending Badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: dept.bg,
                    border: `1.5px solid ${dept.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem',
                    flexShrink: 0
                  }}>
                    {dept.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {dept.name}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: 3, fontWeight: 600 }}>
                      प्रभारी अधिकारी: <strong style={{ color: '#1e3a8a' }}>{dept.officer}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '3px 11px',
                    borderRadius: 9999,
                    background: deptPend > 0 ? '#fffbeb' : '#dcfce7',
                    color: deptPend > 0 ? '#b45309' : '#15803d',
                    border: `1px solid ${deptPend > 0 ? '#fde68a' : '#86efac'}`,
                  }}>
                    {deptPend > 0 ? `${deptPend} लंबित` : 'सभी निस्तारित ✓'}
                  </span>
                </div>
              </div>

              {/* Department scope */}
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                {dept.scope}
              </p>

              {/* Stats Bar (No SLA) */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 8,
                padding: '9px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 14,
                fontSize: '0.8rem',
                border: '1px solid #f1f5f9'
              }}>
                <div>वार्ड 59 प्रकरण: <strong style={{ color: '#1e3a8a' }}>{deptComplaints.length}</strong></div>
                <div>निस्तारण लंबित: <strong style={{ color: deptPend > 0 ? '#d97706' : '#64748b' }}>{deptPend}</strong></div>
                <div>समाधान पूर्ण: <strong style={{ color: '#16a34a' }}>{deptRes}</strong></div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <a
                    href={`tel:${dept.phone}`}
                    style={{
                      background: '#1e3a8a',
                      color: '#ffffff',
                      padding: '7px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      borderRadius: 8,
                      boxShadow: '0 1px 2px rgba(30,58,138,0.2)'
                    }}
                  >
                    <Phone size={13} />
                    <span>कंट्रोल रूम: {dept.phone}</span>
                  </a>

                  <a
                    href={`tel:${dept.mobile}`}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      padding: '7px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      borderRadius: 8,
                      boxShadow: '0 1px 2px rgba(22,163,74,0.2)'
                    }}
                  >
                    <PhoneCall size={13} />
                    <span>अधिकारी मोबाइल: {dept.mobile}</span>
                  </a>
                </div>

                <Link
                  href={`/parshad/complaints?dept=${dept.id}`}
                  style={{
                    fontSize: '0.8rem',
                    color: '#0284c7',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3
                  }}
                >
                  वार्ड 59 शिकायतें देखें <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
