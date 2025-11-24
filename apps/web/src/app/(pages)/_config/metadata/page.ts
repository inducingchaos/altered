/**
 *
 */

import { Metadata } from "next"
import { application, localization } from "~/config"

/**
 * @todo [P3] Review all metadata values.
 */
export const metadata: Metadata = {
    metadataBase: application.locations.origins.current,
    title: {
        default: localization.identity.name,
        template: `%s | ${localization.identity.name}`
    },
    description: localization.identity.description,
    keywords: [],
    authors: [{ name: localization.identity.name }],
    creator: localization.identity.name,
    publisher: localization.identity.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: application.locations.origins.current,
        siteName: localization.identity.name,
        title: localization.identity.name,
        description: localization.identity.description,
        images: []
    },
    twitter: {
        card: "summary_large_image",
        title: localization.identity.name,
        description: localization.identity.description,
        images: [],
        creator: "@usealtered"
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1
        }
    },
    verification: {},
    alternates: {
        canonical: application.locations.origins.current
    },
    category: "",
    classification: ""
}
