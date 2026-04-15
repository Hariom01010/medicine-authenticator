import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Copy, Check, ExternalLink } from "lucide-react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function CreateBatch() {
  const [medicineName, setMedicineName] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [createdBatchId, setCreatedBatchId] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/api/batches", {
        medicineName,
        manufacturer
      })
      
      setCreatedBatchId(res.data.data._id)
      setShowModal(true) // Show the modal instead of alert
      setMedicineName("")
      setManufacturer("")
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(createdBatchId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const proceedToTimeline = () => {
    navigate(`/batch/${createdBatchId}`)
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-bold">Mint New Batch</CardTitle>
          <p className="text-muted-foreground text-sm">Initialize a cryptographically secured medicine batch on the ledger.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block text-foreground">Medicine Name</label>
              <Input required value={medicineName} onChange={e => setMedicineName(e.target.value)} placeholder="e.g. Paracetamol 500mg" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-foreground">Manufacturer Name</label>
              <Input required value={manufacturer} onChange={e => setManufacturer(e.target.value)} placeholder="e.g. PharmaCorp Inc." />
            </div>
            <Button disabled={loading} type="submit" className="mt-2 h-12 text-md font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
              {loading ? "Mining Genesis Block..." : "Create Medicine Batch"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogHeader>
          <DialogTitle>Batch Successfully Mined! 🎉</DialogTitle>
          <DialogDescription>
            Your medicine batch is now firmly secured on the blockchain. Please copy the Batch ID below to attach future tracking updates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 my-4">
          <Input readOnly value={createdBatchId} className="font-mono bg-background text-primary" />
          <Button size="icon" onClick={handleCopy} className="shrink-0" variant="secondary">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button onClick={proceedToTimeline} className="gap-2">
            View Protocol Timeline <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
