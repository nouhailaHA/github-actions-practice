const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const FILE = "counter.json";

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
    <html>
    <head>
        <title>Dashboard Visites</title>
        <style>
            body {
                font-family: Arial;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                text-align: center;
                padding: 20px;
            }
            .card {
                background: white;
                color: black;
                padding: 20px;
                margin: 20px auto;
                border-radius: 10px;
                width: 80%;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            }
            h1 {
                font-size: 40px;
            }
            .info {
                text-align: left;
                font-size: 16px;
            }
            ul {
                list-style: none;
                padding: 0;
            }
            li {
                padding: 10px;
                border-bottom: 1px solid #ddd;
            }
            .ip {
                font-weight: bold;
                color: #333;
            }
            .date {
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>

        <h1>Dashboard des visites</h1>

        <div class="card info">
            <h2>Informations du projet</h2>
            <p><strong>Nom :</strong> Nouhaila Hafdane</p>
            <p><strong>Master :</strong> Genie Logiciel pour le Cloud Computing</p>
            <p><strong>Module :</strong> DevOps</p>
            <p><strong>Professeur :</strong> Dr Abderrahmane Laraqui</p>
            <p><strong>Projet :</strong> Application Node.js avec CI/CD sur Azure</p>
        </div>

        <div class="card">
            <h2>Nombre total de visites</h2>
            <p style="font-size:30px;">${data.count}</p>
        </div>

        <div class="card">
            <h2>Derniers visiteurs</h2>
            <ul>
                ${data.visitors.map(v => `
                    <li>
                        <div class="ip">IP : ${v.ip}</div>
                        <div class="date">${v.date}</div>
                        <div>${v.userAgent}</div>
                    </li>
                `).join("")}
            </ul>
        </div>

    </body>
    </html>
    `;

    res.send(html);
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});