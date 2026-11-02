import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, FileText, CheckCircle, 
  CreditCard, Plus, Upload, GraduationCap, 
  DollarSign, Briefcase, ChevronRight, X,
  Video, PlayCircle, Lock, LogOut, User, LogIn, UserPlus
} from 'lucide-react';

// ==========================================
// INITIAL MOCK DATA (Fallback for testing)
// ==========================================
const INITIAL_USERS = [
  { id: 'u1', username: 'uni_alice', password: 'password123', name: 'Alice (Uni Student)', role: 'uni_student', type: 'Uni', university_id: 'UN123' },
  { id: 'u2', username: 'out_bob', password: 'password123', name: 'Bob (Outside Student)', role: 'out_student', type: 'Outside', university_id: null },
  { id: 'i1', username: 'prof_smith', password: 'password123', name: 'Prof. Smith', role: 'instructor', department: 'Computer Science' }
];

const INITIAL_COURSES = [
  { course_id: 'c1', instructor_id: 'i1', course_name: 'Intro to React', description: 'Learn the basics of React and Hooks.', credits: 3, price: 150, status: 'Active' },
  { course_id: 'c2', instructor_id: 'i1', course_name: 'Database Design', description: 'Master ERDs and SQL.', credits: 4, price: 200, status: 'Active' }
];

const INITIAL_ASSIGNMENTS = [
  { assignment_id: 'a1', course_id: 'c1', title: 'React Hooks Project', description: 'Build a custom hook to manage local storage.', due_date: '2026-11-15', total_marks: 100 },
  { assignment_id: 'a2', course_id: 'c2', title: 'Design an ERD', description: 'Create an ERD for an online LMS.', due_date: '2026-11-20', total_marks: 50 }
];

const INITIAL_LECTURES = [
  { lecture_id: 'l1', course_id: 'c1', title: '1. Introduction to React', duration: '15:20', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { lecture_id: 'l2', course_id: 'c1', title: '2. State and Props', duration: '22:10', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { lecture_id: 'l3', course_id: 'c2', title: '1. Relational Database Basics', duration: '18:45', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }
];


export default function App() {
  // Global Application State
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Entities State
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // ====================================================
  // 🔌 DATABASE INTEGRATION: INITIAL DATA FETCH
  // ====================================================
  useEffect(() => {
    // Inject Tailwind CSS engine if it's missing in the environment
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }

    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with your actual database fetch calls
        // Example: const fetchedCourses = await myDb.collection('courses').get();
        
        // --- Simulated Network Delay & DB Fetch ---
        await new Promise(resolve => setTimeout(resolve, 500)); 
        setUsers(INITIAL_USERS);
        setCourses(INITIAL_COURSES);
        setAssignments(INITIAL_ASSIGNMENTS);
        setLectures(INITIAL_LECTURES);
        setEnrollments([]);
        setSubmissions([]);
        // ------------------------------------------

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // ====================================================
  // 🔌 DATABASE INTEGRATION: AUTHENTICATION
  // ====================================================
  const handleLogin = async (username, password, expectedAuthMode) => {
    // TODO: Replace with real DB authentication (e.g., Firebase Auth, JWT login)
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      // Enforce portal separation based on user role
      if (expectedAuthMode === 'uni_student' && user.role !== 'uni_student') {
        return { success: false, error: 'Access denied. Please use the correct portal for your role.' };
      }
      if (expectedAuthMode === 'instructor' && user.role !== 'instructor') {
        return { success: false, error: 'Access denied. Please use the Instructor portal.' };
      }
      if (expectedAuthMode === 'out_login' && user.role !== 'out_student') {
        return { success: false, error: 'Access denied. Please use the Outside Student portal.' };
      }

      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid username or password.' };
  };

  const handleSignup = async (userData) => {
    // TODO: Replace with real DB User creation
    // Example: await myDb.collection('users').add(userData);
    
    if (users.some(u => u.username === userData.username)) {
      return { success: false, error: 'Username already taken.' };
    }

    const newUser = {
      id: `u${Date.now()}`,
      ...userData,
      role: 'out_student',
      type: 'Outside',
      university_id: null
    };

    setUsers(prev => [...prev, newUser]); // Local state update
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const handleLogout = () => {
    // TODO: Handle DB/Auth logout if necessary (e.g., auth.signOut())
    setCurrentUser(null);
  };

  // ====================================================
  // 🔌 DATABASE INTEGRATION: MUTATIONS
  // ====================================================
  const handleEnroll = async (courseId) => {
    // TODO: Insert enrollment record into your database
    // Example: await myDb.collection('enrollments').add({ student_id, course_id, ... })
    
    const newEnrollment = {
      enrollment_id: `e${Date.now()}`,
      student_id: currentUser.id,
      course_id: courseId,
      enroll_date: new Date().toISOString().split('T')[0],
      enrollment_status: 'Active'
    };
    setEnrollments(prev => [...prev, newEnrollment]); // Local state update
  };

  const handleAddAssignment = async (newAssignmentData) => {
    // TODO: Insert assignment record into your database
    const newAssignment = { 
      ...newAssignmentData, 
      assignment_id: `a${Date.now()}` 
    };
    setAssignments(prev => [...prev, newAssignment]); // Local state update
  };

  const handleSubmitAssignment = async (submissionData) => {
    // TODO: Insert submission record and handle file upload to storage (e.g. AWS S3, Firebase Storage)
    const newSubmission = { 
      ...submissionData, 
      submission_id: `s${Date.now()}`,
      submitted_date: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      marks: null,
      feedback: ''
    };
    setSubmissions(prev => [...prev, newSubmission]); // Local state update
  };

  const handleGradeSubmission = async (submissionId, marks, feedback) => {
    // TODO: Update submission record in your database with marks and feedback
    setSubmissions(prev => prev.map(s => 
      s.submission_id === submissionId 
        ? { ...s, marks, feedback, status: 'Graded' } 
        : s
    )); // Local state update
  };


  // ====================================================
  // RENDER APP
  // ====================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthScreen 
        onLogin={handleLogin} 
        onSignup={handleSignup} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-600 tracking-tight">
              CloverLMS
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-500 hidden sm:block">
              Role: <span className="text-green-600 font-bold">{currentUser.type === 'Uni' ? 'University' : currentUser.role === 'instructor' ? 'Instructor' : 'Outside'}</span>
            </div>
            
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200 shadow-sm" title={currentUser.name}>
              {currentUser.name.charAt(0)}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 mt-2 text-lg">Here is your {currentUser.role.replace('_', ' ')} dashboard.</p>
        </div>

        {currentUser.role === 'instructor' ? (
          <InstructorDashboard 
            user={currentUser}
            courses={courses}
            assignments={assignments}
            submissions={submissions}
            lectures={lectures}
            onAddAssignment={handleAddAssignment}
            onGrade={handleGradeSubmission}
          />
        ) : (
          <StudentDashboard 
            user={currentUser} 
            courses={courses} 
            enrollments={enrollments}
            assignments={assignments}
            submissions={submissions}
            lectures={lectures}
            onEnroll={handleEnroll}
            onSubmit={handleSubmitAssignment}
          />
        )}
      </main>
    </div>
  );
}

// ==========================================
// INSTRUCTOR DASHBOARD
// ==========================================
function InstructorDashboard({ user, courses, assignments, submissions, lectures, onAddAssignment, onGrade }) {
  const myCourses = courses.filter(c => c.instructor_id === user.id);
  const [selectedCourse, setSelectedCourse] = useState(myCourses[0]?.course_id);
  const [showAddModal, setShowAddModal] = useState(false);

  const courseAssignments = assignments.filter(a => a.course_id === selectedCourse);
  const courseLectures = lectures.filter(l => l.course_id === selectedCourse);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar - Course List */}
      <div className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 self-start">
        <h3 className="font-bold text-gray-800 mb-4 px-2 uppercase text-xs tracking-wider">My Courses</h3>
        <div className="space-y-2">
          {myCourses.map(course => (
            <button
              key={course.course_id}
              onClick={() => setSelectedCourse(course.course_id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                selectedCourse === course.course_id 
                  ? 'bg-green-50 text-green-700 font-semibold shadow-sm border border-green-100' 
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
              }`}
            >
              {course.course_name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Area - Course Details */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
        {selectedCourse ? (
          <div>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" /> New Assignment
              </button>
            </div>

            {/* Lectures Section */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2 text-green-500" /> Uploaded Lectures
              </h3>
              {courseLectures.length === 0 ? (
                <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">No lectures uploaded yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courseLectures.map(lecture => (
                    <div key={lecture.lecture_id} className="border border-gray-200 rounded-xl p-4 flex items-center bg-white hover:border-green-300 transition-colors shadow-sm">
                      <div className="bg-green-50 p-2 rounded-full mr-4">
                        <PlayCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-sm">{lecture.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Duration: {lecture.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Assignments Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-500" /> Assignments & Submissions
              </h3>

              {courseAssignments.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No assignments created yet. Click "New Assignment" to start.
                </div>
              ) : (
                <div className="space-y-6">
                  {courseAssignments.map(assignment => {
                    const assignmentSubmissions = submissions.filter(s => s.assignment_id === assignment.assignment_id);
                    return (
                      <div key={assignment.assignment_id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-gray-900">{assignment.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">Due: {assignment.due_date} | Total Marks: {assignment.total_marks}</p>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {assignmentSubmissions.length} Submissions
                          </span>
                        </div>
                        
                        <div className="p-0">
                          {assignmentSubmissions.length === 0 ? (
                            <div className="p-5 text-sm text-gray-500 text-center italic">No submissions yet.</div>
                          ) : (
                            <ul className="divide-y divide-gray-100">
                              {assignmentSubmissions.map(sub => (
                                <li key={sub.submission_id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                  <div>
                                    <div className="font-medium text-gray-900 flex items-center">
                                      Student ID: {sub.student_id}
                                      {sub.status === 'Graded' && <CheckCircle className="w-4 h-4 ml-2 text-green-500"/>}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">Submitted: {sub.submitted_date}</div>
                                    <div className="text-sm text-green-600 mt-1 flex items-center">
                                      <FileText className="w-3 h-3 mr-1"/> {sub.file_path}
                                    </div>
                                  </div>
                                  
                                  {sub.status === 'Graded' ? (
                                    <div className="text-right bg-green-50 p-3 rounded-lg border border-green-100">
                                      <div className="font-bold text-green-700">{sub.marks} / {assignment.total_marks}</div>
                                      <div className="text-xs text-green-600 mt-1 max-w-[200px] truncate" title={sub.feedback}>"{sub.feedback}"</div>
                                    </div>
                                  ) : (
                                    <GradeForm 
                                      submission={sub} 
                                      maxMarks={assignment.total_marks} 
                                      onGrade={onGrade} 
                                    />
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 flex-col">
            <BookOpen className="w-16 h-16 mb-4 text-gray-300" />
            <p>Select a course from the sidebar to manage it.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddAssignmentModal 
          courseId={selectedCourse} 
          onClose={() => setShowAddModal(false)}
          onAdd={onAddAssignment}
        />
      )}
    </div>
  );
}

function GradeForm({ submission, maxMarks, onGrade }) {
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(marks && feedback) {
      onGrade(submission.submission_id, marks, feedback);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-end sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div>
        <input 
          type="number" 
          placeholder={`Marks (/${maxMarks})`}
          className="w-28 text-sm border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
          value={marks}
          max={maxMarks}
          min="0"
          onChange={e => setMarks(e.target.value)}
          required
        />
      </div>
      <div className="flex-grow w-full sm:w-auto">
        <input 
          type="text" 
          placeholder="Feedback..."
          className="w-full text-sm border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors w-full sm:w-auto whitespace-nowrap shadow-sm">
        Submit Grade
      </button>
    </form>
  );
}

function AddAssignmentModal({ courseId, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [marks, setMarks] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      course_id: courseId,
      title,
      description,
      due_date: dueDate,
      total_marks: parseInt(marks),
      status: 'Active'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Create Assignment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border" rows={3}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
              <input type="number" required value={marks} onChange={e => setMarks(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border" />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// STUDENT DASHBOARD (Uni & Outside)
// ==========================================
function StudentDashboard({ user, courses, enrollments, assignments, submissions, lectures, onEnroll, onSubmit }) {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'my_courses'
  const [paymentCourse, setPaymentCourse] = useState(null);

  const myEnrolledCourseIds = enrollments.filter(e => e.student_id === user.id).map(e => e.course_id);
  const myCourses = courses.filter(c => myEnrolledCourseIds.includes(c.course_id));
  const availableCourses = courses.filter(c => !myEnrolledCourseIds.includes(c.course_id));

  const handleEnrollClick = (course) => {
    if (user.type === 'Uni') {
      onEnroll(course.course_id); // Free
      setActiveTab('my_courses');
    } else {
      setPaymentCourse(course); // Requires Payment
    }
  };

  const handlePaymentSuccess = (courseId) => {
    onEnroll(courseId);
    setPaymentCourse(null);
    setActiveTab('my_courses');
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-max mb-8">
        <button 
          onClick={() => setActiveTab('catalog')} 
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'catalog' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Course Catalog
        </button>
        <button 
          onClick={() => setActiveTab('my_courses')} 
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'my_courses' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          My Learning ({myCourses.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'catalog' && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-green-600" /> Available Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl border-dashed">
                No new courses available to enroll.
              </div>
            ) : (
              availableCourses.map(course => (
                <div key={course.course_id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-600 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-white leading-tight">{course.course_name}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center text-sm mb-6">
                      <span className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded"><Briefcase className="w-4 h-4 mr-1"/> {course.credits} Credits</span>
                      <span className="flex items-center font-bold text-gray-900 bg-green-50 text-green-700 px-2 py-1 rounded">
                        {user.type === 'Uni' ? 'Free (Uni)' : <><DollarSign className="w-4 h-4"/>{course.price}</>}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleEnrollClick(course)}
                      className="w-full bg-green-600 text-white font-medium py-2.5 rounded-xl hover:bg-green-700 transition-colors shadow-sm flex justify-center items-center"
                    >
                      {user.type === 'Uni' ? 'Enroll Now' : <><Lock className="w-4 h-4 mr-2"/> Pay & Enroll</>}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'my_courses' && (
        <div className="space-y-8">
          {myCourses.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed rounded-2xl text-gray-500">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">You haven't enrolled in any courses yet.</p>
              <button onClick={() => setActiveTab('catalog')} className="mt-4 text-green-600 font-medium hover:underline">Browse Catalog</button>
            </div>
          ) : (
            myCourses.map(course => (
              <StudentCourseDetail 
                key={course.course_id} 
                user={user} 
                course={course} 
                assignments={assignments.filter(a => a.course_id === course.course_id)}
                submissions={submissions}
                lectures={lectures.filter(l => l.course_id === course.course_id)}
                onSubmit={onSubmit}
              />
            ))
          )}
        </div>
      )}

      {paymentCourse && (
        <PaymentModal 
          course={paymentCourse} 
          onClose={() => setPaymentCourse(null)} 
          onSuccess={() => handlePaymentSuccess(paymentCourse.course_id)} 
        />
      )}
    </div>
  );
}

function StudentCourseDetail({ user, course, assignments, submissions, lectures, onSubmit }) {
  const [activeDetailTab, setActiveDetailTab] = useState('lectures');
  const [activeLecture, setActiveLecture] = useState(lectures[0] || null);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gray-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold">{course.course_name}</h2>
          <p className="text-gray-300 mt-2 max-w-2xl">{course.description}</p>
        </div>
        <div className="mt-4 sm:mt-0 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm relative z-10 border border-white/20">
          <span className="text-sm font-medium text-gray-200">Instructor ID: {course.instructor_id}</span>
        </div>
      </div>

      <div className="border-b border-gray-200 px-6 flex space-x-8 bg-gray-50 overflow-x-auto">
         <button 
            onClick={() => setActiveDetailTab('lectures')} 
            className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeDetailTab === 'lectures' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
            <div className="flex items-center"><Video className="w-4 h-4 mr-2"/> Course Lectures</div>
         </button>
         <button 
            onClick={() => setActiveDetailTab('assignments')} 
            className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeDetailTab === 'assignments' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
            <div className="flex items-center"><FileText className="w-4 h-4 mr-2"/> Assignments</div>
         </button>
      </div>

      <div className="p-6 sm:p-8">
        {/* LECTURES TAB */}
        {activeDetailTab === 'lectures' && (
          <div>
            {lectures.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl text-gray-500 border border-dashed border-gray-200">
                <Video className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No lectures posted for this course yet.</p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Video Player */}
                <div className="flex-grow bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  {activeLecture ? (
                    <video controls className="w-full aspect-video outline-none" key={activeLecture.lecture_id} poster="https://via.placeholder.com/800x450/111827/16A34A?text=CloverLMS+Lecture+Ready">
                      <source src={activeLecture.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center text-gray-500 bg-gray-900">Select a lecture to watch</div>
                  )}
                  <div className="p-5 bg-gray-900 text-white border-t border-gray-800">
                    <h3 className="font-bold text-lg">{activeLecture?.title || 'No Lecture Selected'}</h3>
                    <p className="text-gray-400 text-sm mt-1">Duration: {activeLecture?.duration || '--:--'}</p>
                  </div>
                </div>
                {/* Playlist */}
                <div className="lg:w-1/3 flex-shrink-0">
                  <h4 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider border-b pb-2">Curriculum</h4>
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {lectures.map(lecture => (
                      <button 
                        key={lecture.lecture_id}
                        onClick={() => setActiveLecture(lecture)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start ${
                          activeLecture?.lecture_id === lecture.lecture_id 
                            ? 'bg-green-50 border-green-200 shadow-sm ring-1 ring-green-500 ring-opacity-50' 
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <PlayCircle className={`w-6 h-6 mr-3 mt-0.5 flex-shrink-0 transition-colors ${
                          activeLecture?.lecture_id === lecture.lecture_id ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className={`text-sm font-bold ${
                            activeLecture?.lecture_id === lecture.lecture_id ? 'text-green-900' : 'text-gray-700'
                          }`}>{lecture.title}</div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <Video className="w-3 h-3 mr-1"/> {lecture.duration}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ASSIGNMENTS TAB */}
        {activeDetailTab === 'assignments' && (
          <div>
            {assignments.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl text-gray-500 border border-dashed border-gray-200">
                <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No assignments posted for this course yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignments.map(assignment => {
                  const mySubmission = submissions.find(s => s.assignment_id === assignment.assignment_id && s.student_id === user.id);
                  return (
                    <div key={assignment.assignment_id} className="border border-gray-200 bg-white rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-gray-900">{assignment.title}</h3>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded font-medium whitespace-nowrap ml-2">
                          {assignment.total_marks} Marks
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-6">{assignment.description}</p>
                      
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Due Date:</span>
                          <span className="font-medium text-gray-900">{assignment.due_date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`font-medium flex items-center ${mySubmission ? 'text-green-600' : 'text-amber-600'}`}>
                            {mySubmission ? (
                              <><CheckCircle className="w-4 h-4 mr-1" /> Submitted</>
                            ) : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {mySubmission ? (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                          <div className="text-sm text-green-800 font-medium mb-1">File: {mySubmission.file_path}</div>
                          {mySubmission.status === 'Graded' ? (
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <div className="flex justify-between font-bold text-green-900 mb-1">
                                <span>Grade:</span>
                                <span>{mySubmission.marks} / {assignment.total_marks}</span>
                              </div>
                              <div className="text-sm text-green-700 italic">"{mySubmission.feedback}"</div>
                            </div>
                          ) : (
                            <div className="text-sm text-green-600 mt-2 italic">Awaiting grade from instructor.</div>
                          )}
                        </div>
                      ) : (
                        <SubmitAssignmentBtn assignment={assignment} user={user} onSubmit={onSubmit} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SubmitAssignmentBtn({ assignment, user, onSubmit }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="w-full bg-white border-2 border-green-600 text-green-700 font-bold py-2.5 rounded-xl hover:bg-green-50 transition-colors flex justify-center items-center"
      >
        <Upload className="w-4 h-4 mr-2" /> Upload Work
      </button>

      {showModal && (
        <SubmitModal 
          assignment={assignment} 
          user={user} 
          onClose={() => setShowModal(false)} 
          onSubmit={onSubmit} 
        />
      )}
    </>
  );
}

function SubmitModal({ assignment, user, onClose, onSubmit }) {
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      assignment_id: assignment.assignment_id,
      student_id: user.id,
      course_id: assignment.course_id,
      file_path: fileName || 'assignment_submission.pdf'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-2">Submit Assignment</h3>
        <p className="text-gray-500 text-sm mb-6">Upload your work for "{assignment.title}"</p>
        
        <form onSubmit={handleSubmit}>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors mb-6 group cursor-pointer relative">
            <Upload className="w-8 h-8 mx-auto text-gray-400 group-hover:text-green-500 mb-3 transition-colors" />
            <div className="text-sm text-gray-600 font-medium">Click to browse or drag file here</div>
            <div className="text-xs text-gray-400 mt-1">PDF, DOCX, ZIP (Max 10MB)</div>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFileName(e.target.files[0]?.name)}
              required
            />
          </div>
          
          {fileName && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center border border-green-100">
              <FileText className="w-4 h-4 mr-2" /> {fileName}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm">Submit Work</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PaymentModal({ course, onClose, onSuccess }) {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1500); // Simulate network request
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="bg-gray-900 p-6 text-white text-center">
          <CreditCard className="w-12 h-12 mx-auto text-green-400 mb-3" />
          <h3 className="text-2xl font-bold">Secure Checkout</h3>
          <p className="text-gray-400 text-sm mt-1">Outside Student Enrollment</p>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-bold text-gray-900">{course.course_name}</div>
                <div className="text-sm text-gray-500">Course ID: {course.course_id}</div>
              </div>
              <div className="font-bold text-lg text-gray-900">${course.price}</div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center font-bold text-lg">
              <span>Total Due</span>
              <span className="text-green-600">${course.price}</span>
            </div>
          </div>

          <button 
            onClick={handlePay} 
            disabled={processing}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all flex justify-center items-center shadow-md disabled:opacity-70"
          >
            {processing ? (
              <span className="flex items-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div> Processing...</span>
            ) : (
              `Pay $${course.price} & Enroll`
            )}
          </button>
          
          <button 
            onClick={onClose} 
            disabled={processing}
            className="w-full mt-3 text-gray-500 font-medium py-2 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================
function AuthScreen({ onLogin, onSignup }) {
  // 'uni_student' | 'instructor' | 'out_login' | 'out_signup'
  const [authMode, setAuthMode] = useState('uni_student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (authMode === 'out_signup') {
        const response = await onSignup({ username, password, name });
        if (!response.success) setError(response.error);
      } else {
        const response = await onLogin(username, password, authMode);
        if (!response.success) {
          setError(response.error);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-green-600 p-3 rounded-2xl shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-600">
          CloverLMS Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Online Learning Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
            <button
              onClick={() => { setAuthMode('uni_student'); setError(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${authMode === 'uni_student' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Uni Student
            </button>
            <button
              onClick={() => { setAuthMode('instructor'); setError(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${authMode === 'instructor' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Instructor
            </button>
            <button
              onClick={() => { setAuthMode('out_login'); setError(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${(authMode === 'out_login' || authMode === 'out_signup') ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Outside Student
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
            {authMode === 'uni_student' ? 'University Student Login' : 
             authMode === 'instructor' ? 'Instructor Login' : 
             authMode === 'out_login' ? 'Outside Student Login' : 
             'Create Outside Account'}
          </h3>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {authMode === 'out_signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border outline-none"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-70"
            >
              {authMode === 'out_signup' ? (
                <><UserPlus className="w-5 h-5 mr-2"/> Sign Up</>
              ) : (
                <><LogIn className="w-5 h-5 mr-2"/> Sign In</>
              )}
            </button>
          </form>

          {(authMode === 'out_login' || authMode === 'out_signup') && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {authMode === 'out_login' ? 'New outside student?' : 'Already have an account?'}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'out_login' ? 'out_signup' : 'out_login');
                    setError('');
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-green-300 rounded-lg shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 transition-colors"
                >
                  {authMode === 'out_login' ? 'Create a Personal Account' : 'Sign in to Personal Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}