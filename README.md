# Monpress

Welcome to **Monpress**! A powerful, flexible tool that streamlines Express-based project development with:

- ✅ **File-based routing**
- ✅ **Built-in REST method handlers**
- ✅ **Global and custom middleware support**
- ✅ **Fast and flexible development experience**
- ✅ **Type-safe middleware chaining** (with support for async validation, error handling, and more)

---

## 📦 Installation

Make sure you have [Node.js](https://nodejs.org/) installed.

Install Monpress globally via npm:

```sh
npm install -g monpress
```

---

## 🚀 Usage

Monpress includes several commands to streamline your workflow:

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
      name: "Sourav Bapari",
    };
  }
  next();
});
```

### 📌 Middleware with Async Support

```ts
import { middleware } from "monpress";

export const asyncMiddleware = middleware(async (req, res, next) => {
  try {
    const user = await getUserFromDb(req.headers["user-id"]);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
});
```

---

### 🔗 Registering Middleware

Add middleware when initializing your Monpress app:

```ts
import { MonPress } from "monpress";
import { authMiddleware, asyncMiddleware } from "./middlewares/auth";
import routes from "./routes";

const mon = MonPress({
  routes,
  middleware: [authMiddleware, asyncMiddleware],
  express(app, http) {
    // Optional: custom Express logic here
  },
});
```

✅ All registered middleware is executed before your route handlers.

---

## 🧩 Middleware Chaining with `httpRequest`

Monpress allows you to chain multiple middlewares and HTTP method handlers, using the `httpRequest` helper to ensure smooth and type-safe handling of requests.

### 📌 Chaining Middleware and Handlers

You can chain middlewares and HTTP request handlers in a single flow:

```ts
import { httpRequest } from "monpress";
import { authMiddleware, loggingMiddleware } from "./middlewares";

// Define a handler with middleware chaining
export const GET = httpRequest(async (req, res) => {
  res.json({ message: "GET request with middleware chaining" });
})
  .middleware(authMiddleware) // First middleware
  .middleware(loggingMiddleware); // Second middleware
```

In the example above:

- `authMiddleware` runs first, followed by `loggingMiddleware`, before the final HTTP request handler (`GET`) executes.

This approach allows you to define clean, reusable, and type-safe middleware chains, making your application more modular and easier to maintain.

---

## 🧩 `httpRequest` Helper and Types

The `httpRequest` helper helps you define request handlers in a type-safe way, while also allowing middleware chaining.

### 📌 Usage

```ts
import { httpRequest } from "monpress";
import { z } from "zod";

// Example route handler with Zod validation for request body
const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(18, "Age must be at least 18"),
});

export const POST = httpRequest(async (req, res) => {
  createUserSchema.parse(req.body); // Validate request body

  // Proceed with logic after validation
  res.json({ message: "User created successfully" });
})
  .middleware(authMiddleware) // Add middleware before handler
  .middleware(loggingMiddleware); // Add another middleware
```

In the above code:

1. The `POST` handler is first associated with middleware (`authMiddleware` and `loggingMiddleware`).
2. The request body is validated using **Zod** before any further logic is executed.
3. Type safety is ensured throughout the chain.

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

## 🛠 Commands

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `monpress create`   | Create a new Monpress project      |
| `monpress dev`      | Start the development server       |
| `monpress generate` | Generate route mappings from files |
| `monpress --help`   | Show help and usage info           |

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

### Key Updates:

1. **Middleware Chaining:** Demonstrated with multiple middlewares in sequence, allowing for cleaner and more modular code.
2. **`httpRequest` Helper:** Shows how to use `httpRequest` to chain middleware, validate data, and handle requests in a type-safe way.
3. **Zod Validation Example:** Added an example where Zod is used to validate the request body, before proceeding with the handler.
