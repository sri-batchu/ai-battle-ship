import { ShipType } from '@/types/game';

export const getShipIcon = (shipName: string): string => {
  switch (shipName) {
    case 'Carrier':
      return '🚢'; // Aircraft Carrier - large ship
    case 'Battleship':
      return '🛳️'; // Battleship - cruise ship for battleship
    case 'Destroyer':
      return '🚤'; // Destroyer - speedboat for fast destroyer
    case 'Submarine':
      return '🛡️'; // Submarine - shield for submarine (military/defensive)
    case 'Patrol Boat':
      return '⛵'; // Patrol Boat - sailboat for small patrol boat
    default:
      return '🚢';
  }
};

export const getShipColor = (shipName: string): string => {
  switch (shipName) {
    case 'Carrier':
      return 'text-blue-600';
    case 'Battleship':
      return 'text-gray-700';
    case 'Destroyer':
      return 'text-green-600';
    case 'Submarine':
      return 'text-purple-600';
    case 'Patrol Boat':
      return 'text-orange-600';
    default:
      return 'text-blue-600';
  }
};
