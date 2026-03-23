"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function PostCard({ post, index = 0 }: { post: any; index?: number }) {
  const isNew = post.createdAt && (new Date().getTime() - new Date(post.createdAt).getTime()) / (1000 * 3600 * 24) <= 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
      className="bg-surface border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md shadow-slate-700/10 hover:shadow-2xl hover:shadow-slate-700/30 transition-shadow h-full flex flex-col group relative"
    >
      <Link href={`/posts/${post.slug}`} className="flex flex-col h-full block">
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-800">
          {isNew && (
            <Badge className="absolute top-4 right-4 z-10 bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md px-3 py-1 uppercase text-[11px] font-bold tracking-wider">
              New
            </Badge>
          )}
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <h3 className="text-xl md:text-[26px] font-bold text-primary mb-4 line-clamp-2 leading-[1.3] group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-4 text-[15px] text-muted mb-5 font-medium">
            <span>{formatDate(post.createdAt)}</span>
            <span className="w-px h-4 bg-slate-300 dark:bg-slate-700"></span>
            <span>{post.category}</span>
          </div>
          <p className="text-muted text-[16px] leading-[1.7] line-clamp-3">
            {post.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
