import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { MDXProvider } from '@mdx-js/react'
import { NextSeo } from 'next-seo';
import { Layout } from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import { useMobileNavigationStore } from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'

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
      </Head>
      <NextSeo
        title={router.pathname === '/' ? 'Phase Docs' : `${pageProps.title} - Phase Docs`}
        description='Phase Documentation'
        openGraph={{
          title: router.pathname === '/' ? 'Phase Docs' : `${pageProps.title} - Phase Docs`,
          description: pageProps.description,
          url: window.location.href,
          locale: 'en',
          site_name: 'Phase DOCS',
          images: [
            {
              url: `${router.basePath}/assets/images/docs-meta.png`,
              width: 1200,
              height: 630,
              alt: 'docs.hase.dev',
              type: 'image/png',
            },
          ],
        }}
      />
      <MDXProvider components={mdxComponents}>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
    </>
  )
}
