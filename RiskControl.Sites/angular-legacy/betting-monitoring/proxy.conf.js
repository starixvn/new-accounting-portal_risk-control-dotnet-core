const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/state-api"
        ],
        target: "http://localhost:44383",
        secure: false
    }
]

module.exports = PROXY_CONFIG;
