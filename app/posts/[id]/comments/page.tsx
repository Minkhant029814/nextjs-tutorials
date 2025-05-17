import LikeButton from "@/app/components/LikeButton";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Comments = {
  id: number;
  name: string;
  email: string;
  body: string;
};

async function getComments(postId: string): Promise<Comments[]> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );
  if (!res.ok) {
    throw new Error("Comments not Found");
  }
  const data = await res.json();
  return data;
}

export async function generateStaticParams() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();
  return posts.map((post: { id: number }) => ({
    id: post.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `Comments for post ${params.id}`,
    description: `View comments for post ${params.id} on our Next.js app`,
  };
}

export default async function CommentPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const comments = await getComments(params.id);
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Comments for Post {params.id}
        </h1>
        <div className="space-y-4 max-w-3xl mx-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-blue-600 ">
                {comment.name}
              </h2>
              <p className="text-gray-600 mt-1">{comment.body}</p>
              <p className="text-sm text-gray-500 mt-2"> By :{comment.email}</p>
              <LikeButton />
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
