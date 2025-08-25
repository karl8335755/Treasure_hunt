import { LEVELS } from './gameData'
import { useGameState } from './state'
import Header from './components/Header'
import LevelCard from './components/LevelCard'
import Shop from './components/Shop'
import { AvatarSelector } from './components/AvatarSelector'
import { WeeklyRecap } from './components/WeeklyRecap'
import { ProgressMap } from './components/ProgressMap'
import { useState } from 'react'


function App() {
  const [showWeeklyRecap, setShowWeeklyRecap] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<{ id: string; label: string; type: string } | null>(null);
  
  const { 
    currentPlayer, 
    leaderboard, 
    unlockedLevelIds, 
    completeProblem, 
    openBox, 
    trade, 
    sellItem,
    redeemItem,
    resetProgress, 
    resetStudentProgress,
    weeklyReset,
    switchPlayer,
    changeAvatar,
    isMusicPlaying,
    toggleBackgroundMusic,
    timer,
    isTimerRunning,
    toggleTimer,
    resetTimer
  } = useGameState()

  // Format timer as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    		<div className="min-h-screen bg-black relative overflow-hidden">
			{/* Subtle texture overlay */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:20px_20px] opacity-10"></div>
			
			{/* Gentle gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-gray-900/10"></div>
      
      <div className="relative z-10 mx-auto max-w-7xl p-6">
        <Header 
          currentPlayer={currentPlayer} 
          leaderboard={leaderboard} 
          onSwitchPlayer={switchPlayer} 
          onResetStudent={resetStudentProgress}
        />

        {/* Progress Map */}
        <div className="mt-6">
          <ProgressMap 
            players={leaderboard} 
            currentPlayer={currentPlayer} 
          />
        </div>

        <div className="space-y-6 mt-6">
            {(() => {
              // Group levels by their number (1, 2, 3, 4, 5)
              const groupedLevels = LEVELS.reduce((groups, level) => {
                let levelNumber = level.id.replace(/[A-Z]$/, ''); // Remove A/B suffix
                
                // Special grouping: put levels 4 and 5 together
                if (levelNumber === '4' || levelNumber === '5') {
                  levelNumber = '4-5';
                }
                
                if (!groups[levelNumber]) {
                  groups[levelNumber] = [];
                }
                groups[levelNumber].push(level);
                return groups;
              }, {} as Record<string, typeof LEVELS>);

              return Object.entries(groupedLevels).map(([levelNumber, levels]) => {
                // Filter to only show unlocked levels
                const unlockedLevels = levels.filter(level => unlockedLevelIds.includes(level.id))
                
                // Special handling for Level 1 to include ControlPanel
                if (levelNumber === '1') {
                  return (
                    <div key={levelNumber} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {unlockedLevels.map((level, index) => {
                        const isBoxOpened = Boolean(currentPlayer.openedBoxes[level.id])
                        return (
                                                  <LevelCard
                          key={level.id}
                          level={level}
                          isLocked={false}
                          isBoxOpened={isBoxOpened}
                          totalCoinsEarned={currentPlayer.totalCoinsEarned}
                          completedProblems={currentPlayer.completedProblems}
                          onCompleteProblem={completeProblem}
                          onOpenBox={openBox}
                          index={index}
                        />
                        )
                      })}
                      
                      {/* ControlPanel */}
                      <div className="flex flex-wrap justify-center items-center gap-4 bg-gradient-to-r from-gray-800/20 to-gray-900/20 rounded-2xl p-4 border border-gray-600/30">
                        {/* Avatar Selector */}
                        <AvatarSelector
                          currentAvatar={currentPlayer.avatar}
                          onAvatarChange={changeAvatar}
                        />

                        {/* Coins */}
                        <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/20 rounded-xl p-4 border-2 border-gray-600/50 w-32 h-32 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <div className="text-3xl mb-2">🪙</div>
                          <div className="text-gray-200 font-bold text-xl">{currentPlayer.coins}</div>
                          <div className="text-gray-400 text-sm text-center">Coins</div>
                        </div>

                        {/* Timer Display */}
                        <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/20 border-2 border-gray-600/50 rounded-xl p-4 w-32 h-32 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <div className="text-2xl font-mono font-bold text-gray-200 mb-2">
                            {formatTime(timer)}
                          </div>
                          <div className="text-xs text-gray-400 text-center">
                            {isTimerRunning ? '⏱️ Running' : '⏸️ Paused'}
                          </div>
                        </div>

                        {/* Timer Controls */}
                        <div className="flex flex-col gap-1">
                          {/* Timer Toggle Button */}
                          <button
                            className={`${
                              isTimerRunning
                                ? 'bg-gray-700/30 hover:bg-gray-600/40 border-gray-600/50 hover:border-gray-500'
                                : 'bg-gray-700/30 hover:bg-gray-600/40 border-gray-600/50 hover:border-gray-500'
                            } text-gray-300 px-2 py-1 rounded-md font-bold text-xs border-2 transition-all duration-200 hover:scale-105 flex items-center justify-center`}
                            onClick={toggleTimer}
                          >
                            <span className="text-sm mr-1">{isTimerRunning ? '⏸️' : '▶️'}</span>
                            {isTimerRunning ? 'Pause' : 'Start'}
                          </button>

                          {/* Reset Timer Button */}
                          <button
                            className="bg-gray-700/30 hover:bg-gray-600/40 text-gray-300 px-2 py-1 rounded-md font-bold text-xs border-2 border-gray-600/50 hover:border-gray-500 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                            onClick={resetTimer}
                          >
                            <span className="text-sm mr-1">🔄</span>
                            Reset
                          </button>
                        </div>

                        {/* Music Toggle Button */}
                        <button
                          className={`${
                            isMusicPlaying
                              ? 'bg-gray-600/30 hover:bg-gray-500/40 border-gray-500/50 hover:border-gray-400'
                              : 'bg-gray-700/30 hover:bg-gray-600/40 border-gray-600/50 hover:border-gray-500'
                          } text-gray-300 px-2 py-1 rounded-md font-bold text-xs border-2 transition-all duration-200 hover:scale-105 flex items-center justify-center`}
                          onClick={toggleBackgroundMusic}
                        >
                          <span className="text-sm mr-1">{isMusicPlaying ? '🔊' : '🔇'}</span>
                          {isMusicPlaying ? 'Music On' : 'Music Off'}
                        </button>

                        {/* Weekly Reset Button */}
                        <button
                          className="bg-gradient-to-r from-orange-600/30 to-orange-700/30 hover:from-orange-500/40 hover:to-orange-600/40 text-orange-300 px-2 py-1 rounded-md font-bold text-xs border-2 border-orange-600/50 hover:border-orange-500 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                          onClick={() => {
                            if (confirm('Are you sure you want to reset this week\'s progress? This will save your progress and start a new week.')) {
                              weeklyReset(currentPlayer.id);
                            }
                          }}
                        >
                          <span className="text-sm mr-1">📅</span>
                          Weekly Reset
                        </button>

                        {/* Weekly Recap Button */}
                        <button
                          className="bg-gradient-to-r from-blue-600/30 to-blue-700/30 hover:from-blue-500/40 hover:to-blue-600/40 text-blue-300 px-2 py-1 rounded-md font-bold text-xs border-2 border-blue-600/50 hover:border-blue-500 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                          onClick={() => setShowWeeklyRecap(true)}
                        >
                          <span className="text-sm mr-1">📊</span>
                          Weekly Recap
                        </button>

                        {/* Reset All Button */}
                        <button
                          className="bg-gray-700/30 hover:bg-gray-600/40 text-gray-300 px-2 py-1 rounded-md font-bold text-xs border-2 border-gray-600/50 hover:border-gray-500 transition-all duration-200 hover:scale-105 flex items-center justify-center"
                          onClick={resetProgress}
                        >
                          <span className="text-sm mr-1">🔄</span>
                          Reset All
                        </button>
                      </div>
                    </div>
                  );
                }
                
                // Regular handling for other levels
                return (
                  <div key={levelNumber} className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${unlockedLevels.length === 1 ? 'md:justify-center' : ''}`}>
                    {unlockedLevels.map((level, index) => {
                      const isBoxOpened = Boolean(currentPlayer.openedBoxes[level.id])
                      return (
                        <LevelCard
                          key={level.id}
                          level={level}
                          isLocked={false}
                          isBoxOpened={isBoxOpened}
                          totalCoinsEarned={currentPlayer.totalCoinsEarned}
                          completedProblems={currentPlayer.completedProblems}
                          onCompleteProblem={completeProblem}
                          onOpenBox={openBox}
                          index={index}
                        />
                      )
                    })}
                  </div>
                );
              });
            })()}
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Shop */}
          <div className="lg:col-span-2">
            <Shop coins={currentPlayer.coins} onTrade={trade} purchasedLimitedItems={currentPlayer.purchasedLimitedItems} currentAvatar={currentPlayer.avatar} />
          </div>

          {/* Inventory */}
          <div>
            <h3 className="text-xl font-bold text-gray-300 mb-3 flex items-center gap-2">
              <span className="text-2xl">🎒</span>
              {currentPlayer.name}'s Inventory
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 16 }, (_, index) => {
                const item = currentPlayer.inventory[index];
                return (
                  <div 
                    key={index} 
                    className="aspect-square bg-gray-800/50 rounded-lg border-2 border-gray-600/30 p-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => item && setSelectedInventoryItem({ id: item.id, label: item.label, type: item.type })}
                  >
                    {item ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="text-lg mb-1">
                          {item.type === 'chips' && '🥔'}
                          {item.type === 'chips-limited' && '🥔'}
                          {item.type === 'soda' && '🥤'}
                          {item.type === 'soda-limited' && '🥤'}
                          {item.type === 'lunch' && '🍱'}
                          {item.type === 'map-fragment' && '🗺️'}
                        </div>
                        <div className="text-xs text-gray-300 font-semibold truncate w-full">{item.label}</div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-600">
                        <span className="text-xs">Empty</span>
                      </div>
                    )}
                  </div>
                );
              })}
        </div>
      </div>
        </div>
      </div>

      {/* Weekly Recap Modal */}
      {showWeeklyRecap && (
        <WeeklyRecap
          weeklyProgress={currentPlayer.weeklyProgress}
          onClose={() => setShowWeeklyRecap(false)}
        />
      )}

      {/* Inventory Item Modal */}
      {selectedInventoryItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-sm w-full mx-4 border-2 border-gray-600/50">
            <div className="text-center">
              {/* Item Icon */}
              <div className="text-6xl mb-4">
                {selectedInventoryItem.type === 'chips' && '🥔'}
                {selectedInventoryItem.type === 'chips-limited' && '🥔'}
                {selectedInventoryItem.type === 'soda' && '🥤'}
                {selectedInventoryItem.type === 'soda-limited' && '🥤'}
                {selectedInventoryItem.type === 'lunch' && '🍱'}
                {selectedInventoryItem.type === 'map-fragment' && '🗺️'}
              </div>
              
              {/* Item Name */}
              <h3 className="text-xl font-bold text-gray-300 mb-2">{selectedInventoryItem.label}</h3>
              
              {/* Item Type */}
              <p className="text-gray-400 text-sm mb-6 capitalize">
                {selectedInventoryItem.type.replace('-', ' ')}
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    redeemItem(selectedInventoryItem.id);
                    setSelectedInventoryItem(null);
                  }}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2"
                >
                  <span>🎁</span>
                  Redeem
                </button>
                
                <button
                  onClick={() => {
                    sellItem(selectedInventoryItem.id);
                    setSelectedInventoryItem(null);
                  }}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center gap-2"
                >
                  <span>💰</span>
                  Sell
                </button>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedInventoryItem(null)}
                className="mt-4 text-gray-400 hover:text-gray-200 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
