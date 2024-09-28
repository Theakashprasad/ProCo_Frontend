import { IoMdSettings } from 'react-icons/io';
import styled, { keyframes } from 'styled-components';

// Define the keyframes for the rotate, pop, and zoom effect
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pop = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const zoom = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.2); }
`;

// Create a styled component for the icon
const RotatingIconStyled = styled(IoMdSettings)`
  font-size: 2rem;
  transition: transform 0.3s ease-in-out;

  &:hover {
    animation: ${rotate} 0.6s linear, ${pop} 0.3s ease-in-out, ${zoom} 0.3s ease-in-out;
  }
`;

const RotatingIcon = () => {
  return <RotatingIconStyled />;
};

export default RotatingIcon;
