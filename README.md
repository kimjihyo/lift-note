# Lift Note

A minimal, date-centric workout tracking web app built with Next.js 16 and React 19.

## Overview

Lift Note is a mobile-first workout tracking application that helps you record and manage your training sessions. Built with modern web technologies, it provides a clean, intuitive interface focused on quick data entry and easy navigation through your workout history.

## Features

### ✅ Implemented

- **📅 Calendar-based Navigation**: Virtual scrolling calendar showing all your workout history at a glance
- **🏋️ Workout Recording**: Track exercises with sets, weight (kg), and reps for each training day
- **🏷️ Muscle Group Tags**: Categorize workouts by muscle groups (Chest, Back, Shoulders, Legs, Arms)
- **🔍 Smart Exercise Search**: Search existing exercises or quickly add custom ones
- **💾 Local Storage**: All data persisted in browser's local storage
- **🎨 Modern UI**: Clean, responsive interface built with Tailwind CSS v4 and shadcn/ui
- **⚙️ Settings Page**: Manage your exercise library (coming soon)

### 🎯 Key Highlights

- **Date-First Approach**: Calendar is the main entry point - see your workout frequency at a glance
- **Fast Input**: Minimal clicks to record sets - just enter weight and reps
- **Mobile Optimized**: Designed for quick logging on your phone at the gym
- **Custom Exercises**: Not limited to predefined exercises - add your own on the fly
- **Sticky Headers**: Exercise headers follow you as you scroll for easy reference

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Runtime**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
  - Button, Calendar, Dialog, Drawer, Badge, Input, Toggle Group
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Utilities**: [date-fns](https://date-fns.org/)
- **Virtual Scrolling**: [@tanstack/react-virtual](https://tanstack.com/virtual)

## Project Structure

```
lift-note/
├── app/
│   ├── _components/          # Shared components
│   │   ├── workout-activity-overlay.tsx
│   │   ├── workout-calendar.tsx
│   │   ├── workout-day-cell.tsx
│   │   └── workout-form.tsx
│   ├── settings/             # Settings page
│   │   └── page.tsx
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home (calendar page)
│   └── globals.css           # Global styles + Tailwind
├── components/
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── constants/
│   │   └── exercises.ts      # Default exercise list
│   ├── storage.ts            # Local storage utilities
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Data Model

```typescript
type WorkoutSet = {
  id: string;
  weight: number;  // kg
  reps: number;    // repetitions
};

type Exercise = {
  id: string;
  name: string;
  sets: WorkoutSet[];
};

type WorkoutRecord = {
  date: string; // YYYY-MM-DD
  tags: ("chest" | "back" | "shoulders" | "legs" | "arms")[];
  exercises: Exercise[];
};
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd lift-note

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Available Scripts

```bash
pnpm dev          # Start development server (port 3001)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Usage

1. **Navigate the Calendar**: Scroll through months to find the date you want to log
2. **Create a Workout**: Click on any date to open the workout form
3. **Select Muscle Groups**: Choose which muscle groups you trained (optional)
4. **Add Exercises**: Search for exercises or type a new one to add it
5. **Log Sets**: Enter weight and reps for each set
6. **Auto-Save**: Changes are automatically saved to local storage

## Features in Detail

### Virtual Scrolling Calendar

The calendar uses virtual scrolling to efficiently render months spanning 4 years (24 months before and after current month). Scroll position is preserved in session storage.

### Exercise Management

- Exercises are stored in local storage
- Comes with 27+ default exercises (Squat, Bench Press, Deadlift, etc.)
- Add custom exercises on-the-fly during workout logging
- Search and filter exercises as you type

### Smart UI Interactions

- Muscle group tags appear in header when scrolled out of view
- Exercise headers stick to top while scrolling through sets
- Drawer-based exercise picker with search
- Tap-friendly buttons and inputs optimized for mobile

## Local Storage Keys

- `lift-memo-workouts`: Workout records
- `lift-memo-exercises`: Exercise library
- `calendar-scroll-position`: Calendar scroll position (session storage)

## Development Notes

### File Naming Convention

- All files use kebab-case: `workout-calendar.tsx`, `exercise-form.tsx`
- Server components: `page.tsx` (default)
- Client components: Marked with `"use client"` directive
- Component-specific client components: Placed in `_components/` subdirectory

### Package Manager

This project uses **pnpm**. All package installation and script execution should use pnpm.

### Port Configuration

- Development server runs on port **3001** (configured in package.json)
- Port 3000 is reserved for other user applications

## Future Enhancements

- 📊 Workout statistics and progress tracking
- 📈 Exercise history charts and PR tracking
- 🔄 Import/export workout data
- 🌙 Enhanced dark mode customization
- ☁️ Optional cloud sync and backup
- 🎯 Workout templates and routines
- ⏱️ Rest timer between sets
- 📱 Progressive Web App (PWA) support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

---

Built with ❤️ using Next.js and modern web technologies.
