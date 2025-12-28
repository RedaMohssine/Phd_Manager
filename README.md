# PhD Management App

PhD Management App is a web-based application designed to streamline the management of PhD-related tasks, including document handling, notifications, and thesis tracking. This project is built using React for the frontend and Node.js for the backend.

## Features
- **Document Management**: Upload, view, and manage documents.
- **Notifications**: Send and receive notifications for important updates.
- **Thesis Tracking**: Monitor the progress of PhD theses.
- **User Roles**: Separate views and functionalities for administrators and PhD students.

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT)
- **File Uploads**: Multer

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- MySQL database

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd phd-management-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the `backend/` directory.
   - Add the following variables:
     ```env
     DB_HOST=your-database-host
     DB_USER=your-database-user
     DB_PASSWORD=your-database-password
     DB_NAME=your-database-name
     JWT_SECRET=your-jwt-secret
     ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.
- Use the admin panel to manage documents and notifications.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

#Data Structure
<img width="546" height="616" alt="image" src="https://github.com/user-attachments/assets/027b22fe-5ab0-45fb-ac6a-a6313e59c048" />

#ScreenShots

<img width="1821" height="875" alt="image" src="https://github.com/user-attachments/assets/3efc94ed-042d-4b1e-9a9e-eadd7cdc7d4c" />
<img width="1133" height="548" alt="image" src="https://github.com/user-attachments/assets/24edf72b-3cf8-40f7-b38f-d6159418c3fe" />
<img width="3839" height="1843" alt="image" src="https://github.com/user-attachments/assets/7685bcab-33d1-4d97-9498-03cab07b7b0f" />
<img width="3839" height="1843" alt="image" src="https://github.com/user-attachments/assets/26821765-5e45-4820-b4c1-02e4747228ff" />




