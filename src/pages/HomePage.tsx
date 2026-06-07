import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', background: '#fbf9f8', color: '#1b1c1c', overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <header style={{ background: '#fbf9f8', borderBottom: '1px solid #c4c7c7', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1280, margin: '0 auto', padding: '0 40px', height: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ color: '#000', fontSize: 32 }}>restaurant</span>
            <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 32, fontWeight: 700, color: '#000' }}>Steakz MIS</span>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { label: 'Home', href: '/', active: true },
              { label: 'Menu', href: '/menu', active: false },
              { label: 'Locations', href: '/branches', active: false },
            ].map(item => (
              <Link key={item.label} to={item.href} style={{ fontSize: 12, fontWeight: 700, color: item.active ? '#af2b3e' : '#444748', textDecoration: 'none', borderBottom: item.active ? '2px solid #af2b3e' : 'none', paddingBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {item.label}
              </Link>
            ))}
          </div>
          <Link to="/login" style={{ background: '#000', color: '#fff', padding: '10px 24px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Staff Login
          </Link>
        </nav>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px' }}>

        {/* HERO */}
        <section style={{ position: 'relative', height: 600, borderRadius: 12, overflow: 'hidden', marginBottom: 80, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.4), transparent)', zIndex: 10 }} />
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpS7FjIxOhd_jVg22kB6SCnkf5mdQdAb4aGCsrTM3ZPMBjem49y5ZWU1hicrXfIZ6iA8H7WRd708fZDX335xc2c3mRW1Rn5oGKE9TwoTavsve4t5_Ax76FDjeqijDSxXVk89eah3I0_2Kb9F2jshkOI-Wjr5-WcHLODqq4T6R7IFgpYl4Lpv1YTmQp-XAlPYy055e2sLO4BPzTyyxNAmn1rxnkrVlZmshFkxpCvmJBzwNyIUcQ_VouIzzc-tPzn58GowWiIi0ZnQc" alt="Premium Dry-Aged Ribeye" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'relative', zIndex: 20, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
            <span style={{ color: '#af2b3e', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>The Gold Standard of Beef</span>
            <h1 style={{ fontFamily: 'Libre Caslon Text, serif', color: '#fff', fontSize: 72, fontWeight: 700, lineHeight: 1.1, marginBottom: 24, maxWidth: 600 }}>Precision Aged.<br/>Perfectly Seared.</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: 480, marginBottom: 40, fontSize: 18, lineHeight: 1.7 }}>
              Experience the pinnacle of British culinary craftsmanship. Our heritage-bred beef is dry-aged for 35 days in Himalayan salt chambers to ensure unparalleled depth of flavor.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <Link to="/menu" style={{ background: '#af2b3e', color: '#fff', padding: '16px 32px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase' }}>View Menu</Link>
              <button style={{ border: '1px solid rgba(255,255,255,0.5)', color: '#fff', background: 'transparent', padding: '16px 32px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Book a Table</button>
            </div>
          </div>
        </section>

        {/* PROMOTIONS */}
        <section style={{ marginBottom: 80 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 32, fontWeight: 600, color: '#000', marginBottom: 8 }}>Exclusively for You</h2>
              <div style={{ height: 4, width: 48, background: '#af2b3e' }} />
            </div>
            <a href="#" style={{ fontSize: 12, fontWeight: 700, color: '#af2b3e', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              All Offers <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '240px 240px', gap: 24 }}>
            {/* Sunday Roast - spans 2 rows */}
            <div style={{ gridRow: '1 / 3', position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEVUkvwDlnyUcMC_3sC-98PaeDP4XOAXuHFGjuTEnu2Uc4PCQvA_bR9ZFph_pizWITYsc5ctaGTswInKlQtYV3qva4YEQzi1jeSvb9x3ZKZjpf0pRagtB8YQo6_5iib7vJri-eP-TFbzSM-FdOLrWqwqbUzi2u4yrjGcGNMqSiCqMFvfoi3n6BoWrGjyq9PhbSMCREheXGj2cP-RSBIoz2Sk8ZUVuOVSRl9AAPiNKwoJzvlCjyzXR1Wmv2bu3Y0lEl7pmFz0yV_Vg" alt="Sunday Roast" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 32 }}>
                <span style={{ background: '#af2b3e', color: '#fff', fontSize: 10, padding: '3px 10px', marginBottom: 16, alignSelf: 'flex-start', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Limited Time</span>
                <h3 style={{ fontFamily: 'Libre Caslon Text, serif', color: '#fff', fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Sunday Roast Special</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 20, fontSize: 14 }}>Our signature beef roast served with triple-cooked dripping potatoes and bottomless bone marrow gravy.</p>
                <button style={{ background: '#fff', color: '#000', border: 'none', padding: '10px 24px', borderRadius: 999, fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>Learn More</button>
              </div>
            </div>
            {/* Midweek Lunch */}
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDIUv07w7a2v-5YE4vYbeoUk4t78qXIZA2eXtuEEVInZTwmXuMzx2lX5bxPaMDxBEPpm6FwBm1XL_JHiSIkcf0DXHBLSPaLTGzLrEOFyTVHaQ6nngcGIh34vOvDNw-2wlfDHYfoz6xP1gFrhx5PKhLoRano8HqDQ0svhew6PPFrTDi5b3_tMX2VgoAEm7E3M7B4WpJgxIRRSMuAE6NIGGR6DlA4V1BzwVVQRHs08Bvxf50z-eWqXWON7RcdATVoifZZhPXIsC_VYI" alt="Midweek Lunch" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(28,27,27,0.8)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 32 }}>
                <h3 style={{ fontFamily: 'Libre Caslon Text, serif', color: '#fff', fontSize: 20, marginBottom: 8 }}>Midweek Lunch</h3>
                <p style={{ color: '#858383', fontSize: 14, marginBottom: 16 }}>2 Courses for £24. Available Mon-Fri.</p>
                <a href="#" style={{ color: '#ffb3b5', fontSize: 12, fontWeight: 700 }}>Book Lunch →</a>
              </div>
            </div>
            {/* Wine & Wagyu */}
            <div style={{ background: '#fff', border: '1px solid #c4c7c7', borderRadius: 12, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 32 }}>
              <span className="material-symbols-outlined" style={{ color: '#af2b3e', fontSize: 40, marginBottom: 16 }}>wine_bar</span>
              <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, color: '#000', marginBottom: 8 }}>Wine & Wagyu</h3>
              <p style={{ color: '#444748', fontSize: 14, marginBottom: 20 }}>Curated pairings from our master sommelier.</p>
              <button style={{ border: '1px solid #747878', color: '#000', background: 'transparent', padding: '8px 16px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start' }}>Explore Cellar</button>
            </div>
          </div>
        </section>

        {/* CHEF'S SELECTION */}
        <section style={{ marginBottom: 80 }}>
          <h2 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 32, fontWeight: 600, textAlign: 'center', marginBottom: 40 }}>Chef's Selection</h2>
          <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16 }}>
            {[
              { name: 'The Tomahawk', price: '£85', desc: '1.2kg of bone-in ribeye, salt-aged and finished over cherry wood embers.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUJha4LZHby8TMnJjlDSeaEjhxNFJUe7AUImzJyy0zULxSniCLA7yF7GMtNmdwdG1tmU6W-Lup7W2UFK2UOZjRGlkQ5rmf935NkV6r_l_TVe4BVrp9HBGXz_9F51Io3NJTTPBWPvr92_9S4p0bTZMS8yb_m8RAFA2Gc4-VQHR5BitzvPV2vEj3c75Rv5jvsiPmQwAfs760jYFSJGnGCvgKSGkWFM-opcF_c5Z7KCzHAQNfkZoNEONhd49SPsbHMmRfmHEgWzqSw58' },
              { name: 'Center-Cut Filet', price: '£42', desc: 'Our tenderest cut, served with a red wine jus and roasted shallots.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqOqsuawbBzFcD5s351wGCLeIcBKUJqGOM43bIFDaXE34BrCLmlHThgBF5LjhiH89izXeCGUk43enea-yEIw32niIUbpeFFALTYLqDZebIRBNZTUG2ek4wvUda7LmDbpdbLb4PGIsqE49_YXXNSXu1kWwJX_UxyLasG1jrh4M1b4q-acYIZ-jj758HhlRsK1g7jamimBZFLhK4FIwGH3K11aEsR0LoukyF3x5jmGqY7uTyUV_oDK28Cl1Ozobjki3nZ5gdImoXEec' },
              { name: 'Signature Frites', price: '£28', desc: 'Heritage Flat Iron, skin-on fries, and house-made peppercorn sauce.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2BYy41G--tmtaTbrELwCZYcysmIXNnCFU2EYFjuWS6MNmYmoeRquHhi07flVEIjITfiJbvwaFF7HORJP0wWkPAnUYImcIa6P5-5BU60yQN_wbyFMyvJNNlfYFtFuHvZ0x_D5trXTamOkxwZciDA3THb4shrv95TWrTyUCgB1_x6f__Ayvc1XO0NVwpIBzGLdtlxgBMVzqbqA4PqYdAxnbMbOXHyqsPYLNqcvnDR3VHVQFs2KV8KQ3pUrCDCTrX5vmi0oe50qAys0' },
              { name: 'A5 Wagyu Strips', price: '£110', desc: 'Exquisite marbling, melt-in-the-mouth texture. Imported directly from Kagoshima.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2w_f2_is5xHlShEqlKimYJa__IAfkSJlnUsenqWOZVV6HIpsBRbJm064BbUXwZqtrGtEqdwjCdYzG4bvbWi2Pau2IlumbO8AQQ7m2YLeBbRc0nCnvaClKjt-9Llnfhz_EKckowVlgm-23P33mTLpjrAg9XF1klX1SlrqgtUdHF6wmTn7VDMPN0IK1kSVZLyos1iig-yeSEPE3kowbX4yhK_wibsAJroxix9TAHbWzdIaHE44lU49UPNlG7x8nsxKPEnjug3aPLq4' },
            ].map(meal => (
              <div key={meal.name} style={{ minWidth: 300, background: '#fff', border: '1px solid #c4c7c7', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ height: 240, overflow: 'hidden' }}>
                  <img src={meal.img} alt={meal.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h4 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 18, fontWeight: 600, color: '#000' }}>{meal.name}</h4>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500, color: '#af2b3e' }}>{meal.price}</span>
                  </div>
                  <p style={{ color: '#444748', fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}>{meal.desc}</p>
                  <button style={{ width: '100%', border: '1px solid #af2b3e', color: '#af2b3e', background: 'transparent', padding: '10px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Add to Favorites</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* LOCATIONS */}
        <section style={{ marginBottom: 80, background: '#efeded', borderRadius: 24, padding: '64px 64px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 32, fontWeight: 600, color: '#000', marginBottom: 12 }}>Our Locations</h2>
              <p style={{ color: '#444748', fontSize: 16 }}>Find the perfect cut at any of our award-winning branches across the UK.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { name: 'Downtown London', addr: '42 Savile Row, Mayfair, London W1S 3JR', open: true },
                { name: 'Manchester Central', addr: 'Unit 8, Spinningfields, Manchester M3 3BE', open: true },
                { name: 'Edinburgh Old Town', addr: '12 Royal Mile, Edinburgh EH1 1QS', open: false },
              ].map(loc => (
                <div key={loc.name} style={{ background: '#fff', border: '1px solid #c4c7c7', borderRadius: 12, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#efeded', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: '#af2b3e', fontSize: 28 }}>location_on</span>
                    </div>
                    <div>
                      <h5 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 18, fontWeight: 600, color: '#000', marginBottom: 4 }}>{loc.name}</h5>
                      <p style={{ color: '#444748', fontSize: 14 }}>{loc.addr}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ background: loc.open ? '#dcfce7' : '#e9e8e7', color: loc.open ? '#15803d' : '#444748', fontSize: 10, padding: '4px 10px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {loc.open ? 'Open Now' : 'Opens at 5PM'}
                    </span>
                    <button style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Book Here</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ background: '#000', color: '#fff', padding: '64px 40px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 2fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 28 }}>restaurant</span>
                <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 24, fontWeight: 700 }}>Steakz</span>
              </div>
              <p style={{ color: '#858383', fontSize: 14, lineHeight: 1.7 }}>Redefining the British steakhouse experience through precision, passion, and heritage.</p>
            </div>
            <div>
              <h6 style={{ fontSize: 11, fontWeight: 700, color: '#ffb3b5', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>Navigation</h6>
              {['The Menu', 'Our Story', 'Private Dining', 'Gift Vouchers'].map(item => (
                <div key={item} style={{ color: '#858383', fontSize: 14, marginBottom: 12, cursor: 'pointer' }}>{item}</div>
              ))}
            </div>
            <div>
              <h6 style={{ fontSize: 11, fontWeight: 700, color: '#ffb3b5', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>Support</h6>
              {['Contact Us', 'Careers', 'Privacy Policy', 'Accessibility'].map(item => (
                <div key={item} style={{ color: '#858383', fontSize: 14, marginBottom: 12, cursor: 'pointer' }}>{item}</div>
              ))}
            </div>
            <div>
              <h6 style={{ fontSize: 11, fontWeight: 700, color: '#ffb3b5', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>Newsletter</h6>
              <p style={{ color: '#858383', fontSize: 12, marginBottom: 16 }}>Join our Prime Cut circle for exclusive invites.</p>
              <div style={{ display: 'flex', borderBottom: '1px solid #747878' }}>
                <input placeholder="Email Address" type="email" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, flex: 1, padding: '8px 0' }} />
                <button style={{ background: 'transparent', border: 'none', color: '#ffb3b5', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(116,120,120,0.3)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#747878', fontSize: 12 }}>© 2024 Steakz Management Systems. All rights reserved.</span>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:wght@400;700&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; font-family: 'Material Symbols Outlined'; }
      `}</style>
    </div>
  );
}
