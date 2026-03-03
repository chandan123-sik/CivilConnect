import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GetStarted from '../auth/GetStarted';
import MobileInput from '../auth/MobileInput';
import OTPVerification from '../auth/OTPVerification';

const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route path="/auth/mobile-input" element={<MobileInput />} />
            <Route path="/auth/otp-verify" element={<OTPVerification />} />
            <Route path="*" element={<GetStarted />} />
        </Routes>
    );
};

export default AuthRoutes;
