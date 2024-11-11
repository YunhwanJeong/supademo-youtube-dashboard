# Supademo YouTube Dashboard

A responsive YouTube Dashboard app built with Next.js and TailwindCSS. This project demonstrates strong UI/UX design, efficient state management, and well-organized code, showcasing an intuitive user interface with custom video controls and local storage for persistence.

#### [Live Demo](https://supademo-youtube-dashboard.vercel.app/)

## Key Features
Key Features
- Sidebar with Search & Pagination
  - Displays a list of videos with search functionality and infinite scrolling.
- Video Player with Custom Controls
  - Includes play/pause, seek, trimming with current time indicator, allowing users to set playback ranges.
- Persistent Trims
  - Trim settings are saved in local storage, letting users revisit specific video segments.
- Responsive Design
  - Optimized layout for desktop and mobile using TailwindCSS.

## Folder Structure
```
app/
├── components/
│   ├── SideBar/          # SideBar related components
│   ├── VideoPlayer/      # VideoPlayer related components
│   └── LoadingSpinner.tsx
├── hooks/                # Custom hooks
├── data/                 # Static JSON data for YouTube videos
└── types/                # Type definitions
└── utils/                # Common util functions
````

## Installation

### Prerequisites
- Node.js 18.18 or later.

### Getting Started

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/supademo-youtube-dashboard.git
cd supademo-youtube-dashboard
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Run the Development Server
```bash
npm run dev
```
The application should now be running on http://localhost:3000.

## Usage
- Search & Browse
  - Use the sidebar to search and paginate through videos.
- Playback & Trim
  - Select a video, adjust playback trim settings.
- Responsive UI
  - Test across different devices to experience the adaptive layout.

## Highlights
- Custom Hooks
  - Encapsulated logic for separating business logics with ui components.
- Component-Based Design
  - Modular and reusable components for scalability.
- Enhanced UX
  - Smooth interactions, persistent trim settings, and real-time playback feedback.
  - Infinite scrolling for a seamless video browsing experience.