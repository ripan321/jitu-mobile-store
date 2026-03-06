import RepairHighlight from '../components/home/RepairHighlight'

export default function RepairServicesPage() {
  return (
    <div>
      <div style={{
        background: '#f4f6fb',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#1a237e', marginBottom: 8 }}>
          Expert Repair Services
        </h1>
        <p style={{ color: '#455a64', fontSize: 15 }}>
          Same-day repairs · 12-month warranty · 200+ device models
        </p>
      </div>
      <RepairHighlight />
    </div>
  )
}
