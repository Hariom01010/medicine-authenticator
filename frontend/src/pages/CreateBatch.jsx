import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../lib/api"
import { Copy, Check, ExternalLink, Download, Printer, RefreshCw, CheckCircle2 } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useAuth } from "../lib/AuthContext"

export default function CreateBatch() {
  const { user } = useAuth()
  const [medicineName, setMedicineName] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Success State
  const [createdBatchId, setCreatedBatchId] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post("/batches", {
        medicineName,
        manufacturer
      })
      
      setCreatedBatchId(res.data.data._id)
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

  const downloadQR = () => {
    const canvas = document.getElementById("batch-qr")
    if (canvas) {
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `QR_Batch_${createdBatchId}.png`
      link.href = url
      link.click()
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const resetForm = () => {
    setCreatedBatchId("")
  }

  if (createdBatchId) {
    const verificationUrl = `${window.location.origin}/batch/${createdBatchId}`

    return (
      <div className="max-w-md mx-auto mt-10 space-y-6 animate-in zoom-in-95 duration-500 print:shadow-none print:mt-0 p-4">
        <Card className="border-green-500/30 border-2 shadow-2xl bg-card print:border-none">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4 print:hidden">
              <div className="bg-green-500/10 p-3 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight">Genesis Block Mined!</CardTitle>
            <p className="text-muted-foreground text-sm">Medicine identity permanently etched on the ledger.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl flex flex-col items-center border border-border group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                 <button onClick={downloadQR} className="p-2 hover:bg-slate-200 rounded-lg" title="Save QR">
                    <Download className="w-4 h-4 text-slate-800" />
                 </button>
              </div>
              <QRCodeCanvas 
                id="batch-qr"
                value={verificationUrl}
                size={220}
                level="H"
                includeMargin={true}
                className="bg-white p-2 rounded-xl shadow-lg border border-slate-200"
              />
              <div className="mt-6 flex items-center justify-between w-full bg-white px-4 py-2 rounded-lg border border-slate-200 font-mono text-[10px] break-all">
                 <span className="text-slate-500 truncate mr-2">{createdBatchId}</span>
                 <button onClick={handleCopy} className="ml-auto text-primary">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 print:hidden">
              <Button onClick={downloadQR} variant="outline" className="h-11 font-bold shadow-sm gap-2">
                <Download className="w-4 h-4" /> Save Tag
              </Button>
              <Button onClick={handlePrint} variant="outline" className="h-11 font-bold shadow-sm gap-2">
                <Printer className="w-4 h-4" /> Print Label
              </Button>
            </div>

            <div className="space-y-2 pt-2 print:hidden">
              <Button onClick={() => navigate(`/batch/${createdBatchId}`)} className="w-full h-12 font-bold shadow-md gap-2">
                View Protocol Timeline <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="w-full text-muted-foreground gap-2" onClick={resetForm}>
                <RefreshCw className="w-4 h-4" /> Record New Batch
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3 text-[13px] text-primary/80 print:hidden">
            <div className="pt-0.5 font-bold">💡</div>
            <p>Scanning this QR code will bring anyone directly to the live verification timeline for this specific medicine batch.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="border-border shadow-xl">
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
            <Button disabled={loading} type="submit" className="mt-2 h-12 text-md font-bold shadow-md hover:shadow-lg transition-all">
              {loading ? "Mining Genesis Block..." : "Create Medicine Batch"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
