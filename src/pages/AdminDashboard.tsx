import { useState, useEffect } from 'react'
import { LogOut, Calendar, Clock, MapPin, Users, Mail, Phone, CheckCircle, XCircle, AlertCircle, Eye, Search, Filter } from 'lucide-react'
import { supabase } from '../supabaseClient'

// Types
interface Booking {
  id: number
  full_name: string
  email: string
  phone: string
  event_date: string
  location: string
  guest_count: number
  special_requests: string | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
}

interface AuthUser {
  id: string
  email: string
}

// Login Component
function Login({ onLoginSuccess }: { onLoginSuccess: (user: AuthUser) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        onLoginSuccess({ id: data.user.id, email: data.user.email || '' })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '440px',
        padding: '48px 40px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
          }}>
            <Calendar size={40} color="white" />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '8px',
            fontFamily: "'Playfair Display', serif"
          }}>
            Admin Dashboard
          </h1>
          <p style={{ color: '#666', fontSize: '15px' }}>
            Sky Lounge Catering Services
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#dc2626',
            padding: '14px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@skyloungeservice.com"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e5e5e5',
                borderRadius: '10px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e5e5e5',
                borderRadius: '10px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Booking Detail Modal
function BookingDetailModal({ booking, onClose, onStatusChange }: {
  booking: Booking
  onClose: () => void
  onStatusChange: (id: number, status: string) => void
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981'
      case 'completed': return '#3b82f6'
      case 'cancelled': return '#ef4444'
      default: return '#f59e0b'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          padding: '32px',
          borderBottom: '1px solid #e5e5e5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a1a1a',
                marginBottom: '8px',
                fontFamily: "'Playfair Display', serif"
              }}>
                Booking Details
              </h2>
              <div style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: getStatusColor(booking.status) + '20',
                color: getStatusColor(booking.status),
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {booking.status}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e5e5e5'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Client Information
              </div>
              <div style={{
                background: '#f9fafb',
                padding: '20px',
                borderRadius: '12px'
              }}>
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} color="#667eea" />
                  <strong>{booking.full_name}</strong>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#666' }}>
                  <Mail size={18} color="#667eea" />
                  {booking.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#666' }}>
                  <Phone size={18} color="#667eea" />
                  {booking.phone}
                </div>
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                Event Details
              </div>
              <div style={{
                background: '#f9fafb',
                padding: '20px',
                borderRadius: '12px'
              }}>
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} color="#667eea" />
                  <div>
                    <strong>Event Date</strong>
                    <div style={{ color: '#666', fontSize: '15px', marginTop: '4px' }}>
                      {formatDate(booking.event_date)}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} color="#667eea" />
                  <div>
                    <strong>Location</strong>
                    <div style={{ color: '#666', fontSize: '15px', marginTop: '4px' }}>
                      {booking.location}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={18} color="#667eea" />
                  <div>
                    <strong>Guest Count</strong>
                    <div style={{ color: '#666', fontSize: '15px', marginTop: '4px' }}>
                      {booking.guest_count} guests
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {booking.special_requests && (
              <div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#999',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px'
                }}>
                  Special Requests
                </div>
                <div style={{
                  background: '#f9fafb',
                  padding: '20px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#666'
                }}>
                  {booking.special_requests}
                </div>
              </div>
            )}

            <div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#999',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px'
              }}>
                Update Status
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => onStatusChange(booking.id, status)}
                    disabled={booking.status === status}
                    style={{
                      padding: '14px',
                      background: booking.status === status ? getStatusColor(status) : 'white',
                      color: booking.status === status ? 'white' : '#666',
                      border: `2px solid ${getStatusColor(status)}`,
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: booking.status === status ? 'not-allowed' : 'pointer',
                      opacity: booking.status === status ? 1 : 0.8,
                      transition: 'all 0.2s ease',
                      textTransform: 'capitalize'
                    }}
                    onMouseEnter={(e) => {
                      if (booking.status !== status) {
                        e.currentTarget.style.background = getStatusColor(status)
                        e.currentTarget.style.color = 'white'
                        e.currentTarget.style.opacity = '1'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (booking.status !== status) {
                        e.currentTarget.style.background = 'white'
                        e.currentTarget.style.color = '#666'
                        e.currentTarget.style.opacity = '0.8'
                      }
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Component
function Dashboard({ user, onLogout }: { user: AuthUser, onLogout: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus as any } : b))
      setSelectedBooking(null)
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || booking.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={18} />
      case 'completed': return <CheckCircle size={18} />
      case 'cancelled': return <XCircle size={18} />
      default: return <Clock size={18} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981'
      case 'completed': return '#3b82f6'
      case 'cancelled': return '#ef4444'
      default: return '#f59e0b'
    }
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e5e5',
        padding: '20px 24px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '4px',
              fontFamily: "'Playfair Display', serif"
            }}>
              Bookings Dashboard
            </h1>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Logged in as {user.email}
            </p>
          </div>
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: '#f5f5f5',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#666',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ef4444'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f5f5f5'
              e.currentTarget.style.color = '#666'
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Bookings', value: stats.total, color: '#667eea' },
            { label: 'Pending', value: stats.pending, color: '#f59e0b' },
            { label: 'Confirmed', value: stats.confirmed, color: '#10b981' },
            { label: 'Completed', value: stats.completed, color: '#3b82f6' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid #e5e5e5'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: '700',
                color: stat.color
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e5e5e5',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '16px',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#999'
              }} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  border: '2px solid #e5e5e5',
                  borderRadius: '10px',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Filter size={20} color="#667eea" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '14px 16px',
                  border: '2px solid #e5e5e5',
                  borderRadius: '10px',
                  fontSize: '15px',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #e5e5e5',
          overflow: 'hidden'
        }}>
          {isLoading ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: '#999'
            }}>
              Loading bookings...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: '#999'
            }}>
              No bookings found
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e5e5' }}>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Client</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event Date</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Guests</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                    <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} style={{
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                          {booking.full_name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#999' }}>
                          {booking.email}
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', fontSize: '14px', color: '#666' }}>
                        {new Date(booking.event_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '20px 24px', fontSize: '14px', color: '#666' }}>
                        {booking.location}
                      </td>
                      <td style={{ padding: '20px 24px', fontSize: '14px', color: '#666' }}>
                        {booking.guest_count}
                      </td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          background: getStatusColor(booking.status) + '20',
                          color: getStatusColor(booking.status),
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 20px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#5568d3'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#667eea'
                            e.currentTarget.style.transform = 'translateY(0)'
                          }}
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}

// Main App Component
export default function AuthDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({ id: user.id, email: user.email || '' })
      }
    } catch (error) {
      console.error('Error checking auth:', error)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (isCheckingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f9fafb'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e5e5e5',
            borderTopColor: '#667eea',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ color: '#666', fontSize: '15px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={setUser} />
  )
}