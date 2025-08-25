import type { LevelConfig, LevelId } from '../types';
import { useState } from 'react';

interface Props {
	level: LevelConfig;
	isLocked: boolean;
	isBoxOpened: boolean;
	totalCoinsEarned: number;
	completedProblems: Record<string, boolean>;
	onCompleteProblem: (problemId: string, levelId: LevelId, rewardCoins: number) => void;
	onOpenBox: (levelId: LevelId) => void;
	index: number;
}

export function LevelCard({ level, isLocked, isBoxOpened, totalCoinsEarned, completedProblems, onCompleteProblem, onOpenBox, index }: Props) {
	const [showProblems, setShowProblems] = useState(false);
	
	const levelColors = [
		'from-gray-500 to-gray-600',
		'from-gray-600 to-gray-700',
		'from-gray-500 to-gray-600',
		'from-gray-600 to-gray-700',
		'from-gray-500 to-gray-600',
		'from-gray-600 to-gray-700',
		'from-gray-500 to-gray-600'
	];

	const levelIcons = ['⚡', '💪', '🧠', '📊', '🔍', '🎯', '🏆'];
	const levelNames = ['Island', 'Cave', 'Temple', 'Castle', 'Tower', 'Dungeon', 'Throne'];

	return (
		<div className={`group relative ${isLocked ? 'opacity-60' : ''} transition-all duration-500 hover:scale-105`}>
			{/* Background gradient */}
			<div className={`absolute inset-0 bg-gradient-to-br ${levelColors[index % levelColors.length]} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
			
			{/* Main card */}
			<div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/60 backdrop-blur-sm rounded-2xl border-2 border-gray-600/50 p-4 shadow-2xl hover:shadow-3xl transition-all duration-300">
				{/* Level header */}
				<div className="flex items-start justify-between mb-3">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<div className="text-2xl">{levelIcons[index % levelIcons.length]}</div>
							<div>
								<h3 className="text-lg font-bold text-gray-300">{level.title}</h3>
								<p className="text-xs text-gray-400">The {levelNames[index % levelNames.length]} of Knowledge</p>
							</div>
						</div>
						<p className="text-gray-300 text-xs leading-relaxed">{level.description}</p>
					</div>
					{isLocked && (
						<div className="text-xl animate-bounce">🔒</div>
					)}
				</div>

				{/* Reward and unlock requirement */}
				<div className="flex items-center justify-between mb-3">
					<div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl px-3 py-1 text-gray-200 font-bold text-sm border border-gray-500/50">
						🪙 {level.coinRewardPerProblem} {level.coinRewardPerProblem === 1 ? 'coin' : 'coins'}
					</div>
					{isLocked && (
						<div className="text-xs text-gray-400 bg-gray-800/30 rounded-full px-3 py-1">
							🔓 {totalCoinsEarned}/{level.id === '1' ? 0 : level.id === '2A' || level.id === '2B' ? 2 : level.id === '3A' || level.id === '3B' ? 3 : level.id === '4' ? 4 : 5} coins earned
						</div>
					)}
					{!isLocked && !isBoxOpened && (
						<button 
							className="px-3 py-1 rounded-lg font-semibold transition-all duration-300 text-xs bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-200 hover:scale-105 shadow-lg border border-gray-500/50"
							onClick={() => onOpenBox(level.id)}
						>
							🎁 Open Chest
						</button>
					)}
					{isBoxOpened && (
						<div className="text-xs text-gray-400 bg-gray-700/20 rounded-full px-3 py-1">
							✅ Opened
						</div>
					)}
				</div>

				{/* Problems toggle button */}
				<button 
					className={`w-full py-2 rounded-xl font-bold transition-all duration-300 text-sm ${
						isLocked 
							? 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600/50' 
							: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-200 hover:scale-105 shadow-lg border border-gray-500/50'
					}`}
					disabled={isLocked} 
					onClick={() => setShowProblems(!showProblems)}
				>
					{isLocked ? '🔒 Locked' : showProblems ? '📜 Hide Problems' : '📜 Show Problems'}
				</button>

				{/* Problems - hidden by default */}
				{showProblems && !isLocked && (
					<div className="mt-3 space-y-2">
						{level.problems.map((problem) => {
							const isCompleted = completedProblems[problem.id];
							return (
								<div key={problem.id} className="group/problem relative">
									<div className="bg-gradient-to-br from-gray-800/30 to-gray-900/20 rounded-xl p-3 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300">
										<div className="flex items-start justify-between mb-2">
											<div className="flex-1">
												<div className="font-semibold text-gray-300 mb-1 flex items-center gap-2 text-sm">
													<span className="text-base">📜</span>
													{problem.title}
													{isCompleted && (
														<span className="text-green-400 text-xs bg-green-900/30 px-2 py-1 rounded-full">
															✅ Completed
														</span>
													)}
												</div>
												<div className="text-xs text-gray-400 leading-relaxed">{problem.prompt}</div>
											</div>
										</div>
										<button 
											className={`w-full mt-2 py-2 rounded-lg font-bold transition-all duration-300 text-xs ${
												isLocked 
													? 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600/50' 
													: isCompleted
													? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white hover:scale-105 shadow-lg border border-green-500/50'
													: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-200 hover:scale-105 shadow-lg border border-gray-500/50'
											}`}
											disabled={isLocked} 
											onClick={() => onCompleteProblem(problem.id, level.id, level.coinRewardPerProblem)}
										>
											{isLocked ? '🔒 Locked' : isCompleted ? '🔄 Replay Challenge' : '⚔️ Complete Challenge'}
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

export default LevelCard;


