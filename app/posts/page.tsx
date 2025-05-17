"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "title" | "userId">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const postsPerPage = 10;

  // Fetch posts based on page and search query
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          _page: currentPage.toString(),
          _limit: postsPerPage.toString(),
          ...(searchQuery && { q: searchQuery }),
        });
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts?${queryParams}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch posts.");
        }
        let data = await res.json();
        // Client-Side Sorting
        data = data.sort((a: Post, b: Post) => {
          const isAsc = sortOrder === "asc";
          if (sortBy === "title") {
            return isAsc
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          }
          return isAsc ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
        });
        setPosts(data);
        // JSONPlaceholder doesn't provide total count, assume 100 posts
        setTotalPosts(searchQuery ? data.length : 100);
      } catch (err) {
        setError("Something went wrong while fetching posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  // Focus on search input when component mounts
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete post ID ${id}?`)) {
      return;
    }

    setDeleteError("");
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete post.");
      }

      // Update posts list in state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      setTotalPosts((prev) => prev - 1);
    } catch (err) {
      setDeleteError("Something went wrong while deleting the post.");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to page 1
    searchInputRef.current?.focus();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as "id" | "title" | "userId");
    setCurrentPage(1); // Reset to page 1 on sort change
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "asc" | "desc");
    setCurrentPage(1); // Reset to page 1 on sort change
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Skeleton Row Component
  const SkeletonRow = () => (
    <tr className="border-b">
      <td className="p-3">
        <div className="h-4 bg-gray-300 rounded animate-pulse w-12"></div>
      </td>
      <td className="p-3">
        <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
      </td>
      <td className="p-3">
        <div className="h-4 bg-gray-300 rounded animate-pulse w-12"></div>
      </td>
      <td className="p-3">
        <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Posts List
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
          <Link
            href="/create"
            className="inline-block mb-4 sm:mb-0 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            aria-label="Create a new post"
          >
            Create New Post
          </Link>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2 sm:mb-0"
              placeholder="Search posts by title..."
              ref={searchInputRef}
              aria-label="Search posts by title"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition mb-2 sm:mb-0"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
            <select
              value={sortBy}
              onChange={handleSortByChange}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Sort posts by"
            >
              <option value="id">ID</option>
              <option value="title">Title</option>
              <option value="userId">User ID</option>
            </select>
            <select
              value={sortOrder}
              onChange={handleSortOrderChange}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Sort order"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        {error && (
          <p className="text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}
        {deleteError && (
          <p className="text-red-600 mb-4" role="alert">
            {deleteError}
          </p>
        )}
        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">User Id</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: postsPerPage }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))}
              </tbody>
            </table>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-gray-600 text-center">
            {searchQuery
              ? "No posts match your search."
              : "No posts available."}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">User ID</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{post.id}</td>
                      <td className="p-3">{post.title}</td>
                      <td className="p-3">{post.userId}</td>
                      <td className="p-3 space-x-2">
                        <Link
                          href={`/posts/${post.id}`}
                          className="text-blue-600 hover:underline"
                          aria-label={`View details for post ${post.id}`}
                        >
                          View
                        </Link>
                        <Link
                          href={`/edit/${post.id}`}
                          className="text-green-600 hover:underline"
                          aria-label={`Edit post ${post.id}`}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:underline"
                          aria-label={`Delete post ${post.id}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                Previous
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded transition ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
