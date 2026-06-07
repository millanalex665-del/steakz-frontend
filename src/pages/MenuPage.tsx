import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface MenuItem { id: number; name: string; description: string | null; category: string; price: string; available: boolean }

// Stitch images mapped by menu item name keywords
const FOOD_IMAGES: Record<string, string> = {
  'Wagyu': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQbRumqWNoZiJ9X-wd8IjARQZSSTz7bvCr5TRp_LHca3alyAOLcpSuCYgbyRb12fLSstnAbztW6aEFuj4-GTmpgRhS0Dq1vkCzqx57zYkd5D5oJryS7rsN0Dg9wG_I2s1ljqVIjPdh1AHNe1hzGpnsgBu_PcnRPyPxGwTg_P0ZgWXGrjUk74FsoVaIdQQC5JTHuIj2yi8pv0mCkTL_6aHhGI3P3LN6LtSLfoGa6y4S8q3J4KxscTRL1-JuLj9OAZ5kfJgnLpxM8XM',
  'Sirloin': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDWww0JllYGWyWTdWKQJs8qfaY03pvPsP3v7vrKze45CzpQ94H5yV-kEm2G-8-A4lp-iNdhy0UVvq7Q1lh2k7PrVsXkUIwip9g-Zjc6hx1KYoGuAz9ZXEPDaRX-wRADhfIfcMFmh6FdlTxqfPPfxc6hjvUTGVOlQOMtH3U-uzsYKvHjyXYNJFfKcfbE1y1mY95Gpq5xxZiX2yS7UJZXqbl1OyqeqbR-Ea3jyopN1T_ZxCSupO-_BBEvKZ2cnT-Sr00NRYH5YEUQoY',
  'Lamb': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYVMNXfZaqewN-eGeN98dXSsR5HgK-HB-Z66wVaqAkJNLg4o2ThRvplDSjEXuwhm1hRHReGKBCeEc8RyKYab-0cTHJlcsLtyn4f8v1A0XMONLcGhOXT4rr6sHSOGeixBv8eJvE2vQ12T0IEFCf95SJ1jI3X5KNAd6mqqu9IT57iRcKz4bTjqwdduJ40sawkEx7kA8Jk5oPUVOjrbJ53dyqBVGsnOTBlYNf135pVdEebs5isEPW3pcJpXeRRmX3jN2OOF9sljvJf2E',
  'Caesar': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0q_31KCzW0TYvPC9EZUFETezevwReoOf3AMrJtpF3x9FRfePOtfHtoELuz2E_1F02wW-tkNEjyE2UC_D9_ZaaWVFgsd2_XvM_hgj31vnWoy-AwiR6-luWidnX2dVt13y2XLKdiPJLkHaQWsBwq5-0v196Sin63EDy64tlMEzHpc0TkeNLRDwuw80XVv_FOXTTyhlaBh_RbyFgaceLwOBDeKgFiNykRyfEphZ9t6-RjuUup-xzfA-5HkL1ztDZf6Z2tjKGy3TIi_4',
  'Garlic': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtj-glQ9yvt5DNikdyo6Dw8B60YaA5-LAyEeImtFQKOd41j4KM0UDzlos9_TDyVvMoAHs07Xye_dmtSNKjhq5qyawbfyg2iUkaQ8MjDxBruODQppYnhvcHq4VUzQ7fk5t-EEl55jM5BKZ4JoLorEbbNsI8B_wQykdPk-LSB2G4tqc_RKTJEVCS7DovAwoZSFyrZi6szfm8N5pOSs9XnYHyCFOYWgM7_jtVKbFsLI63p7-G5xhPnQWAUz_Rr5Oo5NJDmTLCY0wE7CI',
  'Soup': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5v46pES0aF9bRM5f0LjL_IbCrhSCJpZxrNAbWGzUxyvMXwkkOzolOxet0I6lBOSwxyC7VkZ6gJjZSPFei82XFr6BWTc0owt_Nbx5PKe1G7b5eK8wYhBa1LDW8CFEiTyyH7s7HThNxbECONalVdAC065M54x9bGiNuFm53tZVjy_ucTGRfKf0a0WyDdozhDRaawYu1gtYWyEMI_2sCOc_lhZCSw2BnE-k0Yx2e7SUKKxvtzyWHafq8zUAKlv9AcLsTLsnGTvVevbo',
  'Truffle': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFCsHsMXakmJQ-j8k5dFTdqRbDtSxBkgVsLWtBINM2HIIdCCxdZV7-6cg-GX8dCAfCXCQUQd-2S4Lx--NHXqh9_dYy7qPdzhCVQtgMLUQoUnHNQrP0u4eK6CRC-4gPe7OBobUjulpyeGfm321N7_J7Fk0I7DlOR-TinkUwtP0ThgGtaczMjS_4vCbNLUOU5Vuqi_KN4tlQOGWmxptd4g5R8YE5XaFVm8xaa2bJDi-xbi0KZdMd-lvMl_vfa9-lNeP3ZkyZ2ekgMbU',
  'Onion': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2zltlwIrdgKHPbM0FJUf6cDAn947Qdto8plYtxeC9mkBVhNnn5wEaQvu1AqSxafrPiOOgorDHA603Xn9xnPAgZA_xhtGzvxGzaZXYDmjT7WGV8MM0sP9nnDkmTHIcEIqtrZL0FvC_QpPBY7AxdLRYK5J9pCqdxc-12SX7aktn2eN45JskfM_lCsMJffzaDTzKZvdUF4FFi_P4a7p45Na220D3L9ssPGrbRWNxLQnXv3Yd17E8XHKSXpK0ZHviMvrPTWFzlpkFDxA',
  'Cheesecake': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBIhQaafEg6lgV-oJsGU_TxxkoBlyIKL7dYQQUZ9u2yCvS-V6UrKnjJ6xE821rTriShPMhaPvE74RS8HQ4XNKQ5xDImyPmZgiAbYOlGGlTpWUar5FoPv2CvXeElIGbnRaNQ1lembL1EBGBt6aJZVBIuPidB0GsBVYfVfyiaJMrErtujOrcn6Frgaun86retxy-N62L21GJ_EnfFRTxgFes5dFsirG-0sZw10g6e7fVnYkopt1zqfMg41kNzB2NQzhpJJzzQK4NwOk',
  'Chocolate': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_Va72iwBDlNT0kGIYofPuo8xeU5KMjpbbkV0fKSHV06HgUGrr4IfOBYpOqILNPxs8VZ3yi4r82MSrcjBTzJr2OfgPEYojS7EfWf-9VmPiTmo9HxaD4H5bOiaUf4Cg5_SepF774xWo7Y4t4bXA8erVGcakCYYNg3NrW2eApp5clkX8uvGCiyZwR_cOvdQMqN0dgoUzJNmSn5usevXrU4gHiFF1hspNy8jMX9vW-P8oweqCnyt7aIKIuPjmJvc29sUY0ZD49RK_OC0',
  'Coca': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc6fe8yRrojlAqL9u3ekIbpp1IBOa7mngBOP3S3skBN3A-VX0n-85_3TzYhL317PsKnhwTvDd5UVZpkNoM6T_S3pzBNXHcgqZmTwFx0aEO6BsZWjPogP0MvqlP_nr6f6hoTA4uToJhwzYi3o03SXmH4jrKiu3aRbPalOxjmdDM7ErH8KcZMQUaeZE_utPhUnAjSoqsaWa2pW3wZWwC15KHiWCvpoysXJ-SL76Bd5BrGZomLjZXlikRxtdov_rzmwoeqeJvwwXGCXo',
  'Lemonade': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF7Xl1s8hV0wn56FmIsS-Dg4K1IbTZBshkuRgkIsmxrM53wbZqk8ZFMG-IrZRcR8efE9kgI0P8Ntj8byjDHPIjzyMsNZDOAGYS4_CjdT5-lxhaIIDyuDqaLm7YcktJCAZFcHvwKuYM_nv0Y2Oc6L4H3S45VnbZU93GnLF5GsMyx1ATCcsUsJd6lXbxVwRMV5Ub5dX0LxiegdPbCstjH7SCJnLqnfva15bdQJJnK5otfGHCJXLbzpyxdYK5F5SZhqVG0DDJt7tg8DM',
};

// Default fallback image
const DEFAULT_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQbRumqWNoZiJ9X-wd8IjARQZSSTz7bvCr5TRp_LHca3alyAOLcpSuCYgbyRb12fLSstnAbztW6aEFuj4-GTmpgRhS0Dq1vkCzqx57zYkd5D5oJryS7rsN0Dg9wG_I2s1ljqVIjPdh1AHNe1hzGpnsgBu_PcnRPyPxGwTg_P0ZgWXGrjUk74FsoVaIdQQC5JTHuIj2yi8pv0mCkTL_6aHhGI3P3LN6LtSLfoGa6y4S8q3J4KxscTRL1-JuLj9OAZ5kfJgnLpxM8XM';

function getImage(name: string): string {
  for (const [key, url] of Object.entries(FOOD_IMAGES)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return url;
  }
  return DEFAULT_IMG;
}

const CATEGORY_ORDER = ['Starters', 'Mains', 'Sides', 'Desserts', 'Drinks'];
const CATEGORY_COLORS: Record<string, string> = { Starters: '#af2b3e', Mains: '#000', Sides: '#444748', Desserts: '#6b21a8', Drinks: '#0f766e' };

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => { void api.get('/api/public/menu').then(r => setItems(r.data as MenuItem[])); }, []);

  const categories = ['All', ...CATEGORY_ORDER.filter(c => items.some(i => i.category === c))];
  const filtered = items.filter(i => {
    const matchCat = activeCategory === 'All' || i.category === activeCategory;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const catItems = filtered.filter(i => i.category === cat);
    if (catItems.length) acc[cat] = catItems;
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div style={{ fontFamily: 'Hanken Grotesk, sans-serif', background: '#fbf9f8', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <header style={{ background: '#fbf9f8', borderBottom: '1px solid #c4c7c7', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1280, margin: '0 auto', padding: '0 40px', height: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="material-symbols-outlined" style={{ color: '#000', fontSize: 32 }}>restaurant</span>
            <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 32, fontWeight: 700, color: '#000' }}>Steakz MIS</span>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            <Link to="/" style={{ fontSize: 12, fontWeight: 700, color: '#444748', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Home</Link>
            <Link to="/menu" style={{ fontSize: 12, fontWeight: 700, color: '#af2b3e', textDecoration: 'none', borderBottom: '2px solid #af2b3e', paddingBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Menu</Link>
            <Link to="/branches" style={{ fontSize: 12, fontWeight: 700, color: '#444748', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Locations</Link>
          </div>
          <Link to="/login" style={{ background: '#000', color: '#fff', padding: '10px 24px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Staff Login
          </Link>
        </nav>
      </header>

      {/* HERO BANNER */}
      <div style={{ background: '#000', padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#af2b3e', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Our Offerings</span>
          <h1 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 56, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>The Menu</h1>
          <p style={{ color: '#858383', fontSize: 16, maxWidth: 500 }}>Signature 45-Day Dry Aged Ribeye and seasonal specialties crafted for unparalleled flavor.</p>
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="material-symbols-outlined" style={{ color: '#af2b3e', fontSize: 32 }}>restaurant</span>
            <div>
              <div style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 40, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{items.length}</div>
              <div style={{ fontSize: 12, color: '#747878', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Menu Items</div>
            </div>
          </div>
        </div>
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQbRumqWNoZiJ9X-wd8IjARQZSSTz7bvCr5TRp_LHca3alyAOLcpSuCYgbyRb12fLSstnAbztW6aEFuj4-GTmpgRhS0Dq1vkCzqx57zYkd5D5oJryS7rsN0Dg9wG_I2s1ljqVIjPdh1AHNe1hzGpnsgBu_PcnRPyPxGwTg_P0ZgWXGrjUk74FsoVaIdQQC5JTHuIj2yi8pv0mCkTL_6aHhGI3P3LN6LtSLfoGa6y4S8q3J4KxscTRL1-JuLj9OAZ5kfJgnLpxM8XM" alt="hero" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '40%', objectFit: 'cover', opacity: 0.3 }} />
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 40px' }}>

        {/* FILTER BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                background: activeCategory === cat ? '#000' : '#fff',
                color: activeCategory === cat ? '#fff' : '#444748',
                border: `1px solid ${activeCategory === cat ? '#000' : '#c4c7c7'}`,
                padding: '8px 20px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase'
              }}>
                {cat}
              </button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menu..." style={{ padding: '10px 16px', border: '1px solid #c4c7c7', fontFamily: 'Hanken Grotesk', fontSize: 14, width: 240, outline: 'none' }} />
        </div>

        {/* MENU SECTIONS */}
        {Object.entries(grouped).map(([category, categoryItems]) => (
          <section key={category} style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 28, fontWeight: 600, color: '#000' }}>{category}</h2>
              <div style={{ height: 2, flex: 1, background: '#e9e8e7' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#747878' }}>{categoryItems.length} items</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {categoryItems.map(item => (
                <div key={item.id} style={{ background: '#fff', border: '1px solid #c4c7c7', overflow: 'hidden', position: 'relative' }}>
                  {!item.available && (
                    <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: '#ba1a1a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', textTransform: 'uppercase' }}>Unavailable</div>
                  )}
                  <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                    <img src={getImage(item.name)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: item.available ? 'none' : 'grayscale(0.6)' }} />
                    <div style={{ position: 'absolute', top: 12, left: 12, background: (CATEGORY_COLORS[category] ?? '#000') + 'DD', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{category}</div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 20, fontWeight: 600, color: '#000', flex: 1 }}>{item.name}</h3>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 700, color: '#af2b3e', marginLeft: 12, whiteSpace: 'nowrap' }}>£{Number(item.price).toFixed(2)}</span>
                    </div>
                    {item.description && <p style={{ color: '#444748', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80, color: '#747878' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, display: 'block', marginBottom: 16 }}>search_off</span>
            <p style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 24 }}>No items found</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#000', color: '#fff', padding: '32px 40px', marginTop: 40 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Libre Caslon Text, serif', fontSize: 24, fontWeight: 700 }}>Steakz</span>
          <span style={{ color: '#747878', fontSize: 12 }}>© 2024 Steakz Management Systems</span>
          <Link to="/login" style={{ background: '#af2b3e', color: '#fff', padding: '10px 24px', fontFamily: 'Hanken Grotesk', fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Staff Login</Link>
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
