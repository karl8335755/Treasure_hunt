import { useState } from 'react';
import type { WeeklyProgress } from '../types';

interface Props {
	weeklyProgress: WeeklyProgress[];
	onClose: () => void;
}

export function WeeklyRecap({ weeklyProgress, onClose }: Props) {
	const [selectedWeek, setSelectedWeek] = useState<number>(weeklyProgress.length - 1);

	if (weeklyProgress.length === 0) {
		return (
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
				<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border-2 border-gray-600/50">
					<div className="text-center">
						<div className="text-4xl mb-4">📊</div>
						<h3 className="text-xl font-bold text-gray-300 mb-2">No Weekly Data</h3>
						<p className="text-gray-400 mb-4">Complete a week to see your progress recap!</p>
						<button
							onClick={onClose}
							className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-200 px-4 py-2 rounded-lg font-bold transition-all duration-300"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		);
	}

	const currentWeek = weeklyProgress[selectedWeek];
	const weekStartDate = new Date(currentWeek.weekStartDate);
	const weekEndDate = new Date(currentWeek.weekEndDate);

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			year: 'numeric'
		});
	};

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-600/50">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="text-3xl">📊</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-300">Weekly Progress Recap</h2>
							<p className="text-gray-400 text-sm">
								{formatDate(weekStartDate)} - {formatDate(weekEndDate)}
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-200 text-2xl font-bold transition-colors"
					>
						×
					</button>
				</div>

				{/* Week Selector */}
				{weeklyProgress.length > 1 && (
					<div className="mb-6">
						<div className="flex gap-2 overflow-x-auto pb-2">
							{weeklyProgress.map((week, index) => {
								const weekDate = new Date(week.weekStartDate);
								return (
									<button
										key={index}
										onClick={() => setSelectedWeek(index)}
										className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 whitespace-nowrap ${
											selectedWeek === index
												? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
												: 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
										}`}
									>
										Week {index + 1} ({formatDate(weekDate)})
									</button>
								);
							})}
						</div>
					</div>
				)}

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					<div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl p-4 border border-blue-500/30">
						<div className="text-2xl mb-2">🪙</div>
						<div className="text-2xl font-bold text-blue-400">{currentWeek.coinsEarned}</div>
						<div className="text-gray-400 text-sm">Coins Earned</div>
					</div>
					
					<div className="bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-xl p-4 border border-green-500/30">
						<div className="text-2xl mb-2">📜</div>
						<div className="text-2xl font-bold text-green-400">{currentWeek.problemsCompleted.length}</div>
						<div className="text-gray-400 text-sm">Problems Solved</div>
					</div>
					
					<div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-xl p-4 border border-purple-500/30">
						<div className="text-2xl mb-2">⏱️</div>
						<div className="text-2xl font-bold text-purple-400">{formatTime(currentWeek.timeSpent)}</div>
						<div className="text-gray-400 text-sm">Time Spent</div>
					</div>
					
					<div className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 rounded-xl p-4 border border-yellow-500/30">
						<div className="text-2xl mb-2">🏆</div>
						<div className="text-2xl font-bold text-yellow-400">{currentWeek.achievements.length}</div>
						<div className="text-gray-400 text-sm">Achievements</div>
					</div>
				</div>

				{/* Achievements */}
				{currentWeek.achievements.length > 0 && (
					<div className="mb-6">
						<h3 className="text-xl font-bold text-gray-300 mb-3 flex items-center gap-2">
							🏆 Achievements Earned
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{currentWeek.achievements.map((achievement, index) => (
								<div key={index} className="bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 rounded-lg p-3 border border-yellow-500/30">
									<div className="flex items-center gap-2">
										<span className="text-yellow-400">⭐</span>
										<span className="text-gray-200 font-semibold">{achievement}</span>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Problems Completed */}
				<div className="mb-6">
					<h3 className="text-xl font-bold text-gray-300 mb-3 flex items-center gap-2">
						📜 Problems Completed
					</h3>
					<div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30">
						{currentWeek.problemsCompleted.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{currentWeek.problemsCompleted.map((problemId, index) => (
									<div key={index} className="text-gray-300 text-sm bg-gray-700/30 rounded px-3 py-1">
										{problemId}
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-400 text-center">No problems completed this week</p>
						)}
					</div>
				</div>

				{/* Levels Unlocked */}
				<div className="mb-6">
					<h3 className="text-xl font-bold text-gray-300 mb-3 flex items-center gap-2">
						🔓 Levels Unlocked
					</h3>
					<div className="bg-gray-800/30 rounded-lg p-4 border border-gray-600/30">
						{currentWeek.levelsUnlocked.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{currentWeek.levelsUnlocked.map((levelId, index) => (
									<div key={index} className="bg-gradient-to-r from-green-600/20 to-green-700/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold border border-green-500/30">
										Level {levelId}
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-400 text-center">No new levels unlocked this week</p>
						)}
					</div>
				</div>

				{/* Close Button */}
				<div className="text-center">
					<button
						onClick={onClose}
						className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-gray-200 px-6 py-3 rounded-lg font-bold transition-all duration-300"
					>
						Close Recap
					</button>
				</div>
			</div>
		</div>
	);
}

