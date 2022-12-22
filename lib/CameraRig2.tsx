
export async function CameraRig() {

	return await import( "three-story-controls" ).then( c => c.CameraRig );

}
