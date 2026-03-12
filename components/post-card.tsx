"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function PostCard({ post }: { post: any }) {
  const isNew = post.createdAt && (new Date().getTime() - new Date(post.createdAt).getTime()) / (1000 * 3600 * 24) <= 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col group relative"
    >
      <Link href={`/posts/${post.slug}`} className="flex flex-col h-full block">
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
          {isNew && (
            <Badge className="absolute top-4 right-4 z-10 bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md px-3 py-1 uppercase text-[11px] font-bold tracking-wider">
              New
            </Badge>
          )}
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          <h3 className="text-xl md:text-[26px] font-bold text-slate-900 mb-4 line-clamp-2 leading-[1.3] group-hover:text-navy transition-colors">
            {post.title}
          </h3>
          <div className="flex items-center gap-4 text-[15px] text-slate-500 mb-5 font-medium">
            <span>{formatDate(post.createdAt)}</span>
            <span className="w-px h-4 bg-slate-300"></span>
            <span>{post.category}</span>
          </div>
          <p className="text-slate-600 text-[16px] leading-[1.7] line-clamp-3">
            {post.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
