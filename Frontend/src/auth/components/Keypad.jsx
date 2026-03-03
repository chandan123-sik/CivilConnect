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
            width: '100%',
        }}>
            {keys.map((key, i) => {
                // ── Empty cell (bottom-left) ──
                if (key === null) {
                    return <div key={i} />;
                }

                // ── Delete / ✕ button ──
                if (key === 'del') {
                    return (
                        <button
                            key={i}
                            onClick={onDeletePress}
                            aria-label="Delete"
                            style={{
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px 0',
                                cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#EF4444"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ width: 30, height: 30 }}
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    );
                }

                // ── Number button ──
                return (
                    <button
                        key={i}
                        onClick={() => onNumberPress(key.toString())}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 34,
                            fontWeight: 400,
                            color: '#111827',
                            padding: '14px 0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            userSelect: 'none',
                            WebkitTapHighlightColor: 'transparent',
                            transition: 'opacity 0.1s, transform 0.1s',
                        }}
                        onPointerDown={e => {
                            e.currentTarget.style.opacity = '0.5';
                            e.currentTarget.style.transform = 'scale(0.88)';
                        }}
                        onPointerUp={e => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        onPointerLeave={e => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        {key}
                    </button>
                );
            })}
        </div>
    );
};

export default Keypad;
