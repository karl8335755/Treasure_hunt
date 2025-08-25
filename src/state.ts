import { useMemo, useState, useEffect } from 'react';
import { LEVEL_ORDER, type GameState, type LevelId, type Player, type AvatarId, PLAYERS, type WeeklyProgress } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

// Helper function to get the start of the current week (Monday)
const getWeekStart = (date: Date = new Date()): string => {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
	const monday = new Date(d.setDate(diff));
	monday.setHours(0, 0, 0, 0);
	return monday.toISOString();
};

// Helper function to get the end of the current week (Sunday)
const getWeekEnd = (date: Date = new Date()): string => {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Adjust when day is Sunday
	const sunday = new Date(d.setDate(diff));
	sunday.setHours(23, 59, 59, 999);
	return sunday.toISOString();
};

const createDefaultPlayer = (id: string, name: string): Player => ({
	id,
	name,
	avatar: 'pirate', // Default avatar
	coins: 0,
	totalCoinsEarned: 0,
	completedProblems: {},
	openedBoxes: {},
	inventory: [],
	purchasedLimitedItems: {},
	weeklyProgress: [],
	currentWeekStart: getWeekStart(),
});

export const DEFAULT_STATE: GameState = {
	currentPlayer: 'gilbert',
	players: {
		gilbert: createDefaultPlayer('gilbert', 'Gilbert'),
		grace: createDefaultPlayer('grace', 'Grace'),
		brian: createDefaultPlayer('brian', 'Brian'),
		eric: createDefaultPlayer('eric', 'Eric'),
	},
};

// Coin requirements to unlock each level
const LEVEL_UNLOCK_COSTS = {
	'1': 0,    // Level 1 is always unlocked
	'2A': 2,   // 2 coins to unlock Level 2A
	'2B': 2,   // 2 coins to unlock Level 2B
	'3A': 3,   // 3 coins to unlock Level 3A
	'3B': 3,   // 3 coins to unlock Level 3B
	'4': 4,    // 4 coins to unlock Level 4
	'5': 5,    // 5 coins to unlock Level 5
};

export function useGameState() {
	const [state, setState] = useLocalStorage<GameState>('usaco-treasure-state', DEFAULT_STATE);
	
	// Ensure state is properly initialized
	const safeState = useMemo(() => {
		if (!state || !state.players || !state.currentPlayer) {
			return DEFAULT_STATE;
		}
		
		// Migrate existing players to have avatars, purchasedLimitedItems, and weekly progress
		const migratedPlayers = { ...state.players };
		Object.keys(migratedPlayers).forEach(playerId => {
			if (!migratedPlayers[playerId].avatar) {
				migratedPlayers[playerId] = {
					...migratedPlayers[playerId],
					avatar: 'pirate' as const
				};
			}
			if (!migratedPlayers[playerId].purchasedLimitedItems) {
				migratedPlayers[playerId] = {
					...migratedPlayers[playerId],
					purchasedLimitedItems: {}
				};
			}
			if (!migratedPlayers[playerId].weeklyProgress) {
				migratedPlayers[playerId] = {
					...migratedPlayers[playerId],
					weeklyProgress: []
				};
			}
			if (!migratedPlayers[playerId].currentWeekStart) {
				migratedPlayers[playerId] = {
					...migratedPlayers[playerId],
					currentWeekStart: getWeekStart()
				};
			}
		});
		
		// Ensure Eric exists in the state (for new installations)
		if (!migratedPlayers.eric) {
			migratedPlayers.eric = createDefaultPlayer('eric', 'Eric');
		}
		
		// Ensure currentPlayer exists in the migrated players
		if (!migratedPlayers[state.currentPlayer]) {
			state.currentPlayer = 'gilbert';
		}
		
		return {
			...state,
			players: migratedPlayers
		};
	}, [state]);

	const [isMusicPlaying, setIsMusicPlaying] = useState(false);

	// Ensure currentPlayer exists, fallback to first player if not
	const currentPlayer = safeState.players[safeState.currentPlayer] || safeState.players['gilbert'] || createDefaultPlayer('gilbert', 'Gilbert');
	
	// Calculate unlocked levels based on total coins earned
	const unlockedLevelIds = useMemo(() => {
		return LEVEL_ORDER.filter(levelId => {
			const requiredCoins = LEVEL_UNLOCK_COSTS[levelId as keyof typeof LEVEL_UNLOCK_COSTS];
			return currentPlayer.totalCoinsEarned >= requiredCoins;
		});
	}, [currentPlayer.totalCoinsEarned]);

	// Leaderboard sorted by coins
	const leaderboard = useMemo(() => {
		return PLAYERS
			.map(player => ({
				...player,
				...safeState.players[player.id]
			}))
			.sort((a, b) => b.coins - a.coins);
	}, [safeState.players]);

	function switchPlayer(playerId: string) {
		setState({ ...safeState, currentPlayer: playerId });
	}

	function changeAvatar(avatarId: AvatarId) {
		const updatedPlayers = { ...safeState.players };
		updatedPlayers[safeState.currentPlayer] = {
			...updatedPlayers[safeState.currentPlayer],
			avatar: avatarId
		};
		setState({ ...safeState, players: updatedPlayers });
	}





	function completeProblem(problemId: string, _levelId: LevelId, rewardCoins: number) {
		// Allow repeatable challenges - remove the check that prevents double credit
		
		// Play success sound
		try {
			const context = new (window.AudioContext || (window as any).webkitAudioContext)();
				
				// Simple success beep
				const oscillator = context.createOscillator();
				const gain = context.createGain();
				
				oscillator.connect(gain);
				gain.connect(context.destination);
				
				oscillator.frequency.setValueAtTime(1000, context.currentTime);
				oscillator.type = 'sine';
				
				gain.gain.setValueAtTime(0, context.currentTime);
				gain.gain.linearRampToValueAtTime(0.08, context.currentTime + 0.05);
				gain.gain.linearRampToValueAtTime(0.08, context.currentTime + 0.15);
				gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.2);
				
				oscillator.start(context.currentTime);
				oscillator.stop(context.currentTime + 0.2);
		} catch (error) {
			// Fallback: simple beep if Web Audio API fails
			try {
				const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
				audio.volume = 0.15;
				audio.play();
			} catch (fallbackError) {
				// Silent fallback if all audio fails
			}
		}
		
		const updatedPlayers = { ...safeState.players };
		const player = updatedPlayers[safeState.currentPlayer];
		const newCompleted = { ...player.completedProblems, [problemId]: true };
		
		updatedPlayers[safeState.currentPlayer] = {
			...player,
			completedProblems: newCompleted,
			coins: player.coins + rewardCoins,
			totalCoinsEarned: player.totalCoinsEarned + rewardCoins,
		};
		setState({ ...safeState, players: updatedPlayers });
	}

	function openBox(levelId: LevelId): boolean {
		if (currentPlayer.openedBoxes[levelId]) return false;
		
		// Play chest opening sound
		try {
			const context = new (window.AudioContext || (window as any).webkitAudioContext)();
			
			// Create chest opening sound with multiple layers
			const createChestSound = () => {
				// Wood creaking sound (low frequency)
				const woodOsc = context.createOscillator();
				const woodGain = context.createGain();
				woodOsc.connect(woodGain);
				woodGain.connect(context.destination);
				
				woodOsc.frequency.setValueAtTime(80, context.currentTime);
				woodOsc.frequency.exponentialRampToValueAtTime(60, context.currentTime + 0.3);
				woodOsc.type = 'sawtooth';
				
				woodGain.gain.setValueAtTime(0, context.currentTime);
				woodGain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.1);
				woodGain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.2);
				woodGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);
				
				woodOsc.start(context.currentTime);
				woodOsc.stop(context.currentTime + 0.3);
				
				// Metal latch sound (high frequency)
				const metalOsc = context.createOscillator();
				const metalGain = context.createGain();
				metalOsc.connect(metalGain);
				metalGain.connect(context.destination);
				
				metalOsc.frequency.setValueAtTime(800, context.currentTime + 0.1);
				metalOsc.frequency.exponentialRampToValueAtTime(400, context.currentTime + 0.4);
				metalOsc.type = 'square';
				
				metalGain.gain.setValueAtTime(0, context.currentTime + 0.1);
				metalGain.gain.linearRampToValueAtTime(0.03, context.currentTime + 0.15);
				metalGain.gain.linearRampToValueAtTime(0.03, context.currentTime + 0.3);
				metalGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);
				
				metalOsc.start(context.currentTime + 0.1);
				metalOsc.stop(context.currentTime + 0.4);
				
				// Treasure sparkle sound (bell-like)
				const sparkleOsc = context.createOscillator();
				const sparkleGain = context.createGain();
				sparkleOsc.connect(sparkleGain);
				sparkleGain.connect(context.destination);
				
				sparkleOsc.frequency.setValueAtTime(1200, context.currentTime + 0.2);
				sparkleOsc.frequency.exponentialRampToValueAtTime(600, context.currentTime + 0.6);
				sparkleOsc.type = 'sine';
				
				sparkleGain.gain.setValueAtTime(0, context.currentTime + 0.2);
				sparkleGain.gain.linearRampToValueAtTime(0.04, context.currentTime + 0.25);
				sparkleGain.gain.linearRampToValueAtTime(0.04, context.currentTime + 0.5);
				sparkleGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.6);
				
				sparkleOsc.start(context.currentTime + 0.2);
				sparkleOsc.stop(context.currentTime + 0.6);
			};
			
			createChestSound();
		} catch (error) {
			// Fallback: simple chest sound if Web Audio API fails
			try {
				const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
				audio.volume = 0.15;
				audio.play();
			} catch (fallbackError) {
				// Silent fallback if all audio fails
			}
		}
		
		const updatedPlayers = { ...safeState.players };
		const player = updatedPlayers[safeState.currentPlayer];
		updatedPlayers[safeState.currentPlayer] = {
			...player,
			openedBoxes: { ...player.openedBoxes, [levelId]: true },
			inventory: [
				...player.inventory,
				{ id: `map-fragment-${levelId}-${Date.now()}`, type: 'map-fragment', label: `Map Fragment ${levelId}`, levelId, createdAt: Date.now() },
			],
		};
		setState({ ...safeState, players: updatedPlayers });
		return true;
	}

	function trade(item: 'chips' | 'chips-limited' | 'soda' | 'soda-limited' | 'lunch'): boolean {
		// Check if limited item is already purchased
		if ((item === 'chips-limited' && currentPlayer.purchasedLimitedItems['chips-limited']) ||
			(item === 'soda-limited' && currentPlayer.purchasedLimitedItems['soda-limited'])) {
			return false;
		}
		
		// Determine price based on item type
		let price: number;
		switch (item) {
			case 'chips': price = 5; break;
			case 'chips-limited': price = 20; break;
			case 'soda': price = 5; break;
			case 'soda-limited': price = 15; break;
			case 'lunch': price = 10; break;
			default: return false;
		}
		
		if (currentPlayer.coins < price) return false;
		
		// Play purchase sound
		try {
			const context = new (window.AudioContext || (window as any).webkitAudioContext)();
				
				// Create cash register sound
				const createCashOutSound = () => {
					// Cash register bell sound
					const bellOsc = context.createOscillator();
					const bellGain = context.createGain();
					bellOsc.connect(bellGain);
					bellGain.connect(context.destination);
					
					bellOsc.frequency.setValueAtTime(800, context.currentTime);
					bellOsc.frequency.exponentialRampToValueAtTime(600, context.currentTime + 0.3);
					bellOsc.type = 'triangle';
					
					bellGain.gain.setValueAtTime(0, context.currentTime);
					bellGain.gain.linearRampToValueAtTime(0.08, context.currentTime + 0.05);
					bellGain.gain.linearRampToValueAtTime(0.08, context.currentTime + 0.2);
					bellGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);
					
					bellOsc.start(context.currentTime);
					bellOsc.stop(context.currentTime + 0.3);
					
					// Cash drawer opening sound (low frequency)
					const drawerOsc = context.createOscillator();
					const drawerGain = context.createGain();
					drawerOsc.connect(drawerGain);
					drawerGain.connect(context.destination);
					
					drawerOsc.frequency.setValueAtTime(200, context.currentTime + 0.2);
					drawerOsc.frequency.exponentialRampToValueAtTime(100, context.currentTime + 0.5);
					drawerOsc.type = 'sawtooth';
					
					drawerGain.gain.setValueAtTime(0, context.currentTime + 0.2);
					drawerGain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.25);
					drawerGain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.4);
					drawerGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.5);
					
					drawerOsc.start(context.currentTime + 0.2);
					drawerOsc.stop(context.currentTime + 0.5);
					
					// Money counting sound (quick clicks)
					for (let i = 0; i < 3; i++) {
						const clickOsc = context.createOscillator();
						const clickGain = context.createGain();
						clickOsc.connect(clickGain);
						clickGain.connect(context.destination);
						
						const clickTime = context.currentTime + 0.4 + (i * 0.08);
						clickOsc.frequency.setValueAtTime(1500 + (i * 200), clickTime);
						clickOsc.type = 'square';
						
						clickGain.gain.setValueAtTime(0, clickTime);
						clickGain.gain.linearRampToValueAtTime(0.03, clickTime + 0.01);
						clickGain.gain.linearRampToValueAtTime(0, clickTime + 0.05);
						
						clickOsc.start(clickTime);
						clickOsc.stop(clickTime + 0.05);
					}
				};
				
				createCashOutSound();
		} catch (error) {
			// Fallback: simple beep if Web Audio API fails
			try {
				const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
				audio.volume = 0.3;
				audio.play();
			} catch (fallbackError) {
				// Silent fallback if all audio fails
			}
		}
		
		const updatedPlayers = { ...safeState.players };
		const player = updatedPlayers[safeState.currentPlayer];
		// Create the inventory item
		let label: string;
		switch (item) {
			case 'chips': label = 'Bag of Chips (Basic)'; break;
			case 'chips-limited': label = 'Bag of Chips (Premium)'; break;
			case 'soda': label = 'Can of Soda (Basic)'; break;
			case 'soda-limited': label = 'Can of Soda (Premium)'; break;
			case 'lunch': label = 'Choice of Lunch'; break;
			default: label = 'Unknown Item';
		}
		
		// Update player state
		const updatedPlayer = {
			...player,
			coins: player.coins - price,
			inventory: [
				...player.inventory,
				{ id: `${item}-${Date.now()}`, type: item, label, createdAt: Date.now() },
			],
		};
		
		// Mark limited items as purchased
		if (item === 'chips-limited' || item === 'soda-limited') {
			updatedPlayer.purchasedLimitedItems = {
				...updatedPlayer.purchasedLimitedItems,
				[item]: true
			};
		}
		
		updatedPlayers[safeState.currentPlayer] = updatedPlayer;
		setState({ ...safeState, players: updatedPlayers });
		return true;
	}

	function sellItem(itemId: string): boolean {
		const updatedPlayers = { ...safeState.players };
		const player = updatedPlayers[safeState.currentPlayer];
		
		// Find the item in inventory
		const itemIndex = player.inventory.findIndex(item => item.id === itemId);
		if (itemIndex === -1) return false;
		
		const item = player.inventory[itemIndex];
		
		// Determine sell price (50% of purchase price)
		let sellPrice: number;
		switch (item.type) {
			case 'chips': sellPrice = 2; break; // 50% of 5
			case 'chips-limited': sellPrice = 10; break; // 50% of 20
			case 'soda': sellPrice = 2; break; // 50% of 5
			case 'soda-limited': sellPrice = 7; break; // 50% of 15
			case 'lunch': sellPrice = 5; break; // 50% of 10
			case 'map-fragment': sellPrice = 1; break; // Small value for map fragments
			default: sellPrice = 1;
		}
		
		// Play sell sound (different from purchase sound)
		try {
			const context = new (window.AudioContext || (window as any).webkitAudioContext)();
			
			// Create sell sound with descending tones
			const playTone = (frequency: number, startTime: number, duration: number) => {
				const oscillator = context.createOscillator();
				const gainNode = context.createGain();
				
				oscillator.connect(gainNode);
				gainNode.connect(context.destination);
				
				oscillator.frequency.setValueAtTime(frequency, context.currentTime);
				gainNode.gain.setValueAtTime(0.05, context.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
				
				oscillator.start(context.currentTime + startTime);
				oscillator.stop(context.currentTime + startTime + duration);
			};
			
			// Sell sound: descending tones
			playTone(800, 0, 0.1);    // First tone
			playTone(600, 0.1, 0.1);  // Second tone (lower)
			
		} catch (error) {
			// Fallback: simple beep if Web Audio API fails
			try {
				const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
				audio.volume = 0.1;
				audio.play();
			} catch (fallbackError) {
				// Silent fallback if all audio fails
			}
		}
		
		// Remove item from inventory and add coins
		const newInventory = [...player.inventory];
		newInventory.splice(itemIndex, 1);
		
		updatedPlayers[safeState.currentPlayer] = {
			...player,
			coins: player.coins + sellPrice,
			inventory: newInventory,
		};
		
		setState({ ...safeState, players: updatedPlayers });
		return true;
	}

	function redeemItem(itemId: string): boolean {
		const updatedPlayers = { ...safeState.players };
		const player = updatedPlayers[safeState.currentPlayer];
		
		// Find the item in inventory
		const itemIndex = player.inventory.findIndex(item => item.id === itemId);
		if (itemIndex === -1) return false;
		
		// Play redeem sound (successful redemption)
		try {
			const context = new (window.AudioContext || (window as any).webkitAudioContext)();
				
				// Create redeem sound with ascending tones
				const playTone = (frequency: number, startTime: number, duration: number) => {
					const oscillator = context.createOscillator();
					const gainNode = context.createGain();
					
					oscillator.connect(gainNode);
					gainNode.connect(context.destination);
					
					oscillator.frequency.setValueAtTime(frequency, context.currentTime);
					gainNode.gain.setValueAtTime(0.06, context.currentTime);
					gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
					
					oscillator.start(context.currentTime + startTime);
					oscillator.stop(context.currentTime + startTime + duration);
				};
				
				// Redeem sound: ascending tones (more positive than sell sound)
				playTone(600, 0, 0.15);    // First tone
				playTone(800, 0.15, 0.15); // Second tone (higher)
				playTone(1000, 0.3, 0.2);  // Third tone (highest)
		} catch (error) {
			// Fallback: simple beep if Web Audio API fails
			try {
				const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
				audio.volume = 0.1;
				audio.play();
			} catch (fallbackError) {
				// Silent fallback if all audio fails
			}
		}
		
		// Remove item from inventory (redeemed items are consumed)
		const newInventory = [...player.inventory];
		newInventory.splice(itemIndex, 1);
		
		updatedPlayers[safeState.currentPlayer] = {
			...player,
			inventory: newInventory,
		};
		
		setState({ ...safeState, players: updatedPlayers });
		return true;
	}

	function resetProgress() {
		setState(DEFAULT_STATE);
	}

	function resetStudentProgress(playerId: string) {
		const updatedPlayers = { ...safeState.players };
		updatedPlayers[playerId] = createDefaultPlayer(playerId, updatedPlayers[playerId].name);
		setState({ ...safeState, players: updatedPlayers });
	}

	function weeklyReset(playerId: string) {
		const updatedPlayers = { ...safeState.players };
		const player = updatedPlayers[playerId];
		
		// Create weekly progress summary
		const currentWeekStart = new Date(player.currentWeekStart);
		const weekEnd = getWeekEnd(currentWeekStart);
		
		// Calculate achievements
		const achievements: string[] = [];
		const problemsCompleted = Object.keys(player.completedProblems);
		const levelsUnlocked = unlockedLevelIds;
		
		if (problemsCompleted.length >= 10) achievements.push('Problem Solver');
		if (problemsCompleted.length >= 20) achievements.push('Master Coder');
		if (player.coins >= 50) achievements.push('Coin Collector');
		if (player.coins >= 100) achievements.push('Treasure Hunter');
		if (levelsUnlocked.length >= 5) achievements.push('Level Master');
		if (timer > 3600) achievements.push('Dedicated Learner'); // 1 hour
		if (timer > 7200) achievements.push('Study Champion'); // 2 hours
		
		const weeklyProgress: WeeklyProgress = {
			weekStartDate: player.currentWeekStart,
			weekEndDate: weekEnd,
			coinsEarned: player.coins,
			problemsCompleted,
			levelsUnlocked,
			timeSpent: timer,
			achievements,
		};
		
		// Add to weekly progress history
		const updatedWeeklyProgress = [...player.weeklyProgress, weeklyProgress];
		
		// Reset current progress but keep history
		updatedPlayers[playerId] = {
			...createDefaultPlayer(playerId, player.name),
			avatar: player.avatar, // Keep avatar
			weeklyProgress: updatedWeeklyProgress,
			currentWeekStart: getWeekStart(), // Start new week
		};
		
		setState({ ...safeState, players: updatedPlayers });
	}

	function getWeeklyRecap(playerId: string) {
		const player = safeState.players[playerId];
		if (!player.weeklyProgress.length) return null;
		
		// Get the most recent week
		const latestWeek = player.weeklyProgress[player.weeklyProgress.length - 1];
		return latestWeek;
	}

	function getAllWeeklyRecaps(playerId: string) {
		const player = safeState.players[playerId];
		return player.weeklyProgress;
	}

	// Background music functions
	let audioContext: AudioContext | null = null;
	let musicInterval: number | null = null;
	
	// Timer functions
	const [timer, setTimer] = useState(0); // Timer in seconds
	const [isTimerRunning, setIsTimerRunning] = useState(false);

	function playBackgroundMusic() {
		playGeneratedLofiMusic();
	}

	function playGeneratedLofiMusic() {
		try {
			// Create audio context if it doesn't exist
			if (!audioContext) {
				audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
			}
			
			// Resume audio context if suspended (required for autoplay policies)
			if (audioContext.state === 'suspended') {
				audioContext.resume();
			}
			
			// Create chill lofi-style music
			const createLofiMusic = () => {
				if (!audioContext || !isMusicPlaying) return;
				
				// Lofi chord progression (Am - F - C - G)
				const chords = [
					{ notes: [220, 261.63, 329.63], duration: 2 }, // Am (A, C, E)
					{ notes: [174.61, 220, 261.63], duration: 2 },  // F (F, A, C)
					{ notes: [261.63, 329.63, 392], duration: 2 },  // C (C, E, G)
					{ notes: [196, 246.94, 329.63], duration: 2 },  // G (G, B, D)
				];
				
				let currentTime = audioContext.currentTime;
				
				// Play each chord
				chords.forEach((chord) => {
					chord.notes.forEach((note, noteIndex) => {
						// Main chord tones
						const oscillator = audioContext!.createOscillator();
						const gainNode = audioContext!.createGain();
						const filter = audioContext!.createBiquadFilter();
						
						oscillator.connect(filter);
						filter.connect(gainNode);
						gainNode.connect(audioContext!.destination);
						
						// Lofi characteristics
						oscillator.frequency.setValueAtTime(note, currentTime);
						oscillator.type = 'sine'; // Soft, warm sound
						
						// Low-pass filter for lofi warmth
						filter.type = 'lowpass';
						filter.frequency.setValueAtTime(800, currentTime);
						filter.Q.setValueAtTime(0.5, currentTime);
						
						// Gentle volume envelope
						gainNode.gain.setValueAtTime(0, currentTime);
						gainNode.gain.linearRampToValueAtTime(0.03, currentTime + 0.2);
						gainNode.gain.linearRampToValueAtTime(0.03, currentTime + chord.duration - 0.2);
						gainNode.gain.linearRampToValueAtTime(0, currentTime + chord.duration);
						
						oscillator.start(currentTime);
						oscillator.stop(currentTime + chord.duration);
						
						// Add subtle reverb-like effect
						if (noteIndex === 0) {
							const reverbOsc = audioContext!.createOscillator();
							const reverbGain = audioContext!.createGain();
							
							reverbOsc.connect(reverbGain);
							reverbGain.connect(audioContext!.destination);
							
							reverbOsc.frequency.setValueAtTime(note, currentTime + 0.1);
							reverbOsc.type = 'sine';
							
							reverbGain.gain.setValueAtTime(0, currentTime + 0.1);
							reverbGain.gain.linearRampToValueAtTime(0.01, currentTime + 0.3);
							reverbGain.gain.linearRampToValueAtTime(0.01, currentTime + chord.duration - 0.1);
							reverbGain.gain.linearRampToValueAtTime(0, currentTime + chord.duration + 0.1);
							
							reverbOsc.start(currentTime + 0.1);
							reverbOsc.stop(currentTime + chord.duration + 0.1);
						}
					});
					
					currentTime += chord.duration;
				});
			};
			
			// Start the music loop
			createLofiMusic();
			musicInterval = setInterval(() => {
				if (isMusicPlaying) {
					createLofiMusic();
				}
			}, 8000); // Longer interval for lofi chords
			
			setIsMusicPlaying(true);
			console.log('Generated lofi background music started');
		} catch (error) {
			console.log('Generated background music not supported:', error);
		}
	}

	function stopBackgroundMusic() {
		setIsMusicPlaying(false);
		
		// Stop generated music
		if (musicInterval) {
			clearInterval(musicInterval);
			musicInterval = null;
		}
	}

	function toggleBackgroundMusic() {
		if (isMusicPlaying) {
			stopBackgroundMusic();
		} else {
			playBackgroundMusic();
		}
	}
	
	// Timer effect to update timer every second
	useEffect(() => {
		let interval: number | null = null;
		if (isTimerRunning) {
			interval = setInterval(() => {
				setTimer(prev => prev + 1);
			}, 1000);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isTimerRunning]);
	
	// Timer control functions
	function startTimer() {
		setIsTimerRunning(true);
	}
	
	function stopTimer() {
		setIsTimerRunning(false);
	}
	
	function resetTimer() {
		setTimer(0);
		setIsTimerRunning(false);
	}
	
	function toggleTimer() {
		if (isTimerRunning) {
			stopTimer();
		} else {
			startTimer();
		}
	}

	return {
		state: safeState,
		currentPlayer,
		leaderboard,
		unlockedLevelIds,
		switchPlayer,
		changeAvatar,
		completeProblem,
		openBox,
		trade,
		sellItem,
		redeemItem,
		resetProgress,
		resetStudentProgress,
		weeklyReset,
		getWeeklyRecap,
		getAllWeeklyRecaps,
		isMusicPlaying,
		toggleBackgroundMusic,
		timer,
		isTimerRunning,
		toggleTimer,
		resetTimer,
	};
}



