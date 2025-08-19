import { useMemo, useState, useEffect } from 'react';
import { LEVEL_ORDER, type GameState, type LevelId, type Player, type AvatarId, PLAYERS } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

const createDefaultPlayer = (id: string, name: string): Player => ({
	id,
	name,
	avatar: 'pirate', // Default avatar
	coins: 0,
	totalCoinsEarned: 0,
	completedProblems: {},
	openedBoxes: {},
	inventory: [],
});

export const DEFAULT_STATE: GameState = {
	currentPlayer: 'gilbert',
	players: {
		gilbert: createDefaultPlayer('gilbert', 'Gilbert'),
		grace: createDefaultPlayer('grace', 'Grace'),
		brian: createDefaultPlayer('brian', 'Brian'),
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
		
		// Migrate existing players to have avatars
		const migratedPlayers = { ...state.players };
		Object.keys(migratedPlayers).forEach(playerId => {
			if (!migratedPlayers[playerId].avatar) {
				migratedPlayers[playerId] = {
					...migratedPlayers[playerId],
					avatar: 'pirate' as const
				};
			}
		});
		
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
		if (currentPlayer.completedProblems[problemId]) return; // no double credit
		
		// Play coin earned sound
		try {
			const context = new (window.AudioContext || (window as any).webkitAudioContext)();
			
			// Create coin earned sound with multiple tones
			const playTone = (frequency: number, startTime: number, duration: number) => {
				const oscillator = context.createOscillator();
				const gainNode = context.createGain();
				
				oscillator.connect(gainNode);
				gainNode.connect(context.destination);
				
				oscillator.frequency.setValueAtTime(frequency, context.currentTime);
				gainNode.gain.setValueAtTime(0.2, context.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
				
				oscillator.start(context.currentTime + startTime);
				oscillator.stop(context.currentTime + startTime + duration);
			};
			
			// Coin earned pattern: ascending tones with a sparkle
			playTone(800, 0, 0.1);     // First coin sound
			playTone(1000, 0.1, 0.1);  // Second coin sound
			playTone(1200, 0.2, 0.15); // Third coin sound (higher)
			playTone(1500, 0.35, 0.1); // Sparkle sound
			
		} catch (error) {
			// Fallback: simple coin sound if Web Audio API fails
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
				woodGain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.1);
				woodGain.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.2);
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
				metalGain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.15);
				metalGain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.3);
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
				sparkleGain.gain.linearRampToValueAtTime(0.08, context.currentTime + 0.25);
				sparkleGain.gain.linearRampToValueAtTime(0.08, context.currentTime + 0.5);
				sparkleGain.gain.linearRampToValueAtTime(0, context.currentTime + 0.6);
				
				sparkleOsc.start(context.currentTime + 0.2);
				sparkleOsc.stop(context.currentTime + 0.6);
			};
			
			createChestSound();
		} catch (error) {
			// Fallback: simple chest sound if Web Audio API fails
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

	function trade(item: 'chips' | 'soda'): boolean {
		const price = item === 'chips' ? 20 : 15;
		if (currentPlayer.coins < price) return false;
		
		// Play cha-ching cash register sound
		try {
			const context = new (window.AudioContext || (window as any).webkitAudioContext)();
			
			// Create cha-ching sound with multiple tones
			const playTone = (frequency: number, startTime: number, duration: number) => {
				const oscillator = context.createOscillator();
				const gainNode = context.createGain();
				
				oscillator.connect(gainNode);
				gainNode.connect(context.destination);
				
				oscillator.frequency.setValueAtTime(frequency, context.currentTime);
				gainNode.gain.setValueAtTime(0.15, context.currentTime);
				gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
				
				oscillator.start(context.currentTime + startTime);
				oscillator.stop(context.currentTime + startTime + duration);
			};
			
			// Cha-ching pattern: two quick tones
			playTone(1200, 0, 0.1);    // First "cha" - higher tone
			playTone(800, 0.1, 0.15);  // Second "ching" - lower tone
			
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
		updatedPlayers[safeState.currentPlayer] = {
			...player,
			coins: player.coins - price,
			inventory: [
				...player.inventory,
				{ id: `${item}-${Date.now()}`, type: item, label: item === 'chips' ? 'Bag of Chips' : 'Can of Soda', createdAt: Date.now() },
			],
		};
		setState({ ...safeState, players: updatedPlayers });
		return true;
	}

	function resetProgress() {
		setState(DEFAULT_STATE);
	}

	// Background music functions
	let audioContext: AudioContext | null = null;
	let musicInterval: number | null = null;
	
	// Timer functions
	const [timer, setTimer] = useState(0); // Timer in seconds
	const [isTimerRunning, setIsTimerRunning] = useState(false);

	function playBackgroundMusic() {
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
			console.log('Background music started');
		} catch (error) {
			console.log('Background music not supported:', error);
		}
	}

	function stopBackgroundMusic() {
		setIsMusicPlaying(false);
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
		resetProgress,
		isMusicPlaying,
		toggleBackgroundMusic,
		timer,
		isTimerRunning,
		toggleTimer,
		resetTimer,
	};
}



