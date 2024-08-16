import { useEffect } from 'react';
import {
	AbsoluteFill,
	Audio,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import { loadFonts } from './load-fonts';

export const LogoAnimation: React.FC = () => {
	const { fps, durationInFrames: originalDurationInFrames } = useVideoConfig();
	const frame = useCurrentFrame();
	const delayInFrames = 1 * fps;
	const extendedDurationInFrames = originalDurationInFrames + 3 * fps; // Extend duration by 3 seconds

	useEffect(() => {
		loadFonts();
	}, []);

	const progress = spring({
		fps,
		frame: frame - delayInFrames,
		config: {
			damping: 200,
		},
		durationInFrames: originalDurationInFrames - delayInFrames // Maintain original spring duration
	});

	const scale = interpolate(progress, [0, 1], [1, 3]);
	const translateX = interpolate(progress, [0, 1], [0, 0]);
	const translateY = interpolate(progress, [0, 1], [0, 0]);

	const song = staticFile("/song.mp3");
	const docImage = staticFile("/NextHeadDocs.png");

	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				overflow: 'hidden', // Prevents the image from overflowing the bounding box
			}}
		>
			<Audio startFrom={1.5 * fps} src={song} />
			<img
				src={docImage}
				style={{
					width: '100%',
					height: 'auto',
					transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
					transformOrigin: 'top left', // Adjust origin point
					willChange: 'transform'  // Performance optimization
				}}
			/>
		</AbsoluteFill>
	);
};