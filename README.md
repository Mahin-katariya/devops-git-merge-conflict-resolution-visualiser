# MergeMate 🚀

MergeMate is an interactive DevOps sandbox tool designed to help developers and engineers understand, simulate, and resolve strict 3-way Git merge conflicts in a clean, isolated, and highly visual environment. 

Inspired by modern IDEs, MergeMate gives you direct power over Base snippets, Main branch code, and Feature branch code to automatically generate realistic Git conflicts (complete with `<<<<<<< HEAD` markers) and allows you to resolve them directly in your browser.

## Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS (Dark-themed IDE layout, Responsive Split Panes)
- **Backend**: Node.js, Express, `diff` (jsdiff for AST 3-way merge chunking)
- **Infrastructure**: Fully Dockerized with `docker-compose`, Multi-stage Nginx builds, Postgres overlay.

---

## 🛠️ Installation & Local Setup

There are two separate ways you can run MergeMate locally on your machine:

### Option A: Using Docker (Recommended)
You can spin up the entire application stack instantly using our pre-configured Docker Compose file.

1. Ensure **Docker Desktop** is running.
2. Open your terminal in the root of the project.
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Access the App:
   - **Frontend UI**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: `http://localhost:3001/api/merge`

### Option B: Manual Local Development
If you prefer running the Node servers natively for development:

1. **Start the Backend:**
   ```bash
   cd src/main/api
   npm install
   npm start
   ```
   *(The backend server will run on port `3001`)*

2. **Start the Frontend:**
   ```bash
   cd src/main/web
   npm install
   npm run dev
   ```
   *(Vite will automatically expose the app, usually on `http://localhost:5173`)*

---

## 💻 How to Use the Simulator
1. Upon loading the app, you will see three distinct Code editors pre-filled with dummy JavaScript functions.
2. The dummy code modifies the same variable (`total += tax`), which will definitively trigger a Git merge conflict.
3. Click the **Simulate Merge** button.
4. If the code yields a clean merge, a success banner displays the final cleanly stitched output.
5. If the code results in a conflict, the **Interactive Conflict Resolution** visualizer will appear. It cleanly extracts the context, incoming changes, and current changes into side-by-side syntax-highlighted panes—giving you 1-click resolution buttons to seamlessly stitch your Git branch history back together, and a manual editor for edge-cases!
