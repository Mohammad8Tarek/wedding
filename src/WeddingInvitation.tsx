import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Send,
  ChevronsDown,
  Pause,
  Play,
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

// معرض صور العروسين - الصور تُقرأ من مجلد public/images/
const GALLERY_IMAGES = [
  {
    id: 1,
    url: '/images/1.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    titleAr: 'لحظات البداية',
    titleEn: 'The Beginning',
  },
  {
    id: 2,
    url: '/images/2.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    titleAr: 'خاتم العهد',
    titleEn: 'The Vow Rings',
  },
  {
    id: 3,
    url: '/images/3.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    titleAr: 'لحظة الفرحة',
    titleEn: 'Joyful Moments',
  },
  {
    id: 4,
    url: '/images/4.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    titleAr: 'معاً إلى الأبد',
    titleEn: 'Together Forever',
  },
  {
    id: 5,
    url: '/images/5.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
    titleAr: 'تفاصيل أنيقة',
    titleEn: 'Elegant Details',
  },
  {
    id: 6,
    url: '/images/6.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    titleAr: 'حب وسلام',
    titleEn: 'Love & Serenity',
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

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
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

        const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0.1, currentOpacity)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
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
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
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
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoScrollRef = useRef<number | null>(null);

  const isAr = language === 'ar';

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
      }, 500);
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

  // Audio Toggle
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.log('Audio autoplay prevented:', err));
      setIsPlaying(true);
    }
  };

  // Open Envelope with 3D animation
  const handleOpenEnvelope = useCallback(() => {
    if (isOpeningAnimation || isEnvelopeOpen) return;
    setIsOpeningAnimation(true);
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch((err) => console.log('Audio error:', err));
      setIsPlaying(true);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => {
      setIsEnvelopeOpen(true);
    }, 1100);
  }, [isOpeningAnimation, isEnvelopeOpen, isPlaying]);

  // فتح الجواب تلقائياً بعد 3.5 ثانية إذا لم يلمس الضيف الختم
  useEffect(() => {
    if (!isEnvelopeOpen && !isOpeningAnimation) {
      const autoTimer = setTimeout(() => {
        handleOpenEnvelope();
      }, 3500);
      return () => clearTimeout(autoTimer);
    }
  }, [isEnvelopeOpen, isOpeningAnimation, handleOpenEnvelope]);

  // Share on WhatsApp
  const handleWhatsAppShare = () => {
    const text = isAr
      ? '💍 بارك الله لهما وبارك عليهما واجمع بينهما في خير .. يسعدنا ويشرفنا دعوتكم لحضور حفل زفافنا:\n' +
        window.location.href
      : '💍 We joyfully invite you to celebrate our wedding!\n' + window.location.href;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Send Congratulations directly to groom's WhatsApp
  const handleSendCongratulations = () => {
    const phoneNumber = '201270080682';
    const message = isAr
      ? 'ألف مبروك يا عريسنا الغالي محمد ويا عروستنا ندى! 💍🎉 بارك الله لكما وبارك عليكما وجمع بينكما في خير، ودامت دياركم عامرة بالأفراح والمسرات 🤍✨'
      : 'Dearest Mohamed & Nada! 💍 Huge congratulations on your wedding! Wishing you a lifetime of love, joy, and blessings 🤍';
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

      {/* Ambient Canvas Particles */}
      <AmbientGoldParticles />

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
      {/* ROMANTIC BLUSH & FLORAL ENVELOPE MODAL (الجواب الرومانسي البوهيمي) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {!isEnvelopeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none overflow-hidden"
          >
            {/* Romantic Floral Flat-Lay Background */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
              style={{
                backgroundImage: 'url(/blush-floral-bg.jpg)',
                filter: 'brightness(0.92) contrast(1.03)',
              }}
            />

            {/* Soft Ambient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A0E14]/40 via-transparent to-[#2A0E14]/30 pointer-events-none" />
            <div className="absolute inset-0 backdrop-blur-[1px] bg-rose-950/10 pointer-events-none" />

            <div className="relative w-full max-w-lg flex flex-col items-center z-10">
              {/* Header Title */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-6"
              >
                <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#D4AF37]/50 mb-2.5 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-[11px] font-bold text-[#735C00] tracking-widest uppercase">
                    {isAr ? 'بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ' : 'In The Name of God'}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '4s' }} />
                </div>

                <h2
                  style={{ fontFamily: isAr ? 'Amiri, serif' : 'Playfair Display, serif' }}
                  className="text-3xl md:text-4xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                >
                  {isAr ? 'حفل زفاف محمد & ندى' : 'Wedding of Mohamed & Nada'}
                </h2>
                <p className="text-xs md:text-sm text-[#FFE699] mt-1 tracking-wider font-semibold drop-shadow">
                  {isAr ? 'الأحد، 11 أكتوبر 2026 • قاعة اسنو وايت' : 'Sunday, October 11, 2026 • Snow White Ballroom'}
                </p>
              </motion.div>

              {/* 3D Envelope Wrapper */}
              <div
                style={{ perspective: 1400 }}
                className="relative w-full aspect-[16/11] max-w-[430px] flex items-center justify-center cursor-pointer"
                onClick={handleOpenEnvelope}
              >
                {/* Envelope 3D Body */}
                <motion.div
                  animate={
                    isOpeningAnimation
                      ? { scale: 1.04, y: 15 }
                      : { y: [0, -6, 0] }
                  }
                  transition={
                    isOpeningAnimation
                      ? { duration: 0.6 }
                      : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
                  }
                  className="relative w-full h-full rounded-[24px] shadow-2xl overflow-visible"
                  style={{
                    transformStyle: 'preserve-3d',
                    boxShadow:
                      '0 30px 60px -12px rgba(45, 10, 18, 0.6), 0 0 35px rgba(220, 160, 170, 0.3)',
                  }}
                >
                  {/* Outer Rose-Gold Metallic Border Frame */}
                  <div className="absolute -inset-[2px] rounded-[26px] bg-gradient-to-b from-[#E8B4B8] via-[#D4AF37] to-[#E8B4B8] opacity-90 z-0 shadow-sm" />

                  {/* Envelope Base / Backplate (Blush Linen Texture) */}
                  <div
                    className="absolute inset-0 rounded-[24px] overflow-hidden z-0"
                    style={{
                      background: 'radial-gradient(circle at 50% 30%, #FFF9F6 0%, #F8ECE6 70%, #EEDCD3 100%)',
                    }}
                  >
                    {/* Interior Floral Watercolor Lining Pattern */}
                    <div
                      className="absolute inset-0 opacity-25 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(#9E3B4D 1.5px, transparent 1.5px), radial-gradient(#D4AF37 1.5px, #FFF9F6 1.5px)`,
                        backgroundSize: '22px 22px',
                        backgroundPosition: '0 0, 11px 11px',
                      }}
                    />
                  </div>

                  {/* THE INVITATION CARD INSIDE (Slides UP on open) */}
                  <motion.div
                    animate={
                      isOpeningAnimation
                        ? { y: -125, opacity: 1, scale: 1.03 }
                        : { y: 0, opacity: 0.94 }
                    }
                    transition={{ duration: 0.85, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute inset-x-5 top-5 bottom-3 rounded-xl bg-white border-2 border-[#D4AF37] shadow-lg flex flex-col items-center justify-center p-4 text-center z-10 overflow-hidden"
                    style={{
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF5F2 100%)',
                    }}
                  >
                    <div className="w-full h-full border border-[#D4AF37]/40 rounded-lg p-3 flex flex-col items-center justify-between relative">
                      <div className="flex items-center gap-1.5 text-[#D4AF37]">
                        <span className="w-6 h-[1px] bg-[#D4AF37]" />
                        <Heart className="w-2.5 h-2.5 fill-current" />
                        <span className="w-6 h-[1px] bg-[#D4AF37]" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7326] font-bold block mb-1">
                          {isAr ? 'دعوة زفاف خاصة' : 'Wedding Invitation'}
                        </span>
                        <h3
                          style={{ fontFamily: isAr ? 'Amiri, serif' : 'Playfair Display, serif' }}
                          className="text-2xl md:text-3xl font-extrabold text-[#735C00] leading-none"
                        >
                          {isAr ? 'محمد & ندى' : 'Mohamed & Nada'}
                        </h3>
                        <p className="text-[11px] text-[#5E5E5C] mt-1 font-semibold">
                          {isAr ? '11 أكتوبر 2026 • قاعة اسنو وايت' : 'October 11, 2026 • Snow White'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#D4AF37]">
                        <span className="w-6 h-[1px] bg-[#D4AF37]" />
                        <Heart className="w-2.5 h-2.5 fill-current" />
                        <span className="w-6 h-[1px] bg-[#D4AF37]" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Front Pocket Left Flap */}
                  <div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      clipPath: 'polygon(0 0, 0 100%, 50% 50%)',
                      background: 'linear-gradient(135deg, #FAF4EF 0%, #EFE1D8 100%)',
                      filter: 'drop-shadow(3px 0 5px rgba(0,0,0,0.06))',
                      borderLeft: '1px solid rgba(212, 175, 55, 0.3)',
                    }}
                  />

                  {/* Front Pocket Right Flap */}
                  <div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)',
                      background: 'linear-gradient(225deg, #FAF4EF 0%, #EFE1D8 100%)',
                      filter: 'drop-shadow(-3px 0 5px rgba(0,0,0,0.06))',
                      borderRight: '1px solid rgba(212, 175, 55, 0.3)',
                    }}
                  />

                  {/* Front Pocket Bottom Flap */}
                  <div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      clipPath: 'polygon(0 100%, 100% 100%, 50% 45%)',
                      background: 'linear-gradient(0deg, #EFE1D8 0%, #E5D3C8 100%)',
                      filter: 'drop-shadow(0 -3px 6px rgba(0,0,0,0.08))',
                      borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
                    }}
                  >
                    {/* Bottom Botanical Emblem */}
                    <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center">
                      <span className="text-[10px] tracking-[0.25em] font-bold text-[#8C7326] uppercase opacity-75">
                        M • N • 2026
                      </span>
                    </div>
                  </div>

                  {/* Silk Chiffon Blush Ribbon (Vertical) */}
                  <motion.div
                    animate={{ opacity: isOpeningAnimation ? 0 : 1 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-9 pointer-events-none z-25"
                    style={{
                      background:
                        'linear-gradient(90deg, #D49B9E 0%, #F5D3D6 30%, #FFF2F4 50%, #F5D3D6 70%, #C98A8E 100%)',
                      boxShadow: '0 0 10px rgba(0,0,0,0.18), inset 0 0 2px rgba(255,255,255,0.7)',
                    }}
                  >
                    <div className="w-full h-full opacity-35 border-x border-white/60" />
                  </motion.div>

                  {/* TOP FLAP (3D Animated Flap) */}
                  <motion.div
                    animate={{
                      rotateX: isOpeningAnimation ? -180 : 0,
                    }}
                    transition={{
                      duration: 0.65,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    style={{
                      transformOrigin: 'top center',
                      transformStyle: 'preserve-3d',
                      zIndex: isOpeningAnimation ? 5 : 30,
                    }}
                    className="absolute inset-x-0 top-0 h-full pointer-events-none"
                  >
                    {/* Flap Front Face */}
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 50% 55%)',
                        background: 'linear-gradient(180deg, #FCF7F3 0%, #F3E5DC 80%, #E9D7CC 100%)',
                        filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.15))',
                        borderTop: '2px solid rgba(212, 175, 55, 0.4)',
                      }}
                    >
                      {/* Rose Gold filigree chevron edge line */}
                      <div
                        className="absolute inset-0"
                        style={{
                          clipPath: 'polygon(0 0, 100% 0, 50% 55%, 50% 53%, 98% 2%, 2% 2%)',
                          background: 'linear-gradient(90deg, #D4AF37, #FADBD8, #D4AF37)',
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* ========================================================= */}
                  {/* ROMANTIC DUSTY-ROSE 3D WAX SEAL (ختم الشمع الرومانسي) */}
                  {/* ========================================================= */}
                  <motion.div
                    animate={
                      isOpeningAnimation
                        ? { scale: 1.35, opacity: 0, y: -20 }
                        : { scale: [1, 1.04, 1] }
                    }
                    transition={
                      isOpeningAnimation
                        ? { duration: 0.4, ease: 'easeOut' }
                        : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
                    }
                    className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer"
                  >
                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                      {/* Outer Wax Irregular Melt Edge */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            'radial-gradient(circle at 35% 30%, #B84758 0%, #8A2536 50%, #570F1D 85%, #380711 100%)',
                          boxShadow:
                            '0 12px 25px rgba(65, 10, 20, 0.55), inset 0 3px 6px rgba(255, 255, 255, 0.45), inset 0 -4px 8px rgba(0, 0, 0, 0.6)',
                          borderRadius: '49% 51% 52% 48% / 51% 48% 52% 49%',
                        }}
                      />

                      {/* Rose Gold Stamped Beaded Ring */}
                      <div className="relative w-15 h-15 md:w-18 md:h-18 rounded-full border-2 border-[#F7D2B8]/90 flex flex-col items-center justify-center shadow-inner bg-gradient-to-b from-[#7A1E2E] via-[#5C111F] to-[#400A14]">
                        {/* Stamped Initials in Gold Foil Calligraphy */}
                        <span
                          style={{ fontFamily: 'Amiri, serif' }}
                          className="text-xl md:text-2xl font-bold leading-none text-[#FFF3D6] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                        >
                          م & ن
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-[#F7D2B8]" />
                          <span className="text-[8px] tracking-[0.2em] font-extrabold text-[#F7D2B8] uppercase">
                            OPEN
                          </span>
                          <Sparkles className="w-2.5 h-2.5 text-[#F7D2B8]" />
                        </div>
                      </div>

                      {/* Pulsing Beacon Ring */}
                      <span className="absolute -inset-2 rounded-full border border-[#F7D2B8]/60 animate-ping pointer-events-none opacity-65" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Bottom Interactive Prompt Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-7 text-center"
              >
                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8B4B8] text-xs md:text-sm font-bold text-[#7A1E2E] shadow-[0_6px_25px_rgba(122,30,46,0.25)] hover:scale-105 transition-all">
                  <Heart className="w-4 h-4 text-[#B84758] fill-current animate-pulse" />
                  <span>{isAr ? 'إلمس الختم الشمعي لفتح الدعوة 🌸' : 'Touch the seal to open 🌸'}</span>
                </div>
                <p className="text-white/80 text-[11px] mt-2 font-medium drop-shadow">
                  {isAr ? '🎶 ستعمل الموسيقى الاحتفالية عند فتح المظروف' : '🎶 Music will play automatically upon opening'}
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

            <p className="text-sm md:text-base text-[#5E5E5C] leading-relaxed font-medium">
              {isAr
                ? 'يسعدنا ويشرفنا دعوتكم لتشاركونا أجمل لحظات العمر بفرحتنا باحتفال زفافنا'
                : 'Together with our families, we joyfully invite you to celebrate our union'}
            </p>
          </motion.div>
        </section>

        {/* Couple Names Section */}
        <section className="text-center py-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative inline-block px-8 py-6 rounded-3xl bg-gradient-to-b from-[#FAF8F5] to-[#F3EEE3] border border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(212,175,55,0.12)]"
          >
            <span className="text-xs text-[#8C7326] tracking-[0.3em] uppercase block mb-2 font-bold">
              {isAr ? 'زفاف' : 'The Wedding of'}
            </span>

            <h1
              style={{ fontFamily: isAr ? 'Amiri, serif' : 'Playfair Display, serif' }}
              className="text-4xl md:text-6xl font-extrabold text-[#735C00] leading-tight mb-2"
            >
              {isAr ? 'محمد & ندى' : 'Mohamed & Nada'}
            </h1>

            <p className="text-sm md:text-base italic text-[#5E5E5C] tracking-wide">
              {isAr ? 'معاً إلى الأبد بإذن الله' : 'Together, Forever'}
            </p>
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

                    {/* Action Button: Google Maps */}
                    <div className="md:shrink-0 flex items-center">
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs transition-all duration-200 shadow-sm ${
                          isMainWedding
                            ? 'bg-[#735C00] hover:bg-[#594700] text-white'
                            : 'border-2 border-[#D4AF37] text-[#735C00] hover:bg-[#D4AF37] hover:text-white'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{isAr ? 'الموقع على الخريطة' : 'Open in Google Maps'}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
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
              {isAr ? 'معرض الذكريات والصور' : 'Our Memories'}
            </div>
            <h2
              style={{ fontFamily: isAr ? 'Cairo, sans-serif' : 'Playfair Display, serif' }}
              className="text-2xl md:text-3xl font-bold text-[#1A1A1A]"
            >
              {isAr ? 'أجمل اللحظات' : 'Cherished Moments'}
            </h2>
            <p className="text-xs md:text-sm text-[#5E5E5C] mt-1">
              {isAr ? 'اضغط على أي صورة لتكبيرها' : 'Click any photo to view in full size'}
            </p>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {GALLERY_IMAGES.map((img, idx) => (
              <motion.div
                key={img.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveImage(idx)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-[#F3EEE3] border border-[#D4AF37]/30 shadow-sm"
              >
                <img
                  src={img.url}
                  alt={isAr ? img.titleAr : img.titleEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    const fallback = img.fallbackUrl;
                    if (fallback && e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-xs font-medium">
                    {isAr ? img.titleAr : img.titleEn}
                  </span>
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
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setActiveImage(null)}
            >
              <button
                onClick={() => setActiveImage(null)}
                aria-label="Close"
                className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((prev) => (prev! > 0 ? prev! - 1 : GALLERY_IMAGES.length - 1));
                }}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage((prev) => (prev! < GALLERY_IMAGES.length - 1 ? prev! + 1 : 0));
                }}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div
                className="max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={GALLERY_IMAGES[activeImage].url}
                  alt={isAr ? GALLERY_IMAGES[activeImage].titleAr : GALLERY_IMAGES[activeImage].titleEn}
                  className="w-full h-full max-h-[80vh] object-contain"
                  onError={(e) => {
                    const fallback = GALLERY_IMAGES[activeImage].fallbackUrl;
                    if (fallback && e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
                <div className="bg-[#1A1A1A] text-center py-2 text-white/90 text-sm">
                  {isAr
                    ? GALLERY_IMAGES[activeImage].titleAr
                    : GALLERY_IMAGES[activeImage].titleEn}
                </div>
              </div>
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
                ? 'اضغط على الزر لكتابة تهنئتك ومباركتك مباشرة عبر واتساب للعريس (محمد)'
                : 'Click below to send your warm wishes directly via WhatsApp to the groom (Mohamed)'}
            </p>

            {/* Big WhatsApp Congratulations Button */}
            <button
              onClick={handleSendCongratulations}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba59] hover:to-[#0f7569] text-white font-bold text-sm md:text-base shadow-lg shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{isAr ? 'إرسال تهنئة عبر واتساب 💬' : 'Send Wishes via WhatsApp 💬'}</span>
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
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
