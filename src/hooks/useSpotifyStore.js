/* eslint-disable react-hooks/rules-of-hooks */
import create from "zustand";

export const useSpotifyStore = create( ( set, get ) => {

	return {
		playlists: [],
		tracks: [],
		fetchPlaylistData: async ( spotifyApi ) => {

			console.log( "fetching playlists" );
			spotifyApi.getMe().then( ( currentUser ) => {

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

		},
		fetchLikedTracks: async ( spotifyApi, maxPages = 5 ) => {

			console.log( "fetching liked tracks" );
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

		},

	};

} );


