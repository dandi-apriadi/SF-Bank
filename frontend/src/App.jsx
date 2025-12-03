import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider dari react-redux
import { store } from './store/index.js';
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

const App = () => {
  return (
    // Bungkus aplikasi dengan Provider dan berikan store Redux
    <Provider store={store}>
      <div className="relative">
        <Routes>
          <Route path="auth/*" element={<AuthLayout />} />
          <Route path="admin/*" element={<AdminLayout />} />
          <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
        </Routes>
      </div>
    </Provider>
  );
};

export default App;

