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

---

## 📁 File Uploading with Multer

Monpress supports file uploading using the popular `multer` middleware. Here's how you can integrate it into your Monpress application:

### 📦 Installation

First, install `multer`:

```sh
npm install multer
```

### ⚙️ Configuration

Create a file, for example, `routes/upload.ts`, to handle file uploads. Here's an example of how to configure `multer` and create a route:

```ts
import { httpRequest } from "monpress";
import multer from "multer";
import path from "path";

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder to store uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 1624567890-123456789.jpg
  },
});

// Create the multer upload instance
const upload = multer({ storage: storage });

// Example POST request handler with file upload
export const POST = httpRequest(async (req, res) => {
  upload.any()(req, res, async (err: any) => {
    if (err) {
      return res.status(500).json({ message: "Error uploading file" });
    }
    // Files are available in req.files, and other form data in req.body
    res.json({ files: req.files, body: req.body });
  });
});
```

### 📍 Route Definition

In this example, the `POST` route uses `upload.any()` to handle any number of files. You can also use `upload.single('fieldName')` to handle a single file or `upload.array('fieldName', maxCount)` to handle a specific number of files.

### 🧪 Testing the Upload

You can test this endpoint using `curl`:

```sh
curl -X POST -F "file=@/path/to/your/file.jpg" http://localhost:3000/upload
```

Make sure to replace `/path/to/your/file.jpg` with the actual path to your file.

### ⚠️ Error Handling

It's important to handle errors that may occur during the file upload process. In the example above, any error during the upload will result in a 500 status code with an error message.

### 🧱 Middleware Usage

You can also use multer as middleware for specific routes:

```ts
import { httpRequest } from "monpress";
import { upload } from "./upload"; // Import the multer instance

export const PATCH = httpRequest(async (req, res) => {
  res.json({ message: "PATCH request successful" });
}).middleware(upload.single("file"));
```

In this case, the `upload.single('file')` middleware is applied only to the `PATCH` route.

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
