import React from 'react';
import { useNavigate } from 'react-router-dom';

const RequestsHistory = () => {
    const navigate = useNavigate();

    // Load real material requests from localStorage
    const materialRequests = React.useMemo(() => {
        try {
            const saved = localStorage.getItem('cc_material_orders');
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed.map(m => ({
                id: m.id,
                provider: m.brand,
                role: `Material: ${m.materialName}`,
                date: new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: m.status.charAt(0).toUpperCase() + m.status.slice(1),
                price: `₹${m.totalPrice}`,
                isMaterial: true
            })) : [];
        } catch (e) {
            return [];
        }
    }, []);

    // Load real service requests from localStorage
    const providerRequests = React.useMemo(() => {
        try {
            const clientName = localStorage.getItem('user_name') || 'Guest User';
            const savedLeads = JSON.parse(localStorage.getItem('cc_leads') || '[]');

            const realLeads = savedLeads.filter(lead => lead.client === clientName).map(lead => ({
                id: lead.id,
                provider: lead.providerName || lead.service,
                role: lead.service,
                date: lead.date,
                status: lead.status.charAt(0).toUpperCase() + lead.status.slice(1),
                price: lead.price || 'Negotiable',
                isMaterial: false
            }));

            // Initial Mock if truly empty
            if (realLeads.length === 0 && materialRequests.length === 0) {
                return [
                    { id: 'p1', provider: 'Mr. Rajesh Kumar', role: 'Civil Contractor', date: '02 Mar 2026', status: 'Pending', price: '₹1,500/day', isMaterial: false },
                    { id: 'p2', provider: 'Amit Sharma', role: 'Plumber', date: '28 Feb 2026', status: 'Accepted', price: '₹600/visit', isMaterial: false },
                ];
            }
            return realLeads;
        } catch (e) {
            return [];
        }
    }, [materialRequests]);

    const allRequests = [...materialRequests, ...providerRequests];

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
                        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '16px',
                                background: req.isMaterial ? '#ECFDF5' : '#F5F3FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                flexShrink: 0,
                                border: `1px solid ${req.isMaterial ? '#D1FAE5' : '#EDE9FE'}`
                            }}>
                                {req.isMaterial ? '🏗️' : (req.role.includes('Civil') ? '👷' : '🔧')}
                            </div>
                            <div>
                                <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '17px', fontWeight: '800', color: '#1E293B', margin: '0 0 6px 0' }}>{req.provider}</h4>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#64748B', margin: 0, fontWeight: '500' }}>{req.date} · {req.role}</p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                display: 'inline-block', padding: '5px 12px', borderRadius: '10px',
                                background: req.status === 'Accepted' ? '#DCFCE7' : req.status === 'Rejected' ? '#FEE2E2' : '#FEF9C3',
                                color: req.status === 'Accepted' ? '#166534' : req.status === 'Rejected' ? '#991B1B' : '#854D0E',
                                fontSize: '12px', fontWeight: '900', marginBottom: 8
                            }}>
                                {req.status}
                            </span>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '900', color: '#1E293B', margin: 0 }}>{req.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RequestsHistory;
