import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../lib/api"
import { ShieldCheck, ShieldAlert, Link as LinkIcon, Clock, Box } from "lucide-react"

import { useAuth } from "../lib/AuthContext"

export default function BatchDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const [batch, setBatch] = useState(null)
  const [isValid, setIsValid] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBatchData()
  }, [id])

  const fetchBatchData = async () => {
    setLoading(true)
    try {
      const [batchRes, verifyRes] = await Promise.all([
        api.get(`/batches/${id}`),
        api.get(`/batches/${id}/verify`)
      ])
      setBatch(batchRes.data.data)
      setIsValid(verifyRes.data.isValid)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center mt-20 text-primary animate-pulse text-lg font-bold">Querying Ledger Nodes...</div>
  if (!batch) return <div className="text-center mt-20 text-destructive text-xl font-bold">Batch Not Found on Ledger</div>

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-card p-6 rounded-xl border shadow-sm border-border">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{batch.medicineName}</h1>
            <span className={`status-badge ${
                batch.status === 'SOLD' ? 'bg-success' : 'bg-info'
            }`}>
                {batch.status}
            </span>
          </div>
          <p className="text-muted-foreground font-mono text-sm border-l-2 pl-2 border-primary/30">Batch ID: {batch._id}</p>
          <div className="flex gap-2 mt-3">
            <p className="inline-flex items-center text-xs font-semibold bg-muted px-3 py-1.5 rounded-full gap-1 text-muted-foreground">
                <Box className="w-3 h-3" /> Mined by: {batch.manufacturer}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isValid ? (
            <div className="bg-success text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-md">
              <ShieldCheck className="w-5 h-5"/> Verified Authentic
            </div>
          ) : (
            <div className="bg-destructive text-white px-5 py-2.5 rounded-full flex items-center gap-2 font-bold shadow-md">
              <ShieldAlert className="w-5 h-5"/> Tampering Detected!
            </div>
          )}
          <div className="flex items-center gap-4 mt-2">
            {user?.role === 'Admin' && (
                <button onClick={async () => {
                if(confirm("Are you sure you want to silently edit the database block?")) {
                    await api.post(`/batches/${id}/tamper`, {});
                    fetchBatchData(); 
                }
                }} className="text-xs text-destructive hover:underline font-bold uppercase tracking-widest">
                Simulate Hack
                </button>
            )}
            <span className="text-xs text-muted-foreground font-mono font-medium">{batch.chain.length} Ledger Records</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-8 ml-4 flex items-center gap-2">
        <LinkIcon className="w-6 h-6 text-primary" /> Block Event Timeline
      </h2>
      
      <div className="relative border-l-2 border-primary/40 ml-8 pb-8 space-y-12">
        {batch.chain.map((block, i) => (
          <div key={block.hash} className="relative pl-10">
            <div className="absolute w-5 h-5 bg-background border-2 border-primary rounded-full -left-[11px] top-1.5 shadow-[0_0_12px_rgba(var(--primary),0.8)] flex items-center justify-center">
               <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            
            <div className="bg-card w-full rounded-lg border p-6 shadow-sm relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded-full font-bold shadow-md ring-4 ring-background">
                {block.index}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-primary mb-4 font-semibold pb-3 border-b border-border/50">
                <Clock className="w-4 h-4"/>
                {new Date(block.timestamp).toLocaleString()}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {Object.entries(block.data).map(([key, val]) => (
                   <div key={key} className="bg-background/80 rounded-md p-3 border border-border/50 group-hover:border-primary/30 transition-colors">
                     <span className="text-[11px] text-primary/80 uppercase font-bold tracking-widest block mb-1">{key}</span>
                     <span className="text-sm font-medium text-foreground">{val}</span>
                   </div>
                ))}
              </div>

              <div className="bg-background/50 rounded-md p-4 text-[13px] font-mono break-all space-y-3 border border-border/50 shadow-inner">
                <div className="flex gap-3 text-foreground/90">
                  <LinkIcon className="w-5 h-5 shrink-0 text-primary" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-0.5 tracking-wider">Current Block Hash</span>
                    {block.hash}
                  </div>
                </div>
                <div className="flex gap-3 text-muted-foreground border-t border-border/50 pt-3">
                   <LinkIcon className="w-5 h-5 shrink-0 opacity-50" />
                   <div>
                     <span className="text-[10px] uppercase font-bold block mb-0.5 tracking-wider">Previous Link Hash</span>
                     {block.previousHash}
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* End of chain indicator */}
        <div className="absolute w-3 h-3 bg-primary/40 rounded-full -left-[7px] bottom-0"></div>
      </div>
    </div>
  )
}
