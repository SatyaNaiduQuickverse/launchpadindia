import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchResumes();
    fetchStats();
  }, [selectedStatus, currentPage]);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/admin/resumes', {
        params: { status: selectedStatus, page: currentPage }
      });
      setResumes(response.data.resumes);
    } catch (error) {
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: Clock };
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="w-3 h-3" />
        <span>{status || 'Not Submitted'}</span>
      </Badge>
    );
  };

  const viewResume = (resumeId) => {
    navigate(`/admin/resume/${resumeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage student resume submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Resumes</p>
                  <p className="text-3xl font-bold">{stats.total_resumes || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-3xl font-bold">{stats.pending_reviews || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold">{stats.approved || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Completion</p>
                  <p className="text-3xl font-bold">{Math.round(stats.avg_completion || 0)}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Resumes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Resume Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {resumes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No resumes found</h3>
                <p className="text-muted-foreground">No resume submissions match your criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Student</th>
                      <th className="text-left p-4">Resume Title</th>
                      <th className="text-left p-4">Completion</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Submitted</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumes.map((resume) => (
                      <tr key={resume.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{resume.first_name} {resume.last_name}</p>
                            <p className="text-sm text-muted-foreground">{resume.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-medium">{resume.title}</p>
                          <p className="text-sm text-muted-foreground">ID: {resume.id}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${resume.completion_percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{resume.completion_percentage}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(resume.status)}
                        </td>
                        <td className="p-4">
                          <p className="text-sm">
                            {resume.submitted_at 
                              ? new Date(resume.submitted_at).toLocaleDateString()
                              : 'Not submitted'
                            }
                          </p>
                        </td>
                        <td className="p-4">
                          <Button
                            size="sm"
                            onClick={() => viewResume(resume.id)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
