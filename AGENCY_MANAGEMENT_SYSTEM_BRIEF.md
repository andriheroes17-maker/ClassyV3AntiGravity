# DEVELOPER BRIEF — Agency Management System
> **Edisi Final v2.0 | April 2026 | Konfidensial**
> Dokumen ini diformat ulang untuk dimasukkan ke Antigravity. Ikuti panduan fase di bawah secara berurutan.

---

## 🤖 PANDUAN UNTUK ANTIGRAVITY

### Cara Membaca Dokumen Ini

Dokumen ini adalah **Developer Brief lengkap** untuk membangun sistem Agency Management berbasis web. Sistem ini memiliki **10 modul**, **53 fitur**, dan **8 role pengguna** yang berbeda-beda. Jangan coba selesaikan semuanya sekaligus — ikuti **fase yang sudah ditetapkan** di bawah ini secara berurutan.

### Prinsip Kerja

1. **Selesaikan satu fase sepenuhnya sebelum lanjut ke fase berikutnya.**
2. Setiap fase memiliki daftar fitur prioritas (ID fitur tercantum — gunakan sebagai referensi).
3. Untuk setiap fitur, baca bagian **DESKRIPSI DETAIL**, **FUNCTIONAL REQUIREMENTS**, dan **DEPENDENCIES** sebelum mulai coding.
4. Gunakan **RBAC** (Role-Based Access Control) dari awal — setiap halaman/komponen harus mempertimbangkan siapa yang boleh melihatnya.
5. Notifikasi (**M08**) adalah sistem cross-cutting — mulai siapkan event bus-nya di Fase 2 agar mudah dipakai di fase berikutnya.
6. Selalu gunakan **Row-Level Security (RLS)** di Supabase untuk semua tabel yang berisi data klien atau karyawan.

### Konvensi Penamaan Fitur

Setiap fitur memiliki ID unik: `[KODE_MODUL]-[NOMOR]`
- `DASH-001` = Modul Dashboard, Fitur 1
- `PRJ-002` = Modul Project Management, Fitur 2
- `FIN-003` = Modul Finance, Fitur 3
- dst.

Urgency Score: **10 = KRITIS** (launch blocker) | **7-9 = TINGGI** | **5-6 = SEDANG** | **<5 = RENDAH**

---

## 🛠️ TECH STACK

| Layer | Teknologi |
|---|---|
| **Frontend** | React + Vite + Tailwind CSS |
| **Backend / DB** | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| **State Management** | Zustand |
| **Deployment** | Vercel |

### Catatan Arsitektur

- **Supabase Auth** menangani semua autentikasi (email/password, OAuth). Setelah login, baca `role` dari tabel `users` atau `user_metadata` untuk routing.
- **Supabase Realtime** digunakan untuk notifikasi in-app real-time (M08 NOTIF-001) dan update dashboard tanpa refresh.
- **Supabase Storage** digunakan untuk file upload: attachment task, aset brand, dokumen kontrak, slip gaji PDF, dsb.
- **Supabase RLS (Row Level Security)** WAJIB diaktifkan di semua tabel sensitif. Policy harus di-enforce di level database, bukan hanya di aplikasi.
- **Zustand** untuk global state: auth state (user + role), notification count, theme (dark/light), sidebar state.
- **Vercel** untuk deployment frontend. Gunakan environment variables untuk semua Supabase keys.

---

## 📋 RINGKASAN SEMUA FITUR

**10 Modul · 53 Fitur Total · 27 KRITIS · 22 TINGGI · 4 SEDANG-RENDAH**

| ID | Nama Fitur | Urgency |
|---|---|---|
| **M01 — Dashboard & Client View** | | |
| DASH-001 | Login & Role-Based Routing | 🔴 10 KRITIS |
| DASH-002 | Executive Dashboard (Director & Super Admin) | 🔴 10 KRITIS |
| DASH-003 | CFO Dashboard | 🔴 9 KRITIS |
| DASH-004 | CMO Dashboard | 🔴 9 KRITIS |
| DASH-005 | COO Dashboard | 🔴 9 KRITIS |
| DASH-006 | Project Manager Dashboard | 🔴 9 KRITIS |
| DASH-007 | Creator Dashboard | 🟠 8 TINGGI |
| DASH-008 | Client Dashboard (Tampilan Klien) | 🔴 10 KRITIS |
| **M02 — Project Management** | | |
| PRJ-001 | Client List & Client Profile | 🔴 9 KRITIS |
| PRJ-002 | Project (Create & Detail) | 🔴 10 KRITIS |
| PRJ-003 | Kanban Board & Task Management | 🔴 10 KRITIS |
| PRJ-004 | Content Progress Tracker | 🔴 9 KRITIS |
| PRJ-005 | Review & Approval Flow | 🔴 9 KRITIS |
| PRJ-006 | Time Tracking | 🟠 8 TINGGI |
| PRJ-007 | Project Template | 🟡 6 SEDANG |
| PRJ-008 | File Repository per Proyek | 🟠 7 TINGGI |
| **M03 — Calendar & Scheduling** | | |
| CAL-001 | Kalender Terpadu Multi-Source | 🔴 10 KRITIS |
| CAL-002 | Reminder & Recurring Event | 🟠 8 TINGGI |
| CAL-003 | Resource Scheduling | 🟡 6 SEDANG |
| **M04 — Finance** | | |
| FIN-001 | Income Management | 🔴 9 KRITIS |
| FIN-002 | Expense Management | 🔴 9 KRITIS |
| FIN-003 | Invoice Management | 🔴 10 KRITIS |
| FIN-004 | Offering & Proposal | 🔴 9 KRITIS |
| FIN-005 | Payment Gateway Integration | 🟠 7 TINGGI |
| FIN-006 | Tax Management (PPh & PPN) | 🔴 9 KRITIS |
| FIN-007 | Budget Planning & Realisasi | 🟠 7 TINGGI |
| FIN-008 | Payroll | 🔴 9 KRITIS |
| FIN-009 | P&L Report & Financial Analytics | 🔴 9 KRITIS |
| **M05 — Marketing & CRM** | | |
| MKT-001 | Prospect Database & CRM | 🔴 9 KRITIS |
| MKT-002 | Lead Scoring & Pipeline Kanban | 🔴 9 KRITIS |
| MKT-003 | Campaign & ROI Tracker | 🟠 8 TINGGI |
| MKT-004 | Email Sequence Automation | 🟠 7 TINGGI |
| MKT-005 | Social Media Content Scheduler | 🟠 7 TINGGI |
| **M06 — Library** | | |
| LIB-001 | Asset Project (Digital Asset Management) | 🟠 7 TINGGI |
| LIB-002 | Database Referensi & SOP | 🟡 6 SEDANG |
| **M07 — Operational & HR** | | |
| OPS-001 | Absensi & Kehadiran | 🔴 9 KRITIS |
| OPS-002 | Manajemen Cuti & Izin | 🟠 8 TINGGI |
| OPS-003 | Performance Review & OKR | 🟠 8 TINGGI |
| OPS-004 | KPI SDM Dashboard | 🟠 7 TINGGI |
| OPS-005 | Procurement (Pengadaan) | 🟡 5 SEDANG |
| **M08 — Notification Center** | | |
| NOTIF-001 | In-App Notification Real-time | 🔴 10 KRITIS |
| NOTIF-002 | Email Notification | 🔴 9 KRITIS |
| NOTIF-003 | WhatsApp & Preferences | 🟠 7 TINGGI |
| **M09 — User Management** | | |
| USR-001 | User Directory & Management | 🔴 10 KRITIS |
| USR-002 | Role-Based Access Control (RBAC) | 🔴 10 KRITIS |
| USR-003 | Audit Log & Activity Trail | 🟠 8 TINGGI |
| USR-004 | Two-Factor Authentication (2FA) | 🟠 7 TINGGI |
| **M10 — Settings** | | |
| SET-001 | Profile & Preferensi Personal | 🟠 8 TINGGI |
| SET-002 | Company Settings (Admin Only) | 🟠 8 TINGGI |
| SET-003 | Document Templates (Admin Only) | 🟠 7 TINGGI |
| SET-004 | System Configuration (Admin Only) | 🟠 8 TINGGI |
| SET-005 | Integrations Hub (Admin Only) | 🟠 7 TINGGI |
| SET-006 | Security Settings (Admin Only) | 🟠 8 TINGGI |

---

## 🗺️ RENCANA PENGEMBANGAN BERTAHAP

---

### FASE 0 — Fondasi Proyek (Setup & Infrastruktur)
> **Estimasi: 1–2 hari | Prasyarat: Tidak ada**

Selesaikan ini sebelum menulis satu baris kode fitur pun.

**Yang harus dikerjakan:**

1. **Setup Proyek**
   - `npm create vite@latest ams-app -- --template react`
   - Install: `tailwindcss`, `zustand`, `react-router-dom`, `@supabase/supabase-js`, `lucide-react`
   - Konfigurasi Tailwind CSS

2. **Setup Supabase**
   - Buat project baru di Supabase
   - Aktifkan Auth (Email/Password provider)
   - Buat skema database awal (tabel `users`, `roles`, `user_roles`)
   - Aktifkan RLS di semua tabel
   - Setup environment variables di `.env.local`

3. **Setup Zustand Store**
   - `authStore`: `user`, `role`, `isLoading`, `login()`, `logout()`
   - `uiStore`: `theme` (light/dark), `sidebarOpen`, `notifications`

4. **Setup Routing**
   - React Router v6 dengan Protected Routes
   - Route guard berdasarkan role (baca role dari Zustand store)
   - Layout: `AuthLayout` (halaman login) dan `AppLayout` (sidebar + header + content)

5. **Komponen Global**
   - Sidebar dengan menu dinamis berdasarkan role
   - Header/Navbar (logo, user avatar, dark mode toggle, notification bell)
   - Loading states dan Error boundaries

6. **Deploy ke Vercel**
   - Hubungkan GitHub repo ke Vercel
   - Set environment variables di Vercel dashboard
   - Pastikan build berhasil sebelum lanjut

---

### FASE 1 — Autentikasi & User Management
> **Fitur: DASH-001, USR-001, USR-002 | Urgency: 🔴 KRITIS**
> **Estimasi: 3–5 hari | Prasyarat: Fase 0 selesai**

Ini fondasi keamanan seluruh sistem. Tidak ada fitur lain yang bisa dibangun tanpa ini.

**Yang harus dikerjakan:**

**USR-002 — RBAC (Role-Based Access Control)**
- Definisikan 10 role: `super_admin`, `director`, `cfo`, `cmo`, `coo`, `project_manager`, `creator`, `finance_staff`, `marketing_staff`, `client`
- Buat tabel `permissions` dan `role_permissions` di Supabase
- Buat tabel `modules` (daftar semua modul sistem)
- Buat Permission Matrix di database (setiap role × setiap modul × aksi: view/create/edit/delete/export/approve)
- Buat React hook `usePermission(module, action)` yang dicek di setiap komponen

**DASH-001 — Login & Role-Based Routing**
- Halaman `/login` dengan form email + password
- Integrasi Supabase Auth (`signInWithPassword`)
- Setelah login: baca role dari database → simpan ke Zustand → redirect ke dashboard sesuai role:
  - `client` → `/dashboard/client`
  - `creator` / `project_manager` → `/dashboard`
  - `cfo` / `finance_staff` → `/dashboard/finance`
  - `cmo` / `marketing_staff` → `/dashboard/marketing`
  - `coo` → `/dashboard/ops`
  - `director` / `super_admin` → `/dashboard/executive`
- "Remember Me" (30 hari)
- Session timeout setelah idle 8 jam
- Halaman error: akun suspended

**USR-001 — User Directory & Management**
- Halaman `/settings/users` (hanya Director & Super Admin)
- Tabel semua user: nama, email, role, status, last login
- Tambah user baru (kirim invitation email via Supabase Auth)
- Edit user: profil, role, status (Active/Inactive/Suspended)
- Filter & search user
- Grant Temporary Access: pilih user → modul → level → expiry date (cron job Supabase Edge Function untuk auto-revoke)
- Force logout semua session user

**Sidebar Dinamis**
- Sidebar merender menu berdasarkan role aktif dari Zustand
- Gunakan permission matrix untuk memutuskan menu mana yang muncul
- Role switcher di navbar jika user memiliki multiple role

**Supabase Tables yang dibutuhkan di Fase 1:**
```
users (id, email, name, avatar_url, role_id, division, status, last_login)
roles (id, name, label)
permissions (id, role_id, module, can_view, can_create, can_edit, can_delete, can_export, can_approve)
temporary_access (id, user_id, module, level, granted_by, expires_at)
```

---

### FASE 2 — Dashboard per Role + Notifikasi Real-time
> **Fitur: DASH-002 sampai DASH-008, NOTIF-001 | Urgency: 🔴 KRITIS**
> **Estimasi: 5–7 hari | Prasyarat: Fase 1 selesai**

> ⚠️ **Catatan untuk Antigravity:** Dashboard di fase ini akan menampilkan **placeholder/dummy data** karena modul-modul sumber data (Finance, Project, HR) belum dibangun. Bangun **struktur widget dan layout** yang sudah siap menerima data real di fase berikutnya. Gunakan Zustand untuk menyimpan data dashboard.

**NOTIF-001 — In-App Notification (Bangun dulu, sebelum widget)**
- Tabel `notifications` di Supabase: `(id, user_id, type, title, body, link, is_read, created_at)`
- Supabase Realtime: subscribe ke tabel `notifications` berdasarkan `user_id`
- Komponen: Bell icon di header dengan badge counter
- Panel slide-in: list notifikasi dengan kategori (Urgent/Action Needed/Info/System)
- Aksi: mark read, mark all read, delete, klik → navigasi ke halaman terkait
- Buat utility function `createNotification(userId, type, title, body, link)` yang akan dipakai semua modul di fase berikutnya

**DASH-002 — Executive Dashboard (Director & Super Admin)**
- Widget layout (drag & drop posisi, simpan ke DB)
- Widget: Revenue MTD, Outstanding Invoices, Net Profit MTD, Grafik P&L 6 bulan
- Widget: Proyek aktif, Task overdue, Pending approvals
- Widget: New leads, Pipeline value, Win rate
- Widget: Kehadiran hari ini, Leave pending
- Quick Actions: tombol Buat Proyek, Buat Invoice, Tambah Lead
- Export dashboard sebagai PDF

**DASH-003 — CFO Dashboard**
- Widget: Cash Position, Income vs Expense chart, P&L MTD
- Widget: Outstanding Invoice per Klien, Budget Utilization per Divisi
- Widget: Upcoming Payroll, Tax Alert, Overdue Invoices
- Filter periode: bulan ini / kuartal ini / tahun ini

**DASH-004 — CMO Dashboard**
- Widget: Lead Funnel visual, New Leads count, Lead Score Distribution
- Widget: Campaign Performance table, Email Sequence stats
- Widget: Win Rate MTD, Revenue attribution dari marketing

**DASH-005 — COO Dashboard**
- Widget: Attendance Today bar chart, Attendance Rate %, Siapa yang cuti hari ini
- Widget: Leave Approvals Pending (dengan tombol quick approve)
- Widget: OKR Achievement Rate, Performance Alert, Procurement Pending
- Widget: Overtime per divisi, Resource Utilization

**DASH-006 — Project Manager Dashboard**
- Widget: My Active Projects (hanya proyek yang PM-nya adalah user ini)
- Widget: Tasks Due This Week, Overdue Tasks, Pending Approvals
- Widget: Client Content Status, Team Workload, Upcoming Deadlines
- Quick Action: Buat task baru

**DASH-007 — Creator Dashboard**
- Widget: My Tasks Today, My Tasks This Week
- Widget: In Review (task menunggu review), Revision Needed
- Widget: Time Logged Today, Upcoming Shooting, Notifications
- Quick Action: Start timer

**DASH-008 — Client Dashboard**
- Section 1 — My Projects: daftar proyek dengan progress bar, milestone, activity feed (hanya task yang di-flag `visible_to_client = true`)
- Section 2 — Content Tracker: konten planned vs published, breakdown per platform
- Section 3 — Content Review: gallery konten pending review, tombol Approve / Request Revisi
- Section 4 — Invoices: list invoice, download PDF, tombol Bayar Sekarang
- Section 5 — Offerings/Proposals: list offering, tombol Terima / Ajukan Perubahan
- Section 6 — Brand Assets: download aset brand
- RLS: semua query WAJIB filter `client_id = auth.uid()` atau `project_id IN (projects milik client ini)`
- Mobile responsive

**Supabase Tables tambahan Fase 2:**
```
notifications (id, user_id, type, title, body, link, is_read, created_at)
dashboard_preferences (user_id, widget_layout JSONB)
```

---

### FASE 3 — Project Management (Inti Operasional)
> **Fitur: PRJ-001 sampai PRJ-008 | Urgency: 🔴🟠 KRITIS-TINGGI**
> **Estimasi: 7–10 hari | Prasyarat: Fase 1 & 2 selesai**

Ini adalah modul terbesar dan paling kompleks. Kerjakan secara berurutan dari PRJ-001 ke PRJ-008.

**PRJ-001 — Client List & Client Profile**
- Halaman `/clients`: tabel semua klien dengan search, filter (status, industri, PIC), export Excel
- CRUD klien: form dengan validasi, upload dokumen kontrak
- Halaman detail klien dengan 6 tab: Info, Proyek, Invoice (view-only untuk PM), Offering (view-only), Catatan, Dokumen
- Alert kontrak mendekati berakhir (H-30 dan H-7) → trigger `createNotification()`

**PRJ-002 — Project (Create & Detail)**
- Halaman `/projects`: list semua proyek (filter by status, klien, PM)
- Form buat proyek baru: nama, klien, tipe, timeline, assign tim, scope, milestones
- Saat proyek dibuat → otomatis: buat Kanban Board, tambah event di Calendar, kirim notifikasi ke semua member
- Halaman detail proyek: info umum, progress bar, timeline, budget tracker
- Archive proyek

**PRJ-003 — Kanban Board & Task Management**
- Papan Kanban drag-and-drop dengan kolom: To-do → In Progress → In Review → Revision → Done → Published
- Task card dengan: judul, content type, platform, assignee, deadline, priority, labels
- Detail task (modal/sidebar): deskripsi rich text, sub-tasks checklist, attachments, comments+@mention, time log, status history
- Filter board: by assignee, content type, platform, priority
- List view sebagai alternatif
- Bulk action: assign, pindah kolom, hapus
- Saat task pindah kolom → trigger otomatis (lihat Inter-Module Triggers)

**PRJ-004 — Content Progress Tracker**
- Dashboard: planned vs in-production vs approved vs published vs overdue
- Filter by klien, platform, status, periode
- Kalender konten visual
- Klik konten → buka task terkait di Kanban
- Export Content Report ke PDF

**PRJ-005 — Review & Approval Flow**
- Review Queue: list konten pending, urutkan by deadline
- Tools feedback: text comment, annotation gambar, video timecode comment
- Status: Pending → Under Review → Approved / Revision Requested
- Histori versi: V1, V2, V3
- Eskalasi otomatis jika tidak di-review dalam X hari → notifikasi ke Director

**PRJ-006 — Time Tracking**
- Timer Start/Pause/Stop di setiap task card (berjalan di background via Zustand)
- Manual entry: tanggal, jam mulai-selesai, catatan
- Cegah 2 timer aktif sekaligus
- Weekly timesheet view
- Export laporan jam ke Excel dan PDF

**PRJ-007 — Project Template** *(urgency sedang, bisa dikerjakan terakhir)*
- CRUD template (simpan struktur task, milestone, tim default)
- Gunakan template saat buat proyek baru

**PRJ-008 — File Repository per Proyek**
- Aggregasi semua file dari semua task dalam satu proyek
- Grouping: by task / by content type / by date
- Preview inline, version control (V1, V2, V3)
- Download semua sebagai ZIP
- Supabase Storage bucket per proyek

**Inter-Module Triggers yang harus diimplementasikan di Fase 3:**
- Buat Project → create Kanban Board + Calendar event + notifikasi ke tim
- Buat Task → create Calendar event pada deadline + notifikasi ke assignee
- Task → Done: progress % proyek update, counter Content Tracker update, stop timer aktif
- Task → In Review: masuk Review Queue, notifikasi ke Reviewer
- Task → Published: update Content Progress Tracker

**Supabase Tables tambahan Fase 3:**
```
clients (id, name, industry, pic_name, pic_phone, pic_email, status, contract_start, contract_end, ...)
projects (id, client_id, name, type, status, start_date, end_date, pm_id, budget, progress_pct, ...)
project_members (id, project_id, user_id, role)
tasks (id, project_id, title, content_type, platform, assignee_id, deadline, priority, status, visible_to_client, ...)
task_comments (id, task_id, user_id, body, created_at)
task_attachments (id, task_id, file_url, file_name, version)
time_logs (id, task_id, user_id, start_time, end_time, duration_seconds, note)
content_items (id, task_id, project_id, client_id, status, platform, planned_date, published_date)
review_versions (id, task_id, version_number, file_url, status)
project_templates (id, name, type, structure JSONB)
```

---

### FASE 4 — Finance (Keuangan Lengkap)
> **Fitur: FIN-001 sampai FIN-009 | Urgency: 🔴🟠 KRITIS-TINGGI**
> **Estimasi: 8–12 hari | Prasyarat: Fase 3 selesai (karena Invoice terhubung ke Client & Project)**

> ⚠️ **Catatan untuk Antigravity:** Modul Finance sangat kritis. Pastikan semua kalkulasi (pajak, payroll, P&L) dilakukan di server-side via **Supabase Edge Functions**, bukan di frontend, untuk keamanan dan konsistensi data.

**FIN-003 — Invoice Management** *(kerjakan pertama — paling kritis)*
- CRUD invoice: buat manual atau dari Offering yang disetujui
- Auto-generate nomor invoice (format konfigurabel dari SET-004)
- Line items, diskon, PPN toggle, total
- Status: Draft → Sent → Partially Paid → Paid → Overdue → Cancelled
- Kirim ke klien via email (Supabase Edge Function + email service): PDF attachment + payment link
- Saat status → Sent: notifikasi in-app ke klien (Client Dashboard) + PM terkait
- Saat status → Paid (via webhook): auto-create Income record (FIN-001)
- Recurring invoice: Edge Function cron job untuk generate invoice retainer otomatis
- Reminder: H-3 dan H+1 setelah jatuh tempo
- Export PDF (gunakan library seperti `@react-pdf/renderer` atau server-side Puppeteer via Edge Function)

**FIN-004 — Offering & Proposal**
- Buat offering dari template atau dari nol: scope, deliverables, timeline, pricing table
- Status: Draft → Sent → Viewed → Accepted / Declined / Negotiating
- Kirim via email dengan tracking open (pixel 1x1)
- Klien accept/decline via link di email atau Client Dashboard
- Saat Accepted → trigger: buat Project baru (PRJ-002) + buat Invoice pertama (FIN-003) + update lead CRM ke Won
- Share link dengan expiry date
- Export PDF

**FIN-001 — Income Management**
- List semua pemasukan (auto-created dari Invoice Paid + manual)
- Filter by periode, kategori, klien, proyek
- Export Excel dan PDF

**FIN-002 — Expense Management**
- Form pengajuan expense oleh staff (upload struk via Supabase Storage)
- Approval workflow: Staff → Manager → CFO (berdasarkan nilai threshold dari SET-004)
- Alert 80% dan 95% budget proyek/divisi
- Recurring expense

**FIN-006 — Tax Management**
- PPN: toggle per invoice, tarif dari database (SET-004), rekap bulanan
- PPh 21: kalkulasi dari data payroll
- PPh 23: tracking pembayaran ke vendor
- Alert H-7 dan H-3 sebelum jatuh tempo pelaporan
- Export rekap ke Excel

**FIN-007 — Budget Planning & Realisasi**
- Set anggaran per divisi per periode
- View realisasi vs budget: bar chart, gauge
- Variance analysis
- Export PDF dan Excel

**FIN-008 — Payroll**
- Data per karyawan: gaji pokok, tunjangan, BPJS, PPh 21
- Komponen: lembur (dari OPS-001), potongan alpha, bonus
- Run Payroll: Edge Function hitung semua karyawan
- Preview → CFO Approve → generate slip gaji PDF per karyawan
- Export CSV transfer bank (format BCA, BNI, BRI, Mandiri)
- Notifikasi ke karyawan saat slip tersedia

**FIN-009 — P&L Report & Financial Analytics**
- Income − Expense = Net Profit per periode
- Drill-down: klik angka → detail transaksi
- Trend chart 12 bulan
- Cash flow projection 30 hari ke depan
- Scheduled auto-send PDF ke Director & CFO setiap tanggal 1 (Supabase cron job)
- Export PDF dan Excel

**FIN-005 — Payment Gateway Integration**
- Integrasi Midtrans atau Xendit (pilih salah satu)
- Payment link unik per invoice
- Tombol "Bayar Sekarang" di Client Dashboard dan email
- Webhook handler: saat bayar berhasil → update status Invoice → create Income
- Partial payment support

**Supabase Tables tambahan Fase 4:**
```
invoices (id, client_id, project_id, number, date, due_date, status, subtotal, discount, tax_amount, total, ...)
invoice_items (id, invoice_id, name, qty, unit_price, subtotal)
income (id, invoice_id, client_id, project_id, amount, category, received_date, method, ...)
expenses (id, project_id, division_id, category, amount, status, submitted_by, approved_by, ...)
offerings (id, client_id, number, status, valid_until, total_amount, ...)
budgets (id, division_id, period_year, period_month, amount, category)
payroll_runs (id, period_month, period_year, status, total_amount, approved_by, ...)
payroll_items (id, payroll_run_id, user_id, base_salary, allowances, deductions, net_salary, ...)
```

---

### FASE 5 — Calendar, Marketing & CRM
> **Fitur: CAL-001, CAL-002, MKT-001, MKT-002, MKT-003 | Urgency: 🔴🟠 KRITIS-TINGGI**
> **Estimasi: 5–7 hari | Prasyarat: Fase 3 & 4 selesai**

**CAL-001 — Kalender Terpadu Multi-Source**
- Tampilan: Monthly / Weekly / Daily / Agenda
- Sumber event otomatis: Task deadline (M02), Milestone, Cuti approved (M07), Invoice due (M04)
- Color coding per sumber event
- Filter: by event type, project, assignee, klien
- Buat event manual (shooting, meeting)
- Drag event → reschedule → update deadline di sumber asalnya
- Conflict detection
- Google Calendar sync (OAuth 2.0) per user

**CAL-002 — Reminder & Recurring Event**
- Set reminder per event: 15 mnt / 1 jam / 1 hari / 3 hari / 7 hari
- Channel: In-App / Email / WhatsApp
- Pola recurring: Harian / Mingguan / Bulanan / Tahunan
- Edit: hanya event ini / ini dan selanjutnya / semua

**MKT-001 — Prospect Database & CRM**
- Tabel semua prospek: kontak, sumber, nilai deal, PIC, stage, notes
- Activity log per prospek: telepon, email, meeting, WA dengan timestamp
- Import dari CSV/Excel, duplicate detection
- Follow-up reminder
- Saat status → Won: auto-create Client record di M02 PRJ-001

**MKT-002 — Lead Scoring & Pipeline Kanban**
- Pipeline Kanban: New Lead → Contacted → Meeting → Proposal Sent → Negotiation → Won/Lost
- Lead Score (0–100): kalkulasi otomatis di background berdasarkan kriteria yang bisa dikonfigurasi (bobot dari SET-004)
- Badge: Hot/Warm/Lukewarm/Cold
- Alert: lead > threshold hari di satu stage → notifikasi ke CMO dan PIC
- Nilai total per kolom di header

**MKT-003 — Campaign & ROI Tracker**
- Buat campaign: nama, platform, budget, tanggal
- Link lead ke campaign
- Metrik: CPL, CPC, Conversion Rate, ROAS
- Grafik tren per campaign
- Export PDF dan Excel

**Supabase Tables tambahan Fase 5:**
```
calendar_events (id, title, type, source_module, source_id, start_time, end_time, user_id, client_id, project_id, is_recurring, ...)
prospects (id, name, company, industry, phone, email, source, deal_value, stage, score, pic_id, ...)
prospect_activities (id, prospect_id, type, notes, created_by, created_at)
campaigns (id, name, platform, budget, start_date, end_date, spend, leads_count, ...)
```

---

### FASE 6 — HR & Operational
> **Fitur: OPS-001, OPS-002, OPS-003, OPS-004 | Urgency: 🔴🟠 KRITIS-TINGGI**
> **Estimasi: 5–7 hari | Prasyarat: Fase 4 selesai (karena terhubung ke Payroll)**

**OPS-001 — Absensi & Kehadiran**
- Check-in via GPS (radius configurable), QR Code, atau manual HR
- Status per hari: Hadir / Terlambat / Izin / Sakit / Alpha / WFH / Dinas
- Dashboard kehadiran hari ini: siapa hadir, WFH, alpha
- Notifikasi ke supervisor jika tidak check-in 30 menit setelah jam masuk
- Rekap bulanan, export Excel
- Data absensi digunakan oleh FIN-008 Payroll untuk kalkulasi potongan

**OPS-002 — Manajemen Cuti & Izin**
- Form pengajuan: jenis cuti, tanggal, alasan, upload dokumen
- Conflict check: siapa yang cuti di tanggal yang sama (dari Calendar)
- Approval: Karyawan → Manager → HR
- Quick approve dari notifikasi (mobile-friendly)
- Saldo cuti update otomatis
- Cuti approved → muncul di Calendar (CAL-001)
- Export rekap ke Excel

**OPS-003 — Performance Review & OKR**
- Setup OKR per karyawan: Objective + Key Results + target + bobot
- Update progress mingguan
- Form review atasan: rating 1–5 per kompetensi + komentar
- Self-assessment sebelum review
- Final score = (OKR × bobot) + (Kompetensi × bobot)
- Histori review per karyawan
- Export PDF individual

**OPS-004 — KPI SDM Dashboard**
- Headcount per divisi, Attendance Rate %, Turnover Rate
- Average review score per divisi, OKR achievement rate
- Overtime per divisi, Leave utilization
- Trend 12 bulan
- Export PDF dan Excel

**Supabase Tables tambahan Fase 6:**
```
attendance (id, user_id, date, check_in_time, check_out_time, method, status, gps_lat, gps_lng, ...)
leave_requests (id, user_id, type, start_date, end_date, reason, status, approved_by, ...)
leave_balances (id, user_id, year, total_days, used_days, remaining_days)
okr_objectives (id, user_id, period, title, weight)
okr_key_results (id, objective_id, title, target, current_value, unit)
performance_reviews (id, user_id, reviewer_id, period, okr_score, competency_score, final_score, status)
```

---

### FASE 7 — Library, Notifikasi Email & WhatsApp, Settings
> **Fitur: LIB-001, LIB-002, NOTIF-002, NOTIF-003, SET-001 sampai SET-006 | Urgency: 🟠 TINGGI**
> **Estimasi: 5–7 hari | Prasyarat: Semua fase sebelumnya**

**LIB-001 — Asset Project (Digital Asset Management)**
- Upload batch via Supabase Storage
- Metadata per aset: nama, kategori, klien, proyek, versi, tags
- Preview inline: gambar, video, PDF
- Pencarian by nama, tag, klien, tipe file
- Version control
- Klien akses via Client Dashboard (read-only, hanya aset mereka)

**LIB-002 — Database Referensi & SOP**
- Upload dokumen: PDF, DOCX, PPTX
- Full-text search (Supabase Full Text Search)
- Version control dengan changelog
- Required Reading per role + tracking status baca
- Notifikasi ke divisi saat dokumen baru diupload

**NOTIF-002 — Email Notification**
- Integrasi email service (Mailgun / SendGrid / Resend)
- HTML email template responsif dengan logo perusahaan
- Event trigger email: invoice due, approval request, reminder, laporan terjadwal
- Email digest: ringkasan harian/mingguan
- Log pengiriman, retry gagal (max 3x)

**NOTIF-003 — WhatsApp & Preferences**
- Integrasi WhatsApp Business API
- Event via WA: reminder shooting H-1, approval konten urgent, invoice dibayar
- Opt-in per user dengan verifikasi nomor HP
- Preferences: toggle per event type (In-App / Email / WA), Do Not Disturb hours

**SET-001 — Profile & Preferensi Personal**
- Edit nama, foto (upload + crop), jabatan
- Ubah password
- Toggle bahasa: Bahasa Indonesia / English
- Dark Mode / Light Mode / System (simpan ke database)
- Timezone dan format tanggal

**SET-002 — Company Settings**
- Nama, alamat, NPWP, telepon, email perusahaan
- Upload logo (Supabase Storage), preview di Invoice/Offering/Slip Gaji
- Brand colors, fiscal year, working hours

**SET-003 — Document Templates**
- WYSIWYG editor untuk template Invoice, Offering, Slip Gaji, Contract, Email
- Preview real-time
- Multiple template per tipe dokumen

**SET-004 — System Configuration**
- Tax rates, approval thresholds, leave policy
- Working calendar (hari libur nasional)
- Lead scoring weights, pipeline stages
- Invoice numbering format
- Content types, social platforms

**SET-005 — Integrations Hub**
- Status dan konfigurasi setiap integrasi: Google Calendar, WhatsApp, Meta Ads, Payment Gateway, Email Service
- Tombol Test Connection
- Log error per integrasi
- Health check otomatis setiap 15 menit (Edge Function)

**SET-006 — Security Settings**
- Password policy: panjang minimum, kompleksitas, masa berlaku
- 2FA policy per role
- Session policy: durasi, auto-logout idle
- Failed login policy: max percobaan, lockout duration
- Monthly security audit report

---

### FASE 8 — Fitur Lanjutan & Polish
> **Fitur: PRJ-007, CAL-003, MKT-004, MKT-005, OPS-005, USR-003, USR-004, FIN-005 | Urgency: 🟠🟡 TINGGI-SEDANG**
> **Estimasi: 5–7 hari | Prasyarat: Semua fase sebelumnya**

- **PRJ-007** — Project Template: CRUD template proyek, gunakan saat buat proyek baru
- **CAL-003** — Resource Scheduling: booking aset fisik (kamera, drone, studio), conflict prevention
- **MKT-004** — Email Sequence Automation: builder visual, A/B testing, tracking
- **MKT-005** — Social Media Content Scheduler: koneksi Instagram/TikTok/LinkedIn via OAuth, bulk schedule
- **OPS-005** — Procurement: form pengajuan, approval workflow, asset register
- **USR-003** — Audit Log: append-only log semua aksi, filter, export CSV, security alerts
- **USR-004** — 2FA: TOTP (Google Authenticator), setup QR code, backup codes
- **FIN-005** — Payment Gateway: integrasi Midtrans/Xendit, webhook, partial payment

---

### FASE 9 — QA, Optimasi & Go Live
> **Estimasi: 3–5 hari | Prasyarat: Semua fitur selesai**

- End-to-end testing semua inter-module triggers
- Performance audit: lazy loading, image optimization, query optimization
- Supabase RLS audit: pastikan semua policy sudah benar dan tidak ada data leak antar klien
- Mobile responsive audit (khususnya Client Dashboard dan fitur approval)
- Load testing dashboard dengan data volume realistis
- Seed data demo untuk onboarding awal
- Dokumentasi API dan skema database
- Go live di Vercel production environment

---

## 🔗 INTER-MODULE TRIGGERS (Referensi Lengkap)

Tabel berikut adalah daftar semua trigger otomatis antar modul yang WAJIB diimplementasikan. Gunakan sebagai checklist.

| Event / Trigger | Efek Otomatis |
|---|---|
| User login | Deteksi role → redirect ke dashboard yang sesuai |
| Buat Project baru | → Buat Kanban Board kosong → Tambah event di Calendar → Notifikasi ke semua member |
| Buat Task di Kanban | → Buat event Calendar pada deadline → Notif assignee → Muncul di Content Progress Tracker |
| Task → Done | → Update progress % proyek → Update counter Content Tracker → Stop timer aktif |
| Task → In Review | → Masuk Review Queue → Notif Reviewer → Update widget Pending Approvals PM |
| Invoice status → Sent | → Notif in-app ke klien (Client Dashboard) → Notif PM → Email ke klien (PDF + payment link) |
| Invoice status → Paid | → Auto-create Income record → Update Client Dashboard → Notif Finance+Director+PM → Update P&L |
| Offering Accepted | → Auto-create Project → Auto-create Invoice pertama → Lead CRM → Won → Notif ke 4 role |
| Klien submit Revision Request | → Task kembali ke In Progress → Komentar masuk ke task → Notif Creator+PM (in-app+email+WA) |
| Lead baru masuk | → Hitung lead score otomatis → Mulai email sequence → Masuk Pipeline Kanban → Notif PIC Sales |
| Cuti diapprove | → Event cuti muncul di Team Calendar → Saldo cuti berkurang → Notif karyawan+HR → Data ke Payroll |
| Payroll diapprove & run | → Expense record per karyawan → Generate slip gaji PDF → Notif karyawan → Update P&L |
| Temporary Access diberikan | → Update permission cache → Notif ke user → Notif H-1 sebelum berakhir → Auto-revoke saat expired |

---

## 📁 STRUKTUR MENU & NAVIGASI

Menu sidebar bersifat **dinamis berdasarkan role** — user hanya melihat menu yang sesuai permission-nya.

| Modul | Menu Utama | Sub-Menu |
|---|---|---|
| M01 | Dashboard | Overview · Quick Actions · Notifications |
| M01 (CLIENT) | My Projects | Project Progress · Content Calendar · Activity Feed |
| M01 (CLIENT) | Documents | Invoices · Offerings · Download Center |
| M01 (CLIENT) | Content Review | Waiting Review · Approved · Revision History |
| M01 (CLIENT) | Assets | Brand Assets · Download |
| M02 | All Projects | Overview · Create Project · Archive · Templates |
| M02 | Client Profile | Info · Projects · Invoice · Offering · Notes |
| M02 | Kanban Board | By Project · By Team · All Tasks |
| M02 | Content Progress | Content Plan · Production Log · Publish Tracker |
| M02 | Review & Approval | Pending · Revision History · Approved |
| M02 | Time Tracking | Timer · Timesheet · Reports |
| M02 | File Repository | By Project · By Client · All Files |
| M03 | Team Calendar | Monthly · Weekly · Daily · Agenda |
| M03 | My Schedule | My Tasks · My Events |
| M03 | Content Calendar | By Client · All Clients |
| M03 | Resource Booking | Equipment · Studio · Vehicles |
| M04 | Overview Finance | Cash Flow · Outstanding · Budget Status |
| M04 | Income | Income List · Add Income · Categories |
| M04 | Expense | Expense List · Add Expense · Approval Queue |
| M04 | Invoice | All Invoices · Create Invoice · Recurring |
| M04 | Offering & Proposal | All Proposals · Create · Template · Win Rate |
| M04 | Budget Planning | Annual · By Division · vs Realisasi |
| M04 | Payroll | Run Payroll · Salary · Payslip · History |
| M04 | Tax Management | PPN · PPh 21 · PPh 23 |
| M04 | P&L Report | Monthly · Quarterly · Annual · Custom |
| M05 | Pipeline CRM | All Leads · My Leads · Won/Lost Analysis |
| M05 | Prospects | Database · Add Prospect · Import CSV |
| M05 | Campaigns | Active · ROI Dashboard · Ad Performance |
| M05 | Social Media | Scheduler · Published · Analytics |
| M05 | Email Automation | Sequences · Templates · Analytics |
| M05 | Reports | Win Rate · Lead Source · Conversion Funnel |
| M06 | Asset Project | All Assets · By Client · By Type · Upload |
| M06 | Database & Referensi | Industry Reports · Competitor · Benchmark |
| M06 | Brand Guidelines | By Client · Upload |
| M06 | Templates | Project · Invoice · Offering · Email |
| M07 | Attendance | Check In/Out · Daily Recap · Monthly Report |
| M07 | Leave Management | My Leave · Team Calendar · Approvals · Balance |
| M07 | Performance Review | My OKR · Team Review · Division · History |
| M07 | KPI Dashboard | Individual · Team · Division |
| M07 | Procurement | My Requests · All Requests · Approvals · Asset Register |
| M08 | All Notifications | Unread · All · By Type · By Module |
| M08 | Preferences | Channel Settings · Do Not Disturb · Email Digest |
| M09 | All Users | Active · Inactive · Client Accounts · Pending Invitation |
| M09 | Roles & Permissions | Role List · Permission Matrix · Create Role |
| M09 | Access Management | Access Requests · Temporary Access · Access Log |
| M09 | Audit Log | All Activity · By User · By Module · Security Alerts |
| M09 | Security | 2FA Management · Login History · Sessions |
| M10 | My Profile | Personal Info · Password · Photo · Language · Appearance |
| M10 | Notifications | Channel Preferences · Do Not Disturb · Digest |
| M10 | Company Settings | Profile · Logo & Branding · Fiscal Year · Working Hours |
| M10 | Document Templates | Invoice · Offering · Contract · Payslip · Email |
| M10 | System Config | Tax Rates · Approval Thresholds · Leave Policy · Stages |
| M10 | Integrations | Google Calendar · WhatsApp · Meta Ads · Payment · Email |
| M10 | Security | 2FA Policy · Password Policy · Session Policy |

---

## 📤 EXPORT & DOWNLOAD CAPABILITIES

Semua PDF di-generate server-side (Supabase Edge Function + Puppeteer atau `@react-pdf/renderer`). Template kustomisasi di Settings → Document Templates.

| Fitur | Format | Deskripsi |
|---|---|---|
| FIN-003 Invoice | PDF · Email attachment | Invoice profesional dengan branding, trigger notifikasi ke klien & PM saat Sent |
| FIN-004 Offering | PDF · Share Link (expiry) | Proposal dengan cover, scope, tabel harga, T&C |
| FIN-007 Budget Planning | PDF · Excel | Anggaran per divisi, grafik perbandingan |
| FIN-008 Payroll — Slip Gaji | PDF per karyawan · CSV Transfer Bank | Slip gaji siap distribusi, CSV format standard bank |
| FIN-009 P&L Report | PDF · Excel · Auto-email tgl 1 | Laporan laba rugi dengan grafik, scheduled ke Director & CFO |
| FIN-002 Expense Report | Excel · PDF | Rekap pengeluaran per periode/divisi/proyek |
| FIN-006 Tax Report | Excel | Rekap PPh 21, PPh 23, PPN per bulan |
| PRJ-004 Content Report | PDF | Progress konten planned vs published per platform |
| PRJ-006 Time Report | Excel · PDF | Laporan jam kerja per tim/proyek |
| PRJ-008 File Repository | ZIP | Download semua file proyek |
| OPS-001 Absensi | Excel | Rekap kehadiran bulanan untuk payroll |
| OPS-003 Performance Review | PDF per karyawan | Laporan kinerja individual |
| OPS-004 KPI SDM | PDF · Excel | Laporan KPI HR per divisi |
| MKT-003 Campaign Report | PDF · Excel | CPL, ROAS, konversi per campaign |
| PRJ-001 Client List | Excel | Database klien |
| USR-003 Audit Log | CSV | Aktivitas user untuk audit keamanan |
| Dashboard (Semua Role) | PDF snapshot | Executive summary dari semua widget dashboard |

---

*Developer Brief — v2.0 Final · Agency Management System · April 2026 · Konfidensial*
*Tech Stack diperbarui: React + Vite + Tailwind CSS · Supabase · Zustand · Vercel*
