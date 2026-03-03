import React from 'react';
import { useNavigate } from 'react-router-dom';

const RequestsHistory = () => {
    const navigate = useNavigate();

    // Dummy sent requests (matching Profile.jsx)
    const allRequests = [
        { id: 1, provider: 'Mr. Rajesh Kumar', role: 'Civil Contractor', date: '02 Mar 2026', status: 'Pending', price: '₹1,500/day' },
        { id: 2, provider: 'Amit Sharma', role: 'Plumber', date: '28 Feb 2026', status: 'Accepted', price: '₹600/visit' },
        { id: 3, provider: 'Suresh Patil', role: 'Interior Contractor', date: '25 Feb 2026', status: 'Rejected', price: '₹900/day' },
        { id: 4, provider: 'Anjali Mehta', role: 'Civil Engineer', date: '20 Feb 2026', status: 'Accepted', price: '₹2,500/visit' },
    ];

    return (
        <div style={{ paddingBottom: 20 }}>
            <header style={{
                padding: '16px 20px 24px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                borderRadius: '0 0 32px 32px',
                boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)',
                display: 'flex', alignItems: 'center', gap: 16,
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: '40px', height: '40px', borderRadius: '12px', color: '#fff', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    ‹
                </button>
                <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '800', color: '#fff', margin: 0 }}>
                    Request History
                </h1>
            </header>

            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {allRequests.map(req => (
                    <div key={req.id} style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '18px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                        border: '1px solid #F3F4FB',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                                {req.role.includes('Civil') ? '🏗️' : '🔧'}
                            </div>
                            <div>
                                <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '700', color: '#1F2937', margin: '0 0 4px 0' }}>{req.provider}</h4>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#6B7280', margin: 0 }}>{req.date} · {req.role}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                display: 'inline-block', padding: '4px 12px', borderRadius: '8px',
                                background: req.status === 'Accepted' ? '#DCFCE7' : req.status === 'Rejected' ? '#FEE2E2' : '#FEF9C3',
                                color: req.status === 'Accepted' ? '#166534' : req.status === 'Rejected' ? '#991B1B' : '#854D0E',
                                fontSize: '11px', fontWeight: '800', marginBottom: 6
                            }}>
                                {req.status}
                            </span>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '800', color: '#1F2937', margin: 0 }}>{req.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RequestsHistory;
