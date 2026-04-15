import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [batchId, setBatchId] = useState("")
  const navigate = useNavigate()

  const handleVerify = (e) => {
    e.preventDefault()
    if (batchId.trim()) {
      navigate(`/batch/${batchId.trim()}`)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-20 relative">
      <div className="absolute inset-0 -z-10 bg-primary/5 blur-[100px] rounded-full"></div>
      <Card className="border-border shadow-xl bg-card border">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-4xl mb-2 font-bold tracking-tight text-foreground">
            Verify Medicine <span className="text-primary">Authenticity</span>
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Enter the unique Batch ID provided on your medical package to verify its cryptographic timeline.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <Input 
              placeholder="e.g. 64b73b22..." 
              value={batchId} 
              onChange={(e) => setBatchId(e.target.value)}
              className="text-center text-lg h-14 bg-muted/30 focus:bg-background transition-all border-border shadow-inner"
            />
            <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold shadow-md hover:shadow-lg transition-all">Validate Chain</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
