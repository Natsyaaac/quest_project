# Design Guidelines: Personal Programming Learning Dashboard

## Design Approach

**Hybrid Approach**: Drawing inspiration from gamified learning platforms (Duolingo, Khan Academy) combined with productivity tools (Notion, Linear) to create an engaging yet functional learning dashboard.

**Core Principle**: Motivational minimalism - clean, focused interface with strategic gamification elements to encourage daily engagement.

---

## Layout System

**Single-Page Dashboard Structure**:
- Header: Logo/title area with score display prominently visible
- Main Content Grid: 2-column desktop (stacks to single column on mobile)
  - Left Column: Learning resources cards
  - Right Column: Daily quest + achievements
- Fixed spacing units: `p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`

**Container Strategy**:
- Max-width: `max-w-6xl` for main content
- Padding: `px-4 md:px-6` for edge breathing room
- No full viewport forcing - natural scroll based on content

---

## Typography

**Font Stack**: 
- Primary: Inter or DM Sans via Google Fonts (clean, modern sans-serif)
- Monospace: JetBrains Mono for code-related elements

**Hierarchy**:
- Page Title: `text-3xl md:text-4xl font-bold`
- Section Headers: `text-xl md:text-2xl font-semibold`
- Card Titles: `text-lg font-medium`
- Body Text: `text-base`
- Small Text (stats/meta): `text-sm`

---

## Component Library

### Header Bar
- Full-width sticky header
- Left: Site title/logo ("My Programming Journey" or similar)
- Right: Total score display with trophy icon (Heroicons)
- Height: `h-16` with centered content

### Learning Resources Section
**Card Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

Each resource card:
- Icon (relevant to JavaScript/PHP/CSS) using Heroicons
- Language name as heading
- Brief description (1 line)
- "Start Learning →" link/button
- Hover: Subtle lift effect (`hover:shadow-lg transition-shadow`)

### Daily Quest Card (Prominent Placement)
- Large card with special visual treatment
- Header: "Today's Quest" with calendar icon
- Quest description in clear, readable text
- Progress indicator: Simple checkbox or completion button
- Points reward display: "+XX points"
- Auto-refreshes daily (show "New quest in XX hours" countdown)

### Side Quest List
Below main quest, smaller cards:
- 2-3 additional easy quests
- Checkbox + quest text + point value
- Completed quests show checkmark with subtle strikethrough

### Achievement System
**Achievement Grid**: `grid grid-cols-2 md:grid-cols-3 gap-3`

Achievement badges:
- Icon + title + description
- Locked state: Reduced opacity with lock icon
- Unlocked state: Full color with completion date
- Visual distinction between earned/unearned

### Score Display Widget
- Circular or semi-circular progress indicator
- Current total score (large number)
- Next milestone indicator
- Small streak counter ("5 day streak!" with fire icon)

---

## Spacing & Layout Rhythm

**Section Spacing**: `space-y-8` between major sections
**Card Padding**: `p-6` internal padding
**Grid Gaps**: `gap-4` for tight grids, `gap-6` for breathing room

**Responsive Breakpoints**:
- Mobile (base): Single column, stacked layout
- Tablet (md:): 2-column for learning resources
- Desktop (lg:): Full 3-column grid where applicable

---

## Interactive Elements

**Buttons**:
- Primary (quest completion): Medium size, rounded corners
- Secondary (learning links): Link style with arrow icon
- Checkbox inputs: Large, easy to click (`w-5 h-5`)

**Quest Completion Flow**:
1. Click "Complete Quest" button
2. Brief success animation (checkmark appears)
3. Score counter animates up
4. If achievement unlocked, show badge notification

**Animations**: Minimal and purposeful
- Score counter: Number increment animation
- Quest completion: Checkmark scale-in
- Achievement unlock: Badge pop-in with subtle glow
- No continuous animations or distractions

---

## Icons
**Library**: Heroicons via CDN (outline style for most, solid for active states)

**Icon Usage**:
- JavaScript: Code bracket icon
- PHP: Server/terminal icon
- CSS: Paint brush/palette icon
- Quest: Target/flag icon
- Achievement: Trophy/star/badge icons
- Score: Sparkles/star icon
- Streak: Fire icon

---

## Data Visualization

**Progress Indicators**:
- Linear progress bars for achievements
- Radial progress for overall score/level
- Simple number displays with icons

**Stats Cards**:
- Total quests completed
- Current streak
- Total points
- Achievement count (X/Y unlocked)

---

## Images

**No Large Hero Image** - This is a functional dashboard, not a marketing page.

**Icon Illustrations** (optional decorative elements):
- Small mascot or motivational graphic in empty states
- Badge/achievement icons can be colorful illustrations
- Keep images minimal and purposeful

---

## Mobile Optimization

- Stack all columns vertically
- Increase touch target sizes (`min-h-12` for buttons)
- Quest cards expand to full width
- Achievement grid reduces to 2 columns
- Header remains sticky for score visibility

---

## Special Considerations

**AI Quest Generation Display**:
- Show "Generated by AI" subtle badge
- Include regenerate option if quest seems too hard
- Clear expiration/reset timer

**LocalStorage Integration**:
- Visual feedback when data saves
- Export/import data option for backup

**Gamification Psychology**:
- Use encouraging micro-copy ("Great job!", "Keep it up!")
- Show progress toward next achievement
- Celebrate streaks and milestones
- Make completion satisfying with immediate visual reward