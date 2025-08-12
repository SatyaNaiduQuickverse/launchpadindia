import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

import { 
  ArrowLeft, DollarSign, Clock, CheckCircle, AlertCircle, 
  Eye, Edit, FileText, User, Mail, Phone, MessageSquare,
  Filter, Search, Calendar, CreditCard, Users, Target, Zap
} from 'lucide-react';

const AdminPaidSubmissions = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, [selectedStatus, currentPage]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/paid-submissions', {
        params: { status: selectedStatus, page: currentPage }
      });
      setSubmissions(response.data.submissions);
    } catch (error) {
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/submission-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const updateSubmissionStatus = async (submissionId, status, notes = '') => {
    try {
      await axios.put(`/api/admin/submissions/${submissionId}/status`, {
        status,
        notes
      });
      
      toast.success(`Submission marked as ${status}`);
      fetchSubmissions();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status, paymentStatus) => {
    if (paymentStatus !== 'paid') {
      return <Badge className="bg-red-100 text-red-800">Payment Pending</Badge>;
    }

    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending Review' },
      reviewing: { color: 'bg-blue-100 text-blue-800', icon: Edit, text: 'In Review' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Completed' },
      revision: { color: 'bg-orange-100 text-orange-800', icon: AlertCircle, text: 'Needs Revision' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const getTimeElapsed = (submittedAt) => {
    const hours = Math.floor((Date.now() - new Date(submittedAt)) / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Paid Submissions</h1>
          <p className="text-slate-600">Manage expert review queue and deliveries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Paid"
            value={stats.total_paid || 0}
            icon={DollarSign}
            color="bg-green-600"
            subtitle={`₹${(stats.total_revenue || 0).toLocaleString()}`}
          />
          <StatCard
            title="Pending Review"
            value={stats.pending_review || 0}
            icon={Clock}
            color="bg-yellow-600"
            subtitle="Needs attention"
          />
          <StatCard
            title="In Progress"
            value={stats.in_review || 0}
            icon={Edit}
            color="bg-blue-600"
            subtitle="Being reviewed"
          />
          <StatCard
            title="Completed"
            value={stats.completed || 0}
            icon={CheckCircle}
            color="bg-emerald-600"
            subtitle="Delivered"
          />
        </div>

        {/* Filters */}
        <Card className="mb-6 backdrop-blur-xl bg-white/40 border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white/80 min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="reviewing">In Review</option>
                <option value="completed">Completed</option>
                <option value="revision">Needs Revision</option>
              </select>
              
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Review Queue</span>
              <Badge variant="secondary">{submissions.length} submissions</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No submissions found</h3>
                <p className="text-slate-500">No paid submissions match your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission, index) => (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Left: Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-slate-800">{submission.title}</h3>
                            <p className="text-slate-600">{submission.first_name} {submission.last_name}</p>
                          </div>
                          {getStatusBadge(submission.status, submission.payment_status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <span>{submission.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>{submission.contact_phone || 'Not provided'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>Submitted {getTimeElapsed(submission.submitted_at)}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-green-500" />
                            <span className="font-medium">₹{submission.payment_amount}</span>
                            <span className="text-slate-500">({submission.payment_method})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span>ID: #{submission.id}</span>
                          </div>
                          {submission.special_requests && (
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="w-4 h-4 text-purple-500" />
                              <span className="text-purple-600">Has special requests</span>
                            </div>
                          )}
                        </div>

                        {/* Special Requests */}
                        {submission.special_requests && (
                          <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-700">
                              <strong>Special Requests:</strong> {submission.special_requests}
                            </p>
                          </div>
                        )}

                        {/* Progress Indicator */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                            <span>Review Progress</span>
                            <span>{submission.status === 'completed' ? '100%' : submission.status === 'reviewing' ? '50%' : '10%'}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                submission.status === 'completed' ? 'bg-green-500 w-full' :
                                submission.status === 'reviewing' ? 'bg-blue-500 w-1/2' :
                                'bg-yellow-500 w-[10%]'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/admin/resume/${submission.id}`)}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Resume</span>
                        </Button>

                        {submission.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateSubmissionStatus(submission.submission_id, 'reviewing')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Start Review
                          </Button>
                        )}

                        {submission.status === 'reviewing' && (
                          <div className="space-y-2">
                            <Button
                              size="sm"
                              onClick={() => updateSubmissionStatus(submission.submission_id, 'completed')}
                              className="bg-green-600 hover:bg-green-700 w-full"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateSubmissionStatus(submission.submission_id, 'revision')}
                              className="w-full"
                            >
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Request Revision
                            </Button>
                          </div>
                        )}

                        {submission.status === 'revision' && (
                          <Button
                            size="sm"
                            onClick={() => updateSubmissionStatus(submission.submission_id, 'reviewing')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Resume Review
                          </Button>
                        )}

                        {submission.status === 'completed' && (
                          <div className="text-center">
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Delivered
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPaidSubmissions;
