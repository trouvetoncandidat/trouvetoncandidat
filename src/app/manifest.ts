import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'TrouveTonCandidat.fr',
        short_name: 'TrouveTonCandidat',
        description: 'Comparez les programmes des candidats à l\'élection présidentielle 2027.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000091',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    }
}
