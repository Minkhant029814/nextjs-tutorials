"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts/${id}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch post");
        }
        const data: Post = await res.json();
        setTitle(data.title);
        setBody(data.body);
      } catch (error) {
        setError("Failed To load post data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    localStorage.setItem(`editPostTitle_${id}`, title);
    localStorage.setItem(`editPostBody_${id}`, body);
  }, [title, body, id]);
  useEffect(() => {
    if (!isLoading) {
      titleInputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/posts");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsPending(true);

    if (!title.trim() || !body.trim()) {
      setError("Title and Body are required");
      setIsPending(false);
      titleInputRef.current?.focus();
      return;
    }
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters length");
      setIsPending(false);
      titleInputRef.current?.focus();
      return;
    }
    if (body.trim().length < 10) {
      setError("Body must be at least 10 characters long.");
      setIsPending(false);
      return;
    }

    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: Number(id), title, body, userId: 1 }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update post");
      }
      const data = await res.json();
      setSuccess(`Post updated successfully! Post ID: ${data.id}`);
      localStorage.removeItem(`editPostTitle_${id}`);
      localStorage.removeItem(`editPostBody_${id}`);
    } catch (error) {
      setError("Something went wrong.please try again");
    } finally {
      setIsPending(false);
    }
  };
  const handleReset = () => {
    setError("");
    setSuccess("");
    localStorage.removeItem(`editPostTile_${id}`);
    localStorage.removeItem(`editPostBody_${id}`);
    titleInputRef.current?.focus();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <p className="text-gray-600">Loading Post.....</p>
      </div>
    );
  }
  const titleCount = title.length;
  const bodyCount = body.length;
  const validTitle = titleCount >= 5;
  const validBody = bodyCount >= 10;

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-gray-100 flex items-center justify-center p-6"
        aria-busy="true"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="h-8 bg-gray-300 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            <div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-1/4 mb-2"></div>
              <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2 mt-2"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-1/4 mb-2"></div>
              <div className="h-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2 mt-2"></div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1 h-10 bg-gray-300 rounded animate-pulse"></div>
              <div className="flex-1 h-10 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-1/3 mt-4 mx-auto"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Edit Post
        </h1>
        {error && (
          <p className="text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 mb-4 " role="status">
            {success}Redirecting to Posts....
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 font-semibold mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-200"
              placeholder="Enter Post Title"
              disabled={isPending}
              ref={titleInputRef}
              aria-invalid={error.includes("Title") ? "true" : "false"}
              aria-describedby={
                error.includes("Title") ? "title-error" : undefined
              }
            />
            <p
              id="title-count"
              className={`text-sm mt-1 ${
                validTitle ? "text-green-500" : "text-red-700"
              }`}
            >
              {titleCount} {titleCount <= 1 ? "character" : "characters"}
              {validTitle ? "(valid)" : "(Minimun 5)"}
            </p>
            {error.includes("Title") && (
              <p id="title-error" className="text-red-600 text-sm mt-1">
                {error}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-gray-700 font-semibold mb-1"
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-200"
              placeholder="Enter Post Content"
              rows={5}
              disabled={isPending}
              aria-invalid={error.includes("Body") ? "true" : "false"}
              aria-describedby={
                error.includes("Body") ? "body-error" : undefined
              }
            />
            <p
              id="body-count"
              className={`text-sm mt-1 ${
                validBody ? "text-green-600" : "text-red-600"
              }`}
            >
              {bodyCount} {bodyCount <= 1 ? "character" : "characters"}{" "}
              {validBody ? "(Valid)" : "(Minimum 10)"}
            </p>
            {error.includes("Body") && (
              <p id="body-error" className="text-red-600 text-sm mt-1">
                {error}
              </p>
            )}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isPending}
              aria-label={isPending ? "Updating post....." : "Update Post"}
            >
              {isPending ? "Updating...." : "Update Post"}
            </button>
            <button
              type="submit"
              onClick={handleReset}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isPending}
              aria-label="Reset form"
            >
              Reset
            </button>
          </div>
        </form>
        <Link
          href={"/posts"}
          className="block text-center mt-4 text-blue-600 hover:underline"
          aria-label="Back to posts"
        >
          Back to Posts
        </Link>
      </div>
    </div>
  );
}
