import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, MapPin, Sparkles, Music2, Gift, MoonStar, ChevronDown, Heart, Star, Menu, X } from 'lucide-react';
import './styles.css';
import MidAutumnGame from './components/MidAutumnGame';
import baoChauLogo from './components/image/61afcf6a3908b956e019.jpg';
import MoonFestivalCharacters from './components/MoonFestivalCharacters';

const activities = [
  { icon: '🏮', title: 'Rước đèn lung linh', text: 'Cùng nhau thắp sáng đêm rằm với hàng trăm chiếc đèn lồng rực rỡ.' },
  { icon: '🦁', title: 'Múa lân sôi động', text: 'Những màn biểu diễn náo nhiệt mang đến tiếng cười và may mắn.' },
  { icon: '🥮', title: 'Thưởng bánh Trung Thu', text: 'Thưởng thức hương vị truyền thống trong không gian sum vầy ấm áp.' },
  { icon: '🎶', title: 'Đêm nhạc trăng rằm', text: 'Âm nhạc, ánh sáng và những tiết mục đầy cảm xúc dưới ánh trăng.' },
];

const timeline = [
  ['18:00', 'Đón khách & check-in', 'Khu cổng đèn lồng'],
  ['18:30', 'Khai hội Trăng Rằm', 'Sân khấu chính'],
  ['19:00', 'Múa lân - trống hội', 'Quảng trường'],
  ['19:30', 'Rước đèn quanh phố', 'Lộ trình lễ hội'],
  ['20:15', 'Phá cỗ & tặng quà', 'Khu đoàn viên'],
  ['21:00', 'Đêm nhạc ánh trăng', 'Sân khấu chính'],
];

function Lantern({ left, delay, scale = 1, hue = 'red' }) {
  return (
    <div className={`lantern lantern-${hue}`} style={{ left, animationDelay: delay, transform: `scale(${scale})` }}>
      <span className="lantern-top" />
      <span className="lantern-body"><i /><i /><i /></span>
      <span className="lantern-tail" />
    </div>
  );
}

function App() {
  const [open, setOpen] = useState(false);
  const [wish, setWish] = useState('');
  const [sent, setSent] = useState(false);
  const stars = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    left: `${(i * 37) % 100}%`, top: `${(i * 53) % 82}%`, delay: `${(i % 8) * .4}s`, size: `${1 + (i % 3)}px`
  })), []);

  useEffect(() => {
    const onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const sendWish = (e) => {
    e.preventDefault();
    if (!wish.trim()) return;
    setSent(true);
    setWish('');
    setTimeout(() => setSent(false), 2800);
  };

  return (
    <div className="page-shell">
      <nav className="nav">
        <a className="brand" href="#home"><img className="brand-logo" src={baoChauLogo} alt="Bảo Châu" /><span>Trăng Rằm</span></a>
        <div className={`nav-links ${open ? 'show' : ''}`}>
          <a href="#about" onClick={() => setOpen(false)}>Lễ hội</a>
          <a href="#activities" onClick={() => setOpen(false)}>Hoạt động</a>
          <a href="#schedule" onClick={() => setOpen(false)}>Lịch trình</a>
          <a href="#wish" onClick={() => setOpen(false)}>Gửi lời chúc</a>
        </div>
        <a href="#game" className="nav-cta">Khám phá ngay</a>
        <button className="menu-btn" aria-label="Menu" onClick={() => setOpen(v => !v)}>{open ? <X/> : <Menu/>}</button>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-aurora" aria-hidden="true" />
          <div className="shooting-stars" aria-hidden="true"><span/><span/><span/></div>
          <div className="stars" aria-hidden="true">{stars.map((s,i)=><span key={i} style={s}/>)}</div>
          <div className="cloud cloud-a" /><div className="cloud cloud-b" />
          <Lantern left="8%" delay="0s" scale={.9}/><Lantern left="88%" delay="1.2s" scale={.75} hue="gold"/>
          <Lantern left="18%" delay="2s" scale={.52} hue="gold"/><Lantern left="78%" delay=".5s" scale={.55}/>
          <div className="moon-wrap"><div className="moon"><span className="rabbit">🐇</span></div><div className="moon-glow" /></div>
          <MoonFestivalCharacters />
          <div className="hero-content">
            
            <h1>Vui hội Trăng Rằm<br/><span>cùng Bảo Châu</span></h1>
            <p>Một đêm Trung Thu đầy ánh sáng, tiếng cười và những khoảnh khắc sum vầy đáng nhớ.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#activities">Khám phá lễ hội <ChevronDown size={18}/></a>
              <a className="btn btn-ghost" href="#wish"><Heart size={18}/> Gửi lời chúc</a>
            </div>
            <div className="hero-meta">
              <span><CalendarDays size={18}/> 25.09.2026</span>
              <span><MapPin size={18}/> Phố hội Ánh Trăng</span>
            </div>
          </div>
          <div className="hill hill-1"/><div className="hill hill-2"/><div className="cityline"><span/><span/><span/><span/><span/><span/></div>
        </section>

        <section className="intro section" id="about">
          <div className="section-kicker">TRUNG THU LÀ ĐỂ ĐOÀN VIÊN</div>
          <h2>Một đêm hội, ngàn khoảnh khắc đẹp</h2>
          <p className="lead">Từ ánh đèn lồng, tiếng trống lân đến hương bánh nướng thơm dịu — tất cả cùng tạo nên một đêm rằm thật gần gũi và đáng nhớ.</p>
          <div className="stats">
            <div><strong>6+</strong><span>Hoạt động đặc sắc</span></div>
            <div><strong>1</strong><span>Đêm hội duy nhất</span></div>
            <div><strong>∞</strong><span>Khoảnh khắc yêu thương</span></div>
          </div>
        </section>

        <section className="section activities-section" id="activities">
          <div className="section-heading"><div><span className="section-kicker">ĐIỀU ĐANG CHỜ BẠN</span><h2>Sắc màu đêm hội</h2></div><MoonStar size={42}/></div>
          <div className="activity-grid">
            {activities.map((a,i)=><article className="activity-card" key={a.title} style={{'--i': i}}><div className="activity-icon">{a.icon}</div><span className="card-number">0{i+1}</span><h3>{a.title}</h3><p>{a.text}</p></article>)}
          </div>
        </section>

        <section className="festival-banner">
          <div className="banner-copy"><span className="section-kicker light">ĐÊM RẰM RỰC RỠ</span><h2>Thắp một chiếc đèn,<br/>giữ một miền ký ức</h2><p>Trung Thu không chỉ là một lễ hội. Đó là ký ức tuổi thơ, là phút sum vầy và là niềm vui được trao đi.</p></div>
          <div className="banner-visual"><div className="big-lantern"><span>福</span></div><div className="spark s1">✦</div><div className="spark s2">✧</div><div className="spark s3">✦</div></div>
        </section>

        <MidAutumnGame />

        <section className="section schedule-section" id="schedule">
          <div className="section-heading"><div><span className="section-kicker">LỊCH TRÌNH ĐÊM HỘI</span><h2>Đi cùng ánh trăng</h2></div><Music2 size={40}/></div>
          <div className="timeline">
            {timeline.map(([time,title,place],i)=><div className="timeline-row" key={time}><div className="time">{time}</div><div className="timeline-dot"><span/></div><div className="timeline-copy"><h3>{title}</h3><p>{place}</p></div><span className="timeline-star">{i%2===0?'✦':'✧'}</span></div>)}
          </div>
        </section>

        <section className="wish-section" id="wish">
          <div className="wish-card">
            <div className="wish-icon"><Gift size={28}/></div>
            <span className="section-kicker">MỘT LỜI CHÚC, MỘT NIỀM VUI</span>
            <h2>Gửi lời chúc dưới ánh trăng</h2>
            <p>Viết một lời chúc nhỏ cho người bạn thương. Mong mọi điều tốt đẹp sẽ đến trong mùa trăng này.</p>
            <form onSubmit={sendWish} className="wish-form">
              <input value={wish} onChange={e=>setWish(e.target.value)} placeholder="Ví dụ: Chúc gia đình mình luôn bình an và hạnh phúc..." aria-label="Lời chúc" />
              <button type="submit">Gửi lời chúc <Sparkles size={17}/></button>
            </form>
            {sent && <div className="toast"><Star size={18} fill="currentColor"/> Lời chúc của bạn đã bay lên cùng ánh trăng!</div>}
          </div>
        </section>
      </main>

      <footer><div className="brand"><img className="brand-logo" src={baoChauLogo} alt="Bảo Châu" /><span>Trăng Rằm</span></div><p>Vui hội Trăng Rằm cùng Bảo Châu · 2026</p><span>Made with ♥ dưới ánh trăng</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
