📱 Mobile Frontend Overview

The Gemora Mobile Frontend is a cross-platform mobile application built using Expo (React Native) and TypeScript, designed to provide a scalable, secure, and high-performance user interface for the Gemora gemstone trading platform. The application follows a modular, feature-based architecture and implements industry best practices for state management, API integration, and authentication handling.

Global state is managed using Redux Toolkit, while Axios is used for communication with backend REST APIs secured via JWT-based authentication. Authentication tokens and session-related data are safely persisted using AsyncStorage to support secure user sessions across app restarts. Navigation is handled through role-based routing to dynamically control access for buyers, sellers, and administrative users.

The mobile frontend is optimized for real-time auction workflows, gemstone browsing, bid tracking, and profile management, with a clean separation of concerns between UI components, business logic, and service layers. The codebase is structured to support future scalability, including enhancements such as real-time data streaming, advanced verification flows, and secure payment integrations.
