import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, Shield, Activity, FileText, BarChart2
} from "lucide-react";
import { AdminDashboard } from "./components/AdminDashboard";
import { DriverApp } from "./components/DriverApp";
import { WAREHOUSES, DRIVERS } from "./mockData";
import type { Claim, EventType, EventData } from "./types";

export default function App() {
  const [view, setView] = useState<"landing" | "driver" | "platform" | "admin">("landing");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; msg: string; type: "info" | "success" | "error" }[]>([]);

  const addNotification = (msg: string, type: "info" | "success" | "error" = "info") => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 5000);
  };

  const triggerEvent = (type: EventType, zone: string, dropPercent: number) => {
    const newEvent: EventData = { id: `EVT-${Date.now()}`, type, zone, dropPercent, timestamp: new Date().toISOString() };
    setEvents(prev => [newEvent, ...prev]);
    
    addNotification(`System Alert: ${type.replace("_", " ")} logic engaged in ${zone}.`, "error");

    setTimeout(() => {
      const affectedWarehouses = WAREHOUSES.filter((w) => w.zone === zone);
      const warehouseIds = affectedWarehouses.map((w) => w.id);
      const affectedDrivers = DRIVERS.filter((d) => warehouseIds.includes(d.warehouseId));
      
      const newClaims = affectedDrivers.map((driver) => {
        const loss = Math.round(driver.weeklyIncome * dropPercent);
        const payout = Math.round(loss * driver.coveragePercent);
        return {
          id: `CLM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          driverId: driver.id,
          driverName: driver.name,
          warehouseId: driver.warehouseId,
          eventId: newEvent.id,
          eventType: newEvent.type,
          zone: newEvent.zone,
          type: newEvent.type,
          loss,
          payout,
          status: driver.active ? "PENDING" : "REJECTED",
          timestamp: new Date().toISOString(),
        } as Claim;
      });

      setClaims((prev) => [...newClaims, ...prev]);

      const validClaims = newClaims.filter((c) => c.status !== "REJECTED");
      if (validClaims.length === 0) return;

      setTimeout(() => {
        setClaims((curr) => curr.map((c) => validClaims.find(vc => vc.id === c.id) ? { ...c, status: "APPROVED" } : c));
        setTimeout(() => {
          setClaims((curr) => curr.map((c) => validClaims.find(vc => vc.id === c.id) ? { ...c, status: "PAID" } : c));
          addNotification(`Disbursement finalized for ${type.replace("_", " ")} event.`, "success");
        }, 1200);
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas-default)] text-[var(--color-fg-default)] font-sans antialiased text-sm">
      {/* GLOBAL TECH NAVBAR - GitHub/LinkedIn Style */}
      <nav className="fixed top-0 w-full bg-[#24292f] text-white z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("landing")}>
              <Shield size={24} className="text-white" strokeWidth={2} />
              <span className="text-lg font-semibold tracking-tight">GigSure Platform</span>
            </div>
            
            <div className="hidden md:flex gap-1 ml-4 border-l border-gray-600 pl-4 h-6 items-center">
              {[ "landing", "driver", "platform", "admin" ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setView(tab as any)}
                  className={`px-3 py-1.5 font-medium rounded-md text-sm transition-colors ${
                    view === tab ? "text-white bg-white/10" : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab === "landing" ? "Overview" : tab === "driver" ? "Driver Portal" : tab === "platform" ? "Data Schema" : "Admin Operations"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
             <span className="text-xs text-gray-400 mr-2">Simulate Network Data:</span>
             <button onClick={() => triggerEvent("HEAVY_RAIN", "Whitefield", 0.4)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#0969da] hover:bg-[#0353a4] transition-colors border border-transparent">Rain</button>
             <button onClick={() => triggerEvent("HEATWAVE", "MG Road", 0.3)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#bf8700] hover:bg-[#9a6c00] transition-colors border border-transparent">Heat</button>
             <button onClick={() => triggerEvent("STRIKE", "Koramangala", 0.6)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#cf222e] hover:bg-[#a41e24] transition-colors border border-transparent">Strike</button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="pt-14 h-[calc(100vh)] overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {view === "landing" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white tech-border rounded-xl p-10 md:p-16 mb-8 mt-4 tech-shadow text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#24292f] mb-4">
                  Enterprise-Grade Parametric Coverage
                </h1>
                <p className="text-lg text-[#57606a] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                  Our B2B platform natively monitors hyperlocal disruptions and automatically triggers secure disbursements to gig partners through API integrations without manual claims.
                </p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setView("driver")} className="px-6 py-2.5 bg-[#0969da] text-white font-medium text-sm rounded-md hover:bg-[#0353a4] transition-colors flex items-center gap-2 shadow-sm">
                    View Driver Portal <ArrowRight size={16}/>
                  </button>
                  <button onClick={() => setView("admin")} className="px-6 py-2.5 bg-[#f6f8fa] text-[#24292f] font-medium text-sm rounded-md border border-[#d0d7de] hover:bg-[#f3f4f6] transition-colors shadow-sm">
                    Access Admin Center
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[ 
                  { title: "Zero Paperwork Protocol", desc: "Drivers are never required to file claims. Coverage is algorithmically processed based on integrated disruption feeds.", icon: FileText, color: "text-[#0969da]" },
                  { title: "Real-time Edge Rules", desc: "Local routing schemas map exactly to the nodes affected, allowing granular, localized action execution.", icon: Activity, color: "text-[#2da44e]" },
                  { title: "Automated Ledger", desc: "Every transaction is finalized and deposited strictly according to the payout parameters set in the master policy.", icon: BarChart2, color: "text-[#bf8700]" }
                ].map((f, i) => (
                  <div key={i} className="p-6 bg-white tech-border rounded-lg shadow-sm">
                    <div className="mb-4">
                      <f.icon size={24} className={f.color} strokeWidth={2} />
                    </div>
                    <h3 className="text-base font-semibold text-[#24292f] mb-2">{f.title}</h3>
                    <p className="text-sm text-[#57606a] leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "driver" && (
            <div className="animate-in fade-in duration-300 flex justify-center mt-4">
              <DriverApp events={events} claims={claims} />
            </div>
          )}

          {view === "platform" && (
            <div className="animate-in fade-in duration-300 mt-4 max-w-5xl mx-auto">
               <div className="bg-white tech-border rounded-xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-2">Platform Integration Data Schema</h2>
                  <p className="text-[var(--color-fg-muted)] mb-6 text-sm">Visualizing the real-time data flow connecting dark stores with active workforce identifiers.</p>
                  
                  <div className="rounded-lg border border-[var(--color-border-default)] overflow-hidden">
                    <table className="w-full text-left border-collapse bg-white">
                      <thead>
                        <tr className="bg-[var(--color-canvas-default)] border-b border-[var(--color-border-default)]">
                          <th className="py-2.5 px-4 text-xs font-semibold text-[var(--color-fg-muted)] uppercase tracking-wide">Warehouse Segment</th>
                          <th className="py-2.5 px-4 text-xs font-semibold text-[var(--color-fg-muted)] uppercase tracking-wide">Active Node/Zone</th>
                          <th className="py-2.5 px-4 text-xs font-semibold text-[var(--color-fg-muted)] uppercase tracking-wide">Platform Partner</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WAREHOUSES.map((w, i) => (
                           <tr key={i} className="border-b border-[var(--color-border-default)] hover:bg-[#f6f8fa] transition-colors">
                              <td className="py-3 px-4 text-sm font-mono text-[#0969da]">{w.id}</td>
                              <td className="py-3 px-4 text-sm text-[var(--color-fg-default)]">{w.zone}</td>
                              <td className="py-3 px-4 text-sm font-medium text-[var(--color-fg-default)]">{w.platform}</td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {view === "admin" && (
            <div className="animate-in fade-in duration-300 w-full h-full max-w-[1400px]">
               <AdminDashboard events={events} claims={claims} />
            </div>
          )}

        </div>
      </main>

      {/* SYSTEM TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-3 rounded shadow-lg border text-sm flex items-center gap-3 min-w-[300px] animate-in slide-in-from-bottom-5 fade-in duration-200 ${
              n.type === 'success' ? 'bg-[#2da44e] border-[#248d40] text-white' : 
              n.type === 'error' ? 'bg-[#cf222e] border-[#a41e24] text-white' : 
              'bg-[#24292f] border-[#1b1f24] text-white'
            }`}
          >
            {n.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            <span className="font-medium">{n.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
