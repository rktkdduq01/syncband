# AsyncSyncBand Project

## Overview
AsyncSyncBand is a full-stack application that utilizes Next.js and TypeScript for the frontend, and Spring with Kotlin for the backend. This project aims to provide a seamless user experience for authentication and user management.

## Frontend Structure
The frontend is structured as follows:

- **src/app**: Contains the main application files.
  - **(auth)**: Authentication-related pages.
    - **login/page.tsx**: Component for user login, including an authentication form.
    - **register/page.tsx**: Component for user registration, including a form to register new users.
  - **api**: Handles API routes for various requests.
    - **[...route].ts**: API route handler.
  - **layout.tsx**: Defines the layout of the application, including common UI elements.
  - **page.tsx**: Main component for the application.

- **src/components**: Contains reusable components.
  - **common**: Common UI components.
    - **Button.tsx**: Reusable button component.
    - **Input.tsx**: Reusable input field component.
    - **Navbar.tsx**: Navigation bar component.
  - **features/auth**: Authentication feature components.
    - **LoginForm.tsx**: Component for the login form.
    - **RegisterForm.tsx**: Component for the registration form.

- **src/hooks**: Custom hooks for the application.
  - **useAuth.ts**: Hook for user authentication.

- **src/lib**: Utility functions for API calls.
  - **api.ts**: API utility functions.

- **src/types**: Type definitions used in the application.
  - **index.ts**: Contains type definitions.

- **src/utils**: Utility functions.
  - **helpers.ts**: Various utility functions.

- **public/assets**: Directory for static assets.

## Backend Structure
The backend is structured as follows:

- **src/main/kotlin/com/asyncsyncband**: Main application files.
  - **AsyncSyncBandApplication.kt**: Entry point of the application.
  - **config**: Configuration files.
    - **SecurityConfig.kt**: Security settings.
    - **WebConfig.kt**: Web-related settings.
  - **controller**: Handles incoming requests.
    - **AuthController.kt**: Manages authentication requests.
    - **UserController.kt**: Manages user-related requests.
  - **dto**: Data Transfer Objects.
    - **request**: Contains request DTOs.
      - **AuthRequest.kt**: DTO for authentication requests.
    - **response**: Contains response DTOs.
      - **AuthResponse.kt**: DTO for authentication responses.
  - **model**: Defines the user model.
    - **User.kt**: User model definition.
  - **repository**: Handles database operations.
    - **UserRepository.kt**: User repository.
  - **service**: Business logic.
    - **AuthService.kt**: Handles authentication logic.
    - **UserService.kt**: Handles user-related logic.

- **src/main/resources**: Resource files.
  - **application.yml**: Application configuration.
  - **static**: Directory for static resources.
  - **templates**: Directory for template files.

- **src/test/kotlin/com/asyncsyncband**: Test files.
  - **AsyncSyncBandApplicationTests.kt**: Application tests.

## Getting Started
To get started with the project, clone the repository and install the necessary dependencies for both the frontend and backend. Follow the instructions in the respective README files for detailed setup and usage.

## License
This project is licensed under the MIT License. See the LICENSE file for more information.