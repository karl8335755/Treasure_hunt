import { LEVELS } from './gameData'
import { useGameState } from './state'
import Header from './components/Header'
import LevelCard from './components/LevelCard'
import Shop from './components/Shop'


function App() {
  const { 
    currentPlayer, 
    leaderboard, 
    unlockedLevelIds, 
    completeProblem, 
    openBox, 
    trade, 
    resetProgress, 
    switchPlayer,
    changeAvatar,
    isMusicPlaying,
    toggleBackgroundMusic,
    timer,
    isTimerRunning,
    toggleTimer,
    resetTimer
  } = useGameState()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Dungeon texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>
      
      {/* Mysterious fog/mist effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
      
      <div className="relative z-10 mx-auto max-w-7xl p-6">
        <Header 
          currentPlayer={currentPlayer} 
          leaderboard={leaderboard} 
          onSwitchPlayer={switchPlayer} 
          onChangeAvatar={changeAvatar}
          onReset={resetProgress} 
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={toggleBackgroundMusic}
          timer={timer}
          isTimerRunning={isTimerRunning}
          onToggleTimer={toggleTimer}
          onResetTimer={resetTimer}
        />

        <div className="space-y-6 mt-6">
            {(() => {
              // Group levels by their number (1, 2, 3, 4, 5)
              const groupedLevels = LEVELS.reduce((groups, level) => {
                const levelNumber = level.id.replace(/[A-Z]$/, ''); // Remove A/B suffix
                if (!groups[levelNumber]) {
                  groups[levelNumber] = [];
                }
                groups[levelNumber].push(level);
                return groups;
              }, {} as Record<string, typeof LEVELS>);

              return Object.entries(groupedLevels).map(([levelNumber, levels]) => (
                <div key={levelNumber} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {levels.map((level, index) => {
                    const isLocked = !unlockedLevelIds.includes(level.id)
                    const isBoxOpened = Boolean(currentPlayer.openedBoxes[level.id])
                    return (
                      <LevelCard
                        key={level.id}
                        level={level}
                        isLocked={isLocked}
                        isBoxOpened={isBoxOpened}
                        totalCoinsEarned={currentPlayer.totalCoinsEarned}
                        onCompleteProblem={completeProblem}
                        onOpenBox={openBox}
                        index={index}
                      />
                    )
                  })}
                </div>
              ));
            })()}
          </div>

        <Shop coins={currentPlayer.coins} onTrade={trade} />

        <div className="mt-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
            <span className="text-2xl">🎒</span>
            {currentPlayer.name}'s Treasure Inventory
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {currentPlayer.inventory.length === 0 && (
              <div className="col-span-full text-center py-6 text-yellow-400 bg-black/50 rounded-xl border-2 border-yellow-400/30">
                <div className="text-3xl mb-1">📦</div>
                <div className="text-sm">Your treasure chest is empty</div>
                <div className="text-xs text-yellow-400/80">Complete challenges to earn legendary artifacts!</div>
              </div>
            )}
            {currentPlayer.inventory.map((item) => (
              <div key={item.id} className="group relative bg-black/50 rounded-xl border-2 border-yellow-400/30 p-3 hover:scale-105 transition-all duration-300">
                <div className="font-semibold text-yellow-400 mb-1 text-sm">{item.label}</div>
                <div className="text-xs text-yellow-400/70 bg-black/30 rounded-full px-2 py-1 inline-block">{item.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
