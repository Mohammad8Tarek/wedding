# 💍 Wedding Invitation SPA - Complete Setup Guide

## Overview
A production-ready, ultra-premium wedding invitation single-page application with:
- ✨ True 3D envelope with realistic animations
- 🎵 Audio playback with autoplay bypass
- 🌍 Bilingual support (English/Arabic with auto-detection)
- ⏳ Live countdown timer
- 📅 Event timeline with venue information
- 📝 RSVP form with validation
- 🎨 Luxury design system (cream, gold, elegant typography)
- 📱 100% mobile responsive

---

## Tech Stack

```
Frontend Framework: React 18+ with TypeScript
Styling: Tailwind CSS 3.3+
Animations: Framer Motion 10+
Icons: lucide-react 0.263+
Build Tool: Vite (recommended) or Next.js
Node Version: 16+ (18+ recommended)
```

---

## Installation & Setup

### 1. Create Project (Choose One)

#### Option A: Vite (Recommended - Fastest)
```bash
npm create vite@latest wedding-invitation -- --template react-ts
cd wedding-invitation
npm install
```

#### Option B: Next.js (Full-featured)
```bash
npx create-next-app@latest wedding-invitation --typescript --tailwind
cd wedding-invitation
```

#### Option C: Create React App
```bash
npx create-react-app wedding-invitation --template typescript
cd wedding-invitation
```

---

### 2. Install Dependencies

```bash
npm install framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer

# If not auto-configured:
npx tailwindcss init -p
```

---

### 3. Configure Tailwind CSS

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      colors: {
        gold: '#d4af37',
        cream: '#faf9f6',
        text: '#1a1a1a',
      },
    },
  },
  plugins: [],
}
```

**postcss.config.js:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

### 4. Setup Global Styles

**src/index.css** or **src/globals.css:**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cairo:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html[dir="rtl"] {
  font-family: 'Cairo', sans-serif;
  direction: rtl;
  text-align: right;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #faf9f6;
}

::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #c4941f;
}
```

---

### 5. Import the Component

**src/App.tsx** (or src/page.tsx for Next.js):
```typescript
import WeddingInvitation from './components/WeddingInvitation';
import './index.css';

export default function App() {
  return <WeddingInvitation />;
}
```

---

### 6. Copy the Main Component

Place the `wedding-invitation.tsx` file in `src/components/` directory.

---

## Running the Application

### Development Mode
```bash
npm run dev
```

Vite: Visit `http://localhost:5173`
Next.js: Visit `http://localhost:3000`

---

## Customization Guide

### 1. Change Couple Names

**In wedding-invitation.tsx**, find the Hero Section:
```typescript
<span style={{ color: '#d4af37' }}>CHANGE_TO_YOUR_NAMES</span>
```

### 2. Update Event Date

**In useCountdown hook:**
```typescript
const targetDate = new Date(2024, 5, 15); // Month (0-indexed), Day
// Change to: new Date(2025, 6, 20) for July 20, 2025
```

### 3. Customize Colors

**Premium Palette (current):**
- Gold Accent: `#d4af37`
- Cream Background: `#faf9f6`
- Dark Text: `#1a1a1a`
- Light Gray: `#999` / `#666`

**To change:**
1. Update all hex values in the component
2. Update `tailwind.config.js` colors
3. Consistency is key – use CSS variables for maintainability:

```typescript
const colors = {
  gold: '#d4af37',
  cream: '#faf9f6',
  text: '#1a1a1a',
  light: '#f5f3ee',
};

// Use throughout: style={{ color: colors.gold }}
```

### 4. Change Audio Track

**Replace the audio URL:**
```typescript
<audio
  ref={audioRef}
  src="YOUR_AUDIO_URL_HERE"
  loop
  crossOrigin="anonymous"
/>
```

Recommended: Free royalty-free instrumental from:
- Pixabay Audio: https://pixabay.com/music/
- Free Music Archive: https://freemusicarchive.org/
- YouTube Audio Library

### 5. Update Venue Information

**In TimelineSection component:**
```typescript
venueAddress: 'Your Address\nCity, State ZIP'
```

### 6. Customize Translations

**In translations object:**
```typescript
const translations: Translations = {
  en: {
    // Update all English text
  },
  ar: {
    // Update all Arabic text
  },
};
```

---

## Browser Language Detection

The app automatically detects:
- **Arabic**: `navigator.language.startsWith('ar')`
  - Sets `dir="rtl"`
  - Loads Cairo font
  - Displays Arabic text

- **English**: Default
  - Sets `dir="ltr"`
  - Loads Playfair Display + Inter
  - Displays English text

**Manual override** (if needed):
```typescript
// In useLanguage hook
const detectedLanguage: Language = 'ar'; // Force Arabic
```

---

## Audio Autoplay Bypass

**How it works:**
1. Audio element is muted by default
2. On envelope click, `audioRef.current.play()` is called **synchronously**
3. This user-initiated event bypasses browser autoplay restrictions
4. Mute/unmute toggle appears after opening

**iOS/Safari note:** Some versions require user gesture within 500ms of click event. The implementation handles this correctly.

---

## RSVP Form Integration

**Current behavior:**
- Form data is shown in success state
- Data is NOT persisted (it's client-side only)

**To add backend:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Send to backend
  const response = await fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  
  if (response.ok) {
    setSubmitted(true);
  }
};
```

**Backend API endpoint** (Node.js example):
```javascript
app.post('/api/rsvp', (req, res) => {
  const { name, attendance, guests, wishes } = req.body;
  // Save to database
  // Send confirmation email
  res.json({ success: true });
});
```

---

## Performance Optimization

### 1. Image Optimization
- SVG icons (via lucide-react) ✓
- CSS gradients instead of images ✓

### 2. Animation Performance
- GPU-accelerated transforms ✓
- Reduced motion respected ✓
- No unnecessary re-renders ✓

### 3. Code Splitting (Next.js)
```typescript
import dynamic from 'next/dynamic';

const WeddingInvitation = dynamic(() => import('./WeddingInvitation'), {
  loading: () => <div>Loading...</div>,
});
```

### 4. Bundle Size
- Framer Motion: ~42KB (gzipped)
- lucide-react: ~12KB (gzipped)
- Tailwind CSS: ~15KB (gzipped)
- **Total: ~70KB** (production build)

---

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag & drop 'dist' folder to Netlify
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment Variables (if needed)
Create `.env.local`:
```
VITE_AUDIO_URL=https://your-cdn.com/audio.mp3
VITE_COUPLE_NAME=Sarah & Michael
VITE_EVENT_DATE=2024-06-15
```

---

## Accessibility Features

✓ Semantic HTML structure
✓ ARIA labels for interactive elements
✓ Keyboard navigation support
✓ Reduced motion support
✓ Color contrast (WCAG AA compliant)
✓ Bilingual support

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Android Chrome)

---

## Troubleshooting

### Audio not playing
- Check browser console for CORS errors
- Ensure audio file is accessible
- Try different audio format (MP3 works best)
- Check browser autoplay settings

### RTL/Arabic text not displaying
- Ensure Google Fonts are loaded
- Check `document.dir` in DevTools
- Verify `lang` attribute on `<html>`

### Animations laggy on mobile
- Enable "Reduced Motion" in accessibility settings
- Check device performance mode
- Reduce number of simultaneous animations

### Countdown shows wrong time
- Verify server time is correct
- Clear browser cache
- Ensure JavaScript is enabled

---

## File Structure

```
wedding-invitation/
├── src/
│   ├── components/
│   │   └── WeddingInvitation.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── public/
│   └── favicon.ico
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── vite.config.ts (if using Vite)
```

---

## Production Checklist

- [ ] Update couple names and date
- [ ] Change audio URL (or use provided)
- [ ] Update venue address and coordinates
- [ ] Customize color palette (if desired)
- [ ] Review translations for accuracy
- [ ] Test on mobile devices
- [ ] Test audio playback on iOS
- [ ] Set up RSVP backend (if needed)
- [ ] Configure domain/HTTPS
- [ ] Set up analytics (optional)
- [ ] Test RTL (Arabic) display
- [ ] Performance audit (Lighthouse)

---

## Next Steps

1. **Personalization**: Update all couple-specific details
2. **Backend Integration**: Connect RSVP form to your server
3. **Analytics**: Add Google Analytics or Mixpanel
4. **Email Notifications**: Send confirmation emails on RSVP
5. **Guest Management**: Create admin dashboard for RSVPs
6. **Mobile App**: Wrap in React Native for app stores

---

## Support & Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **lucide-react Icons**: https://lucide.dev/
- **React TypeScript**: https://react-typescript-cheatsheet.netlify.app/

---

## License & Credits

This component uses:
- React & TypeScript (Meta)
- Framer Motion (Framer)
- Tailwind CSS (Tailwind Labs)
- lucide-react (lucide)
- Audio from Pixabay (Free)

Feel free to customize and deploy! Congratulations on the upcoming wedding! 💍✨
