# Real-Time Student Marks System (GradeSync)

A real-time web portal built with **React**, **Vite**, **Tailwind CSS**, and **Supabase Realtime**.

---

## 🔑 Login Credentials

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Lecturer** | `Lect1` | `123izad` | View all 111 students, search, edit marks live, export CSV |
| **Students** | `[Matric Number]` (e.g. `252021399`) | `1234` | View **only their own** name and mark with instant live updates |

---

## 🚀 Step 1: Set Up Supabase (1 Minute)

1. Log in to [Supabase](https://supabase.com) and open or create a project.
2. In the left sidebar, click on **SQL Editor** &rarr; **New Query**.
3. Open the file [`supabase_schema_and_seed.sql`](file:///supabase_schema_and_seed.sql), copy everything, paste it into the SQL Editor, and click **Run**.
   - *This creates the `students` table, configures permissions, enables Realtime updates, and inserts all 111 students from your Excel file.*
4. Go to **Project Settings** &rarr; **API**:
   - Copy the **Project URL**
   - Copy the **Project API keys (anon / public)**

---

## 💻 Step 2: Test Locally

1. Create a `.env` file from `.env.example`:
   ```bash
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   *(Or simply run the app and click the "Configure Supabase" button in the top right to paste them!)*

2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in two separate browser tabs:
   - **Tab 1:** Log in as Lecturer (`Lect1` / `123izad`). Change the mark of `252021399` from `20` to `88`.
   - **Tab 2:** Log in as Student (`252021399` / `1234`).
   - Notice the score updates **instantly in real time** without refreshing!

---

## 🌐 Step 3: Deploy to GitHub & Vercel

### 1. Push to GitHub
In your project directory:
```bash
git init
git add .
git commit -m "Initial commit of realtime grade system"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** &rarr; **Project**.
3. Select your GitHub repository.
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**.

Your live URL is now ready for your lecturer and students to use!
