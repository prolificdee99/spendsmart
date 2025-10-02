# Design Guidelines: Student Mobile Money Expense Tracker

## Design Approach: Modern Fintech Mobile-First

**Selected Approach**: Design System-based with Material Design mobile patterns, inspired by modern fintech apps (Revolut, Wise, Monzo) for trust and clarity.

**Key Principles**:
- Mobile-first responsive design optimized for one-handed use
- Data clarity over decoration - financial information must be instantly readable
- Trust through clean, professional aesthetics
- Quick-action focused for rapid transaction entry

---

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary: 220 90% 56% (Trust blue - financial institutions)
- Primary Hover: 220 90% 48%
- Background: 0 0% 100%
- Surface: 220 13% 97%
- Surface Elevated: 0 0% 100%
- Text Primary: 220 20% 10%
- Text Secondary: 220 10% 46%
- Border: 220 13% 91%

**Dark Mode**:
- Primary: 220 90% 56%
- Primary Hover: 220 90% 64%
- Background: 220 20% 10%
- Surface: 220 18% 14%
- Surface Elevated: 220 16% 18%
- Text Primary: 220 10% 98%
- Text Secondary: 220 10% 71%
- Border: 220 13% 24%

**Accent Colors** (Category indicators):
- Food: 25 90% 60% (Warm orange)
- Transport: 270 70% 60% (Purple)
- Airtime: 340 85% 55% (Pink-red)
- Other: 200 70% 50% (Teal)

**Status Colors**:
- Success: 142 76% 36%
- Warning: 38 92% 50%
- Danger: 0 84% 60%

### B. Typography

**Font System**: System font stack for optimal mobile performance
```
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Mono (for currency): 'SF Mono', Monaco, 'Cascadia Code', monospace
```

**Scale**:
- Display (Budget totals): text-4xl font-bold (36px)
- Heading 1 (Screen titles): text-2xl font-semibold (24px)
- Heading 2 (Section headers): text-lg font-semibold (18px)
- Body: text-base font-normal (16px)
- Small (Metadata): text-sm (14px)
- Tiny (Labels): text-xs (12px)

**Currency Display**: Tabular numbers with mono font, always bold for amounts

### C. Layout System

**Spacing Primitives**: Use 4, 8, 16, 24, 32 (p-1, p-2, p-4, p-6, p-8)
- Mobile padding: px-4 (16px horizontal)
- Section spacing: space-y-6 (24px)
- Card padding: p-4
- Bottom nav clearance: pb-20 (for fixed navigation)

**Container Strategy**:
- Max width: max-w-md mx-auto (mobile-optimized, 448px)
- Full viewport height: min-h-screen
- Safe area: Account for notches with env(safe-area-inset)

### D. Component Library

**Navigation**:
- Fixed bottom tab bar (60px height) with 5 icons
- Active state: Primary color with icon + label
- Inactive: Text secondary color, icon only on smallest screens
- Floating action button (FAB) for quick transaction entry

**Cards**:
- Transaction cards: Rounded-xl, surface background, 4px left border with category color
- Summary cards: Rounded-2xl, gradient backgrounds for budget overview
- Elevation: Use subtle shadow-sm, not heavy shadows

**Forms**:
- Input fields: Rounded-lg, surface elevated background, border on focus only
- Buttons: Rounded-lg, h-12 for easy tap targets (48px minimum)
- Segmented controls for mobile money service selection
- Native-style dropdowns for categories

**Charts**:
- Pie charts: Donut style with center total, category colors
- Line charts: Smooth curves, gradient fill below line, primary color
- Bar charts: Rounded tops, subtle spacing
- Mobile optimization: Simplified data points, larger touch targets

**Data Display**:
- Transaction list: Swipe actions (edit/delete), grouped by date
- Amount display: Large, bold, right-aligned with GHS symbol
- Category badges: Pill-shaped, category color background at 10% opacity

**Modals/Sheets**:
- Bottom sheets for forms (mobile-native feel)
- Slide-up animation from bottom
- Drag-to-dismiss handle at top
- Backdrop blur

### E. Responsive Breakpoints

**Mobile-first approach**:
- Base (320px+): Single column, stacked layout
- sm (640px+): Dual column for dashboard cards
- md (768px+): Sidebar navigation option
- lg (1024px+): Multi-column dashboard, persistent sidebar

### F. Animations & Interactions

**Minimal, purposeful animations**:
- Page transitions: Slide horizontal (100ms)
- Modal entry: Slide up with spring (200ms)
- Success states: Subtle scale bounce (150ms)
- Chart loading: Fade in with stagger (300ms)
- Pull-to-refresh: Native feel spinner

**Touch Interactions**:
- Active states: Scale 0.98 on tap
- Swipe gestures: For transaction actions
- Long press: Quick category selection

---

## Screen-Specific Guidelines

**Home Screen**:
- Hero card: Monthly budget overview with circular progress, gradient background
- Quick stats row: 3-card grid (total spent, days left, average daily)
- Recent transactions list: Last 5 with "View All" link

**Dashboard**:
- Top summary cards: Spending vs Budget comparison
- Chart section: Tab switcher (Pie/Line/Bar), full width
- Category breakdown: List with progress bars and amounts

**Transaction Screen**:
- Floating FAB for quick add
- Filter chips: Category, date range, service
- Transaction list: Grouped by date, swipe-to-delete
- Empty state: Illustration with "Add your first expense" CTA

**Budget Screen**:
- Category cards with editable limits
- Visual progress rings for each budget
- Warning indicators when approaching limit
- Quick action: "Set budgets for all categories"

**Profile**:
- User card at top with avatar, name, email
- Settings list: Theme toggle (with system option), notifications, data management
- Action buttons: Export data, logout (destructive style)

---

## Images

**No hero images required** - This is a utility app focused on data and functionality. Use:
- Iconography for empty states (expense illustration)
- Category icons (food, transport, airtime, other)
- Avatar placeholders for user profile
- Chart visualizations as primary visual elements

**Icon library**: Heroicons (outline for inactive, solid for active states)

---

## Accessibility & Mobile Optimization

- Minimum tap target: 44x44px (Apple HIG standard)
- High contrast ratios: 4.5:1 for text, 3:1 for UI components
- Dark mode: True black backgrounds (0 0% 0%) for OLED battery saving
- Persistent dark mode preference in AsyncStorage
- Haptic feedback on critical actions (transaction add, delete)
- Reduced motion: Disable animations if preferred
- Screen reader labels for all interactive elements