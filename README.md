---
# Monpress CLI

Welcome to the **Monpress CLI**! This tool helps you create and manage Express-based Monpress projects with:
  - ✅ File-based routing
  - ✅ Built-in REST method handlers
  - ✅ Global middleware support
  - ✅ Fast and flexible development experience
---

## 📦 Installation

Make sure you have [Node.js](https://nodejs.org/) installed.

Install Monpress CLI globally via npm:

```sh
npm install -g monpress
```

---

## 🚀 Usage

The Monpress CLI includes several commands to streamline your workflow:

### 🔧 Create a New Project

```sh
monpress create
```

You'll be prompted to:

- Enter a project name
- Choose a package manager (`npm`, `yarn`, or `pnpm`)

---

### 🧑‍💻 Start the Development Server

```sh
monpress dev
```

Launches your Monpress project in development mode with file-watching enabled.

---

### 🛠️ Generate Routes

```sh
monpress generate
```

Automatically generates route mappings from your file structure.

---

## 📁 File-Based Routing

Monpress uses the `routes/` directory to define routes via filenames. This system is inspired by modern frameworks like Next.js and SvelteKit.

### 🧭 Route Mapping Example

| File Path               | Route Path    |
| ----------------------- | ------------- |
| `routes/index.ts`       | `/`           |
| `routes/about.ts`       | `/about`      |
| `routes/contact.ts`     | `/contact`    |
| `routes/blog.ts`        | `/blog`       |
| `routes/blog/[blog].ts` | `/blog/:blog` |
| `routes/user/[id_].ts`  | `/user/:id?`  |

- `[]` denotes dynamic segments
- `[_]` (trailing underscore) denotes optional segments

---

### 🧩 Route File Example (`routes/index.ts`)

```ts
import { httpRequest } from "monpress";

export const GET = httpRequest(async (req, res) => {
  res.json({ message: "GET request successful" });
});

export const POST = httpRequest(async (req, res) => {
  res.json({ message: "POST request successful" });
});

export const PATCH = httpRequest(async (req, res) => {
  res.json({ message: "PATCH request successful" });
});

export const PUT = httpRequest(async (req, res) => {
  res.json({ message: "PUT request successful" });
});

export const DELETE = httpRequest(async (req, res) => {
  res.json({ message: "DELETE request successful" });
});
```

You can export any HTTP method handler (`GET`, `POST`, etc.) as needed.

---

## 🧱 Middleware

Monpress supports global middleware using the `middleware()` helper. Useful for:

- Authentication
- Logging
- Custom headers
- Request preprocessing

### 📌 Creating Middleware

```ts
import { middleware } from "monpress";

export const authMiddleware = middleware((req, res, next) => {
  if (req.path.startsWith("/auth")) {
    req.user = {
      id: "1",
      name: "Sourav",
    };
  }
  next();
});
```

---

### 🔗 Registering Middleware

Add middleware when initializing your Monpress app:

```ts
import { MonPress } from "monpress";
import { authMiddleware } from "./middlewares/auth";
import routes from "./routes";

const mon = MonPress({
  routes,
  middleware: [authMiddleware],
  express(app, http) {
    // Optional: custom Express logic here
  },
});
```

✅ All registered middleware is executed before your route handlers.

---

## 🔄 Example Workflow

```sh
# Create a new project
monpress create

# Move into the project directory
cd my-project

# Start the dev server
monpress dev

# Generate route files
monpress generate
```

---

## 🛠 CLI Commands

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `monpress create`   | Create a new Monpress project      |
| `monpress dev`      | Start the development server       |
| `monpress generate` | Generate route mappings from files |
| `monpress --help`   | Show CLI help and usage info       |

---

## 🤝 Contributing

Want to contribute? Here's how:

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

Licensed under the **MIT License**.

---

Happy coding with Monpress! ⚡  
_File-based routing meets Express power._

---
