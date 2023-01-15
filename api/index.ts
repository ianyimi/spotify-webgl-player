import type SpotifyWebApi from "spotify-web-api-node";

import { fetchUserLikedPlaylists } from "./fetchUserLikedPlaylist";
import { fetchUserCreatedPlaylists } from "./fetchUserCreatedPlaylist";
import { fetchPlaylistData } from "./fetchPlaylistData";

export type SpotifyApi = SpotifyWebApi

export {
	fetchUserLikedPlaylists,
	fetchUserCreatedPlaylists,
	fetchPlaylistData
};

export const config = { limit: 50 };

export function handleError( error ) {

	return { ...error.body };

}

