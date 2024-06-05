import React, { useEffect, useRef } from 'react';

interface AddressAvatarProps {
  address: string;
}

const AddressAvatar: React.FC<AddressAvatarProps> = ({ address }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Function to convert hexadecimal to binary
  const hexToBinary = (hex: string): string => {
    return hex.split('').reduce((binary, hexChar) => {
      return binary + parseInt(hexChar, 16).toString(2).padStart(4, '0');
    }, '');
  };

  // Function to generate an avatar 16x16 from a hexadecimal address
  const generateAvatar = (hexAddress: string) => {
    const binaryData = hexToBinary(hexAddress);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Base colors determined by the first 4 characters of the address
        const baseColors = [
          parseInt(hexAddress[0], 16),
          parseInt(hexAddress[1], 16),
          parseInt(hexAddress[2], 16),
          parseInt(hexAddress[3], 16),
        ];

        // Color palette (example colors, can be customized)
        const colors = [
          '#FF0000',
          '#00FF00',
          '#0000FF',
          '#FFFF00', // Red, Green, Blue, Yellow
          '#FF00FF',
          '#00FFFF',
          '#FFFFFF',
          '#000000', // Magenta, Cyan, White, Black
        ];

        // Map base colors to the color palette
        const selectedColors = baseColors.map((baseColor) => colors[baseColor % colors.length]);

        // Use the rest of the address to determine the color shades
        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < 8; x++) {
            const index = (y * 8 + x) * 2;
            const bit = binaryData.slice(index, index + 2);
            const colorIndex = parseInt(bit, 2) % selectedColors.length;
            const color = selectedColors[colorIndex];
            ctx.fillStyle = color;
            ctx.fillRect(x * 2, y * 2, 2, 2); // Each color block is 2x2 pixels
          }
        }
      }
    }
  };

  useEffect(() => {
    if (address) {
      generateAvatar(address);
    }
  }, [address]);

  return (
    <div>
      <canvas ref={canvasRef} width={16} height={16} className="rounded-full mr-1.5"></canvas>
    </div>
  );
};

export default AddressAvatar;