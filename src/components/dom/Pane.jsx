import React, { useEffect, useRef } from 'react';
import { Pane } from "tweakpane";
import { useClientStore } from "@/hooks/useStore";

export default function Page() {

	const parent = useRef();
	const paneSettings = useClientStore( s => s.paneSettings );

	useEffect( () => {

		if ( ! parent.current ) return;
		const pane = new Pane( { title: "Transition Shader", container: parent.current } );

		pane.addInput( paneSettings, "scale", { min: 0, max: 3, label: "uCircleScale" } );
		pane.refresh();

	}, [] );

	return <div ref={parent}/>;

}


