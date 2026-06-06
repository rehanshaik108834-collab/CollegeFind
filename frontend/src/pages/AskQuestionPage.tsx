import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, GraduationCap, HelpCircle } from 'lucide-react';
import { discussionsApi, collegesApi } from '../api';
import { cn } from '../utils';

const CATEGORIES = ['Admissions', 'Placements', 'Campus Life', 'Exams', 'General'];

export function AskQuestionPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');
  const [collegeId, setCollegeId] = useState('');
  const [collegeSearch, setCollegeSearch] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);

  const { data: collegesData } = useQuery({
    queryKey: ['colleges-search', collegeSearch],
    queryFn: () => collegesApi.getAll({ search: collegeSearch, limit: 5 }),
    enabled: collegeSearch.length >= 2,
  });

  const createMutation = useMutation({
    mutationFn: () => discussionsApi.create({
      title,
      body,
      category,
      collegeId: collegeId || undefined,
    }),
    onSuccess: (data) => {
      navigate(`/discussions/${data.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    createMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/discussions" className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Discussions
        </Link>

        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <HelpCircle size={20} className="text-primary-600" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-primary-900">Ask a Question</h1>
              <p className="text-gray-500 text-sm">Get answers from the community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Question Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to prepare for JEE in 3 months?"
                className="input text-base"
                required
                maxLength={200}
              />
              <p className="text-xs text-gray-400 mt-1">{title.length}/200 characters</p>
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Details</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Provide more context about your question. Include relevant details, what you've tried so far, etc."
                rows={6}
                className="input resize-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
                      category === cat
                        ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200'
                        : 'bg-white text-gray-600 border-surface-200 hover:border-primary-300 hover:text-primary-600'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* College Link (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Link to a College <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={collegeSearch}
                  onChange={(e) => {
                    setCollegeSearch(e.target.value);
                    setShowCollegeDropdown(true);
                    if (!e.target.value) setCollegeId('');
                  }}
                  onFocus={() => setShowCollegeDropdown(true)}
                  placeholder="Search for a college..."
                  className="input pl-10"
                />
                {showCollegeDropdown && collegesData?.data && collegesData.data.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-surface-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {collegesData.data.map((college) => (
                      <button
                        key={college.id}
                        type="button"
                        onClick={() => {
                          setCollegeId(college.id);
                          setCollegeSearch(college.name);
                          setShowCollegeDropdown(false);
                        }}
                        className={cn(
                          'w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 transition-colors flex items-center gap-2',
                          collegeId === college.id && 'bg-primary-50 text-primary-700'
                        )}
                      >
                        <GraduationCap size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{college.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {collegeId && (
                <div className="mt-1 flex items-center gap-1">
                  <span className="badge text-xs bg-primary-50 text-primary-700 border border-primary-200">
                    <GraduationCap size={10} /> {collegeSearch}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setCollegeId(''); setCollegeSearch(''); }}
                    className="text-xs text-gray-400 hover:text-red-500 ml-1"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2 border-t border-surface-100">
              {createMutation.isError && (
                <p className="text-red-500 text-sm mb-3">Failed to create thread. Please try again.</p>
              )}
              <button
                type="submit"
                disabled={createMutation.isPending || !title.trim() || !body.trim()}
                className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
              >
                <Send size={16} />
                {createMutation.isPending ? 'Posting...' : 'Post Question'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
