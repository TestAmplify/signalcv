# SignalCV — Resume Tailoring Automation Platform

Build a full Next.js + Supabase + AI powered web app called **SignalCV**.

The goal:
A high-speed automation platform that allows a user to:

* Save one base resume
* Paste many job descriptions
* Instantly generate tailored resumes for each job
* Track application outcomes
* Enforce daily generation limits
* Support multi-tenant admin control

This is NOT a resume builder.
This is a **resume tailoring automation engine**.

---

# 🏗️ CORE STACK

* Next.js (App Router)
* TypeScript
* Supabase Auth
* Supabase Database
* Tailwind
* LocalStorage (for session speed)
* OpenAI/Anthropic (BYOK or Admin key)

---

# 🧭 APP STRUCTURE

Routes:

* `/` → Landing + Auth
* `/app` → Main Tailoring Workspace
* `/results` → Tailored Resume Library + Tracking
* `/settings` → AI Key Configuration
* `/admin` → Tenant Admin Dashboard
* `/super-admin` → Global Admin Dashboard

---

# 🧑‍💼 USER FLOW (END-TO-END)

## STEP 1 — LOGIN

Use Supabase Auth.

Users belong to a tenant.

After login:
Redirect to `/app`.

---

## STEP 2 — BASE RESUME SETUP (ONE TIME)

User pastes resume text.

System:

* Auto runs ATS scan immediately.
* Uses `computeAtsScore(resumeText)`.

Gate rule:

* If score < 90 → show issues list.
* If score ≥ 90 → mark as READY.

Save resume as:

```
base_resume_text
```

Stored in:

* Supabase table OR localStorage backup.

User rarely pastes again.

---

## STEP 3 — JOB DESCRIPTION INPUT (CORE ENGINE)

Main workspace:

Textarea:

* Paste job description.

Buttons:

* Tailor Resume
* Clear

System auto extracts:

* Company name
* Role title

---

## STEP 4 — DAILY LIMIT CHECK (CRITICAL)

Before AI call:

Check table:

```
daily_usage
```

Fields:

* user_id
* date
* used
* limit

Rules:

If used >= limit:
Block generation:
"Daily tailoring limit reached."

Else:
Allow generation.
Increment `used`.

Default limit:
25 per day.

Admin can override.

---

## STEP 5 — AI GENERATION ENGINE

Inputs:

* base_resume_text
* jd_text
* company
* role_title

Outputs:

1. Tailored Resume
2. Cover Letter
3. Recruiter DM

---

## AI KEY LOGIC

If `process.env.ADMIN_KEY` exists:

* Use admin key automatically.

Else:

* Require user BYOK key from Settings page.
* Block generation if missing.

ATS scan works without AI.

---

## STEP 6 — SAVE RESULT

Insert into:

```
tailored_resumes
```

Fields:

* id
* tenant_id
* user_id
* company
* role_title
* jd_text
* tailored_resume
* cover_letter
* recruiter_dm
* status
* applied_date
* created_at

---

# 📊 RESULTS PAGE (TRACKING SYSTEM)

Page: `/results`

Display list:

Each row shows:

* Company
* Role
* Created Date
* Status icons:

Icons:

* Applied
* Interview
* Rejected
* Accepted

Status enum:

```
draft
applied
interview
rejected
accepted
```

Clicking icon updates status.

If "Applied" selected:
Auto-set applied_date = today.

---

# 🧮 ATS ENGINE

Create:

`lib/ats.ts`

Function:

```
computeAtsScore(resumeText)
```

Scoring weights:

* Sections: 40%
* Contact info: 10%
* Bullet formatting: 20%
* Quantified achievements: 30%

Return:

```
{
 score: number,
 passed: boolean,
 issues: string[]
}
```

---

# 🧱 DATABASE SCHEMA

## tenants

* id
* name
* created_at

## profiles

* id (auth user id)
* tenant_id
* role (user | tenant_admin | super_admin)
* created_at

## daily_usage

* id
* tenant_id
* user_id
* date
* used
* limit
* override_by_admin
* override_reason

## tailored_resumes

(as defined above)

---

# 🏢 MULTI-TENANT RULES

Each user belongs to 1 tenant.

Tenant Admin can:

* View tenant users
* See usage stats
* Increase daily limit for a user TODAY

Super Admin can:

* View all tenants
* View all users
* See global usage
* Override limits globally

---

# 👨‍💼 ADMIN DASHBOARD

Route: `/admin`

Show:

* Users list
* Today usage:
  used / limit
* Button:
  "Increase limit for today"

---

# 🌍 SUPER ADMIN DASHBOARD

Route: `/super-admin`

Show:

* Tenants
* Total daily usage
* Tenant drill-down
* User drill-down

---

# 🎯 UI DESIGN RULES

Use Linear.app inspired minimal UI:

* Dark theme default
* Soft borders
* Glass panels
* Rounded 12–16px
* Subtle shadows
* Clean typography
* Left nav + main content

---

# 🧠 PERFORMANCE RULES

* ATS scoring local
* JD parsing local
* AI used only for writing

Process 1 generation at a time to avoid rate limits.

---

# 🔐 SECURITY RULES

* Row Level Security by tenant_id
* Users can only see their own tailored resumes
* Admins see tenant data
* Super admin sees everything

---

# ⚙️ SETTINGS PAGE

Fields:

* OpenAI key
* Anthropic key

Store in:

* localStorage

If key exists:
Enable generation.

---

# 📈 FUTURE-READY HOOKS (Just placeholders)

Add disabled UI labels:

* "Bulk Apply Mode"
* "LinkedIn Sync"
* "Export All PDFs"

---

# 🧪 VERIFICATION TESTS

Must confirm:

1. User cannot generate if ATS < 90
2. User cannot generate if daily limit reached
3. Admin can raise today's limit
4. Results save properly
5. Status tracking works

---

# 🎯 FINAL PRODUCT DEFINITION

SignalCV is:

* Resume tailoring automation engine
* Application tracking system
* Multi-tenant SaaS
* Usage-metered AI product

---

# 🔥 BUILD PRIORITY ORDER

1. Auth + tenants + profiles
2. Resume ATS gate
3. JD tailoring engine
4. Daily usage limiter
5. Results storage
6. Status tracking page
7. Admin dashboards