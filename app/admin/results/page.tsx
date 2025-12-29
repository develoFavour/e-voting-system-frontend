"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	BarChart3,
	TrendingUp,
	Users,
	Vote as VoteIcon,
	RefreshCw,
	Loader2,
	Crown,
	Download,
	Calendar,
	Search,
	Filter,
} from "lucide-react";
import { adminAPI } from "@/lib/api";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Election {
	id: string;
	title: string;
	description: string;
	status: "live" | "closed" | "pending";
	startTime: string;
	endTime?: string;
	totalVotes: number;
	approvedVoters: number;
	positions: string[];
}

interface BackendElection {
	id?: string;
	_id?: string;
	title: string;
	description?: string;
	status: string;
	startTime?: string;
	start_time?: string;
	endTime?: string;
	end_time?: string;
	totalVotes?: number;
	approvedVoters?: number;
	positions?: string[];
}

interface BackendCandidate {
	id?: string;
	_id?: string;
	name: string;
	party?: string;
	voteCount?: number;
	position: string;
	imageUrl?: string;
	image?: string;
}

interface PositionResult {
	position: string;
	candidates: Array<{
		id: string;
		name: string;
		party: string;
		voteCount: number;
		percentage: number;
		image: string;
	}>;
}

interface CurrentResults {
	totalVotes: number;
	approvedVoters: number;
	candidates: Array<{
		id: string;
		name: string;
		party: string;
		position: string;
		voteCount: number;
	}>;
}

interface ElectionDetails {
	candidates: Array<{
		id: string;
		name: string;
		party: string;
		voteCount: number;
		position: string;
		imageUrl: string;
	}>;
}

export default function AdminResultsPage() {
	const [currentResults, setCurrentResults] = useState<CurrentResults | null>(
		null
	);
	const [previousElections, setPreviousElections] = useState<Election[]>([]);
	const [selectedElection, setSelectedElection] = useState<Election | null>(
		null
	);
	const [selectedElectionDetails, setSelectedElectionDetails] =
		useState<ElectionDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("current");

	const fetchResults = async () => {
		setIsRefreshing(true);
		try {
			const data = await adminAPI.getResults();
			setCurrentResults(data);
		} catch (error) {
			console.error("Failed to fetch results:", error);
			toast.error("Failed to load live results");
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	};

	const fetchPreviousElections = async () => {
		try {
			const elections = await adminAPI.getAllElections();

			// Transform backend data to match frontend interface
			const transformedElections: Election[] = elections.map(
				(election: BackendElection) => ({
					id: election.id || election._id || "",
					title: election.title,
					description: election.description || "",
					status: election.status as "live" | "closed" | "pending",
					startTime: election.startTime || election.start_time || "",
					endTime: election.endTime || election.end_time,
					totalVotes: election.totalVotes || 0,
					approvedVoters: election.approvedVoters || 0,
					positions: election.positions || [],
				})
			);

			setPreviousElections(transformedElections);
		} catch (error) {
			console.error("Failed to fetch previous elections:", error);
			toast.error("Failed to load previous elections");
		}
	};

	const fetchElectionDetails = async (electionId: string) => {
		try {
			const details = await adminAPI.getElectionDetails(electionId);

			// Transform backend data to match frontend interface
			const transformedDetails: ElectionDetails = {
				candidates: details.candidates.map((candidate: BackendCandidate) => ({
					id: candidate.id || candidate._id || "",
					name: candidate.name,
					party: candidate.party || "",
					voteCount: candidate.voteCount || 0,
					position: candidate.position,
					imageUrl: candidate.imageUrl || candidate.image || "/placeholder.svg",
				})),
			};

			setSelectedElectionDetails(transformedDetails);
		} catch (error) {
			console.error("Failed to fetch election details:", error);
			toast.error("Failed to load election details");
		}
	};

	const exportResults = (format: "csv" | "pdf") => {
		if (format === "csv") {
			exportToCSV();
		} else {
			exportToPDF();
		}
	};

	const exportToCSV = () => {
		try {
			let csvContent = "data:text/csv;charset=utf-8,";

			// Election Summary Header
			csvContent += "ELECTION RESULTS REPORT\n";
			csvContent += `Generated: ${new Date().toLocaleString()}\n`;
			csvContent += `Export Type: ${
				activeTab === "current"
					? "Current Election"
					: selectedElection?.title || "Election Details"
			}\n`;
			csvContent += "\n";

			// Summary Statistics
			if (activeTab === "current" && currentResults) {
				csvContent += "SUMMARY STATISTICS\n";
				csvContent += "Total Votes Cast," + currentResults.totalVotes + "\n";
				csvContent += "Approved Voters," + currentResults.approvedVoters + "\n";
				csvContent +=
					"Voter Turnout," +
					(currentResults.approvedVoters > 0
						? Math.round(
								(currentResults.totalVotes / currentResults.approvedVoters) *
									100
						  )
						: 0) +
					"%\n";
				csvContent +=
					"Active Positions," + Object.keys(groupedResults).length + "\n";
				csvContent += "\n";
			} else if (activeTab === "details" && selectedElection) {
				csvContent += "SUMMARY STATISTICS\n";
				csvContent += "Election Title," + selectedElection.title + "\n";
				csvContent += "Status," + selectedElection.status + "\n";
				csvContent +=
					"Election Date," +
					new Date(selectedElection.startTime).toLocaleDateString() +
					"\n";
				csvContent += "Total Votes," + selectedElection.totalVotes + "\n";
				csvContent +=
					"Approved Voters," + selectedElection.approvedVoters + "\n";
				csvContent +=
					"Voter Turnout," +
					(selectedElection.approvedVoters > 0
						? Math.round(
								(selectedElection.totalVotes /
									selectedElection.approvedVoters) *
									100
						  )
						: 0) +
					"%\n";
				csvContent += "\n";
			}

			// Detailed Results Header
			csvContent += "DETAILED RESULTS\n";
			csvContent +=
				"Position,Candidate Name,Party,Vote Count,Percentage,Rank,Is Winner\n";

			// Get data based on active tab
			let dataToExport: any[] = [];

			if (activeTab === "current" && currentResults) {
				// Current election data
				Object.entries(groupedResults).forEach(([position, candidates]) => {
					const totalPosVotes = candidates.reduce(
						(sum, c) => sum + (c.voteCount || 0),
						0
					);
					candidates
						.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
						.forEach((candidate, idx) => {
							const percentage =
								totalPosVotes > 0
									? Math.round((candidate.voteCount / totalPosVotes) * 100)
									: 0;
							dataToExport.push({
								position,
								name: candidate.name,
								party: candidate.party,
								voteCount: candidate.voteCount || 0,
								percentage,
								rank: idx + 1,
								isWinner: idx === 0,
							});
						});
				});
			} else if (activeTab === "details" && selectedElectionDetails) {
				// Selected election details data
				Object.entries(
					selectedElectionDetails.candidates.reduce((acc, candidate) => {
						if (!acc[candidate.position]) acc[candidate.position] = [];
						acc[candidate.position].push(candidate);
						return acc;
					}, {})
				).forEach(([position, candidates]) => {
					const totalVotes = candidates.reduce(
						(sum, c) => sum + c.voteCount,
						0
					);
					candidates
						.sort((a, b) => b.voteCount - a.voteCount)
						.forEach((candidate, idx) => {
							const percentage =
								totalVotes > 0
									? Math.round((candidate.voteCount / totalVotes) * 100)
									: 0;
							dataToExport.push({
								position,
								name: candidate.name,
								party: candidate.party,
								voteCount: candidate.voteCount,
								percentage,
								rank: idx + 1,
								isWinner: idx === 0,
							});
						});
				});
			}

			// Add data rows with proper formatting
			dataToExport.forEach((row) => {
				const winnerFlag = row.isWinner ? "YES" : "NO";
				csvContent += `"${row.position}","${row.name}","${row.party}",${row.voteCount},${row.percentage}%,${row.rank},${winnerFlag}\n`;
			});

			// Add footer
			csvContent += "\n";
			csvContent += "REPORT FOOTER\n";
			csvContent += "Total Candidates Exported," + dataToExport.length + "\n";
			csvContent +=
				"Export Date," + new Date().toISOString().split("T")[0] + "\n";
			csvContent += "System,E-Voting System v1.0\n";

			// Create download link
			const encodedUri = encodeURI(csvContent);
			const link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute(
				"download",
				`election_results_${new Date().toISOString().split("T")[0]}.csv`
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success("Professional CSV exported successfully!");
		} catch (error) {
			console.error("Error exporting CSV:", error);
			toast.error("Failed to export CSV");
		}
	};

	const exportToPDF = () => {
		try {
			// Create a professional HTML report
			const printWindow = window.open("", "_blank");
			if (!printWindow) {
				throw new Error(
					"Failed to open print window. Please allow popups and try again."
				);
			}

			// Generate HTML content
			let htmlContent = `
				<!DOCTYPE html>
				<html>
				<head>
					<title>Election Results Report</title>
					<style>
						@page {
							margin: 1cm;
							size: A4;
						}
						body {
							font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
							line-height: 1.6;
							color: #333;
							margin: 0;
							padding: 20px;
						}
						.header {
							text-align: center;
							border-bottom: 3px solid #0ea5e9;
							padding-bottom: 20px;
							margin-bottom: 30px;
						}
						.header h1 {
							color: #0ea5e9;
							margin: 0;
							font-size: 28px;
						}
						.header .subtitle {
							color: #666;
							margin: 5px 0 0 0;
							font-size: 14px;
						}
						.summary-section {
							background: #f8f9fa;
							padding: 20px;
							border-radius: 8px;
							margin-bottom: 30px;
							border-left: 4px solid #0ea5e9;
						}
						summary-section h2 {
							margin: 0 0 15px 0;
							color: #0ea5e9;
							font-size: 20px;
						}
						summary-grid {
							display: grid;
							grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
							gap: 15px;
						}
						summary-item {
							background: white;
							padding: 15px;
							border-radius: 6px;
							box-shadow: 0 2px 4px rgba(0,0,0,0.1);
						}
						summary-item .label {
							font-size: 12px;
							color: #666;
							text-transform: uppercase;
							letter-spacing: 0.5px;
						}
						summary-item .value {
							font-size: 24px;
							font-weight: bold;
							color: #333;
							margin: 5px 0 0 0;
						}
						.position-section {
							margin-bottom: 40px;
							page-break-inside: avoid;
						}
						.position-title {
							background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
							color: white;
							padding: 15px 20px;
							border-radius: 8px;
							margin: 0 0 20px 0;
							font-size: 18px;
							font-weight: bold;
						}
						.candidate-table {
							width: 100%;
							border-collapse: collapse;
							background: white;
							border-radius: 8px;
							overflow: hidden;
							box-shadow: 0 2px 8px rgba(0,0,0,0.1);
						}
						.candidate-table th {
							background: #f8f9fa;
							padding: 12px 15px;
							text-align: left;
							font-weight: 600;
							color: #333;
							border-bottom: 2px solid #e9ecef;
							font-size: 14px;
						}
						.candidate-table td {
							padding: 12px 15px;
							border-bottom: 1px solid #e9ecef;
							font-size: 14px;
						}
						.candidate-table tr:last-child td {
							border-bottom: none;
						}
						.winner-row {
							background: linear-gradient(90deg, #fff9e6 0%, #fffbf0 100%);
							font-weight: 600;
						}
						.winner-badge {
							background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
							color: white;
							padding: 4px 8px;
							border-radius: 12px;
							font-size: 11px;
							font-weight: bold;
							text-transform: uppercase;
						}
						.rank-badge {
							background: #e9ecef;
							color: #495057;
							padding: 4px 8px;
							border-radius: 12px;
							font-size: 11px;
							font-weight: bold;
							min-width: 20px;
							text-align: center;
							display: inline-block;
						}
						.percentage-bar {
							background: #e9ecef;
							height: 8px;
							border-radius: 4px;
							overflow: hidden;
							margin-top: 4px;
						}
						.percentage-fill {
							height: 100%;
							background: linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%);
							border-radius: 4px;
						}
						.footer {
							margin-top: 50px;
							padding-top: 20px;
							border-top: 1px solid #e9ecef;
							text-align: center;
							color: #666;
							font-size: 12px;
						}
						@media print {
							.no-print { display: none; }
							body { margin: 0; padding: 10px; }
							.position-section { page-break-inside: avoid; }
						}
					</style>
				</head>
				<body>
					<div class="header">
						<h1>ELECTION RESULTS REPORT</h1>
						<div class="subtitle">
							Generated: ${new Date().toLocaleString()} | 
							Export Type: ${
								activeTab === "current"
									? "Current Election"
									: selectedElection?.title || "Election Details"
							}
						</div>
					</div>

					<div class="summary-section">
						<h2>Summary Statistics</h2>
						<div class="summary-grid">
			`;

			// Add summary statistics
			if (activeTab === "current" && currentResults) {
				htmlContent += `
					<div class="summary-item">
						<div class="label">Total Votes Cast</div>
						<div class="value">${currentResults.totalVotes.toLocaleString()}</div>
					</div>
					<div class="summary-item">
						<div class="label">Approved Voters</div>
						<div class="value">${currentResults.approvedVoters.toLocaleString()}</div>
					</div>
					<div class="summary-item">
						<div class="label">Voter Turnout</div>
						<div class="value">${
							currentResults.approvedVoters > 0
								? Math.round(
										(currentResults.totalVotes /
											currentResults.approvedVoters) *
											100
								  )
								: 0
						}%</div>
					</div>
					<div class="summary-item">
						<div class="label">Active Positions</div>
						<div class="value">${Object.keys(groupedResults).length}</div>
					</div>
				`;
			} else if (activeTab === "details" && selectedElection) {
				htmlContent += `
					<div class="summary-item">
						<div class="label">Election Title</div>
						<div class="value" style="font-size: 16px;">${selectedElection.title}</div>
					</div>
					<div class="summary-item">
						<div class="label">Status</div>
						<div class="value" style="text-transform: capitalize;">${
							selectedElection.status
						}</div>
					</div>
					<div class="summary-item">
						<div class="label">Election Date</div>
						<div class="value" style="font-size: 16px;">${new Date(
							selectedElection.startTime
						).toLocaleDateString()}</div>
					</div>
					<div class="summary-item">
						<div class="label">Total Votes</div>
						<div class="value">${selectedElection.totalVotes.toLocaleString()}</div>
					</div>
					<div class="summary-item">
						<div class="label">Voter Turnout</div>
						<div class="value">${
							selectedElection.approvedVoters > 0
								? Math.round(
										(selectedElection.totalVotes /
											selectedElection.approvedVoters) *
											100
								  )
								: 0
						}%</div>
					</div>
				`;
			}

			htmlContent += `
						</div>
					</div>

					<h2 style="color: #333; margin-bottom: 20px;">Detailed Results</h2>
			`;

			// Add detailed results by position
			if (activeTab === "current" && currentResults) {
				Object.entries(groupedResults).forEach(([position, candidates]) => {
					const totalPosVotes = candidates.reduce(
						(sum, c) => sum + (c.voteCount || 0),
						0
					);
					candidates.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));

					htmlContent += `
						<div class="position-section">
							<div class="position-title">${position.toUpperCase()}</div>
							<table class="candidate-table">
								<thead>
									<tr>
										<th>Rank</th>
										<th>Candidate Name</th>
										<th>Party</th>
										<th>Votes</th>
										<th>Percentage</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
					`;

					candidates.forEach((candidate, idx) => {
						const percentage =
							totalPosVotes > 0
								? Math.round((candidate.voteCount / totalPosVotes) * 100)
								: 0;
						const isWinner = idx === 0;

						htmlContent += `
							<tr class="${isWinner ? "winner-row" : ""}">
								<td><span class="rank-badge">${idx + 1}</span></td>
								<td><strong>${candidate.name}</strong></td>
								<td>${candidate.party}</td>
								<td>${(candidate.voteCount || 0).toLocaleString()}</td>
								<td>
									${percentage}%
									<div class="percentage-bar">
										<div class="percentage-fill" style="width: ${percentage}%"></div>
									</div>
								</td>
								<td>${isWinner ? '<span class="winner-badge">Winner</span>' : ""}</td>
							</tr>
						`;
					});

					htmlContent += `
								</tbody>
							</table>
						</div>
					`;
				});
			} else if (activeTab === "details" && selectedElectionDetails) {
				Object.entries(
					selectedElectionDetails.candidates.reduce((acc, candidate) => {
						if (!acc[candidate.position]) acc[candidate.position] = [];
						acc[candidate.position].push(candidate);
						return acc;
					}, {})
				).forEach(([position, candidates]) => {
					const totalVotes = candidates.reduce(
						(sum, c) => sum + c.voteCount,
						0
					);
					candidates.sort((a, b) => b.voteCount - a.voteCount);

					htmlContent += `
						<div class="position-section">
							<div class="position-title">${position.toUpperCase()}</div>
							<table class="candidate-table">
								<thead>
									<tr>
										<th>Rank</th>
										<th>Candidate Name</th>
										<th>Party</th>
										<th>Votes</th>
										<th>Percentage</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
					`;

					candidates.forEach((candidate, idx) => {
						const percentage =
							totalVotes > 0
								? Math.round((candidate.voteCount / totalVotes) * 100)
								: 0;
						const isWinner = idx === 0;

						htmlContent += `
							<tr class="${isWinner ? "winner-row" : ""}">
								<td><span class="rank-badge">${idx + 1}</span></td>
								<td><strong>${candidate.name}</strong></td>
								<td>${candidate.party}</td>
								<td>${candidate.voteCount.toLocaleString()}</td>
								<td>
									${percentage}%
									<div class="percentage-bar">
										<div class="percentage-fill" style="width: ${percentage}%"></div>
									</div>
								</td>
								<td>${isWinner ? '<span class="winner-badge">Winner</span>' : ""}</td>
							</tr>
						`;
					});

					htmlContent += `
								</tbody>
							</table>
						</div>
					`;
				});
			}

			// Add footer
			htmlContent += `
					<div class="footer">
						<p><strong>E-Voting System v1.0</strong> | Official Election Results Report</p>
						<p>Export Date: ${
							new Date().toISOString().split("T")[0]
						} | This document is electronically generated</p>
					</div>

					<script>
						window.onload = function() {
							setTimeout(() => {
								window.print();
								window.close();
							}, 500);
						}
					</script>
				</body>
				</html>
			`;

			// Write content to print window
			printWindow.document.write(htmlContent);
			printWindow.document.close();

			toast.success(
				"Professional PDF report generated! Check your print dialog."
			);
		} catch (error) {
			console.error("Error exporting PDF:", error);
			toast.error(
				error.message ||
					"Failed to export PDF. Please allow popups and try again."
			);
		}
	};

	useEffect(() => {
		fetchResults();
		fetchPreviousElections();
		const interval = setInterval(fetchResults, 30000); // Auto-refresh every 30s
		return () => clearInterval(interval);
	}, []);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-[60vh] gap-4">
				<Loader2 className="w-10 h-10 text-[#0ea5e9] animate-spin" />
				<p className="text-[#a3a3a3]">Calculating votes...</p>
			</div>
		);
	}

	// Process data similar to the public results page but in admin context
	const groupedResults =
		currentResults?.candidates?.reduce(
			(
				acc: Record<string, CurrentResults["candidates"]>,
				candidate: CurrentResults["candidates"][0]
			) => {
				if (!acc[candidate.position]) acc[candidate.position] = [];
				acc[candidate.position].push(candidate);
				return acc;
			},
			{}
		) || {};

	const filteredElections = previousElections.filter(
		(election) =>
			election.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			election.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight mb-1">
						Election Results
					</h1>
					<p className="text-[#a3a3a3]">
						Manage and view election results across all periods.
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						onClick={fetchResults}
						disabled={isRefreshing}
						variant="outline"
						className="border-[#404040] bg-[#1c1c1c] hover:bg-[#252525]"
					>
						<RefreshCw
							className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
						/>
						Refresh
					</Button>
					<Button
						onClick={() => exportResults("csv")}
						variant="outline"
						className="border-[#404040] bg-[#1c1c1c] hover:bg-[#252525]"
					>
						<Download className="w-4 h-4 mr-2" />
						Export CSV
					</Button>
					<Button
						onClick={() => exportResults("pdf")}
						variant="outline"
						className="border-[#404040] bg-[#1c1c1c] hover:bg-[#252525]"
					>
						<Download className="w-4 h-4 mr-2" />
						Export PDF
					</Button>
				</div>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid w-full grid-cols-3 bg-[#1c1c1c] border border-[#404040]">
					<TabsTrigger
						value="current"
						className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white"
					>
						<VoteIcon className="w-4 h-4 mr-2" />
						Current Election
					</TabsTrigger>
					<TabsTrigger
						value="previous"
						className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white"
					>
						<Calendar className="w-4 h-4 mr-2" />
						Previous Elections
					</TabsTrigger>
					<TabsTrigger
						value="details"
						className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white"
					>
						<BarChart3 className="w-4 h-4 mr-2" />
						Election Details
					</TabsTrigger>
				</TabsList>

				<TabsContent value="current" className="space-y-6">
					{/* Quick Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						<GlassCard depth="medium" className="p-6">
							<div className="flex items-center gap-3 text-[#0ea5e9] mb-2">
								<VoteIcon className="w-5 h-5" />
								<span className="text-sm font-medium text-[#a3a3a3]">
									Total Votes Cast
								</span>
							</div>
							<p className="text-3xl font-bold">
								{currentResults?.totalVotes || 0}
							</p>
						</GlassCard>
						<GlassCard depth="medium" className="p-6">
							<div className="flex items-center gap-3 text-[#10b981] mb-2">
								<Users className="w-5 h-5" />
								<span className="text-sm font-medium text-[#a3a3a3]">
									Voter Participation
								</span>
							</div>
							<p className="text-3xl font-bold">
								{currentResults?.approvedVoters > 0
									? Math.round(
											(currentResults.totalVotes /
												currentResults.approvedVoters) *
												100
									  )
									: 0}
								%
							</p>
						</GlassCard>
						<GlassCard depth="medium" className="p-6">
							<div className="flex items-center gap-3 text-[#f59e0b] mb-2">
								<TrendingUp className="w-5 h-5" />
								<span className="text-sm font-medium text-[#a3a3a3]">
									Active Positions
								</span>
							</div>
							<p className="text-3xl font-bold">
								{Object.keys(groupedResults).length}
							</p>
						</GlassCard>
					</div>

					{/* Detailed Results */}
					<div className="space-y-6">
						{Object.entries(groupedResults).map(
							(
								[position, candidates]: [string, CurrentResults["candidates"]],
								posIdx
							) => (
								<motion.div
									key={position}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: posIdx * 0.1 }}
								>
									<GlassCard depth="deep" className="p-6">
										<h3 className="text-xl font-bold mb-6 flex items-center gap-3">
											<BarChart3 className="w-5 h-5 text-[#0ea5e9]" />
											{position}
										</h3>

										<div className="space-y-4">
											{candidates
												.sort(
													(
														a: CurrentResults["candidates"][0],
														b: CurrentResults["candidates"][0]
													) => (b.voteCount || 0) - (a.voteCount || 0)
												)
												.map(
													(
														candidate: CurrentResults["candidates"][0],
														idx: number
													) => {
														const totalPosVotes = candidates.reduce(
															(
																sum: number,
																c: CurrentResults["candidates"][0]
															) => sum + (c.voteCount || 0),
															0
														);
														const percentage =
															totalPosVotes > 0
																? Math.round(
																		(candidate.voteCount / totalPosVotes) * 100
																  )
																: 0;

														return (
															<div key={candidate.id} className="relative">
																{idx === 0 && candidate.voteCount > 0 && (
																	<div className="absolute -top-2 -right-2 bg-linear-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
																		<Crown className="w-3 h-3" />
																		Winner
																	</div>
																)}
																<div className="flex items-center justify-between mb-2">
																	<div className="flex items-center gap-3">
																		<span
																			className={`font-medium ${
																				idx === 0
																					? "text-white"
																					: "text-[#a3a3a3]"
																			}`}
																		>
																			{candidate.name}
																		</span>
																		<span className="text-xs text-[#555] ml-2">
																			({candidate.party})
																		</span>
																	</div>
																	<div className="flex items-center gap-4">
																		<span className="text-sm font-bold text-[#0ea5e9]">
																			{candidate.voteCount || 0} votes
																		</span>
																		<span className="text-xs text-[#a3a3a3] w-10 text-right">
																			{percentage}%
																		</span>
																	</div>
																</div>
																<div className="h-2 bg-[#1c1c1c] rounded-full overflow-hidden">
																	<motion.div
																		initial={{ width: 0 }}
																		animate={{ width: `${percentage}%` }}
																		transition={{
																			duration: 1,
																			ease: "easeOut",
																		}}
																		className={`h-full rounded-full ${
																			idx === 0
																				? "bg-linear-to-r from-yellow-400 to-yellow-600"
																				: "bg-[#0ea5e9]"
																		}`}
																	/>
																</div>
															</div>
														);
													}
												)}
										</div>
									</GlassCard>
								</motion.div>
							)
						)}
					</div>
				</TabsContent>

				<TabsContent value="previous" className="space-y-6">
					{/* Search and Filter */}
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
							<Input
								placeholder="Search elections..."
								className="pl-10 bg-[#1c1c1c] border-[#404040]"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Button
							variant="outline"
							className="border-[#404040] bg-[#1c1c1c] hover:bg-[#252525]"
						>
							<Filter className="w-4 h-4 mr-2" />
							Filter
						</Button>
					</div>

					{/* Previous Elections List */}
					<div className="grid gap-4">
						{filteredElections.map((election) => (
							<motion.div
								key={election.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
							>
								<GlassCard depth="medium" className="p-6">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h3 className="text-lg font-bold">{election.title}</h3>
												<span
													className={`px-2 py-1 rounded-full text-xs font-medium ${
														election.status === "closed"
															? "bg-[#10b981]/20 text-[#10b981]"
															: election.status === "live"
															? "bg-[#0ea5e9]/20 text-[#0ea5e9]"
															: "bg-[#f59e0b]/20 text-[#f59e0b]"
													}`}
												>
													{election.status}
												</span>
											</div>
											<p className="text-[#a3a3a3] mb-3">
												{election.description}
											</p>
											<div className="grid grid-cols-3 gap-4 text-sm">
												<div>
													<span className="text-[#a3a3a3]">Start:</span>
													<p className="font-medium">
														{new Date(election.startTime).toLocaleDateString()}
													</p>
												</div>
												<div>
													<span className="text-[#a3a3a3]">Votes:</span>
													<p className="font-medium">
														{election.totalVotes.toLocaleString()}
													</p>
												</div>
												<div>
													<span className="text-[#a3a3a3]">Turnout:</span>
													<p className="font-medium">
														{election.approvedVoters > 0
															? Math.round(
																	(election.totalVotes /
																		election.approvedVoters) *
																		100
															  )
															: 0}
														%
													</p>
												</div>
											</div>
										</div>
										<Button
											onClick={() => {
												setSelectedElection(election);
												fetchElectionDetails(election.id);
												setActiveTab("details");
											}}
											variant="outline"
											className="border-[#404040] bg-[#1c1c1c] hover:bg-[#252525] ml-4"
										>
											View Details
										</Button>
									</div>
								</GlassCard>
							</motion.div>
						))}
					</div>
				</TabsContent>

				<TabsContent value="details" className="space-y-6">
					{selectedElection ? (
						<>
							{/* Election Header */}
							<GlassCard depth="medium" className="p-6">
								<div className="flex items-start justify-between">
									<div>
										<h2 className="text-2xl font-bold mb-2">
											{selectedElection.title}
										</h2>
										<p className="text-[#a3a3a3] mb-4">
											{selectedElection.description}
										</p>
										<div className="grid grid-cols-4 gap-4 text-sm">
											<div>
												<span className="text-[#a3a3a3]">Status:</span>
												<p className="font-medium capitalize">
													{selectedElection.status}
												</p>
											</div>
											<div>
												<span className="text-[#a3a3a3]">Start:</span>
												<p className="font-medium">
													{new Date(
														selectedElection.startTime
													).toLocaleDateString()}
												</p>
											</div>
											<div>
												<span className="text-[#a3a3a3]">Total Votes:</span>
												<p className="font-medium">
													{selectedElection.totalVotes.toLocaleString()}
												</p>
											</div>
											<div>
												<span className="text-[#a3a3a3]">Turnout:</span>
												<p className="font-medium">
													{selectedElection.approvedVoters > 0
														? Math.round(
																(selectedElection.totalVotes /
																	selectedElection.approvedVoters) *
																	100
														  )
														: 0}
													%
												</p>
											</div>
										</div>
									</div>
									<div className="flex gap-2">
										<Button
											onClick={() => exportResults("csv")}
											variant="outline"
											className="border-[#404040] bg-[#1c1c1c] hover:bg-[#252525]"
										>
											<Download className="w-4 h-4 mr-2" />
											Export CSV
										</Button>
										<Button
											onClick={() => exportResults("pdf")}
											variant="outline"
											className="border-[#404040] bg-[#1c1c1c] hover:bg-[#252525]"
										>
											<Download className="w-4 h-4 mr-2" />
											Export PDF
										</Button>
									</div>
								</div>
							</GlassCard>

							{/* Detailed Results by Position */}
							{selectedElectionDetails && (
								<div className="space-y-6">
									{Object.entries(
										selectedElectionDetails.candidates.reduce(
											(
												acc: Record<string, ElectionDetails["candidates"]>,
												candidate: ElectionDetails["candidates"][0]
											) => {
												if (!acc[candidate.position])
													acc[candidate.position] = [];
												acc[candidate.position].push(candidate);
												return acc;
											},
											{}
										)
									).map(
										([position, candidates]: [
											string,
											ElectionDetails["candidates"]
										]) => (
											<GlassCard key={position} depth="deep" className="p-6">
												<h3 className="text-xl font-bold mb-6 flex items-center gap-3">
													<BarChart3 className="w-5 h-5 text-[#0ea5e9]" />
													{position}
												</h3>

												<div className="space-y-4">
													{candidates
														.sort(
															(
																a: ElectionDetails["candidates"][0],
																b: ElectionDetails["candidates"][0]
															) => b.voteCount - a.voteCount
														)
														.map(
															(
																candidate: ElectionDetails["candidates"][0],
																idx: number
															) => {
																const totalVotes = candidates.reduce(
																	(
																		sum: number,
																		c: ElectionDetails["candidates"][0]
																	) => sum + c.voteCount,
																	0
																);
																const percentage =
																	totalVotes > 0
																		? Math.round(
																				(candidate.voteCount / totalVotes) * 100
																		  )
																		: 0;

																return (
																	<div key={candidate.id} className="relative">
																		{idx === 0 && (
																			<div className="absolute -top-2 -right-2 bg-linear-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
																				<Crown className="w-3 h-3" />
																				Winner
																			</div>
																		)}
																		<div className="flex items-center justify-between mb-2">
																			<div className="flex items-center gap-3">
																				<span
																					className={`font-medium ${
																						idx === 0
																							? "text-white"
																							: "text-[#a3a3a3]"
																					}`}
																				>
																					{candidate.name}
																				</span>
																				<span className="text-xs text-[#555] ml-2">
																					({candidate.party})
																				</span>
																			</div>
																			<div className="flex items-center gap-4">
																				<span className="text-sm font-bold text-[#0ea5e9]">
																					{candidate.voteCount} votes
																				</span>
																				<span className="text-xs text-[#a3a3a3] w-10 text-right">
																					{percentage}%
																				</span>
																			</div>
																		</div>
																		<div className="h-2 bg-[#1c1c1c] rounded-full overflow-hidden">
																			<motion.div
																				initial={{ width: 0 }}
																				animate={{ width: `${percentage}%` }}
																				transition={{
																					duration: 1,
																					ease: "easeOut",
																				}}
																				className={`h-full rounded-full ${
																					idx === 0
																						? "bg-linear-to-r from-yellow-400 to-yellow-600"
																						: "bg-[#0ea5e9]"
																				}`}
																			/>
																		</div>
																	</div>
																);
															}
														)}
												</div>
											</GlassCard>
										)
									)}
								</div>
							)}
						</>
					) : (
						<GlassCard depth="medium" className="p-12 text-center">
							<Calendar className="w-12 h-12 text-[#a3a3a3] mx-auto mb-4" />
							<h3 className="text-lg font-bold mb-2">No Election Selected</h3>
							<p className="text-[#a3a3a3]">
								Select an election from the Previous Elections tab to view
								detailed results.
							</p>
						</GlassCard>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
