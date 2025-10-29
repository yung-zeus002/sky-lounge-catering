// Mock blink client for development
export const blink = {
  db: {
    bookings: {
      create: async (data: any) => {
        console.log('Creating booking:', data)
        // In a real app, this would save to a database
        return { id: data.id, ...data }
      },
      list: async () => {
        console.log('Listing bookings')
        // In a real app, this would fetch from database
        return []
      },
      update: async (id: string, data: any) => {
        console.log('Updating booking:', id, data)
        // In a real app, this would update in database
        return { id, ...data }
      }
    }
  },
  notifications: {
    email: async (data: any) => {
      console.log('Sending email:', data)
      // In a real app, this would send an actual email
      return { success: true }
    }
  }
}
