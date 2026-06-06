import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ThumbsUp, Eye, MessageCircle, Clock, CheckCircle2,
  GraduationCap, Send, User as UserIcon, Award,
} from 'lucide-react';
import { discussionsApi } from '../api';
import { useAuthStore } from '../stores';
import { cn } from '../utils';

function getCategoryColor(category: string) {
  const map: Record<string, string> = {
    Admissions: 'bg-blue-50 text-blue-700 border-blue-200',
    Placements: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Campus Life': 'bg-purple-50 text-purple-700 border-purple-200',
    Exams: 'bg-amber-50 text-amber-700 border-amber-200',
    General: 'bg-gray-50 text-gray-700 border-gray-200',
  };
  return map[category] || 'bg-gray-50 text-gray-700 border-gray-200';
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ThreadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [answerBody, setAnswerBody] = useState('');

  const { data: thread, isLoading, isError } = useQuery({
    queryKey: ['thread', id],
    queryFn: () => discussionsApi.getById(id!),
    enabled: !!id,
  });

  const voteMutation = useMutation({
    mutationFn: () => discussionsApi.voteThread(id!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['thread', id] }),
  });

  const answerVoteMutation = useMutation({
    mutationFn: (answerId: string) => discussionsApi.voteAnswer(answerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['thread', id] }),
  });

  const acceptMutation = useMutation({
    mutationFn: (answerId: string) => discussionsApi.acceptAnswer(answerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['thread', id] }),
  });

  const postAnswerMutation = useMutation({
    mutationFn: () => discussionsApi.addAnswer(id!, answerBody),
    onSuccess: () => {
      setAnswerBody('');
      queryClient.invalidateQueries({ queryKey: ['thread', id] });
    },
  });

  const handleVoteThread = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    voteMutation.mutate();
  };

  const handleVoteAnswer = (answerId: string) => {
    if (!isAuthenticated) { navigate('/login'); return; }
    answerVoteMutation.mutate(answerId);
  };

  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerBody.trim()) return;
    postAnswerMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="skeleton h-6 w-32 mb-6" />
          <div className="card p-6 space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !thread) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-primary-900 mb-2">Thread not found</h2>
          <Link to="/discussions" className="btn-primary mt-4 inline-block">Back to Discussions</Link>
        </div>
      </div>
    );
  }

  const isThreadAuthor = user?.id === thread.author.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <Link to="/discussions" className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Discussions
        </Link>

        {/* Thread */}
        <div className="card p-6 sm:p-8 mb-6">
          <div className="flex gap-4">
            {/* Vote column */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={handleVoteThread}
                disabled={voteMutation.isPending}
                className={cn(
                  'p-2 rounded-xl border transition-all duration-200',
                  thread.hasVoted
                    ? 'bg-primary-100 border-primary-300 text-primary-700'
                    : 'border-surface-200 text-gray-400 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50'
                )}
              >
                <ThumbsUp size={18} className={thread.hasVoted ? 'fill-primary-600' : ''} />
              </button>
              <span className="text-lg font-bold text-primary-900">{thread.upvotes}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={cn('badge text-xs border', getCategoryColor(thread.category))}>
                  {thread.category}
                </span>
                {thread.college && (
                  <Link to={`/colleges/${thread.college.slug}`} className="badge text-xs bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100 transition-colors">
                    <GraduationCap size={10} /> {thread.college.name}
                  </Link>
                )}
              </div>

              <h1 className="font-display text-2xl font-bold text-primary-900 mb-4">{thread.title}</h1>

              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                {thread.body}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-4 border-t border-surface-100">
                <span className="flex items-center gap-1"><UserIcon size={12} /> {thread.author.name}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(thread.createdAt)}</span>
                <span className="flex items-center gap-1"><Eye size={12} /> {thread.views} views</span>
                <span className="flex items-center gap-1"><MessageCircle size={12} /> {thread._count.answers} answers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="mb-6">
          <h2 className="font-display text-lg font-semibold text-primary-900 mb-4 flex items-center gap-2">
            <MessageCircle size={18} /> {thread.answers?.length || 0} Answer{(thread.answers?.length || 0) !== 1 ? 's' : ''}
          </h2>

          {thread.answers?.length === 0 && (
            <div className="card p-8 text-center">
              <p className="text-gray-500">No answers yet. Be the first to help!</p>
            </div>
          )}

          <div className="space-y-4">
            {thread.answers?.map((answer) => (
              <div
                key={answer.id}
                className={cn(
                  'card p-5 sm:p-6 transition-all duration-200',
                  answer.isAccepted && 'ring-2 ring-emerald-300 bg-emerald-50/30'
                )}
              >
                <div className="flex gap-4">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleVoteAnswer(answer.id)}
                      disabled={answerVoteMutation.isPending}
                      className={cn(
                        'p-1.5 rounded-lg border transition-all duration-200',
                        answer.hasVoted
                          ? 'bg-primary-100 border-primary-300 text-primary-700'
                          : 'border-surface-200 text-gray-400 hover:border-primary-300 hover:text-primary-600'
                      )}
                    >
                      <ThumbsUp size={14} className={answer.hasVoted ? 'fill-primary-600' : ''} />
                    </button>
                    <span className="text-sm font-bold text-primary-900">{answer.upvotes}</span>

                    {answer.isAccepted ? (
                      <div className="mt-1" title="Accepted answer">
                        <CheckCircle2 size={20} className="text-emerald-500 fill-emerald-100" />
                      </div>
                    ) : isThreadAuthor && (
                      <button
                        onClick={() => acceptMutation.mutate(answer.id)}
                        disabled={acceptMutation.isPending}
                        className="mt-1 p-1 rounded-lg text-gray-300 hover:text-emerald-500 transition-colors"
                        title="Accept this answer"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {answer.isAccepted && (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold mb-2">
                        <Award size={14} /> Accepted Answer
                      </div>
                    )}
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {answer.body}
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><UserIcon size={11} /> {answer.author.name}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo(answer.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post answer form */}
        {isAuthenticated ? (
          <div className="card p-6">
            <h3 className="font-display font-semibold text-primary-900 mb-4 flex items-center gap-2">
              <Send size={16} /> Your Answer
            </h3>
            <form onSubmit={handlePostAnswer}>
              <textarea
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                placeholder="Share your knowledge or experience..."
                rows={4}
                className="input resize-none mb-3"
                required
              />
              <button
                type="submit"
                disabled={postAnswerMutation.isPending || !answerBody.trim()}
                className="btn-primary flex items-center gap-2"
              >
                <Send size={14} />
                {postAnswerMutation.isPending ? 'Posting...' : 'Post Answer'}
              </button>
            </form>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-gray-500 mb-3">You need to be signed in to post an answer.</p>
            <Link to="/login" className="btn-primary inline-block">Sign In</Link>
          </div>
        )}
      </div>
    </div>
  );
}
