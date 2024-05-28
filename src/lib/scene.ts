import {
	BufferGeometry,
	Clock,
	Fog,
	Group,
	HalfFloatType,
	Line,
	LineBasicMaterial,
	LineDashedMaterial,
	Material,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	Object3D,
	PerspectiveCamera,
	Plane,
	PlaneGeometry,
	Quaternion,
	Raycaster,
	Scene,
	Vector2,
	Vector3,
	WebGLRenderTarget,
	WebGLRenderer
} from 'three';
import { EffectComposer, FilmPass, RenderPass } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

const FIXED_RELATIVE_DISTANCE = 10;

function createCircle(segmentCount = 32, radius = 3, depthZ = 0, material: Material) {
	const points = [];

	for (let i = 0; i <= segmentCount; i++) {
		const theta = (i / segmentCount) * Math.PI * 2;
		points.push(new Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, depthZ));
	}

	return new Line(new BufferGeometry().setFromPoints(points), material);
}

function objFitPerspectiveCamera(
	plane: Object3D,
	camera: PerspectiveCamera,
	relativeZ: number | null,
	divisor = 10
) {
	const cameraZ = relativeZ !== null ? relativeZ : camera.position.z;
	const distance = cameraZ - plane.position.z;
	const vFov = (camera.fov * Math.PI) / 180;
	const scale = (2 * Math.tan(vFov / 2) * distance * camera.aspect) / divisor;

	plane.scale.set(scale, scale, 1);
}

export const createScene = (el: HTMLCanvasElement) => {
	// TODO: Remove stats
	const stats = new Stats();

	let renderer: WebGLRenderer;
	let composer: EffectComposer;
	const scene = new Scene();

	const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 5;

	scene.fog = new Fog(0xcccccc, 100, 1500);

	// circles
	const circlesGroup = new Group().add(
		createCircle(64, 8, 4, new LineDashedMaterial({ color: 0x777777 })).computeLineDistances(),
		createCircle(64, 6, 3, new LineBasicMaterial({ color: 0x555555 })),
		createCircle(64, 2, 1, new LineDashedMaterial({ color: 0x888888 })).computeLineDistances()
	);
	const circleTargetQuaternion = new Quaternion();
	const circleRotationMatrix = new Matrix4();

	// squares
	const square = new Mesh(new PlaneGeometry(3, 3), new MeshBasicMaterial({ wireframe: true }));
	square.translateZ(-5);
	square.name = 'Sqaure 1';

	const squareGroup = new Group();
	squareGroup.add(square);

	scene.add(circlesGroup);
	scene.add(squareGroup);

	// mouse move
	const onMouseMove = (event: MouseEvent) => {
		mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.offsetY / window.innerHeight) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);
		raycasterSelector.setFromCamera(mouse, camera);
		raycaster.ray.intersectPlane(plane, pointOfIntersection);
		const { x, y, z } = pointOfIntersection;

		pointOfIntersection.set(-x * 0.03, -y * 0.03, z);
		circleRotationMatrix.lookAt(pointOfIntersection, circlesGroup.position, circlesGroup.up);
		circleTargetQuaternion.setFromRotationMatrix(circleRotationMatrix);

		const intersects = raycasterSelector.intersectObjects(squareGroup.children, true);

		if (intersects.length > 0) {
			square.setRotationFromAxisAngle(new Vector3(0, 0, 1), deg2pi(45));
		} else {
			square.setRotationFromAxisAngle(new Vector3(0, 0, 1), deg2pi(90));
		}
	};
	const plane = new Plane(new Vector3(0, 0, 1), 10);
	const camVector = new Vector3();
	camera.getWorldDirection(camVector);
	const raycaster = new Raycaster(camera.position, camVector);
	const raycasterSelector = new Raycaster(camera.position, camVector);
	const mouse = new Vector2();
	const pointOfIntersection = new Vector3();
	document.addEventListener('mousemove', onMouseMove, false);

	const ev = new MouseEvent('mousemove');
	onMouseMove(ev);
	circlesGroup.lookAt(camera.position);
	squareGroup.lookAt(camera.position);
	squareGroup.setRotationFromAxisAngle(new Vector3(0, 0, 1), deg2pi(45));

	const clock = new Clock();

	const postProcess = () => {
		const renderPass = new RenderPass(scene, camera);
		composer.addPass(renderPass);

		const effectFilm = new FilmPass(1.2);
		effectFilm.renderToScreen = true;
		composer.addPass(effectFilm);
	};

	const animate = () => {
		stats.begin(); // TODO: remove

		requestAnimationFrame(animate);
		renderer.render(scene, camera);
		const delta = clock.getDelta();
		composer.render(delta);
		calculateRotations(delta);

		stats.end(); // TODO: remove
	};

	const calculateRotations = (delta: number, speed = 2) => {
		circlesGroup.children[0].rotateZ(deg2pi(1));
		circlesGroup.children[2].rotateZ(deg2pi(-0.5));
		if (!circlesGroup.quaternion.equals(circleTargetQuaternion)) {
			const step = speed * delta;
			circlesGroup.quaternion.rotateTowards(circleTargetQuaternion, step);
		}
	};

	const resize = () => {
		const [width, height] = [window.innerWidth, window.innerHeight];

		renderer.setSize(width, height);
		renderer.setPixelRatio(window.devicePixelRatio);
		composer.setSize(width, height);
		composer.setPixelRatio(window.devicePixelRatio);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		circlesGroup.children.forEach((child) => {
			objFitPerspectiveCamera(child, camera, FIXED_RELATIVE_DISTANCE, 25);
		});
	};

	window.addEventListener('resize', resize);

	const createScene = (el: HTMLCanvasElement) => {
		renderer = new WebGLRenderer({ antialias: false, canvas: el });
		const size = renderer.getDrawingBufferSize(new Vector2());
		const renderTarget = new WebGLRenderTarget(size.width, size.height, {
			samples: 8,
			type: HalfFloatType
		});

		renderer.setClearColor(0x050505, 1.0);
		composer = new EffectComposer(renderer, renderTarget);
		clock.start();
		resize();
		postProcess();
		animate();

		// TODO: remove stats
		stats.showPanel(0);
		document.body.appendChild(stats.dom);
	};

	createScene(el);
};

const deg2pi = (deg: number) => {
	return deg * (Math.PI / 180);
};
