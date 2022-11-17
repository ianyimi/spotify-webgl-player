const config = { limit: 50 };

export async function fetchUserPlaylists( api ) {

	try {

		const { body: { id } } = await api.getMe();
		const { body, body: { items } } = await api.getUserPlaylists( id, config );

		const userCreatedPlaylists = items.filter( p => p.owner.id === id );
		if ( body.total < 50 ) {

			return {
				playlists: userCreatedPlaylists
			};

		}

		for ( let i = 50; i < body.total; i += 50 ) {

			const { body: { items: nextPagePlaylists } } = await api.getUserPlaylists( id, { ...config, offset: i * 50 } );
			nextPagePlaylists.forEach( p => {

				if ( p.owner.id === id ) {

					userCreatedPlaylists.push( p );

				}

			} );

		}

		return {
			playlists: userCreatedPlaylists,
			total: body.total
		};

	} catch ( err ) {

		console.error( "Error fetching Playlist Tracks: ", err.body );

	}

}

export async function fetchPlaylistData( api, id ) {

	try {

		const { body, body: { tracks } } = await api.getPlaylist( id );
		if ( body.total < 50 ) {

			return {
				url: body.images[ 0 ].url,
				items: tracks.items
			};

		}

		const totalTracks = tracks.items;
		for ( let i = 50; i < tracks.total; i += 50 ) {

			const { body: { items: nextTracks } } = await api.getPlaylistTracks( id, { ...config, offset: i * 50 } );
			nextTracks.forEach( t => t.owner.id === id && totalTracks.push( t ) );

		}

		return {
			url: body.images[ 0 ].url,
			items: totalTracks
		};


	} catch ( err ) {

		console.error( "Error fetching Playlist Tracks: ", err.body );

	}

}
