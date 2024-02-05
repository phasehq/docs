import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'
import { NextSeo } from 'next-seo';
import { Layout } from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import dynamic from 'next/dynamic';
import '@/styles/tailwind.css'
import '@/styles/asciinema-player.css'
import 'focus-visible'

// Dynamically import PostHogProvider with SSR turned off
const PostHogProvider = dynamic(
  () => import('posthog-js/react').then(mod => mod.PostHogProvider),
  { ssr: false }
);

const options = {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
}

function onRouteChange() {
  useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()

  return (
    <>
      <Head>
        {router.pathname === '/' ? (
          <title>Phase Docs</title>
        ) : (
          <title>{`${pageProps.title} - Phase Docs`}</title>
        )}
        <meta name="description" content={pageProps.description} />
        <link
          rel="icon"
          type="image/svg+xml"
          href={`${router.basePath}/favicon.svg`}
          key="favicon"
        />
        <link
          rel="mask-icon"
          type="image/svg+xml"
          href={`${router.basePath}/favicon.svg`}
          key="favicon-safari"
          color="#000000"
        />
      </Head>
      <NextSeo
        title={router.pathname === '/' ? 'Phase Docs' : `${pageProps.title} - Phase Docs`}
        description='Phase Documentation'
        openGraph={{
          title: router.pathname === '/' ? 'Phase Docs' : `${pageProps.title} - Phase Docs`,
          description: pageProps.description,
          url: `https://docs.phase.dev${router.pathname}`,
          locale: 'en',
          site_name: 'Phase DOCS',
          images: [
            {
              url: `${router.basePath}/assets/images/docs-meta.png`,
              width: 1200,
              height: 630,
              alt: 'https://docs.phase.dev',
              type: 'image/png',
            },
          ],
        }}
      />
      <PostHogProvider 
      apiKey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
      options={options}
      >
      <MDXProvider components={mdxComponents}>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
      </PostHogProvider>
    </>
  )
}
