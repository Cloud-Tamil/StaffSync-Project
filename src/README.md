# PulseHR Enterprise · Source Architecture & Domain Documentation (`/src`)

An exhaustive, end-to-end technical reference manual covering every module, component, reactive store mechanism, business algorithm, data model, and security policy in **PulseHR Enterprise**.

---

## Table of Contents
1. [System Overview & Tech Stack](#1-system-overview--tech-stack)
2. [Complete Directory & File Architecture](#2-complete-directory--file-architecture)
3. [Type Definitions & Domain Models (`src/types.ts`)](#3-type-definitions--domain-models-srctypests)
4. [Reactive Store & State Engine (`src/context/AppContext.tsx`)](#4-reactive-store--state-engine-srccontextappcontexttsx)
5. [Theme Engine & Dynamic Styling (`src/theme/themeConfig.ts`)](#5-theme-engine--dynamic-styling-srcthemethemeconfigts)
6. [Component Reference (A to Z)](#6-component-reference-a-to-z)
7. [Core Calculation Engines & Business Logic](#7-core-calculation-engines--business-logic)
8. [Security, Privacy & RBAC Policies](#8-security-privacy--rbac-policies)
9. [Seed Data & Storage Synchronization](#9-seed-data--storage-synchronization)

---

## 1. System Overview & Tech Stack

**PulseHR Enterprise** is an enterprise-grade Workforce Management, Biometric Attendance, Shift Scheduling, and Payroll Processing Operating System built as a single-page application (SPA).

* **Runtime Framework**: React 19 (Functional components, React Hooks)
* **Build System**: Vite 8 (Ultra-fast HMR and optimized rollups)
* **Language**: TypeScript 7 (Strict null checks, zero `any` policy)
* **Styling**: Tailwind CSS v4 + Dynamic CSS Variables (`--app-primary`, `--app-accent`, `--app-bg`, `--app-surface`, `--app-radius`)
* **Icons**: `lucide-react` (Crisp SVG vector iconography)
* **Animations**: Pure CSS Transitions + `@tailwindcss/vite`
* **Storage**: LocalStorage with automatic schema recovery and encrypted JSON export/import

---

## 2. Complete Directory & File Architecture

```
src/
├── App.tsx                     # Main layout shell, tab routing & global modal overlays
├── main.tsx                    # React 19 root DOM mount point
├── index.css                   # Dynamic CSS theme custom properties & Tailwind setup
├── types.ts                    # Complete TypeScript definitions for all business domains
├── mockData.ts                 # Enterprise seed dataset (staff, shifts, punches, payroll)
├── README.md                   # This internal architecture reference guide
│
├── theme/
│   └── themeConfig.ts          # Curated color presets & dynamic DOM CSS variable injector
│
├── context/
│   └── AppContext.tsx          # Central reactive store, persistence, audit logging & business engines
│
└── components/
    ├── Header.tsx              # Top navigation bar with 3-zone contract, kiosk & theme triggers
    ├── MobileNav.tsx           # Mobile bottom tab bar with 44px+ hitboxes & safe area
    ├── DashboardOverview.tsx   # Executive command center with live workforce KPIs
    ├── EmployeeDirectory.tsx   # Personnel directory with search, department filtering & views
    ├── EmployeeProfileDrawer.tsx # Slide-over drawer with compensation, attendance & vouchers
    ├── NewEmployeeModal.tsx    # Employee onboarding modal with validation & mask formatters
    ├── AttendanceTracker.tsx   # Timesheet ledger with geofence badges & supervisor overrides
    ├── QuickPunchKioskModal.tsx# Digital punch clock with live seconds & biometric simulation
    ├── ShiftScheduler.tsx      # Weekly roster matrix, smart auto-schedule & swap exchange
    ├── LeaveManagementView.tsx # PTO balances, leave requests & authorization queue
    ├── PayrollManager.tsx      # Timesheet wage engine, tax withholding slider & ACH disbursement
    ├── PaystubModal.tsx        # Formal earnings voucher statements with print/PDF support
    ├── AuditLogViewer.tsx      # Immutable security audit trail with CSV export
    ├── SettingsView.tsx        # Security PIN setup, auto-lock timer, JSON backups & reset
    └── ThemeCustomizerModal.tsx# Real-time color picker, preset switcher & dark mode studio
```

---

## 3. Type Definitions & Domain Models (`src/types.ts`)

All entity contracts are strongly typed in `src/types.ts`:

### A. Core User & Employment Types
```typescript
export type UserRole = 'Admin' | 'Supervisor' | 'Employee';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated';
export type PayType = 'Hourly' | 'Salaried';
export type ActiveTab = 'overview' | 'directory' | 'attendance' | 'shifts' | 'payroll' | 'leave' | 'audit' | 'settings';
```

### B. Employee Entity (`Employee`)
Represents workforce profiles, departmental metadata, compensation, and encrypted/masked banking details:
* `id`: Unique system GUID (`emp-101`)
* `employeeId`: Human-readable identifier (`EMP-1001`)
* `firstName`, `lastName`, `email`, `phone`
* `department`: Operational unit (e.g., Engineering, Operations, Human Resources, Finance)
* `designation`: Official title (e.g., Senior Systems Architect)
* `employmentType`: Classification (`Full-time`, `Contract`, etc.)
* `status`: Current state (`Active`, `On Leave`, `Terminated`)
* `joinDate`: ISO date string (`2022-03-15`)
* `assignedShiftId`: Foreign key to `ShiftTemplate.id`
* `ptoBalanceDays`: Remaining paid leave quota (e.g., `18`)
* `compensation`:
  * `payType`: `Hourly` vs `Salaried`
  * `rate`: Dollar rate per hour or annualized monthly salary
  * `standardHoursPerWeek`: Standard baseline (default 40)
  * `bankName`, `accountNumberMasked`, `accountNumberRaw`, `routingNumberMasked`, `taxIdMasked`
* `emergencyContact`: Contact person, relationship, and emergency phone

### C. Attendance & Time Tracking (`AttendanceRecord`, `AttendanceBreak`)
* `id`: Unique punch ID (`att-001`)
* `employeeId`: Foreign key to `Employee.id`
* `date`: ISO date (`YYYY-MM-DD`)
* `clockIn`: Timestamp of shift start (`08:58:20`)
* `clockOut`: Timestamp of shift conclusion (`17:35:10`)
* `breaks`: Array of `AttendanceBreak` (`{ start: string, end?: string, durationMinutes?: number }`)
* `regularHours`: Computed work hours up to 8.0 hrs
* `overtimeHours`: Computed work hours exceeding 8.0 hrs
* `totalHours`: Net duration minus break intervals
* `status`: `'On-Time' | 'Late' | 'Early-Departure' | 'Half-Day' | 'Overtime' | 'Absent'`
* `location`:
  * `verified`: Geofence validation boolean
  * `geofenceLocation`: Name of authorized perimeter (e.g., `"HQ Campus North"`)
  * `ipAddress`, `latitude`, `longitude`, `distanceMeters`
* `biometricVerified`: Facial scan or fingerprint confirmation flag
* `managerApproved`: Supervisor override confirmation

### D. Shift Scheduling (`ShiftTemplate`, `ShiftAssignment`, `ShiftSwapRequest`)
* **`ShiftTemplate`**: Standardized work block definition:
  * `code`: 3-4 letter shorthand (`MOR`, `MID`, `EVE`, `NOC`)
  * `startTime` / `endTime`: Times in 24hr format (`07:00` – `15:30`)
  * `breakMinutes`: Mandatory unpaid rest period (`30` – `45` min)
  * `color`: Hex color badge
  * `requiredHeadcount`: Minimum staffing threshold
* **`ShiftAssignment`**: Individual calendar allocation:
  * `employeeId`, `shiftTemplateId`, `date`, `status` (`'Scheduled' | 'Completed' | 'Swapped' | 'Cancelled'`)
* **`ShiftSwapRequest`**: Peer-to-peer shift exchange request:
  * `requesterId`, `targetEmployeeId`, `date`, `reason`, `status` (`'Pending' | 'Approved' | 'Rejected'`)

### E. Leave Management (`LeaveRequest`, `LeaveType`)
* `leaveType`: `'Paid Time Off (PTO)' | 'Sick Leave' | 'Parental' | 'Personal' | 'Bereavement'`
* `startDate`, `endDate`, `daysCount`
* `reason`: Free-form explanation
* `status`: `'Pending' | 'Approved' | 'Rejected'`
* `reviewedBy`: Supervisor or Admin identifier

### F. Payroll Processing (`PayrollCycle`, `PayrollEntry`)
* **`PayrollCycle`**: Pay period ledger container:
  * `title`: Pay period description (e.g., `"October 2026 - Regular Cycle A"`)
  * `startDate`, `endDate`, `payDate`
  * `taxRatePercent`: Statutory tax withholding slider value (default 16%)
  * `totalGross`, `totalNet`, `totalTaxes`
  * `status`: `'Draft' | 'Under Review' | 'Approved' | 'Disbursed'`
  * `entries`: Collection of individual `PayrollEntry` vouchers
* **`PayrollEntry`**: Individual employee wage voucher:
  * `regularHours` & `regularEarnings`
  * `overtimeHours` & `overtimeEarnings` (calculated at 1.5x regular hourly rate)
  * `bonuses` & `deductions`: Array of custom line items (`{ id, description, amount }`)
  * `grossPay`: Sum of regular, OT, and bonuses minus deductions
  * `taxWithholding`: Withheld statutory taxes
  * `medicalInsurance` ($320/mo standard, $0 for contractors)
  * `retirementContribution` (4% of gross pay for full-time/part-time)
  * `netPay`: Final take-home disbursement amount
  * `paymentMethod`: `'Direct Deposit' | 'Bank Wire' | 'Cheque'`
  * `transactionRef`: Automated electronic ACH identifier (`ACH-892104`)

### G. Security & Audit Logging (`AuditLog`)
* `id`, `timestamp`, `actor`, `actorRole`
* `action`: Event verb (e.g., `CLOCK_IN`, `PAYROLL_DISBURSED`, `SECURITY_LOCK_TRIGGERED`)
* `category`: `'SECURITY' | 'EMPLOYEE' | 'ATTENDANCE' | 'SHIFT' | 'PAYROLL' | 'THEME'`
* `details`: Descriptive context
* `ipAddress`: Client IP simulation

---

## 4. Reactive Store & State Engine (`src/context/AppContext.tsx`)

`AppContext` is the central nervous system of the application. It encapsulates all application state, handles local storage synchronization, provides audit logging, and exposes business methods to all child components.

### Persistence Strategy (Storage Keys)
All state arrays are automatically serialized to `localStorage` under keyed versioned namespaces:
```typescript
const STORAGE_KEYS = {
  THEME: 'pulsehr_theme_v2',
  EMPLOYEES: 'pulsehr_employees_v2',
  SHIFTS: 'pulsehr_shifts_v2',
  ASSIGNMENTS: 'pulsehr_assignments_v2',
  ATTENDANCE: 'pulsehr_attendance_v2',
  PAYROLL: 'pulsehr_payroll_v2',
  AUDIT: 'pulsehr_audit_v2',
  LEAVE: 'pulsehr_leave_v2',
  SWAP: 'pulsehr_swap_v2',
  PIN: 'pulsehr_pin_v2',
  ROLE: 'pulsehr_role_v2',
  AUTO_LOCK: 'pulsehr_autolock_v2',
};
```

### Complete Store API (Methods & Actions)

| Method / State | Return Type | Description |
| :--- | :--- | :--- |
| **`themeSettings`** | `ThemeSettings` | Current active theme colors and border radius |
| **`setThemeSettings(settings)`** | `void` | Overrides custom colors & injects CSS vars into `:root` |
| **`applyPresetTheme(presetId)`** | `void` | Applies one of 4 curated color presets |
| **`userRole` / `setUserRole`** | `UserRole` | Switches current identity: `Admin`, `Supervisor`, `Employee` |
| **`activeTab` / `setActiveTab`** | `ActiveTab` | Manages active workspace view |
| **`isLocked` / `lockApp()`** | `boolean` | Blurs workspace and activates PIN lock modal |
| **`unlockWithPin(pin)`** | `boolean` | Verifies PIN (default `1234`) and restores workspace |
| **`autoLockMinutes`** | `number` | Inactivity timer (5m, 15m, 30m, 60m, 0 = disabled) |
| **`sensitiveDataMasked`** | `boolean` | Toggles masking for bank account and tax IDs (`•••• 5821`) |
| **`addEmployee(data)`** | `void` | Registers a new employee, logs audit, assigns initial PTO |
| **`updateEmployee(id, data)`** | `void` | Edits employee profile details |
| **`deleteEmployee(id)`** | `void` | Removes employee from active roster (Admin only) |
| **`clockIn(empId, notes, bio)`** | `void` | Records biometric timestamp punch with geofence validation |
| **`clockOut(empId, notes)`** | `void` | Calculates total hours, regular/OT split, and records timesheet |
| **`startBreak` / `endBreak`** | `void` | Logs meal/rest pauses and calculates break duration |
| **`updateAttendanceRecord(id, updates)`** | `void` | Allows supervisor manual timesheet override with audit log |
| **`assignShift(empId, shiftId, date)`** | `void` | Assigns an employee to a roster slot |
| **`autoGenerateSmartRoster(dates)`** | `void` | Algorithmic roster generation balancing shifts & leaves |
| **`submitSwapRequest(targetId, date, reason)`** | `void` | Submits peer shift exchange request |
| **`reviewSwapRequest(id, status)`** | `void` | Approves/rejects swap and swaps shift template IDs on roster |
| **`submitLeaveRequest(type, start, end, reason)`** | `void` | Files PTO/sick request and tallies day count |
| **`reviewLeaveRequest(id, status)`** | `void` | Approves leave and deducts days from `ptoBalanceDays` |
| **`runPayrollCalculation(cycleId, taxRate)`** | `void` | Reconciles timesheets with rates, applies tax rate slider |
| **`approvePayrollCycle(cycleId)`** | `void` | Advances cycle status from `Under Review` to `Approved` |
| **`disbursePayrollCycle(cycleId)`** | `void` | Completes direct deposit transfers and stamps `ACH-XXXXXX` |
| **`exportCsv(type)`** | `void` | Generates formatted CSV for employees, attendance, or payroll |
| **`exportBackupJson()`** | `void` | Downloads full encrypted system state as a JSON backup |
| **`resetToDefaultData()`** | `void` | Restores pristine demo state and clears local storage |

---

## 5. Theme Engine & Dynamic Styling (`src/theme/themeConfig.ts`)

PulseHR features a live theme engine that injects CSS custom properties directly into the DOM root (`document.documentElement.style.setProperty`).

### Theme Presets
1. **Cyberpunk Quartz** (Default): High-tech indigo primary (`#4F46E5`), cyan accent (`#06B6D4`), crisp slate surface.
2. **Nordic Emerald**: Organic corporate emerald primary (`#059669`), amber accent (`#D97706`), cool mint accents.
3. **Midnight Titanium**: Deep obsidian dark mode (`#0B0F19`), titanium violet primary (`#6366F1`), high-contrast text.
4. **Obsidian Amethyst**: Ultra-violet luxury dark mode (`#7C3AED`), fuchsia accent (`#EC4899`).

### Dynamic CSS Properties Generated
* `--app-primary`: Main buttons, active tabs, highlights
* `--app-primary-hover`: Hover states
* `--app-accent`: Badges, radar animations, alerts
* `--app-bg`: Global app background
* `--app-surface`: Cards, tables, modals
* `--app-surface-subtle`: Table headers, secondary backgrounds
* `--app-border`: Structural division borders
* `--app-text`: Primary typography
* `--app-text-muted`: Secondary metadata typography
* `--app-radius`: Configurable corner curvature (`0px` to `16px`)

---

## 6. Component Reference (A to Z)

### `App.tsx`
* **Role**: Root application container.
* **Layout Structure**:
  * Top navigation header (`Header.tsx`)
  * Main dynamic viewport with conditional rendering based on `activeTab`
  * Fixed bottom mobile touch bar (`MobileNav.tsx`)
  * Global modal overlays: Security Lock Screen, Quick Time Kiosk, Theme Customizer, Paystub Viewer, New Employee Onboarding, and Shift Swap Dialog.
* **Security Guard**: Renders the blurred PIN keypad modal when `isLocked === true`.

---

### `AttendanceTracker.tsx`
* **Role**: Timesheet ledger and punch record manager.
* **Features**:
  * Live status summary cards: Total Punches, On-Time %, Overtime Hours, Geofence Compliance.
  * Search by employee name or filter by date.
  * Geofence radar badges with distance metrics (`"HQ Campus North - 12m"`).
  * Biometric verification indicator (`Biometric Liveness Confirmed`).
  * Supervisor manual edit button allowing status overrides with mandatory audit explanation.
  * Direct CSV export of timesheet records.

---

### `AuditLogViewer.tsx`
* **Role**: Tamper-evident enterprise compliance trail.
* **Features**:
  * Real-time chronological table of every action taken in the system.
  * Category pill filter: `ALL`, `SECURITY`, `EMPLOYEE`, `ATTENDANCE`, `SHIFT`, `PAYROLL`, `THEME`.
  * Visual actor badges (`Admin`, `Supervisor`, `Employee`).
  * Simulated client IP address stamping.
  * Direct CSV export for enterprise auditing and compliance reviews.

---

### `DashboardOverview.tsx`
* **Role**: Executive command center and real-time operational dashboard.
* **Key Metrics (KPI Cards)**:
  * Total Headcount (Active, On Leave, Contract).
  * Today's Attendance Pulse (Clocked In, On Break, Absent).
  * Biometric Geofence Compliance Rate.
  * Next Payroll Cycle Countdown & Estimated Gross Liability.
* **Sub-views**:
  * Visual weekly shift distribution chart.
  * Live workforce activity feed (recent punches, leave requests, approvals).
  * Quick-launch buttons to open Kiosk, Auto-Scheduler, and Payroll Recalibration.

---

### `EmployeeDirectory.tsx`
* **Role**: Staff personnel registry.
* **Features**:
  * Dual display mode: High-density data table vs. responsive avatar grid cards.
  * Search bar with fuzzy match on Name, Title, and Employee ID (`EMP-XXXX`).
  * Department filter tabs (Engineering, Operations, Product, HR, Finance).
  * Clickable rows that open the detailed `EmployeeProfileDrawer`.
  * "Register Employee" action button opening `NewEmployeeModal`.
  * CSV export of full personnel records.

---

### `EmployeeProfileDrawer.tsx`
* **Role**: Slide-over detailed profile panel.
* **Tabs**:
  1. **Overview**: Contact info, emergency contact, role details, assigned shift.
  2. **Compensation**: Hourly rate / monthly salary, bank account, routing number, tax ID (respects global sensitive data mask toggle).
  3. **Attendance History**: Individual employee timesheet punches and total logged hours.
  4. **Pay Stubs**: Direct access to view and print official earnings vouchers for past cycles.

---

### `Header.tsx`
* **Role**: 3-Zone top navigation header.
* **Zone 1 (Left)**: PulseHR brand logo, status indicator, and current tab title.
* **Zone 2 (Center)**: Navigation tab pills with icon and badge count (desktop viewports).
* **Zone 3 (Right)**:
  * **Time Kiosk** trigger button (instant punch clock).
  * **Theme Customizer** palette icon (`🎨`).
  * **Sensitive Data Mask** eye icon (`👁`).
  * **Role Switcher** (toggle between Admin, Supervisor, and Employee).
  * **Security PIN Lock** icon (`🔒`).

---

### `LeaveManagementView.tsx`
* **Role**: Time-off and PTO administration.
* **Features**:
  * Visual cards displaying current employee PTO balance, taken days, and pending requests.
  * "Request Time Off" form with automated day duration calculator.
  * Supervisor authorization queue with one-click "Approve" and "Reject" buttons.
  * Automatic synchronization: Approved leaves deduct days from `ptoBalanceDays` and update shift assignments to prevent double booking.

---

### `MobileNav.tsx`
* **Role**: Touch navigation bar for smartphones and tablets.
* **Features**:
  * Fixed bottom docking with 44px+ minimum hitboxes.
  * Safe-area padding for modern iOS and Android home bars.
  * Icons and active indicators for 6 primary views: Overview, Staff, Kiosk, Shifts, Payroll, Settings.

---

### `NewEmployeeModal.tsx`
* **Role**: Onboarding form for new hires.
* **Fields**: First name, last name, email, phone, department, designation, employment type, pay type, compensation rate, bank name, account number, routing number, tax ID, and emergency contact.
* **Validation**: Checks for required fields and generates clean employee IDs.

---

### `PayrollManager.tsx`
* **Role**: Automated timesheet-to-wage calculation and payroll disbursement engine.
* **Features**:
  * Cycle selection and new cycle creation modal.
  * Interactive **Statutory Tax Rate Slider** (0% to 40%) that dynamically adjusts net wages.
  * Gross, tax withholding, and net wage totals.
  * Ledger table showing regular hours, OT hours, gross pay, deductions, and payment method.
  * Individual bonus and spot deduction editor.
  * Electronic disbursement flow with simulated `ACH-XXXXXX` reference generation.
  * "View Paystub" button opening `PaystubModal`.

---

### `PaystubModal.tsx`
* **Role**: Formal, printable paystub voucher statements.
* **Layout**:
  * Corporate letterhead with company info and employee details.
  * Itemized earnings table (Regular Hours, Overtime Hours, Bonuses).
  * Itemized deductions table (Tax Withholdings, Medical Insurance, Retirement 401k).
  * Net pay highlight box.
  * Browser print / Save PDF trigger (`window.print()`).

---

### `QuickPunchKioskModal.tsx`
* **Role**: Shared attendance kiosk punch clock.
* **Features**:
  * Digital high-precision ticking clock with hours, minutes, and live seconds.
  * Animated **Campus Geofence Radar** simulating real-time GPS boundary verification.
  * Employee dropdown selector with current status badge.
  * Biometric liveness check toggle simulating facial recognition.
  * Punch note input.
  * Action buttons: Clock In, Start Break, End Break, Clock Out.

---

### `SettingsView.tsx`
* **Role**: System administration, security settings, and backups.
* **Features**:
  * Change Master Security PIN (`1234`).
  * Inactivity Auto-Lock interval selector (5 min, 15 min, 30 min, 60 min, Disabled).
  * Encrypted Full JSON System Backup export.
  * Danger Zone: Restore factory baseline with confirmation modal.

---

### `ShiftScheduler.tsx`
* **Role**: Weekly workforce roster matrix.
* **Features**:
  * 7-day calendar grid (Monday to Sunday) with daily staffing summaries.
  * Shift policy templates with distinctive colors (`MOR`, `MID`, `EVE`, `NOC`).
  * "Smart Auto-Schedule Roster" algorithmic generator button.
  * Cell click-to-edit modal to reassign shifts or mark as Rest Day.
  * Peer shift swap exchange modal with supervisor authorization.

---

### `ThemeCustomizerModal.tsx`
* **Role**: Live dynamic CSS color palette builder.
* **Features**:
  * Tab 1: **Curated Presets** (Cyberpunk Quartz, Nordic Emerald, Midnight Titanium, Obsidian Amethyst).
  * Tab 2: **Custom Color Builder** (Hex color pickers for Primary, Accent, Background, and Surface).
  * Border radius slider (`0px` sharp to `16px` rounded).
  * Instant live preview across all UI elements with persistence in `localStorage`.

---

## 7. Core Calculation Engines & Business Logic

### A. Work Hours & Overtime Calculation Engine
When an employee clocks out in `clockOut(employeeId, notes)`:
1. Shift duration is calculated: `(clockOutMs - clockInMs) / 3,600,000`.
2. Total unpaid breaks are tallied: `Σ(break.durationMinutes) / 60`.
3. Net worked hours: `workedHours = Math.max(0, rawHours - totalBreakHours)`.
4. Overtime threshold:
   $$\text{regularHours} = \min(8.0, \text{workedHours})$$
   $$\text{overtimeHours} = \max(0, \text{workedHours} - 8.0)$$

### B. Automated Payroll & Tax Calculation Engine
In `runPayrollCalculation(cycleId, customTaxRate)`:
1. Scans all attendance records within the pay cycle start and end dates.
2. Hourly workers:
   $$\text{regularEarnings} = \text{regularHours} \times \text{hourlyRate}$$
   $$\text{overtimeEarnings} = \text{overtimeHours} \times (\text{hourlyRate} \times 1.5)$$
3. Salaried workers:
   $$\text{regularEarnings} = \text{monthlySalary}$$
   $$\text{overtimeEarnings} = \text{overtimeHours} \times \left(\frac{\text{monthlySalary}}{160} \times 1.5\right)$$
4. Gross Pay:
   $$\text{grossPay} = \text{regularEarnings} + \text{overtimeEarnings} + \text{bonuses} - \text{deductions}$$
5. Deductions:
   $$\text{taxWithholding} = \text{grossPay} \times \left(\frac{\text{taxRatePercent}}{100}\right)$$
   $$\text{medicalInsurance} = \begin{cases} \$0 & \text{if Contract} \\ \$320 & \text{otherwise} \end{cases}$$
   $$\text{retirementContribution} = \begin{cases} \$0 & \text{if Contract} \\ \text{grossPay} \times 0.04 & \text{otherwise} \end{cases}$$
6. Net Disbursement:
   $$\text{netPay} = \max(0, \text{grossPay} - \text{taxWithholding} - \text{medicalInsurance} - \text{retirementContribution})$$

### C. Smart Auto-Roster Balancing Engine
In `autoGenerateSmartRoster(dates)`:
1. Iterates through the given date array (Monday through Sunday).
2. For each shift template, finds candidate employees matching `assignedShiftId`.
3. Verifies employee leave records; if an employee has an approved `LeaveRequest` overlapping the date, they are excluded.
4. Allocates balanced shifts across the roster while preserving existing manual overrides outside the date range.

---

## 8. Security, Privacy & RBAC Policies

### A. Role-Based Access Control (RBAC) Matrix

| Feature / Action | Admin | Supervisor | Employee |
| :--- | :---: | :---: | :---: |
| View Dashboard KPIs | ✅ Full | ✅ Full | ⚠️ Self Metrics Only |
| Employee Directory | ✅ Full Edit | ✅ Read-Only | ⚠️ Read-Only Directory |
| Add / Delete Employee | ✅ Yes | ❌ No | ❌ No |
| Biometric Time Kiosk | ✅ Yes | ✅ Yes | ✅ Yes |
| Attendance Overrides | ✅ Yes | ✅ Yes | ❌ No |
| Shift Scheduling & Auto-Roster | ✅ Yes | ✅ Yes | ❌ No |
| Request Shift Swap | ✅ Yes | ✅ Yes | ✅ Yes |
| Approve Shift Swap | ✅ Yes | ✅ Yes | ❌ No |
| Submit Leave Request | ✅ Yes | ✅ Yes | ✅ Yes |
| Authorize Leave | ✅ Yes | ✅ Yes | ❌ No |
| Run Payroll & Adjust Tax | ✅ Yes | ❌ No | ❌ No |
| Disburse Direct Deposits | ✅ Yes | ❌ No | ❌ No |
| View Printable Paystubs | ✅ All Employees | ⚠️ Supervised Dept | ⚠️ Own Paystub Only |
| System PIN & Factory Reset | ✅ Yes | ❌ No | ❌ No |
| Compliance Audit Logs | ✅ Yes | ⚠️ View Only | ❌ No |

### B. Confidential Data Masking
When `sensitiveDataMasked === true` (toggled by the Eye icon `👁` in the header):
* Bank Account Numbers render as `•••• 5821` instead of full digits.
* Routing Numbers render as `•••• 0192`.
* Tax Identification Numbers / SSNs render as `•••-••-4921`.

### C. Inactivity Auto-Lock & Session Protection
* An inactivity timer tracks keyboard, touch, and mouse movement.
* When idle duration reaches `autoLockMinutes`, the workspace automatically locks.
* Unlocking requires the Master Security PIN (`1234`) or clicking the Biometric Passkey bypass.

---

## 9. Seed Data & Storage Synchronization

The initial dataset in `src/mockData.ts` provides a complete, realistic organizational baseline:
* **8 Diverse Employees**: Across Engineering, Operations, Human Resources, and Finance with full compensation, banking, and contact records.
* **4 Shift Templates**: Morning (`MOR`), Midday (`MID`), Evening (`EVE`), and Night (`NOC`).
* **Weekly Attendance Punches**: Records with variable clock-in times, break logs, geofence coordinates, and biometric confirmations.
* **Pre-calculated Payroll Cycles**: Monthly cycles with itemized gross earnings, taxes, and ACH references.
* **Historical Audit Logs**: Initial entries for system provisioning, shift assignments, and PIN initialization.

---

*PulseHR Enterprise Workforce Systems · Source Architecture Documentation v2.0*
