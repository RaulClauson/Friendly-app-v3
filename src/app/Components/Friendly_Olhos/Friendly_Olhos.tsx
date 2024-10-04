import './Friendly_Olhos.css';
import { useRive, Layout, Fit, Alignment, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const STATE_MACHINE_NAME = 'State Machine 1';  // Your state machine name
const NUM_X_INPUT = 'NumX';  // Input for the X coordinate
const NUM_Y_INPUT = 'NumY';  // Input for the Y coordinate
const EMOCAO_INPUT = 'Emocao'; // Input for emotional state
const CLICK_INPUT_NAME = 'Click'; // Input to trigger state change

const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};

const Friendly_Olhos = forwardRef(({ emocao }: { emocao: number }, ref) => {
  const { rive, RiveComponent } = useRive({
    src: '/Animations.riv',  // Path to your .riv file
    stateMachines: STATE_MACHINE_NAME,  // State machine name as shown in the image
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  const [isFollowing, setIsFollowing] = useState(false); // Track whether it should follow
  const [isMobile, setIsMobile] = useState(false); // Detect if the device is mobile
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null); // Timer to stop following

  const targetX = useRef(50); // Start at center (50%)
  const targetY = useRef(50); // Start at center (50%)
  const currentX = useRef(50); // Current interpolated X position
  const currentY = useRef(50); // Current interpolated Y position

  const numXInput = useStateMachineInput(rive, STATE_MACHINE_NAME, NUM_X_INPUT);
  const numYInput = useStateMachineInput(rive, STATE_MACHINE_NAME, NUM_Y_INPUT);
  const emocaoInput = useStateMachineInput(rive, STATE_MACHINE_NAME, EMOCAO_INPUT);

  // Mouse move handler for desktop
  const handleMouseMove = (event: MouseEvent) => {
    if (!isMobile && isFollowing) {
      const friendlyOlhosDiv = document.getElementById('Friendly_Olhos');
      if (friendlyOlhosDiv) {
        const rect = friendlyOlhosDiv.getBoundingClientRect();

        if (event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom) {

          targetX.current = ((event.clientX - rect.left) / rect.width) * 100;
          targetY.current = (1 - (event.clientY - rect.top) / rect.height) * 100;
        }
      }
    }
  };

  // Gyroscope event handler for mobile
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    if (isMobile && isFollowing) {
      const maxTilt = 90; // Maximum tilt angle for device

      // Normalize the tilt values to 0-100 range
      targetX.current = ((event.gamma || 0) + maxTilt) / (2 * maxTilt) * 100;
      targetY.current = ((event.beta || 0) + maxTilt) / (2 * maxTilt) * 100;
    }
  };

  const updatePosition = () => {
    if (numXInput && numYInput) {
      currentX.current = lerp(currentX.current, targetX.current, 0.1); // Smooth factor (0.1)
      currentY.current = lerp(currentY.current, targetY.current, 0.1);

      numXInput.value = currentX.current;
      numYInput.value = currentY.current;

      if (emocaoInput) {
        emocaoInput.value = emocao; // Set the Emocao input value to the prop received from the parent
      }
    }
  };

  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);

    if (isMobileDevice) {
      // Listen to the device orientation on mobile
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
      // Listen to mouse movement on desktop
      window.addEventListener('mousemove', handleMouseMove);
    }

    const intervalId = setInterval(updatePosition, 16); // 60 FPS update

    return () => {
      if (isMobileDevice) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      clearInterval(intervalId);
    };
  }, [isFollowing, numXInput, numYInput, emocaoInput, emocao]);

  const clickInput = useStateMachineInput(rive, STATE_MACHINE_NAME, CLICK_INPUT_NAME);

  const handleClick = () => {
    if (clickInput) {
      clickInput.fire();
    }
    
    if (!isFollowing) {
      setIsFollowing(true);
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        setIsFollowing(false);
        targetX.current = 50;
        targetY.current = 50;
      }, 10000);

      setTimer(newTimer);
    }
  };

  useImperativeHandle(ref, () => ({
    handleClick,
  }));

  return (
    <div id="Friendly_Olhos" onClick={handleClick}>
      <RiveComponent />
    </div>
  );
});

export default Friendly_Olhos;
