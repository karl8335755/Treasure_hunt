export type LevelId = '1' | '2A' | '2B' | '3A' | '3B' | '4' | '5';

export interface Problem {
	id: string;
	title: string;
	prompt: string;
}

export interface LevelConfig {
	id: LevelId;
	title: string;
	description: string;
	coinRewardPerProblem: number;
	problems: Problem[];
}

export interface InventoryItem {
	id: string;
	type: 'chips' | 'chips-limited' | 'soda' | 'soda-limited' | 'lunch' | 'map-fragment';
	label: string;
	levelId?: LevelId;
	createdAt: number;
}

export interface WeeklyProgress {
	weekStartDate: string; // ISO date string
	weekEndDate: string; // ISO date string
	coinsEarned: number;
	problemsCompleted: string[];
	levelsUnlocked: LevelId[];
	timeSpent: number; // in seconds
	achievements: string[];
}

export interface Player {
	id: string;
	name: string;
	avatar: AvatarId;
	coins: number;
	totalCoinsEarned: number;
	completedProblems: Record<string, boolean>;
	openedBoxes: Partial<Record<LevelId, true>>;
	inventory: InventoryItem[];
	purchasedLimitedItems: Record<string, boolean>; // Track limited items purchased
	weeklyProgress: WeeklyProgress[]; // Track weekly progress history
	currentWeekStart: string; // ISO date string of current week start
}

export type AvatarId = 'pirate' | 'explorer' | 'knight' | 'wizard' | 'archer' | 'ninja';

export interface GameState {
	currentPlayer: string;
	players: Record<string, Player>;
}

export const LEVEL_ORDER: LevelId[] = ['1', '2A', '2B', '3A', '3B', '4', '5'];

export const PLAYERS = [
	{ id: 'gilbert', name: 'Gilbert' },
	{ id: 'grace', name: 'Grace' },
	{ id: 'brian', name: 'Brian' },
	{ id: 'eric', name: 'Eric' }
];

export const AVATARS: Record<AvatarId, { emoji: string; name: string; description: string }> = {
	pirate: { emoji: '🏴‍☠️', name: 'Pirate', description: 'Sea-faring treasure hunter' },
	explorer: { emoji: '🧭', name: 'Explorer', description: 'Map-reading adventurer' },
	knight: { emoji: '⚔️', name: 'Knight', description: 'Noble treasure protector' },
	wizard: { emoji: '🔮', name: 'Wizard', description: 'Magical artifact seeker' },
	archer: { emoji: '🏹', name: 'Archer', description: 'Precise treasure tracker' },
	ninja: { emoji: '🥷', name: 'Ninja', description: 'Stealthy treasure hunter' }
};
