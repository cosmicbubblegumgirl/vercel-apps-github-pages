(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const page = document.body.dataset.page || "home";

  const content = window.CTRL_ALT_DEFEAT_CONTENT;
  if (!content) {
    throw new Error("API-ocalypse content failed to load.");
  }

  const {
    APP,
    STORAGE_KEY,
    PASS_MARK,
    sourceLinks,
    moduleNav,
    roleOptions,
    adapterOptions,
    mappingOptions,
    policyOptions,
    securityTypes,
    rootCauseOptions,
    tutorialSteps,
    exams
  } = content;
  const learnerDb = window.CTRL_ALT_DEFEAT_DB;

  const checkLibrary = {
    visitCockpit: check("Opened the cockpit area", "Navigation", 5, (s) => s.visited.cockpit),
    visitDesign: check("Opened Cloud Integration design tools", "Navigation", 5, (s) => s.visited.design),
    visitSecurity: check("Opened security material tools", "Navigation", 5, (s) => s.visited.security),
    visitApis: check("Opened API Management tools", "Navigation", 5, (s) => s.visited.apis),
    visitEvents: check("Opened Event Mesh tools", "Navigation", 5, (s) => s.visited.events),
    visitMonitor: check("Opened monitoring tools", "Navigation", 5, (s) => s.visited.monitor),
    visitPartners: check("Opened partner onboarding tools", "Navigation", 5, (s) => s.visited.partners),
    capCloud: check("Cloud Integration capability is active", "Suite setup", 10, (s) => s.capabilities.cloudIntegration),
    capApi: check("API Management capability is active", "Suite setup", 10, (s) => s.capabilities.apiManagement),
    capEvent: check("Event Mesh capability is active", "Suite setup", 10, (s) => s.capabilities.eventMesh),
    roleIntegrationProvisioner: check("Integration provisioner role is assigned", "Security", 10, (s) => hasList(s.roles, "Integration_Provisioner")),
    roleApiAdmin: check("API administrator role is assigned", "Security", 10, (s) => hasList(s.roles, "APIPortal.Administrator")),
    roleEventAdmin: check("Event Mesh admin role is assigned", "Security", 10, (s) => hasList(s.roles, "EventMeshAdmin")),
    roleMessageSend: check("MessageSend role is assigned for sender access", "Security", 10, (s) => hasList(s.roles, "MessageSend")),
    openDiscovery: check("Business Accelerator Hub or reusable content catalog was opened", "Discovery", 10, (s) => s.discovery.acceleratorHub),
    createPackage: check("Relevant integration package is created", "Cloud Integration", 10, (s, e) => hasExpectedText(s.package.name, e.expected.package)),
    createIFlow: check("Relevant integration flow is created", "Cloud Integration", 10, (s, e) => hasExpectedText(s.iflow.name, e.expected.iflow)),
    senderAdapter: check("Correct sender adapter is selected", "Cloud Integration", 10, (s, e) => !e.expected.senderAdapter || s.iflow.senderAdapter === e.expected.senderAdapter),
    receiverAdapter: check("Correct receiver adapter is selected", "Cloud Integration", 10, (s, e) => !e.expected.receiverAdapter || s.iflow.receiverAdapter === e.expected.receiverAdapter),
    endpointPath: check("Inbound endpoint path is configured", "Cloud Integration", 8, (s) => String(s.iflow.endpoint || "").trim().startsWith("/")),
    contentModifier: check("Content modifier/header/property is configured for the scenario", "Cloud Integration", 10, (s, e) => {
      const text = `${s.iflow.headerName} ${s.iflow.headerValue} ${s.iflow.propertyName} ${s.iflow.propertyValue}`;
      return hasExpectedText(text, e.expected.content || "");
    }),
    messageMapping: check("Message Mapping is selected", "Mapping", 10, (s) => s.iflow.mappingType === "Message Mapping"),
    csvMapping: check("CSV-style mapping is selected", "Mapping", 10, (s) => s.iflow.mappingType === "CSV to XML" || s.iflow.mappingType === "Message Mapping"),
    xsltMapping: check("XSLT mapping is selected", "Mapping", 10, (s) => s.iflow.mappingType === "XSLT"),
    valueMapping: check("Value Mapping is selected", "Mapping", 10, (s) => s.iflow.mappingType === "Value Mapping" || s.iflow.valueMapping),
    groovyMapping: check("Groovy script enrichment is enabled", "Mapping", 10, (s) => s.iflow.scriptEnabled || s.iflow.mappingType === "Groovy Script"),
    ediMapping: check("EDI to XML mapping is selected", "B2B", 10, (s) => s.iflow.mappingType === "EDI to XML" || s.partner.ediMapping),
    xpathRouter: check("Router expression contains the required condition", "Cloud Integration", 10, (s, e) => hasExpectedText(s.iflow.routerExpression, e.expected.router || "xpath")),
    soapAsync: check("SOAP asynchronous handling is enabled", "Cloud Integration", 10, (s) => s.iflow.soapAsync),
    jmsQueue: check("JMS queue is named for the flow", "Operations", 10, (s, e) => hasExpectedText(s.iflow.jmsQueue, e.expected.queue || "queue")),
    scheduleSet: check("A schedule is configured", "Cloud Integration", 8, (s) => s.iflow.schedule && s.iflow.schedule !== "Manual"),
    exceptionSubprocess: check("Exception subprocess is enabled", "Error handling", 10, (s) => s.iflow.errorHandler === "Exception Subprocess"),
    deployIFlow: check("Integration flow is deployed", "Deployment", 10, (s) => s.iflow.deployed),
    traceEnabled: check("Trace is enabled for diagnosis", "Monitoring", 8, (s) => s.iflow.traceEnabled),
    oauthCredential: check("OAuth2 client credentials artifact exists", "Security", 10, (s, e) => hasSecurity(s, "OAuth2 Client Credentials", e.expected.credential)),
    userCredential: check("User credentials artifact exists", "Security", 10, (s, e) => hasSecurity(s, "User Credentials", e.expected.credential)),
    certificateImported: check("Certificate or key material is imported", "Security", 10, (s) => hasSecurity(s, "Certificate") || hasSecurity(s, "Key Pair")),
    keystoreAlias: check("Keystore alias is set", "Security", 8, (s) => String(s.security.keystoreAlias || "").trim().length > 1),
    accessPolicy: check("Access policy is configured", "Security", 10, (s) => String(s.security.accessPolicy || "").trim().length > 2),
    connectivityTest: check("Connectivity test succeeded", "Security", 10, (s) => s.security.connectivityTest),
    openConnectorCreated: check("Reusable third-party connector is created", "Connectivity", 10, (s) => String(s.connectors.crmName || "").trim().length > 2),
    createProvider: check("API provider is configured", "API Management", 10, (s) => String(s.api.providerName || "").trim().length > 2 && String(s.api.providerHost || "").trim().length > 4),
    createProxy: check("API proxy is configured", "API Management", 10, (s, e) => hasExpectedText(s.api.proxyName, e.expected.proxy)),
    proxyBasePath: check("Proxy base path is configured", "API Management", 8, (s, e) => hasExpectedText(s.api.basePath, e.expected.basePath || "") && String(s.api.basePath || "").trim().startsWith("/")),
    verifyApiKeyPolicy: check("Verify API Key policy is applied", "API Management", 10, (s) => hasList(s.api.policies, "Verify API Key")),
    oauthPolicy: check("OAuth policy is applied", "API Management", 10, (s) => hasList(s.api.policies, "OAuth 2.0")),
    quotaPolicy: check("Quota policy is applied", "API Management", 10, (s) => hasList(s.api.policies, "Quota")),
    spikeArrestPolicy: check("Spike Arrest policy is applied", "API Management", 10, (s) => hasList(s.api.policies, "Spike Arrest")),
    corsPolicy: check("CORS policy is applied", "API Management", 8, (s) => hasList(s.api.policies, "CORS")),
    performanceTracePolicy: check("Performance Traceability policy is applied", "API Management", 8, (s) => hasList(s.api.policies, "Performance Traceability")),
    publishProduct: check("API product is published", "API Management", 10, (s) => s.api.productPublished),
    versionProxy: check("API proxy version is maintained", "API Management", 8, (s) => String(s.api.version || "").trim().length > 1 && s.api.version !== "1.0"),
    apiMonitor: check("API monitor is opened", "Monitoring", 8, (s) => s.monitor.apiMonitorOpened),
    createQueue: check("Event Mesh queue is created", "Event Mesh", 10, (s, e) => hasExpectedText(s.event.queueName, e.expected.queue)),
    topicSubscription: check("Topic subscription is configured", "Event Mesh", 10, (s, e) => s.event.subscriptions.some((item) => hasExpectedText(item, e.expected.topic || ""))),
    serviceKey: check("Service key is created", "Event Mesh", 8, (s) => s.event.serviceKeyCreated),
    webhook: check("Webhook endpoint is configured", "Event Mesh", 8, (s) => String(s.event.webhookUrl || "").trim().startsWith("https://")),
    publishEvent: check("Test event is published", "Event Mesh", 10, (s) => s.event.testEventPublished),
    filterFailed: check("Message monitor is filtered to failed messages", "Monitoring", 8, (s) => s.monitor.statusFilter === "Failed"),
    filterCompleted: check("Message monitor is filtered to completed messages", "Monitoring", 5, (s) => s.monitor.statusFilter === "Completed"),
    openFailedMessage: check("Failed message processing log is opened", "Monitoring", 8, (s) => s.monitor.failedMessageOpened),
    viewTrace: check("Trace details are viewed", "Monitoring", 8, (s) => s.monitor.traceViewed),
    rootCauseSelected: check("Correct root cause is selected", "Monitoring", 10, (s, e) => !e.expected.rootCause || s.monitor.rootCause === e.expected.rootCause),
    retryMessage: check("Failed message is retried", "Monitoring", 10, (s) => s.monitor.retryDone),
    logAttachment: check("Diagnostic log attachment is added", "Monitoring", 8, (s) => s.monitor.logAttachment),
    dataStoreChecked: check("Data store is checked", "Operations", 8, (s) => s.monitor.dataStoreChecked),
    jmsMonitor: check("JMS queue monitor is checked", "Operations", 8, (s) => s.monitor.jmsChecked),
    lockCleared: check("Processing lock is cleared", "Operations", 8, (s) => s.monitor.lockCleared),
    partnerProfile: check("Partner profile is created", "B2B", 10, (s) => String(s.partner.name || "").trim().length > 2),
    partnerAgreement: check("Partner agreement is active", "B2B", 10, (s) => s.partner.agreementActive),
    partnerDirectory: check("Partner directory entry is maintained", "B2B", 8, (s) => String(s.partner.directoryKey || "").trim().length > 2)
  };

  let appState = normalizeState(loadState());
  let timer = null;

  document.addEventListener("DOMContentLoaded", () => {
    learnerDb?.init?.();
    syncAttemptsFromDb();
    render();
    bindEvents();
    timer = setInterval(updateTimer, 1000);
    requestAnimationFrame(() => document.body.classList.add("ready"));
  });

  function defaultWorkspace() {
    return {
      visited: {
        cockpit: true,
        design: false,
        security: false,
        apis: false,
        events: false,
        monitor: false,
        partners: false,
        coach: false
      },
      capabilities: {
        cloudIntegration: false,
        apiManagement: false,
        eventMesh: false,
        tradingPartner: false,
        integrationAdvisor: false
      },
      roles: [],
      discovery: {
        acceleratorHub: false,
        featureScope: false,
        learningJourney: false
      },
      package: {
        name: "",
        description: "",
        transport: "Draft"
      },
      iflow: {
        name: "",
        version: "1.0",
        endpoint: "",
        senderAdapter: "HTTPS",
        receiverAdapter: "OData",
        receiverAddress: "",
        schedule: "Manual",
        headerName: "",
        headerValue: "",
        propertyName: "",
        propertyValue: "",
        routerExpression: "",
        mappingType: "None",
        valueMapping: false,
        scriptEnabled: false,
        soapAsync: false,
        jmsQueue: "",
        errorHandler: "None",
        traceEnabled: false,
        deployed: false
      },
      security: {
        newType: "OAuth2 Client Credentials",
        newAlias: "",
        artifacts: [],
        keystoreAlias: "",
        accessPolicy: "",
        connectivityTarget: "",
        connectivityTest: false
      },
      api: {
        providerName: "",
        providerHost: "",
        proxyName: "",
        basePath: "",
        targetEndpoint: "",
        version: "1.0",
        policies: [],
        productName: "",
        productPublished: false
      },
      event: {
        queueName: "",
        newSubscription: "",
        subscriptions: [],
        serviceKeyCreated: false,
        webhookUrl: "",
        testEventPublished: false
      },
      monitor: {
        statusFilter: "All",
        artifactFilter: "",
        failedMessageOpened: false,
        traceViewed: false,
        rootCause: "Not selected",
        retryDone: false,
        logAttachment: false,
        dataStoreChecked: false,
        jmsChecked: false,
        lockCleared: false,
        apiMonitorOpened: false
      },
      partner: {
        name: "",
        directoryKey: "",
        agreementActive: false,
        ediMapping: false
      },
      connectors: {
        crmName: ""
      },
      notes: "",
      activity: []
    };
  }

  function normalizeState(saved) {
    const base = {
      view: "cockpit",
      currentExamId: exams[0].id,
      tutorialIndex: 0,
      tutorialOpen: true,
      startedAt: null,
      submitted: null,
      workspace: defaultWorkspace(),
      attempts: []
    };
    const next = saved && typeof saved === "object" ? { ...base, ...saved } : base;
    next.workspace = deepMerge(defaultWorkspace(), next.workspace || {});
    next.attempts = Array.isArray(next.attempts) ? next.attempts.slice(0, 30) : [];
    if (!exams.some((exam) => exam.id === next.currentExamId)) next.currentExamId = exams[0].id;
    if (!moduleNav.some((item) => item.id === next.view)) next.view = "cockpit";
    next.tutorialIndex = Number.isFinite(Number(next.tutorialIndex)) ? Number(next.tutorialIndex) : 0;
    next.tutorialOpen = next.tutorialOpen !== false;
    return next;
  }

  function syncAttemptsFromDb() {
    if (!learnerDb?.getAttempts) return;
    appState.attempts = learnerDb.getAttempts();
    appState.submitted = appState.attempts[0] || appState.submitted;
  }

  function bindEvents() {
    document.addEventListener("click", (event) => {
      const authTab = event.target.closest("[data-auth-tab]");
      if (authTab) {
        setAuthMode(authTab.dataset.authTab);
        return;
      }

      const tutorialButton = event.target.closest("[data-tutorial-step]");
      if (tutorialButton) {
        openTutorialStep(Number(tutorialButton.dataset.tutorialStep || 0));
        return;
      }

      const viewButton = event.target.closest("[data-view]");
      if (viewButton) {
        appState.view = viewButton.dataset.view;
        appState.workspace.visited[appState.view] = true;
        saveState();
        render();
        return;
      }

      const actionButton = event.target.closest("[data-action]");
      if (actionButton) {
        handleAction(actionButton.dataset.action, actionButton);
      }
    });

    document.addEventListener("change", handleFieldChange);
    document.addEventListener("input", handleFieldChange);
    document.addEventListener("submit", handleSubmit);
  }

  async function handleSubmit(event) {
    const form = event.target;
    if (!form.matches("[data-auth-form]")) return;

    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());

    try {
      if (form.dataset.authForm === "signup") {
        await learnerDb.signUp(values);
        toast("Local learner account created.");
      } else {
        await learnerDb.logIn(values);
        toast("Logged in.");
      }

      syncAttemptsFromDb();
      render();
    } catch (error) {
      toast(error.message || "Something went wrong.");
    }
  }

  function handleFieldChange(event) {
    const target = event.target;
    if (target.matches("[data-exam-select]")) {
      appState.currentExamId = target.value;
      appState.tutorialIndex = 0;
      appState.tutorialOpen = true;
      appState.startedAt = null;
      appState.submitted = null;
      appState.workspace = defaultWorkspace();
      pushActivity(`Loaded ${currentExam().title}`);
      saveState();
      render();
      return;
    }

    if (target.matches("[data-bind]")) {
      const value = target.type === "checkbox" ? target.checked : target.value;
      setPath(appState.workspace, target.dataset.bind, value);
      saveState();
      updateLiveProgress();
      return;
    }

    if (target.matches("[data-list]")) {
      const list = getPath(appState.workspace, target.dataset.list) || [];
      const value = target.value;
      const next = target.checked
        ? Array.from(new Set([...list, value]))
        : list.filter((item) => item !== value);
      setPath(appState.workspace, target.dataset.list, next);
      saveState();
      updateLiveProgress();
    }
  }

  function handleAction(action, source) {
    const workspace = appState.workspace;

    if (action === "toggle-tutorial") {
      appState.tutorialOpen = !appState.tutorialOpen;
      saveState();
      render();
      return;
    }

    if (action === "tutorial-prev") {
      setTutorialIndex(appState.tutorialIndex - 1);
      saveState();
      render();
      return;
    }

    if (action === "tutorial-next") {
      setTutorialIndex(appState.tutorialIndex + 1);
      saveState();
      render();
      return;
    }

    if (action === "tutorial-jump") {
      const step = currentTutorialStep();
      if (step?.view) {
        appState.view = step.view;
        workspace.visited[step.view] = true;
        pushActivity(`Opened tutorial module: ${step.title}`);
      }
      saveState();
      render();
      return;
    }

    if (action === "tutorial-apply") {
      const step = currentTutorialStep();
      if (step) {
        applyTutorialStep(step);
        appState.view = step.view;
        workspace.visited[step.view] = true;
        pushActivity(`Tutorial hint applied: ${step.title}`);
      }
      saveState();
      render();
      return;
    }

    if (action === "export-data") {
      exportLearnerData(source);
      return;
    }

    if (action === "logout") {
      learnerDb?.logOut?.();
      appState.submitted = null;
      syncAttemptsFromDb();
      saveState();
      toast("Logged out.");
      render();
      return;
    }

    if (action === "start") {
      appState.startedAt = Date.now();
      appState.submitted = null;
      pushActivity("Started timed practice");
      saveState();
      render();
      return;
    }

    if (action === "reset") {
      appState.startedAt = null;
      appState.submitted = null;
      appState.workspace = defaultWorkspace();
      appState.workspace.visited[appState.view] = true;
      pushActivity("Workspace reset");
      saveState();
      render();
      return;
    }

    if (action === "submit") {
      const attempt = gradeCurrentExam();
      const savedAttempt = learnerDb?.saveAttempt ? learnerDb.saveAttempt(attempt) : attempt;
      appState.submitted = savedAttempt;
      appState.attempts.unshift(savedAttempt);
      appState.attempts = appState.attempts.slice(0, 30);
      pushActivity(`Submitted ${currentExam().title} with ${attempt.score}%`);
      saveState();
      appState.view = "coach";
      appState.workspace.visited.coach = true;
      render();
      return;
    }

    if (action === "open-discovery") {
      workspace.discovery.acceleratorHub = true;
      workspace.discovery.learningJourney = true;
      pushActivity("Opened reusable content discovery");
    }

    if (action === "open-feature-scope") {
      workspace.discovery.featureScope = true;
      pushActivity("Reviewed feature scope");
    }

    if (action === "deploy-iflow") {
      workspace.iflow.deployed = true;
      workspace.package.transport = "Deployed";
      pushActivity("Deployed integration flow");
    }

    if (action === "run-connectivity") {
      workspace.security.connectivityTest = true;
      pushActivity("Connectivity test succeeded");
    }

    if (action === "add-security") {
      const alias = workspace.security.newAlias.trim() || `${workspace.security.newType} artifact`;
      workspace.security.artifacts.push({
        type: workspace.security.newType,
        alias,
        createdAt: new Date().toISOString()
      });
      workspace.security.newAlias = "";
      pushActivity(`Created security material: ${alias}`);
    }

    if (action === "publish-product") {
      workspace.api.productPublished = true;
      if (!workspace.api.productName.trim()) workspace.api.productName = `${workspace.api.proxyName || "Integration"} Product`;
      pushActivity("Published API product");
    }

    if (action === "open-api-monitor") {
      workspace.monitor.apiMonitorOpened = true;
      pushActivity("Opened API monitor");
    }

    if (action === "add-subscription") {
      const topic = workspace.event.newSubscription.trim();
      if (topic) {
        workspace.event.subscriptions.push(topic);
        workspace.event.newSubscription = "";
        pushActivity(`Added topic subscription: ${topic}`);
      }
    }

    if (action === "create-service-key") {
      workspace.event.serviceKeyCreated = true;
      pushActivity("Created Event Mesh service key");
    }

    if (action === "publish-event") {
      workspace.event.testEventPublished = true;
      pushActivity("Published test event");
    }

    if (action === "open-failed-message") {
      workspace.monitor.failedMessageOpened = true;
      pushActivity("Opened failed message processing log");
    }

    if (action === "view-trace") {
      workspace.monitor.traceViewed = true;
      pushActivity("Viewed trace details");
    }

    if (action === "retry-message") {
      workspace.monitor.retryDone = true;
      pushActivity("Retried failed message");
    }

    if (action === "attach-log") {
      workspace.monitor.logAttachment = true;
      pushActivity("Added diagnostic log attachment");
    }

    if (action === "check-datastore") {
      workspace.monitor.dataStoreChecked = true;
      pushActivity("Checked data stores");
    }

    if (action === "check-jms") {
      workspace.monitor.jmsChecked = true;
      pushActivity("Checked JMS queues");
    }

    if (action === "clear-lock") {
      workspace.monitor.lockCleared = true;
      pushActivity("Cleared processing lock");
    }

    if (action === "create-crm-connector") {
      if (!workspace.connectors.crmName.trim()) workspace.connectors.crmName = "CRM Sandbox Connector";
      pushActivity("Created CRM connector");
    }

    saveState();
    render();
  }

  function render() {
    const header = $("#siteHeader");
    const root = $("#appRoot");
    const footer = $("#siteFooter");
    if (!header || !root || !footer) return;

    header.innerHTML = renderHeader();
    root.innerHTML = page === "login" ? renderLoginPage() : renderSimulator();
    footer.innerHTML = renderFooter();
    if (page !== "login") {
      updateTimer();
      updateLiveProgress();
    }
  }

  function renderSimulator() {
    return `
      <div class="lab-layout">
        ${renderTaskPanel()}
        <section class="workspace-shell" aria-label="Simulation workspace">
          ${renderModuleTabs()}
          ${renderWorkspaceHeader()}
          ${appState.tutorialOpen ? renderTutorialStrip() : ""}
          ${renderWorkspace()}
        </section>
        ${renderCoachRail()}
      </div>
    `;
  }

  function renderHeader() {
    const user = learnerDb?.currentUser?.();
    return `
      <div class="top-shell">
        <a class="brand" href="./index.html" aria-label="${APP.name} home">
          <img src="./assets/logo.svg" alt="${APP.name}">
        </a>
        <div class="tenant-chip">
          <span>Subaccount</span>
          <strong>${APP.tenant}</strong>
        </div>
        <div class="top-actions">
          ${page === "login" ? `<a class="link-button" href="./index.html">Open simulator</a>` : ""}
          ${user ? `<span class="account-pill">${escapeHtml(user.name)}</span><button class="button quiet" type="button" data-action="logout">Log out</button>` : `<a class="link-button" href="./login.html">Log in</a>`}
          ${page !== "login" ? `<a class="link-button" href="#legal" data-view="coach">Legal notice</a><button class="button quiet" type="button" data-action="reset">Reset workspace</button>` : ""}
        </div>
      </div>
    `;
  }

  function renderLoginPage() {
    const user = learnerDb?.currentUser?.();
    return `
      <section class="login-shell">
        <div class="login-copy">
          <p class="eyebrow">Learner database</p>
          <h1>${user ? `Welcome back, ${escapeHtml(user.name)}.` : "Create your practice profile."}</h1>
          <p>Accounts are stored in this browser for GitHub Pages compatibility. Your attempts, scores, and coach feedback stay on this device unless you export or clear browser data.</p>
          <div class="status-strip">
            ${statusPill("Local DB", true)}
            ${statusPill("Cloud backend", false)}
            ${statusPill("Exam dumps", false)}
          </div>
        </div>
        <div class="auth-card">
          ${user ? renderAccountPanel(user) : renderAuthForms()}
        </div>
      </section>
    `;
  }

  function renderAccountPanel(user) {
    const attempts = learnerDb?.getAttempts?.() || [];
    return `
      <div class="panel-heading">
        <span>Active learner</span>
        <strong>${escapeHtml(user.name)}</strong>
      </div>
      <dl class="learner-details">
        <div><dt>Email</dt><dd>${escapeHtml(user.email)}</dd></div>
        <div><dt>Saved attempts</dt><dd>${attempts.length}</dd></div>
        <div><dt>Created</dt><dd>${formatDate(user.createdAt)}</dd></div>
      </dl>
      <div class="action-row">
        <a class="button primary" href="./index.html">Open simulator</a>
        <button class="button secondary" type="button" data-action="export-data">Export learner DB</button>
        <button class="button secondary" type="button" data-action="logout">Log out</button>
      </div>
    `;
  }

  function renderAuthForms() {
    return `
      <div class="auth-tabs">
        <button class="active" type="button" data-auth-tab="login">Log in</button>
        <button type="button" data-auth-tab="signup">Sign up</button>
      </div>
      <form class="auth-form active" data-auth-form="login">
        <label class="field-label">Email
          <input name="email" type="email" autocomplete="email" required>
        </label>
        <label class="field-label">Password
          <input name="password" type="password" autocomplete="current-password" required>
        </label>
        <button class="button primary" type="submit">Log in</button>
      </form>
      <form class="auth-form" data-auth-form="signup">
        <label class="field-label">Name
          <input name="name" autocomplete="name" required>
        </label>
        <label class="field-label">Email
          <input name="email" type="email" autocomplete="email" required>
        </label>
        <label class="field-label">Password
          <input name="password" type="password" autocomplete="new-password" minlength="6" required>
        </label>
        <button class="button primary" type="submit">Create account</button>
      </form>
    `;
  }

  function renderTaskPanel() {
    const exam = currentExam();
    const evaluated = evaluate(exam);
    const progress = Math.round((evaluated.passedPoints / evaluated.totalPoints) * 100) || 0;
    const status = appState.submitted ? `${appState.submitted.score}% ${appState.submitted.score >= PASS_MARK ? "Pass" : "Practice again"}` : `${progress}% ready`;

    return `
      <aside class="task-panel">
        <div class="panel-heading">
          <span>System based practical</span>
          <strong>Exam workstation</strong>
        </div>
        <label class="field-label">
          Choose practical
          <select data-exam-select>
            ${exams.map((item) => `<option value="${item.id}" ${item.id === exam.id ? "selected" : ""}>${escapeHtml(item.id.replace("exam-", ""))}. ${escapeHtml(item.title)}</option>`).join("")}
          </select>
        </label>
        <div class="exam-meta">
          <span>${escapeHtml(exam.domain)}</span>
          <span>${escapeHtml(exam.difficulty)}</span>
          <span>${exam.timeLimit} min</span>
        </div>
        <h1>${escapeHtml(exam.title)}</h1>
        <p>${escapeHtml(exam.scenario)}</p>
        <div class="timer-row">
          <div>
            <span>Timer</span>
            <strong id="timerReadout">${timerText()}</strong>
          </div>
          <div>
            <span>Score</span>
            <strong id="scoreReadout">${escapeHtml(status)}</strong>
          </div>
        </div>
        <div class="progress-track" aria-label="Completion estimate">
          <i id="progressBar" style="width:${progress}%"></i>
        </div>
        <div class="action-row">
          <button class="button primary" type="button" data-action="start">Start</button>
          <button class="button secondary" type="button" data-action="submit">Submit for grading</button>
        </div>
        <section class="objective-list">
          <h2>Practical questions</h2>
          ${exam.objectives.map((task) => `<p>${escapeHtml(task)}</p>`).join("")}
        </section>
        <section class="checklist" aria-live="polite">
          <h2>Auto-graded rubric</h2>
          <div id="rubricList">
            ${renderRubricList(evaluated.results)}
          </div>
        </section>
      </aside>
    `;
  }

  function renderRubricList(results) {
    return results.map((item) => `
      <div class="rubric-item ${item.passed ? "passed" : ""}" data-check-id="${item.id}">
        <span>${item.passed ? "Done" : "Open"}</span>
        <p>${escapeHtml(item.label)}</p>
        <strong>${item.points} pts</strong>
      </div>
    `).join("");
  }

  function renderModuleTabs() {
    return `
      <nav class="module-tabs" aria-label="Simulator modules">
        ${moduleNav.map((item) => `
          <button class="${appState.view === item.id ? "active" : ""}" type="button" data-view="${item.id}" title="${escapeAttr(item.label)}">
            <span>${escapeHtml(item.short)}</span>
            ${escapeHtml(item.label)}
          </button>
        `).join("")}
      </nav>
    `;
  }

  function renderWorkspaceHeader() {
    const exam = currentExam();
    const module = moduleNav.find((item) => item.id === appState.view) || moduleNav[0];
    return `
      <div class="workspace-titlebar">
        <div>
          <p>Home / Integration Suite / ${escapeHtml(module.label)}</p>
          <h2>${escapeHtml(module.label)}</h2>
          <span>${escapeHtml(exam.domain)} practice - ${escapeHtml(exam.difficulty)}</span>
        </div>
        <aside>
          <span>${escapeHtml(APP.tagline)} mode</span>
          <strong>Safe failure sandbox</strong>
          <button class="button micro" type="button" data-action="toggle-tutorial">${appState.tutorialOpen ? "Hide tutorial" : "Show tutorial"}</button>
        </aside>
      </div>
    `;
  }

  function renderTutorialStrip() {
    const steps = tutorialFlow();
    if (!steps.length) return "";
    setTutorialIndex(appState.tutorialIndex);
    const step = currentTutorialStep();
    const module = moduleNav.find((item) => item.id === step.view) || moduleNav[0];
    return `
      <section class="tutorial-strip" aria-label="Guided tutorial">
        <div class="tutorial-copy">
          <span>Tutorial ${appState.tutorialIndex + 1} of ${steps.length}</span>
          <strong>${escapeHtml(step.title)}</strong>
          <p>${escapeHtml(step.body)}</p>
        </div>
        <ol class="tutorial-tasks">
          ${step.tasks.map((task) => `<li>${escapeHtml(task)}</li>`).join("")}
        </ol>
        <div class="tutorial-controls">
          <button class="button secondary" type="button" data-action="tutorial-prev" ${appState.tutorialIndex <= 0 ? "disabled" : ""}>Back</button>
          <button class="button secondary" type="button" data-action="tutorial-next" ${appState.tutorialIndex >= steps.length - 1 ? "disabled" : ""}>Next</button>
          <button class="button primary" type="button" data-action="tutorial-jump">Open ${escapeHtml(module.label)}</button>
          <button class="button quiet-light" type="button" data-action="tutorial-apply">Apply starter hint</button>
        </div>
      </section>
    `;
  }

  function renderWorkspace() {
    const view = appState.view;
    appState.workspace.visited[view] = true;
    if (view === "design") return renderDesignView();
    if (view === "security") return renderSecurityView();
    if (view === "apis") return renderApiView();
    if (view === "events") return renderEventView();
    if (view === "monitor") return renderMonitorView();
    if (view === "partners") return renderPartnerView();
    if (view === "coach") return renderCoachView();
    return renderCockpitView();
  }

  function renderCockpitView() {
    return `
      <div class="workspace-grid">
        <section class="work-panel wide">
          <div class="panel-heading">
            <span>Global account</span>
            <strong>Subaccount overview</strong>
          </div>
          <div class="metric-grid">
            ${capabilityToggle("cloudIntegration", "Cloud Integration", "Design, deploy, and monitor integration flows.")}
            ${capabilityToggle("apiManagement", "API Management", "Create providers, proxies, products, and policies.")}
            ${capabilityToggle("eventMesh", "Event Mesh", "Manage queues, topic subscriptions, and event delivery.")}
            ${capabilityToggle("tradingPartner", "Trading Partner", "Practice B2B partner setup and agreements.")}
            ${capabilityToggle("integrationAdvisor", "Integration Advisor", "Practice mapping and MIG-style thinking.")}
          </div>
        </section>

        <section class="work-panel">
          <div class="panel-heading">
            <span>Security</span>
            <strong>Role collections</strong>
          </div>
          <div class="checkbox-grid compact">
            ${roleOptions.map((role) => listCheckbox(role, "roles", role)).join("")}
          </div>
        </section>

        <section class="work-panel">
          <div class="panel-heading">
            <span>Reusable content</span>
            <strong>Discovery shortcuts</strong>
          </div>
          <div class="stack">
            <button class="tile-button" type="button" data-action="open-discovery">
              <strong>Open Business Accelerator Hub</strong>
              <span>Mark reusable APIs, packages, and events as reviewed.</span>
            </button>
            <button class="tile-button" type="button" data-action="open-feature-scope">
              <strong>Review feature scope</strong>
              <span>Use product scope as a planning reference.</span>
            </button>
            ${toggle("discovery.learningJourney", "Learning journey reviewed")}
          </div>
        </section>
      </div>
    `;
  }

  function renderDesignView() {
    return `
      <div class="workspace-grid design-grid">
        <section class="work-panel">
          <div class="panel-heading">
            <span>Design</span>
            <strong>Package and artifact</strong>
          </div>
          <div class="form-grid">
            ${input("Package name", "package.name", "Example: Sales Order Integrations")}
            ${input("Package description", "package.description", "Short business purpose")}
            ${input("Integration flow name", "iflow.name", "Example: Sales Order Create")}
            ${input("Artifact version", "iflow.version", "1.0")}
            ${select("Package state", "package.transport", ["Draft", "Ready for transport", "Deployed"])}
          </div>
        </section>

        <section class="work-panel wide">
          <div class="panel-heading">
            <span>Canvas</span>
            <strong>Integration flow model</strong>
          </div>
          <div class="iflow-canvas" aria-label="Integration flow canvas">
            <div class="flow-node sender">
              <span>Sender</span>
              <strong>${escapeHtml(appState.workspace.iflow.senderAdapter)}</strong>
            </div>
            <div class="flow-line"></div>
            <div class="flow-node">
              <span>Modifier</span>
              <strong>${escapeHtml(appState.workspace.iflow.headerName || appState.workspace.iflow.propertyName || "Set header")}</strong>
            </div>
            <div class="flow-line"></div>
            <div class="flow-node">
              <span>Map</span>
              <strong>${escapeHtml(appState.workspace.iflow.mappingType)}</strong>
            </div>
            <div class="flow-line"></div>
            <div class="flow-node receiver">
              <span>Receiver</span>
              <strong>${escapeHtml(appState.workspace.iflow.receiverAdapter)}</strong>
            </div>
          </div>
          <div class="action-row">
            <button class="button primary" type="button" data-action="deploy-iflow">Deploy iFlow</button>
            ${toggle("iflow.traceEnabled", "Enable trace")}
            ${toggle("iflow.soapAsync", "SOAP asynchronous")}
            ${toggle("iflow.scriptEnabled", "Groovy script step")}
            ${toggle("iflow.valueMapping", "Value mapping table")}
          </div>
        </section>

        <section class="work-panel">
          <div class="panel-heading">
            <span>Endpoints</span>
            <strong>Sender and receiver</strong>
          </div>
          <div class="form-grid">
            ${select("Sender adapter", "iflow.senderAdapter", adapterOptions)}
            ${input("Endpoint path", "iflow.endpoint", "/orders")}
            ${select("Receiver adapter", "iflow.receiverAdapter", adapterOptions)}
            ${input("Receiver address", "iflow.receiverAddress", "https://example.receiver")}
            ${select("Schedule", "iflow.schedule", ["Manual", "Every 5 minutes", "Hourly", "Daily", "File polling"])}
            ${input("JMS queue", "iflow.jmsQueue", "order.queue")}
          </div>
        </section>

        <section class="work-panel">
          <div class="panel-heading">
            <span>Processing</span>
            <strong>Message transformation</strong>
          </div>
          <div class="form-grid">
            ${input("Header name", "iflow.headerName", "SAP_MessageProcessingLogID")}
            ${input("Header value", "iflow.headerValue", "${header.CorrelationId}")}
            ${input("Property name", "iflow.propertyName", "priority")}
            ${input("Property value", "iflow.propertyValue", "high")}
            ${input("Router expression", "iflow.routerExpression", "${xpath(/Order/Priority = 'HIGH')}")}
            ${select("Mapping type", "iflow.mappingType", mappingOptions)}
            ${select("Error handling", "iflow.errorHandler", ["None", "Exception Subprocess", "Local Integration Process", "Retry later"])}
          </div>
        </section>
      </div>
    `;
  }

  function renderSecurityView() {
    const artifacts = appState.workspace.security.artifacts;
    return `
      <div class="workspace-grid">
        <section class="work-panel">
          <div class="panel-heading">
            <span>Manage security</span>
            <strong>Security material</strong>
          </div>
          <div class="form-grid">
            ${select("Artifact type", "security.newType", securityTypes)}
            ${input("Alias", "security.newAlias", "Example: S4HANA_OAUTH")}
          </div>
          <button class="button primary" type="button" data-action="add-security">Create material</button>
          <div class="artifact-list">
            ${artifacts.length ? artifacts.map((artifact) => `
              <article>
                <span>${escapeHtml(artifact.type)}</span>
                <strong>${escapeHtml(artifact.alias)}</strong>
              </article>
            `).join("") : `<p class="empty">No security artifacts yet.</p>`}
          </div>
        </section>

        <section class="work-panel">
          <div class="panel-heading">
            <span>Keystore</span>
            <strong>Certificates and policies</strong>
          </div>
          <div class="form-grid">
            ${input("Keystore alias", "security.keystoreAlias", "finance-cert")}
            ${input("Access policy", "security.accessPolicy", "Allow sender role to call secure endpoint")}
            ${input("Connectivity target", "security.connectivityTarget", "sftp://finance.example")}
          </div>
          <div class="action-row">
            <button class="button secondary" type="button" data-action="run-connectivity">Run connectivity test</button>
            ${toggle("security.connectivityTest", "Connectivity passed")}
          </div>
        </section>

        <section class="work-panel wide">
          <div class="panel-heading">
            <span>Authorization</span>
            <strong>Role collections for endpoint security</strong>
          </div>
          <div class="checkbox-grid">
            ${roleOptions.map((role) => listCheckbox(role, "roles", role)).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderApiView() {
    return `
      <div class="workspace-grid">
        <section class="work-panel">
          <div class="panel-heading">
            <span>API provider</span>
            <strong>Backend connection</strong>
          </div>
          <div class="form-grid">
            ${input("Provider name", "api.providerName", "S4HANA Sandbox")}
            ${input("Provider host", "api.providerHost", "https://s4.example.com")}
            ${input("Target endpoint", "api.targetEndpoint", "/sap/opu/odata/sap/API_SALES_ORDER_SRV")}
          </div>
        </section>

        <section class="work-panel">
          <div class="panel-heading">
            <span>API proxy</span>
            <strong>Managed facade</strong>
          </div>
          <div class="form-grid">
            ${input("Proxy name", "api.proxyName", "Orders API")}
            ${input("Base path", "api.basePath", "/orders")}
            ${input("Version", "api.version", "1.1")}
            ${input("Product name", "api.productName", "Orders Product")}
          </div>
          <div class="action-row">
            <button class="button primary" type="button" data-action="publish-product">Publish product</button>
            <button class="button secondary" type="button" data-action="open-api-monitor">Open API monitor</button>
          </div>
        </section>

        <section class="work-panel wide">
          <div class="panel-heading">
            <span>Policies</span>
            <strong>Security and governance</strong>
          </div>
          <div class="checkbox-grid policy-grid">
            ${policyOptions.map((policy) => listCheckbox(policy.label, "api.policies", policy.id)).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderEventView() {
    return `
      <div class="workspace-grid">
        <section class="work-panel">
          <div class="panel-heading">
            <span>Event Mesh</span>
            <strong>Queue configuration</strong>
          </div>
          <div class="form-grid">
            ${input("Queue name", "event.queueName", "order.created.q")}
            ${input("Webhook URL", "event.webhookUrl", "https://example.com/events/orders")}
          </div>
          <div class="action-row">
            <button class="button secondary" type="button" data-action="create-service-key">Create service key</button>
            <button class="button primary" type="button" data-action="publish-event">Publish test event</button>
          </div>
        </section>

        <section class="work-panel">
          <div class="panel-heading">
            <span>Subscriptions</span>
            <strong>Topic bindings</strong>
          </div>
          <div class="form-grid">
            ${input("New topic subscription", "event.newSubscription", "order/created")}
          </div>
          <button class="button primary" type="button" data-action="add-subscription">Add subscription</button>
          <div class="artifact-list">
            ${appState.workspace.event.subscriptions.length ? appState.workspace.event.subscriptions.map((topic) => `
              <article>
                <span>Topic</span>
                <strong>${escapeHtml(topic)}</strong>
              </article>
            `).join("") : `<p class="empty">No topic subscriptions yet.</p>`}
          </div>
        </section>

        <section class="work-panel wide">
          <div class="panel-heading">
            <span>Event status</span>
            <strong>Runtime readiness</strong>
          </div>
          <div class="status-strip">
            ${statusPill("Service key", appState.workspace.event.serviceKeyCreated)}
            ${statusPill("Webhook", String(appState.workspace.event.webhookUrl || "").startsWith("https://"))}
            ${statusPill("Test event", appState.workspace.event.testEventPublished)}
            ${statusPill("Queue", String(appState.workspace.event.queueName || "").trim().length > 1)}
          </div>
        </section>
      </div>
    `;
  }

  function renderMonitorView() {
    return `
      <div class="workspace-grid">
        <section class="work-panel wide">
          <div class="panel-heading">
            <span>Monitor integration flows</span>
            <strong>Message processing logs</strong>
          </div>
          <div class="monitor-toolbar">
            ${select("Status filter", "monitor.statusFilter", ["All", "Completed", "Failed", "Processing", "Escalated"])}
            ${input("Artifact filter", "monitor.artifactFilter", "Sales Order Create")}
            ${select("Root cause", "monitor.rootCause", rootCauseOptions)}
          </div>
          <div class="log-table" role="table" aria-label="Message processing logs">
            <div role="row">
              <span>Status</span><span>Artifact</span><span>Endpoint</span><span>Runtime hint</span>
            </div>
            ${renderLogRow("Failed", appState.workspace.iflow.name || "Sales Order Create", appState.workspace.iflow.endpoint || "/orders", "OAuth credential alias not found")}
            ${renderLogRow("Completed", "Supplier XML Transform", "/supplier", "Payload transformed")}
            ${renderLogRow("Processing", "Event Order Notify", "order/created", "Waiting for receiver acknowledgement")}
          </div>
          <div class="action-row wrap">
            <button class="button secondary" type="button" data-action="open-failed-message">Open failed message</button>
            <button class="button secondary" type="button" data-action="view-trace">View trace</button>
            <button class="button secondary" type="button" data-action="attach-log">Attach diagnostic log</button>
            <button class="button primary" type="button" data-action="retry-message">Retry message</button>
          </div>
        </section>

        <section class="work-panel">
          <div class="panel-heading">
            <span>Operations</span>
            <strong>Stores and queues</strong>
          </div>
          <div class="stack">
            <button class="tile-button" type="button" data-action="check-datastore">
              <strong>Check data stores</strong>
              <span>Inspect temporary payload and variable storage.</span>
            </button>
            <button class="tile-button" type="button" data-action="check-jms">
              <strong>Open JMS monitor</strong>
              <span>Review queued messages and backlog.</span>
            </button>
            <button class="tile-button" type="button" data-action="clear-lock">
              <strong>Clear lock</strong>
              <span>Release a blocked artifact or processing lock.</span>
            </button>
            <button class="tile-button" type="button" data-action="open-api-monitor">
              <strong>Open API monitor</strong>
              <span>Review API runtime traffic and policy metrics.</span>
            </button>
          </div>
        </section>
      </div>
    `;
  }

  function renderPartnerView() {
    return `
      <div class="workspace-grid">
        <section class="work-panel">
          <div class="panel-heading">
            <span>B2B setup</span>
            <strong>Trading partner</strong>
          </div>
          <div class="form-grid">
            ${input("Partner name", "partner.name", "Northwind Supplies")}
            ${input("Partner directory key", "partner.directoryKey", "NORTHWIND_AS2")}
            ${toggle("partner.agreementActive", "Agreement active")}
            ${toggle("partner.ediMapping", "EDI mapping maintained")}
          </div>
        </section>

        <section class="work-panel">
          <div class="panel-heading">
            <span>Connector</span>
            <strong>Third-party system</strong>
          </div>
          <div class="form-grid">
            ${input("CRM connector name", "connectors.crmName", "CRM Sandbox Connector")}
          </div>
          <button class="button primary" type="button" data-action="create-crm-connector">Create connector</button>
        </section>

        <section class="work-panel wide">
          <div class="panel-heading">
            <span>Common B2B flow</span>
            <strong>Adapter quick setup</strong>
          </div>
          <div class="action-row wrap">
            <button class="button secondary" type="button" data-view="design">Open iFlow designer</button>
            <button class="button secondary" type="button" data-view="security">Open certificates</button>
          </div>
          <p class="muted">For the B2B practical, set the sender adapter to AS2, receiver adapter to IDoc, and mapping type to EDI to XML in the Cloud Integration view.</p>
        </section>
      </div>
    `;
  }

  function renderCoachView() {
    const latest = appState.submitted || appState.attempts[0] || null;
    const feedback = latest ? latest.feedback : coachPreview();
    return `
      <div class="workspace-grid">
        <section class="work-panel wide">
          <div class="panel-heading">
            <span>Local AI coach</span>
            <strong>Feedback generated from your rubric evidence</strong>
          </div>
          ${latest ? `
            <div class="score-card ${latest.score >= PASS_MARK ? "pass" : "needs-work"}">
              <span>${latest.score >= PASS_MARK ? "Passed practice threshold" : "Practice threshold not met"}</span>
              <strong>${latest.score}%</strong>
              <p>${escapeHtml(feedback.summary)}</p>
            </div>
            <div class="feedback-grid">
              ${feedback.sections.map((section) => `
                <article>
                  <span>${escapeHtml(section.title)}</span>
                  <p>${escapeHtml(section.body)}</p>
                </article>
              `).join("")}
            </div>
          ` : `
            <p class="muted">${escapeHtml(feedback.summary)}</p>
          `}
        </section>

        <section class="work-panel wide">
          <div class="panel-heading">
            <span>Tutorial path</span>
            <strong>Current practical walkthrough</strong>
          </div>
          <div class="tutorial-map">
            ${tutorialFlow().map((step, index) => `
              <button class="${index === appState.tutorialIndex ? "active" : ""}" type="button" data-tutorial-step="${index}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${escapeHtml(step.title)}</strong>
                <small>${escapeHtml((moduleNav.find((item) => item.id === step.view) || moduleNav[0]).label)}</small>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="work-panel">
          <div class="panel-heading">
            <span>Attempt history</span>
            <strong>Local browser storage</strong>
          </div>
          <div class="attempt-list">
            ${appState.attempts.length ? appState.attempts.slice(0, 8).map((attempt) => `
              <article>
                <span>${escapeHtml(formatDate(attempt.createdAt))}</span>
                <strong>${escapeHtml(attempt.examTitle)}</strong>
                <p>${attempt.score}% - ${attempt.score >= PASS_MARK ? "pass" : "practice again"}</p>
              </article>
            `).join("") : `<p class="empty">Submit a practical to create feedback.</p>`}
          </div>
        </section>

        <section class="work-panel" id="legal">
          <div class="panel-heading">
            <span>Legal safety</span>
            <strong>Independent training simulator</strong>
          </div>
          <p class="muted">${APP.name} is an independent educational simulator by ${APP.studio}. It is not SAP, not endorsed by SAP SE, and does not use SAP logos, screenshots, copied interface assets, proprietary layouts, or real certification questions. Product names such as SAP BTP, SAP Integration Suite, Cloud Integration, API Management, and Event Mesh are used only to describe the skills learners are practicing. All trademarks belong to their respective owners.</p>
          <p class="muted">Copyright ${new Date().getFullYear()} ${APP.studio}. The site design, original practical scenarios, grading logic, feedback text, API-ocalypse name, and ${APP.tagline} catch line are original training materials. Do not copy, resell, republish, or redistribute this simulator without permission.</p>
          <p class="muted">The practicals are original scenarios aligned to public learning objectives and documentation. They are not exam dumps and should be used as navigation and skill practice, not as a guarantee of exam content or results.</p>
        </section>

        <section class="work-panel wide">
          <div class="panel-heading">
            <span>Research basis</span>
            <strong>Official public references</strong>
          </div>
          <div class="source-grid">
            ${sourceLinks.map((link) => `<a href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderCoachRail() {
    const exam = currentExam();
    const evaluated = evaluate(exam);
    const missed = evaluated.results.filter((item) => !item.passed).slice(0, 4);
    return `
      <aside class="coach-rail">
        <div class="panel-heading">
          <span>AI feedback</span>
          <strong>Live guidance</strong>
        </div>
        <p>${escapeHtml(liveCoachMessage(evaluated))}</p>
        <div class="mini-list">
          ${missed.length ? missed.map((item) => `
            <article>
              <span>${escapeHtml(item.category)}</span>
              <p>${escapeHtml(item.label)}</p>
            </article>
          `).join("") : `<article><span>Ready</span><p>All rubric items are currently satisfied. Submit when you are ready.</p></article>`}
        </div>
        <label class="field-label notes-label">
          Learner notes
          <textarea data-bind="notes" rows="6" placeholder="Record what you tried, errors seen, or concepts to review.">${escapeHtml(appState.workspace.notes)}</textarea>
        </label>
        <div class="activity-log">
          <strong>Recent actions</strong>
          ${appState.workspace.activity.slice(0, 6).map((item) => `<p>${escapeHtml(item)}</p>`).join("") || `<p>No actions yet.</p>`}
        </div>
      </aside>
    `;
  }

  function renderFooter() {
    return `
      <div class="footer-inner">
        <strong>${APP.studio} creation</strong>
        <span>${escapeHtml(APP.tagline)}. Copyright ${new Date().getFullYear()} ${APP.studio}. ${APP.name} is an ${APP.description}. No SAP affiliation, endorsement, logos, screenshots, copied SAP interface assets, or real exam questions are included.</span>
      </div>
    `;
  }

  function tutorialFlow() {
    const exam = currentExam();
    return (tutorialSteps || []).filter((step) => {
      if (!Array.isArray(step.requires) || !step.requires.length) return true;
      return step.requires.some((id) => exam.checks.includes(id));
    });
  }

  function setTutorialIndex(index) {
    const steps = tutorialFlow();
    const lastIndex = Math.max(0, steps.length - 1);
    const numeric = Number(index);
    appState.tutorialIndex = Math.min(Math.max(Number.isFinite(numeric) ? numeric : 0, 0), lastIndex);
  }

  function currentTutorialStep() {
    setTutorialIndex(appState.tutorialIndex);
    return tutorialFlow()[appState.tutorialIndex] || tutorialFlow()[0] || null;
  }

  function openTutorialStep(index) {
    const steps = tutorialFlow();
    const step = steps[index];
    if (!step) return;
    appState.tutorialIndex = index;
    appState.tutorialOpen = true;
    appState.view = step.view;
    appState.workspace.visited[step.view] = true;
    pushActivity(`Opened tutorial: ${step.title}`);
    saveState();
    render();
  }

  function applyTutorialStep(step) {
    const workspace = appState.workspace;
    const exam = currentExam();
    const expected = exam.expected || {};
    const checks = new Set(exam.checks);

    if (step.id === "brief") {
      if (!appState.startedAt) appState.startedAt = Date.now();
      workspace.discovery.learningJourney = true;
    }

    if (step.id === "scope") {
      if (checks.has("capCloud")) workspace.capabilities.cloudIntegration = true;
      if (checks.has("capApi")) workspace.capabilities.apiManagement = true;
      if (checks.has("capEvent")) workspace.capabilities.eventMesh = true;
      if (checks.has("partnerProfile") || checks.has("partnerAgreement")) workspace.capabilities.tradingPartner = true;
      if (checks.has("roleIntegrationProvisioner")) addUnique(workspace.roles, "Integration_Provisioner");
      if (checks.has("roleApiAdmin")) addUnique(workspace.roles, "APIPortal.Administrator");
      if (checks.has("roleEventAdmin")) addUnique(workspace.roles, "EventMeshAdmin");
      if (checks.has("roleMessageSend")) addUnique(workspace.roles, "MessageSend");
      if (checks.has("openDiscovery")) {
        workspace.discovery.acceleratorHub = true;
        workspace.discovery.learningJourney = true;
      }
    }

    if (step.id === "iflow") {
      if (checks.has("createPackage")) workspace.package.name = workspace.package.name || expected.package || `${exam.title} package`;
      if (checks.has("createIFlow")) workspace.iflow.name = workspace.iflow.name || expected.iflow || `${exam.title} flow`;
      if (checks.has("senderAdapter") && expected.senderAdapter) workspace.iflow.senderAdapter = expected.senderAdapter;
      if (checks.has("receiverAdapter") && expected.receiverAdapter) workspace.iflow.receiverAdapter = expected.receiverAdapter;
      if (checks.has("endpointPath")) workspace.iflow.endpoint = workspace.iflow.endpoint || expected.basePath || "/practice/inbound";
      if (checks.has("contentModifier")) {
        workspace.iflow.headerName = workspace.iflow.headerName || "x-correlation-id";
        workspace.iflow.headerValue = workspace.iflow.headerValue || expected.content || "scenario-id";
      }
      if (checks.has("messageMapping")) workspace.iflow.mappingType = "Message Mapping";
      if (checks.has("csvMapping")) workspace.iflow.mappingType = "CSV to XML";
      if (checks.has("xsltMapping")) workspace.iflow.mappingType = "XSLT";
      if (checks.has("valueMapping")) {
        workspace.iflow.mappingType = "Value Mapping";
        workspace.iflow.valueMapping = true;
      }
      if (checks.has("groovyMapping")) {
        workspace.iflow.mappingType = "Groovy Script";
        workspace.iflow.scriptEnabled = true;
      }
      if (checks.has("ediMapping")) workspace.iflow.mappingType = "EDI to XML";
      if (checks.has("xpathRouter")) workspace.iflow.routerExpression = workspace.iflow.routerExpression || expected.router || "${property.priority} = 'HIGH'";
      if (checks.has("soapAsync")) workspace.iflow.soapAsync = true;
      if (checks.has("jmsQueue")) workspace.iflow.jmsQueue = workspace.iflow.jmsQueue || expected.queue || "practice-retry-queue";
      if (checks.has("scheduleSet")) workspace.iflow.schedule = "Every 15 minutes";
      if (checks.has("exceptionSubprocess")) workspace.iflow.errorHandler = "Exception Subprocess";
      if (checks.has("traceEnabled")) workspace.iflow.traceEnabled = true;
      if (checks.has("deployIFlow")) {
        workspace.iflow.deployed = true;
        workspace.package.transport = "Deployed";
      }
    }

    if (step.id === "security") {
      if (checks.has("oauthCredential")) ensureSecurityArtifact("OAuth2 Client Credentials", expected.credential || "oauth-practice-client");
      if (checks.has("userCredential")) ensureSecurityArtifact("User Credentials", expected.credential || "receiver-user");
      if (checks.has("certificateImported")) ensureSecurityArtifact("Certificate", expected.credential || "receiver-certificate");
      if (checks.has("keystoreAlias")) workspace.security.keystoreAlias = workspace.security.keystoreAlias || expected.credential || "practice-keystore";
      if (checks.has("accessPolicy")) workspace.security.accessPolicy = workspace.security.accessPolicy || "Allow sender app to invoke the integration endpoint";
      if (checks.has("connectivityTest")) {
        workspace.security.connectivityTarget = workspace.security.connectivityTarget || expected.receiverAddress || "https://receiver.example";
        workspace.security.connectivityTest = true;
      }
    }

    if (step.id === "api") {
      if (checks.has("createProvider")) {
        workspace.api.providerName = workspace.api.providerName || "Practice Provider";
        workspace.api.providerHost = workspace.api.providerHost || "https://backend.example";
      }
      if (checks.has("createProxy")) workspace.api.proxyName = workspace.api.proxyName || expected.proxy || `${exam.title} proxy`;
      if (checks.has("proxyBasePath")) workspace.api.basePath = workspace.api.basePath || expected.basePath || "/practice";
      [
        ["verifyApiKeyPolicy", "Verify API Key"],
        ["oauthPolicy", "OAuth 2.0"],
        ["quotaPolicy", "Quota"],
        ["spikeArrestPolicy", "Spike Arrest"],
        ["corsPolicy", "CORS"],
        ["performanceTracePolicy", "Performance Traceability"]
      ].forEach(([checkId, policy]) => {
        if (checks.has(checkId)) addUnique(workspace.api.policies, policy);
      });
      if (checks.has("publishProduct")) {
        workspace.api.productName = workspace.api.productName || `${workspace.api.proxyName || "Practice"} Product`;
        workspace.api.productPublished = true;
      }
      if (checks.has("versionProxy")) workspace.api.version = "1.1";
      if (checks.has("apiMonitor")) workspace.monitor.apiMonitorOpened = true;
    }

    if (step.id === "events") {
      if (checks.has("createQueue")) workspace.event.queueName = workspace.event.queueName || expected.queue || "practice-queue";
      if (checks.has("topicSubscription")) addUnique(workspace.event.subscriptions, expected.topic || "practice/*");
      if (checks.has("serviceKey")) workspace.event.serviceKeyCreated = true;
      if (checks.has("webhook")) workspace.event.webhookUrl = workspace.event.webhookUrl || "https://example.com/events/practice";
      if (checks.has("publishEvent")) workspace.event.testEventPublished = true;
    }

    if (step.id === "monitor") {
      if (checks.has("filterFailed")) workspace.monitor.statusFilter = "Failed";
      if (checks.has("filterCompleted")) workspace.monitor.statusFilter = "Completed";
      if (checks.has("openFailedMessage")) workspace.monitor.failedMessageOpened = true;
      if (checks.has("viewTrace")) workspace.monitor.traceViewed = true;
      if (checks.has("rootCauseSelected")) workspace.monitor.rootCause = expected.rootCause || "Receiver timeout";
      if (checks.has("retryMessage")) workspace.monitor.retryDone = true;
      if (checks.has("logAttachment")) workspace.monitor.logAttachment = true;
      if (checks.has("dataStoreChecked")) workspace.monitor.dataStoreChecked = true;
      if (checks.has("jmsMonitor")) workspace.monitor.jmsChecked = true;
      if (checks.has("lockCleared")) workspace.monitor.lockCleared = true;
    }

    if (step.id === "partners") {
      if (checks.has("partnerProfile")) workspace.partner.name = workspace.partner.name || "Northwind Supplies";
      if (checks.has("partnerDirectory")) workspace.partner.directoryKey = workspace.partner.directoryKey || "NORTHWIND_AS2";
      if (checks.has("partnerAgreement")) workspace.partner.agreementActive = true;
      if (checks.has("ediMapping")) workspace.partner.ediMapping = true;
    }
  }

  function ensureSecurityArtifact(type, alias) {
    const artifacts = appState.workspace.security.artifacts;
    if (artifacts.some((item) => item.type === type && hasExpectedText(item.alias, alias))) return;
    artifacts.push({
      type,
      alias,
      createdAt: new Date().toISOString()
    });
  }

  function addUnique(list, value) {
    if (!Array.isArray(list) || list.includes(value)) return;
    list.push(value);
  }

  function exportLearnerData() {
    if (!learnerDb?.exportData) {
      toast("Learner database is not available in this browser.");
      return;
    }

    const data = learnerDb.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `api-ocalypse-learner-db-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast("Learner DB export downloaded.");
  }

  function gradeCurrentExam() {
    const exam = currentExam();
    const evaluated = evaluate(exam);
    const score = Math.round((evaluated.passedPoints / evaluated.totalPoints) * 100) || 0;
    return {
      id: `attempt-${Date.now().toString(36)}`,
      examId: exam.id,
      examTitle: exam.title,
      score,
      passedPoints: evaluated.passedPoints,
      totalPoints: evaluated.totalPoints,
      results: evaluated.results,
      feedback: buildFeedback(score, evaluated.results),
      createdAt: new Date().toISOString()
    };
  }

  function evaluate(exam) {
    const results = exam.checks.map((id) => {
      const item = checkLibrary[id];
      let passed = false;
      try {
        passed = Boolean(item.test(appState.workspace, exam));
      } catch (error) {
        passed = false;
      }
      return { id, ...item, passed };
    });
    const totalPoints = results.reduce((sum, item) => sum + item.points, 0);
    const passedPoints = results.reduce((sum, item) => sum + (item.passed ? item.points : 0), 0);
    return { results, totalPoints, passedPoints };
  }

  function buildFeedback(score, results) {
    const missed = results.filter((item) => !item.passed);
    const passed = results.filter((item) => item.passed);
    const missedByCategory = groupBy(missed, "category");
    const strongest = topCategory(groupBy(passed, "category"));
    const weakest = topCategory(missedByCategory);
    const sections = [];

    if (strongest) {
      sections.push({
        title: "Strength",
        body: `Your strongest evidence is in ${strongest}. Keep using the simulator to make those steps automatic under time pressure.`
      });
    }

    if (weakest) {
      sections.push({
        title: "Improve next",
        body: `Focus on ${weakest}. The missed rubric items show where navigation or configuration is still incomplete.`
      });
    }

    missed.slice(0, 5).forEach((item) => {
      sections.push({
        title: item.category,
        body: `Practice: ${item.label}. Open the matching module, configure the field or action, then resubmit.`
      });
    });

    if (!missed.length) {
      sections.push({
        title: "Exam readiness",
        body: "You completed every rubric item in this simulator. Repeat the task from reset and aim to finish without using the checklist."
      });
    }

    return {
      summary: score >= PASS_MARK
        ? "Good pass in this practice run. Your next step is to repeat under a shorter timer and explain each configuration choice out loud."
        : "This run needs more practice. Start with the first missed area, then reset the practical and rebuild it from memory.",
      sections
    };
  }

  function coachPreview() {
    const evaluated = evaluate(currentExam());
    return {
      summary: liveCoachMessage(evaluated),
      sections: []
    };
  }

  function liveCoachMessage(evaluated) {
    const score = Math.round((evaluated.passedPoints / evaluated.totalPoints) * 100) || 0;
    const missed = evaluated.results.filter((item) => !item.passed);
    if (score === 100) return "The workspace currently satisfies every visible rubric item. Submit, then try a reset run from memory.";
    if (score >= PASS_MARK) return "You are over the practice pass mark. Use the remaining time to close the last few open rubric items.";
    const first = missed[0];
    return first
      ? `Start with ${first.category}: ${first.label}.`
      : "Choose a practical and begin configuring the workspace.";
  }

  function updateLiveProgress() {
    const list = $("#rubricList");
    const bar = $("#progressBar");
    const score = $("#scoreReadout");
    if (!list || !bar || !score) return;
    const evaluated = evaluate(currentExam());
    const progress = Math.round((evaluated.passedPoints / evaluated.totalPoints) * 100) || 0;
    list.innerHTML = renderRubricList(evaluated.results);
    bar.style.width = `${progress}%`;
    score.textContent = appState.submitted ? `${appState.submitted.score}% ${appState.submitted.score >= PASS_MARK ? "Pass" : "Practice again"}` : `${progress}% ready`;
  }

  function updateTimer() {
    const target = $("#timerReadout");
    if (target) target.textContent = timerText();
  }

  function timerText() {
    if (!appState.startedAt) return "Not started";
    const exam = currentExam();
    const elapsed = Math.max(0, Date.now() - appState.startedAt);
    const remaining = Math.max(0, exam.timeLimit * 60 * 1000 - elapsed);
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function setAuthMode(mode) {
    const safeMode = mode === "signup" ? "signup" : "login";
    document.querySelectorAll("[data-auth-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.authTab === safeMode);
    });
    document.querySelectorAll("[data-auth-form]").forEach((form) => {
      form.classList.toggle("active", form.dataset.authForm === safeMode);
    });
  }

  function capabilityToggle(path, title, body) {
    const checked = getPath(appState.workspace, `capabilities.${path}`);
    return `
      <label class="capability-card ${checked ? "active" : ""}">
        <input type="checkbox" data-bind="capabilities.${path}" ${checked ? "checked" : ""}>
        <span>${checked ? "Active" : "Inactive"}</span>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(body)}</p>
      </label>
    `;
  }

  function input(label, path, placeholder, type = "text") {
    return `
      <label class="field-label">
        ${escapeHtml(label)}
        <input type="${type}" data-bind="${escapeAttr(path)}" value="${escapeAttr(getPath(appState.workspace, path) || "")}" placeholder="${escapeAttr(placeholder || "")}">
      </label>
    `;
  }

  function select(label, path, options) {
    const value = getPath(appState.workspace, path);
    return `
      <label class="field-label">
        ${escapeHtml(label)}
        <select data-bind="${escapeAttr(path)}">
          ${options.map((option) => `<option value="${escapeAttr(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  function toggle(path, label) {
    const checked = Boolean(getPath(appState.workspace, path));
    return `
      <label class="toggle-row">
        <input type="checkbox" data-bind="${escapeAttr(path)}" ${checked ? "checked" : ""}>
        <span>${escapeHtml(label)}</span>
      </label>
    `;
  }

  function listCheckbox(label, listPath, value) {
    const list = getPath(appState.workspace, listPath) || [];
    return `
      <label class="check-row">
        <input type="checkbox" data-list="${escapeAttr(listPath)}" value="${escapeAttr(value)}" ${list.includes(value) ? "checked" : ""}>
        <span>${escapeHtml(label)}</span>
      </label>
    `;
  }

  function renderLogRow(status, artifact, endpoint, hint) {
    return `
      <div role="row" class="${status.toLowerCase()}">
        <span>${escapeHtml(status)}</span>
        <span>${escapeHtml(artifact)}</span>
        <span>${escapeHtml(endpoint)}</span>
        <span>${escapeHtml(hint)}</span>
      </div>
    `;
  }

  function statusPill(label, active) {
    return `<span class="${active ? "ok" : ""}">${escapeHtml(label)}: ${active ? "Ready" : "Open"}</span>`;
  }

  function check(label, category, points, test) {
    return { label, category, points, test };
  }

  function currentExam() {
    return exams.find((exam) => exam.id === appState.currentExamId) || exams[0];
  }

  function hasList(list, value) {
    return Array.isArray(list) && list.includes(value);
  }

  function hasSecurity(state, type, expectedAlias = "") {
    return state.security.artifacts.some((artifact) => {
      if (artifact.type !== type) return false;
      return hasExpectedText(artifact.alias, expectedAlias);
    });
  }

  function hasExpectedText(value, expected) {
    const clean = String(value || "").trim().toLowerCase();
    const target = String(expected || "").trim().toLowerCase();
    if (!target) return clean.length > 1;
    return clean.includes(target);
  }

  function getPath(object, path) {
    return String(path).split(".").reduce((current, key) => current?.[key], object);
  }

  function setPath(object, path, value) {
    const keys = String(path).split(".");
    const finalKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== "object") current[key] = {};
      return current[key];
    }, object);
    target[finalKey] = value;
  }

  function groupBy(items, key) {
    return items.reduce((groups, item) => {
      const value = item[key] || "Other";
      groups[value] = groups[value] || [];
      groups[value].push(item);
      return groups;
    }, {});
  }

  function topCategory(groups) {
    return Object.entries(groups)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([name]) => name)[0] || "";
  }

  function pushActivity(message) {
    const stamped = `${new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date())} - ${message}`;
    appState.workspace.activity.unshift(stamped);
    appState.workspace.activity = appState.workspace.activity.slice(0, 16);
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }

  function deepMerge(base, saved) {
    if (!saved || typeof saved !== "object") return base;
    Object.entries(saved).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        base[key] = value;
      } else if (value && typeof value === "object" && base[key] && typeof base[key] === "object" && !Array.isArray(base[key])) {
        base[key] = deepMerge(base[key], value);
      } else {
        base[key] = value;
      }
    });
    return base;
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
  }

  function toast(message) {
    const element = $("#toast");
    if (!element) return;
    element.textContent = message;
    element.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => element.classList.remove("show"), 2600);
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, "&quot;");
  }

  window.addEventListener("beforeunload", () => {
    if (timer) clearInterval(timer);
  });
})();

