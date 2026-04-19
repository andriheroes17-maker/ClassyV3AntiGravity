import React, { useState } from 'react';
import { Globe, MessageCircle, Briefcase as LinkedinIcon, Clock, Image, Video, Send, CalendarDays, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

type PostStatus = 'draft' | 'scheduled' | 'published';
type Platform = 'instagram' | 'tiktok' | 'linkedin';

interface ScheduledPost {
  id: string;
  caption: string;
  platform: Platform;
  mediaType: 'image' | 'video' | 'carousel';
  scheduledAt: string;
  status: PostStatus;
  engagement?: { likes: number; comments: number; shares: number };
}

const MOCK_POSTS: ScheduledPost[] = [
  { id: 'sp1', caption: 'Behind the scenes of our latest TVC shoot! 🎬✨ #AgencyLife', platform: 'instagram', mediaType: 'carousel', scheduledAt: '2026-08-19 10:00', status: 'scheduled' },
  { id: 'sp2', caption: 'How we increased brand awareness by 200% — Thread 🧵', platform: 'linkedin', mediaType: 'image', scheduledAt: '2026-08-19 14:00', status: 'scheduled' },
  { id: 'sp3', caption: '5 tips untuk konten viral di 2026 #ContentTips', platform: 'tiktok', mediaType: 'video', scheduledAt: '2026-08-20 09:00', status: 'draft' },
  { id: 'sp4', caption: 'Client testimonial — PT Maju Bersama 🏆', platform: 'instagram', mediaType: 'video', scheduledAt: '2026-08-18 12:00', status: 'published', engagement: { likes: 342, comments: 28, shares: 15 } },
  { id: 'sp5', caption: 'New case study: Social Media ROI for FMCG brand', platform: 'linkedin', mediaType: 'image', scheduledAt: '2026-08-17 08:00', status: 'published', engagement: { likes: 189, comments: 12, shares: 45 } },
  { id: 'sp6', caption: 'Day in the life of a Creative Director 👀', platform: 'tiktok', mediaType: 'video', scheduledAt: '2026-08-21 18:00', status: 'draft' },
];

const getPlatformConfig = (p: Platform) => {
  switch (p) {
    case 'instagram': return { icon: Globe, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', gradient: 'from-pink-500 to-orange-400' };
    case 'tiktok': return { icon: MessageCircle, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', gradient: 'from-cyan-400 to-blue-500' };
    case 'linkedin': return { icon: LinkedinIcon, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', gradient: 'from-blue-500 to-indigo-500' };
  }
};

const getStatusBadge = (s: PostStatus) => {
  switch (s) {
    case 'draft': return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">Draft</span>;
    case 'scheduled': return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">Scheduled</span>;
    case 'published': return <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Published</span>;
  }
};

export const SocialMediaScheduler: React.FC = () => {
  const [platformFilter, setPlatformFilter] = useState<'all' | Platform>('all');
  const filtered = platformFilter === 'all' ? MOCK_POSTS : MOCK_POSTS.filter(p => p.platform === platformFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Social Media Scheduler</h1>
          <p className="text-zinc-400 mt-1">Plan, schedule, and publish content across all platforms.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="glass" className="flex items-center gap-2 text-sm">
            <Send className="w-4 h-4" /> Connect Accounts
          </Button>
          <Button className="flex items-center gap-2 text-sm">+ Create Post</Button>
        </div>
      </div>

      {/* Platform filter */}
      <div className="flex items-center gap-3 flex-wrap">
        {(['all', 'instagram', 'tiktok', 'linkedin'] as const).map(p => {
          const conf = p !== 'all' ? getPlatformConfig(p) : null;
          const PIcon = conf?.icon;
          return (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all",
                platformFilter === p
                  ? "bg-brand-500 text-black border-brand-500 shadow-[0_0_12px_rgba(202,240,40,0.3)]"
                  : "bg-surface text-zinc-400 border-border hover:border-zinc-500 hover:text-white"
              )}
            >
              {PIcon && <PIcon className="w-3.5 h-3.5" />}
              {p === 'all' ? 'All Platforms' : p}
            </button>
          );
        })}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {filtered.map(post => {
          const platformConf = getPlatformConfig(post.platform);
          const PlatformIcon = platformConf.icon;
          return (
            <div key={post.id} className="glass-panel rounded-2xl border border-white/5 overflow-hidden group hover:border-brand-500/20 transition-all">
              {/* Media placeholder */}
              <div className={cn("h-40 bg-gradient-to-br flex items-center justify-center relative", platformConf.gradient)}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  {post.mediaType === 'video' ? <Video className="w-10 h-10 text-white/80" /> : <Image className="w-10 h-10 text-white/80" />}
                  <span className="text-white/60 text-xs font-bold uppercase tracking-wider">{post.mediaType}</span>
                </div>
                <div className="absolute top-3 left-3 z-10">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", platformConf.bg, "border", platformConf.border)}>
                    <PlatformIcon className={cn("w-4 h-4", platformConf.color)} />
                  </div>
                </div>
                <div className="absolute top-3 right-3 z-10">
                  {getStatusBadge(post.status)}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-sm text-zinc-200 line-clamp-2 leading-relaxed">{post.caption}</p>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>{post.scheduledAt}</span>
                </div>

                {post.engagement && (
                  <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-xs">
                    <span className="text-pink-400">❤ {post.engagement.likes}</span>
                    <span className="text-blue-400">💬 {post.engagement.comments}</span>
                    <span className="text-emerald-400">🔁 {post.engagement.shares}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" className="flex-1 text-xs h-8"><Eye className="w-3.5 h-3.5 mr-1" /> Preview</Button>
                  {post.status === 'draft' && <Button className="flex-1 text-xs h-8"><Clock className="w-3.5 h-3.5 mr-1" /> Schedule</Button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
