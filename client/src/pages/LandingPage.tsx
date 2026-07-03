import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/layout/AnimatedBackground';
import { Navbar } from '@/components/layout/Navbar';
import { FeatureCard, LinkButton } from '@/components/ui/FeatureCard';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.12 },
  },
};

export function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-16">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-white/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-cyan" />
              </span>
              Real-time watch parties — no account needed
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
          >
            Watch together.
            <br />
            <span className="text-gradient">Anywhere.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl"
          >
            Sync YouTube videos and local files with friends in perfect harmony.
            Create a room, share a link, and start watching — instantly.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <LinkButton to="/create" glow>
              <PlayIcon />
              Create Room
            </LinkButton>
            <LinkButton to="/join" variant="secondary">
              <LinkIcon />
              Join with Code
            </LinkButton>
          </motion.div>

          {/* Live preview mockup */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative mx-auto mt-16 max-w-3xl"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-accent-violet/20 via-accent-cyan/10 to-accent-pink/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl glass-strong p-1">
              <div className="rounded-xl bg-stream-900 p-4">
                {/* Mock player bar */}
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 rounded-lg bg-stream-800 px-3 py-1 text-xs text-white/40">
                    streammates.app/room/ABC123
                  </div>
                </div>
                {/* Mock video area */}
                <div className="relative aspect-video overflow-hidden rounded-lg bg-stream-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-stream-700 to-stream-900" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                      <PlayIcon className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  {/* Sync indicator */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-xs backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="text-white/80">3 watching · synced</span>
                  </div>
                  {/* Mock chat */}
                  <div className="absolute bottom-3 right-3 w-48 space-y-1.5 rounded-lg bg-black/40 p-2 backdrop-blur-sm">
                    <ChatBubble name="Alex" message="This part is epic 🔥" color="text-accent-cyan" />
                    <ChatBubble name="Sam" message="Pause — bathroom break" color="text-accent-pink" />
                  </div>
                </div>
                {/* Mock progress bar */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-stream-700">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent-violet to-accent-cyan"
                      initial={{ width: '35%' }}
                      animate={{ width: ['35%', '38%', '35%'] }}
                      transition={{ duration: 8, repeat: Infinity }}
                    />
                  </div>
                  <span className="text-xs text-white/40">12:34 / 45:00</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Everything you need for a{' '}
              <span className="text-gradient">watch party</span>
            </h2>
            <p className="mt-4 text-white/60">
              Built for seamless synchronization, real-time chat, and zero friction.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              delay={0}
              icon={<SyncIcon />}
              title="Perfect Sync"
              description="Server-authoritative playback keeps everyone on the same frame — play, pause, seek, and speed changes propagate instantly."
            />
            <FeatureCard
              delay={0.1}
              icon={<YouTubeIcon />}
              title="YouTube & Local"
              description="Paste any YouTube link or load the same local file. No uploads needed — just pick your source and go."
            />
            <FeatureCard
              delay={0.2}
              icon={<ChatIcon />}
              title="Live Chat & Reactions"
              description="Talk while you watch with real-time chat, typing indicators, and emoji reactions."
            />
            <FeatureCard
              delay={0.3}
              icon={<GuestIcon />}
              title="No Account Required"
              description="Guests can create and join rooms instantly with just a nickname. Sign up later to unlock profiles and history."
            />
            <FeatureCard
              delay={0.4}
              icon={<ShieldIcon />}
              title="Room Controls"
              description="Hosts manage playback. Moderators help keep the peace. Password protection and kick/ban when you need it."
            />
            <FeatureCard
              delay={0.5}
              icon={<GlobeIcon />}
              title="Public Rooms"
              description="Registered users can browse and join public watch parties — discover what others are watching."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Three steps. Zero setup.</h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: '01',
                title: 'Create a room',
                desc: 'Pick a name, choose YouTube or local video, and get an invite link in seconds.',
              },
              {
                step: '02',
                title: 'Share the link',
                desc: 'Send the room code to friends. They join with a nickname — no signup required.',
              },
              {
                step: '03',
                title: 'Watch in sync',
                desc: 'The host controls playback. Everyone stays synchronized, chat included.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-6 rounded-2xl glass p-6"
              >
                <span className="font-display text-3xl font-bold text-accent-violet/50">{item.step}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mt-1 text-white/60">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-3xl glass-strong p-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to start watching?</h2>
          <p className="mt-4 text-white/60">Create your first room in under 10 seconds.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LinkButton to="/create" glow>
              Get Started Free
            </LinkButton>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-display text-sm font-semibold">
            Stream<span className="text-accent-cyan">Mates</span>
          </span>
          <p className="text-sm text-white/40">Built with real-time sync. Portfolio project.</p>
        </div>
      </footer>
    </div>
  );
}

function ChatBubble({ name, message, color }: { name: string; message: string; color: string }) {
  return (
    <div className="text-xs">
      <span className={`font-semibold ${color}`}>{name}</span>
      <span className="text-white/60"> {message}</span>
    </div>
  );
}

function PlayIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function SyncIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function GuestIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
