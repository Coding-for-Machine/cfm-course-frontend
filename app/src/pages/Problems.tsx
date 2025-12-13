// ============================================
// 4. src/components/Problems.tsx - REACT QUERY VERSION
// ============================================
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { ProblemResult } from "../types/problems";
import { get_problem_list } from "../api/problems/get_problem";

export default function Problems() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 20;

  const difficultyColor = {
    1: { label: "Easy", color: "text-green-600 bg-green-50 border-green-200" },
    2: { label: "Medium", color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
    3: { label: "Hard", color: "text-red-600 bg-red-50 border-red-200" },
  };

  // React Query bilan data olish
  const { data, isLoading, error } = useQuery({
    queryKey: ["problems", page, pageSize],
    queryFn: () => get_problem_list(page, pageSize),
  });

  // Search filter
  const filtered = (data?.results || []).filter((p: ProblemResult) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const goToPage = (target: number) => {
    if (target < 1) return;
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6">
      {/* Search */}
      <div className="p-4 mb-4 border rounded-xl">
        <input
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm p-2 border rounded w-full"
        />
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Difficulty</th>
              <th className="p-3 border-b">Points</th>
              <th className="p-3 border-b">Category</th>
              <th className="p-3 border-b">Completed</th>
              <th className="p-3 border-b">Tags</th>
            </tr>
          </thead>
          <tbody>
            {/* Data rows */}
            {!isLoading &&
              filtered.map((p: ProblemResult, index: number) => {
                const diff = difficultyColor[p.difficulty];
                return (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="p-3 border-b">
                      <Link to={`/problem/${p.slug}`} className="text-blue-600 hover:underline">
                        {p.title}
                      </Link>
                    </td>
                    <td className="p-3 border-b">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${diff.color}`}>
                        {diff.label}
                      </span>
                    </td>
                    <td className="p-3 border-b">{p.points ?? "-"}</td>
                    <td className="p-3 border-b">{p.category ?? "-"}</td>
                    <td className="p-3 border-b">
                      {p.is_completed ? (
                        <span className="text-green-600">✓ Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="p-3 border-b">{p.tags?.join(", ") ?? "-"}</td>
                  </tr>
                );
              })}

            {/* Loading skeleton */}
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`sk-${i}`}>
                  <td className="p-3 border-b">
                    <div className="h-4 w-32 bg-gray-300 animate-pulse rounded" />
                  </td>
                  <td className="p-3 border-b">
                    <div className="h-4 w-16 bg-gray-300 animate-pulse rounded" />
                  </td>
                  <td className="p-3 border-b">
                    <div className="h-4 w-12 bg-gray-300 animate-pulse rounded" />
                  </td>
                  <td className="p-3 border-b">
                    <div className="h-4 w-20 bg-gray-300 animate-pulse rounded" />
                  </td>
                  <td className="p-3 border-b">
                    <div className="h-4 w-12 bg-gray-300 animate-pulse rounded" />
                  </td>
                  <td className="p-3 border-b">
                    <div className="h-4 w-24 bg-gray-300 animate-pulse rounded" />
                  </td>
                </tr>
              ))}

            {/* Error state */}
            {error && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-red-600">
                  Xatolik: {(error as Error).message}
                </td>
              </tr>
            )}

            {/* Empty state */}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Hech narsa topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => goToPage(page - 1)}
          disabled={!data?.has_previous || isLoading}
        >
          ← Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {data?.total_pages || 1}
        </span>
        <button
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => goToPage(page + 1)}
          disabled={!data?.has_next || isLoading}
        >
          Next →
        </button>
      </div>
    </div>
  );
}