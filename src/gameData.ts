import type { LevelConfig } from './types';

export const LEVELS: LevelConfig[] = [
	{
		id: '1',
		title: 'Level 1 — Implementation',
		description: 'Warm up with straightforward IO, loops, and arrays.',
		coinRewardPerProblem: 1,
		problems: [
			{ id: '1-impl-1', title: 'Basic IO Practice', prompt: 'Simulate reading input and printing output. Replace with a real Bronze Implementation task later.' },
			{ id: '1-impl-2', title: 'Loop Mechanics', prompt: 'Iterate through values and aggregate totals.' },
			{ id: '1-impl-3', title: 'Array Basics', prompt: 'Indexing and simple transformations.' },
		],
	},
	{
		id: '2A',
		title: 'Level 2A — Brute Force',
		description: 'Try all possibilities within constraints.',
		coinRewardPerProblem: 2,
		problems: [
			{ id: '2A-bf-1', title: 'Try-All Pairs', prompt: 'Enumerate all pairs and count matches.' },
			{ id: '2A-bf-2', title: 'Triple Nesting', prompt: 'Tight loops with pruning.' },
			{ id: '2A-bf-3', title: 'State Enumeration', prompt: 'Check every configuration in small search space.' },
		],
	},
	{
		id: '2B',
		title: 'Level 2B — Greedy',
		description: 'Pick the best local choice and prove correctness.',
		coinRewardPerProblem: 2,
		problems: [
			{ id: '2B-greedy-1', title: 'Interval Selection', prompt: 'Choose non-overlapping intervals.' },
			{ id: '2B-greedy-2', title: 'Coin Change (Greedy)', prompt: 'Use canonical coin systems.' },
			{ id: '2B-greedy-3', title: 'Sorting then Sweep', prompt: 'Greedy orderings with sorting.' },
		],
	},
	{
		id: '3A',
		title: 'Level 3A — Sorting',
		description: 'Master comparator logic and stable sorts.',
		coinRewardPerProblem: 3,
		problems: [
			{ id: '3A-sort-1', title: 'Custom Comparator', prompt: 'Sort by multiple keys.' },
			{ id: '3A-sort-2', title: 'Bucket/Counting', prompt: 'Use frequency counts.' },
			{ id: '3A-sort-3', title: 'Sweep Line Prep', prompt: 'Sort then scan.' },
		],
	},
	{
		id: '3B',
		title: 'Level 3B — Searching',
		description: 'Linear and binary search patterns.',
		coinRewardPerProblem: 3,
		problems: [
			{ id: '3B-search-1', title: 'Lower/Upper Bound', prompt: 'Locate positions efficiently.' },
			{ id: '3B-search-2', title: 'Two Pointers', prompt: 'Move endpoints to meet in the middle.' },
			{ id: '3B-search-3', title: 'Prefix Check', prompt: 'Use prefix sums to prune search ranges.' },
		],
	},
	{
		id: '4',
		title: 'Level 4 — Simulation & Ad Hoc',
		description: 'Carefully simulate events and handle edge-cases.',
		coinRewardPerProblem: 4,
		problems: [
			{ id: '4-sim-1', title: 'Event Timeline', prompt: 'Simulate arrivals and departures.' },
			{ id: '4-sim-2', title: 'Grid Simulation', prompt: 'Update cells over steps.' },
			{ id: '4-sim-3', title: 'Corner Cases Galore', prompt: 'Handle diverse inputs robustly.' },
		],
	},
	{
		id: '5',
		title: 'Level 5 — Final Stage (Binary Search & DP)',
		description: 'Put it all together with binary search on answer and basic DP.',
		coinRewardPerProblem: 5,
		problems: [
			{ id: '5-final-1', title: 'Binary Search on Answer', prompt: 'Monotonic predicate + bisect.' },
			{ id: '5-final-2', title: '1D DP', prompt: 'Classic state transitions.' },
			{ id: '5-final-3', title: 'Knapsack Lite', prompt: 'Optimize under constraints.' },
		],
	},
];


