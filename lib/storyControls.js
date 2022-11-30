import {
	Vector3 as t,
	EventDispatcher as e,
	Object3D as i,
	PerspectiveCamera as s,
	Quaternion as n,
	Euler as o,
	AnimationMixer as a,
	AnimationClip as r,
	VectorKeyframeTrack as h,
	QuaternionKeyframeTrack as d
} from "three";
import c from "gsap";

class l {

	constructor( t ) {

		this.epsilon = .001, this.values = {}, this.targetValues = {}, this.deltaValues = {}, Object.assign( this.values, t.values ), Object.assign( this.targetValues, t.values ), this.deltaValues = {};
		for ( const t in this.values ) this.deltaValues[ t ] = 0;
		this.dampingFactor = t.dampingFactor, t.epsilon && ( this.epsilon = t.epsilon ), this.hasReached = ! 0;

	}

	update() {

		const t = {};
		let e = ! 0;
		for ( const i in this.values ) t[ i ] = this.targetValues[ i ] - this.values[ i ], e = e && Math.abs( t[ i ] ) < this.epsilon;
		if ( e ) {

			for ( const e in this.values ) this.deltaValues[ e ] = t[ e ], this.values[ e ] = this.targetValues[ e ];
			this.hasReached = ! 0;

		} else for ( const e in this.values ) this.deltaValues[ e ] = this.dampingFactor * t[ e ], this.values[ e ] += this.deltaValues[ e ];

	}

	setTarget( t ) {

		for ( const e in t ) this.targetValues[ e ] = t[ e ];
		this.hasReached = ! 1;

	}

	addToTarget( t, e ) {

		this.targetValues[ t ] += e, this.hasReached = ! 1;

	}

	resetAll( t ) {

		for ( const e in this.values ) this.targetValues[ e ] = t, this.values[ e ] = t, this.deltaValues[ e ] = 0;
		this.hasReached = ! 0;

	}

	resetData( t ) {

		for ( const e in t ) this.targetValues[ e ] = t[ e ], this.values[ e ] = t[ e ], this.deltaValues[ e ] = 0;
		this.hasReached = ! 0;

	}

	getCurrentValues() {

		return Object.assign( {}, this.values );

	}

	getDeltaValues() {

		return Object.assign( {}, this.deltaValues );

	}

	reachedTarget() {

		return this.hasReached;

	}

}

let p, m, u;
! function ( t ) {

	t.Pan = "Pan", t.Tilt = "Tilt", t.Roll = "Roll", t.Truck = "Truck", t.Pedestal = "Pedestal", t.Dolly = "Dolly", t.Zoom = "Zoom";

}( p || ( p = {} ) ), function ( t ) {

	t.Body = "body", t.Head = "head", t.Eyes = "eyes";

}( m || ( m = {} ) ), function ( t ) {

	t.X = "x", t.Y = "y", t.Z = "z";

}( u || ( u = {} ) );
const g = { [ u.X ]: new t( 1, 0, 0 ), [ u.Y ]: new t( 0, 1, 0 ), [ u.Z ]: new t( 0, 0, 1 ) }, b = {
	[ u.X ]: { [ p.Pan ]: u.X, [ p.Tilt ]: u.Z, [ p.Roll ]: u.Y },
	[ u.Y ]: { [ p.Pan ]: u.Y, [ p.Tilt ]: u.X, [ p.Roll ]: u.Z },
	[ u.Z ]: { [ p.Pan ]: u.Z, [ p.Tilt ]: u.Y, [ p.Roll ]: u.X }
};

class y extends e {

	constructor( t, e ) {

		super(), this.inTransit = ! 1, this.upAxis = u.Y, this.actionAxes = b[ this.upAxis ], this.hasAnimation = ! 1, this.animationTranslationObjectName = "Translation", this.animationRotationObjectName = "Rotation", this.translateAlong = {
			[ p.Tilt ]: ! 1,
			[ p.Pan ]: ! 0,
			[ p.Roll ]: ! 1
		}, this.camera = t, this.scene = e, this.body = new i(), this.head = new i(), this.eyes = new i(), this.head.name = this.animationRotationObjectName, this.body.name = this.animationTranslationObjectName, this.body.rotation.order = this.getRotationOrder(), this.head.rotation.order = this.getRotationOrder(), this.eyes.rotation.order = this.getRotationOrder(), this.scene.add( this.body.add( this.head.add( this.eyes.add( this.camera ) ) ) ), this.cameraIsInRig = ! 0, this.unpackTransform();

	}

	getAxisFor( t ) {

		return this.actionAxes[ t ];

	}

	getAxisVectorFor( t ) {

		return g[ this.actionAxes[ t ] ];

	}

	do( t, e, i ) {

		const n = this[ i ];
		switch ( t ) {

			case p.Pan:
			case p.Tilt:
			case p.Roll: {

				const i = this.getAxisVectorFor( t );
				n ? n.rotateOnAxis( i, e ) : this.translateAlong[ t ] ? this.body.rotateOnAxis( i, e ) : this.eyes.rotateOnAxis( i, e );
				break;

			}

			case p.Truck: {

				const t = this.getAxisVectorFor( p.Tilt );
				( n || this.body ).translateOnAxis( t, e );
				break;

			}

			case p.Pedestal: {

				const t = this.getAxisVectorFor( p.Pan );
				( n || this.body ).translateOnAxis( t, e );
				break;

			}

			case p.Dolly: {

				const t = this.getAxisVectorFor( p.Roll );
				( n || this.body ).translateOnAxis( t, e );
				break;

			}

			case p.Zoom:
				this.camera instanceof s && ( this.camera.fov = e, this.camera.updateProjectionMatrix() );

		}

	}

	getWorldCoordinates() {

		const e = new t();
		this.camera.getWorldPosition( e );
		const i = new n();
		return this.camera.getWorldQuaternion( i ), { position: e, quaternion: i };

	}

	setWorldCoordinates( { position: t, quaternion: e } ) {

		const i = ( new o() ).setFromQuaternion( e, this.getRotationOrder() ), s = [ p.Pan, p.Tilt, p.Roll ];
		this.eyes.position.set( 0, 0, 0 ), this.eyes.rotation.set( 0, 0, 0 ), this.head.position.set( 0, 0, 0 ), this.head.rotation.set( 0, 0, 0 ), this.body.position.copy( t ), s.forEach( ( t => {

			const e = this.getAxisFor( t );
			this.translateAlong[ t ] ? this.body.rotation[ e ] = i[ e ] : this.eyes.rotation[ e ] = i[ e ];

		} ) ), this.camera.rotation.set( 0, 0, 0 ), this.camera.position.set( 0, 0, 0 );

	}

	packTransform() {

		const { position: t, quaternion: e } = this.getWorldCoordinates();
		this.body.position.copy( t ), this.body.rotation.set( 0, 0, 0 ), this.head.quaternion.copy( e ), this.head.position.set( 0, 0, 0 ), this.eyes.position.set( 0, 0, 0 ), this.eyes.rotation.set( 0, 0, 0 );

	}

	unpackTransform() {

		const { position: t, quaternion: e } = this.getWorldCoordinates();
		this.setWorldCoordinates( { position: t, quaternion: e } );

	}

	disassemble() {

		this.cameraIsInRig && ( this.scene.attach( this.camera ), this.cameraIsInRig = ! 1 );

	}

	assemble() {

		this.cameraIsInRig || ( this.eyes.attach( this.camera ), this.unpackTransform(), this.cameraIsInRig = ! 0 );

	}

	getRotationOrder() {

		return Object.values( this.actionAxes ).join( "" ).toUpperCase();

	}

	isInRig() {

		return this.cameraIsInRig;

	}

	isMoving() {

		return this.inTransit;

	}

	setUpAxis( t ) {

		this.upAxis = t, this.actionAxes = b[ this.upAxis ], this.body.rotation.order = this.getRotationOrder();

	}

	setAnimationClip( t, e, i ) {

		this.animationClip = t, e && ( this.animationTranslationObjectName = e ), i && ( this.animationRotationObjectName = i ), this.hasAnimation = ! 0, this.animationClip.duration += .01, this.mixer = new a( this.body );
		const s = this.mixer.clipAction( this.animationClip );
		s.clampWhenFinished = ! 0, s.play();

	}

	flyTo( t, e, i = 1, s = "power1", o = ! 0 ) {

		if ( ! this.isMoving() ) {

			const a = this.getWorldCoordinates(), r = {
					px: a.position.x,
					py: a.position.y,
					pz: a.position.z,
					qx: a.quaternion.x,
					qy: a.quaternion.y,
					qz: a.quaternion.z,
					qw: a.quaternion.w,
					slerpAmt: 0
				}, h = { px: t.x, py: t.y, pz: t.z, qx: e.x, qy: e.y, qz: e.z, qw: e.w, slerpAmt: 1 }, d = new n(),
				l = new n( r.qx, r.qy, r.qz, r.qw ), p = () => {

					this.inTransit = ! 0, this.packTransform(), this.dispatchEvent( { type: "CameraMoveStart" } );

				}, m = t => {

					this.body.position.set( r.px, r.py, r.pz ), o ? ( d.slerpQuaternions( l, e, r.slerpAmt ), this.head.setRotationFromQuaternion( d ) ) : this.head.quaternion.set( r.qx, r.qy, r.qz, r.qw ), this.dispatchEvent( {
						type: "CameraMoveUpdate",
						progress: t.progress()
					} );

				}, u = () => {

					this.inTransit = ! 1, this.unpackTransform(), this.dispatchEvent( { type: "CameraMoveEnd" } );

				};

			c.to( r, Object.assign( Object.assign( { duration: i, ease: s }, h ), {
				onStart: p, onUpdate: function () {

					m( this );

				}, onComplete: u
			} ) );

		}

	}

	flyToKeyframe( t, e = 1, i = "power1" ) {

		if ( this.hasAnimation && ! this.isMoving() ) {

			const s = { time: this.mixer.time }, n = { time: this.animationClip.tracks[ 0 ].times[ t ] }, o = () => {

					this.inTransit = ! 0, this.dispatchEvent( { type: "CameraMoveStart" } );

				}, a = t => {

					this.mixer.setTime( s.time ), this.dispatchEvent( { type: "CameraMoveUpdate", progress: t.progress() } );

				}, r = () => {

					this.inTransit = ! 1, this.dispatchEvent( { type: "CameraMoveEnd" } );

				};

			c.to( s, Object.assign( Object.assign( { duration: e, ease: i }, n ), {
				onStart: o, onUpdate: function () {

					a( this );

				}, onComplete: r
			} ) );

		}

	}

	setAnimationPercentage( t ) {

		if ( this.hasAnimation ) {

			const e = Math.max( 0, Math.min( t * this.animationClip.duration, this.animationClip.duration - 1e-4 ) );
			this.mixer.setTime( e );

		}

	}

	setAnimationTime( t ) {

		this.hasAnimation && this.mixer.setTime( t );

	}

	setAnimationKeyframe( t ) {

		this.hasAnimation && this.mixer.setTime( this.animationClip.tracks[ 0 ].times[ t ] );

	}

}

class v extends e {

	constructor() {

		super();

	}

}

const f = {
	keyMapping: {
		forward: [ "ArrowUp", "w", "W" ],
		backward: [ "ArrowDown", "s", "S" ],
		left: [ "ArrowLeft", "a", "A" ],
		right: [ "ArrowRight", "d", "D" ],
		up: [ "u", "U" ],
		down: [ "n", "N" ]
	}, dampingFactor: .5, incrementor: 1, preventBubbling: ! 0
};

class x extends v {

	constructor( t ) {

		super(), Object.assign( this, f, t );
		const e = {};
		for ( const t in this.keyMapping ) e[ t ] = 0;
		this.damper = new l( {
			values: e,
			dampingFactor: this.dampingFactor
		} ), this.onKeyUp = this.onKeyUp.bind( this ), this.onKeyDown = this.onKeyDown.bind( this );

	}

	connect() {

		document.addEventListener( "keyup", this.onKeyUp, ! 0 ), document.addEventListener( "keydown", this.onKeyDown, ! 0 ), this.connected = ! 0;

	}

	disconnect() {

		document.removeEventListener( "keyup", this.onKeyUp, ! 0 ), document.removeEventListener( "keydown", this.onKeyDown, ! 0 ), this.connected = ! 1;

	}

	update() {

		"continuous" !== this.type || this.damper.reachedTarget() || ( this.damper.update(), this.dispatchEvent( {
			type: "update",
			values: this.damper.getCurrentValues(),
			deltas: this.damper.getDeltaValues()
		} ), this.damper.reachedTarget() && ( this.damper.resetAll( 0 ), this.dispatchEvent( { type: "inertiacomplete" } ) ) );

	}

	isEnabled() {

		return this.connected;

	}

	onKeyUp( t ) {

		if ( "discrete" === this.type ) for ( const e in this.keyMapping ) if ( this.keyMapping[ e ].includes( t.key ) ) {

			this.preventBubbling && t.preventDefault(), this.dispatchEvent( { type: "trigger", trigger: e } );
			break;

		}

	}

	onKeyDown( t ) {

		if ( "continuous" === this.type ) for ( const e in this.keyMapping ) if ( this.keyMapping[ e ].includes( t.key ) ) {

			this.preventBubbling && t.preventDefault(), this.damper.addToTarget( e, this.incrementor );
			break;

		}

	}

}

const w = {
	domElement: document.body,
	dampingFactor: .5,
	shouldNormalize: ! 0,
	normalizeAroundZero: ! 0,
	multipointerThreshold: 100
};

class E extends v {

	constructor( t ) {

		super(), this.domElement = document.body, this.shouldNormalize = ! 0, this.normalizeAroundZero = ! 0, this.pointerCount = 0, this.recordedPosition = ! 1, this.cache = [], this.lastDownTime = 0, this.lastUpTime = 0, Object.assign( this, w, t ), this.damper = new l( {
			values: {
				x: null,
				y: null
			}, dampingFactor: this.dampingFactor
		} ), this.setDimensions(), this.onPointerMove = this.onPointerMove.bind( this ), this.onPointerUp = this.onPointerUp.bind( this ), this.onPointerDown = this.onPointerDown.bind( this ), this.onResize = this.onResize.bind( this );

	}

	connect() {

		this.domElement.addEventListener( "pointermove", this.onPointerMove, { passive: ! 0 } ), this.domElement.addEventListener( "pointerdown", this.onPointerDown, { passive: ! 0 } ), this.domElement.addEventListener( "pointerleave", this.onPointerUp, { passive: ! 0 } ), this.domElement.addEventListener( "pointerup", this.onPointerUp, { passive: ! 0 } ), window.addEventListener( "resize", this.onResize ), this.connected = ! 0;

	}

	disconnect() {

		this.domElement.removeEventListener( "pointermove", this.onPointerMove ), this.domElement.removeEventListener( "pointerdown", this.onPointerDown ), this.domElement.removeEventListener( "pointerleave", this.onPointerUp ), this.domElement.removeEventListener( "pointerup", this.onPointerUp ), this.connected = ! 1;

	}

	update( t ) {

		this.pointerCount !== this.cache.length && t - this.lastDownTime > this.multipointerThreshold && t - this.lastUpTime > this.multipointerThreshold && ( this.pointerCount = this.cache.length, 0 === this.pointerCount ? ( this.damper.resetAll( null ), this.recordedPosition = ! 1 ) : ( this.damper.resetData( this.getPointerPosition( this.cache[ 0 ] ) ), this.recordedPosition = ! 0 ) ), this.damper.reachedTarget() || ( this.damper.update(), this.dispatchEvent( {
			type: "update",
			values: this.shouldNormalize ? this.normalize( this.damper.getCurrentValues(), this.normalizeAroundZero ) : this.damper.getCurrentValues(),
			deltas: this.shouldNormalize ? this.normalize( this.damper.getDeltaValues(), ! 1 ) : this.damper.getDeltaValues(),
			pointerCount: this.pointerCount
		} ), this.damper.reachedTarget() && this.dispatchEvent( { type: "inertiacomplete" } ) );

	}

	isEnabled() {

		return this.connected;

	}

	setDimensions() {

		this.width = this.domElement.getBoundingClientRect().width, this.height = this.domElement.getBoundingClientRect().height;

	}

	getPointerPosition( t ) {

		return {
			x: Math.max( 0, Math.min( this.width, t.x - this.domElement.offsetLeft ) ),
			y: Math.max( 0, Math.min( this.height, t.y - this.domElement.offsetTop ) )
		};

	}

	normalize( t, e ) {

		let i = t.x / this.width, s = t.y / this.height;
		return e && ( i = 2 * i - 1, s = 2 * s - 1 ), { x: i, y: s };

	}

	onPointerMove( t ) {

		this.pointerCount === this.cache.length && ( 0 === this.cache.length ? this.recordedPosition ? this.damper.setTarget( this.getPointerPosition( t ) ) : ( this.damper.resetData( this.getPointerPosition( t ) ), this.recordedPosition = ! 0 ) : t.pointerId === this.cache[ 0 ].pointerId && this.damper.setTarget( this.getPointerPosition( t ) ) );

	}

	onPointerDown( t ) {

		0 === t.button && ( this.cache.push( t ), this.lastDownTime = window.performance.now() );

	}

	onPointerUp( t ) {

		if ( 0 === t.button || "pointerleave" === t.type ) {

			for ( let e = 0; e < this.cache.length; e ++ ) if ( this.cache[ e ].pointerId == t.pointerId ) {

				this.cache.splice( e, 1 );
				break;

			}

			this.lastUpTime = window.performance.now();

		}

	}

	onResize() {

		this.setDimensions();

	}

}

const P = { startOffset: "0px", endOffset: "0px", buffer: .1, dampingFactor: .5 };

class T extends v {

	constructor( t ) {

		super(), Object.assign( this, P, t ), this.lastSeenScrollValue = window.scrollY || - 1, this.previousScrollValue = this.lastSeenScrollValue, this.values = {
			scrollPx: null,
			scrollPercent: null
		}, this.damper = new l( {
			values: this.values,
			dampingFactor: this.dampingFactor
		} ), this.calculateDimensions = this.calculateDimensions.bind( this ), this.onScroll = this.onScroll.bind( this ), this.resizeObserver = new ResizeObserver( this.calculateDimensions ), this.calculateDimensions();

	}

	connect() {

		window.addEventListener( "scroll", this.onScroll, { passive: ! 0 } ), this.resizeObserver.observe( document.body ), this.connected = ! 0;

	}

	disconnect() {

		window.removeEventListener( "scroll", this.onScroll ), this.resizeObserver.unobserve( document.body ), this.connected = ! 1;

	}

	update() {

		if ( this.lastSeenScrollValue !== this.previousScrollValue && this.lastSeenScrollValue >= this.bufferedStartPosition && this.lastSeenScrollValue <= this.bufferedEndPosition ) {

			const t = Math.max( 0, Math.min( this.distance, this.lastSeenScrollValue - this.startPosition ) ),
				e = Math.max( 0, Math.min( 1, t / this.distance ) );
			this.values = {
				scrollPx: t,
				scrollPercent: e
			}, this.damper.setTarget( this.values ), this.previousScrollValue = this.lastSeenScrollValue;

		}

		this.damper.reachedTarget() || ( this.damper.update(), this.dispatchEvent( {
			type: "update",
			values: this.values,
			dampenedValues: this.damper.getCurrentValues()
		} ), this.damper.reachedTarget() && this.dispatchEvent( { type: "inertiacomplete" } ) );

	}

	isEnabled() {

		return this.connected;

	}

	parseOffset( t ) {

		let e = 0;
		return t && ( e = parseInt( t ), - 1 !== t.indexOf( "vh" ) ? e = e * window.innerHeight / 100 : this.distance && - 1 !== t.indexOf( "%" ) && ( e = e * this.distance / 100 ) ), e;

	}

	calculateOffset( t ) {

		return t ? this.calculateOffset( t.offsetParent ) + t.offsetTop : 0;

	}

	calculateDimensions() {

		const t = this.scrollElement.clientHeight, e = this.calculateOffset( this.scrollElement );
		this.startPosition = e - window.innerHeight + this.parseOffset( this.startOffset ), this.endPosition = e + t + this.parseOffset( this.endOffset ), this.distance = this.endPosition - this.startPosition, this.bufferedStartPosition = Math.max( 0, this.startPosition * ( 1 - this.buffer ) ), this.bufferedEndPosition = Math.min( this.endPosition * ( 1 + this.buffer ), document.body.getBoundingClientRect().height );

	}

	onScroll() {

		this.lastSeenScrollValue = window.scrollY;

	}

}

const A = { domElement: document.body, thresholdX: 60, thresholdY: 60 };

class C extends v {

	constructor( t = {} ) {

		super(), Object.assign( this, A, t ), this.onPointerUp = this.onPointerUp.bind( this ), this.onPointerDown = this.onPointerDown.bind( this );

	}

	connect() {

		this.domElement.addEventListener( "pointerdown", this.onPointerDown, { passive: ! 0 } ), this.domElement.addEventListener( "pointerup", this.onPointerUp, { passive: ! 0 } ), this.connected = ! 0;

	}

	disconnect() {

		this.domElement.removeEventListener( "pointerdown", this.onPointerDown ), this.domElement.removeEventListener( "pointerup", this.onPointerUp ), this.connected = ! 1;

	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	update() {
	}

	isEnabled() {

		return this.connected;

	}

	onPointerDown( t ) {

		"mouse" !== t.pointerType && t.isPrimary && ( this.startX = t.screenX, this.startY = t.screenY );

	}

	onPointerUp( t ) {

		if ( "mouse" !== t.pointerType && t.isPrimary ) {

			const e = t.screenX - this.startX, i = t.screenY - this.startY;
			( Math.abs( e ) >= this.thresholdX || Math.abs( i ) >= this.thresholdY ) && this.dispatchEvent( {
				type: "trigger",
				x: Math.abs( e ) >= this.thresholdX ? Math.sign( e ) : 0,
				y: Math.abs( i ) >= this.thresholdY ? Math.sign( - 1 * i ) : 0
			} );

		}

	}

}

const L = { dampingFactor: .5, thresholdX: 15, thresholdY: 15, debounceDuration: 700 };

class S extends v {

	constructor( t ) {

		super(), this.lastThresholdTrigger = 0, Object.assign( this, L, t ), this.damper = new l( {
			values: { x: 0, y: 0 },
			dampingFactor: this.dampingFactor
		} ), this.onWheel = this.onWheel.bind( this );

	}

	connect() {

		( this.domElement || window ).addEventListener( "wheel", this.onWheel, { passive: ! 0 } ), this.connected = ! 0;

	}

	disconnect() {

		( this.domElement || window ).removeEventListener( "wheel", this.onWheel ), this.connected = ! 1;

	}

	update() {

		"continuous" !== this.type || this.damper.reachedTarget() || ( this.damper.update(), this.dispatchEvent( {
			type: "update",
			values: this.damper.getCurrentValues(),
			deltas: this.damper.getDeltaValues()
		} ), this.damper.reachedTarget() && ( this.damper.resetAll( 0 ), this.dispatchEvent( { type: "inertiacomplete" } ) ) );

	}

	isEnabled() {

		return this.connected;

	}

	onWheel( t ) {

		if ( "continuous" === this.type ) this.damper.addToTarget( "x", t.deltaX ), this.damper.addToTarget( "y", t.deltaY ); else if ( "discrete" === this.type && ( Math.abs( t.deltaX ) >= this.thresholdX || Math.abs( t.deltaY ) >= this.thresholdY ) ) {

			const e = window.performance.now();
			e - this.lastThresholdTrigger > this.debounceDuration && ( this.lastThresholdTrigger = e, this.dispatchEvent( {
				type: "trigger",
				x: Math.abs( t.deltaX ) >= this.thresholdX ? Math.sign( t.deltaX ) : 0,
				y: Math.abs( t.deltaY ) >= this.thresholdY ? Math.sign( t.deltaY ) : 0
			} ) );

		}

	}

}

const I = {
	domElement: document.body,
	pointerDampFactor: .3,
	pointerScaleFactor: 4,
	keyboardDampFactor: .5,
	keyboardScaleFactor: .5,
	wheelDampFactor: .25,
	wheelScaleFactor: .05,
	panDegreeFactor: Math.PI / 4,
	tiltDegreeFactor: Math.PI / 10
};

class k {

	constructor( t, e = {} ) {

		this.enabled = ! 1, this.cameraRig = t, this.wheelScaleFactor = e.wheelScaleFactor || I.wheelScaleFactor, this.pointerScaleFactor = e.pointerScaleFactor || I.pointerScaleFactor, this.panDegreeFactor = e.panDegreeFactor || I.panDegreeFactor, this.tiltDegreeFactor = e.tiltDegreeFactor || I.tiltDegreeFactor, this.keyboardAdaptor = new x( {
			type: "continuous",
			dampingFactor: e.keyboardDampFactor || I.keyboardDampFactor,
			incrementor: e.keyboardScaleFactor || I.keyboardScaleFactor
		} ), this.wheelAdaptor = new S( {
			type: "continuous",
			dampingFactor: e.wheelDampFactor || I.wheelDampFactor,
			domElement: e.domElement || I.domElement
		} ), this.pointerAdaptor = new E( {
			domElement: e.domElement || I.domElement,
			dampingFactor: e.pointerDampFactor || I.pointerDampFactor
		} ), this.onWheel = this.onWheel.bind( this ), this.onKey = this.onKey.bind( this ), this.onPointer = this.onPointer.bind( this );

	}

	isEnabled() {

		return this.enabled;

	}

	enable() {

		this.wheelAdaptor.connect(), this.keyboardAdaptor.connect(), this.pointerAdaptor.connect(), this.wheelAdaptor.addEventListener( "update", this.onWheel ), this.keyboardAdaptor.addEventListener( "update", this.onKey ), this.pointerAdaptor.addEventListener( "update", this.onPointer ), this.enabled = ! 0;

	}

	disable() {

		this.wheelAdaptor.disconnect(), this.keyboardAdaptor.disconnect(), this.pointerAdaptor.disconnect(), this.wheelAdaptor.removeEventListener( "update", this.onWheel ), this.keyboardAdaptor.removeEventListener( "update", this.onKey ), this.pointerAdaptor.removeEventListener( "update", this.onPointer ), this.enabled = ! 1;

	}

	onWheel( t ) {

		this.cameraRig.do( p.Dolly, t.deltas.y * this.wheelScaleFactor ), this.cameraRig.do( p.Truck, t.deltas.x * this.wheelScaleFactor );

	}

	onKey( t ) {

		this.cameraRig.do( p.Dolly, t.values.backward - t.values.forward ), this.cameraRig.do( p.Truck, t.values.right - t.values.left ), this.cameraRig.do( p.Pedestal, t.values.up - t.values.down );

	}

	onPointer( t ) {

		switch ( t.pointerCount ) {

			case 1:
				this.cameraRig.do( p.Pan, t.deltas.x * this.panDegreeFactor ), this.cameraRig.do( p.Tilt, t.deltas.y * this.tiltDegreeFactor );
				break;
			case 2:
				this.cameraRig.do( p.Dolly, - t.deltas.y * this.pointerScaleFactor ), this.cameraRig.do( p.Truck, - t.deltas.x * this.pointerScaleFactor );

		}

	}

	update( t ) {

		this.enabled && ( this.keyboardAdaptor.update(), this.wheelAdaptor.update(), this.pointerAdaptor.update( t ) );

	}

}

const F = {
		startOffset: "0px",
		endOffset: "0px",
		dampingFactor: 1,
		buffer: .1,
		cameraStart: "0%",
		cameraEnd: "100%",
		scrollActions: []
	}, O = ( t, e, i, s, n ) => Math.max( s, Math.min( n, ( n - s ) / ( i - e ) * ( t - e ) + s ) );

class R {

	constructor( t, e ) {

		this.enabled = ! 1, this.cameraRig = t, this.cameraRig.setAnimationTime( 0 ), this.scrollAdaptor = new T( {
			scrollElement: e.scrollElement,
			dampingFactor: e.dampingFactor || F.dampingFactor,
			startOffset: e.startOffset || F.startOffset,
			endOffset: e.endOffset || F.endOffset,
			buffer: e.buffer || F.buffer
		} ), this.cameraStart = e.cameraStart || F.cameraStart, this.cameraEnd = e.cameraEnd || F.cameraEnd, this.scrollActions = e.scrollActions || F.scrollActions, this.buffer = e.buffer || F.buffer, this.calculateStops(), this.onScroll = this.onScroll.bind( this );

	}

	isEnabled() {

		return this.enabled;

	}

	enable() {

		this.scrollAdaptor.connect(), this.scrollAdaptor.addEventListener( "update", this.onScroll ), this.enabled = ! 0;

	}

	disable() {

		this.scrollAdaptor.disconnect(), this.scrollAdaptor.removeEventListener( "update", this.onScroll ), this.enabled = ! 1;

	}

	update() {

		this.enabled && this.scrollAdaptor.update();

	}

	calculateStops() {

		this.cameraStartPx = this.scrollAdaptor.parseOffset( this.cameraStart ), this.cameraEndPx = this.scrollAdaptor.parseOffset( this.cameraEnd ), this.cameraBufferedStartPx = this.cameraStartPx * ( 1 - this.buffer ), this.cameraBufferedEndPx = this.cameraEndPx * ( 1 + this.buffer ), this.scrollActions.forEach( ( t => {

			t.startPx = this.scrollAdaptor.parseOffset( t.start ), t.endPx = this.scrollAdaptor.parseOffset( t.end ), t.bufferedStartPx = t.startPx * ( 1 - this.buffer ), t.bufferedEndPx = t.endPx * ( 1 + this.buffer );

		} ) );

	}

	onScroll( t ) {

		const e = t.dampenedValues.scrollPx;
		e >= this.cameraBufferedStartPx && e <= this.cameraBufferedEndPx && this.cameraRig.setAnimationPercentage( O( e, this.cameraStartPx, this.cameraEndPx, 0, 1 ) ), this.scrollActions.forEach( ( t => {

			e >= t.bufferedStartPx && e <= t.bufferedEndPx && t.callback( O( e, t.startPx, t.endPx, 0, 1 ) );

		} ) );

	}

}

const M = { cycle: ! 1, useKeyboard: ! 0 };

class D extends e {

	constructor( t, e = [], i = {} ) {

		super(), this.currentIndex = null, this.upcomingIndex = null, this.enabled = ! 1, this.cameraRig = t, this.pois = e, Object.assign( this, M, i ), this.useKeyboard && ( this.keyboardAdaptor = new x( {
			type: "discrete",
			keyMapping: { next: [ "ArrowDown", "ArrowRight" ], prev: [ "ArrowUp", "ArrowLeft" ] }
		} ), this.onKey = this.onKey.bind( this ) ), this.onCameraStart = this.onCameraStart.bind( this ), this.onCameraUpdate = this.onCameraUpdate.bind( this ), this.onCameraEnd = this.onCameraEnd.bind( this );

	}

	getCurrentIndex() {

		return this.currentIndex;

	}

	nextPOI() {

		const t = this.currentIndex + 1;
		t >= this.pois.length && ! this.cycle ? this.dispatchEvent( {
			type: "ExitPOIs",
			exitFrom: "end"
		} ) : this.goToPOI( t % this.pois.length );

	}

	prevPOI() {

		const t = this.currentIndex - 1;
		t < 0 && ! this.cycle ? this.dispatchEvent( {
			type: "ExitPOIs",
			exitFrom: "start"
		} ) : this.goToPOI( ( t + this.pois.length ) % this.pois.length );

	}

	goToPOI( t ) {

		this.upcomingIndex = t;
		const e = this.pois[ this.upcomingIndex ];
		this.cameraRig.flyTo( e.position, e.quaternion, e.duration, e.ease, e.useSlerp );

	}

	enable() {

		this.useKeyboard && ( this.keyboardAdaptor.connect(), this.keyboardAdaptor.addEventListener( "trigger", this.onKey ) ), this.cameraRig.addEventListener( "CameraMoveStart", this.onCameraStart ), this.cameraRig.addEventListener( "CameraMoveUpdate", this.onCameraUpdate ), this.cameraRig.addEventListener( "CameraMoveEnd", this.onCameraEnd ), this.enabled = ! 0;

	}

	disable() {

		this.useKeyboard && ( this.keyboardAdaptor.disconnect(), this.keyboardAdaptor.removeEventListener( "trigger", this.onKey ) ), this.cameraRig.removeEventListener( "CameraMoveStart", this.onCameraStart ), this.cameraRig.removeEventListener( "CameraMoveUpdate", this.onCameraUpdate ), this.cameraRig.removeEventListener( "CameraMoveEnd", this.onCameraEnd ), this.enabled = ! 1;

	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	update() {
	}

	isEnabled() {

		return this.enabled;

	}

	updatePois( t ) {

		this.dispatchEvent( {
			type: "update",
			currentIndex: this.currentIndex,
			upcomingIndex: this.upcomingIndex,
			progress: t
		} );

	}

	onCameraStart() {

		this.updatePois( 0 );

	}

	onCameraUpdate( t ) {

		this.updatePois( t.progress );

	}

	onCameraEnd() {

		this.currentIndex = this.upcomingIndex, this.upcomingIndex = null;

	}

	onKey( t ) {

		"next" === t.trigger ? this.nextPOI() : "prev" === t.trigger && this.prevPOI();

	}

}

const q = { wheelThreshold: 15, swipeThreshold: 60, duration: 1, ease: "power1", useKeyboard: ! 0 };

class z extends e {

	constructor( t, e = [], i = {} ) {

		super(), this.currentIndex = 0, this.upcomingIndex = null, this.enabled = ! 1, this.cameraRig = t, this.pois = e, Object.assign( this, q, i ), this.wheelAdaptor = new S( {
			type: "discrete",
			thresholdY: this.wheelThreshold
		} ), this.swipeAdaptor = new C( { thresholdY: this.swipeThreshold } ), this.useKeyboard && ( this.keyboardAdaptor = new x( {
			type: "discrete",
			keyMapping: { next: [ "ArrowDown", "ArrowRight" ], prev: [ "ArrowUp", "ArrowLeft" ] }
		} ), this.onKey = this.onKey.bind( this ) ), this.onCameraStart = this.onCameraStart.bind( this ), this.onCameraUpdate = this.onCameraUpdate.bind( this ), this.onCameraEnd = this.onCameraEnd.bind( this ), this.onTrigger = this.onTrigger.bind( this );

	}

	getCurrentIndex() {

		return this.currentIndex;

	}

	enable() {

		this.useKeyboard && ( this.keyboardAdaptor.addEventListener( "trigger", this.onKey ), this.keyboardAdaptor.connect() ), this.wheelAdaptor.addEventListener( "trigger", this.onTrigger ), this.swipeAdaptor.addEventListener( "trigger", this.onTrigger ), this.cameraRig.addEventListener( "CameraMoveStart", this.onCameraStart ), this.cameraRig.addEventListener( "CameraMoveUpdate", this.onCameraUpdate ), this.cameraRig.addEventListener( "CameraMoveEnd", this.onCameraEnd ), this.wheelAdaptor.connect(), this.swipeAdaptor.connect(), this.enabled = ! 0;

	}

	disable() {

		this.useKeyboard && ( this.keyboardAdaptor.removeEventListener( "trigger", this.onKey ), this.keyboardAdaptor.disconnect() ), this.wheelAdaptor.removeEventListener( "trigger", this.onTrigger ), this.swipeAdaptor.removeEventListener( "trigger", this.onTrigger ), this.cameraRig.removeEventListener( "CameraMoveStart", this.onCameraStart ), this.cameraRig.removeEventListener( "CameraMoveUpdate", this.onCameraUpdate ), this.cameraRig.removeEventListener( "CameraMoveEnd", this.onCameraEnd ), this.wheelAdaptor.disconnect(), this.swipeAdaptor.disconnect(), this.enabled = ! 1;

	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	update() {
	}

	isEnabled() {

		return this.enabled;

	}

	onKey( t ) {

		switch ( t.trigger ) {

			case "prev":
				this.onTrigger( { y: - 1 } );
				break;
			case "next":
				this.onTrigger( { y: 1 } );

		}

	}

	onTrigger( t ) {

		const e = this.currentIndex + t.y;
		e >= this.pois.length ? this.dispatchEvent( {
			type: "ExitPOIs",
			exitFrom: "end"
		} ) : e < 0 ? this.dispatchEvent( {
			type: "ExitPOIs",
			exitFrom: "start"
		} ) : ( this.upcomingIndex = e, this.cameraRig.flyToKeyframe( this.pois[ this.upcomingIndex ].frame, this.duration, this.ease ) );

	}

	updatePois( t ) {

		this.dispatchEvent( {
			type: "update",
			currentIndex: this.currentIndex,
			upcomingIndex: this.upcomingIndex,
			progress: t
		} );

	}

	onCameraStart() {

		this.updatePois( 0 );

	}

	onCameraUpdate( t ) {

		this.updatePois( t.progress );

	}

	onCameraEnd() {

		this.currentIndex = this.upcomingIndex, this.upcomingIndex = null;

	}

}

const U = {
	domElement: document.body,
	panFactor: Math.PI / 20,
	tiltFactor: Math.PI / 20,
	truckFactor: 1,
	pedestalFactor: 1,
	dampingFactor: .7
};

class V {

	constructor( t, e = {} ) {

		this.enabled = ! 1, this.cameraRig = t, Object.assign( this, U, e ), this.pointerAdaptor = new E( {
			domElement: e.domElement || U.domElement,
			dampingFactor: e.dampingFactor || U.dampingFactor
		} ), this.onPointerMove = this.onPointerMove.bind( this );

	}

	isEnabled() {

		return this.enabled;

	}

	enable() {

		this.pointerAdaptor.connect(), this.pointerAdaptor.addEventListener( "update", this.onPointerMove ), this.enabled = ! 0;

	}

	disable() {

		this.pointerAdaptor.disconnect(), this.pointerAdaptor.removeEventListener( "update", this.onPointerMove ), this.enabled = ! 1;

	}

	update( t ) {

		this.enabled && this.pointerAdaptor.update( t );

	}

	onPointerMove( t ) {

		0 === t.pointerCount && ( this.cameraRig.do( p.Pan, - t.deltas.x * this.panFactor, m.Eyes ), this.cameraRig.do( p.Tilt, - t.deltas.y * this.tiltFactor, m.Eyes ), this.cameraRig.do( p.Truck, t.deltas.x * this.truckFactor, m.Eyes ), this.cameraRig.do( p.Pedestal, t.deltas.y * this.pedestalFactor, m.Eyes ) );

	}

}

! function ( t, e ) {

	void 0 === e && ( e = {} );
	let i = e.insertAt;
	if ( t && "undefined" != typeof document ) {

		let s = document.head || document.getElementsByTagName( "head" )[ 0 ], n = document.createElement( "style" );
		n.type = "text/css", "top" === i && s.firstChild ? s.insertBefore( n, s.firstChild ) : s.appendChild( n ), n.styleSheet ? n.styleSheet.cssText = t : n.appendChild( document.createTextNode( t ) );

	}

}( ".tb-ch {\n  width: 350px;\n  height: 100%;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 99999;\n  background-color: rgba(255, 255, 255, 0.8);\n  box-sizing: border-box;\n  overflow-x: visible;\n  transition: all 0.2s ease-in-out;\n}\n  .tb-ch.collapsed {\n    left: -350px;\n  }\n  .tb-ch * {\n    box-sizing: border-box;\n  }\n  .tb-ch button {\n    text-transform: capitalize;\n    cursor: pointer;\n  }\n  .tb-ch .btn-round {\n    font-size: 1.8rem;\n    line-height: 1;\n    width: 2.5rem;\n    height: 2.5rem;\n    position: absolute;\n    right: -3rem;\n    bottom: 0.5rem;\n  }\n  .tb-ch .btn-round.collapse {\n      bottom: 3.5rem;\n    }\n  .tb-ch .controls {\n    position: absolute;\n    bottom: 0;\n    height: 225px;\n    border-top: 1px solid black;\n    padding: 0.5rem;\n    width: 100%;\n    display: flex;\n    flex-direction: column;\n    justify-content: space-between;\n  }\n  .tb-ch .btn-text {\n    padding: 0.5rem;\n    text-align: center;\n    width: 100%;\n  }\n  .tb-ch input[type='range'] {\n    width: 100%;\n  }\n  .tb-ch .pois {\n    height: calc(100vh - 225px - 1rem);\n    overflow: scroll;\n    padding: 1rem 1rem 0;\n  }\n  .tb-ch .poi {\n    margin-bottom: 1rem;\n  }\n  .tb-ch .poi h2 {\n      font-size: 1rem;\n    }\n  .tb-ch .poi .wrapper {\n      display: flex;\n      flex-direction: row;\n    }\n  .tb-ch .poi img {\n      display: block;\n      max-width: 100%;\n      min-width: 0;\n      margin-right: 0.5rem;\n    }\n  .tb-ch .poi .poi-controls {\n      display: flex;\n      flex-direction: column;\n    }\n  .tb-ch .poi .poi-controls button {\n        padding: 0.5rem;\n        width: 2rem;\n        height: 2rem;\n        margin-bottom: 0.25rem;\n      }\n  .tb-ch .poi .poi-params {\n      display: flex;\n      flex-direction: row;\n      flex-wrap: wrap;\n      width: calc(100% - 2.5rem);\n    }\n  .tb-ch .poi label,\n    .tb-ch .poi input,\n    .tb-ch .poi select {\n      width: 50%;\n      font-size: 0.7rem;\n      font-family: monospace;\n      margin: 0.25rem 0;\n    }\n  .tb-ch .poi input {\n      text-align: center;\n    }\n" );

const K = [ "none", "power1", "power2", "power3", "power4", "sine", "expo", "circ" ], j = "visit", Y = "remove",
	W = "duration", B = "ease", X = "move-up", N = "move-down";

class Z {

	constructor( t, e, i, s ) {

		this.useSlerp = ! 0, this.rig = t, this.controls = e, this.canvas = i, this.pois = [], this.currentIndex = null, this.doCapture = ! 1, this.isPlaying = ! 1, this.initUI( s );

	}

	capture() {

		this.doCapture = ! 0;

	}

	update( t ) {

		if ( this.doCapture ) {

			const t = document.createElement( "canvas" ), e = t.getContext( "2d" );
			t.width = 640, t.height = 360, e.drawImage( this.canvas, 0, 0, t.width, t.height );
			const i = t.toDataURL();
			this.addPoi( i ), this.doCapture = ! 1;

		}

		if ( this.isPlaying ) {

			this.playStartTime || ( this.playStartTime = t, this.controls.disable(), this.rig.packTransform() );
			const e = ( t - this.playStartTime ) / 1e3;
			this.rig.setAnimationTime( e ), e > this.animationClip.duration && ( this.isPlaying = ! 1, this.playStartTime = null, this.controls.enable(), this.rig.unpackTransform() );

		}

	}

	addPoi( t ) {

		this.pois.push( Object.assign( Object.assign( {}, this.rig.getWorldCoordinates() ), {
			duration: 1,
			ease: "power1",
			image: t
		} ) ), this.currentIndex = this.pois.length - 1, this.createClip(), this.render();

	}

	updatePoi( t, e ) {

		this.pois[ t ] = Object.assign( Object.assign( {}, this.pois[ t ] ), e );

	}

	movePoi( t, e ) {

		if ( t + e >= 0 && t + e < this.pois.length ) {

			const i = this.pois[ t ];
			this.pois[ t ] = this.pois[ t + e ], this.pois[ t + e ] = i, this.render();

		}

	}

	removePoi( t ) {

		this.pois.splice( t, 1 ), this.render();

	}

	goToPoi( t ) {

		const e = this.pois[ t ];
		this.rig.flyTo( e.position, e.quaternion, e.duration, e.ease, this.useSlerp );

	}

	createClip() {

		if ( this.pois.length > 0 ) {

			const e = [], i = [], s = [], o = new t(), a = new n(), l = 10;
			let p = 0;
			if ( ! this.pois[ 0 ].quaternion.isQuaternion && ! this.pois[ 0 ].position.isVector3 ) for ( let e = 0; e < this.pois.length; e ++ ) {

				const i = this.pois[ e ];
				i.quaternion = new n( i.quaternion[ 0 ], i.quaternion[ 1 ], i.quaternion[ 2 ], i.quaternion[ 3 ] ), i.position = new t( i.position[ 0 ], i.position[ 1 ], i.position[ 2 ] );

			}

			for ( let t = 0; t < this.pois.length - 1; t ++ ) {

				const n = this.pois[ t ], r = this.pois[ t + 1 ], h = {
						px: n.position.x,
						py: n.position.y,
						pz: n.position.z,
						qx: n.quaternion.x,
						qy: n.quaternion.y,
						qz: n.quaternion.z,
						qw: n.quaternion.w,
						slerpAmount: 0
					}, d = {
						px: r.position.x,
						py: r.position.y,
						pz: r.position.z,
						qx: r.quaternion.x,
						qy: r.quaternion.y,
						qz: r.quaternion.z,
						qw: r.quaternion.w,
						slerpAmount: 1,
						duration: r.duration,
						ease: r.ease
					}, m = c.to( h, d );
				for ( let t = 0; t < l; t ++ ) {

					const d = r.duration * ( t / l );
					e.push( p + d ), m.seek( d ), this.useSlerp ? a.slerpQuaternions( n.quaternion, r.quaternion, h.slerpAmount ) : a.set( h.qx, h.qy, h.qz, h.qw ), o.set( h.px, h.py, h.pz ), a.toArray( s, s.length ), o.toArray( i, i.length );

				}

				p += r.duration;

			}

			const m = this.pois[ this.pois.length - 1 ];
			m.quaternion.toArray( s, s.length ), m.position.toArray( i, i.length ), e.push( p ), this.animationClip = new r( null, p, [ new h( "Translation.position", e, i ), new d( "Rotation.quaternion", e, s ) ] ), this.rig.setAnimationClip( this.animationClip );

		}

	}

	scrubClip( t ) {

		this.pois.length > 0 && this.rig.setAnimationPercentage( t );

	}

	playClip() {

		this.pois.length > 0 && ( this.isPlaying = ! 0 );

	}

	import() {

		if ( this.fileInput ) {

			this.fileInput.click();
			const t = new FileReader();
			this.fileInput.onchange = () => {

				t.readAsText( this.fileInput.files[ 0 ] ), t.onload = t => {

					const e = JSON.parse( t.target.result );
					this.pois = e.pois, this.animationClip = e.animationClip, this.createClip(), this.render();

				};

			};

		}

	}

	export( { draft: t } ) {

		if ( this.pois.length > 0 ) {

			const e = {};
			e.pois = this.pois.map( ( e => {

				const i = {
					position: [ e.position.x, e.position.y, e.position.z ],
					quaternion: [ e.quaternion.x, e.quaternion.y, e.quaternion.z, e.quaternion.w ],
					duration: e.duration,
					ease: e.ease
				};
				return t && ( i.image = e.image ), i;

			} ) ), this.animationClip && ( e.animationClip = r.toJSON( this.animationClip ) );
			const i = "text/json;charset=utf-8," + encodeURIComponent( JSON.stringify( e ) ),
				s = document.createElement( "a" );
			s.href = "data:" + i, s.download = `camera-data${t ? "-draft" : ""}.json`, document.body.appendChild( s ), s.click(), s.remove();

		}

	}

	exportImages() {

		const t = document.createElement( "a" );
		document.body.appendChild( t ), this.pois.forEach( ( ( e, i ) => {

			t.href = e.image, t.download = `camera-poi-${i}.png`, t.click();

		} ) ), t.remove();

	}

	initUI( t ) {

		this.drawer = document.createElement( "div" ), this.drawer.classList.add( "tb-ch" );
		const e = document.createElement( "button" );
		e.classList.add( "btn-round", "add" ), e.innerText = "+", e.onclick = this.capture.bind( this ), this.collapseBtn = document.createElement( "button" ), this.collapseBtn.classList.add( "btn-round", "collapse" ), this.collapseBtn.innerText = "<", this.collapseBtn.onclick = this.collapse.bind( this );
		const i = document.createElement( "div" );
		i.classList.add( "controls" ), this.fileInput = document.createElement( "input" ), this.fileInput.type = "file", this.fileInput.id = "import", this.fileInput.accept = "application/json", this.fileInput.style.display = "none", this.btnImport = document.createElement( "button" ), this.btnImport.classList.add( "btn-text", "import" ), this.btnImport.innerText = "import draft JSON", this.btnImport.onclick = this.import.bind( this );
		const s = document.createElement( "button" );
		s.classList.add( "btn-text", "export" ), s.innerText = "export draft JSON", s.onclick = this.export.bind( this, { draft: ! 0 } );
		const n = document.createElement( "button" );
		n.classList.add( "btn-text", "export" ), n.innerText = "export production JSON", n.onclick = this.export.bind( this, { draft: ! 1 } );
		const o = document.createElement( "button" );
		o.classList.add( "btn-text", "export-images" ), o.innerHTML = "export images", o.onclick = this.exportImages.bind( this );
		const a = document.createElement( "button" );
		a.classList.add( "btn-text", "play" ), a.innerText = "play", a.onclick = this.playClip.bind( this );
		const r = document.createElement( "input" );
		r.type = "range", r.min = "0", r.max = "1000", r.step = "0.1", r.value = "0";
		const h = this.scrubClip.bind( this );
		r.onmousedown = () => this.rig.packTransform(), r.onmouseup = () => this.rig.unpackTransform(), r.oninput = t => h( parseInt( t.target.value ) / 1e3 ), this.domList = document.createElement( "div" ), this.domList.classList.add( "pois" ), this.domList.onclick = this.handleEvents.bind( this ), this.domList.onchange = this.handleEvents.bind( this ), i.append( this.fileInput, this.btnImport, a, r, o, s, n ), this.drawer.append( e, this.collapseBtn, this.domList, i );
		( t || document.body ).append( this.drawer );

	}

	handleEvents( t ) {

		const e = t.target.dataset.index;
		e && ( t.target.classList.contains( j ) ? this.goToPoi( parseInt( e ) ) : t.target.classList.contains( Y ) ? this.removePoi( parseInt( e ) ) : t.target.classList.contains( W ) ? this.updatePoi( parseInt( e ), { duration: parseFloat( t.target.value ) } ) : t.target.classList.contains( B ) ? this.updatePoi( parseInt( e ), { ease: t.target.value } ) : t.target.classList.contains( X ) ? this.movePoi( parseInt( e ), - 1 ) : t.target.classList.contains( N ) && this.movePoi( parseInt( e ), 1 ), this.createClip() );

	}

	collapse() {

		this.drawer.classList.contains( "collapsed" ) ? ( this.drawer.classList.remove( "collapsed" ), this.collapseBtn.innerText = "<" ) : ( this.drawer.classList.add( "collapsed" ), this.collapseBtn.innerText = ">" );

	}

	render() {

		this.domList.innerHTML = "", this.pois.forEach( ( ( t, e ) => {

			const i = document.createElement( "div" );
			i.classList.add( "poi" );
			const s = document.createElement( "h2" );
			s.innerText = `${e + 1}.`;
			const n = document.createElement( "div" );
			n.classList.add( "wrapper" );
			const o = document.createElement( "div" );
			o.classList.add( "poi-controls" );
			const a = document.createElement( "div" );
			a.classList.add( "poi-params" );
			const r = new Image();
			r.src = t.image;
			const h = document.createElement( "label" );
			h.innerText = "Duration";
			const d = document.createElement( "input" );
			d.classList.add( W ), d.dataset.index = `${e}`, d.type = "number", d.value = String( t.duration );
			const c = document.createElement( "label" );
			c.innerText = "Easing";
			const l = document.createElement( "select" );
			l.classList.add( B ), l.dataset.index = `${e}`;
			const p = K.map( ( e => {

				const i = document.createElement( "option" );
				return i.innerText = e, i.value = e, i.selected = e === t.ease, i;

			} ) );
			l.append( ...p );
			const m = document.createElement( "button" );
			m.classList.add( Y ), m.title = "Remove", m.dataset.index = `${e}`, m.innerText = "x";
			const u = document.createElement( "button" );
			u.classList.add( j ), u.title = "Visit", u.dataset.index = `${e}`, u.innerHTML = "&rarr;";
			const g = document.createElement( "button" );
			g.classList.add( X ), g.title = "Move up", g.dataset.index = `${e}`, g.innerHTML = "&uarr;";
			const b = document.createElement( "button" );
			b.classList.add( N ), b.title = "Move down", b.dataset.index = `${e}`, b.innerHTML = "&darr;", o.append( m, u, g, b ), a.append( h, d, c, l ), n.append( r, o ), i.append( s, n, a ), this.domList.appendChild( i );

		} ) );

	}

}

export {
	u as Axis,
	v as BaseAdaptor,
	p as CameraAction,
	Z as CameraHelper,
	y as CameraRig,
	l as Damper,
	k as FreeMovementControls,
	x as KeyboardAdaptor,
	z as PathPointsControls,
	E as PointerAdaptor,
	m as RigComponent,
	T as ScrollAdaptor,
	R as ScrollControls,
	D as StoryPointsControls,
	C as SwipeAdaptor,
	V as ThreeDOFControls,
	S as WheelAdaptor
};
//# sourceMappingURL=three-story-controls.esm.min.js.map