import type { EventData, Claim } from "../types";
import { MOCK_DRIVERS } from "../mockData";
import { Wallet, ShieldCheck, AlertTriangle, AlertCircle, CheckCircle, FileText, Settings, User, MapPin } from "lucide-react";

export function DriverApp({ events, claims }: { events: EventData[], claims: Claim[] }) {
  const driver = MOCK_DRIVERS[0]; // Ravi Kumar
  const driverClaims = claims.filter(c => c.driverId === driver.id);
  const totalPayout = driverClaims.filter(c => c.status === "PAID").reduce((acc, c) => acc + c.payout, 0);

  return (
    <div className="flex justify-center items-start w-full min-h-[850px] font-sans antialiased bg-[#f6f8fa] py-10 rounded-2xl border border-[#d0d7de] shadow-inner">
      {/* Proper Phone Frame Container (iPhone 14/15 Pro style) */}
      <div className="w-[390px] h-[844px] bg-black rounded-[55px] p-[10px] shadow-2xl relative">
        {/* Hardware Buttons - Left/Right (Subtle accents on the outside) */}
        <div className="absolute top-[120px] -left-[3px] w-[3px] h-[30px] bg-gray-700 rounded-l-md"></div>
        <div className="absolute top-[170px] -left-[3px] w-[3px] h-[55px] bg-gray-700 rounded-l-md"></div>
        <div className="absolute top-[240px] -left-[3px] w-[3px] h-[55px] bg-gray-700 rounded-l-md"></div>
        <div className="absolute top-[190px] -right-[3px] w-[3px] h-[80px] bg-gray-700 rounded-r-md"></div>

        {/* The Screen itself */}
        <div className="w-full h-full bg-white rounded-[45px] overflow-hidden flex flex-col relative mask-image-phone">
          
          {/* Dynamic Island / Notch Area */}
          <div className="absolute top-0 inset-x-0 h-[35px] flex justify-center items-start pt-2 z-50">
            <div className="w-[120px] h-[30px] bg-black rounded-[20px] flex items-center justify-between px-2 shadow-sm">
               <div className="w-8 h-4"></div>
               {/* Camera lens reflection */}
               <div className="w-3 h-3 rounded-full bg-[#111] border border-[#222] mr-2 flex items-center justify-center">
                 <div className="w-1 h-1 rounded-full bg-blue-900/40"></div>
               </div>
            </div>
          </div>

          {/* Status Bar text overlaying the app */}
          <div className="absolute top-0 w-full px-7 pt-3.5 flex justify-between items-center text-[11px] font-semibold text-white mix-blend-difference z-40">
            <span>9:41</span>
            <div className="flex gap-1.5 items-center">
              <span className="w-4 h-2.5 border border-current rounded-[2px] relative"><span className="absolute left-[1px] top-[1px] w-[60%] h-1.5 bg-current rounded-[1px]"></span></span>
            </div>
          </div>

          {/* App Header (Behind Notch) */}
          <div className="bg-[#0f172a] text-white pt-12 pb-6 px-6 relative shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center font-bold text-sm shadow-inner border border-white/20">
                  RK
                </div>
                <div>
                  <h1 className="text-base font-semibold tracking-tight">{driver.name}</h1>
                  <p className="text-xs text-blue-200 flex items-center gap-1 mt-0.5"><MapPin size={10}/> {driver.zone} Region</p>
                </div>
              </div>
              <button className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center backdrop-blur-md">
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable Content inside the screen */}
          <div className="flex-1 overflow-y-auto bg-[#f8fafc] pb-24 hide-scrollbar">
            
            {/* Active Protection Card overlaid */}
            <div className="px-5 -mt-4 relative z-10">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Status</span>
                       <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mt-0.5">
                          <ShieldCheck size={16} className="text-emerald-500"/> Covered and Active
                       </h2>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-md font-medium border border-gray-100">
                      ₹{driver.weeklyPremium}/wk
                    </span>
                 </div>
                 
                 <div className="bg-gray-50 rounded-xl p-3 border border-gray-100/50 flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-semibold text-gray-500 mb-0.5">Coverage Limit</p>
                       <p className="text-lg font-bold text-gray-900">₹{(driver.weeklyIncome * driver.coveragePercent).toFixed(0)}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-gray-200"></div>
                    <div className="text-right">
                       <p className="text-[10px] font-semibold text-gray-500 mb-0.5">Guaranteed Limit</p>
                       <p className="text-lg font-bold text-emerald-600">{(driver.coveragePercent * 100)}%</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Financial Stash */}
            <div className="px-5 mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                 <Wallet size={16} className="text-blue-600" /> Disbursed Capital
              </h3>
              <div className="bg-gradient-to-br from-blue-600 to-[#1e3a8a] rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
                 <div className="absolute -right-4 -bottom-4 opacity-10"><Wallet size={100}/></div>
                 <p className="text-xs text-blue-200 font-medium mb-1">Total Auto-Credited</p>
                 <h2 className="text-4xl font-bold tracking-tight mb-2">₹{totalPayout.toFixed(2)}</h2>
                 <p className="text-[10px] text-blue-100 flex items-center gap-1 bg-white/10 w-fit px-2 py-1 rounded backdrop-blur-sm">
                   <CheckCircle size={10}/> Seamless routing active
                 </p>
              </div>
            </div>

            {/* Live Alerts Area */}
            <div className="px-5 mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                   <AlertTriangle size={16} className="text-rose-500" /> Sensor Network Alerts
                </h3>
              </div>
              
              <div className="space-y-3">
                {events.length === 0 ? (
                   <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                      <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400">
                         <ShieldCheck size={20}/>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Grid is stable.</p>
                      <p className="text-[10px] text-gray-400">No disruptions tracked currently.</p>
                   </div>
                ) : (
                  events.slice(0, 2).map((ev, i) => (
                    <div key={i} className="bg-white border border-rose-100 shadow-[0_2px_10px_rgba(225,29,72,0.05)] rounded-xl p-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-rose-600 text-sm flex items-center gap-1.5"><AlertCircle size={14}/> {ev.type.replace('_', ' ')}</span>
                        <span className="text-[9px] font-bold tracking-widest text-white bg-rose-500 px-1.5 py-0.5 rounded animate-pulse shadow-sm">LIVE</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Verified disruption inside <span className="font-semibold text-gray-900">{ev.zone}</span> grid.</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Auto Payout Logs */}
            <div className="px-5 mt-6 pb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                 <FileText size={16} className="text-gray-500" /> Recent Actions
              </h3>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 {driverClaims.length === 0 ? (
                   <div className="p-6 text-xs text-center text-gray-400 font-medium">
                      No automated actions taken yet.
                   </div>
                 ) : (
                   <div className="divide-y divide-gray-50">
                     {driverClaims.slice(0, 4).map((claim, i) => (
                       <div key={i} className="p-4 flex items-center justify-between">
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <span className="font-semibold text-gray-900 text-sm">{claim.eventType.replace('_', ' ')}</span>
                             <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                               claim.status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                             }`}>{claim.status}</span>
                           </div>
                           <p className="font-mono text-[10px] text-gray-400">{claim.id.split('-')[1]} • Algorithmic Claim</p>
                         </div>
                         <span className="font-bold text-gray-900">₹{claim.payout.toFixed(0)}</span>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            </div>

          </div>

          {/* iOS Bottom Navigation Bar */}
          <div className="absolute bottom-0 inset-x-0 h-[85px] bg-white/80 backdrop-blur-xl border-t border-gray-200/50 flex px-2 pt-2 pb-6 justify-around items-center z-20">
             <button className="flex flex-col items-center gap-1 text-blue-600 w-16">
               <ShieldCheck size={24} strokeWidth={2.5}/>
               <span className="text-[10px] font-semibold">Active</span>
             </button>
             <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors w-16">
               <Wallet size={24} strokeWidth={2}/>
               <span className="text-[10px] font-medium">Stash</span>
             </button>
             <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 transition-colors w-16">
               <User size={24} strokeWidth={2}/>
               <span className="text-[10px] font-medium">Profile</span>
             </button>
             
             {/* iOS Home Indicator */}
             <div className="absolute bottom-2 inset-x-0 mx-auto w-1/3 h-1 bg-gray-900 rounded-full"></div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
