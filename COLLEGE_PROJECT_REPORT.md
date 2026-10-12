# 🎓 COLLEGE PROJECT REPORT & SYNOPSIS

## 1. Project Title
**BillMaster - An Integrated Java Full Stack Billing & Invoice System utilizing Fundamental Data Structures and Computer Organization Principles**

---

## 2. Project Overview & Abstract
The **BillMaster** system is an enterprise-grade full-stack billing application engineered to demonstrate core Computer Science principles including:
- **Backend Core**: Java 21 & Spring Boot 3.4 REST APIs.
- **Data Structures**: Hash Maps ($O(1)$ lookup), Linked Lists (Dynamic Cart Nodes), and Arrays (Batch Exports).
- **Computer Organization**: Multi-threaded parallel processing using Java thread pools and `CompletableFuture`.
- **Database Persistence**: Spring Data JPA with H2 in-memory database and MySQL support.
- **Frontend Layer**: React 19, Vite, and CSS3 with interactive 3-step billing workflow and invoice printing.

---

## 3. System Architecture & Modules

### A. Data Structures Implementation
1. **Hash Map (`ProductCatalogCache.java`)**: Provides $O(1)$ constant time complexity catalog search and caching.
2. **Linked List (`BillItemLinkedList.java`)**: Manages dynamic cart line items allowing node insertion, quantity modifications, deletion, and sequential traversal.
3. **Arrays**: Serves as line-item arrays for invoice printing and batch serialization.

### B. Computer Organization & Multi-threading
- **`MultiThreadedBillingEngine.java`**: Offloads subtotal, discount, and tax calculations across concurrent CPU worker threads.
- Tracks real-time thread pool size, memory utilization, and execution time in milliseconds.

### C. System Workflow (3 Steps)
- **Step 1**: Customer Registration & Cart Item Selection.
- **Step 2**: Total, Discount, and Tax Calculation with Multi-threading execution metrics.
- **Step 3**: Formatted Invoice Generation, Printing, and Transaction Logging.

---

## 4. Software Requirements & Tools
- **Operating System**: Windows / Linux / macOS
- **Language**: Java 21 (JDK 21)
- **Framework**: Spring Boot 3.4.2
- **Frontend UI**: React 19, Vite, Axios, CSS3
- **Database**: H2 Database (Embedded) / MySQL
- **Build Tools**: Maven (`mvnw`), npm

---

## 5. Live Project URLs
- **Web App Interface**: `http://localhost:5173`
- **Spring Boot REST APIs**: `http://localhost:8080/api`
- **Database Console**: `http://localhost:8080/h2-console`
