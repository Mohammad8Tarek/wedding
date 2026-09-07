'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, MapPin, Calendar, Check, ArrowRight } from 'lucide-react';

// ==================== TYPES ====================
type Language = 'en' | 'ar';

interface Translations {
  en: Record<string, string>;
  ar: Record<string, string>;
}

interface RSVPData {
  name: string;
  attendance: 'yes' | 'no';
  guests: number;
  wishes: string;
}

// ==================== TRANSLATION DICTIONARY ====================
const translations: Translations = {
  en: {
    sealText: 'OPEN',
    heroMain: 'The Wedding of',
    heroSubtitle: 'Together, Forever',
    heroDate: 'Saturday, June 15th, 2024',
    countdownDays: 'Days',
    countdownHours: 'Hours',
    countdownMinutes: 'Minutes',
    countdownSeconds: 'Seconds',
    timelineReception: 'Reception',
    timelineReceptionTime: '5:00 PM - 7:00 PM',
    timelineCeremony: 'Ceremony',
    timelineCeremonyTime: '7:00 PM - 8:00 PM',
    timelineDinner: 'Dinner',
    timelineDinnerTime: '8:00 PM - 11:00 PM',
    venueTitle: 'Venue',
    venueAddress: 'Grand Ballroom, 123 Luxury Avenue\nNew York, NY 10001',
    rsvpTitle: 'RSVP',
    rsvpName: 'Your Name',
    rsvpAttendance: 'Will you join us?',
    rsvpYes: 'Yes, I will attend',
    rsvpNo: 'Sorry, I cannot attend',
    rsvpGuests: 'Number of guests',
    rsvpWishes: 'Your wishes and blessings',
    rsvpSubmit: 'Send RSVP',
    rsvpThanks: 'Thank you for your response!',
    rsvpThanksSub: 'We look forward to celebrating with you.',
    calendarAdd: '+ Add to Calendar',
    openMaps: 'Open in Maps',
    exploreVenue: 'Explore Venue',
  },
  ar: {
    sealText: 'افتح',
    heroMain: 'حفل زفاف',
    heroSubtitle: 'معاً، للأبد',
    heroDate: 'السبت، 15 يونيو 2024',
    countdownDays: 'أيام',
    countdownHours: 'ساعات',
    countdownMinutes: 'دقائق',
    countdownSeconds: 'ثوان',
    timelineReception: 'الاستقبال',
    timelineReceptionTime: '5:00 PM - 7:00 PM',
    timelineCeremony: 'الحفل',
    timelineCeremonyTime: '7:00 PM - 8:00 PM',
    timelineDinner: 'العشاء',
    timelineDinnerTime: '8:00 PM - 11:00 PM',
    venueTitle: 'المكان',
    venueAddress: 'القاعة الكبرى، 123 شارع الفخامة\nنيويورك، NY 10001',
    rsvpTitle: 'تأكيد الحضور',
    rsvpName: 'اسمك الكامل',
    rsvpAttendance: 'هل ستحضر معنا؟',
    rsvpYes: 'نعم، سأكون حاضراً',
    rsvpNo: 'للأسف، لا أستطيع الحضور',
    rsvpGuests: 'عدد الضيوف',
    rsvpWishes: 'أمنياتك وبركاتك',
    rsvpSubmit: 'إرسال تأكيد',
    rsvpThanks: 'شكراً لتأكيدك!',
    rsvpThanksSub: 'نتطلع للاحتفال معك.',
    calendarAdd: '+ إضافة للتقويم',
    openMaps: 'فتح في الخريطة',
    exploreVenue: 'اكتشف المكان',
  },
};

// ==================== CUSTOM HOOKS ====================
const useLanguage = (): Language => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    const detectedLanguage: Language = browserLang === 'ar' ? 'ar' : 'en';
    setLanguage(detectedLanguage);
    document.documentElement.dir = detectedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = detectedLanguage;
  }, []);

  return language;
};

const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// ==================== COMPONENTS ====================

// Wax Seal Component
const WaxSeal: React.FC<{ onClick: () => void; text: string; isArabic: boolean }> = ({
  onClick,
  text,
  isArabic,
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative cursor-pointer"
      style={{
        width: '120px',
        height: '120px',
      }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent)',
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main seal */}
      <div
        className="absolute inset-0 rounded-full flex items-center justify-center font-bold text-white"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #e84c3d, #c92f24)',
          boxShadow: `
            inset -2px -2px 4px rgba(0, 0, 0, 0.3),
            inset 2px 2px 4px rgba(255, 255, 255, 0.2),
            0 4px 12px rgba(139, 29, 20, 0.4)
          `,
        }}
      >
        {/* Inner seal detail */}
        <div
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{
            border: '2px solid rgba(255, 255, 255, 0.3)',
            fontSize: '11px',
            letterSpacing: '2px',
          }}
        >
          {text}
        </div>
      </div>

      {/* Drips */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${12 - i * 3}px`,
            height: `${20 - i * 5}px`,
            background: 'radial-gradient(ellipse at 30% 30%, rgba(232, 76, 61, 0.9), #c92f24)',
            left: `${50 + (i - 1) * 20}px`,
            top: '115px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
          animate={{
            y: [0, 2, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
};

// 3D Envelope Component
const Envelope3D: React.FC<{
  isOpen: boolean;
  onOpen: () => void;
  isArabic: boolean;
}> = ({ isOpen, onOpen, isArabic }) => {
  const ENVELOPE_WIDTH = 280;
  const ENVELOPE_HEIGHT = 180;

  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          perspective: '1500px',
          width: ENVELOPE_WIDTH,
          height: ENVELOPE_HEIGHT,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Envelope Back */}
          <div
            className="absolute inset-0 rounded-sm"
            style={{
              background: 'linear-gradient(135deg, #faf9f6 0%, #f5f3ee 100%)',
              boxShadow: `
                0 10px 30px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.8)
              `,
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          />

          {/* Front Bottom Flap */}
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '50%',
              background: 'linear-gradient(180deg, #faf9f6 0%, #f0ede6 100%)',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              transformOrigin: 'bottom center',
              boxShadow: 'inset 0 -2px 4px rgba(0, 0, 0, 0.05)',
            }}
          />

          {/* Front Left Flap */}
          <motion.div
            className="absolute top-0 left-0 bottom-0"
            style={{
              width: '50%',
              background: 'linear-gradient(90deg, #f5f3ee 0%, #faf9f6 100%)',
              transformOrigin: 'left center',
              boxShadow: 'inset -2px 0 4px rgba(0, 0, 0, 0.05)',
            }}
          />

          {/* Front Right Flap */}
          <motion.div
            className="absolute top-0 right-0 bottom-0"
            style={{
              width: '50%',
              background: 'linear-gradient(90deg, #faf9f6 0%, #f5f3ee 100%)',
              transformOrigin: 'right center',
              boxShadow: 'inset 2px 0 4px rgba(0, 0, 0, 0.05)',
            }}
          />

          {/* Top Flap with Wax Seal */}
          <motion.div
            className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center"
            style={{
              height: '50%',
              background: 'linear-gradient(180deg, #f0ede6 0%, #faf9f6 100%)',
              transformOrigin: 'top center',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
            }}
            animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            onClick={onOpen}
            whileHover={!isOpen ? { y: -2 } : {}}
          >
            <WaxSeal onClick={onOpen} text={isArabic ? 'افتح' : 'OPEN'} isArabic={isArabic} />
          </motion.div>

          {/* Decorative envelope text */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              fontSize: '12px',
              color: '#d4af37',
              opacity: 0.4,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontFamily: 'serif',
            }}
          >
            {isArabic ? 'دعوة' : 'INVITATION'}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Countdown Component
const CountdownSection: React.FC<{ language: Language; t: Record<string, string> }> = ({
  language,
  t,
}) => {
  const targetDate = new Date(2024, 5, 15); // June 15, 2024
  const timeLeft = useCountdown(targetDate);

  const items = [
    { value: String(timeLeft.days).padStart(2, '0'), label: t.countdownDays },
    { value: String(timeLeft.hours).padStart(2, '0'), label: t.countdownHours },
    { value: String(timeLeft.minutes).padStart(2, '0'), label: t.countdownMinutes },
    { value: String(timeLeft.seconds).padStart(2, '0'), label: t.countdownSeconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-16 px-4"
    >
      <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div
              className="rounded-lg p-4 md:p-6 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            >
              <div
                className="font-display text-3xl md:text-4xl font-bold mb-2"
                style={{ color: '#d4af37', fontFamily: 'serif' }}
              >
                {item.value}
              </div>
              <div className="text-xs md:text-sm" style={{ color: '#666' }}>
                {item.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Timeline Component
const TimelineSection: React.FC<{ language: Language; t: Record<string, string> }> = ({
  language,
  t,
}) => {
  const events = [
    { title: t.timelineReception, time: t.timelineReceptionTime },
    { title: t.timelineCeremony, time: t.timelineCeremonyTime },
    { title: t.timelineDinner, time: t.timelineDinnerTime },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-16 px-4 md:py-24"
    >
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-center text-3xl md:text-4xl font-bold mb-12"
          style={{ color: '#1a1a1a', fontFamily: 'serif' }}
        >
          {t.timelineReception ? 'Schedule' : 'الجدول الزمني'}
        </h2>

        <div className="space-y-8 relative">
          {/* Vertical line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2"
            style={{ background: 'linear-gradient(180deg, #d4af37, transparent)' }}
          />

          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`flex ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
            >
              {/* Content */}
              <div className="w-full md:w-5/12 px-4">
                <div
                  className="p-6 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                  }}
                >
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: '#d4af37', fontFamily: 'serif' }}
                  >
                    {event.title}
                  </h3>
                  <p style={{ color: '#666' }}>{event.time}</p>
                </div>
              </div>

              {/* Center dot */}
              <div className="w-2/12 flex justify-center">
                <motion.div
                  className="w-4 h-4 rounded-full"
                  style={{
                    background: '#d4af37',
                    boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)',
                  }}
                  whileInView={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Venue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 p-8 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.08))',
            border: '1px solid rgba(212, 175, 55, 0.3)',
          }}
        >
          <div className="flex items-start gap-4 mb-4">
            <MapPin style={{ color: '#d4af37', flexShrink: 0 }} size={24} />
            <div>
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: '#1a1a1a', fontFamily: 'serif' }}
              >
                {t.venueTitle}
              </h3>
              <p style={{ color: '#666', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                {t.venueAddress}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.open(
                'https://maps.google.com/?q=123+Luxury+Avenue+New+York',
                '_blank'
              );
            }}
            className="mt-4 px-6 py-2 rounded-lg flex items-center gap-2 text-white font-medium text-sm"
            style={{ background: '#d4af37' }}
          >
            {t.openMaps}
            <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// RSVP Component
const RSVPSection: React.FC<{ language: Language; t: Record<string, string> }> = ({
  language,
  t,
}) => {
  const [formData, setFormData] = useState<RSVPData>({
    name: '',
    attendance: 'yes',
    guests: 1,
    wishes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', attendance: 'yes', guests: 1, wishes: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-16 px-4 md:py-24"
    >
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-center text-3xl md:text-4xl font-bold mb-12"
          style={{ color: '#1a1a1a', fontFamily: 'serif' }}
        >
          {t.rsvpTitle}
        </h2>

        <AnimatePresence>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-12"
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                style={{ background: '#d4af37' }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6 }}
              >
                <Check size={32} className="text-white" />
              </motion.div>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: '#1a1a1a', fontFamily: 'serif' }}
              >
                {t.rsvpThanks}
              </h3>
              <p style={{ color: '#666' }}>{t.rsvpThanksSub}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                  {t.rsvpName}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-transparent focus:outline-none transition"
                  style={{
                    background: '#faf9f6',
                    borderColor: formData.name ? '#d4af37' : 'rgba(212, 175, 55, 0.2)',
                  }}
                  placeholder="Sarah Anderson"
                />
              </motion.div>

              {/* Attendance */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label className="block text-sm font-medium mb-3" style={{ color: '#1a1a1a' }}>
                  {t.rsvpAttendance}
                </label>
                <div className="flex gap-4">
                  {(['yes', 'no'] as const).map((option) => (
                    <motion.label
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 cursor-pointer p-3 rounded-lg flex-1"
                      style={{
                        background:
                          formData.attendance === option
                            ? 'rgba(212, 175, 55, 0.1)'
                            : 'transparent',
                        border:
                          formData.attendance === option
                            ? '2px solid #d4af37'
                            : '2px solid rgba(212, 175, 55, 0.2)',
                      }}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={option}
                        checked={formData.attendance === option}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            attendance: e.target.value as 'yes' | 'no',
                          })
                        }
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span style={{ color: '#1a1a1a', fontSize: '14px' }}>
                        {option === 'yes' ? t.rsvpYes : t.rsvpNo}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>

              {/* Guests Count */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                  {t.rsvpGuests}
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({ ...formData, guests: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition"
                  style={{
                    background: '#faf9f6',
                    borderColor: '#d4af37',
                    color: '#1a1a1a',
                  }}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Wishes */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <label className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                  {t.rsvpWishes}
                </label>
                <textarea
                  value={formData.wishes}
                  onChange={(e) => setFormData({ ...formData, wishes: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-rgba(212, 175, 55, 0.2) focus:outline-none transition resize-none"
                  rows={4}
                  style={{
                    background: '#faf9f6',
                    borderColor: formData.wishes ? '#d4af37' : 'rgba(212, 175, 55, 0.2)',
                    color: '#1a1a1a',
                  }}
                  placeholder="Your message here..."
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 rounded-lg font-bold text-white text-lg transition-shadow"
                style={{
                  background: 'linear-gradient(135deg, #d4af37, #c4941f)',
                  boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                }}
              >
                {t.rsvpSubmit}
              </motion.button>
            </form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Hero Section
const HeroSection: React.FC<{ language: Language; t: Record<string, string> }> = ({
  language,
  t,
}) => {
  const isArabic = language === 'ar';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: 'linear-gradient(135deg, #faf9f6 0%, #f5f3ee 100%)',
      }}
    >
      <div className="text-center max-w-4xl mx-auto">
        {/* Falling particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ background: '#d4af37', opacity: 0.3 }}
              animate={{
                y: ['0vh', '100vh'],
                x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              initial={{ top: '-5vh', left: Math.random() * 100 + '%' }}
            />
          ))}
        </div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 relative z-10"
        >
          <p
            className="text-sm md:text-base font-bold mb-4 tracking-widest uppercase"
            style={{ color: '#d4af37', letterSpacing: '3px' }}
          >
            {t.heroDate}
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
            style={{
              color: '#1a1a1a',
              fontFamily: 'serif',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            {isArabic ? (
              <>
                <span style={{ color: '#d4af37' }}>الحب</span>
                <br />
                {t.heroMain}
              </>
            ) : (
              <>
                {t.heroMain}
                <br />
                <span style={{ color: '#d4af37' }}>Sarah & Michael</span>
              </>
            )}
          </h1>
          <p
            className="text-2xl md:text-3xl font-light italic mt-4"
            style={{ color: '#999', fontFamily: 'serif' }}
          >
            {t.heroSubtitle}
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="w-24 h-1 mx-auto my-8"
          style={{ background: '#d4af37' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Scroll indicator */}
        <motion.div
          className="mt-12"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-sm mb-2" style={{ color: '#999' }}>
            {isArabic ? 'اسحب للأسفل' : 'Scroll Down'}
          </p>
          <div className="w-6 h-10 mx-auto border-2 rounded-full flex items-center justify-center" style={{ borderColor: '#d4af37' }}>
            <div
              className="w-1 h-2 rounded-full"
              style={{ background: '#d4af37' }}
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Audio Control
const AudioControl: React.FC<{ isPlaying: boolean; onToggle: () => void }> = ({
  isPlaying,
  onToggle,
}) => {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white z-50 shadow-lg backdrop-blur-sm"
      style={{
        background: 'rgba(212, 175, 55, 0.9)',
      }}
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </motion.button>
  );
};

// ==================== MAIN APP ====================
export default function WeddingInvitation() {
  const language = useLanguage();
  const t = translations[language];

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  const handleEnvelopeOpen = () => {
    // Critical: Play audio synchronously to bypass autoplay policy
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log('Audio playback failed:', err);
      });
      setIsPlaying(true);
    }
    setEnvelopeOpened(true);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.log('Audio playback failed:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cairo:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div
      className="w-full min-h-screen"
      style={{
        background: '#faf9f6',
        fontFamily: language === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif",
      }}
    >
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
        loop
        crossOrigin="anonymous"
      />

      <AnimatePresence mode="wait">
        {!envelopeOpened ? (
          <motion.div
            key="envelope"
            className="min-h-screen flex flex-col items-center justify-center px-4"
            style={{
              background: 'linear-gradient(135deg, #faf9f6 0%, #f5f3ee 100%)',
            }}
          >
            <Envelope3D
              isOpen={envelopeOpened}
              onOpen={handleEnvelopeOpen}
              isArabic={language === 'ar'}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 text-center"
              style={{ color: '#999', fontSize: '14px' }}
            >
              {language === 'ar' ? 'انقر على الختم لفتح الدعوة' : 'Click the seal to open'}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Hero Section */}
            <HeroSection language={language} t={t} />

            {/* Countdown */}
            <div style={{ background: '#faf9f6' }}>
              <CountdownSection language={language} t={t} />
            </div>

            {/* Timeline */}
            <div
              style={{
                background: 'linear-gradient(135deg, #faf9f6 0%, #f5f3ee 100%)',
              }}
            >
              <TimelineSection language={language} t={t} />
            </div>

            {/* RSVP */}
            <div style={{ background: '#faf9f6' }}>
              <RSVPSection language={language} t={t} />
            </div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center py-12 px-4"
              style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}
            >
              <p style={{ color: '#999', fontSize: '14px' }}>
                {language === 'ar' ? 'شكراً لتكريمك لنا بحضورك' : 'Thank you for honoring us with your presence'}
              </p>
              <p
                style={{
                  color: '#d4af37',
                  fontSize: '12px',
                  marginTop: '8px',
                  letterSpacing: '2px',
                }}
              >
                {language === 'ar' ? 'مع الحب' : 'With Love'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {envelopeOpened && <AudioControl isPlaying={isPlaying} onToggle={toggleAudio} />}
    </div>
  );
}
