import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ResumeNameDialog } from '../components/ResumeNameDialog';
import { 
  User, 
  FileText, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNameDialog, setShowNameDialog] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/api/resumes');
      setResumes(response.data);
    } catch (error) {
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const createNewResume = async (title) => {
    try {
      await axios.post('/api/resumes', { title });
      toast.success('Resume created successfully');
      fetchResumes();
    } catch (error) {
      toast.error('Failed to create resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-slate-600">
            Build and manage your professional resumes with AI assistance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Resumes</p>
                  <p className="text-3xl font-bold">{resumes.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="flex items-center mt-4 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+12%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold">{resumes.filter(r => r.completion_percentage > 80).length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-3xl font-bold">{resumes.length > 0 ? 'Today' : 'Never'}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowNameDialog(true)}>
            <CardContent className="p-6 text-center">
              <Plus className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium">Create New Resume</h3>
              <p className="text-sm text-slate-600">Start building your resume</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium">Templates</h3>
              <p className="text-sm text-slate-600">Browse resume templates</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-medium">Profile</h3>
              <p className="text-sm text-slate-600">Update your information</p>
            </CardContent>
          </Card>
        </div>

        {/* Resumes List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            {resumes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
                <p className="text-muted-foreground mb-6">Get started by creating your first resume</p>
                <Button onClick={() => setShowNameDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Resume
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.map((resume) => (
                  <div key={resume.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{resume.title}</h3>
                        <p className="text-xs text-slate-500">ID: #{resume.id}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>Updated: {new Date(resume.updated_at).toLocaleString()}</span>
                          <Badge variant="secondary">{resume.completion_percentage}% Complete</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/resume/${resume.id}`}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <ResumeNameDialog 
          isOpen={showNameDialog}
          onClose={() => setShowNameDialog(false)}
          onConfirm={createNewResume}
        />
      </div>
    </div>
  );
};

export default EnhancedDashboard;
