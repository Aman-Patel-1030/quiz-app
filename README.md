# Quiz Challenge Application

A modern, interactive quiz application built with Next.js 15, TypeScript, and Tailwind CSS. Test your knowledge with 15 multiple-choice questions in 30 minutes!

## 🌟 Live Demo

[View Live Application](https://quiz-app-brl2.vercel.app/)

## ✨ Features

### Core Functionality
- **Email Authentication**: Start page with email validation
- **15 Questions**: Questions fetched from Open Trivia Database API
- **30-Minute Timer**: Countdown timer with visual warnings when time is running low
- **Auto-Submit**: Quiz automatically submits when timer reaches zero
- **Question Navigation**: Navigate freely between any question
- **Progress Tracking**: Visual indicators for visited and answered questions
- **Detailed Results**: Side-by-side comparison of user answers vs correct answers

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Transitions between questions and UI elements
- **Real-time State Persistence**: Quiz progress is saved automatically
- **Visual Feedback**: Color-coded question statuses (answered, visited, not visited)
- **Accessibility**: Keyboard navigation and screen reader friendly

### Additional Features
- **Question Categories**: Display question category and difficulty level
- **HTML Decoding**: Properly handles special characters in questions and answers
- **Score Analytics**: Percentage score with visual performance indicators
- **Mobile Navigation**: Slide-out navigation panel for mobile devices
- **Progress Bar**: Visual representation of quiz completion

## 🏗️ Project Structure

```
quiz-app/
├── app/
│   ├── api/
│   │   └── quiz/
│   │       └── route.ts          # API route for fetching quiz questions
│   ├── quiz/
│   │   └── page.tsx              # Quiz taking page
│   ├── results/
│   │   └── page.tsx              # Results/report page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Start page with email form
│   └── globals.css               # Global styles
├── types/
│   └── quiz.ts                   # TypeScript type definitions
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd quiz-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run start
```

## 🎯 How It Works

### 1. Start Page (`/`)
- User enters their email address
- Email validation is performed
- Quiz questions are fetched from the API
- Data is stored in sessionStorage
- User is redirected to the quiz page

### 2. Quiz Page (`/quiz`)
- Displays questions one at a time
- 30-minute countdown timer starts
- Users can:
  - Select answers for each question
  - Navigate between questions using Previous/Next buttons
  - Jump to any question using the navigation panel
  - View progress in real-time
- Quiz state is persisted to sessionStorage
- Auto-submits when timer expires

### 3. Results Page (`/results`)
- Displays overall score and percentage
- Shows each question with:
  - User's answer
  - Correct answer
  - All available options
  - Visual indicators (correct/incorrect/not answered)
- Option to retake the quiz

## 🔧 Technical Implementation

### API Integration
- Questions fetched from Open Trivia Database: `https://opentdb.com/api.php?amount=15`
- Choices are shuffled using Fisher-Yates algorithm
- HTML entities are decoded for proper display

### State Management
- Uses React hooks (useState, useEffect, useCallback)
- SessionStorage for data persistence across page refreshes
- Real-time state synchronization

### Timer Implementation
- Countdown timer using setInterval
- Updates every second
- Visual warning when less than 5 minutes remain
- Automatic submission when time expires

### Navigation System
- Desktop: Fixed sidebar with question grid
- Mobile: Slide-out navigation panel
- Visual indicators:
  - 🟢 Green: Answered questions
  - 🟡 Yellow: Visited but not answered
  - ⚪ Gray: Not visited
  - 🔵 Blue: Current question

## 🎨 Design Decisions

### UI/UX
- **Color Scheme**: Indigo/Purple gradient for modern look
- **Responsive Grid**: CSS Grid for layout, Flexbox for components
- **Typography**: Clear hierarchy with multiple font sizes
- **Spacing**: Consistent padding and margins using Tailwind
- **Animations**: Transform and transition effects for smooth interactions

### Performance
- **Client-Side Rendering**: Fast page loads and interactions
- **Lazy Loading**: Only loads necessary components
- **Optimized Re-renders**: useCallback for expensive operations
- **Efficient State Updates**: Batched updates where possible

### Accessibility
- Semantic HTML elements
- Proper heading hierarchy
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly labels

## 📱 Browser Compatibility

Tested and compatible with:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 🔮 Assumptions Made

1. **Session Persistence**: Quiz data is stored in sessionStorage, meaning it persists during browser refresh but not across different tabs or after browser closure
2. **Single Attempt**: Users can retake the quiz but previous results are cleared
3. **No Backend**: All data is handled client-side; no user data is stored on a server
4. **Network Availability**: Assumes stable internet connection for API calls
5. **Question Format**: All questions are multiple-choice with 2-4 options
6. **Timer Accuracy**: Timer is based on client-side JavaScript and may have minor variations

## 🚧 Challenges & Solutions

### Challenge 1: Timer Persistence
**Problem**: Timer would reset on page refresh
**Solution**: Store start time in sessionStorage and calculate remaining time on component mount

### Challenge 2: HTML Entities in Questions
**Problem**: Questions from API contained HTML entities (`&quot;`, `&#039;`, etc.)
**Solution**: Created `decodeHtml` function using textarea element to decode entities

### Challenge 3: Choice Randomization
**Problem**: Correct answer was always in the same position
**Solution**: Implemented Fisher-Yates shuffle algorithm to randomize choices

### Challenge 4: Mobile Navigation
**Problem**: Desktop sidebar doesn't work well on mobile
**Solution**: Created responsive slide-out navigation panel for mobile devices

### Challenge 5: State Synchronization
**Problem**: State could become inconsistent across components
**Solution**: Single source of truth with sessionStorage as persistence layer

## 🛠️ Technologies Used

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (SVG)
- **API**: Open Trivia Database
- **Deployment**: Vercel (recommended)

## 📦 Deployment

### Vercel (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Click "Deploy"
   - Your app will be live in minutes!

### Netlify

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Drag and drop the `.next` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

### Other Platforms
- GitHub Pages (requires static export)
- AWS Amplify
- Cloudflare Pages
- Railway

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



## 👨‍💻 Author

Created with ❤️ for the CausalFunnel

## 🙏 Acknowledgments

- [Open Trivia Database](https://opentdb.com/) for providing free quiz questions
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for seamless deployment

---

