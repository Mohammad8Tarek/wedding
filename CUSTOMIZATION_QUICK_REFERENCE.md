# 🎨 Customization Quick Reference

Fast lookup guide for common modifications to the wedding invitation SPA.

---

## 📝 Text & Content

### Change Couple Names
**File**: `src/components/WeddingInvitation.tsx`  
**Location**: Hero Section component  
**Code**:
```typescript
<span style={{ color: '#d4af37' }}>REPLACE_WITH_YOUR_NAMES</span>
```

### Update Wedding Date
**File**: `src/components/WeddingInvitation.tsx`  
**Location**: `useCountdown` hook  
**Code**:
```typescript
const targetDate = new Date(2025, 5, 15); // June 15, 2025
// Format: new Date(YEAR, MONTH-1, DAY)
// ⚠️ Month is 0-indexed (0=January, 11=December)
```

### Change Hero Subtitle
**File**: `src/components/WeddingInvitation.tsx`  
**Translation Key**: `heroSubtitle`  
**Current**: "Together, Forever"  
**Update in**:
```typescript
const translations: Translations = {
  en: {
    heroSubtitle: 'Your Custom Text',
  },
  ar: {
    heroSubtitle: 'نصك المخصص',
  },
};
```

### Update Venue Information
**File**: `src/components/WeddingInvitation.tsx`  
**Location**: `TimelineSection` component  
**Code**:
```typescript
venueAddress: 'Your Address Line 1\nYour City, State ZIP'
```

### Change All Event Times
**File**: `src/components/WeddingInvitation.tsx`  
**Location**: `events` array in `TimelineSection`  
**Code**:
```typescript
const events = [
  { 
    title: t.timelineReception, 
    time: '5:00 PM - 7:00 PM' // ← Change this
  },
  { 
    title: t.timelineCeremony, 
    time: '7:00 PM - 8:00 PM' // ← Change this
  },
  { 
    title: t.timelineDinner, 
    time: '8:00 PM - 11:00 PM' // ← Change this
  },
];
```

---

## 🎨 Colors & Design

### Change Gold Accent Color
**Method 1** - Find & Replace (Search All Files):
```
Find:    #d4af37
Replace: #YOUR_HEX_COLOR
```

**Method 2** - Create Color Constants:
```typescript
const COLORS = {
  gold: '#d4af37',    // Primary accent
  cream: '#faf9f6',   // Background
  text: '#1a1a1a',    // Main text
  light: '#f5f3ee',   // Light accents
  gray: '#999',       // Secondary text
};

// Then use: style={{ color: COLORS.gold }}
```

### Change Background Gradient
**File**: `src/components/WeddingInvitation.tsx`  
**Search for**: `background: 'linear-gradient`  
**Example**:
```typescript
// Current
background: 'linear-gradient(135deg, #faf9f6 0%, #f5f3ee 100%)'

// Change to your gradient
background: 'linear-gradient(180deg, #ffffff 0%, #f0ede6 100%)'
```

### Change Wax Seal Color
**File**: `src/components/WeddingInvitation.tsx`  
**Location**: `WaxSeal` component  
**Code**:
```typescript
// Current red seal
background: 'radial-gradient(circle at 35% 35%, #e84c3d, #c92f24)'

// Change to:
background: 'radial-gradient(circle at 35% 35%, #YOUR_COLOR1, #YOUR_COLOR2)'
```

### Customize Envelope Paper Texture
**File**: `src/components/WeddingInvitation.tsx`  
**Location**: Envelope flaps  
**Code**:
```typescript
// Top Flap
background: 'linear-gradient(180deg, #f0ede6 0%, #faf9f6 100%)'

// Change both gradient colors and direction
background: 'linear-gradient(direction, #COLOR1 0%, #COLOR2 100%)'
```

---

## 🎵 Audio

### Replace Audio Track
**File**: `src/components/WeddingInvitation.tsx`  
**Current**: Pixabay audio  
**Code**:
```typescript
<audio
  ref={audioRef}
  src="YOUR_AUDIO_URL_HERE"
  loop
  crossOrigin="anonymous"
/>
```

**Free Music Sources**:
- Pixabay: https://pixabay.com/music/
- Free Music Archive: https://freemusicarchive.org/
- Incompetech: https://incompetech.com/
- YouTube Audio Library: https://www.youtube.com/audiolibrary

**CORS Requirement**: Audio URL must have `Access-Control-Allow-Origin: *`

### Change Audio Loop Behavior
**Current**: Loops indefinitely  
**To make non-looping**:
```typescript
// Remove the loop attribute
<audio
  ref={audioRef}
  src="YOUR_URL"
  // Remove: loop
/>
```

### Disable Audio Completely
**Option 1** - Remove audio element:
```typescript
{/* Remove the entire audio tag */}
```

**Option 2** - Remove audio control:
```typescript
{/* Remove the AudioControl component from return */}
```

---

## 🌍 Language & Translations

### Add New Language
**File**: `src/components/WeddingInvitation.tsx`  
**Step 1** - Update type:
```typescript
type Language = 'en' | 'ar' | 'es'; // Add 'es'
```

**Step 2** - Add translations:
```typescript
const translations: Translations = {
  en: { /* ... */ },
  ar: { /* ... */ },
  es: {
    heroMain: 'La Boda de',
    heroDate: 'Sábado, 15 de junio de 2024',
    // ... all other keys
  },
};
```

**Step 3** - Update language detection:
```typescript
const useLanguage = (): Language => {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const detectedLanguage: Language = 
    browserLang === 'ar' ? 'ar' :
    browserLang === 'es' ? 'es' :
    'en';
  
  return detectedLanguage;
};
```

### Change Language Detection
**Current**: Auto-detects from `navigator.language`  
**To force a language**:
```typescript
// In useLanguage hook
useEffect(() => {
  const forcedLanguage: Language = 'en'; // or 'ar'
  setLanguage(forcedLanguage);
  document.documentElement.dir = forcedLanguage === 'ar' ? 'rtl' : 'ltr';
}, []);
```

### Change Font for Language
**File**: `src/index.css` and component  
**Current**:
```typescript
fontFamily: language === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif"
```

**Change to**:
```typescript
fontFamily: language === 'ar' ? "'Droid Arabic Kufi'" : "'Poppins'"
```

**Update Google Fonts import** in component:
```typescript
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap';
```

---

## ⏳ Countdown Timer

### Change Target Date
**File**: `src/components/WeddingInvitation.tsx`  
**Function**: `useCountdown`  
**Code**:
```typescript
const targetDate = new Date(2025, 6, 15); // July 15, 2025
```

### Display Only Days & Hours
**File**: `src/components/WeddingInvitation.tsx`  
**Location**: `CountdownSection`  
**Code**:
```typescript
const items = [
  { value: String(timeLeft.days).padStart(2, '0'), label: t.countdownDays },
  { value: String(timeLeft.hours).padStart(2, '0'), label: t.countdownHours },
  // Remove minutes and seconds below
];
```

### Change Countdown Grid Columns
**Current**: 4 columns (grid-cols-4)  
**File**: `src/components/WeddingInvitation.tsx`  
**Code**:
```typescript
<div className="grid grid-cols-2 gap-3 md:gap-6 max-w-2xl mx-auto">
  {/* 2 columns instead of 4 */}
</div>
```

---

## 📝 RSVP Form

### Add New Form Fields
**File**: `src/components/WeddingInvitation.tsx`  
**Step 1** - Update interface:
```typescript
interface RSVPData {
  name: string;
  attendance: 'yes' | 'no';
  guests: number;
  wishes: string;
  email?: string;  // Add new field
}
```

**Step 2** - Add form input:
```typescript
<motion.div>
  <label className="block text-sm font-medium mb-2">Email Address</label>
  <input
    type="email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    className="w-full px-4 py-3 rounded-lg border-2 border-rgba(212, 175, 55, 0.2)"
    placeholder="your@email.com"
  />
</motion.div>
```

### Change Guest Count Options
**Current**: 1-6 guests  
**File**: `src/components/WeddingInvitation.tsx`  
**Code**:
```typescript
<select value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}>
  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
    <option key={num} value={num}>
      {num} {num === 1 ? 'Guest' : 'Guests'}
    </option>
  ))}
</select>
```

### Make Name Required/Optional
**Current**: Required  
**To make optional**:
```typescript
<input
  type="text"
  // Remove: required
  value={formData.name}
  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
/>
```

### Change Success Message
**File**: `src/components/WeddingInvitation.tsx`  
**Translation Keys**:
```typescript
rsvpThanks: 'Your custom message',
rsvpThanksSub: 'Your custom subtitle',
```

---

## 🎬 Animations

### Disable Envelope Animation
**File**: `src/components/WeddingInvitation.tsx`  
**Location**: `Envelope3D` component  
**Change**:
```typescript
animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
// To:
animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
```

### Speed Up Animations
**Current**: Duration typically 0.6-0.8s  
**To speed up**:
```typescript
transition={{ duration: 0.3 }} // Reduce from 0.6
```

### Disable Spring Physics
**Current**:
```typescript
transition={{
  duration: 0.8,
  ease: [0.34, 1.56, 0.64, 1], // Spring
}}
```

**Replace with linear**:
```typescript
transition={{
  duration: 0.8,
  ease: 'easeInOut',
}}
```

### Change Particle Animation
**File**: `src/components/WeddingInvitation.tsx`  
**Location**: Hero section particles  
**Code**:
```typescript
animate={{
  y: ['0vh', '100vh'],
  x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
}}
transition={{
  duration: 8 + i * 2,  // Change 8 to different number
  repeat: Infinity,
  ease: 'linear',
}}
```

---

## 📱 Responsive Design

### Change Mobile Breakpoint
**Current**: Tailwind default (md: 768px)  
**To change**:
```typescript
<h1 className="text-5xl md:text-7xl">
  {/* sm: 640px, md: 768px, lg: 1024px, xl: 1280px */}
</h1>
```

### Adjust Padding on Mobile
**Current**: `px-4`  
**To change**:
```typescript
className="px-2 md:px-4 lg:px-8"
// sm: 8px, md: 16px, lg: 32px
```

### Change Font Sizes
**File**: `src/components/WeddingInvitation.tsx`  
**Current**: `text-5xl md:text-7xl`  
**Tailwind sizes**:
```
text-2xl = 24px
text-3xl = 30px
text-4xl = 36px
text-5xl = 48px
text-6xl = 60px
text-7xl = 72px
```

---

## 🔧 Advanced Configuration

### Change Build Output Directory
**File**: `vite.config.ts`  
```typescript
build: {
  outDir: 'dist',  // Change to 'build' or 'public'
}
```

### Add Environment Variables
**Create**: `.env.local`
```
VITE_COUPLE_NAME=Sarah & Michael
VITE_EVENT_DATE=2025-06-15
VITE_AUDIO_URL=https://your-cdn.com/music.mp3
```

**Use in component**:
```typescript
const coupleName = import.meta.env.VITE_COUPLE_NAME;
```

### Change TypeScript Strictness
**File**: `tsconfig.json`  
```typescript
"strict": true, // Set to false for less strict checking
```

---

## 📊 Analytics Integration

### Add Google Analytics
**File**: `src/App.tsx`
```typescript
useEffect(() => {
  // Load Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=GA_ID`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() { window.dataLayer.push(arguments); }
  window.gtag('js', new Date());
  window.gtag('config', 'GA_ID');
}, []);
```

### Track Events
```typescript
// In envelope open handler
if (window.gtag) {
  window.gtag('event', 'envelope_opened', {
    timestamp: new Date(),
  });
}
```

---

## 🚀 Performance Tips

### Remove Unused Fonts
**File**: `src/index.css`  
```css
/* Remove fonts you don't need */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap');
```

### Optimize Images
- Use SVG instead of PNG/JPG where possible
- lucide-react icons are already SVG ✓

### Code Split Components
```typescript
import dynamic from 'react';
const TimelineSection = dynamic(() => import('./TimelineSection'));
```

### Enable Gzip Compression
```javascript
// In vite.config.ts
import compression from 'vite-plugin-compression';

plugins: [
  react(),
  compression(),
]
```

---

## 🆘 Common Issues & Solutions

### Issue: Audio Won't Play on iOS
**Solution**: Ensure audio plays on first user click (already implemented ✓)

### Issue: Text Is Too Small on Mobile
**Solution**: Increase `text-*` sizes in mobile breakpoint
```typescript
className="text-2xl md:text-5xl" // Larger on mobile
```

### Issue: Envelope Animation Stutters
**Solution**: Disable other animations or reduce `will-change` usage
```typescript
style={{ willChange: 'transform' }}
```

### Issue: Colors Look Different on Mobile
**Solution**: Check color calibration settings on device

---

## 📚 Additional Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

**Need more help?** Check SETUP_GUIDE.md or create an issue on GitHub!
