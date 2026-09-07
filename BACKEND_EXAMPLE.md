# 🖥️ Backend Integration Guide

Complete example of how to set up a backend server to handle RSVP submissions from the wedding invitation SPA.

---

## Quick Choice: Backend Stack

Choose one based on your preference:

### Option 1: Node.js + Express (Recommended for beginners)
```bash
npm init -y
npm install express dotenv cors nodemailer mongoose
```

### Option 2: Python + Flask
```bash
pip install flask flask-cors python-dotenv
```

### Option 3: Firebase/Supabase (Serverless)
No server setup needed - use Firebase Cloud Functions

### Option 4: AWS Lambda + DynamoDB
Use serverless infrastructure

---

## 🟢 Node.js + Express Example

### 1. Basic Server Setup

**`server.js`**:
```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.post('/api/rsvp', require('./routes/rsvp'));
app.get('/api/rsvps/count', require('./routes/rsvps'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. Environment Configuration

**`.env`**:
```
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/wedding-rsvp

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@wedding.com

# Security
JWT_SECRET=your-secret-key-here
```

### 3. Database Schema

**`models/RSVP.js`**:
```javascript
const mongoose = require('mongoose');

const RSVPSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    // optional: add validation
  },
  attendance: {
    type: String,
    enum: ['yes', 'no'],
    required: true,
  },
  guests: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  wishes: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  ipAddress: String,
  userAgent: String,
});

module.exports = mongoose.model('RSVP', RSVPSchema);
```

### 4. RSVP Route Handler

**`routes/rsvp.js`**:
```javascript
const express = require('express');
const router = express.Router();
const RSVP = require('../models/RSVP');
const { sendConfirmationEmail, notifyAdmin } = require('../utils/email');

// POST: Create new RSVP
router.post('/', async (req, res) => {
  try {
    const { name, email, attendance, guests, wishes } = req.body;

    // Validation
    if (!name || !attendance || !guests) {
      return res.status(400).json({
        error: 'Missing required fields: name, attendance, guests',
      });
    }

    if (!['yes', 'no'].includes(attendance)) {
      return res.status(400).json({ error: 'Invalid attendance value' });
    }

    if (guests < 1 || guests > 10) {
      return res.status(400).json({ error: 'Guests must be between 1 and 10' });
    }

    // Check for duplicates (by name and email)
    if (email) {
      const existing = await RSVP.findOne({ email });
      if (existing) {
        return res.status(409).json({
          error: 'This email has already submitted an RSVP',
          duplicate: true,
        });
      }
    }

    // Create RSVP record
    const rsvp = new RSVP({
      name,
      email,
      attendance,
      guests,
      wishes,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });

    await rsvp.save();

    // Send confirmation email to guest
    if (email) {
      await sendConfirmationEmail({
        name,
        email,
        attendance,
        guests,
      });
    }

    // Notify admin
    await notifyAdmin({
      name,
      email,
      attendance,
      guests,
      wishes,
    });

    res.status(201).json({
      success: true,
      message: 'RSVP received! Thank you for confirming.',
      id: rsvp._id,
    });
  } catch (error) {
    console.error('RSVP submission error:', error);
    res.status(500).json({ error: 'Failed to process RSVP' });
  }
});

// GET: Fetch RSVP statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    // Add authentication here in production
    const total = await RSVP.countDocuments();
    const confirmed = await RSVP.countDocuments({ attendance: 'yes' });
    const declined = await RSVP.countDocuments({ attendance: 'no' });
    const totalGuests = await RSVP.aggregate([
      { $match: { attendance: 'yes' } },
      { $group: { _id: null, total: { $sum: '$guests' } } },
    ]);

    res.json({
      total,
      confirmed,
      declined,
      totalGuests: totalGuests[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
```

### 5. Email Service

**`utils/email.js`**:
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendConfirmationEmail = async ({ name, email, attendance, guests }) => {
  const subject = attendance === 'yes' 
    ? '✅ We Look Forward to Celebrating With You!' 
    : '😢 We Understand - See You Another Time!';

  const html = `
    <h2>Thank You for Your Response!</h2>
    <p>Dear ${name},</p>
    
    <p>Thank you for confirming your ${attendance === 'yes' ? 'attendance' : 'regrets'}.</p>
    
    ${attendance === 'yes' ? `
      <p>We're thrilled that you'll be joining us!</p>
      <p><strong>Number of guests:</strong> ${guests}</p>
    ` : `
      <p>We'll miss you, but we understand. We hope to celebrate with you another time!</p>
    `}

    <p>If you have any dietary restrictions or special requirements, please let us know!</p>
    
    <p>Warmly,<br/>Sarah & Michael</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html,
    });
    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Email send failed:', error);
    // Don't fail the RSVP submission if email fails
  }
};

const notifyAdmin = async ({ name, email, attendance, guests, wishes }) => {
  const html = `
    <h3>New RSVP Submission</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email || 'Not provided'}</p>
    <p><strong>Attendance:</strong> ${attendance === 'yes' ? '✅ Yes' : '❌ No'}</p>
    <p><strong>Guests:</strong> ${guests}</p>
    ${wishes ? `<p><strong>Wishes:</strong></p><p>${wishes}</p>` : ''}
    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New RSVP: ${name} - ${attendance === 'yes' ? 'Confirmed' : 'Declined'}`,
      html,
    });
  } catch (error) {
    console.error('Admin notification failed:', error);
  }
};

module.exports = { sendConfirmationEmail, notifyAdmin };
```

### 6. Update Frontend to Use Backend

**`src/components/WeddingInvitation.tsx`**:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/rsvp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setSubmitted(true);
      setFormData({ name: '', attendance: 'yes', guests: 1, wishes: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      alert(data.error || 'Failed to submit RSVP');
    }
  } catch (error) {
    console.error('RSVP error:', error);
    alert('Failed to submit RSVP. Please try again.');
  }
};
```

---

## 🔵 Python + Flask Example

**`app.py`**:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[os.getenv('CLIENT_URL', 'http://localhost:5173')])

# In-memory storage (use database in production)
rsvps = []

@app.route('/api/rsvp', methods=['POST'])
def submit_rsvp():
    data = request.json
    
    # Validation
    required_fields = ['name', 'attendance', 'guests']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if data['attendance'] not in ['yes', 'no']:
        return jsonify({'error': 'Invalid attendance value'}), 400
    
    if not 1 <= data['guests'] <= 10:
        return jsonify({'error': 'Guests must be between 1 and 10'}), 400
    
    # Create RSVP record
    rsvp = {
        'id': len(rsvps) + 1,
        'name': data['name'],
        'email': data.get('email'),
        'attendance': data['attendance'],
        'guests': data['guests'],
        'wishes': data.get('wishes', ''),
        'submitted_at': datetime.now().isoformat(),
    }
    
    rsvps.append(rsvp)
    
    return jsonify({
        'success': True,
        'message': 'RSVP received!',
        'id': rsvp['id']
    }), 201

@app.route('/api/rsvps/count', methods=['GET'])
def rsvp_count():
    confirmed = sum(1 for r in rsvps if r['attendance'] == 'yes')
    declined = sum(1 for r in rsvps if r['attendance'] == 'no')
    total_guests = sum(r['guests'] for r in rsvps if r['attendance'] == 'yes')
    
    return jsonify({
        'total': len(rsvps),
        'confirmed': confirmed,
        'declined': declined,
        'total_guests': total_guests,
    })

if __name__ == '__main__':
    app.run(debug=True, port=3001)
```

---

## ☁️ Firebase Example (Serverless)

**`functions/index.js`** (Firebase Cloud Functions):
```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

exports.submitRsvp = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { name, email, attendance, guests, wishes } = req.body;

      // Validation
      if (!name || !attendance || !guests) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Save to Firestore
      const docRef = await db.collection('rsvps').add({
        name,
        email: email || null,
        attendance,
        guests: parseInt(guests),
        wishes: wishes || '',
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        ipAddress: req.ip,
      });

      res.status(201).json({
        success: true,
        message: 'RSVP received!',
        id: docRef.id,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to process RSVP' });
    }
  });
});

exports.getRsvpCount = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await db.collection('rsvps').get();
      
      let confirmed = 0;
      let declined = 0;
      let totalGuests = 0;

      snapshot.forEach((doc) => {
        if (doc.data().attendance === 'yes') {
          confirmed++;
          totalGuests += doc.data().guests;
        } else {
          declined++;
        }
      });

      res.json({
        total: snapshot.size,
        confirmed,
        declined,
        totalGuests,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch count' });
    }
  });
});
```

---

## 🔒 Security Best Practices

### Input Validation
```javascript
const validateRsvp = (data) => {
  const errors = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.length > 100) {
    errors.push('Invalid name');
  }
  
  if (!['yes', 'no'].includes(data.attendance)) {
    errors.push('Invalid attendance value');
  }
  
  if (!Number.isInteger(data.guests) || data.guests < 1 || data.guests > 10) {
    errors.push('Invalid guest count');
  }
  
  if (data.wishes && data.wishes.length > 500) {
    errors.push('Wishes too long');
  }
  
  return errors;
};
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many RSVPs from this IP, please try again later.',
});

app.post('/api/rsvp', limiter, (req, res) => {
  // Handle RSVP
});
```

### CORS Security
```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
```

### Environment Variables
```
NEVER commit .env file
ALWAYS use process.env for sensitive data
USE environment variables on hosting platform
```

---

## 📊 Admin Dashboard

**`admin.html`** (Simple admin view):
```html
<!DOCTYPE html>
<html>
<head>
  <title>Wedding RSVP Dashboard</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    .stat { display: inline-block; margin: 10px; padding: 20px; background: #f0f0f0; border-radius: 8px; }
    .stat-value { font-size: 32px; font-weight: bold; color: #d4af37; }
    .stat-label { color: #666; margin-top: 5px; }
  </style>
</head>
<body>
  <h1>Wedding RSVP Dashboard</h1>
  
  <div class="stat">
    <div class="stat-value" id="total">0</div>
    <div class="stat-label">Total RSVPs</div>
  </div>
  
  <div class="stat">
    <div class="stat-value" id="confirmed">0</div>
    <div class="stat-label">Confirmed</div>
  </div>
  
  <div class="stat">
    <div class="stat-value" id="declined">0</div>
    <div class="stat-label">Declined</div>
  </div>
  
  <div class="stat">
    <div class="stat-value" id="guests">0</div>
    <div class="stat-label">Total Guests</div>
  </div>

  <script>
    const API_URL = 'http://localhost:3001';

    async function loadStats() {
      try {
        const res = await fetch(`${API_URL}/api/rsvps/count`);
        const data = await res.json();
        
        document.getElementById('total').textContent = data.total;
        document.getElementById('confirmed').textContent = data.confirmed;
        document.getElementById('declined').textContent = data.declined;
        document.getElementById('guests').textContent = data.totalGuests;
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    }

    loadStats();
    setInterval(loadStats, 30000); // Refresh every 30 seconds
  </script>
</body>
</html>
```

---

## 🚀 Deployment

### Deploy to Heroku
```bash
heroku create your-wedding-rsvp
git push heroku main
heroku config:set MONGODB_URI=your_uri
```

### Deploy to Vercel (Node.js)
```bash
npm install -g vercel
vercel
```

### Deploy to AWS Lambda
Use AWS SAM or Serverless Framework

### Deploy to DigitalOcean
```bash
# SSH into droplet
ssh root@your_ip

# Clone repo, install dependencies
git clone your-repo
cd wedding-rsvp
npm install

# Run with PM2
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

---

## 📧 Email Templates

### Guest Confirmation Template
```html
<table style="font-family: Arial; max-width: 600px; margin: 0 auto;">
  <tr>
    <td style="padding: 40px 0; text-align: center;">
      <h1 style="color: #d4af37; margin: 0;">Thank You!</h1>
    </td>
  </tr>
  <tr>
    <td style="padding: 20px; text-align: center; color: #666;">
      <p>Dear {{name}},</p>
      <p>We're delighted by your {{response}}!</p>
      {{#if_yes}}
        <p style="font-size: 18px; color: #1a1a1a;">
          We can't wait to celebrate with you and {{guests}} {{plural_guest}}.
        </p>
      {{/if_yes}}
      <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
        Wedding Details | June 15, 2024
      </p>
    </td>
  </tr>
</table>
```

---

## 🧪 Testing

### Unit Tests with Jest
```javascript
describe('RSVP Submission', () => {
  test('should accept valid RSVP', async () => {
    const response = await request(app)
      .post('/api/rsvp')
      .send({
        name: 'John Doe',
        attendance: 'yes',
        guests: 2,
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test('should reject invalid attendance', async () => {
    const response = await request(app)
      .post('/api/rsvp')
      .send({
        name: 'John Doe',
        attendance: 'maybe', // Invalid
        guests: 2,
      });

    expect(response.status).toBe(400);
  });
});
```

---

## 📞 Support

For issues with backend integration:
1. Check the logs: `console.log()` and server output
2. Test with Postman or cURL
3. Verify environment variables are set
4. Check CORS configuration
5. Ensure database is connected

---

**Backend setup complete!** Your wedding invitation SPA is now ready to collect RSVPs! 🎊
