/**
 * ============================================================================
 * NEETU PATEL - AZURE DEVOPS ENGINEER PORTFOLIO
 * Main JavaScript File (Interactive Terminal, Pipeline Simulation, Filters, Modals)
 * Beginner-friendly, well-commented, modular and vanilla ES6+
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingEffect();
  initTerminalSimulation();
  initSkillsFilter();
  initPipelineStageViewer();
  initProjectModals();
  initContactForm();
  initCopyEmail();
  initBackToTop();
});

/* ----------------------------------------------------------------------------
 * 1. NAVBAR & MOBILE DRAWER NAVIGATION
 * ---------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Toggle mobile menu drawer
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking any nav link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // Sticky navbar & Active ScrollSpy highlight
  window.addEventListener('scroll', () => {
    // Add scrolled class for glass background shadow
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let scrollPosition = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinkItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ----------------------------------------------------------------------------
 * 2. TYPING SUBTITLE EFFECT IN HERO SECTION
 * ---------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const roles = [
    'Azure DevOps Engineer',
    'Infrastructure as Code (IaC) Architect',
    'CI/CD Pipeline Specialist',
    'Docker & Kubernetes (AKS) Practitioner',
    'Cloud Observability & Security Advocate'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ----------------------------------------------------------------------------
 * 3. INTERACTIVE DEVOPS TERMINAL & PIPELINE SIMULATION
 * ---------------------------------------------------------------------------- */
function initTerminalSimulation() {
  const terminalBody = document.getElementById('terminal-logs');
  const rerunBtn = document.getElementById('btn-rerun-pipeline');
  const stepIndicators = document.querySelectorAll('.p-step');

  if (!terminalBody) return;

  const terminalSteps = [
    { text: '$ az login --identity', type: 'cmd', delay: 400 },
    { text: 'Authenticated to Azure Cloud (Subscription: Enterprise-Prod-01)', type: 'info', delay: 300 },
    { text: '$ terraform init -backend-config="storage_account=tfstatenp"', type: 'cmd', delay: 500 },
    { text: 'Initializing AzureRM provider v3.95.0...', type: 'output', delay: 400 },
    { text: 'Remote backend initialized in Azure Blob (lease-lock acquired).', type: 'info', delay: 300 },
    { text: '$ terraform apply -auto-approve tfplan.binary', type: 'cmd', delay: 600 },
    { text: 'azurerm_kubernetes_cluster.aks: Creating...', type: 'output', delay: 500 },
    { text: 'azurerm_key_vault_secret.app_creds: Provisioned in Azure Key Vault', type: 'purple', delay: 400 },
    { text: 'Apply complete! Resources: 18 added, 0 changed, 0 destroyed.', type: 'success', delay: 500, step: 0 },
    { text: '$ az acr build --registry crneetuprod --image patient-api:v2.4 .', type: 'cmd', delay: 600 },
    { text: 'Running Docker multi-stage container build... Succeeded.', type: 'info', delay: 500 },
    { text: 'Microsoft Defender image vulnerability scan: 0 Critical / 0 High.', type: 'success', delay: 400, step: 1 },
    { text: '$ helm upgrade --install patient-monitoring ./charts/healthcare --namespace prod', type: 'cmd', delay: 600 },
    { text: 'Release "patient-monitoring" upgraded in namespace "prod".', type: 'output', delay: 500 },
    { text: '$ kubectl rollout status deployment/patient-api -n prod', type: 'cmd', delay: 500 },
    { text: 'deployment "patient-api" successfully rolled out (3/3 pods ready).', type: 'success', delay: 500, step: 2 },
    { text: '$ az monitor metrics alert check --resource-group rg-healthcare-prod', type: 'cmd', delay: 500 },
    { text: 'Log Analytics heartbeat check: 200 OK | Telemetry live in Azure Monitor', type: 'success', delay: 400, step: 3 },
    { text: '🚀 Pipeline Execution Completed: Zero Downtime Deployment Success!', type: 'success-bold', delay: 200 }
  ];

  let currentTimeout = null;

  function runSimulation() {
    terminalBody.innerHTML = '';
    stepIndicators.forEach(step => {
      step.classList.remove('success');
      step.classList.remove('active');
    });

    if (stepIndicators[0]) stepIndicators[0].classList.add('active');

    let currentStepIndex = 0;

    function printLine(index) {
      if (index >= terminalSteps.length) return;

      const item = terminalSteps[index];
      const lineDiv = document.createElement('div');
      lineDiv.className = 'terminal-line';

      if (item.type === 'cmd') {
        lineDiv.innerHTML = `<span class="t-prompt">➜</span> <span class="t-cmd">${item.text}</span>`;
      } else if (item.type === 'info') {
        lineDiv.innerHTML = `<span class="t-info"><i class="fa-solid fa-cloud"></i> ${item.text}</span>`;
      } else if (item.type === 'purple') {
        lineDiv.innerHTML = `<span class="t-purple"><i class="fa-solid fa-key"></i> ${item.text}</span>`;
      } else if (item.type === 'success') {
        lineDiv.innerHTML = `<span class="t-success"><i class="fa-solid fa-circle-check"></i> ${item.text}</span>`;
      } else if (item.type === 'success-bold') {
        lineDiv.innerHTML = `<span class="t-success" style="font-weight: 700; background: rgba(16, 185, 129, 0.15); padding: 4px 8px; border-radius: 4px; display: block; margin-top: 6px;"><i class="fa-solid fa-rocket"></i> ${item.text}</span>`;
      } else {
        lineDiv.innerHTML = `<span class="t-output">${item.text}</span>`;
      }

      terminalBody.appendChild(lineDiv);
      terminalBody.scrollTop = terminalBody.scrollHeight;

      // Update pipeline stage badges
      if (item.step !== undefined && stepIndicators[item.step]) {
        stepIndicators[item.step].classList.remove('active');
        stepIndicators[item.step].classList.add('success');
        if (stepIndicators[item.step + 1]) {
          stepIndicators[item.step + 1].classList.add('active');
        }
      }

      currentTimeout = setTimeout(() => {
        printLine(index + 1);
      }, item.delay);
    }

    printLine(0);
  }

  // Initial auto run
  runSimulation();

  // Re-run on click
  if (rerunBtn) {
    rerunBtn.addEventListener('click', () => {
      clearTimeout(currentTimeout);
      runSimulation();
    });
  }
}

/* ----------------------------------------------------------------------------
 * 4. TECHNICAL SKILLS FILTER TABS
 * ---------------------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-controls .filter-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  if (!filterBtns.length || !skillCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ----------------------------------------------------------------------------
 * 5. INTERACTIVE PIPELINE ARCHITECTURE PLAYGROUND
 * ---------------------------------------------------------------------------- */
function initPipelineStageViewer() {
  const stageTabs = document.querySelectorAll('.stage-tab');
  const stageTitle = document.getElementById('stage-title');
  const stageDesc = document.getElementById('stage-desc');
  const stageList = document.getElementById('stage-features-list');
  const codeTitle = document.getElementById('code-filename');
  const codeContent = document.getElementById('code-snippet');

  if (!stageTabs.length || !stageTitle) return;

  const stageData = {
    gitops: {
      title: '1. GitOps & Version Control Strategy',
      desc: 'Enforcing trunk-based branching models, automated pull request validation policies, and signed commits for enterprise auditability.',
      features: [
        'GitHub protected branches requiring peer reviews & passing CI status checks',
        'Conventional commit standards and automated semantic version tagging',
        'Secure secrets scanning with GitGuardian preventing credential leaks'
      ],
      filename: 'azure-pipelines-pr.yml',
      code: `trigger:
  branches:
    include:
      - main
      - release/*
pr:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

stages:
- stage: PR_Validation
  displayName: 'PR Security & Linting Gate'
  jobs:
  - job: Validate
    steps:
    - script: |
        echo "Running security scans & commit linting..."
        tflint --recursive
      displayName: 'Static HCL Linting'`
    },
    build: {
      title: '2. Multi-Stage CI Pipeline & Containerization',
      desc: 'Building Docker container images with multi-stage builds, minimizing image footprints, and caching layers for ultra-fast builds under 10 minutes.',
      features: [
        'Multi-stage Dockerfile builds stripping build-time dependencies',
        'Automated unit testing with code coverage thresholds enforced',
        'Pushed directly to private Azure Container Registry (ACR) with sha tags'
      ],
      filename: 'Dockerfile.production',
      code: `# Multi-stage Build for Minimal Footprint
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production Runtime (Non-root user for security)
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S devops && adduser -S devops -G devops
USER devops
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
CMD ["node", "dist/server.js"]`
    },
    security: {
      title: '3. DevSecOps & Azure Key Vault Secrets',
      desc: 'Zero hardcoded secrets policy. All database strings, certificates, and API tokens dynamically injected via Azure Key Vault CSI Provider.',
      features: [
        'Trivy & Microsoft Defender vulnerability scanning for all container images',
        'Azure Managed Identities eliminating service principal credentials',
        'Automated Key Vault secret rotation with zero downtime impact'
      ],
      filename: 'secret-provider-class.yaml',
      code: `apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: azure-keyvault-secrets
  namespace: prod
spec:
  provider: azure
  parameters:
    usePodIdentity: "false"
    useVMManagedIdentity: "true"
    userAssignedIdentityID: "client-id-azure-identity"
    keyvaultName: "kv-patient-prod"
    objects: |
      array:
        - |
          objectName: sql-connection-string
          objectType: secret
        - |
          objectName: jwt-private-key
          objectType: secret
    tenantId: "azure-tenant-id-guid"`
    },
    iac: {
      title: '4. Modular Infrastructure as Code with Terraform',
      desc: 'Enterprise Terraform architecture with parameterized modules, isolated environment workspaces, and remote state lease locking in Azure Blob.',
      features: [
        'Hub-and-spoke virtual networking, subnets, and Network Security Groups (NSGs)',
        'Azure Blob Storage backend with state locking preventing race conditions',
        'Automated terraform plan reviews in Pull Requests prior to apply'
      ],
      filename: 'main.tf (Terraform AzureRM)',
      code: `terraform {
  required_version = ">= 1.5.0"
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state"
    storage_account_name = "tfstateneetupatel"
    container_name       = "tfstate"
    key                  = "prod.infrastructure.tfstate"
  }
}

provider "azurerm" {
  features {}
}

module "aks_cluster" {
  source              = "./modules/aks"
  cluster_name        = "aks-neetu-prod"
  resource_group_name = azurerm_resource_group.rg.name
  location            = "East US"
  node_count          = 3
  vm_size             = "Standard_D4s_v5"
  enable_auto_scaling = true
}`
    },
    aks: {
      title: '5. High Availability Kubernetes (AKS) Deployment',
      desc: 'Orchestrating microservices with Helm, Horizontal Pod Autoscaling (HPA) responding to traffic surges, and NGINX Ingress with TLS.',
      features: [
        'Horizontal Pod Autoscaling (HPA) targeting CPU and memory thresholds',
        'NGINX Ingress Controller with automatic Let\'s Encrypt SSL/TLS certificates',
        'Liveness and readiness probes guaranteeing zero-downtime rolling deploys'
      ],
      filename: 'deployment-hpa.yaml',
      code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: patient-api-hpa
  namespace: prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: patient-api
  minReplicas: 3
  maxReplicas: 15
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
---
# Rolling Update Strategy for Zero Downtime
spec:
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0`
    },
    observability: {
      title: '6. Azure Monitor, Log Analytics & Telemetry',
      desc: 'Centralized observability using Azure Log Analytics, Application Insights distributed tracing, and automated KQL metric alerts.',
      features: [
        'KQL queries detecting 5xx response surges and abnormal pod restarts',
        'Azure Container Insights scraping Prometheus metrics from AKS clusters',
        'Automated Action Groups notifying on-call engineers via Slack and PagerDuty'
      ],
      filename: 'alerts.kql (Log Analytics Query)',
      code: `// KQL Alert: Detect Microservice HTTP Error Rates > 1%
KubePodInventory
| where Namespace == "prod"
| join kind=inner (
    AppRequests
    | where TimeGenerated >= ago(5m)
    | summarize 
        TotalRequests = count(),
        FailedRequests = countif(Success == false)
      by OperationName
) on $left.Name == $right.OperationName
| extend ErrorRate = (todouble(FailedRequests) / TotalRequests) * 100
| where ErrorRate > 1.0
| project OperationName, TotalRequests, FailedRequests, ErrorRate`
    }
  };

  stageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      stageTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const stageKey = tab.getAttribute('data-stage');
      const data = stageData[stageKey];

      if (!data) return;

      // Animate update
      stageTitle.textContent = data.title;
      stageDesc.textContent = data.desc;
      codeTitle.textContent = data.filename;
      codeContent.textContent = data.code;

      stageList.innerHTML = '';
      data.features.forEach(feat => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${feat}</span>`;
        stageList.appendChild(li);
      });
    });
  });
}

/* ----------------------------------------------------------------------------
 * 6. PROJECT DETAIL DEEP DIVE MODALS
 * ---------------------------------------------------------------------------- */
function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const openModalBtns = document.querySelectorAll('.open-project-modal');

  if (!modalBackdrop || !openModalBtns.length) return;

  const projectDetails = {
    healthcare: {
      title: 'Healthcare Patient Monitoring System on Microsoft Azure',
      category: 'Cloud Architecture & Healthcare IoT',
      image: 'assets/images/healthcare_azure.jpg',
      overview: 'A mission-critical patient monitoring system engineered on Azure that processes real-time vitals (heart rate, SpO2, respiratory trends) from medical wearables with zero latency data ingestion and strict HIPAA compliance.',
      challenge: 'Healthcare IoT hardware required high throughput ingestion of telemetry data while maintaining stringent data isolation, encryption in transit/at rest, and 99.99% system availability without costly unplanned downtime.',
      solution: 'Architected an end-to-end cloud pipeline using Azure IoT Hub, Stream Analytics, Azure Kubernetes Service (AKS), and Azure Cosmos DB for low-latency time-series queries. Enforced strict RBAC and cryptographic encryption with Azure Key Vault.',
      technologies: ['Microsoft Azure', 'AKS', 'Azure IoT Hub', 'Azure Key Vault', 'Terraform', 'Azure Monitor', 'Cosmos DB'],
      metrics: [
        { label: 'System Availability', value: '99.99%' },
        { label: 'Telemetry Ingestion Latency', value: '< 80 ms' },
        { label: 'Security Compliance', value: 'HIPAA & SOC 2' },
        { label: 'Active Monitored Patients', value: '10,000+' }
      ]
    },
    terraform: {
      title: 'Azure Infrastructure Automation using Terraform',
      category: 'Infrastructure as Code (IaC)',
      image: 'assets/images/terraform_automation.jpg',
      overview: 'Enterprise-grade Infrastructure as Code modular framework delivering automated, consistent, and audit-compliant provisioning of multi-region Azure cloud topologies.',
      challenge: 'Manual cloud configuration caused severe configuration drift across Development, Staging, and Production tiers, resulting in slow environment spin-ups and inconsistent security group settings.',
      solution: 'Developed an extensive suite of reusable Terraform modules for Hub-and-Spoke Virtual Networks, peering, Azure Firewall, Bastion, and AKS clusters. Configured remote backend in Azure Blob Storage with blob lease locking.',
      technologies: ['HashiCorp Terraform', 'Modular HCL', 'Azure Blob Storage', 'Terratest', 'GitHub Actions', 'Azure CLI'],
      metrics: [
        { label: 'Environment Spin-up Time', value: 'Reduced by 85%' },
        { label: 'Configuration Drift', value: 'Zero (100% IaC)' },
        { label: 'Managed Cloud Resources', value: '150+ Resources' },
        { label: 'Cloud Cost Optimization', value: '25% Monthly Savings' }
      ]
    },
    cicd: {
      title: 'Enterprise CI/CD Pipeline with Azure DevOps',
      category: 'CI/CD & DevOps Automation',
      image: 'assets/images/azure_cicd_pipeline.jpg',
      overview: 'End-to-end multi-stage YAML CI/CD pipeline in Azure DevOps integrating automated code linting, unit testing, SonarQube quality gates, Docker container compilation, and gated deployments to staging and production.',
      challenge: 'Manual release deployments resulted in frequent deployment failures, long approval cycles (over 45 minutes), and lack of standardized automated rollback mechanisms during failures.',
      solution: 'Constructed automated Azure DevOps Pipelines leveraging self-hosted Linux agents with Docker cache acceleration. Implemented environment approval gates, smoke testing stages, and automated rollback upon health check failure.',
      technologies: ['Azure DevOps', 'YAML Pipelines', 'Docker', 'Azure ACR', 'SonarQube', 'Linux Bash', 'Git'],
      metrics: [
        { label: 'Pipeline Execution Time', value: '12 mins (Down from 45m)' },
        { label: 'Deployment Frequency', value: '4x Daily Releases' },
        { label: 'Rollback Recovery Time', value: '< 90 seconds' },
        { label: 'Code Quality Coverage', value: '88% Test Coverage' }
      ]
    },
    kubernetes: {
      title: 'Kubernetes Application Deployment on Azure (AKS)',
      category: 'Containers & Cloud Orchestration',
      image: 'assets/images/kubernetes_aks.svg',
      overview: 'Production-ready Azure Kubernetes Service (AKS) microservices deployment featuring automated horizontal pod autoscaling, NGINX ingress routing, and secret management with Azure Key Vault CSI driver.',
      challenge: 'Microservices suffered from unpredictable traffic spikes during daytime peak hours and security vulnerabilities from plaintext configuration files.',
      solution: 'Packaged microservices into structured Helm charts, configured Horizontal Pod Autoscaling (HPA) to scale pods based on CPU/Memory metrics, and integrated Azure Key Vault CSI driver to dynamically project secrets into pods.',
      technologies: ['Kubernetes (AKS)', 'Docker', 'Helm Charts', 'NGINX Ingress', 'Azure Key Vault CSI', 'Azure Container Insights'],
      metrics: [
        { label: 'Autoscaling Response Time', value: '< 45 seconds' },
        { label: 'Deployment Strategy', value: 'Zero-Downtime Rolling' },
        { label: 'Vulnerability Rating', value: '0 Critical (Defender)' },
        { label: 'Cluster Health Score', value: '100% Uptime' }
      ]
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectKey = btn.getAttribute('data-project');
      const data = projectDetails[projectKey];

      if (!data) return;

      modalTitle.textContent = data.title;
      modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
          <img src="${data.image}" alt="${data.title}" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
        </div>

        <div style="display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap;">
          <span style="font-family: var(--font-code); font-size: 12px; color: var(--azure-cyan); background: rgba(0, 210, 255, 0.1); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(0, 210, 255, 0.25);">${data.category}</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 22px; background: rgba(15, 23, 42, 0.7); padding: 14px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.06);">
          ${data.metrics.map(m => `
            <div style="text-align: center;">
              <div style="font-family: var(--font-code); font-size: 15px; font-weight: 700; color: var(--azure-cyan);">${m.value}</div>
              <div style="font-size: 10.5px; color: var(--text-dim); text-transform: uppercase;">${m.label}</div>
            </div>
          `).join('')}
        </div>

        <h4 style="color: #fff; margin-bottom: 8px; font-size: 15px;"><i class="fa-solid fa-circle-info" style="color: var(--azure-cyan);"></i> Project Overview</h4>
        <p style="color: var(--text-muted); font-size: 13.5px; line-height: 1.6; margin-bottom: 18px;">${data.overview}</p>

        <h4 style="color: #fff; margin-bottom: 8px; font-size: 15px;"><i class="fa-solid fa-triangle-exclamation" style="color: var(--warning-amber);"></i> The Challenge</h4>
        <p style="color: var(--text-muted); font-size: 13.5px; line-height: 1.6; margin-bottom: 18px;">${data.challenge}</p>

        <h4 style="color: #fff; margin-bottom: 8px; font-size: 15px;"><i class="fa-solid fa-shield-check" style="color: var(--success-green);"></i> DevOps Solution</h4>
        <p style="color: var(--text-muted); font-size: 13.5px; line-height: 1.6; margin-bottom: 20px;">${data.solution}</p>

        <h4 style="color: #fff; margin-bottom: 10px; font-size: 14px;">Technology Stack</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
          ${data.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
          <a href="https://github.com/patelneetu10-stack" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
            <i class="fa-brands fa-github"></i> View GitHub Repo
          </a>
          <button onclick="document.getElementById('project-modal').classList.remove('active')" class="btn btn-primary btn-sm">
            Close Deep Dive
          </button>
        </div>
      `;

      modalBackdrop.classList.add('active');
    });
  });

  // Close modal on click of X or backdrop
  if (closeBtn) {
    closeBtn.addEventListener('click', () => modalBackdrop.classList.remove('active'));
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      modalBackdrop.classList.remove('active');
    }
  });
}

/* ----------------------------------------------------------------------------
 * 7. CONTACT FORM VALIDATION & TOAST
 * ---------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showFormStatus('Please fill in all required fields.', 'error');
      return;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormStatus('Please provide a valid email address.', 'error');
      return;
    }

    // Simulate sending message
    showFormStatus('Sending your message securely...', 'info');

    setTimeout(() => {
      contactForm.reset();
      showFormStatus(`Thank you, ${name}! Your message has been sent successfully to Neetu Patel. I will reply to ${email} shortly.`, 'success');
      showToast('Message sent to Neetu Patel!');
    }, 1000);
  });

  function showFormStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 7000);
    }
  }
}

/* ----------------------------------------------------------------------------
 * 8. COPY EMAIL TO CLIPBOARD WITH TOOLTIP
 * ---------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = 'patelneetu.devops@gmail.com';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(emailText).then(() => {
      showToast('Email address copied to clipboard!');
      copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--success-green);"></i> Copied';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
      }, 2500);
    }).catch(() => {
      showToast('Email: patelneetu.devops@gmail.com');
    });
  });
}

/* ----------------------------------------------------------------------------
 * 9. TOAST NOTIFICATION UTILITY
 * ---------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--azure-cyan);"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ----------------------------------------------------------------------------
 * 10. BACK TO TOP BUTTON
 * ---------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
