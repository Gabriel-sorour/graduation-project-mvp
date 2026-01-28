import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();

  const t = {
    title: language === 'ar' ? 'مرحباً بعودتك' : 'Welcome Back',
    subtitle: language === 'ar' ? 'يرجى إدخال بياناتك لتسجيل الدخول.' : 'Please enter your details to sign in.',
    emailLabel: language === 'ar' ? 'البريد الإلكتروني' : 'Email Address',
    emailPlaceholder: language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email',
    passLabel: language === 'ar' ? 'كلمة المرور' : 'Password',
    passPlaceholder: language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password',
    btn: language === 'ar' ? 'تسجيل الدخول' : 'Sign In',
    btnLoading: language === 'ar' ? 'جاري الدخول...' : 'Signing in...',
    footerText: language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?",
    signup: language === 'ar' ? 'إنشاء حساب' : 'Sign up',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    // 4. ضبط الاتجاه
    <div className="auth-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.emailLabel}</label>
            <input
              type="email"
              className="form-input"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>{t.passLabel}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder={t.passPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                // 5. ضبط مكان البادينج حسب اللغة عشان الكلام ما يجيش فوق الأيقونة
                style={{ 
                  paddingRight: language === 'ar' ? '12px' : '40px',
                  paddingLeft: language === 'ar' ? '40px' : '12px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: language === 'ar' ? 'auto' : '10px',
                  left: language === 'ar' ? '10px' : 'auto',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={isSubmitting}>
            {isSubmitting ? t.btnLoading : t.btn}
          </button>
        </form>

        <div className="auth-footer">
          {t.footerText}{' '}
          <Link to="/register" className="auth-link">{t.signup}</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;