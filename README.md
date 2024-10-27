### README Documentation for CasualFoundryCase

---

## Project Overview

This project, **CasualFoundryCase**, is a React Native-based application developed as a case study for a React Native Developer position. The app is designed to showcase skills in mobile app development, API management, multi-screen handling, and basic logging features in alignment with the requirements specified in the provided case study document. 

The application utilizes a boilerplate template from **Ignite** for foundational setup, combined with a number of libraries to handle various functionalities, including API calls, form validation, state management, and user action logging.

Currently includes:

- React-Native
- TypeScript
- React-Navigation
- React-Query
- Zustand
- React-Native-Mmkv
- And more!

### Features

- **User Authentication**: A basic login screen where users can authenticate using a non-empty username and password.
- **Posts List**: Displays a list of posts fetched from a mock API with pagination and search functionality.
- **Post Details**: On selecting a post, users can view detailed information about the post, including user details.
- **Logging and In-App Storage**: Logs user actions and stores them in the app storage, which are then sent to the API when the app goes into the background.

---

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- Yarn or npm
- React Native CLI
- Xcode (for iOS) or Android Studio (for Android)

### Installation and Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/salik-a/CasualFoundryCase.git
   cd CasualFoundryCase
   ```

2. **Install dependencies**:

   Using Yarn:
   ```bash
   yarn install
   cd ios
   pod install
   ```

3. **Run the Application**:

   For iOS:
   ```bash
   yarn ios
   ```

   For Android:
   ```bash
   yarn android
   ```

---

## Project Structure

The project structure is organized to enhance maintainability and readability, as detailed below:

```plaintext
project
├── src
│   ├── components          # Custom components
│   ├── config              # Configuration files
│   ├── devtools            # Developer tools
│   ├── i18n                # Internationalization setup
│   ├── navigators          # Navigation setup using react-navigation
│   ├── screens             # Main screens like Login, Posts, and Post Details
│   ├── services            # API handling with apisauce and react-query
│   ├── store               # State management using zustand
│   ├── theme               # Styling and theming setup
│   ├── utils               # Utility functions
│   └── app.tsx             # Main application entry point
├── assets                  # Static assets (icons, images, etc.)
├── test                    # Test setup and mock files
├── README.md
├── android                 # Android specific files
├── ios                     # iOS specific files
├── ignite                  # Ignite boilerplate setup
└── package.json
```

### Key Directories and Files

- **`src/screens`**: Contains core screens like:
  - `LoginScreen`: User authentication screen.
  - `PostsScreen`: Lists posts fetched from the API.
  - `PostDetailScreen`: Displays detailed information of a selected post.

- **`src/services/api`**: Manages all API interactions using `apisauce` and `tanstack/react-query` for data fetching and caching.

- **`src/store`**: Configures global state management with `zustand`, handling user session and post data.

- **`src/navigators`**: Configures navigation across screens using `react-navigation`.

- **`src/components`**: Contains reusable components.

- **`test`**: Holds unit tests and mock files for TDD.

---

## Libraries and Tools

- **tanstack/react-query**: Data fetching and caching solution.
- **apisauce**: Simplified API request handling.
- **react-hook-form** & **yup**: Form handling and validation on the login screen.
- **zustand**: Lightweight state management.
- **react-native-mmkv**: Storage solution for logging actions.
- **react-navigation**: Navigational structure.
  
---

## Application Flow

1. **Login**: User authenticates on the login screen. Valid input (non-empty credentials) leads to the posts screen.
2. **Posts List**: Displays a list of posts with pagination and search. Users can filter posts via the search bar.
3. **Post Detail**: Users can select a post to view its detailed information.
4. **Logout**: Users can log out from the logout button on the header.

---

## API Endpoints

1. **Login**: `https://dummyjson.com/auth/login` (POST)
2. **Posts**: `https://dummyjson.com/posts?limit=10&skip=10` (GET)
3. **User Details**: `https://dummyjson.com/users/[id]` (GET)
4. **Search**: `https://dummyjson.com/posts/search?q=[query]` (GET)
5. **Log Actions**: `https://dummyjson.com/http/200` (POST)

---

## Additional Notes

- The project includes pagination and search features as part of the requirements.
- User actions, such as logging in, searching, selecting posts, etc., are tracked and stored locally via `react-native-mmkv`. These logs are sent to the API when the app goes into the background.
- Custom components extend the Ignite boilerplate, with additional components added for specific features.

---

## Contact

For questions or suggestions, please reach out via GitHub Issues in the repository.