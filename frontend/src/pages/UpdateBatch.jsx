import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UpdateBatch() {
  const [batchId, setBatchId] = useState("")
  const [location, setLocation] = useState("")
  const [status, setStatus] = useState("")
  const [handler, setHandler] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updateData = {
        event: 'Transit Update',
        location,
        status,
        handler
      }
      const res = await axios.post(`http://localhost:5000/api/batches/${batchId}/update`, {
        updateData
      })
      navigate(`/batch/${batchId}`)
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-bold">Push Distribution Update</CardTitle>
          <p className="text-muted-foreground text-sm">Add a new hashed tracking block to the batch timeline.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Batch ID</label>
              <Input required value={batchId} onChange={e => setBatchId(e.target.value)} placeholder="Enter Batch ID..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Current Location</label>
              <Input required value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Regional Warehouse A" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Input required value={status} onChange={e => setStatus(e.target.value)} placeholder="e.g. In Transit, Delivered" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Handler Info</label>
              <Input required value={handler} onChange={e => setHandler(e.target.value)} placeholder="e.g. Logistics Ltd." />
            </div>
            <Button disabled={loading} type="submit" className="mt-2 h-12 text-md font-bold">
              {loading ? "Mining Block..." : "Push Cryptographic Update"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
