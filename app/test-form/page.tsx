import { removeGuestAction } from '@/app/actions/guests'
import { getGuests } from '@/app/actions/guests'

export default async function TestFormPage() {
  const guests = await getGuests()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Form Actions</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Current Guests</h2>
        {guests.map(guest => (
          <div key={guest.id} className="flex items-center justify-between p-3 border rounded mb-2">
            <div>
              <div className="font-medium">{guest.name}</div>
              {guest.email && <div className="text-sm text-gray-500">{guest.email}</div>}
            </div>
            <form action={removeGuestAction}>
              <input type="hidden" name="id" value={guest.id} />
              <button 
                type="submit" 
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
