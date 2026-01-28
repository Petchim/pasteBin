# Pastebin Lite - React Frontend

A clean, modern React frontend for a Pastebin-Lite application built with Vite and TypeScript.

## 🚀 Features

- **Create Pastes**: Share text snippets with optional expiration time and view limits
- **View Pastes**: Access pastes via unique IDs with metadata display
- **Modern UI**: Clean, colorful design with smooth animations
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Type-Safe**: Built with TypeScript for better code quality

## 📋 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with CSS variables

## 📁 Project Structure

```
pastebinUi/
├── src/
│   ├── api/
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── pasteService.ts    # API service layer
│   ├── components/
│   │   └── Layout.tsx         # Layout wrapper component
│   ├── pages/
│   │   ├── CreatePaste.tsx    # Create paste page
│   │   └── ViewPaste.tsx      # View paste page
│   ├── styles/
│   │   ├── global.css         # Global styles and variables
│   │   ├── Layout.css         # Layout component styles
│   │   ├── CreatePaste.css    # Create page styles
│   │   └── ViewPaste.css      # View page styles
│   ├── App.tsx                # Main app with routing
│   ├── main.tsx               # Entry point
│   └── vite-env.d.ts          # Vite type definitions
├── index.html                 # HTML template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── vite.config.ts             # Vite config
└── README.md                  # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Backend URL**:
   Open `src/api/pasteService.ts` and update the `baseURL` to match your backend server:
   ```typescript
   const apiClient = axios.create({
     baseURL: 'http://localhost:8080', // Change this to your backend URL
     // ...
   });
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   The app will automatically open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 📖 How to Use

### Creating a Paste

1. Navigate to the home page (`/`)
2. Enter your text content in the textarea
3. (Optional) Set expiration time in seconds
4. (Optional) Set maximum number of views
5. Click "Create Paste"
6. Copy the generated paste ID or click "View Paste"

### Viewing a Paste

1. Navigate to `/paste/{id}` where `{id}` is the paste ID
2. View the paste content and metadata
3. See remaining views and expiration date if set
4. Copy the content to clipboard using the copy button

## 🎨 UI Design

The application features:

- **Gradient Headers**: Eye-catching purple-to-indigo gradients
- **Card-Based Layout**: Clean, modern card design for content
- **Smooth Animations**: Subtle transitions and hover effects
- **Color-Coded Badges**: Visual indicators for metadata
- **Responsive Design**: Mobile-first approach with breakpoints
- **Loading States**: Animated spinners for better UX
- **Error Handling**: Clear error messages with helpful icons

## 🔌 API Integration

The app integrates with the following backend endpoints:

### Create Paste
```
POST /paste-bin/v1/create-form
Body: {
  "content": "string",
  "expires_in_seconds": number | null,
  "max_views": number | null
}
Response: { "id": "string" }
```

### Fetch Paste
```
GET /paste-bin/v1/paste/{id}
Response: {
  "content": "string",
  "remaining_views": number | null,
  "expires_at": "ISO timestamp" | null
}
```

## 🧑‍💻 Code Explanation (For Junior Developers)

### Component Structure

**Layout.tsx**: Wraps all pages with a consistent header and footer. Uses React Router's `Link` for navigation.

**CreatePaste.tsx**: 
- Uses `useState` to manage form inputs and UI state
- Handles form submission with `handleSubmit`
- Calls `createPaste` API function
- Shows success state with paste ID after creation

**ViewPaste.tsx**:
- Uses `useParams` to get paste ID from URL
- Uses `useEffect` to fetch paste data on mount
- Displays loading, error, or success states
- Formats expiration date for readability

### State Management

We use React's built-in hooks:
- `useState`: For component-level state (form inputs, loading, errors)
- `useEffect`: For side effects (API calls when component mounts)
- `useNavigate`: For programmatic navigation
- `useParams`: For reading URL parameters

### Styling Approach

- **CSS Variables**: Defined in `global.css` for consistent theming
- **BEM-like Naming**: Clear, descriptive class names
- **Mobile-First**: Base styles for mobile, media queries for desktop
- **No Framework**: Pure CSS for maximum control and learning

## 📝 Notes

- No authentication is implemented (as per requirements)
- Backend URL must be configured before running
- All components use functional components with hooks
- TypeScript ensures type safety throughout the app

## 🤝 Contributing

This is a learning project. Feel free to explore the code and understand how React, TypeScript, and Vite work together!

---

Built with ❤️ using React + TypeScript + Vite
