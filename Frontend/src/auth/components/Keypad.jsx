import React from 'react';

// Keypad — exact layout from design images
// Grid: [1,2,3], [4,5,6], [7,8,9], [blank, 0, ✕]
// Each button: Playfair Display 34px, generous vertical padding
// Delete: red ✕ SVG

const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'];

const Keypad = ({ onNumberPress, onDeletePress }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            width: '100%',
            padding: '10px 0'
        }}>
            {keys.map((key, i) => {
                if (key === null) return <div key={i} />;

                const isDel = key === 'del';

                return (
                    <button
                        key={i}
                        onClick={() => isDel ? onDeletePress() : onNumberPress(key.toString())}
                        style={{
                            background: '#fff',
                            border: 'none',
                            borderRadius: '16px',
                            height: '54px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '22px',
                            fontWeight: '600',
                            color: '#111827',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                            cursor: 'pointer',
                            WebkitTapHighlightColor: 'transparent',
                            transition: 'all 0.1s',
                            userSelect: 'none'
                        }}
                        onPointerDown={e => {
                            e.currentTarget.style.transform = 'scale(0.95)';
                            e.currentTarget.style.background = '#f9fafb';
                        }}
                        onPointerUp={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.background = '#fff';
                        }}
                        onPointerLeave={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.background = '#fff';
                        }}
                    >
                        {isDel ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                                <line x1="18" y1="9" x2="12" y2="15" />
                                <line x1="12" y1="9" x2="18" y2="15" />
                            </svg>
                        ) : key}
                    </button>
                );
            })}
        </div>
    );
};

export default Keypad;
