import { useState } from 'react'
import { Menu, X, Phone, Mail, MapPin, Calendar, Users, Star, ChefHat, Sparkles, Clock, Award, Heart, Check } from 'lucide-react'
//import chef_cooking from "./assets/images/chef_cooking.jpg"
import MangoJuice from "./assets/images/MangoJuice.jpg"
import food_table from "./assets/images/food_table.jpg"
import fufu from "./assets/images/fufu.jpg"
import GhanaJollof from "./assets/images/GhanaJollof.jpg"
import GrilledChickenSalad from "./assets/images/GrilledChickenSalad.jpg"
import chips from "./assets/images/chips.jpg"
import fried_plaintain from "./assets/images/fried_plaintain.jpg"
import grilled_chicken from "./assets/images/grilled_chicken.jpg"
import pie from "./assets/images/pie.jpg"
import pineapple_juice from "./assets/images/pineapple_juice.jpg"
import samosa from "./assets/images/samosa.jpg"
import sobolo from "./assets/images/sobolo.jpg"
import springroll from "./assets/images/springroll.jpg"
import BankuandOkroSoup from "./assets/images/BankuandOkroSoup.jpg"
// import fried_rice_pinterest from "./assets/images/fried_rice_pinterest.jpg"
import fried_rice_upstash from "./assets/images/fried_rice_upstash.jpg"
import { supabase } from './supabaseClient'



// BookingModal Component
function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventDate: '',
    location: '',
    guestCount: '',
    eventType: 'wedding',
    specialRequests: '',
    honeypot: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hello! I'm interested in booking your catering services.\n\n` +
      `Name: ${formData.fullName || '[Your Name]'}\n` +
      `Event Type: ${formData.eventType}\n` +
      `Event Date: ${formData.eventDate || '[Date]'}\n` +
      `Location: ${formData.location || '[Location]'}\n` +
      `Guest Count: ${formData.guestCount || '[Number]'}\n` +
      `Special Requests: ${formData.specialRequests || 'None'}`
    )
    
    // Replace with your actual WhatsApp business number (format: country code + number, no + or spaces)
    const whatsappNumber = '0554953426'
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.honeypot) return;
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.eventDate ||
      !formData.location ||
      !formData.guestCount
    ) {
      setError("Please fill in all required fields");
      return;
    }
  
    setIsSubmitting(true);
    setError("");
  
    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            event_date: formData.eventDate,
            location: formData.location,
            guest_count: parseInt(formData.guestCount),
            special_requests: formData.specialRequests,
          },
        ]);
  
      if (error) throw error;
  
      console.log("Booking inserted successfully:", data);
      setShowSuccess(true);
        
  
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          eventDate: '',
          location: '',
          guestCount: '',
          eventType: 'wedding',
          specialRequests: '',
          honeypot: ''
        })
      }, 3000)
    } catch (err: any) {
      console.error('Supabase insert error:', err)
      setError('Failed to submit booking. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!isOpen) return null

  return (
    <>
      <style>{`
        .booking-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .booking-modal-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 900px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease-out;
          position: relative;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .booking-modal-header {
          padding: 32px 40px;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        
        .booking-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }
        
        .booking-close-button {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .booking-close-button:hover {
          background: #f5f5f5;
          color: #333;
        }
        
        .booking-modal-body {
          padding: 40px;
          overflow-y: auto;
          flex: 1;
        }
        
        .booking-modal-body::-webkit-scrollbar {
          width: 8px;
        }
        
        .booking-modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .booking-modal-body::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 10px;
        }
        
        .booking-modal-body::-webkit-scrollbar-thumb:hover {
          background: #b8960f;
        }
        
        .booking-success-container {
          text-align: center;
          padding: 60px 40px;
        }
        
        .booking-success-icon {
          width: 80px;
          height: 80px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        
        .booking-success-icon svg {
          color: #d4af37;
        }
        
        .booking-success-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }
        
        .booking-success-text {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
        }
        
        .booking-error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #dc2626;
          padding: 14px 16px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 24px;
        }
        
        .booking-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        
        @media (min-width: 640px) {
          .booking-form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .booking-form-full-width {
            grid-column: 1 / -1;
          }
        }
        
        .booking-form-group {
          display: flex;
          flex-direction: column;
        }
        
        .booking-form-label {
          font-weight: 600;
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
          font-family: 'Inter', sans-serif;
        }
        
        .booking-form-label .required {
          color: #d4af37;
          margin-left: 2px;
        }
        
        .booking-form-input,
        .booking-form-select,
        .booking-form-textarea {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e5e5e5;
          border-radius: 10px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          color: #333;
          transition: all 0.2s ease;
          background: white;
        }
        
        .booking-form-input:focus,
        .booking-form-select:focus,
        .booking-form-textarea:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
        
        .booking-form-input::placeholder,
        .booking-form-textarea::placeholder {
          color: #999;
        }
        
        .booking-form-textarea {
          min-height: 120px;
          resize: vertical;
          font-family: 'Inter', sans-serif;
        }
        
        .booking-form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }
        
        .booking-submit-button {
          width: 100%;
          padding: 16px 32px;
          background: #d4af37;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }
        
        .booking-submit-button:hover:not(:disabled) {
          background: #b8960f;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }
        
        .booking-submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .booking-submit-button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .booking-honeypot {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
        }
        
        @media (max-width: 640px) {
          .booking-modal-container {
            max-height: 90vh;
          }
          
          .booking-modal-header {
            padding: 24px;
          }
          
          .booking-modal-title {
            font-size: 24px;
          }
          
          .booking-modal-body {
            padding: 24px;
          }
          
          .booking-success-container {
            padding: 40px 24px;
          }
        }
      `}</style>

      <div className="booking-modal-overlay" onClick={onClose}>
        <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
        {showSuccess ? (
            <div className="booking-success-container">
              <div className="booking-success-icon">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="booking-success-title">Thank You!</h3>
              <p className="booking-success-text">
                Your booking request has been received successfully. We'll contact you shortly to confirm the details and discuss your event.
              </p>
              <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e5e5e5' }}>
                <p style={{ fontSize: '15px', color: '#666', marginBottom: '16px' }}>
                  Want to confirm your booking or discuss menu options?
                </p>
                <button
                  onClick={handleWhatsAppContact}
                  className="btn-whatsapp"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 28px',
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Message us on WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="booking-modal-header">
                <h2 className="booking-modal-title">Book Your Event</h2>
                <button onClick={onClose} className="booking-close-button" aria-label="Close modal">
                  <X size={24} />
                </button>
              </div>

              <div className="booking-modal-body">
                {error && (
                  <div className="booking-error-message">{error}</div>
                )}

                <div className="booking-form-grid">
                  <div className="booking-form-group">
                    <label className="booking-form-label">
                      Full Name<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="booking-form-input"
                      placeholder="Blaise Jondoh"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="booking-form-group">
                    <label className="booking-form-label">
                      Email<span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      className="booking-form-input"
                      placeholder="Blaise@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="booking-form-group">
                    <label className="booking-form-label">
                      Phone Number<span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className="booking-form-input"
                      placeholder="(+233) 123-456-7890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="booking-form-group">
                    <label className="booking-form-label">
                      Event Date<span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      className="booking-form-input"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="booking-form-group">
                    <label className="booking-form-label">
                      Location<span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="booking-form-input"
                      placeholder="City, Region"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="booking-form-group">
                    <label className="booking-form-label">
                      Number of Guests<span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      className="booking-form-input"
                      placeholder="50"
                      min="1"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="booking-form-group booking-form-full-width">
                    <label className="booking-form-label">
                      Event Type<span className="required">*</span>
                    </label>
                    <select
                      className="booking-form-select"
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      required
                    >
                      <option value="wedding">Wedding</option>
                      <option value="birthday">Birthday Party</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="booking-form-group booking-form-full-width">
                    <label className="booking-form-label">
                      Special Requests or Notes
                    </label>
                    <textarea
                      className="booking-form-textarea"
                      placeholder="Any dietary restrictions, theme preferences, or special requirements..."
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    />
                  </div>

                  <input
                    type="text"
                    className="booking-honeypot"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  <div className="booking-form-full-width">
                    <button
                      type="button"
                      className="booking-submit-button"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

// Main App Component
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        
        /* Navigation Styles */
        nav {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
          background: linear-gradient(135deg, #fdfbf7 0%, #ffffff 100%);
        }
        
        .hero-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          width: 100%;
        }
        
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }
        
        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.1fr 0.9fr;
            gap: 80px;
          }
        }
        
        .hero-content {
          animation: fadeInUp 0.8s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 50px;
          color: #d4af37;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 24px;
        }
        
        .hero-title {
          font-size: 42px;
          font-weight: 700;
          line-height: 1.2;
          color: #1a1a1a;
          margin-bottom: 24px;
        }
        
        @media (min-width: 768px) {
          .hero-title {
            font-size: 56px;
          }
        }
        
        @media (min-width: 1024px) {
          .hero-title {
            font-size: 64px;
          }
        }
        
        .hero-description {
          font-size: 18px;
          line-height: 1.8;
          color: #666;
          margin-bottom: 32px;
          max-width: 600px;
        }
        
        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 40px;
        }
        
        .btn-primary {
          padding: 16px 32px;
          background: #d4af37;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }
        
        .btn-primary:hover {
          background: #b8960f;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }
        
        .btn-secondary {
          padding: 16px 32px;
          background: white;
          color: #d4af37;
          border: 2px solid #d4af37;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
          background: #d4af37;
          color: white;
          transform: translateY(-2px);
        }
        
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #333;
          font-size: 15px;
        }
        
        .contact-item svg {
          color: #d4af37;
        }
        
        /* Hero Image */
        .hero-image-wrapper {
          position: relative;
          animation: fadeInUp 1s ease-out 0.2s both;
        }
        
        .hero-image-container {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        .hero-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .stats-badge {
          position: absolute;
          bottom: -20px;
          left: 30px;
          background: #d4af37;
          color: white;
          padding: 24px 32px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 767px) {
          .stats-badge {
            bottom: 20px;
            left: 20px;
            padding: 20px 24px;
          }
        }
        
        .stats-number {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        
        .stats-label {
          font-size: 14px;
          opacity: 0.95;
        }
        
        /* Services Section */
        .section {
          padding: 100px 24px;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 64px;
        }
        
        .section-title {
          font-size: 48px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
        }
        
        .section-subtitle {
          font-size: 18px;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          max-width: 1280px;
          margin: 0 auto;
        }
        
        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .service-card {
          background: white;
          border: 1px solid #f0f0f0;
          border-radius: 20px;
          padding: 40px 32px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border-color: #d4af37;
        }
        
        .service-icon {
          width: 64px;
          height: 64px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: #d4af37;
        }
        
        .service-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }
        
        .service-description {
          font-size: 15px;
          line-height: 1.7;
          color: #666;
          margin-bottom: 20px;
        }
        
        .service-link {
          color: #d4af37;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .service-link:hover {
          gap: 12px;
        }
        
        /* Menu Section */
        .menu-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          max-width: 1280px;
          margin: 0 auto 48px;
        }
        
        @media (min-width: 640px) {
          .menu-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .menu-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .menu-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }
        
        .menu-card:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
        }
        
        .menu-image {
          width: 100%;
          height: 220px;
          overflow: hidden;
        }
        
        .menu-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .menu-card:hover .menu-image img {
          transform: scale(1.1);
        }
        
        .menu-content {
          padding: 24px;
        }
        
        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .menu-category {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #d4af37;
          font-weight: 600;
        }
        
        .menu-price {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
        }
        
        .menu-name {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
        }
        
        /* Gallery */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          max-width: 1280px;
          margin: 0 auto;
        }
        
        @media (min-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .gallery-item {
          aspect-ratio: 1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .gallery-item:hover {
          transform: scale(1.05);
        }
        
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        /* Testimonials */
        .testimonials-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          max-width: 1280px;
          margin: 0 auto;
        }
        
        @media (min-width: 768px) {
          .testimonials-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .testimonial-card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          border: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }
        
        .testimonial-card:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
        }
        
        .rating {
          display: flex;
          gap: 4px;
          margin-bottom: 16px;
        }
        
        .rating svg {
          color: #d4af37;
          fill: #d4af37;
        }
        
        .testimonial-text {
          font-size: 15px;
          line-height: 1.7;
          color: #333;
          margin-bottom: 24px;
          font-style: italic;
        }
        
        .testimonial-author {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        
        .testimonial-event {
          font-size: 14px;
          color: #999;
        }
        
        /* CTA Section */
        .cta-section {
          background: #d4af37;
          padding: 100px 24px;
          text-align: center;
        }
        
        .cta-title {
          font-size: 48px;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
        }
        
        .cta-text {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 40px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .btn-cta {
          padding: 18px 40px;
          background: white;
          color: #d4af37;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        
        .btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }
        
        /* Footer */
        footer {
          background: #1a1a1a;
          color: white;
          padding: 80px 24px 40px;
        }
        
        .footer-content {
          max-width: 1280px;
          margin: 0 auto;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 24px;
          font-weight: 700;
        }
        
        .footer-text {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
        }
        
        .footer-title {
          font-weight: 600;
          margin-bottom: 20px;
          font-size: 18px;
        }
        
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .footer-link {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 15px;
        }
        
        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 32px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }
        
        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          padding: 24px;
          z-index: 40;
          animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mobile-menu-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .mobile-menu-link {
          padding: 12px;
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 16px;
        }
        
        .mobile-menu-link:hover {
          color: #d4af37;
        }
        
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav-btn { display: none !important; }
        }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ChefHat size={32} color="#d4af37" />
              <span className="font-serif" style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a' }}>
                Sky Lounge Catering Services
              </span>
            </div>

            {/* Desktop Menu */}
            <div style={{ display: 'none', gap: '32px', alignItems: 'center' }} className="desktop-nav">
              <button onClick={() => scrollToSection('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', fontWeight: '500', transition: 'color 0.2s' }}>Home</button>
              <button onClick={() => scrollToSection('services')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', fontWeight: '500', transition: 'color 0.2s' }}>Services</button>
              <button onClick={() => scrollToSection('menu')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', fontWeight: '500', transition: 'color 0.2s' }}>Menu</button>
              <button onClick={() => scrollToSection('gallery')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', fontWeight: '500', transition: 'color 0.2s' }}>Gallery</button>
              <button onClick={() => scrollToSection('testimonials')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333', fontWeight: '500', transition: 'color 0.2s' }}>Testimonials</button>
              <button onClick={() => setIsBookingOpen(true)} className="btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
                Book Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer' }}
              className="mobile-nav-btn"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-links">
            <button onClick={() => scrollToSection('home')} className="mobile-menu-link">Home</button>
            <button onClick={() => scrollToSection('services')} className="mobile-menu-link">Services</button>
            <button onClick={() => scrollToSection('menu')} className="mobile-menu-link">Menu</button>
            <button onClick={() => scrollToSection('gallery')} className="mobile-menu-link">Gallery</button>
            <button onClick={() => scrollToSection('testimonials')} className="mobile-menu-link">Testimonials</button>
            <button onClick={() => { setIsBookingOpen(true); setIsMenuOpen(false); }} className="btn-primary" style={{ width: '100%' }}>
              Book Now
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="badge">
                <Sparkles size={16} />
                Premium Catering Services
              </div>
              <h1 className="hero-title font-serif">
                Exquisite Culinary Experiences for Your Special Day
              </h1>
              <p className="hero-description">
                From intimate gatherings to grand celebrations, we craft unforgettable dining experiences with the finest ingredients and impeccable service.
              </p>
              <div className="button-group">
                <button onClick={() => setIsBookingOpen(true)} className="btn-primary">
                  Book Your Event
                </button>
                <button onClick={() => scrollToSection('menu')} className="btn-secondary">
                  View Menu
                </button>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <Phone size={20} />
                  <span>(+233) 055-495-3426</span>
                </div>
                <div className="contact-item">
                  <Mail size={20} />
                  <span>info@SkyLoungeCateringService.com</span>
                </div>
              </div>
            </div>
            
            <div className="hero-image-wrapper">
              <div className="hero-image-container">
                <img
                  src='https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/food_table.webp'
                  alt="Elegant table setting with gourmet food"
                />
              </div>
              <div className="stats-badge">
                <div className="stats-number">500+</div>
                <div className="stats-label">Events Catered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section" style={{ background: '#fafafa' }}>
        <div className="section-header">
          <h2 className="section-title font-serif">Our Services</h2>
          <p className="section-subtitle">Tailored catering solutions for every occasion</p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <Heart size={32} />
            </div>
            <h3 className="service-title font-serif">Wedding Catering</h3>
            <p className="service-description">
              Create magical moments with our bespoke wedding menus and elegant presentation
            </p>
            <button onClick={() => setIsBookingOpen(true)} className="service-link">
              Learn More →
            </button>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <Award size={32} />
            </div>
            <h3 className="service-title font-serif">Corporate Events</h3>
            <p className="service-description">
              Impress your clients and colleagues with professional catering for business gatherings
            </p>
            <button onClick={() => setIsBookingOpen(true)} className="service-link">
              Learn More →
            </button>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <Sparkles size={32} />
            </div>
            <h3 className="service-title font-serif">Private Parties</h3>
            <p className="service-description">
              Celebrate birthdays, anniversaries, and special occasions with customized menus
            </p>
            <button onClick={() => setIsBookingOpen(true)} className="service-link">
              Learn More →
            </button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="section">
        <div className="section-header">
          <h2 className="section-title font-serif">Our Menu</h2>
          <p className="section-subtitle">Carefully curated dishes made with the finest ingredients</p>
        </div>
        <div className="menu-grid">
          {[
            { name: 'Kelewele', category: 'Appetizers', price: 'GH₵15', image: 'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/fried_plaintain.webp' },
            { name: 'Jollof', category: 'Main Course', price: 'GH₵50', image: 'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/GhanaJollof.webp'},
            { name: 'Grilled chiken', category: 'Main Course', price: 'GH₵40', image: 'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/grilled_chicken.webp'},
            { name: 'Grilled chicken Salad', category: 'Salads', price: 'GH₵20', image: 'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/GrilledChickenSalad.webp' },
            { name: 'Sobolo', category: 'Desserts', price: 'GH₵10', image: 'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/sobolo.jpg' },
            { name: 'Chips', category: 'Desserts', price: 'GH₵10', image: 'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/chips.webp' }
          ].map((item, index) => (
            <div key={index} className="menu-card">
              <div className="menu-image">
                <img src={item.image} alt={item.name} loading='lazy'/>
              </div>
              <div className="menu-content">
                <div className="menu-header">
                  <span className="menu-category">{item.category}</span>
                  <span className="menu-price">{item.price}</span>
                </div>
                <h3 className="menu-name font-serif">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => setIsBookingOpen(true)} className="btn-primary" style={{ fontSize: '18px', padding: '18px 40px' }}>
            Request Custom Menu
          </button>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section" style={{ background: '#fafafa' }}>
        <div className="section-header">
          <h2 className="section-title font-serif">Gallery</h2>
          <p className="section-subtitle">A glimpse of our culinary artistry</p>
        </div>
        <div className="gallery-grid">
          {[
            'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/fried_rice_upstash.webp',
            'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/fufu.webp',
            'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/pie.webp',
            'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/pineapple_juice.jpg',
            'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/samosa.jpg',
            'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/BankuandOkroSoup.webp',
            'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/springroll.jpg',
            'https://jfayuevyftepnhjxajah.supabase.co/storage/v1/object/public/Sky-Lounge-Images/MangoJuice.webp'
          ].map((image, index) => (
            <div key={index} className="gallery-item">
              <img src={image} alt={`Gallery ${index + 1}`} loading='lazy' />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section">
        <div className="section-header">
          <h2 className="section-title font-serif">What Our Clients Say</h2>
          <p className="section-subtitle">Testimonials from satisfied customers</p>
        </div>
        <div className="testimonials-grid">
          {[
            {
              name: 'Sarah Arhin',
              event: 'Wedding Reception',
              text: 'The food was absolutely incredible! Every guest raved about the meal. The presentation was stunning and the service impeccable.',
              rating: 5
            },
            {
              name: 'Michael Frimpong',
              event: 'Corporate Event',
              text: 'Professional, punctual, and delicious. They made our corporate event a huge success. Highly recommend for business functions!',
              rating: 5
            },
            {
              name: 'Daniel Boateng',
              event: 'Birthday Party',
              text: 'From planning to execution, everything was perfect. The team was so accommodating with our dietary restrictions. Thank you!',
              rating: 5
            }
          ].map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div>
                <div className="testimonial-author">{testimonial.name}</div>
                <div className="testimonial-event">{testimonial.event}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title font-serif">Ready to Create Something Extraordinary?</h2>
        <p className="cta-text">
          Let us bring your culinary vision to life. Book a consultation today and let's start planning your perfect event.
        </p>
        <button onClick={() => setIsBookingOpen(true)} className="btn-cta">
          Book Your Event Now
        </button>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <ChefHat size={28} color="#d4af37" />
                <span className="font-serif">Sky Lounge Catering Services</span>
              </div>
              <p className="footer-text">
                Creating unforgettable culinary experiences for over a decade.
              </p>
            </div>
            <div>
              <h3 className="footer-title">Contact</h3>
              <div className="footer-links">
                <div className="footer-link">
                  <Phone size={18} />
                  <span>(+233) 055-495-3426</span>
                </div>
                <div className="footer-link">
                  <Mail size={18} />
                  <span>info@SkyLoungeCateringService.com</span>
                </div>
                <div className="footer-link">
                  <MapPin size={18} />
                  <span>Mallam - Gbawe</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="footer-title">Hours</h3>
              <div className="footer-links">
                <div className="footer-link">
                  <Clock size={18} />
                  <span>Monday - Friday: 8AM - 6PM</span>
                </div>
                <div className="footer-link">
                  <Clock size={18} />
                  <span>Saturday: 10AM - 5PM</span>
                </div>
                <div className="footer-link">
                  <Clock size={18} />
                  <span>Sunday: 12PM - 6PM</span>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Sky Lounge Cathering Services. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  )
}

export default App