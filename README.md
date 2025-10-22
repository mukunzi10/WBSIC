# WBSIC
#  Web-Based System for Insurance Companies (WBSIC)

A scalable **web application** for managing insurance company operations — including **customer management**, **policy handling**, **claims processing**, **billing**, and **analytics** — built with **Node.js** (backend) and **React.js** (frontend).  

This project also integrates a **complete DevOps pipeline** using **Docker**, **Jenkins**, **Kubernetes**, **Helm**, **GitHub Actions**, and **Ansible** to automate deployment and scaling.

---

##  Tech Stack

### Frontend
-  **React.js**
-  **Tailwind CSS / Material UI**
-   Axios for API calls
-   JWT Authentication

### Backend
-   **Node.js** with **Express**
-   **MongoDB** / PostgreSQL (configurable)
-   **Passport.js** for authentication
-    RESTful APIs

### DevOps & Infrastructure
-  **Docker** & **Docker Compose**
-  **Jenkins** CI/CD pipeline
- **Kubernetes** for container orchestration
-  **Helm** for release management
-  **Ansible** for infrastructure automation
-  **GitHub Actions** for CI/CD automation
-  **Jira** for project and sprint tracking

---

##  Project Structure

```bash
WBSIC/
├── client/                 # React.js frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/                 # Node.js backend
│   ├── src/
│   ├── routes/
│   ├── models/
│   └── package.json
│
├── docker-compose.yml      # Multi-container setup
├── Jenkinsfile             # Jenkins CI/CD pipeline
├── ansible/                # Ansible playbooks
├── helm-chart/             # Helm chart for Kubernetes deployment
├── kubernetes/             # Kubernetes manifests
└── README.md
```

---

## 🧩 Features by Group (Epics)

| Group | Epic | Description |
|-------|------|--------------|
| 1 | Customer & User Management | Register, login, profile management, and user roles |
| 2 | Policy Management | Create, update, and manage insurance policies |
| 3 | Claims Processing | File, track, and approve claims |
| 4 | Payments & Billing | Manage premium payments, invoices, and receipts |
| 5 | Reporting & Analytics Dashboard | Visualize metrics, reports, and insights |

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/wbsic.git
cd wbsic
```

### 2. Setup Backend
```bash
cd server
npm install
npm start
```

### 3. Setup Frontend
```bash
cd client
npm install
npm start
```

### 4. Run with Docker
```bash
docker-compose up --build
```

---

##  CI/CD Pipeline

- **GitHub Actions:** Automated testing and builds  
- **Jenkins:** Multi-stage deployment pipeline  
- **Docker Compose:** Multi-container development setup  
- **Kubernetes + Helm:** Scalable production deployment  
- **Ansible:** Automated server setup  

---

##   Project Management (Jira Integration)

- Create 5 **Epics** (one per group)
- Each Epic → at least **5 Tasks**
- Track progress and commits through **GitHub–Jira integration**

---

##  Contributors

| Group | Focus Area |
|-------|-------------|
| 1 | Customer & User Management |
| 2 | Policy Management |
| 3 | Claims Processing |
| 4 | Payments & Billing |
| 5 | Reporting & Analytics Dashboard |

---

##   Deliverables

- Jira board screenshots (Epics, Sprints, Tasks)
- GitHub repository setup
- Docker, Jenkins, and Kubernetes configuration screenshots
- Helm and Ansible automation proof