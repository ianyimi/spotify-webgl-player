import dynamic from "next/dynamic";
import { trpc } from "../../utils/trpc";

const VintageTelevision = dynamic( () => import( "@/models/VintageTelevision.tsx" ), { ssr: false } );
const demoUrl = "0KQGeTlSOr3vtLDRChS1FQ";

export default function Playlist() {

	const trackNames = [];

	const { data } = trpc.fetchPlaylistData.useQuery( { id: demoUrl } );

	if ( ! data ) return <div>loading...</div>;

	data.items.forEach( item => {

		if ( ! item.track ) return;
		const track = item.track;
		trackNames.push(
			<div key={track.id}>{track.name} - {track.artists[ 0 ].name}</div>
		);

	} );


	return <div>{trackNames}</div>;

}

Playlist.canvas = () => {

	const { data } = trpc.fetchPlaylistData.useQuery( { id: demoUrl } );

	if ( ! data ) {

		return <group>
			<mesh>
				<boxBufferGeometry args={[ 0.5, 0.5, 0.5 ]} />
				<meshBasicMaterial color="yellow" />
			</mesh>
		</group>;

	}

	return <group>
		<VintageTelevision url={data.imageUrl} route={"/"}/>
	</group>;

};
