import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHiringHistory, getOrders, updateLeadStatus } from '../../../api/userApi';
import { ArrowLeft, Package, User, Clock, ChevronRight } from 'lucide-react';

const RequestsHistory = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedReq, setSelectedReq] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const [leadsData, ordersData] = await Promise.all([
                getHiringHistory(),
                getOrders()
            ]);
            setLeads(leadsData);
            setOrders(ordersData);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedReq || updating) return;
        setUpdating(true);
        try {
            await updateLeadStatus(selectedReq.id, { status: newStatus.toLowerCase() });
            setShowStatusModal(false);
            fetchHistory();
        } catch (err) {
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const allRequests = useMemo(() => {
        const materialRequests = orders.map(m => ({
            id: m._id,
            provider: m.brand,
            role: `Material: ${m.materialName}`,
            date: new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: m.status.charAt(0).toUpperCase() + m.status.slice(1),
            price: `₹${m.totalPrice}`,
            isMaterial: true
        }));

        const providerRequests = leads.map(lead => ({
            id: lead._id,
            provider: lead.providerId?.fullName || lead.serviceType,
            role: lead.serviceType,
            date: new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: lead.status.charAt(0).toUpperCase() + lead.status.slice(1),
            price: lead.budget || 'Negotiable',
            isMaterial: false,
            rawDate: lead.createdAt
        }));

        return [...providerRequests].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
    }, [leads, orders]);

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
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Loading requests...</div>
                ) : allRequests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>No requests found</div>
                ) : allRequests.map(req => (
                    <div key={req.id} 
                        onClick={() => {
                            if (req.status === 'Accepted' && !req.isMaterial) {
                                setSelectedReq(req);
                                setShowStatusModal(true);
                            }
                        }}
                        style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '18px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                        border: '1px solid #F3F4FB',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: (req.status === 'Accepted' && !req.isMaterial) ? 'pointer' : 'default'
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
                                background: req.status === 'Accepted' ? '#DCFCE7' : req.status === 'Rejected' ? '#FEE2E2' : req.status === 'Completed' ? '#E0F2FE' : '#FEF9C3',
                                color: req.status === 'Accepted' ? '#166534' : req.status === 'Rejected' ? '#991B1B' : req.status === 'Completed' ? '#0369A1' : '#854D0E',
                                fontSize: '12px', fontWeight: '900', marginBottom: 8
                            }}>
                                {req.status}
                            </span>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: '900', color: '#1E293B', margin: 0 }}>{req.price}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowStatusModal(false)}>
                    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', width: '100%', borderRadius: '32px 32px 0 0', padding: '32px 24px', animation: 'slideUp 0.3s ease-out' }}>
                        <div style={{ width: '40px', height: '4px', background: '#E5E7EB', borderRadius: '2px', margin: '0 auto 24px' }} />
                        
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '20px', fontWeight: '900', color: '#111827', marginBottom: 8, textAlign: 'center' }}>Update Request Status</h3>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6B7280', marginBottom: 32, textAlign: 'center' }}>Mark your service with {selectedReq?.provider} as completed or pending.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <button
                                onClick={() => handleStatusUpdate('Completed')}
                                disabled={updating}
                                style={{
                                    width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                                    background: '#10B981', color: '#fff', fontSize: '15px', fontWeight: '800', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                {updating ? 'Updating...' : 'Completed'}
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('Pending')}
                                disabled={updating}
                                style={{
                                    width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #E5E7EB',
                                    background: '#fff', color: '#6B7280', fontSize: '15px', fontWeight: '800', cursor: 'pointer'
                                }}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => setShowStatusModal(false)}
                                style={{
                                    width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                                    background: 'none', color: '#9CA3AF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: 8
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestsHistory;
