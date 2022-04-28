/* eslint-disable no-undef */
module.exports = {
    experimental: {
        outputStandalone: true
    },
    async rewrites() {
        return [
            {
                source: "/landing",
                destination: "/landing/index.html"
            }
        ]
    }
};