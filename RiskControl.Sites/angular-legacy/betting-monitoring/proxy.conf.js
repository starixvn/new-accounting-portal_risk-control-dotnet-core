const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/state-api"
        ],
        target: "http://localhost:60809",
        secure: false
    }
]

module.exports = PROXY_CONFIG;