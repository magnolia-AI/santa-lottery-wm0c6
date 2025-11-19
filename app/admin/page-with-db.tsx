import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { getGuests, addGuestAction, removeGuestAction, toggleEligibilityAction, clearAllGuestsAction } from '@/app/actions/guests'

export default async function AdminPage() {
  const guests = await getGuests()

  return (
    <div className="min-h-full">
      <section className="container mx-auto px-4 pt-12 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Santa Picker Admin Panel
            </h1>
            <p className="text-muted-foreground">
              Manage your party guests and control who can be selected as Santa
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Guest Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Guest</CardTitle>
                <CardDescription>
                  Add guests to your Christmas party
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form action={addGuestAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter guest name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter guest email"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Add Guest
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Rigging Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Rigging Controls</CardTitle>
                <CardDescription>
                  Control who can be selected as Santa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Toggle eligibility for each guest. Only eligible guests can be selected as Santa.
                  </p>
                  
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {guests.length > 0 ? (
                      guests.map((guest) => (
                        <div 
                          key={guest.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <div className="font-medium">{guest.name}</div>
                            {guest.email && (
                              <div className="text-xs text-muted-foreground">{guest.email}</div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <form action={toggleEligibilityAction}>
                              <input type="hidden" name="id" value={guest.id} />
                              <Switch
                                checked={guest.isEligible}
                              />
                              <button type="submit" className="sr-only">
                                Toggle eligibility
                              </button>
                            </form>
                            <span className="text-xs w-16">
                              {guest.isEligible ? 'Eligible' : 'Excluded'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        No guests added yet. Add guests using the form.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guest List */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Current Guests ({guests.length})</CardTitle>
              <CardDescription>
                All guests in your party
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button variant="outline" asChild>
                  <Link href="/wheel">Back to Wheel</Link>
                </Button>
                <form action={clearAllGuestsAction}>
                  <Button 
                    variant="destructive" 
                    type="submit"
                    disabled={guests.length === 0}
                  >
                    Clear All Guests
                  </Button>
                </form>
              </div>
              
              {guests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {guests.map((guest) => (
                    <div 
                      key={guest.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <div className="font-medium">{guest.name}</div>
                        {guest.email && (
                          <div className="text-xs text-muted-foreground">{guest.email}</div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={guest.isEligible ? "default" : "secondary"}>
                          {guest.isEligible ? "Eligible" : "Not Eligible"}
                        </Badge>
                        <form action={removeGuestAction}>
                          <input type="hidden" name="id" value={guest.id} />
                          <Button 
                            variant="ghost" 
                            size="sm"
                            type="submit"
                          >
                            Remove
                          </Button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No guests added yet.</p>
                  <p className="text-sm mt-2">Use the form above to add guests to your party.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

