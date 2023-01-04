import dynamic from "next/dynamic";

const VintageTelevision = dynamic( () => import( "@/models/VintageTelevision.tsx" ), { ssr: false } );

export default function Error() {

	return <h1>404 - Something went wrong</h1>;

}

Error.canvas = ( props ) => {

	const hostUrl = "https://dqeczc7c9n9n1.cloudfront.net/images";

	return <VintageTelevision url={`${hostUrl}/404.png`}/>;

};
