# 💎 Gemora Mobile

<div align="center">
  <img src="./assets/images/logo.png" alt="Gemora Logo" width="150" />
  
  **A Modern Gemstone Trading & Auction Platform**
  
  ![React Native](https://img.shields.io/badge/React_Native-0.81.4-61DAFB?style=flat&logo=react)
  ![Expo](https://img.shields.io/badge/Expo-~54.0.12-000020?style=flat&logo=expo)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat&logo=typescript)
  ![License](https://img.shields.io/badge/License-MIT-green.svg)
</div>

---

## 📱 About

**Gemora** is a comprehensive mobile application designed for gemstone enthusiasts, traders, and collectors. The platform combines a modern marketplace with real-time auctions, AI-powered gem identification, and secure trading features.

### ✨ Key Features

#### 🛒 **Marketplace & Trading**
- Browse approved gemstone listings with detailed information
- Filter and search gems by category, price, and origin
- View high-quality images and certification documents
- Two listing types: Direct Sale and Auction

#### 🏆 **Auction System**
- Real-time bidding on auction listings
- Live countdown timers for active auctions
- Bid history and highest bid tracking
- Automatic auction expiration handling

#### 🤖 **AI-Powered Features**
- **Gem Prediction**: Upload a photo to identify gem types using AI
- **AI Chatbot**: Get instant assistance about gemstones, pricing, and care
- Markdown-formatted responses for better readability

#### 💬 **Communication**
- Direct messaging between buyers and sellers
- Chat history organized by gem listing
- Inbox with unread message notifications
- Real-time message status tracking

#### 👤 **User Management**
- Secure authentication with JWT tokens
- ID verification during registration (front, back, and selfie)
- Profile editing with photo updates
- Role-based access control

#### 📋 **Additional Features**
- Support ticket system with priority levels
- Gem listing management (create, edit, mark as sold)
- Certificate upload and verification
- Dark/Light theme toggle
- Offline data persistence

---

## 🛠 Tech Stack

### **Frontend**
- **React Native** 0.81.4 - Cross-platform mobile development
- **Expo** ~54.0.12 - Development platform and tools
- **TypeScript** - Type-safe development
- **NativeWind** - Tailwind CSS for React Native
- **Expo Router** - File-based navigation

### **State Management & Data**
- **Zustand** - Lightweight state management
- **AsyncStorage** - Persistent local storage
- **Axios** - HTTP client for API requests

### **UI Components & Libraries**
- **React Navigation** - Navigation framework
- **Expo Image** - Optimized image handling
- **Expo Image Picker** - Camera and gallery access
- **React Native Markdown** - Rich text rendering
- **Expo Vector Icons** - Comprehensive icon library

### **Development Tools**
- **ESLint** - Code linting
- **Babel** - JavaScript compiler
- **Metro** - JavaScript bundler

---

## 📁 Project Structure

```
gemora-mobile/
├── app/                        # File-based routing (Expo Router)
│   ├── _layout.tsx            # Root layout with theme provider
│   ├── index.tsx              # App entry point
│   ├── (auth)/                # Authentication screens
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot.tsx
│   └── (main)/                # Main app (authenticated)
│       ├── _layout.tsx        # Tab navigation layout
│       ├── (home)/            # Home tab
│       │   ├── index.tsx      # Dashboard
│       │   └── sellgem.tsx    # Create gem listing
│       ├── (market)/          # Market tab
│       │   ├── index.tsx      # Marketplace listings
│       │   └── gemdetail.tsx  # Gem details & bidding
│       ├── (inbox)/           # Inbox tab
│       │   ├── index.tsx      # Chat list
│       │   └── ChatScreen.tsx # Chat conversation
│       ├── (predict)/         # Predict tab
│       │   └── index.tsx      # AI gem identification
│       └── (profile)/         # Profile tab
│           ├── index.tsx      # User profile
│           ├── edit.tsx       # Edit profile
│           ├── myads.tsx      # My gem listings
│           ├── mytickets.tsx  # Support tickets
│           └── security.tsx   # Security settings
│
├── lib/                       # Services & API clients
│   ├── apiClient.ts          # Axios configuration & interceptors
│   ├── authService.ts        # Authentication APIs
│   ├── gemService.ts         # Gem CRUD operations
│   ├── gemMarketService.ts   # Marketplace APIs
│   ├── bidService.ts         # Auction & bidding APIs
│   ├── chatService.ts        # Messaging APIs
│   ├── chatbotService.ts     # AI chatbot APIs
│   ├── predictService.ts     # AI gem prediction APIs
│   ├── profileService.ts     # User profile APIs
│   ├── ticketService.ts      # Support ticket APIs
│   └── utils.ts              # Helper functions
│
├── components/                # Reusable components
│   ├── chatbot/
│   │   ├── ChatbotButton.tsx # Floating chat button
│   │   └── ChatbotModal.tsx  # Chat interface
│   └── common/
│       ├── Button.tsx        # Custom button component
│       └── Input.tsx         # Custom input component
│
├── store/                     # State management
│   └── useAuthStore.ts       # Authentication state (Zustand)
│
├── context/                   # React contexts
│   └── ThemeContext.tsx      # Theme provider (light/dark)
│
├── assets/                    # Static assets
│   └── images/               # App images & icons
│
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── metro.config.js           # Metro bundler configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── global.css                # Global styles
└── package.json              # Dependencies & scripts
```

---

## 🚀 Getting Started

### **Prerequisites**

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (optional, recommended for iOS simulator)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/CapstoneCrew2025/gemora-mobile.git
   cd gemora-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure the backend connection**
   
   Update the backend server IP in `lib/apiClient.ts`:
   ```typescript
   const YOUR_IP = 'YOUR_MACHINE_IP'; // Replace with your backend IP
   ```
   
   To find your IP address:
   - **Windows**: `ipconfig` → Look for IPv4 Address
   - **macOS/Linux**: `ifconfig` or `ip addr`

4. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

5. **Run on device/simulator**
   
   After starting the server, you'll see a QR code. You can:
   
   - **Android**: Press `a` to open in Android emulator, or scan QR with Expo Go app
   - **iOS**: Press `i` to open in iOS simulator (macOS only), or scan QR with Expo Go app
   - **Web**: Press `w` to open in web browser

### **Backend Setup**

This app requires a backend API. Ensure your backend is running and accessible at the configured IP address. The API should be available at `http://YOUR_IP:8080/api`.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo development server |
| `npm run android` | Run on Android device/emulator |
| `npm run ios` | Run on iOS simulator (macOS only) |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint code linter |
| `npm run reset-project` | Reset project to clean state |

---

## 🔐 Authentication Flow

1. **Registration**: Users register with personal details and upload ID verification photos (front, back, and selfie)
2. **Login**: Email and password authentication with JWT token
3. **Token Management**: Automatic token storage and injection in API requests
4. **Session Persistence**: Auth state persists across app restarts
5. **Auto-redirect**: Unauthenticated users are redirected to login

---

## 🎨 Theming

The app supports both light and dark themes with:
- System appearance detection
- Manual theme toggle
- Persistent theme preference
- Smooth theme transitions
- Optimized color palettes for readability

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo` | Development platform |
| `react-native` | Mobile framework |
| `expo-router` | File-based routing |
| `axios` | HTTP client |
| `zustand` | State management |
| `nativewind` | Styling with Tailwind |
| `@react-native-async-storage/async-storage` | Local storage |
| `expo-image-picker` | Image selection |
| `react-native-markdown-display` | Markdown rendering |

---

## 🔧 Configuration

### **API Client**

The API client (`lib/apiClient.ts`) handles:
- Base URL configuration for development/production
- JWT token injection
- Request/response interceptors
- Error handling and retries
- Image URL conversion for proper loading

### **Environment-specific URLs**

```typescript
// Development
http://YOUR_IP:8080/api

// Production (configure in apiClient.ts)
https://your-production-api.com/api
```

---

## 📸 Screenshots

*Add screenshots of your app here*

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit
   ```bash
   git commit -m "Add: your feature description"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** with a clear description of changes

### **Contribution Guidelines**
- Follow TypeScript best practices
- Use ESLint rules defined in the project
- Write meaningful commit messages
- Add comments for complex logic
- Test on both iOS and Android before submitting

---

## 🐛 Troubleshooting

### **Common Issues**

**Problem**: Cannot connect to backend
- **Solution**: Ensure your device/emulator and backend are on the same network
- Verify the IP address in `lib/apiClient.ts` is correct
- Check if backend is running on port 8080

**Problem**: Images not displaying
- **Solution**: Check backend image server IP configuration
- Verify image URLs are being converted correctly in `getAccessibleImageUrl()`

**Problem**: Build errors after `npm install`
- **Solution**: Clear cache and reinstall
  ```bash
  rm -rf node_modules
  npm cache clean --force
  npm install
  ```

**Problem**: Expo Go app won't connect
- **Solution**: Ensure both devices are on the same WiFi network
- Try restarting the Expo development server

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Developed by Group 06 Undergraduate Engineers**

A capstone project for [Your University Name]

- Built with ❤️ by the Gemora team
- Special thanks to all contributors and testers

---

## 📞 Support

For questions, issues, or feature requests:
- **GitHub Issues**: [Create an issue](https://github.com/CapstoneCrew2025/gemora-mobile/issues)
- **Email**: your-team-email@example.com
- **Documentation**: [Wiki](https://github.com/CapstoneCrew2025/gemora-mobile/wiki)

---

## 🔮 Roadmap

- [ ] Push notifications for new bids and messages
- [ ] In-app payment integration
- [ ] Advanced gem filtering and search
- [ ] User ratings and reviews
- [ ] Wishlist and favorites
- [ ] Multi-language support
- [ ] Video support for gem listings
- [ ] Social media sharing

---

<div align="center">
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>Made with passion for gemstone enthusiasts worldwide 💎</p>
</div>

