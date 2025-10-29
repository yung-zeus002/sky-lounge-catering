import { useState } from 'react'
import { X } from 'lucide-react'
import { blink } from '../blink/client'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventDate: '',
    location: '',
    guestCount: '',
    eventType: 'wedding',
    specialRequests: '',
    honeypot: '' // Anti-spam field
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Honeypot check for spam
    if (formData.honeypot) {
      return
    }

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.eventDate || !formData.location || !formData.guestCount) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Create booking in database
      await blink.db.bookings.create({
        id: `booking_${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        eventDate: formData.eventDate,
        location: formData.location,
        guestCount: parseInt(formData.guestCount),
        eventType: formData.eventType,
        specialRequests: formData.specialRequests,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      // Send email notification to owner
      await blink.notifications.email({
        to: 'owner@catering.com', // Replace with actual owner email
        subject: `New Catering Booking - ${formData.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D4AF37;">New Catering Booking Request</h2>
            <div style="background: #F8F6F3; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${formData.fullName}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Phone:</strong> ${formData.phone}</p>
              <p><strong>Event Date:</strong> ${formData.eventDate}</p>
              <p><strong>Location:</strong> ${formData.location}</p>
              <p><strong>Number of Guests:</strong> ${formData.guestCount}</p>
              <p><strong>Event Type:</strong> ${formData.eventType}</p>
              ${formData.specialRequests ? `<p><strong>Special Requests:</strong> ${formData.specialRequests}</p>` : ''}
            </div>
            <p style="color: #666;">Please contact the customer to confirm details and discuss pricing.</p>
          </div>
        `,
        text: `New Catering Booking from ${formData.fullName}\n\nEmail: ${formData.email}\nPhone: ${formData.phone}\nEvent Date: ${formData.eventDate}\nLocation: ${formData.location}\nGuests: ${formData.guestCount}\nEvent Type: ${formData.eventType}\n${formData.specialRequests ? `Special Requests: ${formData.specialRequests}` : ''}`
      })

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
    } catch (err) {
      console.error('Booking error:', err)
      setError('Failed to submit booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {showSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Thank You!</h3>
            <p className="text-muted-foreground">Your booking has been received. We'll contact you shortly to confirm details.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-serif font-bold text-foreground">Book Your Event</h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="City, State"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Guests *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Event Type *</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Special Requests or Notes</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                  placeholder="Any dietary restrictions, theme preferences, or special requirements..."
                />
              </div>

              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default BookingModal
