import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { ShieldCheck } from "lucide-react"

import Home from "./pages/Home"
import CreateBatch from "./pages/CreateBatch"
import UpdateBatch from "./pages/UpdateBatch"
import BatchDetails from "./pages/BatchDetails"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b border-border bg-card p-4 flex items-center justify-between sticky top-0 z-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <ShieldCheck className="h-8 w-8" />
            MediChain
          </Link>
          <nav className="flex gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Verify Batch</Link>
            <Link to="/create" className="text-sm font-medium hover:text-primary transition-colors">Create Batch</Link>
            <Link to="/update" className="text-sm font-medium hover:text-primary transition-colors">Push Update</Link>
          </nav>
        </header>

        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateBatch />} />
            <Route path="/update" element={<UpdateBatch />} />
            <Route path="/batch/:id" element={<BatchDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
