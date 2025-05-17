"use client";

import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <div className="mt-4 cursor-pointer">
      <button onClick={() => setLikes(likes + 1)}>Like {likes}</button>
    </div>
  );
}
