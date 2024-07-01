const Service = require("node-windows").Service;
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.resolve(__dirname, "./production.env"),
});

const envType = process.argv[3] || "production"; // Default to production if no argument provided
dotenv.config({
    path: path.resolve(__dirname, `./${envType}.env`),
});

const svc = new Service({
    name: "(WEB) Jef App (NodeJs)",
    description:
        "Serveur NodeJs pour l'application Jef App. Ce service gère le back-end et le front-end de l'application Jef App.",
    script: require("path").join(__dirname, "src", "old_server.js"),
    nodeOptions: ["--harmony", "--max_old_space_size=4096"],
    user: {
        domain: process.env.SERVICE_DOMAIN,
        account: process.env.SERVICE_ACCOUNT,
        password: process.env.SERVICE_PASSWORD,
    },
});

svc.logOnAs.domain = process.env.SERVICE_DOMAIN;
svc.logOnAs.account = process.env.SERVICE_ACCOUNT;
svc.logOnAs.password = process.env.SERVICE_PASSWORD;

svc.on("error", (err) => {
    console.log("Error occurred while running the service:", err);
});

svc.on("start", () => {
    console.log("Service started successfully.");
});

svc.on("stop", () => {
    console.log("Service stopped successfully.");
});

svc.on("restart", () => {
    console.log("Service restarted successfully.");
});

svc.on("alreadyinstalled", () => {
    console.log("Service is already installed.");
});

svc.on("invalidinstallation", () => {
    console.log("Invalid installation.");
});

svc.on("install", () => {
    svc.start();
    console.log("Service installed and started successfully.");
});

svc.on("uninstall", () => {
    console.log("Service uninstalled.");
    // Additional cleanup logic can be placed here if needed
});

// Function to install the service
function installService() {
    console.log("Final service user configuration:", svc.user);
    svc.install();
}

// Function to uninstall the service
function uninstallService() {
    svc.uninstall();
}

// You can add a simple command line argument to control whether to install or uninstall
const action = process.argv[2]; // get command argument (install or uninstall)

if (action === "install") {
    installService();
} else if (action === "uninstall") {
    uninstallService();
} else if (action === "restart") {
    svc.restart();
} else if (action === "start") {
    svc.start();
} else if (action === "stop") {
    svc.stop();
} else {
    console.log(
        "Invalid action. Usage: node windows-service.js [install|uninstall]",
    );
}
