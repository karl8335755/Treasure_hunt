import { type Player, AVATARS } from '../types';
import wizardBackground from '/wizard-background.jpg';
import pirateBackground from '/pirate-background.jpg';
import explorerBackground from '/explorer-background.jpg';
import ninjaBackground from '/ninja.jpg';
import logoImage from '/logo.png';

interface Props {
	currentPlayer: Player;
	leaderboard: Player[];
	onSwitchPlayer: (playerId: string) => void;
	onResetStudent: (playerId: string) => void;
}

export function Header({ currentPlayer, leaderboard, onSwitchPlayer, onResetStudent }: Props) {

	return (
		<div className="space-y-8">
			{/* Logo and Leaderboard Row */}
			<div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-2 mb-6 justify-start -ml-6 -pl-6">
				{/* Logo */}
				<div className="flex-shrink-0 mt-6 lg:mt-12 pr-0 lg:pr-6 w-full lg:w-auto">
					<div 
						className="relative overflow-hidden mx-auto lg:mx-0"
						style={{
							backgroundImage: `url(${logoImage})`,
							backgroundSize: '90%',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
							width: '280px',
							height: '240px'
						}}
					>
					</div>
				</div>

				{/* Leaderboard */}
				<div className="flex-1 p-3 lg:p-6 mt-0 lg:mt-12 w-full">
						<h2 className="text-2xl font-bold text-gray-200 mb-4 flex items-center gap-3">
							<span className="text-3xl">🏆</span>
							Leaderboard
						</h2>
					<div className="flex flex-wrap gap-2 lg:gap-4 justify-center">
						{leaderboard.map((player) => {
							const isActive = player.id === currentPlayer.id;
							const completedProblems = Object.values(player.completedProblems).filter(Boolean).length;
							const progress = Math.round((completedProblems / 21) * 100); // 21 total problems
							
							return (
								<button
								key={player.id}
								onClick={() => onSwitchPlayer(player.id)}
								className={`p-2 lg:p-3 rounded-xl font-semibold text-xs lg:text-sm transition-all duration-300 relative overflow-hidden w-32 h-40 lg:w-48 lg:h-52 ${
									isActive 
										? 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-900 shadow-xl scale-105 border-2 border-gray-400' 
										: 'bg-gradient-to-br from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700 hover:scale-105 border-2 border-gray-600 hover:border-gray-500'
								}`}
									style={player.avatar === 'wizard' ? {
										backgroundImage: `url(${wizardBackground})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										backgroundRepeat: 'no-repeat'
									} : player.avatar === 'pirate' ? {
										backgroundImage: `url(${pirateBackground})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center 20%',
										backgroundRepeat: 'no-repeat'
									} : player.avatar === 'explorer' ? {
										backgroundImage: `url(${explorerBackground})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										backgroundRepeat: 'no-repeat'
									} : player.avatar === 'ninja' ? {
										backgroundImage: `url(${ninjaBackground})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										backgroundRepeat: 'no-repeat'
									} : {}}
								>
									{/* Background overlay for better text readability */}
									{(player.avatar === 'wizard' || player.avatar === 'pirate' || player.avatar === 'explorer' || player.avatar === 'ninja') && (
										<div className={`absolute inset-0 rounded-xl ${
											isActive ? 'bg-black/40' : 'bg-black/70'
										}`}></div>
									)}
									<div className={`text-center relative z-10 ${(player.avatar === 'wizard' || player.avatar === 'pirate' || player.avatar === 'explorer' || player.avatar === 'ninja') ? 'text-white' : ''}`}>
										{/* Avatar and Name */}
										<div className="flex items-center justify-center gap-1 lg:gap-2 mb-2">
											<span className="text-xl lg:text-3xl">{AVATARS[player.avatar].emoji}</span>
											<span className="font-bold text-lg lg:text-4xl">{player.name}</span>
										</div>
										
										{/* Coins */}
										<div className="flex items-center justify-center gap-1 mb-2">
											<span className="text-yellow-300 text-sm lg:text-lg">🪙</span>
											<span className="font-bold text-sm lg:text-lg">{player.coins}</span>
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
										<div className="flex justify-between text-xs opacity-75 mb-2">
											<span>✅ {completedProblems}</span>
											<span>📦 {player.inventory.length}</span>
										</div>
										
										{/* Individual Reset Button */}
										<button
											onClick={(e) => {
												e.stopPropagation(); // Prevent switching to this player
												onResetStudent(player.id);
											}}
											className="w-full bg-gray-700/30 hover:bg-gray-600/40 text-gray-300 hover:text-gray-200 px-2 py-1 rounded-md text-xs font-bold border border-gray-600/50 hover:border-gray-500 transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1"
										>
											<span>🔄</span>
											Reset {player.name}
										</button>
									</div>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			                
		</div>
	);
}

export default Header;


