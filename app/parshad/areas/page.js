'use client';

import DashboardShell from '@/components/DashboardShell';
import { useAuth } from '@/lib/authContext';
import {
  MapPin, CheckCircle, Clock,
  ArrowRight, ShieldCheck, Phone, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const WARD_AREAS = [
  {
    id: 1,
    name: 'किला ढलान एवं मुख्य प्रवेश मार्ग',
    type: 'ऐतिहासिक धरोहर एवं पर्यटन संपर्क मार्ग',
    assignedWorkers: ['किशन लाल (सफाई जमादार)', 'सुरेश कुमार (स्वच्छता कर्मी)'],
    workersPhone: '98290-44101',
    cleanSchedule: 'प्रातः 06:30 AM एवं दोपहर 02:00 PM (दैनिक 2 बार)',
    activeComplaints: 0,
    status: 'सफाई पूर्ण ✓',
  },
  {
    id: 2,
    name: 'मीरा मार्ग एवं मंदिर परिसर क्षेत्र',
    type: 'धार्मिक एवं आवासीय क्षेत्र (Residential Zone)',
    assignedWorkers: ['राजू लाल (स्वच्छता कर्मी)'],
    workersPhone: '98290-44101',
    cleanSchedule: 'प्रातः 07:00 AM से 11:30 AM',
    activeComplaints: 0,
    status: 'सफाई पूर्ण ✓',
  },
  {
    id: 3,
    name: 'गांधी चौक एवं मुख्य बाजार तिराहा',
    type: 'व्यापारिक व व्यावसायिक क्षेत्र (Commercial Area)',
    assignedWorkers: ['किशन लाल (सफाई जमादार)', 'दिनेश मेघवाल (स्वच्छता कर्मी)'],
    workersPhone: '98290-44101',
    cleanSchedule: 'प्रातः 07:00 AM व सायंकाल 04:30 PM (कचरा टिपर वाहन)',
    activeComplaints: 0,
    status: 'सफाई पूर्ण ✓',
  },
  {
    id: 4,
    name: 'भोई मोहल्ला एवं आंतरिक गलियां',
    type: 'सघन आवासीय क्षेत्र (High Density Housing)',
    assignedWorkers: ['शांति लाल (नाली सफाई दल)'],
    workersPhone: '98290-44101',
    cleanSchedule: 'दैनिक डीसिल्टिंग व चूना छिड़काव',
    activeComplaints: 0,
    status: 'सफाई पूर्ण ✓',
  },
  {
    id: 5,
    name: 'स्टेशन संपर्क मार्ग एवं तिराहा',
    type: 'मुख्य आवागमन संपर्क मार्ग (Transit Route)',
    assignedWorkers: ['मुकेश टेलर सहायक (विद्युत)', 'किशन लाल (जमादार)'],
    workersPhone: '98290-44104',
    cleanSchedule: 'प्रातः 07:30 AM स्ट्रीट लाइट व सफाई निरीक्षण',
    activeComplaints: 0,
    status: 'स्ट्रीट लाइट व मार्ग सत्यापित ✓',
  },
];

export default function ParshadAreasPage() {
  const { profile } = useAuth();

  return (
    <DashboardShell requiredRole="parshad">
      {/* Header */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '16px 20px',
        marginBottom: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: '#1e3a8a', marginBottom: 2, fontWeight: 800 }}>
              वार्ड 59 — प्रमुख क्षेत्र एवं मोहल्ले
            </h1>
            <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0 }}>
              वार्ड 59 के 5 प्रमुख क्षेत्रों में स्वच्छता कार्यक्रम व बीट स्टाफ विवरण
            </p>
          </div>
          <span className="badge badge-parshad" style={{ fontSize: '0.78rem', padding: '5px 14px' }}>
            5 प्रमुख बीट क्षेत्र
          </span>
        </div>
      </div>

      {/* Areas Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {WARD_AREAS.map(area => (
          <div
            key={area.id}
            className="card"
            style={{
              padding: '16px 20px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#f3e8ff',
                  color: '#7c3aed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e9d5ff'
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                    {area.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {area.type}
                  </div>
                </div>
              </div>

              <span style={{
                background: '#f0fdf4',
                color: '#15803d',
                padding: '4px 10px',
                borderRadius: 9999,
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid #bbf7d0'
              }}>
                {area.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, background: '#f8fafc', padding: '12px 14px', borderRadius: 8, fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>बीट फील्ड टीम:</span>
                <div style={{ fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
                  {area.assignedWorkers.join(', ')}
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b' }}>सफाई समय-सारिणी:</span>
                <div style={{ fontWeight: 600, color: '#1e3a8a', marginTop: 2 }}>
                  {area.cleanSchedule}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: '#64748b' }}>सक्रिय शिकायतें:</span>
                  <div style={{ fontWeight: 800, color: area.activeComplaints > 0 ? '#d97706' : '#16a34a', marginTop: 2 }}>
                    {area.activeComplaints} शिकायत
                  </div>
                </div>

                <a
                  href={`tel:${area.workersPhone}`}
                  className="btn btn-sm"
                  style={{
                    background: '#15803d',
                    color: '#ffffff',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Phone size={12} /> बीट प्रभारी कॉल
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
