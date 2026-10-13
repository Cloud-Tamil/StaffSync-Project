# PulseHR Enterprise · Local Access & Testing Guide

A comprehensive, production-ready guide to running, accessing, and testing the **PulseHR Enterprise Workforce, Shifts & Payroll OS** locally on your machine.

---

## ⚡ 1. Quick Start (Run Locally in 3 Steps)

Open your terminal or command prompt and run:

```bash
# Step 1: Navigate to the project root directory
cd Staffsyn

# Step 2: Install all dependencies
npm install

# Step 3: Launch the local development server
npm run dev
```

The terminal will display the active server URLs:
```
  VITE v8.3.0  ready in 240 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.X:3000/
  ➜  press h + enter to show help
```

---

## 🌐 2. Accessing the Application

### A. Access on Desktop / Laptop
Open any modern web browser (Chrome, Edge, Firefox, Safari, Brave) and go to:
```
http://localhost:3000
```

### B. Access on Mobile / Tablet (Same Wi-Fi Network)
Because the dev server is configured with `--host=0.0.0.0`, you can access the app directly on your physical smartphone or iPad:
1. Make sure your phone and computer are connected to the same Wi-Fi.
2. In your phone's browser, open the **Network URL** shown in your terminal:
   ```
   http://<YOUR_COMPUTER_IP>:3000
   ```
3. Test the mobile touch ergonomics, bottom navigation bar, and Time Kiosk punch clock directly on a real touch screen!

### C. Running on an Alternate Port
If port `3000` is already in use by another app on your machine:
```bash
# Run on port 3001
npx vite --port 3001 --host=0.0.0.0

# Or let Vite automatically find the next available port
npx vite --host=0.0.0.0
```

---

## 🛠️ 3. Complete Command Reference

| Command | Description | When to Use |
| :--- | :--- | :--- |
| `npm run dev` | Starts local dev server on port 3000 with hot reload | Everyday local development & testing |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) | Verify syntax & type safety without errors |
| `npm run build` | Compiles optimized production bundle into `/dist` | Pre-deployment production verification |
| `npm run preview` | Serves the production build locally | Test production performance & assets |
| `npm run clean` | Cleans previous build artifacts (`dist`, `server.js`) | Reset build cache |

### Alternative Package Managers
If you use a package manager other than `npm`:

```bash
# Using Bun
bun install
bun run dev

# Using PNPM
pnpm install
pnpm dev

# Using Yarn
yarn install
yarn dev
```

---

## 🔑 4. Default Credentials & Quick Access Shortcuts

| Shortcut / Control | Value / Action | Location in UI |
| :--- | :--- | :--- |
| **Master Security PIN** | `1234` | Lock Screen Keypad |
| **Instant Passkey Unlock** | Click *"Biometric Passkey / Instant Unlock"* | Below PIN keypad |
| **Quick Time Kiosk** | Click **"Time Kiosk"** button | Top Header & Mobile Nav |
| **Theme Customizer** | Click **Palette Icon** (`🎨`) | Top Header & Settings |
| **Confidential Data Masking** | Click **Eye Icon** (`👁`) | Top Header right zone |
| **Role Switcher** | Switch between **Admin**, **Supervisor**, **Employee** | Top Header right zone |

---

## 🧪 5. Step-by-Step Local Testing Scenarios

Test every major system of PulseHR locally using the workflows below:

---

### Test 1: Security PIN Lock & Biometric Unlock
1. In the top navigation bar, click the **Lock Icon** (`🔒`).
2. The entire workspace will blur with a high-security lock screen.
3. Test incorrect PIN:
   - Type `9999`.
   - **Expected Result**: Error alert *"Incorrect security PIN"* is displayed, and the keypad resets.
4. Test master PIN:
   - Type `1234` (or click *"Biometric Passkey / Instant Unlock"*).
   - **Expected Result**: Session unlocks immediately, restoring your workspace, and logs an unlock event in the Audit Trail.

---

### Test 2: Role-Based Access Control (RBAC)
1. In the top header right zone, locate the **Role Selector**.
2. Click **Employee**:
   - Notice that administrative actions (Payroll authorization, System Settings, Employee Deletion) are restricted.
3. Click **Supervisor**:
   - Access shifts, attendance overrides, and leave approvals.
4. Click **Admin**:
   - Unlocks full command access: Executive Dashboard, Payroll Disbursements, Encrypted Backups, and Audit Logs.

---

### Test 3: Biometric Time Kiosk & Geofence Punch Clock
1. Click the **"Time Kiosk"** button in the header.
2. Observe the live digital clock and the animated **Campus Geofence Radar** validating real-time location.
3. Select an employee from the dropdown (e.g., `Alex Rivera`).
4. Toggle **"Biometric Liveness Check"** ON.
5. Enter a punch note: `"Arrived on site for morning shift"`.
6. Click **"Clock In (Start Shift)"**:
   - **Expected Result**: Biometric scan animation verifies liveness; employee status updates to **Active On Duty**.
7. Test **"Start Break"** / **"End Break"** and finally click **"Clock Out"**.
   - **Expected Result**: Work hours, regular hours (capped at 8), and overtime are automatically calculated and written to the Timesheets ledger.

---

### Test 4: Shift Scheduling & AI Smart Auto-Roster
1. Navigate to the **Shifts & Roster** tab.
2. View the weekly roster grid (Monday – Sunday).
3. Click the **"Smart Auto-Schedule Roster"** button.
   - **Expected Result**: The balancing engine assigns appropriate shift policies (Morning `MOR`, Midday `MID`, Evening `EVE`, Night `NOC`), honors approved PTO, and distributes 30+ slots evenly across staff.
4. Click any cell to manually reassign or mark as **Off Duty**.
5. Click **"Shift Swaps"** to test peer-to-peer shift swap requests and supervisor approval.

---

### Test 5: Payroll Engine, Statutory Tax Sliders & Paystubs
1. Navigate to the **Payroll** tab.
2. Click **"Recalculate Wages"**:
   - The engine tallies hours directly from attendance timesheets, applies 1.5x overtime multiplier, and calculates gross pay.
3. Drag the **Statutory Tax Withholding Rate** slider (e.g., from `16%` to `22%`):
   - **Expected Result**: Net pay, tax withholdings, and the distribution breakdown update instantly in real-time.
4. In the ledger table, click the **Paystub File Icon** (`📄`) for any employee:
   - **Expected Result**: Opens a formal, printable paystub voucher with earnings breakdown, tax withholdings, bank reference, and net disbursement.
5. Click **"Print / Save PDF"** to test browser print preview.
6. Click **"Authorize & Approve"** → **"Disburse Direct Deposits"**:
   - Status updates to `Disbursed` with generated `ACH-XXXXXX` payment references.

---

### Test 6: Employee Registry & Confidential Data Masking
1. Navigate to the **Directory** tab.
2. Search by name (`Elena`, `Marcus`) or filter by department (`Engineering`, `Operations`).
3. Click **"Register Employee"** to add a new team member with bank and compensation details.
4. In the top header bar, click the **Eye Icon** (`👁`):
   - **Expected Result**: Bank account numbers, routing numbers, and Tax IDs/SSNs toggle between masked (`•••• 5821`) and unmasked states.

---

### Test 7: Real-Time Dynamic Color System & Theme Engine
1. In the top header bar, click the **Palette Icon** (`🎨`).
2. Switch between curated presets:
   - **Cyberpunk Quartz** (Default high-tech indigo)
   - **Nordic Emerald** (Crisp corporate sage/forest)
   - **Midnight Titanium** (High-contrast obsidian dark)
   - **Obsidian Amethyst** (Deep violet)
3. Switch to the **Custom Color Palette Builder** tab:
   - Pick any custom brand hex color.
   - Adjust the **Border Radius** slider (from `0px` sharp to `16px` rounded).
   - **Expected Result**: All buttons, badges, navigation items, and cards update instantly across the entire application and persist in `localStorage`.

---

### Test 8: Data Backup, CSV Export & Factory Reset
1. Under **Directory**, **Attendance**, or **Payroll**, click **"Export CSV"**:
   - Instantly downloads clean, formatted spreadsheet data.
2. Navigate to **Settings** → click **"Generate Full Encrypted System Backup (.json)"**:
   - Generates an encrypted snapshot of the entire workspace state.
3. Under the Danger Zone in **Settings**, click **"Restore Initial Data"**:
   - Reverts state back to the original demo baseline.

---

## 📱 6. Mobile Emulation & Responsive Testing

To test mobile responsiveness on your desktop:
1. Press `F12` (or `Cmd+Option+I` on Mac) to open DevTools.
2. Press `Ctrl+Shift+M` (or `Cmd+Shift+M`) to toggle Device Mode.
3. Select **iPhone 14 Pro** or **Pixel 7** (viewport 390px – 412px).
4. Verify:
   - Fixed thumb-reach bottom navigation tab bar.
   - Smooth horizontal scroll on wide data tables without page breakage.
   - Compact full-screen biometric Kiosk interface.

---

## 🔍 7. Troubleshooting Local Issues

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| `Error: listen EADDRINUSE: address already in use :::3000` | Another process is already running on port 3000 | Run `npx vite --port 3001` or terminate the existing process: <br>• Linux/Mac: `lsof -ti:3000 \| xargs kill -9`<br>• Windows: `netstat -ano \| findstr :3000` |
| `npm error ERESOLVE could not resolve` | Conflicting peer dependencies (e.g. pinned esbuild) | Pull the latest `package.json` where explicit conflicting `esbuild` is removed, or run `npm install --legacy-peer-deps` |
| `tsc --noEmit` fails | Outdated or mismatched dependencies | Run `npm install` followed by `npm run lint` |
| Changes not showing in browser | Aggressive browser caching | Hard refresh via `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac) |
| Local storage corrupted | Malformed state from previous testing | In browser DevTools > Application > Storage > Local Storage > Clear, or click **"Restore Initial Data"** in App Settings |

---

## 📁 8. Project Structure

```
├── index.html              # HTML entry point with font preloads & meta tags
├── package.json            # Scripts and dependencies
├── vite.config.ts          # Vite configuration & server options
├── tsconfig.json           # TypeScript configuration
├── README.md               # This local access and testing manual
└── src/
    ├── App.tsx             # Root application shell & tab routing
    ├── main.tsx            # React DOM mounting entry point
    ├── index.css           # Tailwind CSS imports & theme custom properties
    ├── types.ts            # TypeScript definitions (Staff, Shifts, Payroll, Themes)
    ├── mockData.ts         # Seed workforce data
    ├── README.md           # Internal architectural & component docs
    ├── theme/
    │   └── themeConfig.ts  # Theme presets & CSS variable generator
    ├── context/
    │   └── AppContext.tsx  # Central reactive store & localStorage persistence
    └── components/
        ├── Header.tsx                # 3-zone responsive navigation header
        ├── MobileNav.tsx             # Bottom touch navigation bar
        ├── DashboardOverview.tsx     # Executive KPIs & real-time analytics
        ├── EmployeeDirectory.tsx     # Staff search, filtering, card/table view
        ├── EmployeeProfileDrawer.tsx # Slide-out employee detail drawer
        ├── NewEmployeeModal.tsx      # Add employee registration modal
        ├── AttendanceTracker.tsx     # Timesheets & supervisor overrides
        ├── QuickPunchKioskModal.tsx  # Biometric punch clock with geofence radar
        ├── ShiftScheduler.tsx        # Shift calendar, AI auto-roster & swaps
        ├── PayrollManager.tsx        # Wage calculation, tax slider & ACH disbursements
        ├── PaystubModal.tsx          # Printable paystub voucher generator
        ├── LeaveManagementView.tsx   # PTO balances & leave approval queue
        ├── AuditLogViewer.tsx        # Tamper-evident security audit trail
        ├── SettingsView.tsx          # PIN configuration, timeouts, JSON backups
        └── ThemeCustomizerModal.tsx  # Interactive theme and color palette picker
```

*PulseHR Enterprise Workforce Systems · Local Access & Testing Manual*