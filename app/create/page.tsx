"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, setIsPending] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const savedTitle = localStorage.getItem("createPostTitle");
    const savedBody = localStorage.getItem("createPostBody");
    if (savedTitle) setTitle(savedTitle);
    if (savedBody) setBody(savedBody);
  }, []);

  useEffect(() => {
    localStorage.setItem("createPostTitle", title);
    localStorage.setItem("createPostBody", body);
  }, [title, body]);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

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
      setError("Title must be at least 5 characters long.");
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
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body, userId: 1 }),
      });
      if (!res.ok) {
        throw new Error("Failed to create post");
      }
      const data = await res.json();
      setSuccess(`Post created successfully ! Post ID: ${data.id}`);
      setTitle("");
      setBody("");
      localStorage.removeItem("createPostTitle");
      localStorage.removeItem("createPostBody");
      titleInputRef.current?.focus();
    } catch (error) {
      setError("Something went wrong.please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setBody("");
    setError("");
    setSuccess("");
    localStorage.removeItem("createPostTitle");
    localStorage.removeItem("createPostBody");
    titleInputRef.current?.focus();
  };

  const titleCount = title.length;
  const bodyCount = body.length;
  const isTitleValid = titleCount >= 5;
  const isBodyValid = bodyCount >= 10;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 roudned-lg *:shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Create a New Post
        </h1>
        {error && (
          <p className="text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 mb-4" role="status">
            {success} Redirecting to Posts
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
              placeholder="Enter post Title"
              disabled={isPending}
              ref={titleInputRef}
              aria-invalid={error.includes("Title") ? "true" : "false"}
              aria-describedby={
                error.includes("Title") ? "title-error" : "title-count"
              }
            />
            <p
              id="title-count"
              className={`text-sm mt-1 ${
                isTitleValid ? "text-green-600" : "text-red-600"
              }`}
              aria-live="polite"
            >
              {titleCount} {titleCount <= 1 ? "character" : "characters"}{" "}
              {isTitleValid ? "(Valid)" : "(Minimum 5)"}
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
              placeholder="Enter post Content"
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
                isBodyValid ? "text-green-600" : "text-red-600"
              }`}
            >
              {bodyCount} {bodyCount <= 1 ? "character" : "characters"}{" "}
              {isBodyValid ? "(Valid)" : "(Minimun 10)"}
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
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-gray-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isPending}
              aria-label={isPending ? "Creating Post...." : "Create Post"}
            >
              {isPending ? "Creating...." : "Create Post"}
            </button>
            <button
              onClick={handleReset}
              type="button"
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isPending}
              aria-label="Reset Form"
            >
              Reset
            </button>
          </div>
        </form>
        <Link
          href={"/posts"}
          className="block text-center mt-4 text-blue-600 hover:underline"
          aria-label="Back To posts list"
        >
          Back To posts{" "}
        </Link>
      </div>
    </div>
  );
}
