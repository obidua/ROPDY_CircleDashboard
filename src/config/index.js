import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
// import { mainnet, arbitrum, sepolia } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
// export const projectId = import.meta.env.VITE_PROJECT_ID || "5a7ca96b4c20a6f220b969a9e91203d8" // this is a public projectId only to use on localhost


export const projectId = "873812794aa2b8e7d9046d165c1542c6" // this is a public projectId only to use on localhost

const ramesttaNetwork = {
    id: 1370,
    name: 'Ramestta',
    nativeCurrency: {
        name: 'Rama',
        symbol: 'RAMA',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [
                'https://blockchain.ramestta.com',
                'https://blockchain2.ramestta.com'
            ],
        },
        public: {
            http: [
                'https://blockchain.ramestta.com',
                'https://blockchain2.ramestta.com',
            ],
        },
    },
    blockExplorers: {
        default: {
            name: 'Ramascan',
            url: 'https://ramascan.com/',
        },
    },
    testnet: false,
}

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export const metadata = {
    name: 'Ropdy',
    description: 'A Decentralized Earning Platform',
    url: 'https://dapp.ropdy.com',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Networks array (no type assertion needed in JS)
export const networks = [ramesttaNetwork]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks
})

export const config = wagmiAdapter.wagmiConfig
