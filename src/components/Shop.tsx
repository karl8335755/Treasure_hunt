

interface Props {
	coins: number;
	onTrade: (item: 'chips' | 'chips-limited' | 'soda' | 'soda-limited' | 'lunch') => void;
	purchasedLimitedItems: Record<string, boolean>;
	currentAvatar: string;
}

export function Shop({ coins, onTrade, purchasedLimitedItems, currentAvatar }: Props) {
	// Determine shop name and icon based on avatar
	const getShopInfo = (avatar: string) => {
		switch (avatar) {
			case 'pirate':
				return { name: "Pirate's Market", icon: "🏴‍☠️" };
			case 'explorer':
				return { name: "Adventure's Market", icon: "🧭" };
			case 'wizard':
				return { name: "Diagon Alley", icon: "🔮" };
			case 'knight':
				return { name: "Emporium", icon: "⚔️" };
			case 'archer':
				return { name: "Traveler's Market", icon: "🏹" };
			case 'ninja':
				return { name: "Black Market", icon: "🥷" };
			default:
				return { name: "Black Market", icon: "🕶️" };
		}
	};

	const shopInfo = getShopInfo(currentAvatar);

	return (
		<div className="mt-6 relative group">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
			
			{/* Main shop card */}
			<div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/60 backdrop-blur-sm rounded-2xl border-2 border-gray-600/50 p-6 shadow-2xl hover:shadow-3xl transition-all duration-300">
				<div className="flex items-center gap-2 mb-3">
					<div className="text-3xl">{shopInfo.icon}</div>
					<div>
						<h3 className="text-lg font-bold text-gray-300">{shopInfo.name}</h3>
						<p className="text-gray-400 text-sm">Trade your coins for items</p>
					</div>
				</div>
				
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{/* Chips Basic (Unlimited) */}
					<div className="group/item relative">
						<button 
							className={`w-56 h-36 p-4 rounded-xl transition-all duration-300 ${
								coins < 5 
									? 'bg-gray-700/30 text-gray-500 cursor-not-allowed border-2 border-gray-600/30' 
									: 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-200 hover:scale-105 shadow-lg border-2 border-gray-500/50 hover:border-gray-400'
							}`}
							disabled={coins < 5} 
							onClick={() => onTrade('chips')}
						>
							{/* Item Container */}
							<div className="h-full flex items-center justify-between px-2">
								{/* Item Icon */}
								<div className="flex-shrink-0">
									<div className="w-[48px] h-[48px] bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg border-2 border-gray-400/50 flex items-center justify-center shadow-inner">
										<div className="text-xl">🍟</div>
									</div>
								</div>
								
								{/* Item Details */}
								<div className="flex-1 flex flex-col justify-center ml-4 text-left">
									<div className="font-bold text-sm mb-1">Bag of Chips</div>
									<div className="text-xs opacity-90 mb-2">Basic - Unlimited</div>
									
									{/* Price Tag */}
									<div className={`px-3 py-1 rounded-full text-[10px] font-bold w-fit ${
										coins < 5 
											? 'bg-gray-600/50 text-gray-400' 
											: 'bg-gray-500/80 text-gray-200'
									}`}>
										{coins < 5 ? 'Need 5 coins' : '🪙 5 coins'}
									</div>
								</div>
							</div>
							
							{/* Hover Effect */}
							{coins >= 5 && (
								<div className="absolute inset-0 bg-yellow-400/20 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
							)}
						</button>
					</div>
					
					{/* Chips Premium (Limited) */}
					<div className="group/item relative">
						<button 
							className={`w-56 h-36 p-4 rounded-xl transition-all duration-300 ${
								purchasedLimitedItems['chips-limited']
									? 'bg-gray-700/30 text-gray-500 cursor-not-allowed border-2 border-gray-600/30'
									: coins < 20 
										? 'bg-gray-700/30 text-gray-500 cursor-not-allowed border-2 border-gray-600/30' 
										: 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-200 hover:scale-105 shadow-lg border-2 border-gray-500/50 hover:border-gray-400'
							}`}
							disabled={purchasedLimitedItems['chips-limited'] || coins < 20} 
							onClick={() => onTrade('chips-limited')}
						>
							{/* Item Container */}
							<div className="h-full flex items-center justify-between px-2">
								{/* Item Icon */}
								<div className="flex-shrink-0">
									<div className="w-[48px] h-[48px] bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg border-2 border-gray-400/50 flex items-center justify-center shadow-inner">
										<div className="text-xl">🍟</div>
									</div>
								</div>
								
								{/* Item Details */}
								<div className="flex-1 flex flex-col justify-center ml-4 text-left">
									<div className="font-bold text-sm mb-1">Bag of Chips</div>
									<div className="text-xs opacity-90 mb-2">Premium - Limited</div>
									
									{/* Price Tag */}
									<div className={`px-3 py-1 rounded-full text-[10px] font-bold w-fit ${
										purchasedLimitedItems['chips-limited']
											? 'bg-gray-600/50 text-gray-400'
											: coins < 20 
												? 'bg-gray-600/50 text-gray-400' 
												: 'bg-gray-500/80 text-gray-200'
									}`}>
										{purchasedLimitedItems['chips-limited'] ? '✅ Purchased' : coins < 20 ? 'Need 20 coins' : '🪙 20 coins'}
									</div>
								</div>
							</div>
							
							{/* Hover Effect */}
							{coins >= 20 && !purchasedLimitedItems['chips-limited'] && (
								<div className="absolute inset-0 bg-yellow-400/20 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
							)}
						</button>
					</div>
					
					{/* Soda Basic (Unlimited) */}
					<div className="group/item relative">
						<button 
							className={`w-56 h-36 p-4 rounded-xl transition-all duration-300 ${
								coins < 5 
									? 'bg-gray-700/30 text-gray-500 cursor-not-allowed border-2 border-gray-600/30' 
									: 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-200 hover:scale-105 shadow-lg border-2 border-gray-500/50 hover:border-gray-400'
							}`}
							disabled={coins < 5} 
							onClick={() => onTrade('soda')}
						>
							{/* Item Container */}
							<div className="h-full flex items-center justify-between px-2">
								{/* Item Icon */}
								<div className="flex-shrink-0">
									<div className="w-[48px] h-[48px] bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg border-2 border-blue-400/50 flex items-center justify-center shadow-inner">
										<div className="text-xl">🥤</div>
									</div>
								</div>
								
								{/* Item Details */}
								<div className="flex-1 flex flex-col justify-center ml-4 text-left">
									<div className="font-bold text-sm mb-1">Can of Soda</div>
									<div className="text-xs opacity-90 mb-2">Basic - Unlimited</div>
									
									{/* Price Tag */}
									<div className={`px-3 py-1 rounded-full text-[10px] font-bold w-fit ${
										coins < 5 
											? 'bg-gray-600/50 text-gray-300' 
											: 'bg-blue-500/80 text-white'
									}`}>
										{coins < 5 ? 'Need 5 coins' : '🪙 5 coins'}
									</div>
								</div>
							</div>
							
							{/* Hover Effect */}
							{coins >= 5 && (
								<div className="absolute inset-0 bg-blue-400/20 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
							)}
						</button>
					</div>
					
					{/* Soda Premium (Limited) */}
					<div className="group/item relative">
						<button 
							className={`w-56 h-36 p-4 rounded-xl transition-all duration-300 ${
								purchasedLimitedItems['soda-limited']
									? 'bg-gray-700/30 text-gray-500 cursor-not-allowed border-2 border-gray-600/30'
									: coins < 15 
										? 'bg-gray-700/30 text-gray-500 cursor-not-allowed border-2 border-gray-600/30' 
										: 'bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-200 hover:scale-105 shadow-lg border-2 border-gray-500/50 hover:border-gray-400'
							}`}
							disabled={purchasedLimitedItems['soda-limited'] || coins < 15} 
							onClick={() => onTrade('soda-limited')}
						>
							{/* Item Container */}
							<div className="h-full flex items-center justify-between px-2">
								{/* Item Icon */}
								<div className="flex-shrink-0">
									<div className="w-[48px] h-[48px] bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg border-2 border-blue-400/50 flex items-center justify-center shadow-inner">
										<div className="text-xl">🥤</div>
									</div>
								</div>
								
								{/* Item Details */}
								<div className="flex-1 flex flex-col justify-center ml-4 text-left">
									<div className="font-bold text-sm mb-1">Can of Soda</div>
									<div className="text-xs opacity-90 mb-2">Premium - Limited</div>
									
									{/* Price Tag */}
									<div className={`px-3 py-1 rounded-full text-[10px] font-bold w-fit ${
										purchasedLimitedItems['soda-limited']
											? 'bg-gray-600/50 text-gray-400'
											: coins < 15 
												? 'bg-gray-600/50 text-gray-300' 
												: 'bg-blue-500/80 text-white'
									}`}>
										{purchasedLimitedItems['soda-limited'] ? '✅ Purchased' : coins < 15 ? 'Need 15 coins' : '🪙 15 coins'}
									</div>
								</div>
							</div>
							
							{/* Hover Effect */}
							{coins >= 15 && !purchasedLimitedItems['soda-limited'] && (
								<div className="absolute inset-0 bg-blue-400/20 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
							)}
						</button>
					</div>
					
					{/* Lunch Item */}
					<div className="group/item relative">
						<button 
							className={`w-56 h-36 p-4 rounded-xl transition-all duration-300 ${
								coins < 10 
									? 'bg-gray-500/30 text-gray-400 cursor-not-allowed' 
									: 'bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white hover:scale-105 shadow-lg border-2 border-green-300/50 hover:border-green-300'
							}`}
							disabled={coins < 10} 
							onClick={() => onTrade('lunch')}
						>
							{/* Item Container */}
							<div className="h-full flex items-center justify-between px-2">
								{/* Item Icon */}
								<div className="flex-shrink-0">
									<div className="w-[48px] h-[48px] bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg border-2 border-green-400/50 flex items-center justify-center shadow-inner">
										<div className="text-xl">🍱</div>
									</div>
								</div>
								
								{/* Item Details */}
								<div className="flex-1 flex flex-col justify-center ml-4 text-left">
									<div className="font-bold text-sm mb-1">Choice of Lunch</div>
									<div className="text-xs opacity-90 mb-2">Delicious meal</div>
									
									{/* Price Tag */}
									<div className={`px-3 py-1 rounded-full text-[10px] font-bold w-fit ${
										coins < 10 
											? 'bg-gray-600/50 text-gray-300' 
											: 'bg-green-500/80 text-white'
									}`}>
										{coins < 10 ? 'Need 10 coins' : '🪙 10 coins'}
									</div>
								</div>
							</div>
							
							{/* Hover Effect */}
							{coins >= 10 && (
								<div className="absolute inset-0 bg-green-400/20 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Shop;


