import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import LikeButton from "@/app/components/LikeButton";

type Post = {
  id: number;
  title: string;
  body: string;
};

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) {
    throw new Error("Post not found");
  }
  const data = await res.json();
  return data;
}

export async function generateStaticParams() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts: Post[] = await res.json();
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await getPost(params.id);
  return {
    title: post.title,
    description: post.body.slice(0, 160),
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  try {
    const post = await getPost(params.id);
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            {post.title}
          </h1>
          <p className="text-gray-700 mb-4">{post.body}</p>
          <p className="text-sm text-gray-500 mb-4">Post ID: {post.id}</p>
          <LikeButton />
          <Link
            href={`/posts/${params.id}/comments`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
          >
            View Comments
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
