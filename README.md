# Next URL

A modern, high-performance URL shortener built with Next.js 16, Prisma, MongoDB, and Tailwind CSS.

## 🚀 Features

-   **URL Shortening**: Create specific short links for your long URLs.
-   **Analytics**: Detailed analytics including clicks, geolocation (country/city), device, browser, and OS tracking.
-   **User Management**: Secure authentication system with Registration and Login.
-   **Dashboard**: Intuitive dashboard to manage your links and view statistics.
-   **Custom Expiry**: Set expiration dates for your short links.
-   **QR Codes**: Generate QR codes for your short links (planned/implicit in modern shorteners).
-   **Responsive Design**: Beautiful UI built with Tailwind CSS and Radix UI.
-   **High Performance**: Powered by Bun and Next.js 16 (Turbopack).

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Runtime**: [Bun](https://bun.sh/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
-   **Animations**: [Motion](https://motion.dev/)
-   **Authentication**: JWT (JSON Web Tokens)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

-   [Bun](https://bun.sh/) (v1.0 or later)
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas)

## 🛠️ Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd next-url
    ```

2.  **Install dependencies**

    ```bash
    bun install
    ```

3.  **Environment Variables**

    Create a `.env` file in the root directory based on the `.env.example`:

    ```bash
    cp .env.example .env
    ```

    Update the `.env` file with your credentials:

    ```env
    DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>"
    NEXT_APP_BASE_URL="http://localhost:3000"
    JWT_SECRET="your-super-secret-key-change-this"
    ```

4.  **Database Setup**

    Generate the Prisma client:

    ```bash
    bun run db:gen
    ```

    Push the schema to your MongoDB database:

    ```bash
    bun run db:push
    # OR if you prefer migrations (though push is fine for Mongo usually)
    # bun prisma db push
    ```

    (Optional) Seed the database:
    ```bash
    bun run db:seed
    ```

## ⚡ Development

Start the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Production

To build the application for production:

```bash
bun run build
```

To start the production server:

```bash
bun start
```

## 🏗️ Project Structure

-   `src/app`: Next.js App Router pages and API routes.
-   `src/components`: Reusable UI components.
-   `prisma`: Database schema and seeds.
-   `public`: Static assets (images, icons).

## 📝 Scripts

-   `bun dev`: Starts the development server.
-   `bun run build`: Builds the app for production.
-   `bun start`: Starts the production server.
-   `bun run lint`: Lints the code using ESLint.
-   `bun run db:gen`: Generates Prisma client.
-   `bun run db:studio`: Opens Prisma Studio to view database.

## 📄 License

[MIT](LICENSE)
