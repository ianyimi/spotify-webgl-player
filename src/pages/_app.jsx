import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/config';
import Layout from '@/components/dom/Layout';
import '@/styles/index.css';
import Scroll from "@/templates/Scroll";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

const Scene = dynamic( () => import( '@/components/canvas/Scene' ), { ssr: true } );

export default function App( {
  Component,
  pageProps = { title: 'Spotify WebGl Player', session, playlists, ...pageProps }
} ) {

  const ref = useRef();
  return (
    <>
      <Header title={pageProps.title}/>
      <SessionProvider session={pageProps.session} refetchOnWindowFocus>
        <Layout ref={ref}>
          {/* The canvas can either be in front of the dom or behind. If it is in front it can overlay contents.
         * Setting the event source to a shared parent allows both the dom and the canvas to receive events.
         * Since the event source is now shared, the canvas would block events, we prevent that with pointerEvents: none. */}
          {( Boolean( ( Component?.canvas ) ) ) && (
            <Scene
              // className="pointer-events-none"
              eventSource={ref}
              eventPrefix="client"
            >
              {Component.canvas( pageProps )}
            </Scene>
          )}
          <Scroll>
            <Script async src="https://unpkg.com/es-module-shims@0.11.1/dist/es-module-shims.js"/>
            <Script type="importmap-shim">
              {`
                "imports": {
                  "three": "https://cdn.skypack.dev/three@0.137.0",
                  "gsap": "https://cdn.skypack.dev/gsap@3.6.1",
                  "three-story-controls": "../lib/three-story-controls"
                }
              `}
            </Script>
            <Component {...pageProps} />
          </Scroll>
        </Layout>
      </SessionProvider>
    </>
  );

}
