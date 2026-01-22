import React from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  Briefcase,
  FolderOpen,
  ExternalLink,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

// Using public assets
// Authentic iOS Photos Icon from public assets
const IOSPhotosIcon = ({ size = 16 }: { size?: number }) => (
  <img
    src="/assets/_.jpeg"
    alt="iOS Photos Icon"
    style={{ width: size, height: size, borderRadius: '4px', objectFit: 'cover' }}
  />
);

const PLACE_PHOTOS = [
  { src: '/assets/72A89FB3-37A0-4115-AB73-3E53FBC40075_4_5005_c.jpeg', location: 'Wyoming', date: 'June 2024' },
  { src: '/assets/AC55EFE9-422A-4A52-AD3A-7F254C3A6CB1_1_105_c.jpeg', location: 'Wyoming', date: 'June 2024' },
  { src: '/assets/F451049C-79E1-46DF-9AFD-41F53FB2FC92_1_102_o.jpeg', location: 'Half Dome, Yosemite', date: 'Sept 2023' },
  { src: '/assets/IMG_0180.jpeg', location: 'New York City', date: 'July 2024' },
  { src: '/assets/IMG_1585.jpeg', location: 'Black Sand Beach, HI', date: 'Dec 2023' },
  { src: '/assets/96DC2562-5D96-4414-AB61-D83AB68A1232.jpeg', location: 'Zion National Park, UT', date: 'May 2024' },
  { src: '/assets/235B1F6C-95FC-4827-A3F9-ED6B26FF2BD3_1_102_o.jpeg', location: 'Mount Whitney, CA', date: 'Aug 2024' },
  { src: '/assets/C33C0CEC-22AB-4F4E-98BA-973A33AB1BEC_1_105_c.jpeg', location: 'Big Sur, CA', date: 'Jan 2025' },
];

interface Photo {
  src: string;
  location: string;
  date: string;
}

interface RetroWindowProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

const RetroWindow: React.FC<RetroWindowProps> = ({ title, icon, children, delay = 0 }) => (
  <motion.div
    className="retro-window"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
  >
    <div className="retro-header">
      <div className="traffic-lights">
        <div className="dot dot-red"></div>
        <div className="dot dot-yellow"></div>
        <div className="dot dot-green"></div>
      </div>
      <div className="section-icon">
        {icon}
        <span>{title}</span>
      </div>
    </div>
    <div className="retro-content">
      {children}
    </div>
  </motion.div>
);

const NowPlaying = () => {
  const [status, setStatus] = useState<{
    isPlaying: boolean;
    song: string;
    artist: string;
    trackId?: string;
    albumArt?: string;
  }>({
    isPlaying: false,
    song: "Not Playing",
    artist: "Spotify"
  });

  // Example using Lanyard API (requires your Discord ID)
  const DISCORD_ID = "535286543032516608";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await res.json();
        if (data.data?.spotify) {
          setStatus({
            isPlaying: true,
            song: data.data.spotify.track,
            artist: data.data.spotify.artist,
            trackId: data.data.spotify.track_id,
            albumArt: data.data.spotify.album_art_url
          });
        } else {
          setStatus({ isPlaying: false, song: "Not Playing", artist: "Spotify" });
        }
      } catch (e) {
        console.error("Spotify fetch failed", e);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="now-playing-container">
      <a
        href={status.trackId ? `https://open.spotify.com/track/${status.trackId}` : "#"}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <motion.div
          className={`vinyl-player ${status.isPlaying ? 'is-playing' : ''}`}
          title={`${status.song} - ${status.artist}`}
        >
          <div className="vinyl-record">
            <img
              src={status.albumArt || 'https://via.placeholder.com/150'}
              className="album-art"
              alt="Album Art"
            />
            <div className="vinyl-grooves"></div>
          </div>
          <div className="vinyl-needle"></div>
        </motion.div>


      </a>
      <div className="song-info">
        {status.isPlaying && (
          <div className="audio-wave">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        )}
        <span className="song-name">{status.song}</span>
        <span className="artist-name">{status.artist}</span>
      </div>
    </div >
  );
};


const ExperienceItem = ({
  title,
  company,
  date,
  description,
  bullets,
  icon,
  url
}: {
  title: string;
  company: string;
  date: string;
  description?: string;
  bullets?: string[];
  icon?: React.ReactNode;
  url?: string;
}) => (
  <div className="card">
    <div className="card-icon">
      {icon || <Briefcase size={20} className="text-gray-400" />}
    </div>
    <div className="card-info">
      <div className="card-header">
        <h3>{title}</h3>
        <span className="card-date">{date}</span>
      </div>
      <div className="card-subtitle">
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            {company} <ExternalLink size={12} />
          </a>
        ) : company}
      </div>
      {description && <div className="card-description">{description}</div>}
      {bullets && (
        <div className="card-bullets-oneline">
          {bullets.join(' • ')}
        </div>
      )}
    </div>
  </div>
);

const ProjectItem = ({
  title,
  description,
  url
}: {
  title: string;
  description: string;
  url: string;
}) => (
  <div className="card" style={{ padding: '1rem 0' }}>
    <div className="card-info">
      <div className="card-header">
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          {title} <ExternalLink size={14} />
        </a>
      </div>
      <div className="card-description">{description}</div>
    </div>
  </div>
);

function App() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="container">
      <div className="bg-animation">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <motion.header
        style={{ marginBottom: '3rem' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          Aidan Nguyen Tran <NowPlaying />
        </h1>
        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          <a href="/assets/AidanNguyen_Tran_Resume (2).pdf" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontWeight: 500 }}>Resume</a>
          <a href="https://calendly.com/aidan-nt76/coldreach-aidan-nguyen-tran" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontWeight: 500 }}>Contact</a>
          <a href="#" style={{ color: '#3b82f6', fontWeight: 500 }}>Reading</a>
        </div>

        <p style={{ maxWidth: '600px', fontSize: '1.1rem', color: '#444' }}>
          I'm a builder and designer based in California. I love exploring the intersection of human-centric design and AI.
          In my free time, I enjoy brewing coffee, reading sci-fi, and experimenting with new tech.
        </p>

        <p style={{ color: '#666' }}>I'm currently building tools to make the web more accessible and intuitive through agentic AI.</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://github.com/Aidan1223f" target="_blank" rel="noopener noreferrer" className="social-pill github">
            <Github size={18} /> Aidan1223f
          </motion.a>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://www.linkedin.com/in/aidan-nguyen-tran-277a3a258/" target="_blank" rel="noopener noreferrer" className="social-pill linkedin">
            <Linkedin size={18} /> Aidan Nguyen Tran
          </motion.a>
          <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://www.instagram.com/ngyntrnn/" target="_blank" rel="noopener noreferrer" className="social-pill instagram">
            <Instagram size={18} /> ngyntrnn
          </motion.a>
        </div>
      </motion.header>

      <main>
        <RetroWindow title="Building" icon={<Briefcase size={16} />} delay={0.2}>
          <ExperienceItem
            title="Founder"
            company="Hermes AI"
            url="http://joinhermes.co/"
            date="Dec 2025 - Present"
            bullets={[
              "Engineered a vector matching engine for 2M+ impressions and 500k+ matches using FastAPI, Redis, and agentic RAG workflows."
            ]}
          />
          <ExperienceItem
            title="Chief Executive Officer"
            company="Lockd"
            url="https://getlockd.app/"
            date="Aug 2025 - Present"
            bullets={[
              "Developed React Native MVP in 4 days, scaling to 100+ users with 90% retention through data-driven iteration and A/B testing."
            ]}
          />
        </RetroWindow>

        <RetroWindow title="Projects" icon={<FolderOpen size={16} />} delay={0.3}>
          <ProjectItem
            title="CoffeeQuest"
            description="AI-powered map to find the best specialty coffee shops in any city. 500+ daily active users."
            url="#"
          />
          <ProjectItem
            title="ZenPress"
            description="A minimalist, markdown-based blogging platform for thinkers and writers."
            url="#"
          />
          <ProjectItem
            title="FlowState"
            description="A pomodoro timer that syncs with Spotify to play focus-enhancing music."
            url="#"
          />
          <ProjectItem
            title="OS-Theme"
            description="A React component library for building desktop-like web experiences."
            url="#"
          />
        </RetroWindow>

        <RetroWindow title="photo album" icon={<IOSPhotosIcon size={18} />} delay={0.4}>
          <div className="places-grid">
            {PLACE_PHOTOS.map((photo, i) => (
              <motion.div
                key={i}
                className="place-item"
                initial={{ opacity: 0, scale: 0.9, rotate: Math.random() * 10 - 5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                onClick={() => setSelectedPhoto(photo)}
                style={{ cursor: 'pointer' }}
              >
                <div className="polaroid">
                  <img src={photo.src} alt={photo.location} loading="lazy" />
                  <div className="polaroid-label">
                    {photo.location}
                    <span className="polaroid-date">{photo.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </RetroWindow>

        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className="photo-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                className="expanded-polaroid-container"
                initial={{ scale: 0.8, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="polaroid expanded">
                  <img src={selectedPhoto.src} alt={selectedPhoto.location} />
                  <div className="polaroid-label">
                    {selectedPhoto.location}
                    <span className="polaroid-date">{selectedPhoto.date}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div className="footer-links">
          <a href="https://calendly.com/aidan-nt76/coldreach-aidan-nguyen-tran" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={16} /> Contact
          </a>
          <a href="https://github.com/Aidan1223f" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Github size={16} /> GitHub
          </a>
        </div>
        <div>© 2026 Aidan Nguyen. Built with care.</div>
      </motion.footer>
    </div>
  );
}

export default App;
