const PROXY_CONFIG = [
    {
        context: [
            "/NonSportsGamesStatistics",
            "/Login",
            "/Entities",
            "/api",
            "/state-api"
        ],
        target: "https://localhost:44383",
        secure: false
    }
]

module.exports = PROXY_CONFIG;