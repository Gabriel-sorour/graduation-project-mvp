import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Heart, Leaf, ShieldCheck, Users, ArrowRight, Code, Database } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './About.css';

const About = () => {
  const { language } = useLanguage();

  const t = {
    heroTitle: language === 'ar' ? 'مرحباً بك في شيف ساج' : 'Welcome to Chef Sage',
    heroSubtitle: language === 'ar'
      ? 'رفيقك الذكي لتقليل هدر الطعام واكتشاف وصفات لذيذة بما لديك.'
      : 'Your smart companion to reduce food waste and discover delicious recipes with what you have.',

    missionTitle: language === 'ar' ? 'مهمتنا' : 'Our Mission',
    missionText: language === 'ar'
      ? 'في شيف ساج، نؤمن بأن الطبخ يجب أن يكون سهلاً ومستداماً. هدفنا هو مساعدتك في إدارة مخزون منزلك بذكاء، وتقليل هدر الطعام من خلال اقتراح وصفات مبتكرة تعتمد على المكونات المتوفرة لديك بالفعل.'
      : 'At Chef Sage, we believe cooking should be effortless and sustainable. Our goal is to help you manage your pantry smartly and reduce food waste by suggesting creative recipes based on ingredients you already have.',

    values: [
      {
        icon: <Leaf size={28} />,
        title: language === 'ar' ? 'الاستدامة' : 'Sustainability',
        desc: language === 'ar' ? 'تقليل هدر الطعام من خلال استغلال كل مكون في مطبخك.' : 'Reducing food waste by making the most of every ingredient in your kitchen.'
      },
      {
        icon: <ChefHat size={28} />,
        title: language === 'ar' ? 'الإبداع' : 'Creativity',
        desc: language === 'ar' ? 'اكتشاف وصفات جديدة من مكونات بسيطة ومعتادة.' : 'Discovering new recipes from simple, everyday ingredients.'
      },
      {
        icon: <ShieldCheck size={28} />,
        title: language === 'ar' ? 'الجودة' : 'Quality',
        desc: language === 'ar' ? 'تقديم وصفات موثوقة ومجربة لتجربة طهي ممتعة.' : 'Providing reliable and tested recipes for an enjoyable cooking experience.'
      }
    ],

    teamTitle: language === 'ar' ? 'فريق العمل' : 'The Team',
    teamText: language === 'ar'
      ? 'تم تطوير هذا المشروع بشغف كجزء من مشروع التخرج، لتقديم حل تقني يخدم المجتمع ويسهل حياة الناس اليومية.'
      : 'This project was passionately developed as a graduation project, aiming to provide a technical solution that serves the community and simplifies daily life.',

    teamMembers: [
      {
        name: language === 'ar' ? 'جبريل سرور' : 'Gabriel Sorour',
        role: language === 'ar' ? 'Frontend Developer' : 'Frontend Developer',
        icon: <Code size={20} />,
        imgSrc: 'g.jpeg'
      },
      {
        name: language === 'ar' ? 'محمد سامي' : 'Mohamed Sami',
        role: language === 'ar' ? 'Backend Developer' : 'Backend Developer',
        icon: <Database size={20} />,
        imgSrc: 'm.jpeg'
      }
    ],

    ctaTitle: language === 'ar' ? 'جاهز للبدء؟' : 'Ready to Start?',
    ctaText: language === 'ar' ? 'انضم إلينا الآن وابدأ رحلة طهي أكثر ذكاءً.' : 'Join us now and start a smarter cooking journey.',
    ctaButton: language === 'ar' ? 'استكشف الوصفات' : 'Explore Recipes',
  };

  return (
    <div className="about-page-wrapper" dir={language === 'ar' ? 'rtl' : 'ltr'}>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg-pattern"></div>
        <div className="about-container">
          <div className="about-icon-circle">
            <ChefHat size={32} />
          </div>
          <h1 className="about-hero-title">{t.heroTitle}</h1>
          <p className="about-hero-subtitle">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission-section">
        <div className="about-container">
          <div className="about-mission-card">
            <div className="about-mission-image">
              <img
                src="aboutus.avif"
                alt="Cooking Mission"
              // onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'}
              />
              <div className="about-mission-overlay"></div>
            </div>
            <div className="about-mission-content">
              <h2 className="about-section-title">
                <Heart className="text-red-500" size={28} fill="currentColor" />
                {t.missionTitle}
              </h2>
              <p className="about-text">{t.missionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values-section">
        <div className="about-container">
          <div className="about-values-grid">
            {t.values.map((item, index) => (
              <div key={index} className="about-value-card">
                <div className="about-value-icon">
                  {item.icon}
                </div>
                <h3 className="about-value-title">{item.title}</h3>
                <p className="about-text">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team & CTA Section */}
      <section className="about-cta-section">
        <div className="about-container">

          {/* Team Intro */}
          <div style={{ marginBottom: '60px' }}>
            <div className="about-icon-circle" style={{ backgroundColor: 'var(--sage-50)', color: '#3b82f6' }}>
              <Users size={28} />
            </div>
            <h2 className="about-section-title" style={{ justifyContent: 'center' }}>{t.teamTitle}</h2>
            <p className="about-text" style={{ maxWidth: '700px', margin: '0 auto', marginBottom: '40px' }}>
              {t.teamText}
            </p>

            {/* Team Members Grid */}
            <div className="about-team-grid">
              {t.teamMembers.map((member, index) => (
                <div key={index} className="about-team-card">
                  <div className="about-team-img-wrapper">
                    {member.imgSrc ? (
                      <img src={member.imgSrc} alt={member.name} className="about-team-img" />
                    ) : (
                      <div className="about-team-placeholder">{member.name.charAt(0)}</div>
                    )}
                  </div>
                  <h3 className="about-team-name">{member.name}</h3>
                  <div className="about-team-role">
                    {member.icon}
                    <span>{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Card */}
          <div className="about-cta-card">
            <div className="about-decoration about-dec-1"></div>
            <div className="about-decoration about-dec-2"></div>

            <div className="about-cta-content">
              <h2 className="about-section-title" style={{ justifyContent: 'center', color: 'white' }}>
                {t.ctaTitle}
              </h2>
              <p className="about-cta-text">{t.ctaText}</p>
              <Link to="/explore" className="about-cta-btn">
                {t.ctaButton}
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;