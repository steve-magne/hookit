import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Catalogue } from './pages/Catalogue'
import { HookDetail } from './pages/HookDetail'
import { Contribute } from './pages/Contribute'

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/hook/:slug" element={<HookDetail />} />
          <Route path="/contribute" element={<Contribute />} />
        </Routes>
      </main>
      <footer className="border-t border-[var(--color-border)] py-6 text-center text-sm text-zinc-500">
        Hookit — POC v0.1 · Catalogue communautaire de hooks agentiques
      </footer>
    </div>
  )
}
