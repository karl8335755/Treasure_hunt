import { type Player, AVATARS } from '../types';
import { AvatarSelector } from './AvatarSelector';

interface Props {
	currentPlayer: Player;
	leaderboard: Player[];
	onSwitchPlayer: (playerId: string) => void;
	onChangeAvatar: (avatarId: import('../types').AvatarId) => void;
	onReset: () => void;
	isMusicPlaying: boolean;
	onToggleMusic: () => void;
	timer: number;
	isTimerRunning: boolean;
	onToggleTimer: () => void;
	onResetTimer: () => void;
}

export function Header({ currentPlayer, leaderboard, onSwitchPlayer, onChangeAvatar, onReset, isMusicPlaying, onToggleMusic, timer, isTimerRunning, onToggleTimer, onResetTimer }: Props) {
	// Format timer as MM:SS
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<div className="space-y-6">
			{/* Title */}
			<div className="text-center">
				<h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
					🏴‍☠️ USACO Bronze Treasure Hunt 🗺️
				</h1>
				<p className="text-lg text-yellow-400/90 font-medium">
					Navigate through coding challenges and uncover legendary artifacts! ⚓💎
				</p>
			</div>

			{/* Leaderboard */}
			<div className="bg-black/30 rounded-xl p-4 border-2 border-yellow-400/30">
				<h2 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
					<span className="text-2xl">🏆</span>
					Pirate Leaderboard
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					{leaderboard.map((player, index) => {
						const isActive = player.id === currentPlayer.id;
						const medals = ['🥇', '🥈', '🥉'];
						const completedProblems = Object.values(player.completedProblems).filter(Boolean).length;
						const progress = Math.round((completedProblems / 21) * 100); // 21 total problems
						
						return (
							<button
								key={player.id}
								onClick={() => onSwitchPlayer(player.id)}
								className={`p-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
									isActive 
										? 'bg-yellow-400 text-black shadow-lg scale-105 border-2 border-yellow-300' 
										: 'bg-gray-700 text-white hover:bg-gray-600 hover:scale-105 border-2 border-gray-600'
								}`}
							>
								<div className="text-center">
									{/* Rank and Medal */}
									<div className="flex items-center justify-center gap-2 mb-2">
										<span className="text-2xl">{index < 3 ? medals[index] : `#${index + 1}`}</span>
										<span className="text-3xl">{AVATARS[player.avatar].emoji}</span>
										<span className="font-bold text-4xl">{player.name}</span>
									</div>
									
									{/* Coins */}
									<div className="flex items-center justify-center gap-1 mb-2">
										<span className="text-yellow-300 text-lg">🪙</span>
										<span className="font-bold text-lg">{player.coins}</span>
										<span className="text-xs opacity-75">coins</span>
									</div>
									
									{/* Progress */}
									<div className="mb-2">
										<div className="flex justify-between text-xs mb-1">
											<span>Progress</span>
											<span>{progress}%</span>
										</div>
										<div className="w-full bg-gray-600 rounded-full h-2">
											<div 
												className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
												style={{ width: `${progress}%` }}
											></div>
										</div>
									</div>
									
									{/* Stats */}
									<div className="flex justify-between text-xs opacity-75">
										<span>✅ {completedProblems}</span>
										<span>📦 {player.inventory.length}</span>
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Player Controls */}
			<div className="flex flex-wrap justify-center items-center gap-4">
				{/* Avatar Selector */}
				<AvatarSelector 
					currentAvatar={currentPlayer.avatar}
					onAvatarChange={onChangeAvatar}
				/>
				
				{/* Coins */}
				<div className="bg-yellow-500/20 rounded-xl p-4 border-2 border-yellow-400/50 w-32 h-32 flex flex-col items-center justify-center">
					<div className="text-3xl mb-2">🪙</div>
					<div className="text-yellow-300 font-bold text-xl">{currentPlayer.coins}</div>
					<div className="text-yellow-200 text-sm text-center">Coins</div>
				</div>
				
				{/* Timer Display */}
				<div className="bg-blue-600/20 border-2 border-blue-400/50 rounded-xl p-4 w-32 h-32 flex flex-col items-center justify-center">
					<div className="text-2xl font-mono font-bold text-blue-300 mb-2">
						{formatTime(timer)}
					</div>
					<div className="text-xs text-blue-200 text-center">
						{isTimerRunning ? '⏱️ Running' : '⏸️ Paused'}
					</div>
				</div>
				
				{/* Timer Controls */}
				<div className="flex flex-col gap-1">
					{/* Timer Toggle Button */}
					<button 
						className={`${
							isTimerRunning 
								? 'bg-red-600/20 hover:bg-red-600/40 border-red-400/50 hover:border-red-400' 
								: 'bg-green-600/20 hover:bg-green-600/40 border-green-400/50 hover:border-green-400'
						} text-white px-2 py-1 rounded-md font-bold text-xs border-2 transition-all duration-200 hover:scale-105 flex items-center justify-center`}
						onClick={onToggleTimer}
					>
						<span className="text-sm mr-1">{isTimerRunning ? '⏸️' : '▶️'}</span>
						{isTimerRunning ? 'Pause' : 'Start'}
					</button>
					
					{/* Reset Timer Button */}
					<button 
						className="bg-orange-600/20 hover:bg-orange-600/40 text-white px-2 py-1 rounded-md font-bold text-xs border-2 border-orange-400/50 hover:border-orange-400 transition-all duration-200 hover:scale-105 flex items-center justify-center"
						onClick={onResetTimer}
					>
						<span className="text-sm mr-1">🔄</span>
						Reset
					</button>
				</div>
				
				{/* Music Toggle Button */}
				<button 
					className={`${
						isMusicPlaying 
							? 'bg-green-600/20 hover:bg-green-600/40 border-green-400/50 hover:border-green-400' 
							: 'bg-gray-600/20 hover:bg-gray-600/40 border-gray-400/50 hover:border-gray-400'
					} text-white px-2 py-1 rounded-md font-bold text-xs border-2 transition-all duration-200 hover:scale-105 flex items-center justify-center`}
					onClick={onToggleMusic}
				>
					<span className="text-sm mr-1">{isMusicPlaying ? '🔊' : '🔇'}</span>
					{isMusicPlaying ? 'Music On' : 'Music Off'}
				</button>
				
				{/* Reset Button */}
				<button 
					className="bg-red-600/20 hover:bg-red-600/40 text-white px-2 py-1 rounded-md font-bold text-xs border-2 border-red-400/50 hover:border-red-400 transition-all duration-200 hover:scale-105 flex items-center justify-center" 
					onClick={onReset}
				>
					<span className="text-sm mr-1">🔄</span>
					Reset All
				</button>
			</div>
		</div>
	);
}

export default Header;


