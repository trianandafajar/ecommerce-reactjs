import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://keysthetix.trianandafajar.com'
const SITE_NAME = 'Keysthetix'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
const DEFAULT_DESCRIPTION = 'Discover Keysthetix — your destination for premium mechanical keyboards, keycaps, switches, and accessories. Elevate your typing experience.'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'product'
  noIndex?: boolean
  breadcrumbs?: { name: string; url: string }[]
  product?: {
    name: string
    price: number
    currency?: string
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
    image: string
    description: string
    sku?: string
    brand?: string
    category?: string
  }
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noIndex = false,
  breadcrumbs,
  product,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Premium Keyboards & Accessories`
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        ...(product.sku && { sku: product.sku }),
        ...(product.brand && {
          brand: { '@type': 'Brand', name: product.brand },
        }),
        ...(product.category && { category: product.category }),
        offers: {
          '@type': 'Offer',
          url: fullUrl,
          priceCurrency: product.currency ?? 'USD',
          price: product.price,
          availability: `https://schema.org/${product.availability ?? 'InStock'}`,
          seller: { '@type': 'Organization', name: SITE_NAME },
        },
      }
    : null

  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          ...breadcrumbs.map((crumb, i) => ({
            '@type': 'ListItem',
            position: i + 2,
            name: crumb.name,
            item: `${SITE_URL}${crumb.url}`,
          })),
        ],
      }
    : null

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type === 'product' ? 'product' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD schemas */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  )
}