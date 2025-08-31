'use client'

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Music2, Search } from "lucide-react";

const sampleMusic = [
	{ id: 1, title: "Focus Flow", artist: "DJ Calm", url: "https://example.com/focus.mp3" },
	{ id: 2, title: "Deep Relax", artist: "Zen Beats", url: "https://example.com/relax.mp3" },
	{ id: 3, title: "Morning Energy", artist: "Sunrise Sound", url: "https://example.com/energy.mp3" },
];

export default function MusicPage() {
	const [music] = useState(sampleMusic);
	const [showModal] = useState(false);
	const [filter, setFilter] = useState("");

	const filteredMusic = music.filter(
		(item) =>
			item.title.toLowerCase().includes(filter.toLowerCase()) ||
			item.artist.toLowerCase().includes(filter.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-10 px-2 sm:px-4">
			<div className="w-full max-w-6xl mx-auto">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
					<h1 className="text-3xl font-extrabold flex items-center gap-2 text-gray-900 dark:text-white">
						<Music2 className="w-8 h-8 text-purple-600" /> Music Management
					</h1>
					<div className="flex flex-1 sm:flex-initial gap-2 items-center">
						<div className="relative w-full max-w-xs">
							<input
								type="text"
								placeholder="Filter by title or artist..."
								value={filter}
								onChange={e => setFilter(e.target.value)}
								className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
							/>
							<Search className="absolute left-2 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
						</div>
						<button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-2 rounded-lg shadow hover:from-purple-600 hover:to-purple-800 transition font-semibold">
							<Plus className="w-5 h-5" /> Add Music
						</button>
					</div>
				</div>
				<div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
					<table className="w-full text-base">
						<thead>
							<tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
								<th className="py-4 px-6 text-left font-bold tracking-wide text-gray-700 dark:text-gray-200">Title</th>
								<th className="py-4 px-6 text-left font-bold tracking-wide text-gray-700 dark:text-gray-200">Artist</th>
								<th className="py-4 px-6 text-left font-bold tracking-wide text-gray-700 dark:text-gray-200">URL</th>
								<th className="py-4 px-6 text-left font-bold tracking-wide text-gray-700 dark:text-gray-200">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredMusic.length === 0 ? (
								<tr>
									<td colSpan={4} className="py-8 px-6 text-center text-gray-400 dark:text-gray-500">No music found.</td>
								</tr>
							) : (
								filteredMusic.map((item) => (
									<tr key={item.id} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
										<td className="py-3 px-6 font-medium text-gray-900 dark:text-gray-100">{item.title}</td>
										<td className="py-3 px-6 text-gray-700 dark:text-gray-300">{item.artist}</td>
										<td className="py-3 px-6">
											<a href={item.url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">Link</a>
										</td>
										<td className="py-3 px-6 flex gap-2">
											<button className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-700 dark:hover:text-purple-300 transition">
												<Edit2 className="w-4 h-4" /> Edit
											</button>
											<button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
												<Trash2 className="w-4 h-4" /> Remove
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				{/* Static modal placeholder */}
				{showModal && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
						<div className="bg-white p-6 rounded shadow w-full max-w-md">
							<h2 className="text-lg font-bold mb-4">Add/Edit Music</h2>
							{/* Form fields here */}
							<button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded">Save</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
