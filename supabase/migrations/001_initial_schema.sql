-- ============================================
-- ClassyV AMS v3 — Full Database Schema
-- Sesuai ClassyVisual_AMS_v2_Database_Schema.txt
-- Run in Supabase SQL Editor
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- LOOKUP / REFERENCE TABLES
-- =====================

CREATE TABLE public.content_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.platforms (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.departments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  head_user_id INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.national_holidays (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  year INT NOT NULL
);

-- =====================
-- M10: SETTINGS
-- =====================

CREATE TABLE public.company_settings (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  npwp TEXT,
  pkp_number TEXT,
  logo_url TEXT,
  brand_color_primary TEXT,
  brand_color_secondary TEXT,
  fiscal_year_start_month INT DEFAULT 1,
  default_work_start TIME DEFAULT '09:00',
  default_work_end TIME DEFAULT '18:00',
  work_days JSONB DEFAULT '["Mon","Tue","Wed","Thu","Fri"]',
  currency TEXT DEFAULT 'IDR',
  invoice_prefix TEXT DEFAULT 'INV',
  offering_prefix TEXT DEFAULT 'OFF',
  document_footer TEXT,
  updated_by INT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.document_templates (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  content_html TEXT,
  is_default BOOLEAN DEFAULT false,
  created_by INT,
  updated_by INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.system_configs (
  id SERIAL PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value TEXT,
  data_type TEXT,
  category TEXT,
  description TEXT,
  updated_by INT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.integration_configs (
  id SERIAL PRIMARY KEY,
  service TEXT NOT NULL,
  status TEXT DEFAULT 'disconnected',
  api_key_encrypted TEXT,
  webhook_url TEXT,
  config_json JSONB DEFAULT '{}',
  last_synced_at TIMESTAMPTZ,
  last_error TEXT,
  updated_by INT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.security_policies (
  id SERIAL PRIMARY KEY,
  policy_key TEXT UNIQUE NOT NULL,
  policy_value TEXT,
  updated_by INT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- M09: USERS & AUTH
-- =====================

CREATE TABLE public.clients (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  pic_name TEXT,
  pic_title TEXT,
  pic_phone TEXT,
  pic_email TEXT,
  address TEXT,
  website TEXT,
  service_type TEXT,
  contract_start_date DATE,
  contract_end_date DATE,
  contract_value DECIMAL(15,2),
  internal_pic_id INT,
  status TEXT DEFAULT 'active',
  total_revenue DECIMAL(15,2) DEFAULT 0,
  notes TEXT,
  created_by INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  phone TEXT,
  avatar_url TEXT,
  job_title TEXT,
  department_id INT REFERENCES public.departments(id),
  employee_type TEXT,
  user_type TEXT DEFAULT 'internal',
  client_id INT REFERENCES public.clients(id),
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active',
  joined_at DATE,
  last_login_at TIMESTAMPTZ,
  created_by INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK for departments.head_user_id now that users exists
ALTER TABLE public.departments ADD CONSTRAINT fk_dept_head FOREIGN KEY (head_user_id) REFERENCES public.users(id);
ALTER TABLE public.clients ADD CONSTRAINT fk_client_pic FOREIGN KEY (internal_pic_id) REFERENCES public.users(id);
ALTER TABLE public.clients ADD CONSTRAINT fk_client_created FOREIGN KEY (created_by) REFERENCES public.users(id);

CREATE TABLE public.roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  is_custom BOOLEAN DEFAULT false,
  parent_role_id INT REFERENCES public.roles(id),
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.permissions (
  id SERIAL PRIMARY KEY,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  UNIQUE(module, action)
);

CREATE TABLE public.role_permissions (
  role_id INT REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id INT REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE public.user_roles (
  user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
  role_id INT REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by INT REFERENCES public.users(id),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE public.user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'id',
  theme TEXT DEFAULT 'dark',
  timezone TEXT DEFAULT 'Asia/Jakarta',
  date_format TEXT DEFAULT 'DD/MM/YYYY',
  number_format TEXT DEFAULT 'id-ID',
  default_role_id INT REFERENCES public.roles(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.temporary_access_grants (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  access_level TEXT,
  granted_by INT REFERENCES public.users(id),
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_2fa (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  totp_secret TEXT,
  is_enabled BOOLEAN DEFAULT false,
  backup_codes JSONB,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash TEXT,
  device_info TEXT,
  ip_address TEXT,
  is_trusted BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  entity_type TEXT,
  entity_id INT,
  before_data JSONB,
  after_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.dashboard_widget_layouts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
  widget_key TEXT NOT NULL,
  position_x INT DEFAULT 0,
  position_y INT DEFAULT 0,
  width INT DEFAULT 1,
  height INT DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- M02: CLIENTS & PROJECTS
-- =====================

CREATE TABLE public.client_documents (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES public.clients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  doc_type TEXT,
  uploaded_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.client_notes (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES public.clients(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  note_type TEXT,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.offerings (
  id SERIAL PRIMARY KEY,
  offer_number TEXT UNIQUE,
  client_id INT REFERENCES public.clients(id),
  lead_id INT,
  title TEXT,
  service_description TEXT,
  scope_of_work TEXT,
  deliverables TEXT,
  timeline_estimate TEXT,
  terms_conditions TEXT,
  validity_days INT DEFAULT 30,
  status TEXT DEFAULT 'draft',
  revision_number INT DEFAULT 1,
  parent_offering_id INT REFERENCES public.offerings(id),
  subtotal DECIMAL(15,2) DEFAULT 0,
  discount_pct DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  decline_reason TEXT,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.offering_items (
  id SERIAL PRIMARY KEY,
  offering_id INT REFERENCES public.offerings(id) ON DELETE CASCADE,
  description TEXT,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(15,2) DEFAULT 0,
  amount DECIMAL(15,2) DEFAULT 0,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.project_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT,
  template_data JSONB DEFAULT '{}',
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.projects (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES public.clients(id),
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT,
  status TEXT DEFAULT 'active',
  progress_percent DECIMAL(5,2) DEFAULT 0,
  budget_amount DECIMAL(15,2) DEFAULT 0,
  budget_spent DECIMAL(15,2) DEFAULT 0,
  scope_of_work TEXT,
  pm_id INT REFERENCES public.users(id),
  start_date DATE,
  end_date DATE,
  from_offering_id INT REFERENCES public.offerings(id),
  from_template_id INT REFERENCES public.project_templates(id),
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.project_content_types (
  project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
  content_type_id INT REFERENCES public.content_types(id),
  PRIMARY KEY (project_id, content_type_id)
);

CREATE TABLE public.project_platforms (
  project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
  platform_id INT REFERENCES public.platforms(id),
  PRIMARY KEY (project_id, platform_id)
);

CREATE TABLE public.project_members (
  project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
  role_in_project TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

CREATE TABLE public.milestones (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  due_date DATE,
  status TEXT DEFAULT 'pending',
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.kanban_columns (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INT DEFAULT 0,
  color TEXT,
  is_done_col BOOLEAN DEFAULT false,
  is_published_col BOOLEAN DEFAULT false
);

CREATE TABLE public.tasks (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
  kanban_column_id INT REFERENCES public.kanban_columns(id),
  parent_task_id INT REFERENCES public.tasks(id),
  title TEXT NOT NULL,
  description TEXT,
  content_type_id INT REFERENCES public.content_types(id),
  platform_id INT REFERENCES public.platforms(id),
  assignee_ids JSONB DEFAULT '[]',
  reporter_id INT REFERENCES public.users(id),
  priority TEXT DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  estimated_hours DECIMAL(6,2),
  actual_hours DECIMAL(6,2),
  revision_count INT DEFAULT 0,
  is_visible_to_client BOOLEAN DEFAULT false,
  labels JSONB DEFAULT '[]',
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.task_subtasks (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_done BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.task_status_history (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES public.tasks(id) ON DELETE CASCADE,
  from_kanban_column_id INT REFERENCES public.kanban_columns(id),
  to_kanban_column_id INT REFERENCES public.kanban_columns(id),
  moved_by INT REFERENCES public.users(id),
  moved_at TIMESTAMPTZ DEFAULT now(),
  note TEXT
);

CREATE TABLE public.time_logs (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id INT REFERENCES public.users(id),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_minutes INT,
  note TEXT,
  is_manual BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.file_attachments (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES public.tasks(id),
  project_id INT REFERENCES public.projects(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INT,
  version INT DEFAULT 1,
  uploaded_by INT REFERENCES public.users(id),
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.comments (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES public.tasks(id) ON DELETE CASCADE,
  parent_comment_id INT REFERENCES public.comments(id),
  user_id INT REFERENCES public.users(id),
  content TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.comment_mentions (
  comment_id INT REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id INT REFERENCES public.users(id),
  PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE public.content_items (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES public.projects(id),
  task_id INT REFERENCES public.tasks(id),
  title TEXT,
  content_type_id INT REFERENCES public.content_types(id),
  platform_id INT REFERENCES public.platforms(id),
  planned_publish_date DATE,
  actual_publish_date DATE,
  status TEXT DEFAULT 'planned',
  revision_count INT DEFAULT 0,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.review_items (
  id SERIAL PRIMARY KEY,
  task_id INT REFERENCES public.tasks(id),
  content_item_id INT REFERENCES public.content_items(id),
  version_number INT DEFAULT 1,
  reviewer_id INT REFERENCES public.users(id),
  review_type TEXT,
  status TEXT DEFAULT 'pending',
  feedback_text TEXT,
  deadline DATE,
  escalate_after_days INT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.review_annotations (
  id SERIAL PRIMARY KEY,
  review_item_id INT REFERENCES public.review_items(id) ON DELETE CASCADE,
  user_id INT REFERENCES public.users(id),
  annotation_type TEXT,
  position_x DECIMAL(10,2),
  position_y DECIMAL(10,2),
  timecode_sec INT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- M03: CALENDAR
-- =====================

CREATE TABLE public.calendar_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  is_all_day BOOLEAN DEFAULT false,
  location TEXT,
  color TEXT,
  source_module TEXT,
  source_entity_id INT,
  project_id INT REFERENCES public.projects(id),
  created_by INT REFERENCES public.users(id),
  is_private BOOLEAN DEFAULT false,
  google_event_id TEXT,
  google_calendar_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.event_participants (
  event_id INT REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id INT REFERENCES public.users(id),
  status TEXT DEFAULT 'pending',
  PRIMARY KEY (event_id, user_id)
);

CREATE TABLE public.recurring_rules (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  rrule TEXT,
  ends_at DATE,
  max_occurrences INT
);

CREATE TABLE public.reminder_jobs (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id INT REFERENCES public.users(id),
  channel TEXT,
  send_before TEXT,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  retry_count INT DEFAULT 0,
  error_msg TEXT
);

CREATE TABLE public.resources (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  photo_url TEXT,
  serial_number TEXT,
  notes TEXT,
  status TEXT DEFAULT 'available',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.resource_bookings (
  id SERIAL PRIMARY KEY,
  resource_id INT REFERENCES public.resources(id),
  event_id INT REFERENCES public.calendar_events(id),
  project_id INT REFERENCES public.projects(id),
  booked_by INT REFERENCES public.users(id),
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  purpose TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- M04: FINANCE
-- =====================

CREATE TABLE public.income_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE public.expense_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INT REFERENCES public.departments(id)
);

CREATE TABLE public.recurring_invoice_configs (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES public.clients(id),
  project_id INT REFERENCES public.projects(id),
  amount DECIMAL(15,2),
  description TEXT,
  billing_day INT,
  ppn_enabled BOOLEAN DEFAULT true,
  auto_send BOOLEAN DEFAULT false,
  next_billing_date DATE,
  status TEXT DEFAULT 'active',
  template_id INT REFERENCES public.document_templates(id),
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  client_id INT REFERENCES public.clients(id),
  project_id INT REFERENCES public.projects(id),
  offering_id INT REFERENCES public.offerings(id),
  recurring_config_id INT REFERENCES public.recurring_invoice_configs(id),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'draft',
  subtotal DECIMAL(15,2) DEFAULT 0,
  discount_pct DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  ppn_enabled BOOLEAN DEFAULT true,
  ppn_rate DECIMAL(5,2) DEFAULT 11,
  ppn_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0,
  amount_paid DECIMAL(15,2) DEFAULT 0,
  notes TEXT,
  payment_link_url TEXT,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INT REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(15,2) DEFAULT 0,
  amount DECIMAL(15,2) DEFAULT 0,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.payment_transactions (
  id SERIAL PRIMARY KEY,
  invoice_id INT REFERENCES public.invoices(id),
  gateway TEXT,
  gateway_transaction_id TEXT,
  amount DECIMAL(15,2),
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  idempotency_key TEXT,
  raw_response JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.income_records (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES public.clients(id),
  project_id INT REFERENCES public.projects(id),
  invoice_id INT REFERENCES public.invoices(id),
  category_id INT REFERENCES public.income_categories(id),
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  receipt_method TEXT,
  receipt_url TEXT,
  received_date DATE,
  note TEXT,
  status TEXT DEFAULT 'confirmed',
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.expense_records (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES public.projects(id),
  department_id INT REFERENCES public.departments(id),
  category_id INT REFERENCES public.expense_categories(id),
  vendor_name TEXT,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  expense_date DATE,
  description TEXT,
  receipt_url TEXT,
  pph23_rate DECIMAL(5,2),
  pph23_amount DECIMAL(15,2),
  payment_method TEXT,
  status TEXT DEFAULT 'pending',
  approved_by INT REFERENCES public.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.tax_configs (
  id SERIAL PRIMARY KEY,
  tax_type TEXT NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  effective_date DATE,
  notes TEXT,
  updated_by INT REFERENCES public.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.tax_records (
  id SERIAL PRIMARY KEY,
  tax_type TEXT NOT NULL,
  period_year INT NOT NULL,
  period_month INT NOT NULL,
  total_base DECIMAL(15,2) DEFAULT 0,
  total_tax DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  export_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.budget_plans (
  id SERIAL PRIMARY KEY,
  department_id INT REFERENCES public.departments(id),
  period_type TEXT DEFAULT 'monthly',
  period_year INT NOT NULL,
  period_month INT,
  total_amount DECIMAL(15,2) DEFAULT 0,
  spent_actual DECIMAL(15,2) DEFAULT 0,
  carry_forward DECIMAL(15,2) DEFAULT 0,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.budget_items (
  id SERIAL PRIMARY KEY,
  budget_plan_id INT REFERENCES public.budget_plans(id) ON DELETE CASCADE,
  category_id INT REFERENCES public.expense_categories(id),
  amount DECIMAL(15,2) DEFAULT 0
);

CREATE TABLE public.salary_profiles (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id),
  base_salary DECIMAL(15,2) DEFAULT 0,
  fixed_transport_allowance DECIMAL(15,2) DEFAULT 0,
  fixed_meal_allowance DECIMAL(15,2) DEFAULT 0,
  variable_allowance DECIMAL(15,2) DEFAULT 0,
  bpjs_kes_company_pct DECIMAL(5,2) DEFAULT 4,
  bpjs_kes_employee_pct DECIMAL(5,2) DEFAULT 1,
  bpjs_jht_company_pct DECIMAL(5,2) DEFAULT 3.7,
  bpjs_jht_employee_pct DECIMAL(5,2) DEFAULT 2,
  bpjs_jp_company_pct DECIMAL(5,2) DEFAULT 2,
  bpjs_jp_employee_pct DECIMAL(5,2) DEFAULT 1,
  bpjs_jkk_pct DECIMAL(5,2) DEFAULT 0.24,
  bpjs_jkm_pct DECIMAL(5,2) DEFAULT 0.3,
  pph21_method TEXT DEFAULT 'gross_up',
  ptkp_status TEXT DEFAULT 'TK/0',
  effective_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.payroll_runs (
  id SERIAL PRIMARY KEY,
  period_year INT NOT NULL,
  period_month INT NOT NULL,
  status TEXT DEFAULT 'draft',
  total_gross DECIMAL(15,2) DEFAULT 0,
  total_deductions DECIMAL(15,2) DEFAULT 0,
  total_net DECIMAL(15,2) DEFAULT 0,
  csv_export_url TEXT,
  approved_by INT REFERENCES public.users(id),
  approved_at TIMESTAMPTZ,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.payroll_items (
  id SERIAL PRIMARY KEY,
  payroll_run_id INT REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
  user_id INT REFERENCES public.users(id),
  basic_salary DECIMAL(15,2) DEFAULT 0,
  transport_allowance DECIMAL(15,2) DEFAULT 0,
  meal_allowance DECIMAL(15,2) DEFAULT 0,
  variable_allowance DECIMAL(15,2) DEFAULT 0,
  overtime_hours DECIMAL(6,2) DEFAULT 0,
  overtime_rate DECIMAL(15,2) DEFAULT 0,
  overtime_amount DECIMAL(15,2) DEFAULT 0,
  bonus DECIMAL(15,2) DEFAULT 0,
  absence_deduction DECIMAL(15,2) DEFAULT 0,
  bpjs_kes_employee DECIMAL(15,2) DEFAULT 0,
  bpjs_jht_employee DECIMAL(15,2) DEFAULT 0,
  bpjs_jp_employee DECIMAL(15,2) DEFAULT 0,
  pph21 DECIMAL(15,2) DEFAULT 0,
  other_deductions DECIMAL(15,2) DEFAULT 0,
  net_salary DECIMAL(15,2) DEFAULT 0,
  slip_pdf_url TEXT
);

CREATE TABLE public.financial_reports (
  id SERIAL PRIMARY KEY,
  report_type TEXT NOT NULL,
  period_type TEXT,
  period_year INT,
  period_month INT,
  total_income DECIMAL(15,2) DEFAULT 0,
  total_expense DECIMAL(15,2) DEFAULT 0,
  net_profit DECIMAL(15,2) DEFAULT 0,
  pdf_url TEXT,
  excel_url TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  sent_to_emails JSONB DEFAULT '[]'
);

-- =====================
-- M05: CRM & MARKETING
-- =====================

CREATE TABLE public.pipeline_stages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT,
  order_index INT DEFAULT 0,
  color TEXT,
  is_won BOOLEAN DEFAULT false,
  is_lost BOOLEAN DEFAULT false,
  stay_alert_days INT DEFAULT 14
);

-- Seed default pipeline
INSERT INTO public.pipeline_stages (name, display_name, order_index, is_won, is_lost) VALUES
  ('new_lead', 'New Lead', 1, false, false),
  ('contacted', 'Contacted', 2, false, false),
  ('meeting', 'Meeting', 3, false, false),
  ('proposal_sent', 'Proposal Sent', 4, false, false),
  ('negotiation', 'Negotiation', 5, false, false),
  ('won', 'Won', 6, true, false),
  ('lost', 'Lost', 7, false, true);

CREATE TABLE public.prospects (
  id SERIAL PRIMARY KEY,
  contact_name TEXT NOT NULL,
  job_title TEXT,
  company_name TEXT,
  industry TEXT,
  phone TEXT,
  email TEXT,
  linkedin_url TEXT,
  lead_source TEXT,
  deal_value DECIMAL(15,2) DEFAULT 0,
  assigned_to INT REFERENCES public.users(id),
  stage_id INT REFERENCES public.pipeline_stages(id),
  lead_score INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  follow_up_date DATE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  client_id INT REFERENCES public.clients(id),
  notes TEXT,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK for offerings.lead_id
ALTER TABLE public.offerings ADD CONSTRAINT fk_offering_lead FOREIGN KEY (lead_id) REFERENCES public.prospects(id);

CREATE TABLE public.prospect_activities (
  id SERIAL PRIMARY KEY,
  prospect_id INT REFERENCES public.prospects(id) ON DELETE CASCADE,
  user_id INT REFERENCES public.users(id),
  activity_type TEXT NOT NULL,
  description TEXT,
  activity_date TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.prospect_stage_history (
  id SERIAL PRIMARY KEY,
  prospect_id INT REFERENCES public.prospects(id) ON DELETE CASCADE,
  from_stage_id INT REFERENCES public.pipeline_stages(id),
  to_stage_id INT REFERENCES public.pipeline_stages(id),
  moved_by INT REFERENCES public.users(id),
  moved_at TIMESTAMPTZ DEFAULT now(),
  note TEXT
);

CREATE TABLE public.lead_score_logs (
  id SERIAL PRIMARY KEY,
  prospect_id INT REFERENCES public.prospects(id) ON DELETE CASCADE,
  score INT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.campaigns (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT,
  budget DECIMAL(15,2) DEFAULT 0,
  spend_actual DECIMAL(15,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  utm_campaign TEXT,
  status TEXT DEFAULT 'active',
  total_leads INT DEFAULT 0,
  cpl DECIMAL(15,2),
  conversions INT DEFAULT 0,
  conversion_rate DECIMAL(5,2),
  revenue_attributed DECIMAL(15,2) DEFAULT 0,
  roas DECIMAL(8,2),
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.campaign_prospects (
  campaign_id INT REFERENCES public.campaigns(id) ON DELETE CASCADE,
  prospect_id INT REFERENCES public.prospects(id) ON DELETE CASCADE,
  linked_via TEXT,
  linked_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (campaign_id, prospect_id)
);

CREATE TABLE public.email_sequences (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  trigger_type TEXT,
  trigger_stage_id INT REFERENCES public.pipeline_stages(id),
  is_active BOOLEAN DEFAULT true,
  total_steps INT DEFAULT 0,
  description TEXT,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.email_sequence_steps (
  id SERIAL PRIMARY KEY,
  sequence_id INT REFERENCES public.email_sequences(id) ON DELETE CASCADE,
  step_order INT DEFAULT 1,
  delay_hours INT DEFAULT 24,
  subject TEXT,
  subject_b TEXT,
  body_html TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.email_send_logs (
  id SERIAL PRIMARY KEY,
  prospect_id INT REFERENCES public.prospects(id),
  sequence_step_id INT REFERENCES public.email_sequence_steps(id),
  from_email TEXT,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending'
);

CREATE TABLE public.social_media_accounts (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES public.clients(id),
  platform_id INT REFERENCES public.platforms(id),
  account_name TEXT,
  account_handle TEXT,
  oauth_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.social_posts (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES public.projects(id),
  content_item_id INT REFERENCES public.content_items(id),
  social_media_account_id INT REFERENCES public.social_media_accounts(id),
  platform_id INT REFERENCES public.platforms(id),
  content_type_id INT REFERENCES public.content_types(id),
  caption TEXT,
  hashtags TEXT,
  tag_location TEXT,
  media_urls JSONB DEFAULT '[]',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  external_post_id TEXT,
  error_message TEXT,
  reach INT DEFAULT 0,
  impressions INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares INT DEFAULT 0,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- M06: LIBRARY
-- =====================

CREATE TABLE public.digital_assets (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES public.clients(id),
  project_id INT REFERENCES public.projects(id),
  name TEXT NOT NULL,
  category TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  mime_type TEXT,
  size_bytes INT,
  version INT DEFAULT 1,
  tags JSONB DEFAULT '[]',
  is_deleted BOOLEAN DEFAULT false,
  uploaded_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.sop_documents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content JSONB,
  category TEXT,
  department_id INT REFERENCES public.departments(id),
  target_roles JSONB DEFAULT '[]',
  is_required_reading BOOLEAN DEFAULT false,
  is_outdated BOOLEAN DEFAULT false,
  created_by INT REFERENCES public.users(id),
  updated_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.sop_versions (
  id SERIAL PRIMARY KEY,
  document_id INT REFERENCES public.sop_documents(id) ON DELETE CASCADE,
  version_number INT DEFAULT 1,
  content JSONB,
  changelog TEXT,
  created_by INT REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.sop_read_logs (
  document_id INT REFERENCES public.sop_documents(id) ON DELETE CASCADE,
  user_id INT REFERENCES public.users(id),
  read_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (document_id, user_id)
);

-- =====================
-- M07: HR & OPERATIONS
-- =====================

CREATE TABLE public.work_shifts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id),
  shift_name TEXT,
  work_start TIME,
  work_end TIME,
  work_days JSONB DEFAULT '["Mon","Tue","Wed","Thu","Fri"]',
  effective_from DATE
);

CREATE TABLE public.attendance_records (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id),
  date DATE NOT NULL,
  check_in_at TIMESTAMPTZ,
  check_out_at TIMESTAMPTZ,
  check_in_method TEXT DEFAULT 'manual',
  check_in_lat DECIMAL(10,6),
  check_in_lng DECIMAL(10,6),
  check_in_photo_url TEXT,
  status TEXT DEFAULT 'present',
  late_minutes INT DEFAULT 0,
  overtime_minutes INT DEFAULT 0,
  shift_id INT REFERENCES public.work_shifts(id),
  hr_override BOOLEAN DEFAULT false,
  override_by INT REFERENCES public.users(id),
  override_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE public.leave_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  days_per_year INT DEFAULT 12,
  requires_document BOOLEAN DEFAULT false,
  is_paid BOOLEAN DEFAULT true
);

-- Seed leave types
INSERT INTO public.leave_types (name, days_per_year, requires_document, is_paid) VALUES
  ('Annual Leave', 12, false, true),
  ('Sick Leave', 14, true, true),
  ('Maternity Leave', 90, true, true),
  ('Unpaid Leave', 0, false, false);

CREATE TABLE public.leave_requests (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id),
  leave_type_id INT REFERENCES public.leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INT,
  reason TEXT,
  document_url TEXT,
  status TEXT DEFAULT 'pending',
  manager_id INT REFERENCES public.users(id),
  manager_approved_at TIMESTAMPTZ,
  hr_user_id INT REFERENCES public.users(id),
  hr_approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.leave_balances (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id),
  leave_type_id INT REFERENCES public.leave_types(id),
  year INT NOT NULL,
  total_days INT DEFAULT 12,
  used_days INT DEFAULT 0,
  remaining_days INT DEFAULT 12,
  carry_forward INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, leave_type_id, year)
);

CREATE TABLE public.performance_reviews (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id),
  reviewer_id INT REFERENCES public.users(id),
  period_type TEXT,
  period_year INT,
  period_month INT,
  period_quarter INT,
  self_score DECIMAL(3,1),
  competency_score DECIMAL(3,1),
  okr_achievement DECIMAL(5,2),
  final_score DECIMAL(3,2),
  qualitative_feedback TEXT,
  status TEXT DEFAULT 'draft',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  finalized_at TIMESTAMPTZ
);

CREATE TABLE public.okr_objectives (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id),
  review_id INT REFERENCES public.performance_reviews(id),
  objective TEXT NOT NULL,
  weight_pct DECIMAL(5,2) DEFAULT 25,
  period_year INT,
  period_quarter INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.okr_key_results (
  id SERIAL PRIMARY KEY,
  objective_id INT REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  target_value DECIMAL(15,2),
  current_value DECIMAL(15,2) DEFAULT 0,
  unit TEXT,
  last_updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.competency_ratings (
  id SERIAL PRIMARY KEY,
  review_id INT REFERENCES public.performance_reviews(id) ON DELETE CASCADE,
  competency TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT
);

CREATE TABLE public.kpi_sdm_snapshots (
  id SERIAL PRIMARY KEY,
  department_id INT REFERENCES public.departments(id),
  period_year INT,
  period_month INT,
  headcount INT DEFAULT 0,
  attendance_rate_pct DECIMAL(5,2),
  avg_review_score DECIMAL(3,2),
  okr_achievement_rate DECIMAL(5,2),
  turnover_rate DECIMAL(5,2),
  avg_overtime_hours DECIMAL(6,2),
  leave_utilization_avg DECIMAL(5,2),
  generated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.procurement_requests (
  id SERIAL PRIMARY KEY,
  requested_by INT REFERENCES public.users(id),
  item_name TEXT NOT NULL,
  specification TEXT,
  quantity INT DEFAULT 1,
  estimated_price DECIMAL(15,2),
  reason TEXT,
  reference_url TEXT,
  attachment_url TEXT,
  status TEXT DEFAULT 'pending',
  manager_approved_by INT REFERENCES public.users(id),
  coo_approved_by INT REFERENCES public.users(id),
  director_approved_by INT REFERENCES public.users(id),
  rejection_reason TEXT,
  expense_id INT REFERENCES public.expense_records(id),
  asset_id INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.asset_registers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  serial_number TEXT,
  purchase_date DATE,
  purchase_price DECIMAL(15,2),
  warranty_end_date DATE,
  location TEXT,
  assigned_to INT REFERENCES public.users(id),
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add FK for procurement
ALTER TABLE public.procurement_requests ADD CONSTRAINT fk_proc_asset FOREIGN KEY (asset_id) REFERENCES public.asset_registers(id);

-- =====================
-- M08: NOTIFICATIONS
-- =====================

CREATE TABLE public.notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  source_module TEXT,
  source_entity_id INT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.notification_email_logs (
  id SERIAL PRIMARY KEY,
  notification_id INT REFERENCES public.notifications(id),
  to_email TEXT,
  subject TEXT,
  template_id INT REFERENCES public.document_templates(id),
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  retry_count INT DEFAULT 0,
  error_msg TEXT
);

CREATE TABLE public.notification_wa_logs (
  id SERIAL PRIMARY KEY,
  notification_id INT REFERENCES public.notifications(id),
  to_phone TEXT,
  message_text TEXT,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  retry_count INT DEFAULT 0,
  error_msg TEXT
);

CREATE TABLE public.notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES public.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  channel_in_app BOOLEAN DEFAULT true,
  channel_email BOOLEAN DEFAULT true,
  channel_whatsapp BOOLEAN DEFAULT false,
  digest_format TEXT DEFAULT 'realtime',
  dnd_start TIME,
  dnd_end TIME,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================
-- SEED ROLES
-- =====================
INSERT INTO public.roles (name, display_name, is_system_role) VALUES
  ('super_admin', 'Super Admin', true),
  ('director', 'Director', true),
  ('cfo', 'Chief Financial Officer', true),
  ('cmo', 'Chief Marketing Officer', true),
  ('coo', 'Chief Operating Officer', true),
  ('project_manager', 'Project Manager', true),
  ('creator', 'Creator', true),
  ('finance_staff', 'Finance Staff', true),
  ('marketing_staff', 'Marketing Staff', true),
  ('client', 'Client', true);

-- =====================
-- ENABLE RLS
-- =====================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
