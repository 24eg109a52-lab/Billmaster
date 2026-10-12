# 🎓 BillMaster - Java Full Stack Integrated Project

**Networking Negus Integrated Project: BillMaster**  
*A Journey through Java and Data Structures for Efficient Billing*

---

## 📁 Project Directory Structure

```text
TT PROJECT (c:/TT/project/)
├── backend/                   # Java Spring Boot Backend API
│   ├── src/main/java/com/example/backend/
│   │   ├── config/            # Data Initializer & Spring Configurations
│   │   ├── controller/        # REST API Controllers (Bill, Product, Customer)
│   │   ├── ds/                # Core Data Structures & Multi-Threading Engine
│   │   │   ├── BillItemLinkedList.java      # Linked List Data Structure
│   │   │   ├── ProductCatalogCache.java     # Hash Map O(1) Cache Data Structure
│   │   │   └── MultiThreadedBillingEngine.java # Multi-threading Engine
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── entity/            # JPA Entities (Bill, BillItem, Customer, Product)
│   │   ├── enums/             # CustomerType & PaymentStatus Enums
│   │   ├── repository/        # Spring Data JPA Repositories
│   │   └── service/           # Business Logic Services
│   ├── pom.xml                # Maven Dependencies (Spring Boot 3.4, H2, Data JPA)
│   └── mvnw.cmd               # Maven Wrapper Script
│
└── frontend/                  # React + Vite Frontend UI
    ├── src/
    │   ├── BillMaster.jsx     # Main Interactive Billing Studio UI
    │   ├── BillMaster.css     # Poster-themed Navy/Teal Responsive Styling
    │   ├── App.jsx            # Main React App & Router
    │   └── main.jsx           # Vite Entrypoint
    └── package.json           # Dependencies (React 19, Axios, Lucide Icons)
```

---

## 🚀 How to Run the Project for College Demonstration

### Prerequisites
- **Java**: Version 21 (or Java 17+)
- **Node.js**: Version 18+ & npm

---

### Step 1: Start the Java Spring Boot Backend Server

Open terminal in `c:\TT\project\backend`:

```bash
cd c:\TT\project\backend
.\mvnw.cmd spring-boot:run
```

- **Backend API Base URL**: `http://localhost:8080/api`
- **H2 In-Memory Database Console**: `http://localhost:8080/h2-console`
  - *JDBC URL*: `jdbc:h2:mem:billmasterdb`
  - *Username*: `sa`
  - *Password*: (leave empty)

---

### Step 2: Start the React Frontend Application

Open a second terminal in `c:\TT\project\frontend`:

```bash
cd c:\TT\project\frontend
npm run dev
```

- **Frontend App URL**: `http://localhost:5173`

---

## 🛠️ Tech Stack & Key Academic Highlights

| Tier | Technology | Purpose / Academic Concept |
| :--- | :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.4 | Core Programming & Web Framework |
| **Data Structures** | Custom Linked List, Hash Map, Arrays | Dynamic Cart, $O(1)$ Catalog Cache, Line Item Storage |
| **Computer Org.** | `CompletableFuture`, Thread Pools | Multi-threaded Parallel Discount & Tax Calculation |
| **Database** | Spring Data JPA, H2 / MySQL | Persistent Entities & Auto Database Seeding |
| **Frontend** | React 19, Vite, Axios, CSS3 | 3-Step Interactive Workflow UI & Printable Receipt |

---

## 📋 System Workflow (3 Steps)

1. **Step 1: Input Customer Information & Billed Items**
   - Customer details input.
   - Product selection from catalog cached in $O(1)$ Hash Map.
   - Dynamic item cart managed using **Linked List Nodes** (add, edit quantity, remove).
2. **Step 2: Calculate Total Amount**
   - Discount & Tax computation using **Multi-threaded Parallel Execution**.
   - Performance metrics display (execution time in milliseconds and active worker threads).
3. **Step 3: Generate & Finalize Bill**
   - Printable formatted invoice receipt generation.
   - Transaction confirmation and history logging.
