import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl glass px-6 py-3">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-violet to-accent-cyan">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="absolute inset-0 rounded-xl bg-accent-violet/50 blur-md opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Stream<span className="text-accent-cyan">Mates</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-white/60 transition-colors hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-white/60 transition-colors hover:text-white">
            How it works
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-sm font-medium text-white/70 transition-colors hover:text-white sm:block"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium transition-all hover:bg-white/15"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
