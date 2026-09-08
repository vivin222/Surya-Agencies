# Surya Agencies — QR-Based Self-Service Ordering & Inventory System

> **Project Better Tomorrow — Project Review 1 Submission**  
> **Milestone Status:** Working Prototype & Core Architecture Implementation (~35% Completion)  
> **Live Production URL:** [https://surya-agencies.onrender.com](https://surya-agencies.onrender.com)

---

## 📌 1. Project Overview & Context

**Surya Agencies** is an authorized retail distributor and parlour for **Hatsun Agro Product Ltd** brands (including **Arun Icecreams** and **Hatsun Dairy Products**). This project introduces a modern, QR-based self-service ordering and inventory management system designed to eliminate queue bottlenecks and streamline retail store operations.

---

## 🚨 2. Problem Statement

In retail dairy and ice cream parlours like Surya Agencies, peak evening hours and weekend rushes create substantial operational bottlenecks:

1. **Sequential Queue Bottleneck:** 12 to 15 customers frequently queue up simultaneously while a single shopkeeper is forced to sequentially answer flavor/pack inquiries, physically check freezer inventory, pack items, calculate bills, and process payments.
2. **Customer Wait Times & Walkaways:** Inquiries about product availability require manual checks in deep freezers, leading to slow order processing, queue abandonment, and customer frustration.
3. **Inadequacy of Existing Alternatives:** 
   - *Traditional Point-of-Sale (POS) systems* only assist at the final billing stage and do not eliminate customer waiting or inquiry bottlenecks.
   - *WhatsApp / Phone ordering* requires constant manual communication from the shopkeeper during already packed counter hours.

---

## 💡 3. Proposed Solution

The **Surya Agencies Self-Service System** empowers customers to take charge of their ordering journey through a lightweight, scan-and-order Web App / PWA:

* **Customer Self-Service:** Customers scan a tabletop/counter QR code or open the web link to instantly browse live catalog items, verify current stock levels, configure their cart, pay via a valid UPI QR code, and receive a digital Order Token with a scannable Ticket QR.
* **Shopkeeper Operations Portal:** The shopkeeper receives real-time order notifications via WebSockets (Socket.io), scans the customer's Ticket QR with a built-in camera scanner, and fulfills orders efficiently with single-tap status updates.
* **Unified Inventory & Stock Tracking:** Real-time synchronization prevents overselling, tracks low-stock thresholds, and maintains separate online vs. walk-in stock counts.

---

## 🚀 4. Completed Modules & Features (Review-1 Status: ~35%)

The following functional modules have been fully implemented, integrated, and verified in the current working prototype:

### A. Customer Storefront & Ordering
* **Interactive Product Catalog:** 95+ branded products across Arun Icecreams (Cones, Cups, Bars, Tubs, Cakes, Novelties, Sundaes) and Hatsun Dairy (Milk, Curd, Paneer, Ghee, Butter, Flavoured Milk).
* **Category Navigation & Instant Search:** Filter by category chips and live full-text search across flavor names and descriptions.
* **Live Stock & Availability Badges:** Real-time stock indicators (`🟢 AVAILABLE`, `⚡ Only X left`, `🔴 OUT OF STOCK`, `🔴 NOT AVAILABLE`).
* **Shopping Cart & Local Persistence:** Multi-item cart management with quantity controls and automatic out-of-stock reconciliation.
* **Scannable UPI Payment QR:** Generates standardized UPI payment QR codes (`upi://pay?pa=...&pn=Surya%20Agencies&am=...`) scannable via Google Pay, PhonePe, Paytm, and BHIM, alongside counter cash options.
* **Digital Pickup Ticket & Token QR:** Instant order token generation with a unique scannable Ticket QR code linking to the customer's exact order.
* **5-Step Live Order Tracking:** Real-time visual order timeline (`Placed` ➔ `Accepted` ➔ `Preparing` ➔ `Ready for Pickup` ➔ `Completed`) synchronized live via WebSockets.

### B. Shopkeeper Operations & Inventory Management
* **Secure Shopkeeper Authentication:** Protected session portal for authorized staff (`surya_agencies`).
* **Live Orders Feed:** Real-time order dispatch board with order filtering (`All`, `New`, `Accepted`, `Preparing`, `Ready`, `Completed`) and audio chime alerts.
* **Optical Ticket QR Scanner:** In-app camera scanner powered by `Html5Qrcode` with environment camera auto-detection, fallback photo upload scanner, and manual Order Number search.
* **Inventory Control & Quick Steppers:** Inline `+1` / `-1` stock modifiers, low-stock minimum threshold settings, and 1-tap product availability toggles (`🟢 AVAILABLE` ↔ `🔴 NOT AVAILABLE`).
* **Product Catalog Management:** Add new products with custom pack sizes, cost prices, selling prices, and persistent product image uploads.
* **Business Analytics & Profit/Loss Reports:** Daily, weekly, and monthly revenue tracking, estimated net profit calculations, and payment method breakdowns (UPI vs. Cash) with dark-mode contrast optimization.

### C. System Architecture & Progressive Web App (PWA)
* **Real-Time Synchronization:** Bi-directional Socket.io WebSocket architecture broadcasting order creation, status changes, and stock updates.
* **Deterministic IST Timestamps:** All orders, notifications, and reports are recorded in server-side ISO 8601 UTC and rendered in **India Standard Time (IST — Asia/Kolkata)** across all devices.
* **PWA & Offline Capability:** Web App Manifest (`manifest.json`) and Service Worker (`sw.js`) enabling 1-tap installation on Android and Safari Home Screen support on iOS.
* **Persistent SQLite Database:** ACID-compliant SQLite storage with transaction rollbacks for inventory consistency.
* **Production Cloud Deployment:** Fully configured and live on Render.

---

## 🛠️ 5. Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, JavaScript (ES6+), Tailwind CSS | Responsive, mobile-first client application |
| **Styling & Theme** | Tailwind CSS CDN, Custom Glassmorphism CSS | Light and dark theme UI with high-contrast accessibility |
| **QR Code Engine** | `qrcode` (v1.5), `jsqr` (v1.4), `html5-qrcode` (v2.3) | Optical QR generation and camera-based ticket scanning |
| **Backend / Server** | Node.js, Express.js (v4.21) | RESTful API routing, image upload handling, and static file serving |
| **Real-Time Engine** | Socket.io (v4.8) | Bi-directional WebSocket communication for live orders and stock sync |
| **Database** | SQLite3 (v5.1) with Node driver | Persistent embedded relational database with transaction support |
| **File Uploads** | Multer (v1.4) | Multipart form processing for persistent product image storage |
| **PWA Layer** | Service Worker API, Web App Manifest | Caching and installable mobile home-screen experience |
| **Hosting & CI/CD** | Render Cloud Platform | Continuous deployment from GitHub `main` branch |

---

## 📊 6. Project Milestone & Review-1 Completion Status

This submission constitutes the **Review-1 Milestone (~35% Completion)** of Project Better Tomorrow.

| Milestone Phase | Target Progress | Status | Scope / Focus |
| :--- | :---: | :---: | :--- |
| **Review-1 (Current)** | **~35%** | ✅ **COMPLETED** | Functional prototype, core ordering flows, QR integration, inventory sync, live cloud deployment |
| **Field Testing & User Evaluation** | ~60% | ⏳ Next Phase | Real-world customer testing (≥3 users), usability feedback, queue time benchmarking |
| **Iterative Refinements & Analytics** | ~85% | ⏳ Next Phase | Feedback-driven UX improvements, inventory forecasting, edge-case optimization |
| **Final Review & Report** | 100% | ⏳ Final Phase | Comprehensive project validation report, metrics comparison, and final deliverable |

---

## 🔄 7. Core Workflows Demonstrable in Current Prototype

1. **Customer Self-Service Ordering Flow:**
   - User accesses `https://surya-agencies.onrender.com/#customer` (or scans parlour QR).
   - Selects category (e.g., Cones, Dairy, Family Tubs), adds items to cart.
   - Proceeds to checkout, scans UPI payment QR (or chooses cash at counter), and places order.
   - Receives digital Order Ticket (`#A022`) with scannable Ticket QR and live 5-step status timeline.
2. **Shopkeeper Order Reception & Fulfillment Flow:**
   - Shopkeeper logs into `https://surya-agencies.onrender.com/#shopkeeper`.
   - Receives instant audio chime and visual notification of incoming order.
   - Opens **Scan QR** modal, scans customer's Ticket QR using device camera, and inspects verified order items.
   - Advances order status (`Accepted` ➔ `Preparing` ➔ `Ready for Pickup` ➔ `Completed`).
3. **Real-Time Stock Synchronization Flow:**
   - When an order is placed, stock quantities immediately decrement across the store.
   - If stock hits `0`, product automatically transitions to `🔴 OUT OF STOCK` on all connected devices without page refresh.
   - Shopkeeper can toggle `🔴 NOT AVAILABLE` to immediately remove items from sale.

---

## 🔮 8. Pending Work & Next Steps (Post Review-1)

Following the Review-1 evaluation, project activities will focus on field deployment, user validation, and iterative refinement:

1. **On-Site User Testing:** Deploy and test the prototype on-site at Surya Agencies with at least 3 real customers during active business hours.
2. **Structured Feedback Collection:** Gather quantitative and qualitative feedback covering ordering speed, ease of navigation, and payment clarity.
3. **Queue Wait-Time Measurement:** Measure and benchmark average counter transaction and wait times before vs. after introducing self-service QR ordering.
4. **UX & Usability Optimizations:** Refine touch target sizing, scanner response speed, and low-connectivity resilience based on testing data.
5. **Final Prototype & Validation Report:** Compile a comprehensive validation report detailing experimental findings and system impact for final submission.

---

## 💻 9. Local Setup and Execution Instructions

### Prerequisites
* **Node.js** (v16.0.0 or higher)
* **npm** (v8.0.0 or higher)

### Installation & Startup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vivin222/Surya-Agencies.git
   cd Surya-Agencies
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application server:**
   ```bash
   npm start
   ```
   *(Or for local development with auto-reload: `npm run dev`)*

4. **Access the application:**
   * **Main Gateway:** `http://localhost:3000`
   * **Customer Store:** `http://localhost:3000/#customer`
   * **Shopkeeper Portal:** `http://localhost:3000/#shopkeeper`
     * *Demo Username:* `surya_agencies`
     * *Demo Password:* `suryaiceavi23`

5. **Run automated test suites:**
   ```bash
   npm test
   ```

---

## 🌐 10. Live Production Deployment

* **Production URL:** [https://surya-agencies.onrender.com](https://surya-agencies.onrender.com)
* **Customer Portal:** [https://surya-agencies.onrender.com/#customer](https://surya-agencies.onrender.com/#customer)
* **Shopkeeper Dashboard:** [https://surya-agencies.onrender.com/#shopkeeper](https://surya-agencies.onrender.com/#shopkeeper)
* **Hosting Provider:** Render Cloud Platform
* **Deployment Branch:** `main` (Automatic Continuous Deployment)

---

## 👥 11. Project Metadata

* **Project Title:** Surya Agencies — QR-Based Self-Service Ordering & Inventory System
* **Initiative:** Project Better Tomorrow
* **Milestone:** Project Review 1 (~35% Core Implementation)
* **Industry Domain:** Retail Dairy & Ice Cream Parlour Automation
* **Target Enterprise:** Surya Agencies (Authorized Hatsun & Arun Parlour)
