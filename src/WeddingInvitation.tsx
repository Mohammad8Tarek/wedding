import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {
  MapPin,
  Calendar,
  Clock,
  Volume2,
  VolumeX,
  Share2,
  ExternalLink,
  Sparkles,
  Heart,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Navigation,
  MessageCircle,
  Crown,
  CalendarPlus,
  Bell,
} from 'lucide-react';

// ==================== DATA CONFIGURATION ====================
// يمكنك تعديل البيانات والأسماء والتواريخ والمواقع من هنا بكل سهولة

interface EventDetail {
  id: string;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  dateAr: string;
  dateEn: string;
  timeAr: string;
  timeEn: string;
  venueAr: string;
  venueEn: string;
  addressAr: string;
  addressEn: string;
  mapQuery: string;
  mapUrl?: string;
  notesAr?: string;
  notesEn?: string;
  iconType: 'henna' | 'wedding' | 'ceremony' | 'custom';
}

const EVENTS_DATA: EventDetail[] = [
  {
    id: 'henna',
    badgeAr: 'المناسبة الأولى',
    badgeEn: 'First Event',
    titleAr: 'ليلة الحنة',
    titleEn: 'Henna Night',
    dateAr: 'الجمعة، 9 أكتوبر 2026',
    dateEn: 'Friday, October 9, 2026',
    timeAr: 'الساعة 7:00 مساءً',
    timeEn: '7:00 PM',
    venueAr: 'منزل العائلة (عنوان الحنة)',
    venueEn: 'Family Home',
    addressAr: 'اضغط على زر الخريطة بالأسفل للوصول المباشر إلى موقع المنزل',
    addressEn: 'Click map button below for exact home location & directions',
    mapQuery: 'https://maps.app.goo.gl/UvMHPHAdq43ssnSG7',
    mapUrl: 'https://maps.app.goo.gl/UvMHPHAdq43ssnSG7',
    notesAr: 'أجواء عائلية مميزة للاحتفال بالحنة - نتشرف بحضوركم',
    notesEn: 'Warm family celebration with traditional henna',
    iconType: 'henna',
  },
  {
    id: 'wedding',
    badgeAr: 'الحفل الرئيسي',
    badgeEn: 'Main Celebration',
    titleAr: 'حفل الزفاف والدخلة',
    titleEn: 'Wedding Celebration & Reception',
    dateAr: 'الأحد، 11 أكتوبر 2026',
    dateEn: 'Sunday, October 11, 2026',
    timeAr: 'الساعة 8:00 مساءً',
    timeEn: '8:00 PM',
    venueAr: 'قاعة اسنو وايت (Snow White Ballroom)',
    venueEn: 'Snow White Ballroom',
    addressAr: 'اضغط على زر الخريطة بالأسفل للوصول المباشر إلى موقع القاعة',
    addressEn: 'Click map button below for driving directions to the hall',
    mapQuery: 'https://maps.app.goo.gl/KXXkvMgcD9i7eFNt5',
    mapUrl: 'https://maps.app.goo.gl/KXXkvMgcD9i7eFNt5',
    notesAr: 'الدخول بالدعوات الشخصية - بانتظار تشريفكم لنا لمشاركتنا الفرحة',
    notesEn: 'By personal invitation - Honored by your presence',
    iconType: 'wedding',
  },
];

// معرض صور العروسين الحقيقية - من مجلد public/images/
const GALLERY_IMAGES = [
  {
    id: 1,
    url: '/images/1.jpg',
    titleAr: 'عهد العمر • محمد & ندى',
    titleEn: 'Our Eternal Vow • Mohamed & Nada',
    captionAr: 'نسأل الله أن يبارك لنا ويجمع بيننا في خير',
    captionEn: 'May Allah bless our union in love and peace',
  },
  {
    id: 2,
    url: '/images/2.jpg',
    titleAr: 'وخلقناكم أزواجاً • وثيقة المحبة',
    titleEn: 'Marriage Contract & Fingerprints',
    captionAr: 'توثيق عقد القران وبصمة القلبين • ٢٠ أغسطس ٢٠٢٦',
    captionEn: 'Official Marriage Certificate & Heart Fingerprints',
  },
  {
    id: 3,
    url: '/images/3.jpg',
    titleAr: 'دامت أيادينا متصلة على المودة',
    titleEn: 'Hands Entwined In Love',
    captionAr: 'يداً بيد نحو بداية جديدة وحياة سعيدة ملؤها التوفيق',
    captionEn: 'Hand in hand towards a lifetime of happiness',
  },
  {
    id: 4,
    url: '/images/4.jpg',
    titleAr: 'فرحة البداية وباقة الورد وخاتم العمر',
    titleEn: 'Celebration, Roses & The Ring',
    captionAr: 'أجمل ابتسامة في أسعد لحظات العمر',
    captionEn: 'Pure joy and celebration of our engagement',
  },
  {
    id: 5,
    url: '/images/5.jpg',
    titleAr: 'أجمل اللحظات والذكريات معاً',
    titleEn: 'Cherished Memories Together',
    captionAr: 'كل لحظة معك هي بداية لذكرى لا تُنسى',
    captionEn: 'Every moment together is a memory to cherish',
  },
];

// ==================== FLOATING GOLD PARTICLES CANVAS ====================
const AmbientGoldParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const particleCount = isMobile ? 22 : 40;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.35 + 0.12,
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulse += 0.02;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = Math.max(0.08, p.opacity + Math.sin(p.pulse) * 0.15);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${currentOpacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
};

// ==================== ROYAL ORNATE BORDER FRAME ====================
// برواز ملكي فاخر يحيط بالدعوة بالكامل بزخارف أركان نباتية مذهبة
const RoyalOrnateFrame: React.FC = () => {
  return (
    <div className="fixed inset-2 md:inset-5 pointer-events-none z-30 select-none">
      {/* Outer Thin Gold Border */}
      <div
        className="absolute inset-0 rounded-2xl md:rounded-3xl border border-[#D4AF37]/50"
        style={{
          boxShadow: 'inset 0 0 20px rgba(212, 175, 55, 0.08), 0 0 15px rgba(212, 175, 55, 0.1)',
        }}
      />

      {/* Inner Dual Gold Line with Metallic Gradient */}
      <div
        className="absolute inset-1.5 md:inset-2.5 rounded-xl md:rounded-2xl border"
        style={{
          borderColor: 'rgba(212, 175, 55, 0.4)',
          boxShadow: 'inset 0 0 10px rgba(212, 175, 55, 0.05)',
        }}
      />

      {/* Top-Left Corner Filigree */}
      <svg
        className="absolute top-0 left-0 w-12 h-12 md:w-20 md:h-20 text-[#D4AF37] -translate-x-1 -translate-y-1 drop-shadow"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M5,5 L45,5 C40,15 35,20 25,25 C20,35 15,40 5,45 Z" opacity="0.25" />
        <path
          d="M2,2 L35,2 C30,10 25,18 20,25 C18,30 10,35 2,35 Z M10,10 Q25,12 28,28 Q12,25 10,10 M5,2 C18,2 25,15 25,25 C15,25 2,18 2,5"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.5"
        />
        <circle cx="8" cy="8" r="3.5" fill="#D4AF37" />
        <circle cx="28" cy="5" r="2.5" fill="#D4AF37" />
        <circle cx="5" cy="28" r="2.5" fill="#D4AF37" />
      </svg>

      {/* Top-Right Corner Filigree */}
      <svg
        className="absolute top-0 right-0 w-12 h-12 md:w-20 md:h-20 text-[#D4AF37] translate-x-1 -translate-y-1 drop-shadow -scale-x-100"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M5,5 L45,5 C40,15 35,20 25,25 C20,35 15,40 5,45 Z" opacity="0.25" />
        <path
          d="M2,2 L35,2 C30,10 25,18 20,25 C18,30 10,35 2,35 Z M10,10 Q25,12 28,28 Q12,25 10,10 M5,2 C18,2 25,15 25,25 C15,25 2,18 2,5"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.5"
        />
        <circle cx="8" cy="8" r="3.5" fill="#D4AF37" />
        <circle cx="28" cy="5" r="2.5" fill="#D4AF37" />
        <circle cx="5" cy="28" r="2.5" fill="#D4AF37" />
      </svg>

      {/* Bottom-Left Corner Filigree */}
      <svg
        className="absolute bottom-0 left-0 w-12 h-12 md:w-20 md:h-20 text-[#D4AF37] -translate-x-1 translate-y-1 drop-shadow -scale-y-100"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M5,5 L45,5 C40,15 35,20 25,25 C20,35 15,40 5,45 Z" opacity="0.25" />
        <path
          d="M2,2 L35,2 C30,10 25,18 20,25 C18,30 10,35 2,35 Z M10,10 Q25,12 28,28 Q12,25 10,10 M5,2 C18,2 25,15 25,25 C15,25 2,18 2,5"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.5"
        />
        <circle cx="8" cy="8" r="3.5" fill="#D4AF37" />
        <circle cx="28" cy="5" r="2.5" fill="#D4AF37" />
        <circle cx="5" cy="28" r="2.5" fill="#D4AF37" />
      </svg>

      {/* Bottom-Right Corner Filigree */}
      <svg
        className="absolute bottom-0 right-0 w-12 h-12 md:w-20 md:h-20 text-[#D4AF37] translate-x-1 translate-y-1 drop-shadow -scale-x-100 -scale-y-100"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path d="M5,5 L45,5 C40,15 35,20 25,25 C20,35 15,40 5,45 Z" opacity="0.25" />
        <path
          d="M2,2 L35,2 C30,10 25,18 20,25 C18,30 10,35 2,35 Z M10,10 Q25,12 28,28 Q12,25 10,10 M5,2 C18,2 25,15 25,25 C15,25 2,18 2,5"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.5"
        />
        <circle cx="8" cy="8" r="3.5" fill="#D4AF37" />
        <circle cx="28" cy="5" r="2.5" fill="#D4AF37" />
        <circle cx="5" cy="28" r="2.5" fill="#D4AF37" />
      </svg>

      {/* Top Center Emblem */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-[#FAF8F5] rounded-full">
        <div className="flex items-center gap-1 text-[#D4AF37]">
          <span className="w-5 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <Heart className="w-3 h-3 fill-current" />
          <span className="w-5 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>
      </div>

      {/* Bottom Center Emblem */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-3 bg-[#FAF8F5] rounded-full">
        <div className="flex items-center gap-1 text-[#D4AF37]">
          <span className="w-5 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <Sparkles className="w-3 h-3" />
          <span className="w-5 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
export default function WeddingInvitation() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const isAr = language === 'ar';
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioFadeIntervalRef = useRef<number | null>(null);
  const userGestureFallbackRef = useRef<(() => void) | null>(null);
  const autoScrollRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [calendarModalEvent, setCalendarModalEvent] = useState<EventDetail | null>(null);

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (event: EventDetail) => {
    const isWedding = event.id === 'wedding';
    const title = isWedding
      ? (isAr ? 'حفل زفاف محمد & ندى 💍' : 'Wedding of Mohamed & Nada 💍')
      : (isAr ? 'ليلة حنة محمد & ندى 🌸' : 'Henna Night of Mohamed & Nada 🌸');
    const start = isWedding ? '20261011T170000Z' : '20261009T160000Z';
    const end = isWedding ? '20261011T220000Z' : '20261009T200000Z';
    const details = isWedding
      ? (isAr
          ? 'يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة العمر في حفل زفاف محمد وندى بقاعة اسنو وايت 🤍 بارك الله لهما وبارك عليهما وجمع بينهما في خير.'
          : 'Cordially invited to celebrate the wedding of Mohamed & Nada at Snow White Ballroom.')
      : (isAr
          ? 'نتشرف بحضوركم لمشاركتنا فرحة ليلة الحنة للعروسين محمد وندى 🤍✨'
          : 'Cordially invited to the Henna celebration of Mohamed & Nada.');
    const location = `${isAr ? event.venueAr : event.venueEn} - ${event.mapUrl || ''}`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(
      location
    )}`;
  };

  // Apple Calendar & Outlook (.ics) file generator with 1-day advance alarm
  const downloadIcs = (event: EventDetail) => {
    const isWedding = event.id === 'wedding';
    const title = isWedding
      ? (isAr ? 'حفل زفاف محمد & ندى 💍' : 'Wedding of Mohamed & Nada 💍')
      : (isAr ? 'ليلة حنة محمد & ندى 🌸' : 'Henna Night of Mohamed & Nada 🌸');
    const start = isWedding ? '20261011T170000Z' : '20261009T160000Z';
    const end = isWedding ? '20261011T220000Z' : '20261009T200000Z';
    const details = isWedding
      ? (isAr
          ? 'يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة العمر في حفل زفاف محمد وندى بقاعة اسنو وايت 🤍 بارك الله لهما وبارك عليهما وجمع بينهما في خير.'
          : 'Cordially invited to celebrate the wedding of Mohamed & Nada at Snow White Ballroom.')
      : (isAr
          ? 'نتشرف بحضوركم لمشاركتنا فرحة ليلة الحنة للعروسين محمد وندى 🤍✨'
          : 'Cordially invited to the Henna celebration of Mohamed & Nada.');
    const location = `${isAr ? event.venueAr : event.venueEn}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Mohamed and Nada Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      `LOCATION:${location}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${isAr ? 'تذكير بموعد الفرح غداً! 🎉' : 'Reminder: Wedding Celebration Tomorrow! 🎉'}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}-mohamed-nada.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Festive Confetti trigger
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#D4AF37', '#FFDF73', '#B8860B', '#F3EAD7', '#FFFFFF'],
      });
    } catch {
      // ignore
    }
  };

  // Initialize Lenis luxury momentum smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Stop gentle auto-scroll
  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
    setIsAutoScrolling(false);
  }, []);

  // Start gentle auto-scroll
  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
    setIsAutoScrolling(true);

    let currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let lastTime = performance.now();
    // سرعة واضحة وسلسة ومريحة للقراءة (~80 بكسل في الثانية)
    const speed = 80;

    const step = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      currentScroll += speed * delta;

      const maxScroll = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight
      ) - window.innerHeight;

      if (currentScroll >= maxScroll - 10) {
        window.scrollTo(0, maxScroll);
        stopAutoScroll();
        return;
      }

      window.scrollTo(0, currentScroll);
      document.documentElement.scrollTop = currentScroll;
      document.body.scrollTop = currentScroll;

      autoScrollRef.current = requestAnimationFrame(step);
    };

    autoScrollRef.current = requestAnimationFrame(step);
  }, [stopAutoScroll]);

  // Pause / Stop auto-scroll when user manually intervenes (wheel or touch swipe)
  useEffect(() => {
    if (!isAutoScrolling) return;

    let isReadyForInteraction = false;
    const graceTimer = setTimeout(() => {
      isReadyForInteraction = true;
    }, 1200);

    const handleUserInteraction = () => {
      if (isReadyForInteraction) {
        stopAutoScroll();
      }
    };

    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserInteraction, { passive: true });

    return () => {
      clearTimeout(graceTimer);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchmove', handleUserInteraction);
    };
  }, [isAutoScrolling, stopAutoScroll]);

  // Clean up auto-scroll on unmount
  useEffect(() => {
    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, []);

  // نزول الصفحة تلقائياً بمجرد فتح الجواب دون الحاجة للضغط على أي زرار
  useEffect(() => {
    if (isEnvelopeOpen) {
      const scrollTimer = setTimeout(() => {
        startAutoScroll();
      }, 700);
      return () => clearTimeout(scrollTimer);
    }
  }, [isEnvelopeOpen, startAutoScroll]);

  // Countdown timer calculation
  const targetDate = new Date('2026-10-11T20:00:00');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Clear any active audio volume fade interval
  const clearAudioFade = useCallback(() => {
    if (audioFadeIntervalRef.current !== null) {
      clearInterval(audioFadeIntervalRef.current);
      audioFadeIntervalRef.current = null;
    }
  }, []);

  // Remove one-time gesture listeners if active
  const removeUserGestureFallback = useCallback(() => {
    if (userGestureFallbackRef.current) {
      window.removeEventListener('pointerdown', userGestureFallbackRef.current);
      window.removeEventListener('click', userGestureFallbackRef.current);
      window.removeEventListener('touchstart', userGestureFallbackRef.current);
      userGestureFallbackRef.current = null;
    }
  }, []);

  // Play Audio Immediately on envelope open (audible right away at 0.65 volume)
  const startAudio = useCallback(() => {
    if (!audioRef.current) return;
    clearAudioFade();
    removeUserGestureFallback();

    audioRef.current.volume = 0.65;
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          setIsPlaying(false);
          console.log('Audio autoplay prevented by browser policy:', err);
          // Fallback: play on next user gesture anywhere on screen
          const handleFirstUserGesture = () => {
            removeUserGestureFallback();
            if (audioRef.current) {
              audioRef.current.volume = 0.65;
              audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
            }
          };
          userGestureFallbackRef.current = handleFirstUserGesture;
          window.addEventListener('pointerdown', handleFirstUserGesture, { once: true });
          window.addEventListener('click', handleFirstUserGesture, { once: true });
          window.addEventListener('touchstart', handleFirstUserGesture, { once: true });
        });
    }
  }, [clearAudioFade, removeUserGestureFallback]);

  // Clean up audio & timers on unmount
  useEffect(() => {
    return () => {
      clearAudioFade();
      removeUserGestureFallback();
    };
  }, [clearAudioFade, removeUserGestureFallback]);

  // Audio Toggle Control
  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    clearAudioFade();
    removeUserGestureFallback();

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      startAudio();
    }
  }, [isPlaying, clearAudioFade, removeUserGestureFallback, startAudio]);

  // Open Envelope with 3D animation & instant audio playback & royal celebration confetti
  const handleOpenEnvelope = useCallback(() => {
    if (isOpeningAnimation || isEnvelopeOpen) return;
    setIsOpeningAnimation(true);
    startAudio();
    window.scrollTo({ top: 0, behavior: 'instant' });
    lenisRef.current?.scrollTo(0, { immediate: true });

    // Royal Celebration Confetti Burst at card elevation
    setTimeout(() => {
      // Golden Champagne & Rose Sparks from left edge
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#D4AF37', '#FFDF73', '#FFE885', '#E07A5F', '#FFFFFF'],
        ticks: 200,
        gravity: 0.85,
        scalar: 1.1,
      });
      // Golden Champagne & Rose Sparks from right edge
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#D4AF37', '#FFDF73', '#FFE885', '#E07A5F', '#FFFFFF'],
        ticks: 200,
        gravity: 0.85,
        scalar: 1.1,
      });
    }, 400);

    setTimeout(() => {
      setIsEnvelopeOpen(true);
    }, 1250);
  }, [isOpeningAnimation, isEnvelopeOpen, startAudio]);

  // Share on WhatsApp / Mobile Native Share (Sends ONLY the clean URL so WhatsApp automatically generates the rich card with photo and details)
  const handleWhatsAppShare = async () => {
    const cleanUrl = 'https://wedding-mohamed-nada.vercel.app/';

    if (navigator.share) {
      try {
        await navigator.share({
          url: cleanUrl,
        });
        return;
      } catch {
        // Fallback to WhatsApp URL if user dismisses native sheet
      }
    }

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(cleanUrl)}`, '_blank');
  };

  // Copy Link
  const handleCopyLink = () => {
    const cleanUrl = 'https://wedding-mohamed-nada.vercel.app/';
    navigator.clipboard.writeText(cleanUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Send Congratulations directly to groom's WhatsApp with confetti
  const handleSendGroomCongratulations = () => {
    confetti({
      particleCount: 40,
      spread: 65,
      origin: { y: 0.85 },
      colors: ['#D4AF37', '#FFDF73', '#FFE885', '#FFFFFF'],
    });
    const phoneNumber = '201270080682';
    const message = isAr
      ? 'ألف مبروك يا عريسنا الغالي محمد! 💍🎉 بارك الله لكما وبارك عليكما وجمع بينكما في خير، ودامت دياركم عامرة بالأفراح والمسرات 🤍✨'
      : 'Dearest Mohamed! 💍 Huge congratulations on your wedding! Wishing you and Nada a lifetime of happiness and blessings 🤍';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Send Congratulations directly to bride's WhatsApp with confetti
  const handleSendBrideCongratulations = () => {
    confetti({
      particleCount: 40,
      spread: 65,
      origin: { y: 0.85 },
      colors: ['#E07A5F', '#FFB5C5', '#FFDF73', '#FFFFFF'],
    });
    const phoneNumber = '201200473273';
    const message = isAr
      ? 'ألف مبروك يا أحلى عروسة ندى! 👰🏻‍♀️🌸 بارك الله لكما وبارك عليكما وجمع بينكما في خير، وجعل أيامكم كلها حب وسعادة وهنا 🤍✨'
      : 'Dearest Nada! 👰🏻‍♀️ Warmest congratulations on your wedding! Wishing you and Mohamed a lifetime of endless joy and love 🌸✨';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FAF8F5] text-[#1A1A1A] font-sans relative overflow-x-hidden selection:bg-[#D4AF37]/30 selection:text-[#8C7326]"
    >
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/wedding-song.mp3"
        preload="auto"
        loop
      />

      {/* Ambient Canvas Particles - Mounted only after envelope opens for 60fps mobile opening */}
      {isEnvelopeOpen && <AmbientGoldParticles />}

      {/* Royal Ornate Frame Around Entire Invitation */}
      <RoyalOrnateFrame />

      {/* Floating Header Controls */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-[#FAF8F5]/80 backdrop-blur-md border-b border-[#D4AF37]/20 py-3 px-6 max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#D4AF37] animate-pulse" />
          <span
            style={{ fontFamily: isAr ? 'Cairo, sans-serif' : 'Playfair Display, serif' }}
            className="font-bold text-sm tracking-widest text-[#735C00] uppercase"
          >
            {isAr ? 'دعوة زفاف خاصة' : 'Wedding Invitation'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            className="px-3 py-1 text-xs font-semibold rounded-full border border-[#D4AF37]/40 text-[#735C00] hover:bg-[#D4AF37]/10 transition-colors"
          >
            {isAr ? 'English' : 'عربي'}
          </button>

          {/* Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full border transition-all ${
              isPlaying
                ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#735C00] shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                : 'border-stone-300 text-stone-400 hover:text-stone-600'
            }`}
            title={isPlaying ? 'Mute' : 'Play'}
          >
            {isPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* ROYAL VELVET & GOLD ENVELOPE MODAL (الجواب الملكي المخملي والذهبي) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {!isEnvelopeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.03,
              transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-hidden touch-manipulation"
          >
            {/* Royal Deep Burgundy / Wine Velvet Backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 50% 45%, #4E0513 0%, #3B020B 35%, #260107 70%, #150004 100%)',
              }}
            />

            {/* Subtle Gold Ambient Shimmer Backdrop Overlays */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 25%, rgba(255, 223, 115, 0.22) 0%, transparent 40%), ' +
                  'radial-gradient(circle at 80% 75%, rgba(212, 175, 55, 0.2) 0%, transparent 45%), ' +
                  'radial-gradient(circle at 50% 15%, rgba(255, 245, 185, 0.18) 0%, transparent 35%), ' +
                  'radial-gradient(circle at 30% 85%, rgba(170, 119, 28, 0.22) 0%, transparent 50%)',
              }}
            />

            {/* Micro Velvet Texture Stipple */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.15) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Deep Vignette Shadow Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 140px rgba(10, 0, 3, 0.88), inset 0 0 40px rgba(0, 0, 0, 0.7)',
              }}
            />

            <div className="relative w-full max-w-lg flex flex-col items-center z-10">
              {/* Header Title */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-5"
              >
                <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#260107]/85 border border-[#D4AF37]/60 mb-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFDF73]" />
                  <span className="text-[11px] font-bold text-[#FFE885] tracking-widest uppercase">
                    {isAr ? 'بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ' : 'In The Name of God'}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#FFDF73]" />
                </div>

                <h2
                  style={{ fontFamily: isAr ? 'Amiri, serif' : 'Playfair Display, serif' }}
                  className="text-3xl md:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFF4BD] via-[#FFDF73] to-[#D4AF37] drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]"
                >
                  {isAr ? 'دعـوة زفـاف خـاصـة' : 'Royal Wedding Invitation'}
                </h2>
                <p className="text-xs md:text-sm text-[#FFDF73]/90 mt-1 tracking-wider font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  {isAr ? 'نتشرف بدعوتكم لحضور حفلنا الكريم' : 'Cordially invited to our special celebration'}
                </p>
              </motion.div>

              {/* 3D Envelope Wrapper */}
              <div
                style={{
                  perspective: 1200,
                  WebkitPerspective: 1200,
                }}
                className="relative w-full aspect-[16/11] max-w-[420px] flex items-center justify-center cursor-pointer select-none touch-manipulation active:scale-[0.99] transition-transform"
                onClick={handleOpenEnvelope}
              >
                {/* Envelope 3D Body */}
                <motion.div
                  animate={
                    isOpeningAnimation
                      ? { scale: 1.02, y: 10 }
                      : { y: [0, -5, 0] }
                  }
                  transition={
                    isOpeningAnimation
                      ? { duration: 0.6, ease: [0.25, 1, 0.5, 1] }
                      : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
                  }
                  className="relative w-full h-full rounded-[24px] overflow-visible"
                  style={{
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                    willChange: 'transform',
                    boxShadow:
                      '0 28px 60px -12px rgba(18, 1, 4, 0.85), 0 0 35px rgba(212, 175, 55, 0.2)',
                  }}
                >
                  {/* Outer Gold Leaf Border Piping Frame */}
                  <div
                    className="absolute -inset-[2px] rounded-[26px] z-0 shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
                    }}
                  />

                  {/* Envelope Base / Backplate (Royal Burgundy Velvet Cardstock) */}
                  <div
                    className="absolute inset-0 rounded-[24px] overflow-hidden z-0"
                    style={{
                      background: 'radial-gradient(ellipse at 50% 35%, #5C0B1B 0%, #4E0513 40%, #3B020B 75%, #260107 100%)',
                    }}
                  >
                    {/* Simulated Velvet Pile Radial Luster Overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.09) 0%, transparent 40%, rgba(212,175,55,0.06) 65%, rgba(0,0,0,0.45) 100%)',
                      }}
                    />
                    {/* Delicate Gold Arabesque Stipple in Velvet Interior */}
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(#FFDF73 1px, transparent 1px)`,
                        backgroundSize: '18px 18px',
                      }}
                    />
                  </div>

                  {/* THE INVITATION CARD INSIDE (Warm Royal Ivory, Slides UP on open) */}
                  <motion.div
                    animate={
                      isOpeningAnimation
                        ? { y: -135, opacity: 1, scale: 1.03 }
                        : { y: 0, opacity: 0.95, scale: 1 }
                    }
                    transition={{
                      duration: 0.8,
                      delay: 0.35,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    className="absolute inset-x-4 top-4 bottom-3 rounded-xl shadow-xl flex flex-col items-center justify-center p-3 text-center z-10 overflow-hidden"
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                      background: 'linear-gradient(180deg, #FFFDF7 0%, #FAF6EE 55%, #F3EBDD 100%)',
                      border: '2px solid #D4AF37',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.35), inset 0 0 15px rgba(212,175,55,0.12)',
                    }}
                  >
                    {/* Inner Gold Inset Frame with Flourishes */}
                    <div className="w-full h-full border border-[#D4AF37]/60 rounded-lg p-3 flex flex-col items-center justify-between relative bg-[#FFFDF7]/60">
                      {/* Top Ornate Bar */}
                      <div className="flex items-center gap-2 text-[#AA771C]">
                        <span className="w-7 h-[1px] bg-gradient-to-r from-transparent to-[#AA771C]" />
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        <span className="w-7 h-[1px] bg-gradient-to-l from-transparent to-[#AA771C]" />
                      </div>

                      {/* Card Content */}
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7326] font-bold block mb-1">
                          {isAr ? 'دعوة زفاف خاصة' : 'Wedding Invitation'}
                        </span>
                        <h3
                          style={{ fontFamily: isAr ? 'Amiri, serif' : 'Playfair Display, serif' }}
                          className="text-2xl md:text-3xl font-extrabold text-[#4E0513] leading-tight"
                        >
                          {isAr ? 'محمد & ندى' : 'Mohamed & Nada'}
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-[#8C7326]">
                          <Heart className="w-2.5 h-2.5 fill-[#AA771C] text-[#AA771C]" />
                          <p className="text-[11px] font-semibold text-[#5C3E05]">
                            {isAr ? '11 أكتوبر 2026 • قاعة اسنو وايت' : 'October 11, 2026 • Snow White'}
                          </p>
                          <Heart className="w-2.5 h-2.5 fill-[#AA771C] text-[#AA771C]" />
                        </div>
                      </div>

                      {/* Bottom Ornate Bar */}
                      <div className="flex items-center gap-2 text-[#AA771C]">
                        <span className="w-7 h-[1px] bg-gradient-to-r from-transparent to-[#AA771C]" />
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        <span className="w-7 h-[1px] bg-gradient-to-l from-transparent to-[#AA771C]" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Front Pocket Left Velvet Flap */}
                  <div
                    className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[24px]"
                    style={{
                      clipPath: 'polygon(0 0, 0 100%, 50% 50%)',
                      background: 'linear-gradient(135deg, #4E0513 0%, #3B020B 60%, #260107 100%)',
                    }}
                  >
                    {/* Flap Luster & Piping */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 45%, rgba(0,0,0,0.4) 100%)',
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: 'polygon(0 0, 50% 50%, 0 100%, 0 98%, 48% 50%, 0 2%)',
                        background: 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)',
                        opacity: 0.65,
                      }}
                    />
                  </div>

                  {/* Front Pocket Right Velvet Flap */}
                  <div
                    className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[24px]"
                    style={{
                      clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)',
                      background: 'linear-gradient(225deg, #4E0513 0%, #3B020B 60%, #260107 100%)',
                    }}
                  >
                    {/* Flap Luster & Piping */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(225deg, rgba(255,255,255,0.08) 0%, transparent 45%, rgba(0,0,0,0.4) 100%)',
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: 'polygon(100% 0, 50% 50%, 100% 100%, 100% 98%, 52% 50%, 100% 2%)',
                        background: 'linear-gradient(225deg, #BF953F 0%, #FCF6BA 50%, #AA771C 100%)',
                        opacity: 0.65,
                      }}
                    />
                  </div>

                  {/* Front Pocket Bottom Velvet Flap */}
                  <div
                    className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[24px]"
                    style={{
                      clipPath: 'polygon(0 100%, 100% 100%, 50% 45%)',
                      background: 'linear-gradient(0deg, #200106 0%, #35020A 40%, #4A0512 100%)',
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 60%)',
                      }}
                    />
                    {/* Gold Leaf Chevron Border Piping on Bottom Flap */}
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: 'polygon(0 100%, 100% 100%, 50% 45%, 49% 47%, 98% 99%, 2% 99%)',
                        background: 'linear-gradient(90deg, #D4AF37 0%, #FFDF73 50%, #AA771C 100%)',
                        opacity: 0.8,
                      }}
                    />
                  </div>

                  {/* Royal Gold Velvet Silk Ribbon (Vertical) */}
                  <motion.div
                    animate={{ opacity: isOpeningAnimation ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-9 pointer-events-none z-25"
                    style={{
                      background:
                        'linear-gradient(90deg, #8A6412 0%, #D4AF37 20%, #FFF3B0 50%, #D4AF37 80%, #8A6412 100%)',
                      boxShadow: '0 0 12px rgba(0,0,0,0.4), inset 0 0 3px rgba(255,255,255,0.6)',
                    }}
                  >
                    <div className="w-full h-full opacity-40 border-x border-[#FFFDF7]" />
                  </motion.div>

                  {/* TOP FLAP (3D Animated Flap with rotateX: -180 revealing Royal Ivory lining) */}
                  <motion.div
                    animate={{
                      rotateX: isOpeningAnimation ? -180 : 0,
                    }}
                    transition={{
                      duration: 0.75,
                      ease: [0.4, 0.0, 0.2, 1],
                    }}
                    style={{
                      transformOrigin: 'top center',
                      transformStyle: 'preserve-3d',
                      WebkitTransformStyle: 'preserve-3d',
                      willChange: 'transform',
                      zIndex: isOpeningAnimation ? 5 : 32,
                    }}
                    className="absolute inset-x-0 top-0 h-full pointer-events-none"
                  >
                    {/* Flap Outer Front Face (Burgundy Velvet Cardstock) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        transform: 'translateZ(1px)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        clipPath: 'polygon(0 0, 100% 0, 50% 55%)',
                        background: 'linear-gradient(180deg, #5C0B1B 0%, #4E0513 50%, #38020A 100%)',
                      }}
                    >
                      {/* Gold Leaf Piping on Chevron Edges */}
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: 'polygon(0 0, 100% 0, 50% 55%, 50% 53%, 98% 2%, 2% 2%)',
                          background: 'linear-gradient(90deg, #D4AF37 0%, #FFDF73 50%, #AA771C 100%)',
                        }}
                      />
                      {/* Directional Velvet Luster Sheen */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
                        }}
                      />
                    </div>

                    {/* Flap Inner Lining Face (Warm Royal Ivory with Delicate Gold Filigree) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{
                        transform: 'rotateX(180deg) translateZ(1px)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        clipPath: 'polygon(0 0, 100% 0, 50% 55%)',
                        background: 'linear-gradient(180deg, #FFFDF7 0%, #FAF6EE 60%, #F0E6D2 100%)',
                      }}
                    >
                      {/* Inner Gold Leaf Chevron Piping */}
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: 'polygon(0 0, 100% 0, 50% 55%, 50% 53%, 98% 2%, 2% 2%)',
                          background: 'linear-gradient(90deg, #BF953F 0%, #FFDF73 50%, #AA771C 100%)',
                        }}
                      />
                      {/* Delicate Royal Arabesque Gold Pattern */}
                      <div
                        className="absolute inset-0 opacity-25 pointer-events-none"
                        style={{
                          backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px), radial-gradient(#AA771C 1.5px, #FAF6EE 1.5px)`,
                          backgroundSize: '16px 16px',
                          backgroundPosition: '0 0, 8px 8px',
                        }}
                      />
                      {/* Subtle Crest Ornament in Inner Flap */}
                      <div className="absolute top-7 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70">
                        <Sparkles className="w-4 h-4 text-[#AA771C]" />
                      </div>
                    </div>
                  </motion.div>

                  {/* ========================================================= */}
                  {/* ROYAL EMBOSSED MOLTEN GOLD WAX SEAL (ختم الشمع الذهبي الملكي) */}
                  {/* ========================================================= */}
                  <motion.div
                    animate={
                      isOpeningAnimation
                        ? { scale: 1.25, opacity: 0, y: -15 }
                        : { scale: [1, 1.03, 1] }
                    }
                    transition={
                      isOpeningAnimation
                        ? { duration: 0.35, ease: 'easeOut' }
                        : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
                    }
                    style={{
                      willChange: 'transform, opacity',
                      transform: 'translateZ(0)',
                    }}
                    className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer"
                  >
                    <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                      {/* Outer Wax Irregular Melt Rim in Molten Gold */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'radial-gradient(circle at 35% 32%, #FFF3B0 0%, #FFE885 20%, #E5BE58 45%, #C29629 70%, #8A6412 90%, #543904 100%)',
                          boxShadow:
                            '0 16px 36px rgba(0, 0, 0, 0.65), 0 4px 12px rgba(78, 5, 19, 0.5), inset 0 3px 6px rgba(255, 255, 255, 0.75), inset 0 -6px 12px rgba(84, 57, 4, 0.85)',
                          borderRadius: '48% 52% 51% 49% / 52% 48% 52% 48%',
                        }}
                      />

                      {/* Inner Stamped Die Coin in Burnished Gold */}
                      <div
                        className="relative w-22 h-22 md:w-26 md:h-26 rounded-full flex flex-col items-center justify-center overflow-hidden"
                        style={{
                          background:
                            'radial-gradient(circle at 40% 35%, #FFEBA3 0%, #E5BE58 35%, #C29629 70%, #946C13 100%)',
                          boxShadow:
                            'inset 0 3px 6px rgba(255, 255, 255, 0.85), inset 0 -4px 8px rgba(70, 45, 5, 0.9), 0 2px 6px rgba(0, 0, 0, 0.35)',
                          border: '2px solid #AA771C',
                        }}
                      >
                        {/* Concentric Beaded/Dotted Relief Border */}
                        <svg
                          className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] pointer-events-none"
                          viewBox="0 0 100 100"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="44"
                            fill="none"
                            stroke="#7A560C"
                            strokeWidth="2.5"
                            strokeDasharray="3.5 5"
                            strokeLinecap="round"
                            opacity="0.85"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="44"
                            fill="none"
                            stroke="#FFF9D6"
                            strokeWidth="1.2"
                            strokeDasharray="3.5 5"
                            strokeLinecap="round"
                            transform="translate(0.5, 0.5)"
                            opacity="0.75"
                          />
                        </svg>

                        {/* Stamped Royal Crown Emblem with Dual-Light Debossed Relief */}
                        <Crown
                          className="w-8 h-8 md:w-9 md:h-9 text-[#5C3E05] stroke-[2.2]"
                          style={{
                            filter:
                              'drop-shadow(1px 1.5px 0px rgba(255, 248, 196, 0.95)) drop-shadow(-1px -1.5px 1.5px rgba(50, 30, 2, 0.95)) drop-shadow(0 0 4px rgba(212, 175, 55, 0.35))',
                          }}
                        />

                        {/* Stamped Open Label */}
                        <div className="flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-[#5C3E05]" />
                          <span
                            style={{
                              color: '#5C3E05',
                              textShadow: '0.5px 1px 0px rgba(255, 248, 196, 0.9), -0.5px -1px 1px rgba(50, 30, 2, 0.9)',
                            }}
                            className="text-[9px] tracking-[0.25em] font-extrabold uppercase"
                          >
                            OPEN
                          </span>
                          <Sparkles className="w-2.5 h-2.5 text-[#5C3E05]" />
                        </div>

                        {/* Specular Light Sweep Glistening Highlights */}
                        <motion.div
                          animate={{
                            x: ['-140%', '140%'],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 3.2,
                            ease: 'easeInOut',
                            repeatDelay: 1.5,
                          }}
                          className="absolute inset-0 pointer-events-none rounded-full"
                          style={{
                            background:
                              'linear-gradient(115deg, transparent 25%, rgba(255, 255, 255, 0.65) 48%, rgba(255, 255, 255, 0.85) 50%, rgba(255, 255, 255, 0.65) 52%, transparent 75%)',
                            mixBlendMode: 'overlay',
                          }}
                        />
                      </div>

                      {/* Glistening Micro-Sparkle Glint Accents */}
                      <Sparkles className="absolute top-1.5 right-2 w-3.5 h-3.5 text-[#FFFBE0] animate-pulse pointer-events-none drop-shadow-[0_0_6px_rgba(255,245,185,0.9)]" />
                      <Sparkles className="absolute bottom-2 left-2 w-2.5 h-2.5 text-[#FFFBE0] animate-pulse pointer-events-none drop-shadow-[0_0_6px_rgba(255,245,185,0.9)]" style={{ animationDelay: '1s' }} />

                      {/* Pulsing Beacon Ring */}
                      {!isOpeningAnimation && (
                        <span className="absolute -inset-2.5 rounded-full border border-[#FFE885]/70 animate-ping pointer-events-none opacity-50" />
                      )}
                      <span className="absolute -inset-1 rounded-full border border-[#D4AF37]/50 pointer-events-none" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Bottom Interactive Prompt Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-center cursor-pointer"
                onClick={handleOpenEnvelope}
              >
                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#260107]/90 border border-[#D4AF37]/70 text-xs md:text-sm font-bold text-[#FFE885] shadow-[0_6px_25px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all">
                  <Heart className="w-4 h-4 text-[#FFDF73] fill-current animate-pulse" />
                  <span>{isAr ? 'إلمس لفتح الجواب وتشغيل الأغنية 🎶✨' : 'Touch to open invitation & play music 🎶✨'}</span>
                </div>
                <p className="text-[#FFDF73]/85 text-[11px] mt-2 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                  {isAr ? '🎶 ستعمل الموسيقى فوراً عند فتح المظروف' : '🎶 Music plays immediately upon opening'}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* MAIN INVITATION CONTENT (محتوى الدعوة بعد الفتح) */}
      {/* ========================================================= */}
      <main className="pt-24 pb-20 px-4 max-w-3xl mx-auto relative z-10">
        {/* Quranic Verse / Romantic Header */}
        <section className="text-center py-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl mx-auto"
          >
            <p className="text-[#8C7326] text-xs md:text-sm tracking-[0.25em] uppercase font-semibold mb-4">
              {isAr ? 'بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ' : 'IN THE NAME OF ALLAH'}
            </p>

            <blockquote
              style={{ fontFamily: 'Amiri, serif' }}
              className="text-xl md:text-2xl text-[#1A1A1A] leading-relaxed font-bold mb-6 italic"
            >
              "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
              وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
            </blockquote>

            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              <div className="w-2.5 h-2.5 rotate-45 border border-[#D4AF37] bg-[#FAF8F5]" />
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>

            {/* The Sweet Invitation Words (كلام حلو وراقي) */}
            <div className="my-6 p-6 md:p-7 rounded-3xl bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#FAF5EB] border-2 border-[#D4AF37]/35 shadow-[0_10px_35px_rgba(212,175,55,0.12)] relative overflow-hidden text-center">
              <div className="flex items-center justify-center gap-2 mb-3 text-[#AA771C]">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C7326]">
                  {isAr ? 'دعـوة فـرح' : 'Celebration of Love'}
                </span>
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>

              <p
                style={{ fontFamily: isAr ? 'Amiri, serif' : 'Playfair Display, serif' }}
                className="text-lg md:text-xl text-[#735C00] font-bold leading-relaxed mb-3"
              >
                {isAr
                  ? '« في ليلةٍ من ليالي العمر تُنسج فيها خيوط الفرح، ونبدأ معاً أولى خطوات الحلم.. »'
                  : '« On a magical night woven with joy, we begin our lifelong dream together.. »'}
              </p>

              <p className="text-sm md:text-base text-[#5E5E5C] leading-relaxed font-medium max-w-lg mx-auto">
                {isAr
                  ? 'يسعدنا ويشرفنا دعوتكم لتشاركونا فرحة العمر وجمال البدايات، فحضوركم يضيء ليلتنا ويزيد حفلنا بهجةً ونوراً، وبدعواتكم الصادقة تطيب أيامنا وتكتمل سعادتنا.'
                  : 'Together with our families, we joyfully invite you to celebrate our union. Your presence and heartfelt blessings will make our special celebration truly complete.'}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Couple Names & Featured Portrait Section */}
        <section className="text-center py-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            whileHover={{ y: -3 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="relative w-full px-6 py-8 rounded-3xl bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#F9F5EC] border-2 border-[#D4AF37] shadow-[0_14px_45px_rgba(212,175,55,0.2)]">
              {/* Arched / Circular Framed Real Portrait of the Couple */}
              <div className="relative mx-auto mb-5 w-44 h-44 md:w-52 md:h-52">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#BF953F] via-[#FCF6BA] to-[#AA771C] animate-pulse opacity-75" />
                <div
                  className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl cursor-pointer group"
                  onClick={() => setActiveImage(0)}
                  title={isAr ? 'اضغط لعرض الصورة بحجم كامل' : 'Click to view full size'}
                >
                  <img
                    src="/images/1.jpg"
                    alt="Mohamed & Nada"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                    <span>{isAr ? 'عرض الصورة 🔍' : 'View 🔍'}</span>
                  </div>
                </div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#735C00] text-white text-[11px] font-bold shadow-md whitespace-nowrap flex items-center gap-1.5 border border-[#FFDF73]/50">
                  <Heart className="w-3 h-3 fill-current text-[#FFDF73]" />
                  <span>{isAr ? 'محمد & ندى' : 'Mohamed & Nada'}</span>
                  <Heart className="w-3 h-3 fill-current text-[#FFDF73]" />
                </div>
              </div>

              <div>
                <span className="text-xs text-[#8C7326] tracking-[0.3em] uppercase block mb-1 font-bold">
                  {isAr ? 'حفل زفاف' : 'The Wedding of'}
                </span>

                <h1
                  style={{ fontFamily: isAr ? 'Amiri, serif' : 'Playfair Display, serif' }}
                  className="text-4xl md:text-5xl font-extrabold text-[#735C00] leading-tight mb-2"
                >
                  {isAr ? 'محمد & ندى' : 'Mohamed & Nada'}
                </h1>

                <p
                  style={{ fontFamily: isAr ? 'Amiri, serif' : 'Playfair Display, serif' }}
                  className="text-sm md:text-base text-[#5E5E5C] font-semibold italic tracking-wide"
                >
                  {isAr ? '« بارك الله لنا وبارك علينا وجمع بيننا في خير »' : 'Together, Forever Under God\'s Grace'}
                </p>
              </div>

              {/* Katb Ketab Commemorative Badge */}
              <div className="mt-5 pt-3.5 border-t border-[#D4AF37]/25 flex items-center justify-center gap-2 text-xs font-bold text-[#8C7326]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isAr ? 'تم بحمد الله عقد القران • ٢٠ أغسطس ٢٠٢٦' : 'Ceremony • August 20, 2026'}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Countdown Timer */}
        <section className="py-8">
          <div className="max-w-md mx-auto bg-[#FFFFFF] rounded-2xl p-6 border border-[#D4AF37]/25 shadow-sm">
            <h3
              style={{ fontFamily: isAr ? 'Cairo, sans-serif' : 'Playfair Display, serif' }}
              className="text-center text-xs tracking-widest uppercase text-[#8C7326] font-bold mb-4 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              {isAr ? 'العد التنازلي ليوم الحفل' : 'Countdown to The Big Day'}
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { labelAr: 'يوم', labelEn: 'Days', value: timeLeft.days },
                { labelAr: 'ساعة', labelEn: 'Hours', value: timeLeft.hours },
                { labelAr: 'دقيقة', labelEn: 'Mins', value: timeLeft.minutes },
                { labelAr: 'ثانية', labelEn: 'Secs', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] rounded-xl py-3 px-1 border border-[#D4AF37]/15 flex flex-col items-center"
                >
                  <span className="text-2xl md:text-3xl font-extrabold text-[#735C00] font-mono">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-[#5E5E5C] font-semibold mt-1">
                    {isAr ? item.labelAr : item.labelEn}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Add to Calendar Button under countdown */}
            <div className="mt-5 pt-3.5 border-t border-[#D4AF37]/20 text-center">
              <button
                onClick={() => setCalendarModalEvent(EVENTS_DATA.find((e) => e.id === 'wedding') || EVENTS_DATA[0])}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFFDF7] via-[#FAF5EB] to-[#F5EAD4] hover:from-[#FAF5EB] hover:to-[#EEDCB9] text-[#735C00] text-xs font-bold transition-all border border-[#D4AF37]/50 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95"
              >
                <CalendarPlus className="w-4 h-4 text-[#D4AF37]" />
                <span>{isAr ? 'حفظ موعد الزفاف في تقويمي 🔔' : 'Save Wedding Date to My Calendar 🔔'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MULTI-LOCATION & DATES SECTION (المواقع والمواعيد) */}
        {/* ========================================================= */}
        <section className="py-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/10 text-[#735C00] text-xs font-bold uppercase tracking-wider mb-2">
              <Navigation className="w-3.5 h-3.5" />
              {isAr ? 'مواعيد ومواقع الاحتفال' : 'Venues & Locations'}
            </div>
            <h2
              style={{ fontFamily: isAr ? 'Cairo, sans-serif' : 'Playfair Display, serif' }}
              className="text-2xl md:text-3xl font-bold text-[#1A1A1A]"
            >
              {isAr ? 'أين ومتى نلتقي؟' : 'When & Where'}
            </h2>
            <p className="text-xs md:text-sm text-[#5E5E5C] mt-1 max-w-sm mx-auto">
              {isAr
                ? 'اضغط على زر الخريطة لأي مناسبة لمعرفة الموقع والاتجاهات المباشرة'
                : 'Tap on Google Maps for easy driving directions to any event'}
            </p>
          </div>

          <div className="space-y-6">
            {EVENTS_DATA.map((event, index) => {
              const googleMapsUrl =
                event.mapUrl ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  event.mapQuery
                )}`;

              const isMainWedding = event.id === 'wedding';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -3 }}
                  className="w-full rounded-2xl"
                >
                  <div
                    className={`rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden ${
                      isMainWedding
                        ? 'bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF9] to-[#F9F5EC] border-2 border-[#D4AF37] shadow-[0_12px_35px_rgba(212,175,55,0.18)]'
                        : 'bg-white border border-[#D4AF37]/25 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Highlight Ribbon for main event */}
                    {isMainWedding && (
                      <div
                        className={`absolute top-0 ${
                          isAr ? 'left-0 rounded-br-2xl' : 'right-0 rounded-bl-2xl'
                        } bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 shadow-sm`}
                      >
                        {isAr ? '★ الحفل الرئيسي' : '★ Main Event'}
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        {/* Badge */}
                        <span className="inline-block text-[11px] font-bold text-[#8C7326] bg-[#D4AF37]/10 px-3 py-0.5 rounded-full">
                          {isAr ? event.badgeAr : event.badgeEn}
                        </span>

                        {/* Title */}
                        <h3
                          style={{ fontFamily: isAr ? 'Cairo, sans-serif' : 'Playfair Display, serif' }}
                          className="text-xl md:text-2xl font-bold text-[#1A1A1A]"
                        >
                          {isAr ? event.titleAr : event.titleEn}
                        </h3>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-[#404040]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
                            <span>{isAr ? event.dateAr : event.dateEn}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                            <span>{isAr ? event.timeAr : event.timeEn}</span>
                          </div>
                        </div>

                        {/* Venue & Address */}
                        <div className="pt-2 border-t border-[#D4AF37]/15 space-y-1">
                          <div className="flex items-start gap-2 text-xs md:text-sm">
                            <MapPin className="w-4 h-4 text-[#735C00] shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-[#1A1A1A]">
                                {isAr ? event.venueAr : event.venueEn}
                              </p>
                              <p className="text-xs text-[#5E5E5C]">
                                {isAr ? event.addressAr : event.addressEn}
                              </p>
                            </div>
                          </div>

                          {event.notesAr && (
                            <p className="text-[11px] text-[#8C7326] italic pt-1">
                              ℹ️ {isAr ? event.notesAr : event.notesEn}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons: Google Maps & Add to Calendar */}
                      <div className="md:shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 shadow-sm ${
                            isMainWedding
                              ? 'bg-[#735C00] hover:bg-[#594700] text-white'
                              : 'border-2 border-[#D4AF37] text-[#735C00] hover:bg-[#D4AF37] hover:text-white'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                          <span>{isAr ? 'الموقع على الخريطة' : 'Open in Google Maps'}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                        </a>

                        <button
                          onClick={() => setCalendarModalEvent(event)}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#FFFDF7] to-[#FAF5EB] hover:from-[#FAF5EB] hover:to-[#F3EAD7] text-[#735C00] border border-[#D4AF37]/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-95"
                        >
                          <CalendarPlus className="w-4 h-4 text-[#D4AF37]" />
                          <span>{isAr ? 'أضف لمفكرتي / تقويمي' : 'Add to Calendar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* PHOTO GALLERY SECTION (معرض الصور التفاعلي) */}
        {/* ========================================================= */}
        <section className="py-12 border-t border-[#D4AF37]/20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/10 text-[#735C00] text-xs font-bold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" />
              {isAr ? 'ستوديو ومعرض الصور' : 'Photo Studio & Memories'}
            </div>
            <h2
              style={{ fontFamily: isAr ? 'Cairo, sans-serif' : 'Playfair Display, serif' }}
              className="text-2xl md:text-3xl font-bold text-[#1A1A1A]"
            >
              {isAr ? 'أجمل اللحظات والذكريات' : 'Cherished Moments'}
            </h2>
            <p className="text-xs md:text-sm text-[#5E5E5C] mt-1">
              {isAr ? 'اضغط على أي صورة لتكبيرها وعرضها بحجم الشاشة الكامل' : 'Click any photo to view in full size'}
            </p>
          </div>

          {/* Photos Masonry - Complete Uncropped Images */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {GALLERY_IMAGES.map((img, idx) => (
              <motion.div
                key={img.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveImage(idx)}
                className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-b from-[#FFFDF9] to-[#F9F5EC] border-2 border-[#D4AF37]/35 shadow-md hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300 flex flex-col"
              >
                {/* Natural Image display - 100% full content, zero cropping */}
                <div className="relative w-full overflow-hidden bg-[#FAF6EE]">
                  <img
                    src={img.url}
                    alt={isAr ? img.titleAr : img.titleEn}
                    className="w-full h-auto block object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />

                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-[#735C00] text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {isAr ? 'تكبير وعرض كامل 🔍' : 'View Full Image 🔍'}
                    </span>
                  </div>

                  {/* Corner Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/55 backdrop-blur-sm border border-white/25 text-white text-[11px] font-semibold flex items-center gap-1 shadow">
                    <Sparkles className="w-2.5 h-2.5 text-[#FFDF73]" />
                    <span>{idx + 1}</span>
                  </div>
                </div>

                {/* Information Card Footer */}
                <div className={`p-3.5 bg-gradient-to-b from-[#FFFDF9] to-[#F6EFE2] border-t border-[#D4AF37]/25 ${isAr ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-sm md:text-base font-bold text-[#1A1A1A] leading-snug">
                    {isAr ? img.titleAr : img.titleEn}
                  </h3>
                  {img.captionAr && (
                    <p className="text-xs text-[#6B665E] mt-1 leading-relaxed">
                      {isAr ? img.captionAr : img.captionEn}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* LIGHTBOX MODAL (تكبير الصورة) */}
        {/* ========================================================= */}
        <AnimatePresence>
          {activeImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
              onClick={() => setActiveImage(null)}
            >
              <button
                onClick={() => setActiveImage(null)}
                aria-label="Close"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((prev) => (prev! > 0 ? prev! - 1 : GALLERY_IMAGES.length - 1));
                }}
                aria-label="Previous image"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((prev) => (prev! < GALLERY_IMAGES.length - 1 ? prev! + 1 : 0));
                }}
                aria-label="Next image"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div
                className="max-w-4xl w-full max-h-[92vh] rounded-3xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl bg-[#141414] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex-1 flex items-center justify-center p-2 sm:p-4 bg-black/60 overflow-hidden min-h-[300px]">
                  <img
                    src={GALLERY_IMAGES[activeImage].url}
                    alt={isAr ? GALLERY_IMAGES[activeImage].titleAr : GALLERY_IMAGES[activeImage].titleEn}
                    className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                  />
                </div>
                <div className="bg-gradient-to-b from-[#1C1C1C] to-[#121212] px-6 py-4 border-t border-[#D4AF37]/30 text-center">
                  <div className="flex items-center justify-between text-xs text-[#D4AF37] mb-1 font-bold">
                    <span>{isAr ? `صورة ${activeImage + 1} من ${GALLERY_IMAGES.length}` : `Photo ${activeImage + 1} of ${GALLERY_IMAGES.length}`}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#FFDF73]" />
                  </div>
                  <h4 className="text-white text-base md:text-lg font-bold">
                    {isAr ? GALLERY_IMAGES[activeImage].titleAr : GALLERY_IMAGES[activeImage].titleEn}
                  </h4>
                  {GALLERY_IMAGES[activeImage].captionAr && (
                    <p className="text-white/70 text-xs md:text-sm mt-1">
                      {isAr ? GALLERY_IMAGES[activeImage].captionAr : GALLERY_IMAGES[activeImage].captionEn}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* CALENDAR MODAL (إضافة لتقويم الموبايل) */}
        {/* ========================================================= */}
        <AnimatePresence>
          {calendarModalEvent !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
              onClick={() => setCalendarModalEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative max-w-md w-full rounded-3xl bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#F9F5EC] border-2 border-[#D4AF37] p-6 sm:p-8 shadow-[0_20px_50px_rgba(212,175,55,0.25)] text-center overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setCalendarModalEvent(null)}
                  aria-label="Close"
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#8C7326] hover:text-[#1A1A1A] p-2 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Icon Badge */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#D4AF37]/20 to-[#FFDF73]/40 border border-[#D4AF37]/40 flex items-center justify-center text-[#735C00] shadow-sm">
                  <CalendarPlus className="w-8 h-8 text-[#997A15]" />
                </div>

                <span className="text-[11px] font-bold tracking-[0.2em] text-[#8C7326] uppercase bg-[#D4AF37]/15 px-3.5 py-1 rounded-full inline-block mb-2">
                  {isAr ? 'حفظ الموعد في المفكرة' : 'Add to Calendar'}
                </span>

                <h3
                  style={{ fontFamily: isAr ? 'Cairo, sans-serif' : 'Playfair Display, serif' }}
                  className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2"
                >
                  {isAr ? calendarModalEvent.titleAr : calendarModalEvent.titleEn}
                </h3>

                {/* Event Details Pill */}
                <div className="bg-[#FAF6EE] rounded-2xl p-3 mb-5 border border-[#D4AF37]/25 text-xs text-[#5E5E5C] space-y-1.5">
                  <div className="flex items-center justify-center gap-2 font-semibold text-[#735C00]">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{isAr ? calendarModalEvent.dateAr : calendarModalEvent.dateEn}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[#735C00]">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{isAr ? calendarModalEvent.timeAr : calendarModalEvent.timeEn}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[#6B665E]">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{isAr ? calendarModalEvent.venueAr : calendarModalEvent.venueEn}</span>
                  </div>
                </div>

                <p className="text-xs text-[#6B665E] mb-5 leading-relaxed">
                  {isAr
                    ? 'اختر تقويم جهازك المفضل لحفظ الموعد مع تذكير تلقائي مسبق قبل الحفل'
                    : 'Select your preferred calendar to save the date with an automated reminder'}
                </p>

                {/* Calendar Options */}
                <div className="space-y-3">
                  {/* Google Calendar Option */}
                  <a
                    href={getGoogleCalendarUrl(calendarModalEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      triggerConfetti();
                      setTimeout(() => setCalendarModalEvent(null), 900);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-white hover:bg-[#FAF7F0] border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#1A1A1A] font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-200 shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.5 3h-1V1.5a.75.75 0 00-1.5 0V3h-10V1.5a.75.75 0 00-1.5 0V3h-1C3.57 3 2.25 4.32 2.25 5.95v13.1c0 1.63 1.32 2.95 2.95 2.95h14.3c1.63 0 2.95-1.32 2.95-2.95V5.95C22.45 4.32 21.13 3 19.5 3zm1.45 16.05c0 .8-.65 1.45-1.45 1.45H5.2c-.8 0-1.45-.65-1.45-1.45V8.25h17.2v10.8zm0-12.3H3.75V5.95c0-.8.65-1.45 1.45-1.45h1V6a.75.75 0 001.5 0V4.5h10V6a.75.75 0 001.5 0V4.5h1c.8 0 1.45.65 1.45 1.45v.8z"/>
                        </svg>
                      </div>
                      <div className={isAr ? 'text-right' : 'text-left'}>
                        <div className="font-bold text-[#1A1A1A]">Google Calendar</div>
                        <div className="text-[11px] text-[#777] font-normal">
                          {isAr ? 'حفظ مباشر في تقويم جوجل أندرويد والويب' : 'Direct add for Android & Web'}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </a>

                  {/* Apple Calendar / Outlook (.ics) Option */}
                  <button
                    onClick={() => {
                      triggerConfetti();
                      downloadIcs(calendarModalEvent);
                      setTimeout(() => setCalendarModalEvent(null), 900);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#735C00] via-[#8C7326] to-[#9E832F] hover:from-[#5E4B00] hover:to-[#735C00] text-white font-bold text-xs sm:text-sm shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                        <Bell className="w-5 h-5 text-[#FFE58F]" />
                      </div>
                      <div className={isAr ? 'text-right' : 'text-left'}>
                        <div className="font-bold">Apple Calendar & Outlook</div>
                        <div className="text-[11px] text-white/80 font-normal">
                          {isAr ? 'ملف تقويم لهواتف آيفون وبرامج أوتلوك مع تذكير' : 'iPhone (.ics) file with 1-day reminder'}
                        </div>
                      </div>
                    </div>
                    <CalendarPlus className="w-4 h-4 text-[#FFDF73] group-hover:scale-110 transition-transform shrink-0" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* CONGRATULATIONS & BLESSINGS (إرسال تهنئة عبر واتساب) */}
        {/* ========================================================= */}
        <section className="py-12 border-t border-[#D4AF37]/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto rounded-3xl p-8 text-center bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#F9F5EC] border-2 border-[#D4AF37] shadow-[0_12px_40px_rgba(212,175,55,0.18)] relative overflow-hidden"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] shadow-sm">
              <MessageCircle className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-bold tracking-[0.25em] text-[#8C7326] uppercase bg-[#D4AF37]/15 px-4 py-1 rounded-full inline-block mb-3">
              {isAr ? 'شاركونا فرحتكم وتبريكاتكم' : 'Send Your Wishes'}
            </span>

            <h3
              style={{ fontFamily: isAr ? 'Amiri, serif' : 'Playfair Display, serif' }}
              className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] mb-2"
            >
              {isAr ? 'أرسل تهنئتك للعروسين' : 'Send Congratulations to Mohamed & Nada'}
            </h3>

            <p className="text-xs md:text-sm text-[#5E5E5C] max-w-md mx-auto leading-relaxed mb-6">
              {isAr
                ? 'اضغط لاختيار إرسال تهنئتك ومباركتك مباشرة عبر واتساب للعريس أو العروسة'
                : 'Choose below to send your warm wishes directly via WhatsApp to the groom or bride'}
            </p>

            {/* WhatsApp Congratulations Buttons (Groom & Bride) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              {/* Groom Button */}
              <button
                onClick={handleSendGroomCongratulations}
                className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:from-[#0e6f64] hover:to-[#1eb855] text-white font-bold text-xs md:text-sm shadow-md shadow-[#25D366]/25 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span>{isAr ? 'تهنئة العريس 🤵🏻‍♂️' : 'Congratulate Groom 🤵🏻‍♂️'}</span>
              </button>

              {/* Bride Button */}
              <button
                onClick={handleSendBrideCongratulations}
                className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#B84758] via-[#D45D79] to-[#25D366] hover:from-[#9c3645] hover:to-[#1eb855] text-white font-bold text-xs md:text-sm shadow-md shadow-[#B84758]/25 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 fill-current shrink-0" />
                <span>{isAr ? 'تهنئة العروسة 👰🏻‍♀️' : 'Congratulate Bride 👰🏻‍♀️'}</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* ========================================================= */}
        {/* SHARE & FOOTER (المشاركة والخاتمة) */}
        {/* ========================================================= */}
        <footer className="pt-8 pb-16 text-center border-t border-[#D4AF37]/20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#735C00]">
              <Heart className="w-6 h-6 fill-current text-[#D4AF37]" />
            </div>

            <h3
              style={{ fontFamily: isAr ? 'Amiri, serif' : 'Playfair Display, serif' }}
              className="text-2xl md:text-3xl font-bold text-[#735C00]"
            >
              {isAr ? 'عقبال عندكم جميعاً .. دمتم بكل خير ودامت دياركم عامرة بالأفراح' : 'Thank You For Celebrating With Us!'}
            </h3>

            <p className="text-xs md:text-sm text-[#5E5E5C] max-w-md mx-auto leading-relaxed">
              {isAr
                ? 'وجودكم ومشاركتكم فرحتنا تزيدنا بهجة وسروراً .. نتطلع لرؤيتكم جميعاً في هذا اليوم المميز'
                : 'Your presence brings immense joy to our celebration. We look forward to seeing you.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#735C00] hover:bg-[#594700] text-white font-bold text-xs shadow-md transition-all hover:scale-105"
              >
                <Share2 className="w-4 h-4" />
                <span>{isAr ? 'مشاركة الدعوة عبر واتساب' : 'Share Invitation'}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#FAF8F5] text-[#1A1A1A] border border-[#D4AF37]/40 font-bold text-xs shadow-sm transition-all hover:scale-105"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (isAr ? 'تم نسخ الرابط!' : 'Copied!') : isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
              </button>
            </div>
          </motion.div>
        </footer>
      </main>
    </div>
  );
}
