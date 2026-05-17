import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Instagram,
  Briefcase,
  FolderOpen,
  ExternalLink,
  FileText,
  BookOpen,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const HERO_BANNER_SRC = '/assets/hero-mountain-banner.png';
const HERO_BANNER_WEBP = '/assets/hero-mountain-banner.webp';

function HeroMountainBanner() {
  return (
    <div className="hero-mountain-banner" aria-hidden={true}>
      <picture className="hero-mountain-banner__media">
        <source srcSet={HERO_BANNER_WEBP} type="image/webp" />
        <img
          src={HERO_BANNER_SRC}
          alt=""
          width={1024}
          height={625}
          decoding="async"
          loading="eager"
        />
      </picture>
      <div className="hero-mountain-banner__scrim" />
    </div>
  );
}

// Using public assets
// Authentic iOS Photos Icon from public assets
const IOSPhotosIcon = ({ size = 16 }: { size?: number }) => (
  <img
    src="/assets/_.jpeg"
    alt="iOS Photos Icon"
    style={{ width: size, height: size, borderRadius: '4px', objectFit: 'cover' }}
  />
);

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
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
  className?: string;
}

const RetroWindow: React.FC<RetroWindowProps> = ({ title, icon, children, delay = 0, className = "" }) => (
  <motion.div
    className={`retro-window ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
  >
    <div className="retro-header">
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

const DEFAULT_SONG = {
  isPlaying: false,
  song: "Good Life",
  artist: "Kanye West; T-Pain",
  trackId: "4ZPdLEztrlZqbJkgHNw54L",
  albumArt: "https://i.scdn.co/image/ab67616d0000b27326f7f19c7f0381e56156c94a"
};

const NowPlaying = () => {
  const [status, setStatus] = useState<{
    isPlaying: boolean;
    song: string;
    artist: string;
    trackId?: string;
    albumArt?: string;
  }>(() => {
    const saved = localStorage.getItem('last_played');
    return saved ? { ...JSON.parse(saved), isPlaying: false } : DEFAULT_SONG;
  });

  // Example using Lanyard API (requires your Discord ID)
  const DISCORD_ID = "535286543032516608";

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await res.json();
        if (data.data?.spotify) {
          const newStatus = {
            isPlaying: true,
            song: data.data.spotify.song || data.data.spotify.track || "Song",
            artist: data.data.spotify.artist,
            trackId: data.data.spotify.track_id,
            albumArt: data.data.spotify.album_art_url
          };
          setStatus(newStatus);
          localStorage.setItem('last_played', JSON.stringify(newStatus));
        } else {
          // If not playing, keep the last seen status but set isPlaying to false
          setStatus(prev => ({ ...prev, isPlaying: false }));
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
        <div className="song-row">
          {status.isPlaying && (
            <div className="audio-wave">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
          )}
          <span className="song-name">{status.song}</span>
        </div>
        <span className="artist-name">
          {!status.isPlaying && <span style={{ opacity: 0.6, fontSize: '0.7rem', marginRight: '4px' }}>Last Played //</span>}
          {status.artist}
        </span>
      </div>
    </div >
  );
};

const GalliumLogoIcon = () => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.img
      src="/assets/gallium-logo.png"
      alt="Gallium"
      style={{ width: '100%', height: '100%', borderRadius: '6px', objectFit: 'cover', display: 'block' }}
      animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 22, repeat: Infinity, ease: 'linear' }
      }
      whileHover={
        reduceMotion
          ? undefined
          : { scale: 1.06, transition: { type: 'spring', stiffness: 420, damping: 18 } }
      }
    />
  );
};

const ExperienceItem = ({
  title,
  company,
  date,
  description,
  bullets,
  icon,
  url,
  iconClassName,
}: {
  title: string;
  company?: string;
  date?: string;
  description?: string;
  bullets?: string[];
  icon?: React.ReactNode;
  url?: string;
  iconClassName?: string;
}) => (
  <div className="card">
      <div className={iconClassName ? `card-icon ${iconClassName}` : 'card-icon'}>
        {icon || <Briefcase size={20} className="text-gray-400" />}
      </div>
      <div className="card-info">
        <div className="card-header">
          <h3>{title}</h3>
          {date ? <span className="card-date">{date}</span> : null}
        </div>
        {company ? (
          <div className="card-subtitle">
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                {company} <ExternalLink size={12} />
              </a>
            ) : (
              company
            )}
          </div>
        ) : null}
        {description && <div className="card-description">{description}</div>}
        {bullets && bullets.length > 0 && (
          <div
            className={`card-bullets-oneline${bullets.length > 1 ? ' card-bullets-oneline--comma' : ''}`}
          >
            {bullets.join(', ')}
          </div>
        )}
      </div>
    </div>
);

const READING_LIST = [
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    coverSrc: '/assets/the-alchemist-cover.png',
  },
  {
    title: 'The Sympathizer',
    author: 'Viet Thanh Nguyen',
    coverSrc: '/assets/the-sympathizer-cover.png',
  },
  {
    title: 'East of Eden',
    author: 'John Steinbeck',
    coverSrc: '/assets/east-of-eden-cover.png',
  },
] as const;

const ReadingPage = () => (
  <motion.div
    className="retro-window reading-page"
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
    style={{ marginTop: '2rem' }}
  >
    <div className="retro-header">
      <div className="section-icon">
        <FolderOpen size={16} />
        <span>reading_list.txt</span>
      </div>
    </div>
    <div className="retro-content reading-page__body">
      <p className="reading-page__intro">
        Books and articles that have shaped my thinking. I&apos;ll keep adding here.
      </p>
      <ul className="reading-list">
        {READING_LIST.map((book) => (
          <li key={book.title} className="reading-list__item">
            <div
              className={`reading-list__cover${book.coverSrc ? '' : ' reading-list__cover--placeholder'}`}
              aria-hidden
            >
              {book.coverSrc ? (
                <img
                  src={book.coverSrc}
                  alt=""
                  className="reading-list__cover-img"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <BookOpen size={18} className="text-gray-500" />
              )}
            </div>
            <div className="reading-list__meta">
              <div className="reading-list__title">{book.title}</div>
              <div className="reading-list__author">{book.author}</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="reading-page__footer">
        <Link to="/" className="reading-page__home-link">
          ← Back to home
        </Link>
      </p>
    </div>
  </motion.div>
);

const WRITING_LIST = [
  {
    title: 'The Rise of the Content Engineer',
    publication: 'Gallium',
    date: 'April 2026',
    tag: 'Strategy',
    url: 'https://gallium.ai/blog/rise-of-the-content-engineer',
    iconSrc: '/assets/gallium-logo.png',
  },
] as const;

const WritingPage = () => (
  <motion.div
    className="retro-window reading-page"
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
    style={{ marginTop: '2rem' }}
  >
    <div className="retro-header">
      <div className="section-icon">
        <FileText size={16} className="text-gray-500" />
        <span>writing.md</span>
      </div>
    </div>
    <div className="retro-content reading-page__body">
      <p className="reading-page__intro">
        Essays and posts on growth, content systems, and what I&apos;m learning while building.
      </p>
      <ul className="reading-list writing-list">
        {WRITING_LIST.map((piece) => (
          <li key={piece.url} className="reading-list__item">
            <a
              href={piece.url}
              target="_blank"
              rel="noopener noreferrer"
              className="writing-list__link"
            >
              <div className="reading-list__cover" aria-hidden>
                <img
                  src={piece.iconSrc}
                  alt=""
                  className="reading-list__cover-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="reading-list__meta">
                <div className="reading-list__title">
                  {piece.title}
                  <ExternalLink size={13} className="writing-list__external" aria-hidden />
                </div>
                <div className="reading-list__author">
                  {piece.publication} · {piece.date} · {piece.tag}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <p className="reading-page__footer">
        <Link to="/" className="reading-page__home-link">
          ← Back to home
        </Link>
      </p>
    </div>
  </motion.div>
);

const Home = ({ selectedPhoto, setSelectedPhoto }: { selectedPhoto: Photo | null, setSelectedPhoto: (p: Photo | null) => void }) => {
  return (
  <>
    <header className="site-header site-header--home">
      <motion.div className="site-header__links">
        <a href="/assets/AidanNguyen_Tran_Resume (2).pdf" target="_blank" rel="noopener noreferrer">Resume</a>
        <a href="mailto:aidan.nt76@gmail.com">Contact</a>
        <Link to="/reading">Reading</Link>
        <Link to="/writing">Writing</Link>
      </motion.div>

      <section className="hero-banner" aria-label="Introduction">
        <HeroMountainBanner />
        <div className="hero-banner__overlay">
          <motion.div className="hero-banner__tools">
            <NowPlaying />
          </motion.div>
          <motion.div className="hero-heading__row">
            <h1 className="hero-heading__h1">
              <span className="hero-heading__name">Aidan Nguyen Tran</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <p className="site-header__bio">
        Based in San Francisco. Currently on leave from ucsd to lead growth at{' '} 
        <a href="https://gallium.ai" target="_blank" rel="noopener noreferrer">Gallium</a> and hopefully retire my parents. <br /> <br /> I'm passionate about men's mental health and enviromental sustainability
         - In my free time I explore how agentic workflows can improve these areas <br /> <br />

         Currently building a open source growth harness to handle and close the loops on growth experiments. more on this soon.</p>

      <motion.div className="site-header__social-pills">
        <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://github.com/Aidan1223f" target="_blank" rel="noopener noreferrer" className="social-pill github">
          <Github size={16} /> Aidan1223f
        </motion.a>
        <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://x.com/aids97426477" target="_blank" rel="noopener noreferrer" className="social-pill x">
          <XIcon size={16} /> aids97426477
        </motion.a>
        <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://www.linkedin.com/in/aidan-nguyen-tran-277a3a258/" target="_blank" rel="noopener noreferrer" className="social-pill linkedin">
          <Linkedin size={16} /> LinkedIn
        </motion.a>
        <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="https://www.instagram.com/ngyntrnn/" target="_blank" rel="noopener noreferrer" className="social-pill instagram">
          <Instagram size={16} /> ngyntrnn
        </motion.a>
      </motion.div>
    </header>

    <main>
      <RetroWindow title="Building" icon={<img src="/assets/folder-icon-macos.webp" alt="Folder" style={{ width: 18, height: 18, objectFit: 'contain' }} />} delay={0.2} className="building-section">
        <div className="experience-subsection">
          <ExperienceItem
            title="Growth Lead"
            company="Gallium"
            url="https://gallium.ai"
            date="Mar 2026 - Present"
            iconClassName="card-icon--logo-clean"
            icon={<GalliumLogoIcon />}
            bullets={[
              "1st Growth",
              "$200K in pipeline",
              "700K impressions",
              "Built SEO/GEO/Twitter products",
              "$4M pre-seed raised"
            ]}
          />
          <ExperienceItem
            title="Founder"
            company="Stealth"
            iconClassName="card-icon--logo-clean"
            icon={
              <img
                src="/assets/stealth-logo.png"
                alt="Stealth"
                style={{ width: '100%', height: '100%', borderRadius: '6px', objectFit: 'cover' }}
              />
            }
            bullets={[
              '700k impressions, customers include 2x YC companies, Crowd Reply, and Adobe.',
            ]}
          />
           <ExperienceItem
            title="Founder"
            company="Hermes AI"
            url="http://joinhermes.co/"
            date="Dec 2025 - Present"
            icon={<img src="/assets/hermes_logo.png" alt="Hermes AI" style={{ width: '100%', height: '100%', borderRadius: '6px', objectFit: 'cover' }} />}
            bullets={[
              "Match, vet, and connect engineers to startups; 2M+ impressions, 6k users, worked w/ 2 YC companies"
            ]}
          />
          <ExperienceItem
            title="Growth Intern"
            company="Cluely"
            date="Jul 2025 - Sep 2025"
            icon={<img src="/assets/cluely.jpeg" alt="Cluely" style={{ width: '100%', height: '100%', borderRadius: '6px', objectFit: 'cover' }} />}
            bullets={[
              "Made funny videos that got lots of view — learned a lot about the attention economy"
            ]}
          />
        </div>
      </RetroWindow>

      <RetroWindow title="Personal projects" icon={<img src="/assets/terminal.png" alt="Terminal" style={{ width: 18, height: 18, objectFit: 'contain' }} />} delay={0.3}>
        <ExperienceItem
          title="Chief Executive Officer"
          company="Lockd"
          url="https://getlockd.app/"
          date="Aug 2025 - Present"
          icon={<img src="/assets/lockd_logo.png" alt="Lockd" style={{ width: '100%', height: '100%', borderRadius: '6px', objectFit: 'cover' }} />}
          bullets={[
            "Kalshi for Friend Groups; 100+ users"
          ]}
        />
      </RetroWindow>

      <RetroWindow title="photo album" icon={<IOSPhotosIcon size={18} />} delay={0.4}>
        <div className="places-grid">
          {PLACE_PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              className="place-item"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
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
  </>
  );
};

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
    <Router>
      <div className="container">
        <div className="bg-animation">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        <div className="container-main">
        <Routes>
          <Route path="/" element={<Home selectedPhoto={selectedPhoto} setSelectedPhoto={setSelectedPhoto} />} />
          <Route path="/reading" element={<ReadingPage />} />
          <Route path="/writing" element={<WritingPage />} />
        </Routes>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div>© 2026 Aidan Nguyen.</div>
        </motion.footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
