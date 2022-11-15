/* eslint-disable react-hooks/rules-of-hooks */
import create from "zustand";
import createContext from "zustand/context";
import useSpotify from "@/hooks/useSpotify";
import { useCallback } from "react";

export const { Provider, useStore } = createContext();

export default function SpotifyProvider( { children } ) {

	return <Provider createStore={createStore}>
		{children}
	</Provider>;

}

export const useSpotifyStore = () => create( ( set, get ) => {

	console.log( "init" );
	const spotifyApi = useSpotify();
	console.log( "spotifyApi: ", spotifyApi );

	return {
		playlists: [],
		tracks: [],
		fetchPlaylistData: useCallback( async () => {

			spotifyApi.getMe().then( ( currentUser ) => {

				console.log( "spotifyApi (2): ", spotifyApi );

				const id = currentUser.id;
				spotifyApi.getUserPlaylists( id, { limit: 50 } ).then( ( newPlaylists ) => {

					const newItems = newPlaylists.items;
					const newUserCreatedPlaylists = newItems.filter( p => p.owner.id === id );
					if ( newItems.length <= 50 ) {

						set( { playlists: newUserCreatedPlaylists } );

					} else {

						spotifyApi.getUserPlaylists( id, { limit: 50, offset: 50 } ).then( ( midPlaylists ) => {

							const midItems = midPlaylists.items;
							const midUserCreatedPlaylists = midItems.filter( p => p.owner.id === id );
							const tempArr = newUserCreatedPlaylists.concat( midUserCreatedPlaylists );
							if ( midItems.length <= 50 ) {

								set( { playlists: tempArr } );


							} else {

								spotifyApi.getUserPlaylists( id, { limit: 50, offset: 100 } ).then( ( oldPlaylists ) => {

									const oldItems = oldPlaylists.items;
									const oldUserCreatedPlaylists = oldItems.filter( p => p.owner.id === id );
									set( { playlists: tempArr.concat( oldUserCreatedPlaylists ) } );

								} );

							}

						} );

					}

				} );

			} );

		}, [ spotifyApi ] ),
		fetchLikedTracks: useCallback( async ( maxPages = 5 ) => {

			spotifyApi.getMySavedTracks( { limit: 50 } ).then( firstTracks => {

				const tempTracks = firstTracks.items.map( t => t.track );
				if ( firstTracks.total <= 50 ) {

					set( { tracks: tempTracks } );

				} else {

					for ( let i = 1; i < Math.min( ( firstTracks.total / 50 + 1 ), maxPages ); i ++ ) {

						spotifyApi.getMySavedTracks( { limit: 50, offset: i * 50 } ).then( olderTracks => {

							olderTracks.items.forEach( t => {

								tempTracks.push( t.track );

							} );

						} );

					}

					set( { tracks: tempTracks } );

				}

			} );

		}, [ spotifyApi ] )

	};

} );


