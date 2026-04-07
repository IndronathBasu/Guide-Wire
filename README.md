# 🚀 Aegesis

---

## 🏗️ 1. Tech Stack (Phase 2 MVP vs. Production Upgrade)

We are selecting an MVP tech stack that maps perfectly 1-to-1 with your final Day 90 startup stack, ensuring no throwaway code.

| Component | Phase 2 MVP (Now) | Startup Roadmap Upgrade Path (Day 31+) |
| :--- | :--- | :--- |
| **Frontend** | **React Native (Expo)** - Fast prototyping | **React Native (Bare Workflow)** - Native Swift/Kotlin for Aadhaar eKYC |
| **Backend** | **Python FastAPI** - Async speed, ML ready | **Dockerized FastAPI** on Kubernetes (AWS EKS) |
| **Database** | **SQLite** - Local, zero-config, portable | **Amazon RDS (PostgreSQL + PostGIS)** for massive geospatial scale |
| **AI / ML** | **Scikit-Learn (Local)** - 3 Python ML pipelines | **AWS SageMaker** - Nightly batch jobs & live inference |
| **Event Stream** | **FastAPI Background Tasks** | **Redis Streams (Amazon ElastiCache)** - Non-blocking queues |

---


### MVP Simulation Context

For the immediate Phase 2 executable codebase, this architecture simulates the following async flows:
1. **Client Device:** React Native app posts rider registration, hub assignment, and continuous GPS to the backend.
2. **API Layer:** FastAPI receives requests (simulating the future API Gateway).
3. **Trigger Simulation:** FastAPI exposes secure mock Webhook endpoints for all 4 triggers (IMD Rain, IMD Heat, News NLP, Platform Suspension).
4. **Geospatial Verification:** SQLite + Haversine formula handles the 2.5km radius logic (simulating PostGIS).
5. **DPDT Tracking:** Background task recalculates each rider's Delivery Percentage During Triggers weekly.
6. **Wallet Settlement:** Virtual wallet updates replace live Razorpay API calls for the 2-minute demo.

*Upgrade Note:* By using `async def` endpoints in FastAPI from Day 1, integrating Redis Streams in Month 2 will be a pure plug-and-play operation.

---

## 🔗 3. The Three AI Models & API Connectivity Architecture

This section details the direct data flow between the external plugins and the 3 core ML engines.


### The Three AI Models (Summary)

| # | Model Name | When It Runs | Input | Output | Formula |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Dynamic Premium Engine | Every Monday (Pre-Event) | Zone Risk, Environmental Forecast, Socio-Political Forecast, DPDT % | Weekly Premium (₹) | `Subtotal + [(100-DPDT)% × Subtotal]` |
| **2** | Payout Calculator | On Trigger Fire (Post-Event) | Hourly Wage, Duration, Severity, Zone Coverage % | Instant Payout (₹) | `(Wage × Hours × Severity) × Coverage%` |
| **3** | Fraud Defense | Before Every Payout | GPS Displacement, Device Meta, IP Clusters | Allow / Freeze (Boolean) | Isolation Forest Anomaly Score |

### The Four Connectivity Bridges

1. **The Pricing Bridge (Model 1 ↔ Forecast APIs):** Controls the flow of money *into* the pool. Model 1 fetches 7-day historical weather and socio-political risk aggregates from the **IMD + News plugins** and combines it with the rider's `historical_zone_risk_score` and `dpdt_pct` to output a dynamic weekly premium.
2. **The Verification Bridge (Trigger APIs → Geospatial Filter → Model 2):** When any of the 4 triggers fire, the system first runs a **Haversine distance check** (2.5km radius) against the trigger epicenter to identify only the Q-commerce riders who are actually affected. Model 2 then calculates the exact loss of income for each eligible rider.
3. **The Defense Bridge (Model 3 ↔ GPS Streams):** Protects money flowing *out*. The embedded `Scikit-Learn Isolation Forest` calculates an anomaly score using real-time GPS displacement (ensuring max jump remains < 1 km), 48-hour account age locks, and IP subnet clustering. A high score halts the payout.
4. **The Sustainability Bridge (Coverage % Filter):** After Model 3 approves a payout, the system applies a zone-based coverage cap (🟢 50%, 🟠 45%, 🔴 35%) to protect the ₹6.45 Cr liquidity pool from catastrophic Red Zone mass-payout events.

---

## 🔌 4. API Integration Flow

This specifies how we build the mock API data ingestion layer for the MVP so that it naturally unplugs to accept live data later.

### 1. Webhook Endpoints (Simulating 4 Push Triggers)
FastAPI exposes secure mock endpoints that simulate external APIs "pushing" disruption alerts:

| # | Endpoint | Trigger Type | Category |
| :--- | :--- | :--- | :--- |
| 1 | `/api/v1/webhooks/imd-weather` | Severe Rain / Flash Flood Alert | Cat A: Environmental |
| 2 | `/api/v1/webhooks/imd-heat` | Extreme Heatwave (>45°C) | Cat A: Environmental |
| 3 | `/api/v1/webhooks/news-disruption` | Transport Strike / Protest | Cat B: Socio-Political |
| 4 | `/api/v1/webhooks/platform-status` | Zepto/Blinkit App Suspension | Cat B: Platform |

### 2. JSON Payload Contracts
The backend expects precise JSON payloads to trigger Model 2. For example, the simulated **IMD Severe Weather Payload**:
```json
{
  "source": "imd_weather_api",
  "trigger_type": "SEVERE_FLOOD",
  "category": "ENVIRONMENTAL",
  "geo_fence": {
    "center_lat": 12.9121,
    "center_long": 77.6446,
    "radius_km": 2.5
  },
  "severity_multiplier": 1.0,
  "estimated_duration_hours": 3.5,
  "timestamp": "2026-03-31T18:00:00Z"
}
```

The simulated **Zepto App Suspension Payload** (The "Killer Feature"):
```json
{
  "source": "zepto_platform_oracle",
  "trigger_type": "APP_SUSPENSION",
  "category": "PLATFORM",
  "geo_fence": {
    "center_lat": 12.9352,
    "center_long": 77.6245,
    "radius_km": 5.0
  },
  "severity_multiplier": 1.2,
  "estimated_duration_hours": 2.0,
  "affected_pincode": "560034",
  "timestamp": "2026-03-31T20:30:00Z"
}
```

### 3. Integration Path
1. **MVP Execution:** You click a "Trigger Flood" or "Simulate App Suspension" button on the UI, which POSTs the JSON to the FastAPI webhook.
2. **Post-MVP Upgrade:** These mock endpoints get deleted, and the exact same JSON schemas are mapped to deployed Redis streams listening to live IMD, News, and Platform feeds.

---

## 🧠 6. AI Plan — Model 1: Dynamic Premium Engine

**Phase 2 Goal:** Demonstrate mathematical, hyper-local weekly pricing for Q-Commerce riders.

### The Formula
```
Subtotal = Base Premium (₹60) + Zone Penalty (₹0 / ₹24 / ₹45)
Final Weekly Premium = Subtotal + [ (100% - DPDT%) × Subtotal ]
```

### Input Features
| # | Feature | Type | Source |
| :--- | :--- | :--- | :--- |
| 1 | `historical_zone_risk_score` | Float (0.0 - 1.0) | PostGIS / SQLite grid analysis |
| 2 | `predictive_environmental_risk` | Float (0.0 - 1.0) | IMD Weather API (Cat A forecast) |
| 3 | `predictive_sociopolitical_risk` | Float (0.0 - 1.0) | News NLP + Platform Oracle (Cat B forecast) |
| 4 | `dpdt_pct` | Float (0.0 - 100.0) | Weekly recalculated behavioral metric |

### Zone Classification
| Zone | Condition | Penalty |
| :--- | :--- | :--- |
| 🟢 Green | Clear forecast + safe grid | +₹0 |
| 🟠 Orange | Moderate risk (heat/rain/isolated protests) | +₹24 |
| 🔴 Red | Severe floods, city-wide strikes, app suspensions expected | +₹45 |

### DPDT (Delivery Percentage During Triggers)
The unique behavioral metric that rewards hardworking riders:
* **Recalculated every week** — riders get a fresh chance to improve their score.
* A rider with **100% DPDT** pays the bare minimum (e.g., ₹84 for Orange Zone).
* A rider with **20% DPDT** pays significantly more (e.g., ₹151.20 for Orange Zone).
* **Formula:** `DPDT Penalty = (100% - DPDT%) × Subtotal`

### Example Calculations
| Rider | Zone | DPDT | Subtotal | Penalty | Final Premium |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Rider A (Hustler) | 🟠 Orange | 100% | ₹84 | ₹0 | **₹84.00** |
| Rider B (Average) | 🟠 Orange | 80% | ₹84 | ₹16.80 | **₹100.80** |
| Rider C (Fair-Weather) | 🟠 Orange | 20% | ₹84 | ₹67.20 | **₹151.20** |
| Rider D (Red Zone Hustler) | 🔴 Red | 90% | ₹105 | ₹10.50 | **₹115.50** |

---

## 💸 7. AI Plan — Model 2: Payout Calculator

**Phase 2 Goal:** Demonstrate zero-touch, income-based parametric payouts with geospatial precision.

### The Formula
```
Base Income Loss = (Historical Hourly Wage × Disruption Duration) × Severity Multiplier
Final Payout = Base Income Loss × Coverage Percentage
```

### The 4 Automated Triggers
| # | Trigger | Category | Threshold |
| :--- | :--- | :--- | :--- |
| 1 | IMD Severe Weather | Cat A: Environmental | > 60mm continuous rain or flash flood |
| 2 | IMD Extreme Heat | Cat A: Environmental | > 45°C urban temperature |
| 3 | News Sentiment NLP | Cat B: Socio-Political | "Transport Strike" / "Road Blockade" / "Protests" |
| 4 | Q-Commerce App Suspension | Cat B: Platform | Zepto/Blinkit orders suspended in a pincode |

### Geospatial Eligibility Filter (The 2.5km Radius)
When a trigger fires, **we do not pay everyone in the zone.** The system executes a Haversine distance check:
* Only riders whose GPS pings are within **2.5 km** of the disruption epicenter are eligible.
* Q-Commerce riders operate from fixed Dark Stores (Hubs), making this radius constraint extremely accurate.
* Exception: `APP_SUSPENSION_ORACLE` triggers may affect an entire pincode.

### Dynamic Coverage % (Sustainability Filter)
To protect the ₹6.45 Cr liquidity fund:
| Zone | Coverage % | Reason |
| :--- | :--- | :--- |
| 🟢 Green | **50%** | Low volume of simultaneous claims |
| 🟠 Orange | **45%** | Moderate claim density expected |
| 🔴 Red | **35%** | Catastrophic events affect thousands; must cap exposure |

### Example Calculations
| Rider | Hourly Wage | Duration | Severity | Base Loss | Zone | Coverage | **Final Payout** |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Rider A | ₹150/hr (Fri 8PM) | 3 hrs | 1.0x (Flood) | ₹450 | 🔴 Red | 35% | **₹157.50** |
| Rider B | ₹80/hr (Tue 11AM) | 3 hrs | 1.0x (Flood) | ₹240 | 🔴 Red | 35% | **₹84.00** |
| Rider C | ₹120/hr (Wed 6PM) | 2 hrs | 1.2x (Strike) | ₹288 | 🟠 Orange | 45% | **₹129.60** |
| Rider D | ₹100/hr (Mon 2PM) | 4 hrs | 1.5x (App Down) | ₹600 | 🟢 Green | 50% | **₹300.00** |

---

## 🛡️ 8. AI Plan — Model 3: Fraud Defense (Market Crash Engine)

**Phase 2 Goal:** Prove mathematically that the ₹6.45 Cr liquidity pool is safe from exploitation.

This is the crown jewel of Aegesis. The Phase 2 MVP must implement these three defense layers:

### Defense Layer 1: GPS Displacement Engine
* **Rule:** Must block teleportation.
* **MVP Code:** Verify that time elapsed and distance jumped do not exceed physical capabilities. Maximum jump radius threshold is strictly **1 km** to detect hyper-local anomalies.

### Defense Layer 2: The 48-Hour Immutable Time Lock
* **Rule:** You cannot buy a policy today and claim it today.
* **MVP Code:** Enforce a boolean in the SQLite DB that hard-rejects any payout if `account_age_hours < 48`.

### Defense Layer 3: Graph-Clustering IP Defense (The Syndicate Stop)
* **Rule:** Prevent 500 fake emulators from claiming simultaneously.
* **MVP Code:** When a trigger fires, parse the claim objects grouped by simulated IP subnets. If `count > N` per subnet, immediately flag and freeze the transaction cluster via the `model_3_fraud.py` Isolation Forest logic.

### Model 3 Output
| Anomaly Score | Decision | Action |
| :--- | :--- | :--- |
| < 0.6 | ✅ **APPROVED** | Payout proceeds to Coverage % Filter → Razorpay |
| ≥ 0.6 | 🚨 **FROZEN** | Transaction blocked, rider flagged for manual review |

---
