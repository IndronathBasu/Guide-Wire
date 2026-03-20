import type { EventData, Claim } from "../types";
import { Users, Shield, Activity, List, LayoutTemplate, Briefcase } from "lucide-react";

export function AdminDashboard({ events, claims }: { events: EventData[], claims: Claim[] }) {
  const totalDrivers = 5000;
  const activePolicies = 4200;
  const metrics = [
    { label: "Active Drivers", val: totalDrivers.toLocaleString(), icon: Users },
    { label: "Protected Nodes", val: activePolicies.toLocaleString(), icon: Shield },
    { label: "System Triggers", val: events.length.toString(), icon: Activity },
    { label: "Automated Disbursals", val: claims.filter(c => c.status === "PAID").length.toString(), icon: Briefcase }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header section typical of GitHub/Tech dashboards */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[var(--color-border-muted)]">
        <div>
          <h2 className="text-2xl font-semibold text-[var(--color-fg-default)] tracking-tight">System Operations</h2>
          <p className="text-sm text-[var(--color-fg-muted)] mt-1">Real-time parameters and disruption feeds</p>
        </div>
        <div className="mt-4 md:mt-0 px-3 py-1.5 bg-[#f6f8fa] tech-border rounded text-xs font-semibold text-[var(--color-fg-muted)] flex items-center gap-2">
          Engine Status: <div className="w-2 h-2 rounded-full bg-[#2da44e]"></div> Optimal
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white tech-border rounded-md p-4 flex flex-col items-start 
            shadow-sm hover:border-[var(--color-fg-muted)] transition-colors cursor-default">
            <div className="text-[var(--color-fg-muted)] mb-2 flex items-center justify-between w-full">
               <span className="text-xs font-semibold uppercase tracking-wide">{m.label}</span>
               <m.icon size={16} />
            </div>
            <div className="text-2xl font-bold text-[var(--color-fg-default)]">{m.val}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white tech-border rounded-md">
            <div className="px-4 py-3 bg-[var(--color-canvas-default)] border-b border-[var(--color-border-default)] rounded-t-md flex items-center gap-2">
              <List size={16} className="text-[var(--color-fg-muted)]" />
              <h3 className="text-sm font-semibold text-[var(--color-fg-default)]">Disbursement Ledger</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border-muted)] bg-white text-[var(--color-fg-muted)]">
                    <th className="py-2.5 px-4 font-normal text-xs uppercase">Claim Ref</th>
                    <th className="py-2.5 px-4 font-normal text-xs uppercase">Target Context</th>
                    <th className="py-2.5 px-4 font-normal text-xs uppercase">Factor Input</th>
                    <th className="py-2.5 px-4 font-normal text-xs uppercase text-right">Fund Value</th>
                    <th className="py-2.5 px-4 font-normal text-xs uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-muted)]">
                  {claims.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[var(--color-fg-muted)] text-sm italic">
                         No disruption events recorded during operational window.
                      </td>
                    </tr>
                  ) : (
                    claims.map((c) => (
                      <tr key={c.id} className="hover:bg-[#f6f8fa]">
                        <td className="py-2.5 px-4 text-xs font-mono text-[#0969da]">{c.id.split('-')[1]}</td>
                        <td className="py-2.5 px-4">
                           <div className="font-medium text-[var(--color-fg-default)]">{c.driverName}</div>
                           <div className="text-xs text-[var(--color-fg-muted)]">{c.zone} Node</div>
                        </td>
                        <td className="py-2.5 px-4">
                           <span className="bg-[#f0f3f6] tech-border px-2 py-0.5 rounded text-xs text-[var(--color-fg-default)] font-mono">{c.eventType}</span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-right text-[var(--color-fg-default)]">
                          ₹{c.payout.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                           <span className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
                              c.status === "PAID" ? "bg-[#dafbe1] text-[#1a7f37] border-[#2da44e]/30" :
                              c.status === "APPROVED" ? "bg-[#ddf4ff] text-[#0969da] border-[#0969da]/30" :
                              c.status === "REJECTED" ? "bg-[#ffebe9] text-[#cf222e] border-[#cf222e]/30" :
                              "bg-[#fff8c5] text-[#9a6c00] border-[#bf8700]/30"
                           }`}>
                             {c.status}
                           </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
           {/* Telemetry view */}
           <div className="bg-white tech-border rounded-md">
             <div className="px-4 py-3 bg-[var(--color-canvas-default)] border-b border-[var(--color-border-default)] rounded-t-md flex items-center gap-2">
                 <LayoutTemplate size={16} className="text-[var(--color-fg-muted)]" />
                 <h3 className="text-sm font-semibold text-[var(--color-fg-default)]">Sensor Telemetry</h3>
             </div>
             <div className="p-4 space-y-3 font-mono text-xs">
                 {events.length === 0 ? (
                    <div className="text-[var(--color-fg-muted)] p-4 border border-dashed border-[var(--color-border-muted)] rounded bg-[#f6f8fa] text-center">
                       Listening on default port 8080...
                    </div>
                 ) : (
                    <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2">
                      {events.map((ev, i) => (
                         <div key={i} className="bg-[#24292f] rounded p-3 text-gray-300 font-mono text-[11px] shadow-sm">
                            <span className="text-[#3fb950]">[INFO]</span> <span className="text-blue-400">{ev.timestamp.split('T')[1].split('.')[0]}</span> - SYSTEM_EVENT_RCYD <br/>
                            <span className="text-gray-400">► PARAM:</span> <span className="text-white">{ev.type}</span><br/>
                            <span className="text-gray-400">► TARGET:</span> {ev.zone} <br/>
                            <span className="text-gray-400">► ACTION:</span> EXECUTING MATRIX <br/>
                            <span className="text-[#a371f7]">► STATUS: OK</span>
                         </div>
                      ))}
                    </div>
                 )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
