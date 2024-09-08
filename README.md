# EDUCINE - Learning Management System (LMS) Website

This is a Learning Management System (LMS) website built using **Next.js 14** and various modern web development technologies. The platform allows instructors to create courses and manage chapters, while students can access and navigate through courses efficiently.

## Features

- **User Authentication**: Signup, signin, signout and Google and GitHub providers with support for email verification, password reset, and 2FA using Clerk(https://clerk.com).
- **Course Management**: Instructors can create courses, add attachments, add chapters, and reorder them using drag-and-drop functionality.
- **Drag-and-Drop Reordering**: Powered by **hello-pangea/dnd**, instructors can reorder the chapters of a course.
- **Email Notifications**: Email verification and password reset functionality using **Resend**.
- **API's**: Efficient server-side logic handling using **Next.js API Routes**.
- **MongoDB Integration**: Data stored and managed using MongoDB with **Prisma** as the ORM.
- **Uploathing Integration**: Videos, Images and the files are processed and stored using **UPLOADTHING**.
- **MUX Integration**: Videos are processed and rendered using **MUX** and **MUX PLAYER**.
- **TypeScript Support**: Type-safe development using TypeScript for robust code quality.
- **Data Validation**: Schema validation with **Zod** for safe and secure data handling.

## Technologies Used

- **Next.js 14** - React framework for server-side rendering and static site generation.
- **React** - Frontend library for building user interfaces.
- **Clerk** - Authentication library with support for Credentials, Google, and GitHub login.
- **Resend** - Service for sending verification and password reset emails.
- **MongoDB** - NoSQL database for managing users and courses.
- **Prisma** - Prisma ORM for schema-based modeling.
- **hello-pangea/dnd** - Animation library used for drag-and-drop functionality.
- **Uploadthing** - It is a secure and easy-to-use file upload service designed for developers. 
- **TypeScript** - Typed JavaScript for safer and more predictable code.
- **Zod** - Data validation library to ensure correct input data.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (version 16.x or higher)
- [MongoDB](https://www.mongodb.com) (local or cloud instance)
- [Resend API](https://resend.com) for sending emails
- [Clerk API](https://clerk.com) for authentication
- [Uploadthing API](https://uploadthing.com) for uploading the files
- [MUX API](https://mux.com) for processing and rendering video files

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lms-website.git
   cd lms-website
2. Install dependencies
    ```bash
    npm install
3. Create a .env file in the root directory with the following variables:
    ```bash
    DATABASE_URL=""
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
    CLERK_SECRET_KEY=
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
    UPLOADTHING_SECRET=""
    UPLOADTHING_APP_ID=''
    MUX_TOKEN_ID=
    MUX_TOKEN_SECRET=
4. Run the development server
    ```bash
    npm run dev
5. Open http://localhost:3000 to view the application

## Usage

1. User Authentication: Users can sign up, verify their email, and reset their password if needed.
2. 2FA Setup: During login, users will receive a verification token via email, which they must input to gain access.
3. Course Creation: Instructors can create, edit, and delete courses, as well as reorder chapters in a course using drag-and-drop.
4. Course Viewing: Students can view and navigate through the course content.

## Contribution

Feel free to submit issues and pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License.


Make sure to update specific parts like the repository URL and environment variables according to your setup.
