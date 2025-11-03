# 🚀 دليل نشر مشروع BlindProject

## الخطوات الكاملة لرفع المشروع على الإنترنت

---

## 1️⃣ تجهيز Backend (Node.js + Express + MongoDB)

### الخيار الأول: Render.com (مجاني ✅)

#### الخطوات:
1. **إنشاء حساب على Render:**
   - اذهب إلى [render.com](https://render.com)
   - سجل دخول بحساب GitHub

2. **رفع الكود على GitHub:**
   ```bash
   cd c:\Users\SeiF\BlindProject
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/Seif250/BlindProject.git
   git push -u origin main
   ```

3. **إنشاء Web Service على Render:**
   - من Dashboard → اضغط **New +** → اختر **Web Service**
   - اربط حساب GitHub واختر repository: `BlindProject`
   - الإعدادات:
     - **Name:** `blindproject-api`
     - **Root Directory:** `server`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free

4. **إضافة Environment Variables:**
   اضغط على **Environment** وأضف:
   ```
   MONGO_URI=mongodb+srv://seifezz027:Ss12301230@blinddate.cw2zt.mongodb.net/blindproject?retryWrites=true&w=majority
   JWT_SECRET=03a6078aa64cbd004703df113f1a9d670a1cbf2403d5e3a426445a530bd12434d1c9d642768f58f4
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy:**
   - اضغط **Create Web Service**
   - انتظر حتى ينتهي الـ deployment
   - سيعطيك رابط مثل: `https://blindproject-api.onrender.com`

---

### الخيار الثاني: Railway.app (مجاني ✅)

1. اذهب إلى [railway.app](https://railway.app)
2. سجل دخول بحساب GitHub
3. **New Project** → **Deploy from GitHub repo**
4. اختر `BlindProject`
5. أضف المتغيرات البيئية (نفس القائمة أعلاه)
6. Railway سيكشف Node.js تلقائياً ويبني المشروع

---

## 2️⃣ تجهيز Frontend (React)

### الخيار الأول: Vercel (مجاني + سريع جداً ✅)

#### الخطوات:
1. **تعديلملف API في الواجهة:**
   افتح `client/src/services/api.js` وعدّل الـ baseURL:
   ```javascript
   import axios from 'axios';

   const api = axios.create({
       baseURL: process.env.REACT_APP_API_URL || 'https://blindproject-api.onrender.com',
       headers: {
           'Content-Type': 'application/json'
       }
   });

   // ... باقي الكود
   ```

2. **إنشاء ملف `.env.production` في مجلد client:**
   ```bash
   cd client
   echo REACT_APP_API_URL=https://blindproject-api.onrender.com > .env.production
   ```

3. **رفع على Vercel:**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل دخول بحساب GitHub
   - **Add New** → **Project**
   - اختر repository: `BlindProject`
   - الإعدادات:
     - **Framework Preset:** Create React App
     - **Root Directory:** `client`
     - **Build Command:** `npm run build`
     - **Output Directory:** `build`
   - **Environment Variables:**
     ```
     REACT_APP_API_URL=https://blindproject-api.onrender.com
     NODE_OPTIONS=--openssl-legacy-provider
     ```
   - اضغط **Deploy**

4. **الحصول على الرابط:**
   - بعد الانتهاء ستحصل على رابط مثل: `https://blind-project.vercel.app`

---

### الخيار الثاني: Netlify (مجاني ✅)

1. اذهب إلى [netlify.com](https://netlify.com)
2. **Add new site** → **Import an existing project**
3. اختر GitHub → `BlindProject`
4. الإعدادات:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`
5. أضف Environment Variables (نفس Vercel)
6. Deploy

---

## 3️⃣ تحديث CORS في Backend

بعد رفع الفرونت اند، عدّل `server/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://blind-project.vercel.app',  // الرابط الفعلي للفرونت اند
        'https://your-custom-domain.com'     // إذا كان عندك دومين خاص
    ],
    credentials: true
}));
```

ثم ارفع التعديلات على GitHub وRender سيعمل redeploy تلقائياً.

---

## 4️⃣ تحديث CLIENT_URL في Backend Environment Variables

ارجع لـ Render/Railway وعدّل المتغير:
```
CLIENT_URL=https://blind-project.vercel.app
```

---

## 5️⃣ اختبار المشروع

1. افتح رابط الفرونت اند: `https://blind-project.vercel.app`
2. جرب التسجيل وتسجيل الدخول
3. جرب إنشاء فريق
4. تأكد من عمل كل الصفحات

---

## 📌 ملاحظات مهمة

### حل مشاكل شائعة:

**1. CORS Error:**
```javascript
// في server.js
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));
```

**2. MongoDB Connection:**
- تأكد من إضافة IP Address `0.0.0.0/0` في MongoDB Atlas → Network Access

**3. Environment Variables:**
- تأكد من إضافة كل المتغيرات في Render وVercel
- لا تنسى إعادة Deploy بعد تعديل المتغيرات

**4. Build Errors:**
- نظف node_modules: `rm -rf node_modules && npm install`
- تأكد من `package.json` يحتوي على كل dependencies

---

## 🎯 الخطة السريعة (10 دقائق)

1. ✅ ارفع الكود على GitHub
2. ✅ Backend على Render (5 دقائق)
3. ✅ Frontend على Vercel (3 دقائق)
4. ✅ عدّل CORS والمتغيرات (2 دقيقة)
5. 🎉 جاهز!

---

## 🔗 روابط مفيدة

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)

---

## 💡 نصائح إضافية

- استخدم **custom domain** من Vercel (مجاني)
- فعّل **HTTPS** (تلقائي في Vercel/Render)
- راقب **logs** في Render Dashboard لمتابعة الأخطاء
- استخدم **GitHub Actions** للـ CI/CD (اختياري)

---

**Good Luck! 🚀**
