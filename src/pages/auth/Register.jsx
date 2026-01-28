import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react'; 
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();
  const { language } = useLanguage();

  const t = {
    title: language === 'ar' ? 'إنشاء حساب جديد' : 'Create Account',
    subtitle: language === 'ar' ? 'انضم إلى شيف ساج وابدأ الطهي!' : 'Join SageKitchen and start cooking!',
    nameLabel: language === 'ar' ? 'الاسم بالكامل' : 'Full Name',
    namePlaceholder: language === 'ar' ? 'مثال: أحمد علي' : 'e.g. Ahmed Ali',
    emailLabel: language === 'ar' ? 'البريد الإلكتروني' : 'Email Address',
    emailPlaceholder: language === 'ar' ? 'name@example.com' : 'name@example.com',
    passLabel: language === 'ar' ? 'كلمة المرور' : 'Password',
    passPlaceholder: language === 'ar' ? 'أنشئ كلمة مرور قوية' : 'Create a strong password',
    confirmPassLabel: language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password',
    confirmPassPlaceholder: language === 'ar' ? 'أعد كتابة كلمة المرور' : 'Repeat your password',
    btn: language === 'ar' ? 'إنشاء حساب' : 'Sign Up',
    btnLoading: language === 'ar' ? 'جاري الإنشاء...' : 'Creating Account...',
    footerText: language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?',
    signin: language === 'ar' ? 'تسجيل الدخول' : 'Sign In',
    errorMatch: language === 'ar' ? 'كلمات المرور غير متطابقة!' : 'Passwords do not match!',
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError(t.errorMatch);
      return;
    }

    setIsSubmitting(true);


    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.password_confirmation
    );

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  // 4. ستايل الزرار (ديناميكي حسب اللغة)
  const toggleButtonStyle = {
    position: 'absolute',
    right: language === 'ar' ? 'auto' : '10px',
    left: language === 'ar' ? '10px' : 'auto',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280'
  };

  // 5. ستايل الـ Input (ديناميكي حسب اللغة)
  const inputStyle = {
    paddingRight: language === 'ar' ? '12px' : '40px',
    paddingLeft: language === 'ar' ? '40px' : '12px'
  };

  return (
    // 6. ضبط الاتجاه RTL/LTR
    <div className="auth-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="auth-card">
        <div className="auth-header">
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>{t.nameLabel}</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder={t.namePlaceholder}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label>{t.emailLabel}</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder={t.emailPlaceholder}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label>{t.passLabel}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-input"
                placeholder={t.passPlaceholder}
                value={formData.password}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={toggleButtonStyle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label>{t.confirmPassLabel}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirmation"
                className="form-input"
                placeholder={t.confirmPassPlaceholder}
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={toggleButtonStyle}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={isSubmitting}>
            {isSubmitting ? t.btnLoading : t.btn}
          </button>
        </form>

        <div className="auth-footer">
          {t.footerText}{' '}
          <Link to="/login" className="auth-link">{t.signin}</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;