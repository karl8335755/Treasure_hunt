import { type Player, AVATARS } from '../types';

interface ProgressMapProps {
  players: Player[];
  currentPlayer: Player;
}

export function ProgressMap({ players, currentPlayer }: ProgressMapProps) {
  // Calculate progress percentage for each player (0-100)
  const getPlayerProgress = (player: Player) => {
    const completedProblems = Object.values(player.completedProblems).filter(Boolean).length;
    return Math.round((completedProblems / 21) * 100); // 21 total problems
  };

  // Get player position on the map (0-20 for 21 positions)
  const getPlayerPosition = (player: Player) => {
    const completedProblems = Object.values(player.completedProblems).filter(Boolean).length;
    return Math.min(completedProblems, 20); // Cap at 20 to stay within map bounds
  };

  // Create the map grid with dynamic width based on player positions
  const createMap = () => {
    // Calculate how many players are at each position
    const positionCounts: Record<number, number> = {};
    players.forEach(player => {
      const position = getPlayerPosition(player);
      positionCounts[position] = (positionCounts[position] || 0) + 1;
    });

    // Calculate total width needed (minimum 21, plus extra space for overlapping players)
    const maxPlayersAtPosition = Math.max(...Object.values(positionCounts), 1);
    const mapWidth = Math.max(21, 20 + maxPlayersAtPosition);
    const mapHeight = 5;
    const map: string[][] = Array(mapHeight).fill(null).map(() => Array(mapWidth).fill(' '));

    // Add terrain elements
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        if (y === 0 || y === mapHeight - 1) {
          map[y][x] = '~'; // Water at top and bottom
        } else if (y === 1 || y === mapHeight - 2) {
          map[y][x] = '.'; // Sand/ground
        } else {
          map[y][x] = ' '; // Path in the middle
        }
      }
    }

    // Add flag at the end (goal)
    map[2][mapWidth - 1] = '🏁';

    // Add players to the map
    const playerPositions: Record<number, number> = {}; // Track how many players at each position
    
    players.forEach(player => {
      const position = getPlayerPosition(player);
      const avatar = AVATARS[player.avatar].emoji;
      
      // Place player on the middle row (row 2)
      if (position < mapWidth - 1) { // Don't overlap with flag
        // If there are multiple players at this position, place them side by side
        const offset = playerPositions[position] || 0;
        const actualPosition = position + offset;
        
        if (actualPosition < mapWidth - 1) { // Still don't overlap with flag
          map[2][actualPosition] = avatar;
          playerPositions[position] = offset + 1;
        }
      }
    });

    return map;
  };

  const map = createMap();

  return (
    <div className="bg-gray-800/30 rounded-xl p-3 lg:p-6 border border-gray-600/30">
      <h3 className="text-lg lg:text-xl font-bold text-gray-200 mb-4 flex items-center gap-2">
        <span>🗺️</span>
        Progress Map
      </h3>
      
      <div className="bg-gray-700/60 rounded-lg p-2 lg:p-4 font-mono text-xs lg:text-sm">
        {/* Map display */}
        <div className="space-y-1">
          {map.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center">
              {row.map((cell, colIndex) => (
                <span 
                  key={colIndex} 
                  className={`w-4 h-4 lg:w-6 lg:h-6 flex items-center justify-center ${
                    cell === '🏁' ? 'text-green-400' :
                    cell === '~' ? 'text-blue-400' :
                    cell === '.' ? 'text-yellow-600' :
                    cell !== ' ' ? 'text-lg lg:text-2xl' : 'text-gray-600'
                  }`}
                >
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
        
        {/* Player positions */}
        <div className="mt-4 pt-4 border-t border-gray-600/30 text-xs text-gray-300">
          <div className="font-semibold mb-2">Player Positions:</div>
          {players.map(player => {
            const progress = getPlayerProgress(player);
            const position = getPlayerPosition(player);
            return (
              <div key={player.id} className="flex items-center gap-2 mb-1">
                <span className="text-lg">{AVATARS[player.avatar].emoji}</span>
                <span className={player.id === currentPlayer.id ? 'text-yellow-300 font-bold' : 'text-gray-300'}>
                  {player.name}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">
                  {position}/20 ({progress}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
