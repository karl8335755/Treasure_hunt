interface Props {
	coins: number;
	onTrade: (item: 'chips' | 'soda') => void;
}

export function Shop({ coins, onTrade }: Props) {
	return (
		<div className="mt-6 relative group">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
			
			{/* Main shop card - styled like a pirate market */}
			<div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/60 backdrop-blur-sm rounded-2xl border-2 border-yellow-400/50 p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
				<div className="flex items-center gap-2 mb-3">
					<div className="text-3xl">🏴‍☠️</div>
					<div>
						<h3 className="text-lg font-bold text-yellow-400">Pirate's Market</h3>
						<p className="text-yellow-400/90 text-sm">Trade your coins for provisions, matey!</p>
					</div>
				</div>
				
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Chips Item */}
					<div className="group/item relative">
						<button 
							className={`w-48 h-48 p-4 rounded-lg transition-all duration-300 ${
								coins < 20 
									? 'bg-gray-500/30 text-gray-400 cursor-not-allowed' 
									: 'bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white hover:scale-105 shadow-lg border-2 border-yellow-300/50 hover:border-yellow-300'
							}`}
							disabled={coins < 20} 
							onClick={() => onTrade('chips')}
						>
							{/* Item Container */}
							<div className="h-full flex flex-col items-center justify-center text-center">
								{/* Item Icon */}
								<div className="mb-3">
									<div className="w-[60px] h-[60px] mx-auto bg-gradient-to-br from-red-500 to-pink-500 rounded-lg border-2 border-red-400/50 flex items-center justify-center shadow-inner">
										<div className="text-xl">🍟</div>
									</div>
								</div>
								
								{/* Item Details */}
								<div className="flex-1 flex flex-col justify-center">
									<div className="font-bold text-sm mb-1">Bag of Chips</div>
									<div className="text-xs opacity-90 mb-2">Crunchy provisions</div>
									
									{/* Price Tag */}
									<div className={`px-3 py-1 rounded-full text-xs font-bold ${
										coins < 20 
											? 'bg-gray-600/50 text-gray-300' 
											: 'bg-yellow-500/80 text-black'
									}`}>
										{coins < 20 ? 'Need 20 coins' : '🪙 20 coins'}
									</div>
								</div>
							</div>
							
							{/* Hover Effect */}
							{coins >= 20 && (
								<div className="absolute inset-0 bg-yellow-400/20 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
							)}
						</button>
					</div>
					
					{/* Soda Item */}
					<div className="group/item relative">
						<button 
							className={`w-48 h-48 p-4 rounded-lg transition-all duration-300 ${
								coins < 15 
									? 'bg-gray-500/30 text-gray-400 cursor-not-allowed' 
									: 'bg-gradient-to-br from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white hover:scale-105 shadow-lg border-2 border-blue-300/50 hover:border-blue-300'
							}`}
							disabled={coins < 15} 
							onClick={() => onTrade('soda')}
						>
							{/* Item Container */}
							<div className="h-full flex flex-col items-center justify-center text-center">
								{/* Item Icon */}
								<div className="mb-3">
									<div className="w-[60px] h-[60px] mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg border-2 border-blue-400/50 flex items-center justify-center shadow-inner">
										<div className="text-xl">🥤</div>
									</div>
								</div>
								
								{/* Item Details */}
								<div className="flex-1 flex flex-col justify-center">
									<div className="font-bold text-sm mb-1">Can of Soda</div>
									<div className="text-xs opacity-90 mb-2">Refreshing drink</div>
									
									{/* Price Tag */}
									<div className={`px-3 py-1 rounded-full text-xs font-bold ${
										coins < 15 
											? 'bg-gray-600/50 text-gray-300' 
											: 'bg-blue-500/80 text-white'
									}`}>
										{coins < 15 ? 'Need 15 coins' : '🪙 15 coins'}
									</div>
								</div>
							</div>
							
							{/* Hover Effect */}
							{coins >= 15 && (
								<div className="absolute inset-0 bg-blue-400/20 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
							)}
						</button>
					</div>
				</div>
				
				<div className="mt-3 text-center">
					<div className="text-yellow-400/80 text-xs">
						💡 Tip: Complete coding challenges to earn more coins, ye scurvy dog!
					</div>
				</div>
			</div>
		</div>
	);
}

export default Shop;


