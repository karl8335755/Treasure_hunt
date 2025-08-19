import type { LevelConfig, LevelId } from '../types';
import { useState } from 'react';

interface Props {
	level: LevelConfig;
	isLocked: boolean;
	isBoxOpened: boolean;
	totalCoinsEarned: number;
	onCompleteProblem: (problemId: string, levelId: LevelId, rewardCoins: number) => void;
	onOpenBox: (levelId: LevelId) => void;
	index: number;
}

export function LevelCard({ level, isLocked, isBoxOpened, totalCoinsEarned, onCompleteProblem, onOpenBox, index }: Props) {
	const [showProblems, setShowProblems] = useState(false);
	
	const levelColors = [
		'from-green-400 to-emerald-500',
		'from-blue-400 to-cyan-500',
		'from-purple-400 to-indigo-500',
		'from-orange-400 to-red-500',
		'from-pink-400 to-rose-500',
		'from-yellow-400 to-orange-500',
		'from-indigo-400 to-purple-500'
	];

	const levelIcons = ['⚡', '💪', '🧠', '📊', '🔍', '🎯', '🏆'];
	const levelNames = ['Island', 'Cave', 'Temple', 'Castle', 'Tower', 'Dungeon', 'Throne'];

	return (
		<div className={`group relative ${isLocked ? 'opacity-60' : ''} transition-all duration-500 hover:scale-105`}>
			{/* Background gradient */}
			<div className={`absolute inset-0 bg-gradient-to-br ${levelColors[index % levelColors.length]} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
			
			{/* Main card - styled like a treasure chest */}
			<div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/60 backdrop-blur-sm rounded-2xl border-2 border-yellow-400/50 p-4 shadow-2xl hover:shadow-3xl transition-all duration-300">
				{/* Level header */}
				<div className="flex items-start justify-between mb-3">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<div className="text-2xl">{levelIcons[index % levelIcons.length]}</div>
							<div>
								<h3 className="text-lg font-bold text-yellow-400">{level.title}</h3>
								<p className="text-xs text-yellow-400/70">The {levelNames[index % levelNames.length]} of Knowledge</p>
							</div>
						</div>
						<p className="text-white/90 text-xs leading-relaxed">{level.description}</p>
					</div>
					{isLocked && (
						<div className="text-xl animate-bounce">🔒</div>
					)}
				</div>

				{/* Reward and unlock requirement */}
				<div className="flex items-center justify-between mb-3">
					<div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl px-3 py-1 text-black font-bold text-sm border border-yellow-400/50">
						🪙 {level.coinRewardPerProblem} {level.coinRewardPerProblem === 1 ? 'coin' : 'coins'}
					</div>
					{isLocked && (
						<div className="text-xs text-yellow-400/80 bg-black/30 rounded-full px-3 py-1">
							🔓 {totalCoinsEarned}/{level.id === '1' ? 0 : level.id === '2A' || level.id === '2B' ? 2 : level.id === '3A' || level.id === '3B' ? 3 : level.id === '4' ? 4 : 5} coins earned
						</div>
					)}
					{!isLocked && !isBoxOpened && (
						<button 
							className="px-3 py-1 rounded-lg font-semibold transition-all duration-300 text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white hover:scale-105 shadow-lg border border-red-400/50"
							onClick={() => onOpenBox(level.id)}
						>
							🎁 Open Chest
						</button>
					)}
					{isBoxOpened && (
						<div className="text-xs text-green-400 bg-green-500/20 rounded-full px-3 py-1">
							✅ Opened
						</div>
					)}
				</div>

				{/* Problems toggle button */}
				<button 
					className={`w-full py-2 rounded-xl font-bold transition-all duration-300 text-sm ${
						isLocked 
							? 'bg-gray-500/50 text-gray-300 cursor-not-allowed' 
							: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105 shadow-lg border border-green-400/50'
					}`}
					disabled={isLocked} 
					onClick={() => setShowProblems(!showProblems)}
				>
					{isLocked ? '🔒 Locked' : showProblems ? '📜 Hide Problems' : '📜 Show Problems'}
				</button>

				{/* Problems - hidden by default */}
				{showProblems && !isLocked && (
					<div className="mt-3 space-y-2">
						{level.problems.map((problem) => (
							<div key={problem.id} className="group/problem relative">
								<div className="bg-gradient-to-br from-black/30 to-gray-800/20 rounded-xl p-3 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300">
									<div className="flex items-start justify-between mb-2">
										<div className="flex-1">
											<div className="font-semibold text-yellow-400 mb-1 flex items-center gap-2 text-sm">
												<span className="text-base">📜</span>
												{problem.title}
											</div>
											<div className="text-xs text-white/70 leading-relaxed">{problem.prompt}</div>
										</div>
									</div>
									<button 
										className={`w-full mt-2 py-2 rounded-lg font-bold transition-all duration-300 text-xs ${
											isLocked 
												? 'bg-gray-500/50 text-gray-300 cursor-not-allowed' 
												: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105 shadow-lg border border-green-400/50'
										}`}
										disabled={isLocked} 
										onClick={() => onCompleteProblem(problem.id, level.id, level.coinRewardPerProblem)}
									>
										{isLocked ? '🔒 Locked' : '⚔️ Complete Challenge'}
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default LevelCard;


