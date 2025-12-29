// API Base URL
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	"https://e-voting-system-be-api.onrender.com/api";

// Helper function to get auth token
const getAuthToken = () => {
	if (typeof window !== "undefined") {
		return localStorage.getItem("auth_token");
	}
	return null;
};

// Helper function to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
	const token = getAuthToken();
	const isFormData = options.body instanceof FormData;

	const headers: Record<string, string> = {
		...(isFormData ? {} : { "Content-Type": "application/json" }),
		...((options.headers as Record<string, string>) || {}),
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const response = await fetch(`${API_BASE_URL}${url}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		const error = await response
			.json()
			.catch(() => ({ error: "Request failed" }));
		throw new Error(error.error || `HTTP ${response.status}`);
	}

	return response.json();
}

// Helper to get full image URL
export const getImageUrl = (path: string) => {
	if (!path) return null;
	if (path.startsWith("http")) return path;
	return `${API_BASE_URL.replace("/api", "")}${path.startsWith("/") ? "" : "/"
		}${path}`;
};

// Authentication API
export const authAPI = {
	// Student registration
	register: async (formData: FormData) => {
		return fetchWithAuth("/auth/register", {
			method: "POST",
			body: formData,
		});
	},

	// Student login
	login: async (matricNumber: string, password: string) => {
		const response = await fetchWithAuth("/auth/login", {
			method: "POST",
			body: JSON.stringify({ matricNumber, password }),
		});

		// Save token to localStorage and cookies
		if (response.token) {
			localStorage.setItem("auth_token", response.token);
			localStorage.setItem("user", JSON.stringify(response.user));

			// Set cookie for middleware
			document.cookie = `auth_token=${response.token}; path=/; max-age=86400`; // 24 hours
			document.cookie = `user_role=${response.user.role}; path=/; max-age=86400`;
		}

		return response;
	},

	// Admin login
	adminLogin: async (matricNumber: string, password: string) => {
		const response = await fetchWithAuth("/auth/admin/login", {
			method: "POST",
			body: JSON.stringify({ matricNumber, password }),
		});

		if (response.token) {
			localStorage.setItem("auth_token", response.token);
			localStorage.setItem("user", JSON.stringify(response.user));

			// Set cookie for middleware
			document.cookie = `auth_token=${response.token}; path=/; max-age=86400`;
			document.cookie = `user_role=${response.user.role}; path=/; max-age=86400`;
		}

		return response;
	},

	// Logout
	logout: () => {
		localStorage.removeItem("auth_token");
		localStorage.removeItem("user");
		document.cookie =
			"auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		document.cookie =
			"user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
	},

	// Get current user from localStorage
	getCurrentUser: () => {
		if (typeof window !== "undefined") {
			const user = localStorage.getItem("user");
			return user ? JSON.parse(user) : null;
		}
		return null;
	},
};

// User API
export const userAPI = {
	// Get current user profile
	getProfile: async () => {
		return fetchWithAuth("/users/me");
	},

	// Get accreditation status
	getStatus: async () => {
		return fetchWithAuth("/users/status");
	},
};

// Admin API
export const adminAPI = {
	// Get dashboard statistics
	getDashboardStats: async () => {
		return fetchWithAuth("/admin/dashboard/stats");
	},

	// Get current election status
	getCurrentElection: async () => {
		return fetchWithAuth("/admin/election/current");
	},

	// Start election with duration
	startElection: async (
		title: string,
		description: string,
		duration: number
	) => {
		return fetchWithAuth("/admin/election/start", {
			method: "POST",
			body: JSON.stringify({ title, description, duration }),
		});
	},

	// Get pending accreditation requests
	getPendingAccreditation: async () => {
		return fetchWithAuth("/admin/accreditation/pending");
	},

	// Approve voter
	approveVoter: async (userId: string) => {
		return fetchWithAuth(`/admin/accreditation/${userId}/approve`, {
			method: "PUT",
		});
	},

	// Reject voter
	rejectVoter: async (userId: string) => {
		return fetchWithAuth(`/admin/accreditation/${userId}/reject`, {
			method: "PUT",
		});
	},

	// Add candidate
	addCandidate: async (formData: FormData) => {
		return fetchWithAuth("/admin/candidates", {
			method: "POST",
			body: formData,
		});
	},

	// Get all candidates
	getCandidates: async () => {
		return fetchWithAuth("/admin/candidates");
	},

	// Get all elections (current and previous)
	getAllElections: async () => {
		return fetchWithAuth("/admin/elections");
	},

	// Get detailed results for a specific election
	getElectionDetails: async (electionId: string) => {
		return fetchWithAuth(`/admin/elections/${electionId}`);
	},

	// Create a staged position
	addPosition: async (payload: {
		name: string;
		description?: string;
		order?: number;
		maxSelections?: number;
	}) => {
		return fetchWithAuth("/admin/positions", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	},

	// List staged positions
	getStagedPositions: async () => {
		return fetchWithAuth("/admin/positions/staged");
	},

	// Get results (decrypted)
	getResults: async () => {
		return fetchWithAuth("/admin/results");
	},

	// End election
	endElection: async () => {
		return fetchWithAuth("/admin/election/end", {
			method: "POST",
		});
	},
	// Get recent activities
	getRecentActivities: async () => {
		return fetchWithAuth("/admin/activities");
	},
};

// Voting API
export const voteAPI = {
	// Get current election status (public)
	getCurrentElection: async () => {
		return fetchWithAuth("/vote/election/current");
	},

	// Get all candidates
	getCandidates: async () => {
		return fetchWithAuth("/vote/candidates");
	},

	// Get positions for the live election
	getPositions: async () => {
		return fetchWithAuth("/vote/positions");
	},

	// Cast vote
	castVote: async (selections: Record<string, string>) => {
		return fetchWithAuth("/vote/cast", {
			method: "POST",
			body: JSON.stringify({ selections }),
		});
	},

	// Get live results
	getLiveResults: async () => {
		return fetchWithAuth("/vote/results");
	},

	// Get approved voters count (for turnout stats)
	getApprovedVoters: async () => {
		return fetchWithAuth("/vote/approved-voters");
	},
};

// Health check
export const healthCheck = async () => {
	const response = await fetch(`${API_BASE_URL.replace("/api", "")}/health`);
	return response.json();
};
