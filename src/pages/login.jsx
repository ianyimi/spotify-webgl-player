import { getProviders, signIn } from "next-auth/react";

export default function Login( { providers } ) {

	function spotifySignIn( e, id ) {

		e.preventDefault();
		signIn( id, { callbackUrl: "/" } );

	}

	return (
		<div>
			{Object.values( providers ).map( ( provider ) => (
				<div key={provider.name}>
					<button onClick={( e ) => spotifySignIn( e, provider.id )}>Login with {provider.name}</button>
				</div>
			) )
			}
		</div>
	);

}

export async function getServerSideProps() {

	const providers = await getProviders();
	return {
		props: {
			providers
		}
	};

}
