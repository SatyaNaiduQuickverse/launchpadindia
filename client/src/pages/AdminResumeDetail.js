import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Star,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Code,
  Award
} from 'lucide-react';

const AdminResumeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    status: 'pending',
    notes: '',
    score: 5
  });

  useEffect(() => {
    const fetchResumeDetail = async () => {
      try {
        const response = await axios.get(`/api/admin/resumes/${id}`);
        setResume(response.data);
        setReviewForm({
          status: response.data.submission_status || 'pending',
          notes: response.data.reviewer_notes || '',
          score: response.data.review_score || 5
        });
      } catch (error) {
        toast.error('Failed to fetch resume details');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeDetail();
  }, [id, navigate]);

  const submitReview = async () => {
    try {
      await axios.put(`/api/admin/resumes/${id}/review`, reviewForm);
      toast.success('Review submitted successfully');
      setResume(prev => ({...prev, ...reviewForm}));
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const renderSection = (title, data, IconComponent) => {
    if (!data || (Array.isArray(data) && data.length === 0)) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IconComponent className="w-5 h-5" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(data) ? (
            <div className="space-y-4">
              {data.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(item, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Resume #{resume.id}
              </h1>
              <p className="text-slate-600">{resume.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{resume.completion_percentage}% Complete</Badge>
            {resume.submission_status && (
              <Badge className={
                resume.submission_status === 'approved' ? 'bg-green-100 text-green-800' :
                resume.submission_status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }>
                {resume.submission_status}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Resume Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            {resume.personal_info && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p>{resume.personal_info.firstName} {resume.personal_info.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p>{resume.personal_info.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p>{resume.personal_info.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">LinkedIn</label>
                      <p>{resume.personal_info.linkedin || 'Not provided'}</p>
                    </div>
                    {resume.personal_info.summary && (
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-600">Summary</label>
                        <div dangerouslySetInnerHTML={{ __html: resume.personal_info.summary }} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Resume Sections */}
            {renderSection('Education', resume.education, GraduationCap)}
            {renderSection('Experience', resume.experience, Briefcase)}
            {renderSection('Projects', resume.projects, FolderOpen)}
            {renderSection('Skills', resume.skills, Code)}
            {renderSection('Positions', resume.positions, User)}
            {renderSection('Awards', resume.awards, Award)}
            {renderSection('Certifications', resume.certifications, Award)}
            {renderSection('Volunteering', resume.volunteering, User)}
            {renderSection('Conferences', resume.conferences, User)}
            {renderSection('Publications', resume.publications, User)}
            {renderSection('Patents', resume.patents, User)}
            {renderSection('Test Scores', resume.test_scores, User)}
            {renderSection('Scholarships', resume.scholarships, User)}
            {renderSection('Guardians', resume.guardians, User)}
            {renderSection('Languages', resume.languages, User)}
            {renderSection('Subjects', resume.subjects, User)}
          </div>

          {/* Review Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Review & Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Student Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Student Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{resume.first_name} {resume.last_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{resume.email}</span>
                    </div>
                    {resume.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{resume.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined: {new Date(resume.user_created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={reviewForm.status}
                      onChange={(e) => setReviewForm({...reviewForm, status: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="needs_revision">Needs Revision</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Score (1-10)</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={reviewForm.score}
                        onChange={(e) => setReviewForm({...reviewForm, score: parseInt(e.target.value)})}
                        className="w-20"
                      />
                      <div className="flex">
                        {[...Array(10)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 cursor-pointer ${
                              i < reviewForm.score ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                            onClick={() => setReviewForm({...reviewForm, score: i + 1})}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Review Notes</label>
                    <textarea
                      value={reviewForm.notes}
                      onChange={(e) => setReviewForm({...reviewForm, notes: e.target.value})}
                      placeholder="Add feedback, suggestions, or comments..."
                      className="w-full p-3 border rounded-md h-32 resize-none"
                    />
                  </div>

                  <Button 
                    onClick={submitReview}
                    className="w-full"
                  >
                    Submit Review
                  </Button>
                </div>

                {/* Review History */}
                {resume.reviewed_at && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Previous Review</h3>
                    <div className="text-sm space-y-1">
                      <p><strong>Reviewed:</strong> {new Date(resume.reviewed_at).toLocaleString()}</p>
                      <p><strong>Score:</strong> {resume.review_score}/10</p>
                      {resume.reviewer_notes && (
                        <div>
                          <strong>Notes:</strong>
                          <p className="mt-1 text-gray-600">{resume.reviewer_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResumeDetail;
