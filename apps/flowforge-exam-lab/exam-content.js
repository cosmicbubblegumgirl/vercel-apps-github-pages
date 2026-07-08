(() => {
  // Product copy and static option lists live here so the simulator engine stays focused on behavior.
  const APP = {
    name: "API-ocalypse",
    tagline: "CTRL+ALT+DEFEAT",
    description: "independent SAP BTP and Integration Suite practice simulator",
    tenant: "trial-eu10-api-ocalypse",
    studio: "Quantum Cupcakes"
  };

  const STORAGE_KEY = "apiocalypseLabV1";
  const PASS_MARK = 75;

  const sourceLinks = [
    {
      label: "SAP Learning Journey: Developing with SAP Integration Suite",
      url: "https://learning.sap.com/learning-journeys/developing-with-sap-integration-suite"
    },
    {
      label: "SAP Certification practical exam FAQ",
      url: "https://learning.sap.com/helpcenter/certification-support/certification-practical-exam"
    },
    {
      label: "SAP Help: API Management",
      url: "https://help.sap.com/docs/integration-suite/sap-integration-suite/api-management-capability"
    },
    {
      label: "SAP Help: Event Mesh",
      url: "https://help.sap.com/docs/event-mesh/event-mesh/what-is-sap-event-mesh"
    },
    {
      label: "SAP Help: Monitor Message Processing",
      url: "https://help.sap.com/docs/cloud-integration/sap-cloud-integration/monitor-message-processing-monitor"
    },
    {
      label: "SAP Help: Managing Security Material",
      url: "https://help.sap.com/docs/cloud-integration/sap-cloud-integration/managing-security-material"
    }
  ];

  const moduleNav = [
    { id: "cockpit", label: "Cockpit", short: "CP" },
    { id: "design", label: "Cloud Integration", short: "CI" },
    { id: "security", label: "Security", short: "SE" },
    { id: "apis", label: "API Management", short: "API" },
    { id: "events", label: "Event Mesh", short: "EV" },
    { id: "monitor", label: "Monitor", short: "MO" },
    { id: "partners", label: "Partners", short: "TP" },
    { id: "coach", label: "AI Coach", short: "AI" }
  ];

  const roleOptions = [
    "Integration_Provisioner",
    "CloudIntegrationDeveloper",
    "CloudIntegrationContentPublisher",
    "CloudIntegrationMonitor",
    "SecurityMaterialManager",
    "APIPortal.Administrator",
    "APIPortal.Service.CatalogIntegration",
    "EventMeshAdmin",
    "MessageSend",
    "AccessPolicyAdmin"
  ];

  const adapterOptions = [
    "HTTPS",
    "SOAP",
    "OData",
    "SFTP",
    "REST",
    "JMS",
    "AMQP",
    "AS2",
    "IDoc",
    "Mail",
    "SuccessFactors",
    "ProcessDirect"
  ];

  const mappingOptions = [
    "None",
    "Message Mapping",
    "XSLT",
    "Groovy Script",
    "Value Mapping",
    "CSV to XML",
    "EDI to XML"
  ];

  const policyOptions = [
    { id: "Verify API Key", label: "Verify API Key" },
    { id: "OAuth 2.0", label: "OAuth 2.0" },
    { id: "Quota", label: "Quota" },
    { id: "Spike Arrest", label: "Spike Arrest" },
    { id: "CORS", label: "CORS" },
    { id: "Performance Traceability", label: "Performance Traceability" },
    { id: "Assign Message", label: "Assign Message" },
    { id: "Threat Protection", label: "Threat Protection" }
  ];

  const securityTypes = [
    "OAuth2 Client Credentials",
    "User Credentials",
    "Certificate",
    "Key Pair",
    "Secure Parameter",
    "PGP Key"
  ];

  const rootCauseOptions = [
    "Not selected",
    "Missing OAuth credential",
    "Expired certificate",
    "Wrong XPath route",
    "Receiver timeout",
    "Quota exceeded",
    "Malformed payload",
    "Queue subscription missing"
  ];

  const tutorialSteps = [
    {
      id: "brief",
      view: "cockpit",
      title: "Read the practical like a work order",
      body: "Start with the scenario, domain tag, timer, and objective list. Turn the brief into a route through the simulated BTP tools.",
      tasks: [
        "Choose one of the 20 practical exams.",
        "Check the rubric before you touch the workspace.",
        "Start the timer only when you are ready to build."
      ]
    },
    {
      id: "scope",
      view: "cockpit",
      title: "Provision the right capabilities",
      body: "Most system tasks begin in the subaccount: activate the service capabilities and assign the role collections the scenario will need.",
      tasks: [
        "Activate only the capabilities needed by the practical.",
        "Assign the security roles called for by the rubric.",
        "Open the reusable-content discovery area when the task asks for it."
      ],
      requires: ["capCloud", "capApi", "capEvent", "roleIntegrationProvisioner", "roleApiAdmin", "roleEventAdmin", "openDiscovery"]
    },
    {
      id: "iflow",
      view: "design",
      title: "Build the integration flow",
      body: "Use the Cloud Integration workbench to create the package, iFlow, adapters, mappings, routes, schedules, and deployment evidence.",
      tasks: [
        "Name the package and iFlow from the business scenario.",
        "Select sender and receiver adapters deliberately.",
        "Configure mapping, routing, error handling, queues, and deployment."
      ],
      requires: ["createPackage", "createIFlow", "senderAdapter", "receiverAdapter", "contentModifier", "messageMapping", "csvMapping", "xsltMapping", "valueMapping", "groovyMapping", "xpathRouter", "soapAsync", "jmsQueue", "scheduleSet", "exceptionSubprocess", "deployIFlow"]
    },
    {
      id: "security",
      view: "security",
      title: "Secure the connection",
      body: "Security tasks focus on credentials, certificates, access policy, keystore aliases, and connectivity checks.",
      tasks: [
        "Create the credential or certificate artifact requested.",
        "Keep aliases scenario-specific and easy to recognize.",
        "Run connectivity evidence before submitting."
      ],
      requires: ["oauthCredential", "userCredential", "certificateImported", "keystoreAlias", "accessPolicy", "connectivityTest"]
    },
    {
      id: "api",
      view: "apis",
      title: "Wrap the service as an API",
      body: "API Management practicals test providers, proxies, base paths, policies, products, versions, and runtime monitoring.",
      tasks: [
        "Create a provider and proxy with a clean base path.",
        "Apply the policies that protect or meter the API.",
        "Publish a product and check monitoring when asked."
      ],
      requires: ["createProvider", "createProxy", "proxyBasePath", "verifyApiKeyPolicy", "oauthPolicy", "quotaPolicy", "spikeArrestPolicy", "corsPolicy", "performanceTracePolicy", "publishProduct", "versionProxy", "apiMonitor"]
    },
    {
      id: "events",
      view: "events",
      title: "Wire the event channel",
      body: "Event Mesh tasks usually expect a queue, topic subscription, service key, webhook, or a test publish action.",
      tasks: [
        "Create a queue that matches the scenario language.",
        "Add a topic subscription pattern.",
        "Create service-key or publish-event evidence where needed."
      ],
      requires: ["createQueue", "topicSubscription", "serviceKey", "webhook", "publishEvent"]
    },
    {
      id: "monitor",
      view: "monitor",
      title: "Diagnose before you retry",
      body: "Monitoring practicals are about evidence: filter the right messages, open the failure, inspect trace, identify cause, then retry or repair.",
      tasks: [
        "Filter by failed or completed status as requested.",
        "Open the processing log and trace details.",
        "Pick the likely root cause before retrying."
      ],
      requires: ["filterFailed", "filterCompleted", "openFailedMessage", "viewTrace", "rootCauseSelected", "retryMessage", "logAttachment", "dataStoreChecked", "jmsMonitor", "lockCleared"]
    },
    {
      id: "partners",
      view: "partners",
      title: "Handle partner and B2B setup",
      body: "B2B practicals combine partner profile data, agreements, directory keys, certificates, and EDI-style mappings.",
      tasks: [
        "Create the partner profile and directory key.",
        "Activate the agreement.",
        "Use AS2, IDoc, and EDI mapping patterns when the task asks for B2B."
      ],
      requires: ["partnerProfile", "partnerAgreement", "partnerDirectory", "ediMapping"]
    },
    {
      id: "submit",
      view: "coach",
      title: "Submit, read feedback, then reset",
      body: "Use the AI coach to review missed evidence, then repeat the same practical from reset until the route feels natural.",
      tasks: [
        "Submit for grading.",
        "Open the feedback sections by category.",
        "Repeat with fewer hints and a shorter timer."
      ]
    }
  ];

  // Original practice tasks based on public Integration Suite learning objectives.
  const exams = [
    {
      id: "exam-01",
      title: "Tenant readiness and capability onboarding",
      domain: "Integration Suite overview",
      difficulty: "Foundation",
      timeLimit: 20,
      scenario: "A new tenant has been provisioned for a project team. Prepare the simulated cockpit so developers can use Cloud Integration, API Management, and Event Mesh.",
      objectives: [
        "Activate the core capabilities used by integration developers.",
        "Assign the role collections normally needed by builders, API admins, and event admins.",
        "Open the official content discovery area so the team can reuse APIs and packages."
      ],
      expected: {},
      checks: [
        "visitCockpit",
        "capCloud",
        "capApi",
        "capEvent",
        "roleIntegrationProvisioner",
        "roleApiAdmin",
        "roleEventAdmin",
        "openDiscovery"
      ]
    },
    {
      id: "exam-02",
      title: "HTTPS to S/4HANA OData sales order iFlow",
      domain: "Cloud Integration",
      difficulty: "Core",
      timeLimit: 35,
      scenario: "Build a sales order integration that receives HTTPS calls, enriches the message with a correlation id, maps the payload, and sends it to an S/4HANA OData endpoint.",
      objectives: [
        "Create a package and iFlow for sales order processing.",
        "Use HTTPS as sender and OData as receiver.",
        "Add a content modifier, message mapping, OAuth credential, and deployment."
      ],
      expected: {
        package: "Sales",
        iflow: "Sales Order",
        senderAdapter: "HTTPS",
        receiverAdapter: "OData",
        content: "Correlation",
        credential: "S4"
      },
      checks: [
        "visitDesign",
        "createPackage",
        "createIFlow",
        "senderAdapter",
        "receiverAdapter",
        "endpointPath",
        "contentModifier",
        "messageMapping",
        "oauthCredential",
        "deployIFlow"
      ]
    },
    {
      id: "exam-03",
      title: "Asynchronous SOAP order intake with JMS",
      domain: "Cloud Integration",
      difficulty: "Core",
      timeLimit: 30,
      scenario: "A legacy order system sends SOAP messages that must be handled asynchronously and stored in a queue before downstream processing.",
      objectives: [
        "Model a SOAP sender and JMS receiver.",
        "Enable asynchronous handling and name a queue.",
        "Add exception handling and verify the queue from operations."
      ],
      expected: {
        package: "Order",
        iflow: "SOAP",
        senderAdapter: "SOAP",
        receiverAdapter: "JMS",
        queue: "order"
      },
      checks: [
        "createPackage",
        "createIFlow",
        "senderAdapter",
        "receiverAdapter",
        "soapAsync",
        "jmsQueue",
        "exceptionSubprocess",
        "deployIFlow",
        "jmsMonitor"
      ]
    },
    {
      id: "exam-04",
      title: "SFTP employee import to SuccessFactors",
      domain: "Cloud Integration",
      difficulty: "Core",
      timeLimit: 35,
      scenario: "Human resources drops a CSV file on SFTP. Transform it and post employee records to a SuccessFactors style endpoint using stored credentials.",
      objectives: [
        "Configure SFTP sender and SuccessFactors or OData receiver.",
        "Set a schedule and CSV style mapping.",
        "Create user credentials, run a connectivity test, and deploy."
      ],
      expected: {
        package: "Employee",
        iflow: "Employee",
        senderAdapter: "SFTP",
        receiverAdapter: "SuccessFactors",
        credential: "SF"
      },
      checks: [
        "createPackage",
        "createIFlow",
        "senderAdapter",
        "receiverAdapter",
        "scheduleSet",
        "csvMapping",
        "userCredential",
        "connectivityTest",
        "deployIFlow"
      ]
    },
    {
      id: "exam-05",
      title: "API provider, proxy, and product publication",
      domain: "API Management",
      difficulty: "Core",
      timeLimit: 30,
      scenario: "Expose an existing OData backend through the API Management area and publish a product that application developers can discover.",
      objectives: [
        "Create an API provider and proxy with a clean base path.",
        "Protect it with API key verification and a quota.",
        "Publish the product and check the API monitor."
      ],
      expected: {
        proxy: "Orders",
        basePath: "orders"
      },
      checks: [
        "capApi",
        "visitApis",
        "createProvider",
        "createProxy",
        "proxyBasePath",
        "verifyApiKeyPolicy",
        "quotaPolicy",
        "publishProduct",
        "apiMonitor"
      ]
    },
    {
      id: "exam-06",
      title: "Secure partner API with OAuth, CORS, and spike control",
      domain: "API Management",
      difficulty: "Applied",
      timeLimit: 30,
      scenario: "A partner API needs stronger governance before release. Add OAuth protection, browser-safe CORS, spike arrest, and traceability.",
      objectives: [
        "Create or reuse a proxy for partner access.",
        "Apply OAuth, CORS, Spike Arrest, and Performance Traceability policies.",
        "Version the proxy and verify runtime monitoring."
      ],
      expected: {
        proxy: "Partner",
        basePath: "partner"
      },
      checks: [
        "createProxy",
        "proxyBasePath",
        "oauthPolicy",
        "corsPolicy",
        "spikeArrestPolicy",
        "performanceTracePolicy",
        "versionProxy",
        "apiMonitor"
      ]
    },
    {
      id: "exam-07",
      title: "Event Mesh queue and subscription setup",
      domain: "Event Mesh",
      difficulty: "Core",
      timeLimit: 25,
      scenario: "Create the eventing setup for order-created notifications so subscribers can consume events asynchronously.",
      objectives: [
        "Activate Event Mesh and create an order queue.",
        "Bind a topic subscription and create a service key.",
        "Publish a test event and configure a webhook endpoint."
      ],
      expected: {
        queue: "order",
        topic: "order/created"
      },
      checks: [
        "capEvent",
        "visitEvents",
        "createQueue",
        "topicSubscription",
        "serviceKey",
        "webhook",
        "publishEvent"
      ]
    },
    {
      id: "exam-08",
      title: "Troubleshoot failed iFlow with missing OAuth credential",
      domain: "Monitoring",
      difficulty: "Applied",
      timeLimit: 25,
      scenario: "An integration started failing after a transport. Use monitoring and security material to identify and fix the missing credential, then retry the message.",
      objectives: [
        "Filter failed message processing logs.",
        "Open the failed message, inspect trace, and select the root cause.",
        "Create the OAuth credential and retry the failed message."
      ],
      expected: {
        credential: "OAuth",
        rootCause: "Missing OAuth credential"
      },
      checks: [
        "visitMonitor",
        "filterFailed",
        "openFailedMessage",
        "viewTrace",
        "rootCauseSelected",
        "oauthCredential",
        "retryMessage"
      ]
    },
    {
      id: "exam-09",
      title: "Priority order routing with XPath",
      domain: "Cloud Integration",
      difficulty: "Applied",
      timeLimit: 35,
      scenario: "Route priority orders to a fast receiver path while standard orders continue to the normal endpoint. Use an XPath expression and add an exception subprocess.",
      objectives: [
        "Use HTTPS input and OData or REST receiver.",
        "Store a priority marker in a content modifier.",
        "Add an XPath route, exception subprocess, and deployment."
      ],
      expected: {
        package: "Priority",
        iflow: "Priority",
        senderAdapter: "HTTPS",
        receiverAdapter: "REST",
        content: "Priority",
        router: "priority"
      },
      checks: [
        "createPackage",
        "createIFlow",
        "senderAdapter",
        "receiverAdapter",
        "contentModifier",
        "xpathRouter",
        "exceptionSubprocess",
        "deployIFlow"
      ]
    },
    {
      id: "exam-10",
      title: "Supplier XML transformation with XSLT",
      domain: "Cloud Integration",
      difficulty: "Applied",
      timeLimit: 35,
      scenario: "A supplier sends XML through SFTP. Transform the payload using XSLT and forward it to a SOAP receiver protected by a certificate.",
      objectives: [
        "Configure SFTP sender and SOAP receiver.",
        "Use XSLT as the mapping approach.",
        "Import a certificate and deploy the artifact."
      ],
      expected: {
        package: "Supplier",
        iflow: "Supplier",
        senderAdapter: "SFTP",
        receiverAdapter: "SOAP"
      },
      checks: [
        "createPackage",
        "createIFlow",
        "senderAdapter",
        "receiverAdapter",
        "xsltMapping",
        "certificateImported",
        "deployIFlow",
        "filterCompleted"
      ]
    },
    {
      id: "exam-11",
      title: "Region enrichment using value mapping and script",
      domain: "Cloud Integration",
      difficulty: "Applied",
      timeLimit: 35,
      scenario: "Normalize region codes before messages reach the receiver. Use value mapping for standard codes and a script for fallback enrichment.",
      objectives: [
        "Create an iFlow with a property carrying the region code.",
        "Enable value mapping and Groovy script mapping.",
        "Turn on trace and attach diagnostic information to the log."
      ],
      expected: {
        package: "Region",
        iflow: "Region",
        content: "Region"
      },
      checks: [
        "createPackage",
        "createIFlow",
        "contentModifier",
        "valueMapping",
        "groovyMapping",
        "traceEnabled",
        "logAttachment",
        "deployIFlow"
      ]
    },
    {
      id: "exam-12",
      title: "Secure SFTP receiver with keystore and connectivity test",
      domain: "Security",
      difficulty: "Core",
      timeLimit: 30,
      scenario: "A finance receiver requires SFTP credentials and a certificate before messages can be deployed confidently.",
      objectives: [
        "Use SFTP as receiver and create the required user credential.",
        "Import a certificate or key pair into the keystore.",
        "Run the outbound connectivity test and deploy."
      ],
      expected: {
        package: "Finance",
        iflow: "Finance",
        receiverAdapter: "SFTP",
        credential: "FIN"
      },
      checks: [
        "visitSecurity",
        "createIFlow",
        "receiverAdapter",
        "userCredential",
        "certificateImported",
        "keystoreAlias",
        "connectivityTest",
        "deployIFlow"
      ]
    },
    {
      id: "exam-13",
      title: "Expose a deployed iFlow through API Management",
      domain: "API Management",
      difficulty: "Applied",
      timeLimit: 35,
      scenario: "A deployed iFlow must be reused by external consumers. Create an API proxy for it, add quota and traceability policies, and publish a product.",
      objectives: [
        "Deploy the iFlow first.",
        "Create a proxy with a base path that represents the integration.",
        "Apply quota and traceability before publishing."
      ],
      expected: {
        package: "Reuse",
        iflow: "Reuse",
        proxy: "Reuse",
        basePath: "reuse"
      },
      checks: [
        "createIFlow",
        "deployIFlow",
        "createProxy",
        "proxyBasePath",
        "quotaPolicy",
        "performanceTracePolicy",
        "publishProduct",
        "apiMonitor"
      ]
    },
    {
      id: "exam-14",
      title: "Third-party CRM connection pattern",
      domain: "Connectivity",
      difficulty: "Applied",
      timeLimit: 30,
      scenario: "Connect a non-SAP CRM style system through a reusable connector, map the incoming data, and protect outbound access with OAuth credentials.",
      objectives: [
        "Create a CRM connector entry.",
        "Use HTTPS sender and REST receiver.",
        "Add OAuth credentials, message mapping, and deployment."
      ],
      expected: {
        package: "CRM",
        iflow: "CRM",
        senderAdapter: "HTTPS",
        receiverAdapter: "REST",
        credential: "CRM"
      },
      checks: [
        "openConnectorCreated",
        "createIFlow",
        "senderAdapter",
        "receiverAdapter",
        "messageMapping",
        "oauthCredential",
        "deployIFlow"
      ]
    },
    {
      id: "exam-15",
      title: "API lifecycle versioning and release",
      domain: "API Management",
      difficulty: "Core",
      timeLimit: 30,
      scenario: "Prepare a versioned API for release with a base path, API key check, quota, product publishing, and runtime monitoring.",
      objectives: [
        "Create and version the API proxy.",
        "Protect the proxy with API key verification and quota.",
        "Publish the product and open the monitor."
      ],
      expected: {
        proxy: "Catalog",
        basePath: "catalog"
      },
      checks: [
        "createProxy",
        "proxyBasePath",
        "versionProxy",
        "verifyApiKeyPolicy",
        "quotaPolicy",
        "publishProduct",
        "apiMonitor"
      ]
    },
    {
      id: "exam-16",
      title: "Event-driven order notification to webhook",
      domain: "Event Mesh",
      difficulty: "Applied",
      timeLimit: 35,
      scenario: "When an order event is published, route it through a queue and notify an external webhook receiver.",
      objectives: [
        "Create an order notification queue and subscription.",
        "Use AMQP or Event Mesh style input with REST receiver.",
        "Configure webhook delivery and publish a test event."
      ],
      expected: {
        package: "Order Event",
        iflow: "Order Event",
        senderAdapter: "AMQP",
        receiverAdapter: "REST",
        queue: "order",
        topic: "order"
      },
      checks: [
        "createQueue",
        "topicSubscription",
        "webhook",
        "publishEvent",
        "createIFlow",
        "senderAdapter",
        "receiverAdapter",
        "deployIFlow"
      ]
    },
    {
      id: "exam-17",
      title: "Operations recovery for queued messages",
      domain: "Monitoring",
      difficulty: "Applied",
      timeLimit: 25,
      scenario: "A support team reports blocked messages. Use operations views to inspect failed logs, data stores, JMS queues, locks, and retry processing.",
      objectives: [
        "Filter failed messages and open the failed message.",
        "Check data stores and JMS queues.",
        "Clear a lock and retry the message."
      ],
      expected: {
        rootCause: "Receiver timeout"
      },
      checks: [
        "visitMonitor",
        "filterFailed",
        "openFailedMessage",
        "rootCauseSelected",
        "dataStoreChecked",
        "jmsMonitor",
        "lockCleared",
        "retryMessage"
      ]
    },
    {
      id: "exam-18",
      title: "B2B partner onboarding for inbound purchase orders",
      domain: "B2B and partners",
      difficulty: "Applied",
      timeLimit: 40,
      scenario: "Onboard a trading partner that sends purchase orders through AS2. Convert the EDI message and route it to an IDoc receiver.",
      objectives: [
        "Create a partner profile, agreement, and partner directory entry.",
        "Use AS2 sender and IDoc receiver.",
        "Apply EDI mapping and deploy the iFlow."
      ],
      expected: {
        package: "B2B",
        iflow: "Purchase",
        senderAdapter: "AS2",
        receiverAdapter: "IDoc"
      },
      checks: [
        "visitPartners",
        "partnerProfile",
        "partnerAgreement",
        "partnerDirectory",
        "ediMapping",
        "senderAdapter",
        "receiverAdapter",
        "deployIFlow"
      ]
    },
    {
      id: "exam-19",
      title: "Sender endpoint authorization and access policy",
      domain: "Security",
      difficulty: "Core",
      timeLimit: 30,
      scenario: "Restrict a sender endpoint so only authorized clients can call it. Configure endpoint path, client certificate material, sender role, and access policy.",
      objectives: [
        "Configure HTTPS sender endpoint details.",
        "Add certificate material and sender authorization role.",
        "Create an access policy and deploy."
      ],
      expected: {
        package: "Secure",
        iflow: "Secure",
        senderAdapter: "HTTPS"
      },
      checks: [
        "createIFlow",
        "senderAdapter",
        "endpointPath",
        "certificateImported",
        "roleMessageSend",
        "accessPolicy",
        "deployIFlow"
      ]
    },
    {
      id: "exam-20",
      title: "End-to-end integration developer mock practical",
      domain: "Full practical",
      difficulty: "Challenge",
      timeLimit: 55,
      scenario: "Complete a compressed end-to-end build: activate capabilities, build and deploy an iFlow, secure it, expose it as an API, create an event queue, and prove monitoring readiness.",
      objectives: [
        "Set up Cloud Integration, API Management, and Event Mesh readiness.",
        "Build and deploy a secure iFlow.",
        "Expose the flow as an API product and verify events plus monitoring."
      ],
      expected: {
        package: "Mock",
        iflow: "Mock",
        senderAdapter: "HTTPS",
        receiverAdapter: "OData",
        proxy: "Mock",
        basePath: "mock",
        queue: "mock",
        topic: "mock"
      },
      checks: [
        "capCloud",
        "capApi",
        "capEvent",
        "createPackage",
        "createIFlow",
        "senderAdapter",
        "receiverAdapter",
        "oauthCredential",
        "deployIFlow",
        "createProxy",
        "quotaPolicy",
        "publishProduct",
        "createQueue",
        "topicSubscription",
        "filterCompleted",
        "viewTrace"
      ]
    }
  ];
  window.CTRL_ALT_DEFEAT_CONTENT = {
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
  };
})();
