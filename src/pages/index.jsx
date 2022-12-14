import dynamic from 'next/dynamic';
import Dashboard from '/src/components/dom/Dashboard';
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { spotifyApi } from "/src/templates/hooks/useSpotify";
import { fetchUserLikedPlaylists } from "../../lib/api";

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Pane = dynamic( () => import( '@/components/dom/Pane' ), { ssr: false } );
const Playlists = dynamic( () => import( '@/components/canvas/Playlists' ), { ssr: false } );
const Points = dynamic( () => import( '@/components/canvas/Points' ), { ssr: false } );
const Environment = dynamic( () => import( '@/components/canvas/Environment' ), { ssr: false } );
// const { CameraRig, CameraAction } = dynamic( () => import( "three-story-controls" ), { ssr: false } );
// const CameraAction = dynamic( () => import( "three-story-controls" ).then( c => c.CameraAction ), { ssr: false } );
import { Index } from "lib/CameraRig";

// if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
//   import("https://unpkg.com/three-story-controls@1.0.6/dist/three-story-controls.min.js");
// }

// Dom components go here
export default function Page( { playlists } ) {

  return (
    <div>
      <Pane/>
      {/*<Dashboard playlists={playlists}/>*/}
    </div>
  );

}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = ( { playlists, login } ) => {

  return (
    <group>
      <Environment cameraRig={Index}/>
      {( Boolean( playlists ) ) && <Playlists playlists={playlists} rowLength={5} position-y={- 1}/>}
      <mesh position-z={2.5}>
        <boxGeometry args={[ 1, 1 ]}/>
        <meshStandardMaterial color="green"/>
      </mesh>
    </group>
  );

};

export async function getServerSideProps( { req, res } ) {

  const session = await unstable_getServerSession( req, res, authOptions );

  console.log( "AWEAITED SESSION: ", await session );
  // console.log( "SESSION IS: ", session );
  if (! session) return {
    redirect: {
      destination: "login",
      permanent: false
    },
  };

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );


  spotifyApi.setAccessToken( await session.user.accessToken );
  const { total, playlists, error } = await fetchUserLikedPlaylists( spotifyApi );

  if (error) return {
    redirect: {
      destination: "login",
      permanent: false
    }
  };

  return {
    props: {
      title: "Spotify WebGl Player",
      session: await session,
      total: await total ?? null,
      playlists: await playlists ?? null
    }
  };

}
