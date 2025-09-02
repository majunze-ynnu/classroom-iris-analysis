# Classroom Iris Analysis

An Expo-based mobile application for classroom attention analysis using MediaPipe's iris tracking capabilities.

## How to Build the APK (Android)

These instructions are for building the Android APK on a Windows machine.

### Prerequisites

1.  **Install Node.js and npm:**
    *   Download and install the LTS version of Node.js from [https://nodejs.org/](https://nodejs.org/). npm will be installed automatically.
    *   Verify the installation by running `node -v` and `npm -v` in your command prompt.

2.  **Install EAS CLI:**
    *   Install the Expo Application Services (EAS) command-line tool globally:
        ```bash
        npm install -g eas-cli
        ```

3.  **Create and Log in to an Expo Account:**
    *   Sign up for a free account at [https://expo.dev/signup](https://expo.dev/signup).
    *   Log in to your account from the command line:
        ```bash
        eas login
        ```

### Project Setup

1.  **Clone or download the project code.**

2.  **Navigate to the project directory:**
    ```bash
    cd path\to\your\project\classroom-iris-analysis
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

### Build Process

1.  **Configure EAS Build:**
    *   This command will create an `eas.json` file in your project.
        ```bash
        eas build:configure
        ```
    *   You can accept the default settings.

2.  **Start the build:**
    *   This command will start the build process for Android on Expo's servers.
        ```bash
        eas build -p android
        ```

3.  **Download the APK:**
    *   Once the build is complete, the command line will provide a URL to the build details page.
    *   Open the URL in your browser and download the `.apk` file.
