import { Users, ThumbsUp, MessageSquare } from "lucide-react";
import type { CommunityPost } from "@/lib/api/types";

const STATUS_STYLES: Record<string, string> = {
    approved: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    hidden: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
    rejected: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

export default function RecentPosts({ posts }: { posts: CommunityPost[] }) {
    if (posts.length === 0) {
        return (
            <div className="flex items-center justify-center h-24 text-gray-400 text-sm">
                Loading...
            </div>
        );
    }
    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="flex flex-col p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#9810FA]/30 hover:shadow-sm transition-all bg-gray-50/50 dark:bg-gray-900/50 gap-3"
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {post.content || post.title || "—"}
                            </h4>
                            <span
                                className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wide ${
                                    STATUS_STYLES[post.status ?? ""] ?? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                }`}
                            >
                                {post.status}
                            </span>
                            {post.group_name && (
                                <span className="px-2.5 py-1 rounded text-[10px] font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                    {post.group_name}
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {new Date(post.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{post.user_name ?? "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThumbsUp className="w-4 h-4 text-gray-400" />
                            <span>{(post.like_count ?? 0).toLocaleString()} likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <span>{(post.comment_count ?? 0).toLocaleString()} comments</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
