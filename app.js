const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const path = require("path");
const FILE = path.join(__dirname, "counter.json");

// Initialisation
if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify({
        count: 0,
        visitors: []
    }, null, 2));
}

app.get("/", (req, res) => {
    let data;

    try {
        data = JSON.parse(fs.readFileSync(FILE));
    } catch (err) {
        data = { count: 0, visitors: [] };
    }

    const visitor = {
        ip: req.ip,
        date: new Date().toLocaleString(),
        userAgent: req.headers["user-agent"]
    };

    data.count += 1;
    data.visitors.push(visitor);

    if (data.visitors.length > 10) {
        data.visitors = data.visitors.slice(-10);
    }

    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    // IMPORTANT: utiliser une variable pour éviter erreurs template
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Dashboard DevOps</title>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #1e3c72, #2a5298);
    color: white;
    padding: 30px;
}

.container {
    max-width: 1100px;
    margin: auto;
}

h1 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 38px;
}

/* GRID */
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

/* CARD */
.card {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
    transition: 0.3s;
}

.card:hover {
    transform: translateY(-5px);
}

/* TITLES */
.card h2 {
    margin-bottom: 15px;
    font-size: 22px;
}

/* COUNTER */
.counter {
    font-size: 50px;
    font-weight: bold;
    text-align: center;
    color: #00ffcc;
}

/* INFO */
.info p {
    margin: 5px 0;
}

/* VISITORS */
.visitor {
    background: rgba(255,255,255,0.15);
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
}

.ip {
    font-weight: bold;
}

.date {
    font-size: 13px;
    opacity: 0.8;
}

/* FOOTER */
.footer {
    text-align: center;
    margin-top: 30px;
    opacity: 0.7;
    font-size: 14px;
}

</style>
</head>

<body>

<div class="container">

    <h1> Dashboard DevOps</h1>

    <div class="grid">

        <!-- INFOS -->
        <div class="card info">
            <h2>📘 Informations</h2>
            <p><strong>Nom :</strong> Nouhaila Hafdane</p>
            <p><strong>Master :</strong> Génie Logiciel Cloud</p>
            <p><strong>Module :</strong> DevOps</p>
            <p><strong>Prof :</strong> Dr Laraqui</p>
            <p><strong>Projet :</strong> CI/CD Azure</p>
        </div>

        <!-- COUNTER -->
        <div class="card">
            <h2>👥 Total des visites</h2>
            <div class="counter">${data.count}</div>
        </div>

        <!-- SERVER INFO -->
        <div class="card">
            <h2>⚙️ Infos serveur</h2>
            <p>🕒 ${new Date().toLocaleString()}</p>
            <p>🌍 ${req.headers.host}</p>
            <p> Node.js App Active</p>
        </div>

    </div>

    <!-- VISITORS -->
    <div class="card" style="margin-top:20px;">
        <h2>🕒 Derniers visiteurs</h2>

        ${data.visitors.map(v => `
            <div class="visitor">
                <div class="ip">IP : ${v.ip}</div>
                <div class="date">${v.date}</div>
                <div>${v.userAgent}</div>
            </div>
        `).join("")}

    </div>

    <div class="footer">
        © 2026 - Projet DevOps CI/CD Azure
    </div>

</div>

</body>
</html>
`;

    res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log("Server running on port " + PORT);
});