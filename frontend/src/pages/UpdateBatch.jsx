import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import api from "../lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "../lib/AuthContext"

export default function UpdateBatch() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [batchId, setBatchId] = useState(searchParams.get("id") || "")
  const [location, setLocation] = useState("")
  const [nextStatus, setNextStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Define allowed status options based on role
  const getStatusOptions = () => {
    switch (user?.role) {
      case 'Transporter':
        return [{ value: 'IN_TRANSIT', label: 'In Transit / Shipping' }]
      case 'Warehouse':
        return [{ value: 'WAREHOUSE', label: 'Received at Warehouse' }]
      case 'Pharmacist':
        return [
          { value: 'PHARMACY', label: 'Received at Pharmacy' },
          { value: 'SOLD', label: 'Final Sale to Customer' }
        ]
      default:
        return []
    }
  }

  const options = getStatusOptions()

  useEffect(() => {
    if (options.length > 0 && !nextStatus) {
      setNextStatus(options[0].value)
    }
  }, [options])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }
      
      const payload = {
        updateData: {
          location,
          notes,
          timestamp: new Date().toISOString()
        },
        nextStatus
      }

      await axios.post(`http://localhost:5000/api/batches/${batchId}/update`, payload, config)
      navigate(`/batch/${batchId}`)
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-bold">Industry Protocol Update</CardTitle>
          <p className="text-muted-foreground text-sm">Seal a new tracking block into the medicine lifecycle ledger.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Target Batch ID</label>
              <Input required value={batchId} onChange={e => setBatchId(e.target.value)} placeholder="Enter Batch ID..." className="font-mono" />
            </div>
            
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-xs text-primary font-bold uppercase mb-2">Executing Role: {user?.role}</p>
                <label className="text-sm font-medium mb-1 block">Blockchain Action</label>
                <select 
                    value={nextStatus} 
                    onChange={e => setNextStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Current Location</label>
              <Input required value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. JFK Airport, Warehouse B" />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Protocol Notes</label>
              <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Temperature checks, batch count, etc." />
            </div>

            <Button disabled={loading || options.length === 0} type="submit" className="mt-2 h-12 text-md font-bold hover:shadow-lg transition-all">
              {options.length === 0 ? "Role Not Authorized" : (loading ? "Hashing Protocol Block..." : "Sign & Push Update")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
