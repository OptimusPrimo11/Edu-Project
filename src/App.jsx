import React, { useState, useMemo, useEffect } from 'react';
import COURSE_LIST from './courseList.js';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// ==========================================
// PRE-LOADED INITIAL DATA (From spreadsheets)
// ==========================================
const INITIAL_FACULTIES = [
  { id: 'f1', code: 'FSKTM', name: 'Fakulti Sains Komputer dan Teknologi Maklumat' },
  { id: 'f2', code: 'FPBK', name: 'Fakulti Bahasa dan Komunikasi' },
  { id: 'f3', code: 'FEP', name: 'Fakulti Ekonomi dan Perniagaan' },
  { id: 'f4', code: 'FK', name: 'Fakulti Kejuruteraan' },
  { id: 'f5', code: 'FSSK', name: 'Fakulti Sains Sosial dan Kemanusiaan' },
  { id: 'f6', code: 'FSTS', name: 'Fakulti Sains dan Teknologi Sumber' }
];

const INITIAL_PROGRAMS = [
  // FSKTM
  { id: 'p1', facultyId: 'f1', name: 'Sarjana Muda Sains Komputer (Sains Komputan) dengan Kepujian' },
  { id: 'p2', facultyId: 'f1', name: 'Sarjana Muda Kejuruteraan Perisian dengan Kepujian' },
  { id: 'p3', facultyId: 'f1', name: 'Sarjana Muda Sains Komputer (Kejuruteraan Data) dengan Kepujian' },
  // FPBK
  { id: 'p4', facultyId: 'f2', name: 'Sarjana Muda Sastera dalam Linguistik dengan Kepujian' },
  { id: 'p5', facultyId: 'f2', name: 'Sarjana Muda Komunikasi (Komunikasi Strategik) dengan Kepujian' },
  // FEP
  { id: 'p6', facultyId: 'f3', name: 'Sarjana Muda Perakaunan dengan Kepujian' },
  { id: 'p7', facultyId: 'f3', name: 'Sarjana Muda Ekonomi (Ekonomi Perkhidmatan) dengan Kepujian' },
  // FK
  { id: 'p8', facultyId: 'f4', name: 'Sarjana Muda Kejuruteraan Sivil dengan Kepujian' },
  { id: 'p9', facultyId: 'f4', name: 'Sarjana Muda Kejuruteraan Kimia dengan Kepujian' }
];

const INITIAL_COURSES = [
  {
    id: 'c1',
    facultyId: 'f1',
    programId: 'p2',
    code: 'KMY1023',
    name: 'Fundamentals of Software Engineering',
    courseType: 'Teras',
    professionalBody: 'Ya',
    deliveryMode: 'Mode 3: Theory + Practical',
    teachingActivity: 'Hibrid',
    assessmentActivity: 'Fizikal (Keperluan amali)',
    year: 'Tahun 1',
    semester: 'Semester 1'
  },
  {
    id: 'c2',
    facultyId: 'f1',
    programId: 'p2',
    code: 'TMC1013',
    name: 'Bahasa Mandarin I',
    courseType: 'Generik/Pengukuhan',
    professionalBody: 'Tidak',
    deliveryMode: 'Mode 1: Theory',
    teachingActivity: 'Online Penuh',
    assessmentActivity: 'Online Penuh',
    year: 'Tahun 1',
    semester: 'Semester 1'
  },
  {
    id: 'c3',
    facultyId: 'f1',
    programId: 'p1',
    code: 'KMC1093',
    name: 'Cognitive Science Foundations',
    courseType: 'Elektif Universiti',
    professionalBody: 'Tidak',
    deliveryMode: 'Mode 1: Theory',
    teachingActivity: 'Hibrid',
    assessmentActivity: 'Hibrid',
    year: 'Tahun 1',
    semester: 'Semester 2'
  },
  {
    id: 'c4',
    facultyId: 'f4',
    programId: 'p8',
    code: 'KNS1013',
    name: 'Civil Engineering Materials',
    courseType: 'Teras',
    professionalBody: 'Ya',
    deliveryMode: 'Mode 3: Theory + Practical',
    teachingActivity: 'Fizikal (Keperluan Amali)',
    assessmentActivity: 'Fizikal (Keperluan amali)',
    year: 'Tahun 1',
    semester: 'Semester 1'
  },
  {
    id: 'c5',
    facultyId: 'f3',
    programId: 'p6',
    code: 'ACT1013',
    name: 'Financial Accounting I',
    courseType: 'Teras',
    professionalBody: 'Ya',
    deliveryMode: 'Mode 1: Theory',
    teachingActivity: 'Hibrid',
    assessmentActivity: 'Fizikal (Bukan amali)',
    year: 'Tahun 1',
    semester: 'Semester 1'
  },
  {
    id: 'c6',
    facultyId: 'f1',
    programId: 'p2',
    code: 'KMY3084',
    name: 'Industrial Training / Internship',
    courseType: 'Latihan Industri',
    professionalBody: 'Tidak',
    deliveryMode: 'Mode 2: Practical',
    teachingActivity: 'Fizikal (Keperluan Amali)',
    assessmentActivity: 'Fizikal (Keperluan amali)',
    year: 'Tahun 3',
    semester: 'Semester 2'
  },
  {
    id: 'c7',
    facultyId: 'f2',
    programId: 'p4',
    code: 'PBI1012',
    name: 'Academic English One',
    courseType: 'Generik/Pengukuhan',
    professionalBody: 'Tidak',
    deliveryMode: 'Mode 1: Theory',
    teachingActivity: 'Online Penuh',
    assessmentActivity: 'Online Penuh',
    year: 'Tahun 1',
    semester: 'Semester 1'
  },
  {
    id: 'c8',
    facultyId: 'f1',
    programId: 'p3',
    code: 'KMY1041',
    name: 'Co-curriculum I',
    courseType: 'Generik/Pengukuhan',
    professionalBody: 'Tidak',
    deliveryMode: 'Mode 2: Practical',
    teachingActivity: 'Fizikal (Keperluan Amali)',
    assessmentActivity: 'Fizikal (Keperluan amali)',
    year: 'Tahun 1',
    semester: 'Semester 2'
  },
  {
    id: 'c9',
    facultyId: 'f1',
    programId: 'p2',
    code: 'MPU3122',
    name: 'Tamadun Islam dan Tamadun Asia (TITAS)',
    courseType: 'MPU (U1-U3)',
    professionalBody: 'Tidak',
    deliveryMode: 'Mode 1: Theory',
    teachingActivity: 'Online Penuh',
    assessmentActivity: 'Online Penuh',
    year: 'Tahun 1',
    semester: 'Semester 2'
  }
];

export default function App() {
  // State variables
  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState(INITIAL_FACULTIES);
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [courses, setCourses] = useState(INITIAL_COURSES);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [facSnap, progSnap, courseSnap] = await Promise.all([
          getDoc(doc(db, 'edudata', 'faculties')),
          getDoc(doc(db, 'edudata', 'programs')),
          getDoc(doc(db, 'edudata', 'courses')),
        ]);
        if (facSnap.exists()) setFaculties(facSnap.data().items);
        if (progSnap.exists()) setPrograms(progSnap.data().items);
        if (courseSnap.exists()) setCourses(courseSnap.data().items);
      } catch (err) {
        console.error('Failed to load data from Firestore:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => { if (!loading) setDoc(doc(db, 'edudata', 'faculties'), { items: faculties }); }, [faculties, loading]);
  useEffect(() => { if (!loading) setDoc(doc(db, 'edudata', 'programs'), { items: programs }); }, [programs, loading]);
  useEffect(() => { if (!loading) setDoc(doc(db, 'edudata', 'courses'), { items: courses }); }, [courses, loading]);

  // Filter state for dashboard
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState('All');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState('All');

  // Filter state for Manage Courses table
  const [courseSearch, setCourseSearch] = useState('');
  const [courseFilterFaculty, setCourseFilterFaculty] = useState('All');
  const [courseFilterType, setCourseFilterType] = useState('All');
  const [courseFilterProBody, setCourseFilterProBody] = useState('All');

  // Navigation tabs
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'wizard' | 'courses' | 'programs'

  // Wizard current state
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    facultyId: '',
    programId: '',
    code: '',
    name: '',
    courseType: 'Teras',
    liSubType: '',
    year: 'Tahun 1',
    semester: 'Semester 1',
    professionalBody: 'Tidak',
    hasPractical: 'No',
    practicalType: 'Computer Lab',
    hasTheory: 'Yes',
    suggestedMode: '',
    teachingActivity: '',
    assessmentActivity: ''
  });

  // Modal alert/success message states
  const [notification, setNotification] = useState(null);

  // Form states for adding Faculty, Program, Course manually
  const [newFaculty, setNewFaculty] = useState({ code: '', name: '' });
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [editFacultyData, setEditFacultyData] = useState({ code: '', name: '' });
  const [newProgram, setNewProgram] = useState({ facultyId: '', name: '' });
  const [editingProgramId, setEditingProgramId] = useState(null);
  const [editProgramData, setEditProgramData] = useState({ name: '', facultyId: '' });
  const [newCourse, setNewCourse] = useState({
    facultyId: '',
    programId: '',
    code: '',
    name: '',
    courseType: 'Teras',
    liSubType: '',
    professionalBody: 'Tidak',
    teachingMode: 'Theory (Knowledge-based)',
    teachingSubTeori: 'Online',
    teachingSubPractical: 'Makmal Komputer',
    teachingActivity: 'Online',
    assessmentActivity: 'Online Penuh',
    year: 'Tahun 1',
    semester: 'Semester 1'
  });

  // Editing state
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Course combobox state (Manage Courses form)
  const [courseComboInput, setCourseComboInput] = useState('');
  const [courseComboOpen, setCourseComboOpen] = useState(false);
  // Course combobox state (Wizard form)
  const [wizardComboInput, setWizardComboInput] = useState('');
  const [wizardComboOpen, setWizardComboOpen] = useState(false);

  // Helper trigger for alert message
  const triggerNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Safe programmatic export to CSV
  const handleExportCSV = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "No,Fakulti,Nama Program,Tahun,Semester,Kod Kursus,Nama Kursus,Jenis Kursus,Badan Profesional,Mod Pelaksanaan,Aktiviti Pengajaran,Penilaian\n";
      
      courses.forEach((c, index) => {
        const fac = faculties.find(f => f.id === c.facultyId)?.code || '';
        const prog = programs.find(p => p.id === c.programId)?.name || '';
        const row = [
          index + 1,
          `"${fac}"`,
          `"${prog}"`,
          `"${c.year}"`,
          `"${c.semester}"`,
          `"${c.code}"`,
          `"${c.name}"`,
          `"${c.courseType}${c.liSubType ? ': ' + c.liSubType : ''}"`,
          `"${c.professionalBody}"`,
          `"${c.deliveryMode}"`,
          `"${c.teachingActivity}"`,
          `"${c.assessmentActivity}"`
        ].join(",");
        csvContent += row + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Maklum_Balas_Klasifikasi_Kursus.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerNotification("CSV file downloaded successfully!");
    } catch (err) {
      triggerNotification("Failed to export data.", "error");
    }
  };

  // Filtered courses based on dashboard selectors
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchFaculty = selectedFacultyFilter === 'All' || c.facultyId === selectedFacultyFilter;
      const matchProgram = selectedProgramFilter === 'All' || c.programId === selectedProgramFilter;
      return matchFaculty && matchProgram;
    });
  }, [courses, selectedFacultyFilter, selectedProgramFilter]);

  // Filtered courses for Manage Courses table
  const filteredCoursesTable = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = courseSearch === '' ||
        c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.name.toLowerCase().includes(courseSearch.toLowerCase());
      const matchFaculty = courseFilterFaculty === 'All' || c.facultyId === courseFilterFaculty;
      const matchType = courseFilterType === 'All' || c.courseType === courseFilterType;
      const matchProBody = courseFilterProBody === 'All' || c.professionalBody === courseFilterProBody;
      return matchSearch && matchFaculty && matchType && matchProBody;
    });
  }, [courses, courseSearch, courseFilterFaculty, courseFilterType, courseFilterProBody]);

  // Filtered COURSE_LIST for comboboxes
  const courseComboResults = useMemo(() => {
    if (!courseComboInput.trim()) return [];
    const q = courseComboInput.toLowerCase();
    return COURSE_LIST.filter(c =>
      c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    ).slice(0, 30);
  }, [courseComboInput]);

  const wizardComboResults = useMemo(() => {
    if (!wizardComboInput.trim()) return [];
    const q = wizardComboInput.toLowerCase();
    return COURSE_LIST.filter(c =>
      c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    ).slice(0, 30);
  }, [wizardComboInput]);

  // Compute stats for Dashboard
  const stats = useMemo(() => {
    const total = filteredCourses.length;
    if (total === 0) {
      return {
        total: 0,
        courseTypes: { 'Teras': 0, 'Elektif Universiti': 0, 'MPU (U1-U3)': 0, 'MPU (U4)': 0, 'Latihan Industri': 0, 'Generik/Pengukuhan': 0 },
        professionalBodyCount: 0,
        professionalBodyPercent: 0,
        deliveryModes: { 'Mode 1: Theory': 0, 'Mode 2: Practical': 0, 'Mode 3: Theory + Practical': 0 }
      };
    }

    const courseTypes = { 'Teras': 0, 'Elektif Universiti': 0, 'MPU (U1-U3)': 0, 'MPU (U4)': 0, 'Latihan Industri': 0, 'Generik/Pengukuhan': 0 };
    const deliveryModes = { 'Mode 1: Theory': 0, 'Mode 2: Practical': 0, 'Mode 3: Theory + Practical': 0 };
    let professionalBodyCount = 0;

    filteredCourses.forEach(c => {
      if (courseTypes[c.courseType] !== undefined) {
        courseTypes[c.courseType]++;
      }
      if (c.professionalBody === 'Ya') {
        professionalBodyCount++;
      }
      
      // Clean matching for delivery mode
      if (c.deliveryMode.includes('Mode 1')) deliveryModes['Mode 1: Theory']++;
      else if (c.deliveryMode.includes('Mode 2')) deliveryModes['Mode 2: Practical']++;
      else if (c.deliveryMode.includes('Mode 3')) deliveryModes['Mode 3: Theory + Practical']++;
    });

    return {
      total,
      courseTypes,
      professionalBodyCount,
      professionalBodyPercent: Math.round((professionalBodyCount / total) * 100),
      deliveryModes
    };
  }, [filteredCourses]);

  // Reset wizard helper
  const resetWizard = () => {
    setWizardStep(1);
    setWizardData({
      facultyId: faculties[0]?.id || '',
      programId: programs.filter(p => p.facultyId === (faculties[0]?.id || ''))[0]?.id || '',
      code: '',
      name: '',
      courseType: 'Teras',
      year: 'Tahun 1',
      semester: 'Semester 1',
      professionalBody: 'Tidak',
      hasPractical: 'No',
      practicalType: 'Computer Lab',
      hasTheory: 'Yes',
      suggestedMode: '',
      teachingActivity: '',
      assessmentActivity: ''
    });
  };

  // Start wizard helper
  const handleStartWizard = () => {
    resetWizard();
    setActiveTab('wizard');
  };

  // Save classification from wizard
  const saveWizardClassification = () => {
    if (!wizardData.code || !wizardData.name) {
      triggerNotification("Please fill in the Course Code and Name", "error");
      return;
    }

    const newCls = {
      id: 'c_' + Date.now(),
      facultyId: wizardData.facultyId,
      programId: wizardData.programId,
      code: wizardData.code,
      name: wizardData.name,
      courseType: wizardData.courseType,
      liSubType: wizardData.liSubType || '',
      professionalBody: wizardData.professionalBody,
      deliveryMode: wizardData.suggestedMode,
      teachingActivity: wizardData.teachingActivity,
      assessmentActivity: wizardData.assessmentActivity,
      year: wizardData.year,
      semester: wizardData.semester
    };

    setCourses(prev => [newCls, ...prev]);
    triggerNotification(`Course ${wizardData.code} has been successfully classified and added!`);
    setActiveTab('dashboard');
  };

  // Compute Wizard suggestions on Q&A change
  const computeSuggestions = (data) => {
    let mode = 'Mode 1: Theory';
    let teach = 'Online Penuh';
    let assess = 'Online Penuh';

    if (data.hasPractical === 'Yes' && data.hasTheory === 'Yes') {
      mode = 'Mode 3: Theory + Practical';
      teach = data.professionalBody === 'Ya' ? 'Fizikal (Sekatan Badan Professional)' : 'Hibrid';
      assess = data.professionalBody === 'Ya' ? 'Fizikal (Sekatan Badan Professional)' : 'Fizikal (Keperluan amali)';
    } else if (data.hasPractical === 'Yes' && data.hasTheory === 'No') {
      mode = 'Mode 2: Practical';
      teach = 'Fizikal (Keperluan Amali)';
      assess = 'Fizikal (Keperluan amali)';
    } else {
      // Mode 1 Theory
      mode = 'Mode 1: Theory';
      teach = 'Online Penuh';
      assess = 'Online Penuh';
      if (data.professionalBody === 'Ya') {
        teach = 'Hibrid';
        assess = 'Fizikal (Bukan amali)';
      }
    }

    return { mode, teach, assess };
  };

  const handleWizardChange = (key, value) => {
    setWizardData(prev => {
      const updated = { ...prev, [key]: value };
      
      // Auto switch program if faculty changes in step 1
      if (key === 'facultyId') {
        const filteredProgs = programs.filter(p => p.facultyId === value);
        updated.programId = filteredProgs[0]?.id || '';
      }

      // Recompute suggested delivery modes based on the answers
      const { mode, teach, assess } = computeSuggestions(updated);
      updated.suggestedMode = mode;
      updated.teachingActivity = teach;
      updated.assessmentActivity = assess;

      return updated;
    });
  };

  // Simple additions
  const handleStartEditFaculty = (f) => {
    setEditingFacultyId(f.id);
    setEditFacultyData({ code: f.code, name: f.name });
  };

  const handleSaveFaculty = (id) => {
    if (!editFacultyData.code || !editFacultyData.name) {
      triggerNotification("Faculty Code and Name cannot be empty", "error");
      return;
    }
    setFaculties(prev => prev.map(f => f.id === id ? { ...f, code: editFacultyData.code.toUpperCase(), name: editFacultyData.name } : f));
    setEditingFacultyId(null);
    triggerNotification("Faculty updated successfully!");
  };

  const handleAddFaculty = (e) => {
    e.preventDefault();
    if (!newFaculty.code || !newFaculty.name) {
      triggerNotification("Please fill out both Faculty Code and Name", "error");
      return;
    }
    const newId = 'f_' + Date.now();
    setFaculties(prev => [...prev, { id: newId, code: newFaculty.code.toUpperCase(), name: newFaculty.name }]);
    setNewFaculty({ code: '', name: '' });
    triggerNotification(`Faculty ${newFaculty.code.toUpperCase()} successfully added!`);
  };

  const handleAddProgram = (e) => {
    e.preventDefault();
    if (!newProgram.facultyId || !newProgram.name) {
      triggerNotification("Please select a Faculty and fill the Program Name", "error");
      return;
    }
    const newId = 'p_' + Date.now();
    setPrograms(prev => [...prev, { id: newId, facultyId: newProgram.facultyId, name: newProgram.name }]);
    setNewProgram({ facultyId: '', name: '' });
    triggerNotification("New Program added successfully!");
  };

  const handleStartEditProgram = (p) => {
    setEditingProgramId(p.id);
    setEditProgramData({ name: p.name, facultyId: p.facultyId });
  };

  const handleSaveProgram = (id) => {
    if (!editProgramData.name.trim()) {
      triggerNotification("Program Name cannot be empty", "error");
      return;
    }
    setPrograms(prev => prev.map(p => p.id === id ? { ...p, name: editProgramData.name, facultyId: editProgramData.facultyId } : p));
    setEditingProgramId(null);
    triggerNotification("Program updated successfully!");
  };

  const handleDeleteProgram = (id) => {
    const cCount = courses.filter(c => c.programId === id).length;
    const msg = cCount > 0
      ? `This program has ${cCount} course(s) assigned. Deleting it will leave those courses without a program. Continue?`
      : "Are you sure you want to delete this program?";
    if (!window.confirm(msg)) return;
    setPrograms(prev => prev.filter(p => p.id !== id));
    triggerNotification("Program deleted.");
  };

  const handleAddCourseManual = (e) => {
    e.preventDefault();
    if (!newCourse.facultyId || !newCourse.programId || !newCourse.code || !newCourse.name) {
      triggerNotification("Please fill in all course details", "error");
      return;
    }

    const tm = newCourse.teachingMode || 'Theory (Knowledge-based)';
    const subTeori = newCourse.teachingSubTeori || 'Online';
    const subPractical = newCourse.teachingSubPractical || 'Makmal Komputer';
    let composedTeaching = '';
    let derivedDeliveryMode = 'Mode 1: Theory';
    if (newCourse.courseType === 'Latihan Industri' && newCourse.liSubType === 'Online') {
      composedTeaching = 'Online (Latihan Industri)'; derivedDeliveryMode = 'Mode 1: Theory';
    } else if (tm === 'Theory (Knowledge-based)') { composedTeaching = subTeori; derivedDeliveryMode = 'Mode 1: Theory'; }
    else if (tm === 'Practical (Performance-based)') { composedTeaching = subPractical; derivedDeliveryMode = 'Mode 2: Practical'; }
    else { composedTeaching = `${subTeori} + ${subPractical}`; derivedDeliveryMode = 'Mode 3: Theory + Practical'; }

    const courseData = {
      ...newCourse,
      teachingActivity: composedTeaching,
      deliveryMode: derivedDeliveryMode,
      id: editingCourseId || 'c_' + Date.now()
    };

    if (editingCourseId) {
      setCourses(prev => prev.map(c => c.id === editingCourseId ? courseData : c));
      setEditingCourseId(null);
      triggerNotification("Course updated successfully!");
    } else {
      setCourses(prev => [courseData, ...prev]);
      triggerNotification("Course added successfully!");
    }

    setNewCourse({
      facultyId: '',
      programId: '',
      code: '',
      name: '',
      courseType: 'Teras',
      liSubType: '',
      professionalBody: 'Tidak',
      teachingMode: 'Theory (Knowledge-based)',
      teachingSubTeori: 'Online',
      teachingSubPractical: 'Makmal Komputer',
      teachingActivity: 'Online',
      assessmentActivity: 'Online Penuh',
      year: 'Tahun 1',
      semester: 'Semester 1'
    });
    setCourseComboInput('');
  };

  const handleDeleteCourse = (id) => {
    if (window.confirm("Are you sure you want to delete this course classification?")) {
      setCourses(prev => prev.filter(c => c.id !== id));
      triggerNotification("Course classification deleted.");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course.id);
    // Parse teachingActivity into cascading fields if not already stored
    let teachingMode = course.teachingMode || 'Theory (Knowledge-based)';
    let teachingSubTeori = course.teachingSubTeori || 'Online';
    let teachingSubPractical = course.teachingSubPractical || 'Makmal Komputer';
    if (!course.teachingMode) {
      const ta = course.teachingActivity || '';
      const practicalOptions = ['Makmal Sains', 'Makmal Komputer', 'Studio', 'Workshop', 'Clinical/Medical Attachment', 'Makmal Kaunseling/Psikologi', 'Kerja Lapangan'];
      const hasPractical = practicalOptions.some(o => ta.includes(o));
      const hasTeori = ta.includes('Online') || ta.includes('Hybrid') || ta.includes('Hibrid');
      if (hasPractical && hasTeori) teachingMode = 'Mix (Theory & Practical)';
      else if (hasPractical) teachingMode = 'Practical (Performance-based)';
      else teachingMode = 'Theory (Knowledge-based)';
      if (ta.includes('Hybrid') || ta.includes('Hibrid')) teachingSubTeori = 'Hybrid';
      const matchedPractical = practicalOptions.find(o => ta.includes(o));
      if (matchedPractical) teachingSubPractical = matchedPractical;
    }
    setNewCourse({ ...course, teachingMode, teachingSubTeori, teachingSubPractical });
    setCourseComboInput(course.code && course.name ? `${course.code} - ${course.name}` : '');
    setActiveTab('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold">Loading EduClassify...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* HEADER SECTION */}
      <header className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-3">
              <span className="p-2 bg-indigo-600 rounded-lg text-white font-bold tracking-wider text-xl shadow-inner">EC</span>
              <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
                EduClassify
              </h1>
            </div>
            <p className="text-slate-300 text-xs mt-1">
              Curriculum Classification & Delivery Mode Planner Dashboard (Bilingual MY/EN)
            </p>
          </div>

          {/* Quick Stats Header Bar */}
          <div className="flex space-x-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs">
            <div className="text-center px-2">
              <div className="font-bold text-indigo-300 text-base">{faculties.length}</div>
              <div className="text-slate-300 uppercase tracking-widest text-[9px]">Faculties</div>
            </div>
            <div className="border-r border-white/20 my-1"></div>
            <div className="text-center px-2">
              <div className="font-bold text-indigo-300 text-base">{programs.length}</div>
              <div className="text-slate-300 uppercase tracking-widest text-[9px]">Programs</div>
            </div>
            <div className="border-r border-white/20 my-1"></div>
            <div className="text-center px-2">
              <div className="font-bold text-emerald-400 text-base">{courses.length}</div>
              <div className="text-slate-300 uppercase tracking-widest text-[9px]">Classified Courses</div>
            </div>
          </div>
        </div>
      </header>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 transition-all transform duration-300 animate-bounce ${
          notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-950 text-white border-l-4 border-emerald-500'
        }`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-2 sm:py-0">
            <nav className="flex space-x-1 py-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-3 text-sm font-semibold rounded-lg flex items-center space-x-2 whitespace-nowrap transition-colors ${
                  activeTab === 'dashboard' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={handleStartWizard}
                className={`px-4 py-3 text-sm font-semibold rounded-lg flex items-center space-x-2 whitespace-nowrap transition-colors ${
                  activeTab === 'wizard' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Q&A Wizard Classifier</span>
              </button>

              <button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-3 text-sm font-semibold rounded-lg flex items-center space-x-2 whitespace-nowrap transition-colors ${
                  activeTab === 'courses' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                <span>Manage Courses</span>
              </button>

              <button
                onClick={() => setActiveTab('programs')}
                className={`px-4 py-3 text-sm font-semibold rounded-lg flex items-center space-x-2 whitespace-nowrap transition-colors ${
                  activeTab === 'programs' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                <span>Faculty & Programs</span>
              </button>
            </nav>

            <button
              onClick={handleExportCSV}
              className="mt-2 sm:mt-0 mb-2 sm:mb-0 px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow flex items-center space-x-2 transition-all self-end"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>Export CSV (Excel Table)</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            TAB 1: DASHBOARD OVERVIEW
            ========================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* INSTRUCTIONS / INTRODUCTION */}
            <div className="bg-gradient-to-r from-indigo-50 to-slate-100 rounded-2xl p-6 border border-indigo-100 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <span className="p-1.5 bg-indigo-600 text-white rounded-md text-xs">★</span>
                <span>Program & Course Classification Guide</span>
              </h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                This dashboard lists overall classifications mapped to academic faculties. In accordance with physical requirements and professional bodies, courses are sub-categorized into three core delivery modes: <strong>Mode 1 (Theory)</strong>, <strong>Mode 2 (Practical Physical)</strong>, and <strong>Mode 3 (Theory + Practical)</strong>.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button 
                  onClick={handleStartWizard}
                  className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center space-x-2"
                >
                  <span>Launch Yes/No Q&A Wizard</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
            </div>

            {/* DASHBOARD FILTER BAR */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-1/3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filter Faculty</label>
                <select
                  value={selectedFacultyFilter}
                  onChange={(e) => {
                    setSelectedFacultyFilter(e.target.value);
                    setSelectedProgramFilter('All'); // Reset program filter when faculty changes
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="All">All Faculties / Semua Fakulti</option>
                  {faculties.map(f => (
                    <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-1/3">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filter Program</label>
                <select
                  value={selectedProgramFilter}
                  onChange={(e) => setSelectedProgramFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="All">All Programs / Semua Program</option>
                  {programs
                    .filter(p => selectedFacultyFilter === 'All' || p.facultyId === selectedFacultyFilter)
                    .map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
              </div>

              <div className="w-full md:w-auto flex justify-start">
                <button
                  onClick={() => {
                    setSelectedFacultyFilter('All');
                    setSelectedProgramFilter('All');
                  }}
                  className="text-slate-500 hover:text-slate-800 text-xs font-semibold py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Reset Filter
                </button>
              </div>
            </div>

            {/* STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-slate-100 group-hover:scale-110 transition-transform">
                  <svg className="w-16 h-16 opacity-10 text-slate-900" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.963 7.963 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Active Courses</p>
                <p className="text-4xl font-extrabold text-slate-900 mt-2">{stats.total}</p>
                <div className="text-xs text-slate-500 mt-2">Currently classified matching filters</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-slate-100 group-hover:scale-110 transition-transform">
                  <svg className="w-16 h-16 opacity-10 text-indigo-900" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z"/></svg>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Undergraduate Programs</p>
                <p className="text-4xl font-extrabold text-indigo-600 mt-2">
                  {programs.filter(p => selectedFacultyFilter === 'All' || p.facultyId === selectedFacultyFilter).length}
                </p>
                <div className="text-xs text-slate-500 mt-2">With defined course schedules</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-slate-100 group-hover:scale-110 transition-transform">
                  <svg className="w-16 h-16 opacity-10 text-rose-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.162 10.206a2.25 2.25 0 013.478-2.904l.43.43 1.547-1.546a1 1 0 011.414 0l2.36 2.36a1 1 0 010 1.414L7.546 13.8a1 1 0 01-1.414 0l-2.36-2.361a1 1 0 010-1.414l1.104-1.104-1.285-1.285a2.25 2.25 0 013.478-2.904l1.285 1.285 1.104-1.104a1 1 0 011.414 0l2.361 2.36a1 1 0 010 1.414l-3.847 3.847a1 1 0 01-1.414 0l-2.36-2.36a1 1 0 010-1.414l1.104-1.104-1.104-1.104z" clipRule="evenodd"/></svg>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Professional Adherence</p>
                <p className="text-4xl font-extrabold text-rose-600 mt-2">{stats.professionalBodyPercent}%</p>
                <div className="text-xs text-slate-500 mt-2">{stats.professionalBodyCount} courses strictly governed</div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 text-slate-100 group-hover:scale-110 transition-transform">
                  <svg className="w-16 h-16 opacity-10 text-emerald-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Highly Online / Hybrid</p>
                <p className="text-4xl font-extrabold text-emerald-600 mt-2">
                  {stats.total > 0 ? Math.round((stats.deliveryModes['Mode 1: Theory'] / stats.total) * 100) : 0}%
                </p>
                <div className="text-xs text-slate-500 mt-2">{stats.deliveryModes['Mode 1: Theory']} pure theory courses</div>
              </div>
            </div>

            {/* MAIN CHART SECTION - COURSE TYPES % & DELIVERY MODES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* CATEGORY TYPE PERCENTAGE (THE ESSENCE OF THE REQ) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Course Type Categories (% Jenis Kursus)
                    </h3>
                    <p className="text-xs text-slate-400">Distribution extracted from curriculum specifications</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    Total: {stats.total}
                  </span>
                </div>

                <div className="space-y-5">
                  {Object.entries(stats.courseTypes).map(([type, count]) => {
                    const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    
                    // Distinct colors for types
                    let barColor = "bg-indigo-600";
                    let bgColor = "bg-indigo-50";
                    let textColor = "text-indigo-600 font-semibold";
                    if (type === 'Teras') { barColor = "bg-sky-600"; bgColor = "bg-sky-50"; textColor="text-sky-700 font-bold"; }
                    if (type === 'Elektif Universiti') { barColor = "bg-amber-500"; bgColor = "bg-amber-50"; textColor="text-amber-700 font-semibold"; }
                    if (type === 'MPU (U1-U3)') { barColor = "bg-teal-500"; bgColor = "bg-teal-50"; textColor="text-teal-700 font-semibold"; }
                    if (type === 'MPU (U4)') { barColor = "bg-cyan-500"; bgColor = "bg-cyan-50"; textColor="text-cyan-700 font-semibold"; }
                    if (type === 'Latihan Industri') { barColor = "bg-rose-500"; bgColor = "bg-rose-50"; textColor="text-rose-700 font-semibold"; }
                    if (type === 'Generik/Pengukuhan') { barColor = "bg-emerald-500"; bgColor = "bg-emerald-50"; textColor="text-emerald-700 font-semibold"; }

                    return (
                      <div key={type} className="group">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <div className="flex items-center space-x-2">
                            <span className={`w-3 h-3 rounded-full ${barColor}`}></span>
                            <span className="font-bold text-slate-700">{type}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-400">({count} Kursus)</span>
                            <span className={`px-2 py-0.5 rounded ${bgColor} ${textColor}`}>{percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                          <div
                            className={`h-full ${barColor} rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DELIVERY MODES & PRO BODY GRAPHS */}
              <div className="flex flex-col space-y-6">
                
                {/* DELIVERY MODE DISTRIBUTION */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1">
                  <h3 className="text-base font-extrabold text-slate-900 mb-4">
                    Delivery Mode Mapping (Mod Pelaksanaan)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Mode 1 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Mode 1</span>
                        <h4 className="text-xs font-bold text-slate-700 mt-1">Theory (Online/Hybrid)</h4>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-black text-emerald-600">
                          {stats.deliveryModes['Mode 1: Theory']}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {stats.total > 0 ? Math.round((stats.deliveryModes['Mode 1: Theory'] / stats.total) * 100) : 0}% of total
                        </div>
                      </div>
                    </div>

                    {/* Mode 2 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Mode 2</span>
                        <h4 className="text-xs font-bold text-slate-700 mt-1">Practical (Physical)</h4>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-black text-rose-600">
                          {stats.deliveryModes['Mode 2: Practical']}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {stats.total > 0 ? Math.round((stats.deliveryModes['Mode 2: Practical'] / stats.total) * 100) : 0}% of total
                        </div>
                      </div>
                    </div>

                    {/* Mode 3 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Mode 3</span>
                        <h4 className="text-xs font-bold text-slate-700 mt-1">Theory + Practical</h4>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-black text-amber-600">
                          {stats.deliveryModes['Mode 3: Theory + Practical']}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {stats.total > 0 ? Math.round((stats.deliveryModes['Mode 3: Theory + Practical'] / stats.total) * 100) : 0}% of total
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mode Stacked Visual */}
                  <div className="mt-6">
                    <div className="text-xs font-bold text-slate-500 mb-2">Modes Breakdown Spectrum:</div>
                    <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                      {Object.entries(stats.deliveryModes).map(([mode, count]) => {
                        const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                        let modeColor = "bg-emerald-500";
                        if (mode.includes("Mode 2")) modeColor = "bg-rose-500";
                        if (mode.includes("Mode 3")) modeColor = "bg-amber-400";
                        return (
                          <div
                            key={mode}
                            style={{ width: `${pct}%` }}
                            className={`${modeColor} h-full transition-all duration-300`}
                            title={`${mode}: ${pct.toFixed(1)}%`}
                          ></div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Theory</span>
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-rose-500 mr-1"></span> Practical</span>
                      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-400 mr-1"></span> Mixed (Theory+Practical)</span>
                    </div>
                  </div>
                </div>

                {/* ADHERENCE BY FACULTY */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-4">
                    Course Statistics by Faculty
                  </h3>
                  <div className="max-h-56 overflow-y-auto space-y-3 pr-2">
                    {faculties.map(f => {
                      const facCourses = courses.filter(c => c.facultyId === f.id);
                      const totalC = facCourses.length;
                      const proC = facCourses.filter(c => c.professionalBody === 'Ya').length;
                      const proPercent = totalC > 0 ? Math.round((proC / totalC) * 100) : 0;
                      return (
                        <div key={f.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div className="font-bold text-slate-700">
                            {f.code} <span className="font-normal text-slate-500 text-[11px]">- {f.name.substring(0, 35)}...</span>
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <span className="font-semibold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                              {totalC} Courses
                            </span>
                            <span className="ml-2 font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              {proPercent}% Pro
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* SUMMARY STATS TABLE OF CURRENTLY FILTERED COURSES */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Classified Courses Preview</h3>
                  <p className="text-xs text-slate-400">A look at courses corresponding to selected filters above</p>
                </div>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <span>Edit/Manage Courses ({courses.length})</span>
                  <span>→</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Code & Course</th>
                      <th className="px-6 py-3">Faculty</th>
                      <th className="px-6 py-3">Course Type</th>
                      <th className="px-6 py-3">Professional Standard</th>
                      <th className="px-6 py-3">Delivery Mode Suggestions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                          No courses match your filter criteria. Go to the manager to add more!
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map(c => {
                        const facCode = faculties.find(f => f.id === c.facultyId)?.code || 'N/A';
                        return (
                          <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] mr-1.5">
                                {c.code}
                              </span>
                              <span className="font-bold text-slate-800">{c.name}</span>
                              <div className="text-[10px] text-slate-400 mt-0.5">{c.year}, {c.semester}</div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-600">{facCode}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                c.courseType === 'Teras' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                                c.courseType === 'Elektif Universiti' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                c.courseType === 'MPU (U1-U3)' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                                c.courseType === 'MPU (U4)' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                                c.courseType === 'Latihan Industri' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              }`}>
                                {c.courseType}
                              </span>
                              {c.courseType === 'Latihan Industri' && c.liSubType && (
                                <div className="text-[10px] text-rose-600 font-semibold mt-0.5">{c.liSubType}</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-semibold px-2 py-0.5 rounded ${
                                c.professionalBody === 'Ya' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {c.professionalBody === 'Ya' ? 'Governed (Ya)' : 'No (Tidak)'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-700">{c.deliveryMode}</div>
                              <div className="text-[10px] text-slate-500">
                                Teach: {c.teachingActivity} | Assess: {c.assessmentActivity}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: YES/NO Q&A CLASSIFICATION WIZARD
            ========================================== */}
        {activeTab === 'wizard' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
            {/* Wizard Header Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white text-center">
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full uppercase font-bold tracking-widest text-indigo-100">
                Step {wizardStep} of 5
              </span>
              <h2 className="text-xl font-extrabold mt-2">Course Delivery & Mode Classifier</h2>
              <p className="text-indigo-200 text-xs mt-1">
                Answer these questions to automatically determine the course delivery classification.
              </p>
            </div>

            {/* STEP PROGRESS TRACKER BAR */}
            <div className="flex bg-slate-100 h-1">
              {[1, 2, 3, 4, 5].map(stepNum => (
                <div
                  key={stepNum}
                  className={`h-full flex-1 transition-all ${
                    stepNum <= wizardStep ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                ></div>
              ))}
            </div>

            {/* WIZARD CARD BODY */}
            <div className="p-8">

              {/* STEP 1: BASIC COURSE INFO */}
              {wizardStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800">1. Basic Information / Maklumat Asas</h3>
                    <p className="text-slate-400 text-xs mt-1">Please configure where this course sits in the academic curriculum.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Faculty</label>
                      <select
                        value={wizardData.facultyId}
                        onChange={(e) => handleWizardChange('facultyId', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {faculties.map(f => (
                          <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Academic Program</label>
                      <select
                        value={wizardData.programId}
                        onChange={(e) => handleWizardChange('programId', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {programs
                          .filter(p => p.facultyId === wizardData.facultyId)
                          .map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                      </select>
                    </div>
                  </div>

                  {/* ── Wizard course search combobox ── */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Search &amp; Select Course
                      <span className="ml-2 font-normal normal-case text-slate-400 text-[10px]">or fill Code &amp; Name below manually</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Type course code or name to search (e.g. 'KMY' or 'Psychology')…"
                        value={wizardComboInput}
                        onChange={(e) => { setWizardComboInput(e.target.value); setWizardComboOpen(true); }}
                        onFocus={() => { if (wizardComboInput.trim()) setWizardComboOpen(true); }}
                        onBlur={() => setTimeout(() => setWizardComboOpen(false), 150)}
                        className="w-full bg-indigo-50 border border-indigo-200 text-slate-800 py-2.5 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs"
                      />
                      {wizardComboInput && (
                        <button
                          type="button"
                          onMouseDown={() => { setWizardComboInput(''); setWizardComboOpen(false); }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold text-base leading-none"
                        >×</button>
                      )}
                      {wizardComboOpen && wizardComboResults.length > 0 && (
                        <div className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto mt-1">
                          {wizardComboResults.map(c => (
                            <button
                              key={c.code}
                              type="button"
                              onMouseDown={() => {
                                handleWizardChange('code', c.code);
                                handleWizardChange('name', c.name);
                                setWizardComboInput(`${c.code} - ${c.name}`);
                                setWizardComboOpen(false);
                              }}
                              className="w-full text-left px-3 py-2.5 hover:bg-indigo-50 border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                            >
                              <span className="font-mono font-bold text-indigo-700 text-[11px] shrink-0 w-24 truncate">{c.code}</span>
                              <span className="text-slate-600 text-[11px] truncate">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {wizardComboOpen && wizardComboInput.trim() && wizardComboResults.length === 0 && (
                        <div className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 px-3 py-3 text-[11px] text-slate-400 italic">
                          No matches — enter Code and Name manually in the fields below.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course Code</label>
                      <input
                        type="text"
                        placeholder="e.g., KMY1023"
                        value={wizardData.code}
                        onChange={(e) => handleWizardChange('code', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Fundamentals of Software Engineering"
                        value={wizardData.name}
                        onChange={(e) => handleWizardChange('name', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course Type</label>
                      <select
                        value={wizardData.courseType}
                        onChange={(e) => { handleWizardChange('courseType', e.target.value); handleWizardChange('liSubType', ''); }}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700"
                      >
                        <option value="Teras">Teras (Core)</option>
                        <option value="Elektif Universiti">Elektif Universiti (University Elective)</option>
                        <option value="MPU (U1-U3)">MPU (U1-U3)</option>
                        <option value="MPU (U4)">MPU (U4)</option>
                        <option value="Latihan Industri">Latihan Industri</option>
                        <option value="Generik/Pengukuhan">Generik/Pengukuhan</option>
                      </select>
                      {wizardData.courseType === 'Latihan Industri' && (
                        <div className="mt-2">
                          <label className="block text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">Latihan Industri Type</label>
                          <select
                            value={wizardData.liSubType || ''}
                            onChange={(e) => handleWizardChange('liSubType', e.target.value)}
                            className="w-full bg-rose-50 border border-rose-200 text-rose-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400 text-xs font-semibold"
                          >
                            <option value="">-- Pilih Jenis --</option>
                            <option value="Di Agensi">Di Agensi</option>
                            <option value="Online">Online</option>
                            <option value="Hibrid (Beberapa hari di Agensi)">Hibrid (Beberapa hari di Agensi)</option>
                            <option value="Di Kampus">Di Kampus</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Year / Tahun</label>
                      <select
                        value={wizardData.year}
                        onChange={(e) => handleWizardChange('year', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Tahun 1">Tahun 1</option>
                        <option value="Tahun 2">Tahun 2</option>
                        <option value="Tahun 3">Tahun 3</option>
                        <option value="Tahun 4">Tahun 4</option>
                        <option value="Tahun 5">Tahun 5</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Semester</label>
                      <select
                        value={wizardData.semester}
                        onChange={(e) => handleWizardChange('semester', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 3">Semester 3</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PROFESSIONAL BODY CONSTRAINT */}
              {wizardStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="p-3 bg-rose-50 text-rose-600 rounded-full inline-block mb-3">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800">2. Professional Body Requirements</h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Are there specific requirements or guidelines mandated by an external Professional Body (e.g., Board of Engineers, Malaysian Medical Council, etc.)?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                      onClick={() => handleWizardChange('professionalBody', 'Ya')}
                      className={`p-6 rounded-2xl border-2 text-center transition-all ${
                        wizardData.professionalBody === 'Ya'
                        ? 'bg-rose-50 border-rose-500 text-rose-900 shadow'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold text-lg">Ya / Yes</div>
                      <div className="text-[10px] text-slate-400 mt-2">Subject to physical assessments & in-person teaching guidelines</div>
                    </button>

                    <button
                      onClick={() => handleWizardChange('professionalBody', 'Tidak')}
                      className={`p-6 rounded-2xl border-2 text-center transition-all ${
                        wizardData.professionalBody === 'Tidak'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold text-lg">Tidak / No</div>
                      <div className="text-[10px] text-slate-400 mt-2">Normal standard institution guidelines apply</div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PRACTICAL & LAB REQUIREMENT */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="p-3 bg-amber-50 text-amber-500 rounded-full inline-block mb-3">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800">3. Hands-on / Practical Requirements</h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Does this course require laboratory experiments, computer setups, clinical facilities, art studios, or designated workshops?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                      onClick={() => handleWizardChange('hasPractical', 'Yes')}
                      className={`p-6 rounded-2xl border-2 text-center transition-all ${
                        wizardData.hasPractical === 'Yes'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 shadow'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold text-lg">Yes / Ya</div>
                      <div className="text-[10px] text-slate-400 mt-2">Requires lab or workshop facility (Makmal Sains/Komputer/Studio/Clinical/Medical Attachment)</div>
                    </button>

                    <button
                      onClick={() => {
                        handleWizardChange('hasPractical', 'No');
                        handleWizardChange('hasTheory', 'Yes'); // If no practical, must be pure theory
                      }}
                      className={`p-6 rounded-2xl border-2 text-center transition-all ${
                        wizardData.hasPractical === 'No'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold text-lg">No / Tidak</div>
                      <div className="text-[10px] text-slate-400 mt-2">Mainly cognitive lectures, discussions, and standard presentations</div>
                    </button>
                  </div>

                  {wizardData.hasPractical === 'Yes' && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <label className="block text-xs font-bold text-slate-500 mb-2">Select Practical Location / Environment:</label>
                      <select
                        value={wizardData.practicalType}
                        onChange={(e) => handleWizardChange('practicalType', e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 py-1.5 px-3 rounded-lg focus:outline-none"
                      >
                        <option value="Makmal Sains">Makmal Sains (Science Lab)</option>
                        <option value="Makmal Komputer">Makmal Komputer (Computer Lab)</option>
                        <option value="Studio">Studio (Design/Art Studio)</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Clinical/Medical Attachment">Clinical/Medical Attachment</option>
                        <option value="Makmal Kaunseling/Psikologi">Makmal Kaunseling/Psikologi</option>
                        <option value="Kerja Lapangan">Kerja Lapangan</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: THEORY EXPLANATION */}
              {wizardStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="p-3 bg-emerald-50 text-emerald-500 rounded-full inline-block mb-3">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800">4. Lecture / Theoretical Content</h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Does this course include theoretical instruction or conceptual lectures in addition to any practical sessions?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                      onClick={() => handleWizardChange('hasTheory', 'Yes')}
                      className={`p-6 rounded-2xl border-2 text-center transition-all ${
                        wizardData.hasTheory === 'Yes'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold text-lg">Yes / Ya</div>
                      <div className="text-[10px] text-slate-400 mt-2">Has dedicated lecture hours for theory or slides delivery</div>
                    </button>

                    <button
                      onClick={() => {
                        if (wizardData.hasPractical === 'No') {
                          triggerNotification("A course must have at least theory or practical component. Defaulting to Yes for theory.", "error");
                        } else {
                          handleWizardChange('hasTheory', 'No');
                        }
                      }}
                      className={`p-6 rounded-2xl border-2 text-center transition-all ${
                        wizardData.hasTheory === 'No'
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold text-lg">No / Tidak</div>
                      <div className="text-[10px] text-slate-400 mt-2">100% lab work, project work, clinical round, or field study</div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: PROPOSAL / FINAL REVIEW */}
              {wizardStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800">5. Recommended Classification</h3>
                    <p className="text-slate-400 text-xs mt-1">Based on your Q&A answers, the following curriculum classification is proposed:</p>
                  </div>

                  <div className="bg-indigo-900/10 p-6 rounded-2xl border border-indigo-500/15 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-indigo-100/20 text-xs">
                      <span className="font-bold text-slate-500">Course Code & Name</span>
                      <span className="font-black text-indigo-800 font-mono bg-white px-2 py-0.5 rounded shadow-sm">
                        {wizardData.code || 'COURS-XYZ'}: {wizardData.name || 'Untitled Course'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-indigo-100/20 text-xs">
                      <span className="font-bold text-slate-500">Curriculum Category</span>
                      <span className="font-bold text-slate-800">{wizardData.courseType}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-indigo-100/20 text-xs">
                      <span className="font-bold text-slate-500">Professional Body Restriction?</span>
                      <span className="font-bold text-slate-800">{wizardData.professionalBody}</span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b border-indigo-100/20 text-xs">
                      <span className="font-bold text-indigo-700">SUGGESTED DELIVERY MODE</span>
                      <span className="font-black text-indigo-800 text-sm">{wizardData.suggestedMode || 'Mode 1: Theory'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 bg-white rounded-xl border border-indigo-50">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Teaching Activity</span>
                        <span className="font-extrabold text-xs text-slate-800">{wizardData.teachingActivity}</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-indigo-50">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Assessment Activity</span>
                        <span className="font-extrabold text-xs text-slate-800">{wizardData.assessmentActivity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800">
                    <span className="font-bold">✓ Complete:</span> Save this classification. It will update the overall dashboard statistics instantly.
                  </div>
                </div>
              )}

              {/* NAVIGATION BUTTONS */}
              <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
                {wizardStep > 1 ? (
                  <button
                    onClick={() => setWizardStep(prev => prev - 1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs transition-all"
                  >
                    ← Back
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs transition-all"
                  >
                    Cancel
                  </button>
                )}

                {wizardStep < 5 ? (
                  <button
                    onClick={() => {
                      if (wizardStep === 1 && (!wizardData.code || !wizardData.name)) {
                        triggerNotification("Please fill in the Course Code and Name", "error");
                        return;
                      }
                      // Skip to correct suggestions calculations
                      if (wizardStep === 4) {
                        const { mode, teach, assess } = computeSuggestions(wizardData);
                        setWizardData(prev => ({
                          ...prev,
                          suggestedMode: mode,
                          teachingActivity: teach,
                          assessmentActivity: assess
                        }));
                      }
                      setWizardStep(prev => prev + 1);
                    }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    onClick={saveWizardClassification}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
                  >
                    Confirm & Save Classifications
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: MANAGE COURSES
            ========================================== */}
        {activeTab === 'courses' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* MANUALLY CLASSIFY / EDIT COURSE FORM */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-900 text-white">
                <h3 className="text-base font-bold">
                  {editingCourseId ? 'Edit Course Classification' : 'Add Course Manually'}
                </h3>
                <p className="text-slate-300 text-xs mt-1">
                  Fill in details below to categorize a single course manually.
                </p>
              </div>

              <form onSubmit={handleAddCourseManual} className="p-6 space-y-4">

                {/* ── Course search combobox ── */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Search &amp; Select Course
                    <span className="ml-2 font-normal normal-case text-slate-400 text-[10px]">or fill Code &amp; Name fields manually below</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type course code or name to search (e.g. 'KMY' or 'Psychology')…"
                      value={courseComboInput}
                      onChange={(e) => { setCourseComboInput(e.target.value); setCourseComboOpen(true); }}
                      onFocus={() => { if (courseComboInput.trim()) setCourseComboOpen(true); }}
                      onBlur={() => setTimeout(() => setCourseComboOpen(false), 150)}
                      className="w-full bg-indigo-50 border border-indigo-200 text-slate-800 py-2.5 px-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs"
                    />
                    {courseComboInput && (
                      <button
                        type="button"
                        onMouseDown={() => { setCourseComboInput(''); setCourseComboOpen(false); }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-bold text-base leading-none"
                      >×</button>
                    )}
                    {courseComboOpen && courseComboResults.length > 0 && (
                      <div className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto mt-1">
                        {courseComboResults.map(c => (
                          <button
                            key={c.code}
                            type="button"
                            onMouseDown={() => {
                              setNewCourse(p => ({ ...p, code: c.code, name: c.name }));
                              setCourseComboInput(`${c.code} - ${c.name}`);
                              setCourseComboOpen(false);
                            }}
                            className="w-full text-left px-3 py-2.5 hover:bg-indigo-50 border-b border-slate-100 last:border-b-0 flex items-center gap-3"
                          >
                            <span className="font-mono font-bold text-indigo-700 text-[11px] shrink-0 w-24 truncate">{c.code}</span>
                            <span className="text-slate-600 text-[11px] truncate">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {courseComboOpen && courseComboInput.trim() && courseComboResults.length === 0 && (
                      <div className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl mt-1 px-3 py-3 text-[11px] text-slate-400 italic">
                        No matches — enter Code and Name manually in the fields below.
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Faculty</label>
                    <select
                      value={newCourse.facultyId}
                      onChange={(e) => {
                        const val = e.target.value;
                        const defaultProg = programs.find(p => p.facultyId === val)?.id || '';
                        setNewCourse(p => ({ ...p, facultyId: val, programId: defaultProg }));
                      }}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                      required
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map(f => (
                        <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Academic Program</label>
                    <select
                      value={newCourse.programId}
                      onChange={(e) => setNewCourse(p => ({ ...p, programId: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                      required
                    >
                      <option value="">Select Program</option>
                      {programs
                        .filter(p => p.facultyId === newCourse.facultyId)
                        .map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Code</label>
                    <input
                      type="text"
                      placeholder="e.g. KMY1023"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse(p => ({ ...p, code: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Science Ethics"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Type (Jenis Kursus)</label>
                    <select
                      value={newCourse.courseType}
                      onChange={(e) => setNewCourse(p => ({ ...p, courseType: e.target.value, liSubType: '' }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                    >
                      <option value="Teras">Teras (Core)</option>
                      <option value="Elektif Universiti">Elektif Universiti (University Elective)</option>
                      <option value="MPU (U1-U3)">MPU (U1-U3)</option>
                      <option value="MPU (U4)">MPU (U4)</option>
                      <option value="Latihan Industri">Latihan Industri</option>
                      <option value="Generik/Pengukuhan">Generik/Pengukuhan</option>
                    </select>
                    {newCourse.courseType === 'Latihan Industri' && (
                      <div className="mt-2">
                        <label className="block text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">Latihan Industri Type</label>
                        <select
                          value={newCourse.liSubType || ''}
                          onChange={(e) => setNewCourse(p => ({ ...p, liSubType: e.target.value }))}
                          className="w-full bg-rose-50 border border-rose-200 text-rose-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-400 text-xs font-semibold"
                        >
                          <option value="">-- Pilih Jenis --</option>
                          <option value="Di Agensi">Di Agensi</option>
                          <option value="Online">Online</option>
                          <option value="Hibrid (Beberapa hari di Agensi)">Hibrid (Beberapa hari di Agensi)</option>
                          <option value="Di Kampus">Di Kampus</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Professional Body Standard</label>
                    <select
                      value={newCourse.professionalBody}
                      onChange={(e) => setNewCourse(p => ({ ...p, professionalBody: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                    >
                      <option value="Ya">Ya (Yes)</option>
                      <option value="Tidak">Tidak (No)</option>
                    </select>
                  </div>

                  {!(newCourse.courseType === 'Latihan Industri' && newCourse.liSubType === 'Online') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teaching Activity</label>
                    <select
                      value={newCourse.teachingMode || 'Theory (Knowledge-based)'}
                      onChange={(e) => setNewCourse(p => ({ ...p, teachingMode: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-semibold"
                    >
                      <option value="Theory (Knowledge-based)">Theory (Knowledge-based)</option>
                      <option value="Practical (Performance-based)">Practical (Performance-based)</option>
                      <option value="Mix (Theory & Practical)">Mix (Theory &amp; Practical)</option>
                    </select>
                  </div>
                  )}
                </div>

                {/* CASCADING SUB-SELECTS FOR TEACHING ACTIVITY */}
                {!(newCourse.courseType === 'Latihan Industri' && newCourse.liSubType === 'Online') && (newCourse.teachingMode === 'Theory (Knowledge-based)' || newCourse.teachingMode === 'Mix (Theory & Practical)' || !newCourse.teachingMode) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="md:col-span-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Theory Sub-options</div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Delivery Method</label>
                      <div className="flex gap-3">
                        {['Online', 'Hybrid'].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setNewCourse(p => ({ ...p, teachingSubTeori: opt }))}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                              (newCourse.teachingSubTeori || 'Online') === opt
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!(newCourse.courseType === 'Latihan Industri' && newCourse.liSubType === 'Online') && (newCourse.teachingMode === 'Practical (Performance-based)' || newCourse.teachingMode === 'Mix (Theory & Practical)') && (
                  <div className="grid grid-cols-1 gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Practical Sub-options</div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Practical Location / Environment</label>
                      <div className="flex flex-wrap gap-3">
                        {['Makmal Sains', 'Makmal Komputer', 'Studio', 'Workshop', 'Clinical/Medical Attachment', 'Makmal Kaunseling/Psikologi', 'Kerja Lapangan'].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setNewCourse(p => ({ ...p, teachingSubPractical: opt }))}
                            className={`px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                              (newCourse.teachingSubPractical || 'Makmal Komputer') === opt
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assessment</label>
                    <select
                      value={newCourse.assessmentActivity}
                      onChange={(e) => setNewCourse(p => ({ ...p, assessmentActivity: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                    >
                      <option value="Online Penuh">Online Penuh</option>
                      <option value="Hibrid">Hibrid</option>
                      <option value="Fizikal (Keperluan amali)">Fizikal (Keperluan amali)</option>
                      <option value="Fizikal (Sekatan Badan Professional)">Fizikal (Sekatan Badan Professional)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Year / Tahun</label>
                    <select
                      value={newCourse.year}
                      onChange={(e) => setNewCourse(p => ({ ...p, year: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                    >
                      <option value="Tahun 1">Tahun 1</option>
                      <option value="Tahun 2">Tahun 2</option>
                      <option value="Tahun 3">Tahun 3</option>
                      <option value="Tahun 4">Tahun 4</option>
                      <option value="Tahun 5">Tahun 5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Semester</label>
                    <select
                      value={newCourse.semester}
                      onChange={(e) => setNewCourse(p => ({ ...p, semester: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Semester 3">Semester 3</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  {editingCourseId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCourseId(null);
                        setNewCourse({
                          facultyId: '',
                          programId: '',
                          code: '',
                          name: '',
                          courseType: 'Teras',
                          professionalBody: 'Tidak',
                          deliveryMode: 'Mode 1: Theory',
                          teachingActivity: 'Online Penuh',
                          assessmentActivity: 'Online Penuh',
                          year: 'Tahun 1',
                          semester: 'Semester 1'
                        });
                      }}
                      className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-lg text-xs hover:bg-slate-50"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow"
                  >
                    {editingCourseId ? 'Save Changes' : 'Add Course'}
                  </button>
                </div>
              </form>
            </div>

            {/* FULL COURSE DATABASE TABLE */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0 mb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Total Classified Database</h3>
                    <p className="text-xs text-slate-400">View and manage all designated course configurations.</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    {filteredCoursesTable.length} of {courses.length} courses
                  </span>
                </div>
                {/* SEARCH & FILTER BAR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search Code & Name</label>
                    <input
                      type="text"
                      placeholder="e.g. KMY1023 or Software..."
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Scope</label>
                    <select
                      value={courseFilterFaculty}
                      onChange={(e) => setCourseFilterFaculty(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    >
                      <option value="All">All Faculties</option>
                      {faculties.map(f => (
                        <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category Type</label>
                    <select
                      value={courseFilterType}
                      onChange={(e) => setCourseFilterType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                    >
                      <option value="All">All Types</option>
                      {['Teras', 'Elektif Universiti', 'MPU (U1-U3)', 'MPU (U4)', 'Latihan Industri', 'Generik/Pengukuhan'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pro Body</label>
                    <div className="flex gap-2">
                      <select
                        value={courseFilterProBody}
                        onChange={(e) => setCourseFilterProBody(e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                      >
                        <option value="All">All</option>
                        <option value="Ya">Ya (Yes)</option>
                        <option value="Tidak">Tidak (No)</option>
                      </select>
                      <button
                        onClick={() => { setCourseSearch(''); setCourseFilterFaculty('All'); setCourseFilterType('All'); setCourseFilterProBody('All'); }}
                        className="px-3 py-2 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-500 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Course Code & Name</th>
                      <th className="px-6 py-3">Academic Scope</th>
                      <th className="px-6 py-3">Category Type</th>
                      <th className="px-6 py-3">Pro Body</th>
                      <th className="px-6 py-3">Aktiviti Pengajaran</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCoursesTable.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                          No courses match your filter criteria.
                        </td>
                      </tr>
                    ) : filteredCoursesTable.map(c => {
                      const fac = faculties.find(f => f.id === c.facultyId);
                      const prog = programs.find(p => p.id === c.programId);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-extrabold text-indigo-700 bg-indigo-50 inline-block px-1.5 py-0.5 rounded text-[10px] mb-1 font-mono">
                              {c.code}
                            </div>
                            <div className="font-bold text-slate-800 text-sm">{c.name}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{c.year} • {c.semester}</div>
                          </td>
                          <td className="px-6 py-4 space-y-1">
                            <span className="font-black text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{fac?.code}</span>
                            <div className="text-[11px] font-medium text-slate-500 max-w-xs truncate" title={prog?.name}>
                              {prog?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${
                              c.courseType === 'Teras' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                              c.courseType === 'Elektif Universiti' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                              c.courseType === 'MPU (U1-U3)' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                              c.courseType === 'MPU (U4)' ? 'bg-cyan-50 text-cyan-700 border-cyan-100' :
                              c.courseType === 'Latihan Industri' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                              'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              {c.courseType}
                            </span>
                            {c.courseType === 'Latihan Industri' && c.liSubType && (
                              <div className="text-[10px] text-rose-600 font-semibold mt-1">{c.liSubType}</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded font-semibold ${
                              c.professionalBody === 'Ya' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {c.professionalBody}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-700 text-[11px]">{c.teachingActivity}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Assessment: {c.assessmentActivity}</div>
                          </td>
                          <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleEditCourse(c)}
                              className="px-2.5 py-1 text-[10px] bg-slate-100 text-slate-700 font-bold rounded hover:bg-indigo-600 hover:text-white transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(c.id)}
                              className="px-2.5 py-1 text-[10px] bg-rose-50 text-rose-600 font-bold rounded hover:bg-rose-600 hover:text-white transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            TAB 4: FACULTIES & PROGRAMS MANAGER
            ========================================== */}
        {activeTab === 'programs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
            
            {/* LEFT COLUMN: MANAGING FACULTIES */}
            <div className="space-y-6">
              {/* ADD FACULTY FORM */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 mb-4">Add Faculty / Fakulti Baru</h3>
                <form onSubmit={handleAddFaculty} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Code</label>
                      <input
                        type="text"
                        placeholder="e.g. FSKTM"
                        value={newFaculty.code}
                        onChange={(e) => setNewFaculty(p => ({ ...p, code: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-bold"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Faculty Name</label>
                      <input
                        type="text"
                        placeholder="Faculty of Computer Science..."
                        value={newFaculty.name}
                        onChange={(e) => setNewFaculty(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow"
                    >
                      Add Faculty
                    </button>
                  </div>
                </form>
              </div>

              {/* LIST OF CURRENT FACULTIES */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900">Current Faculties</h3>
                </div>
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {faculties.map(f => {
                    const progCount = programs.filter(p => p.facultyId === f.id).length;
                    const isEditing = editingFacultyId === f.id;
                    return (
                      <div key={f.id} className="p-4 hover:bg-slate-50 transition-colors">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={editFacultyData.code}
                                onChange={(e) => setEditFacultyData(p => ({ ...p, code: e.target.value }))}
                                className="col-span-1 bg-white border border-indigo-300 text-slate-800 py-1.5 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-bold uppercase"
                                placeholder="Code"
                              />
                              <input
                                type="text"
                                value={editFacultyData.name}
                                onChange={(e) => setEditFacultyData(p => ({ ...p, name: e.target.value }))}
                                className="col-span-2 bg-white border border-indigo-300 text-slate-800 py-1.5 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                                placeholder="Faculty Name"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleSaveFaculty(f.id)}
                                className="px-3 py-1 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingFacultyId(null)}
                                className="px-3 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs mr-2">{f.code}</span>
                              <span className="font-bold text-slate-800 text-xs">{f.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">{progCount} programs</span>
                              <button
                                onClick={() => handleStartEditFaculty(f)}
                                className="px-2.5 py-1 text-[10px] bg-slate-100 text-slate-700 font-bold rounded hover:bg-indigo-600 hover:text-white transition-colors"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: MANAGING PROGRAMS */}
            <div className="space-y-6">
              {/* ADD PROGRAM FORM */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 mb-4">Add Program / Program Baru</h3>
                <form onSubmit={handleAddProgram} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Under Faculty</label>
                    <select
                      value={newProgram.facultyId}
                      onChange={(e) => setNewProgram(p => ({ ...p, facultyId: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                      required
                    >
                      <option value="">Select Faculty</option>
                      {faculties.map(f => (
                        <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Program Name (Nama Program)</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarjana Muda Kejuruteraan Perisian dengan Kepujian"
                      value={newProgram.name}
                      onChange={(e) => setNewProgram(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow"
                    >
                      Add Program
                    </button>
                  </div>
                </form>
              </div>

              {/* LIST OF CURRENT PROGRAMS */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900">Current Programs</h3>
                </div>
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {programs.map(p => {
                    const fCode = faculties.find(f => f.id === p.facultyId)?.code || 'N/A';
                    const cCount = courses.filter(c => c.programId === p.id).length;
                    const isEditing = editingProgramId === p.id;
                    return (
                      <div key={p.id} className="p-4 hover:bg-slate-50 transition-colors">
                        {isEditing ? (
                          <div className="space-y-2">
                            <select
                              value={editProgramData.facultyId}
                              onChange={(e) => setEditProgramData(prev => ({ ...prev, facultyId: e.target.value }))}
                              className="w-full bg-white border border-indigo-300 text-slate-800 py-1.5 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                            >
                              {faculties.map(f => (
                                <option key={f.id} value={f.id}>{f.code} - {f.name}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={editProgramData.name}
                              onChange={(e) => setEditProgramData(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full bg-white border border-indigo-300 text-slate-800 py-1.5 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                              placeholder="Program Name"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleSaveProgram(p.id)}
                                className="px-3 py-1 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                              >Save</button>
                              <button
                                onClick={() => setEditingProgramId(null)}
                                className="px-3 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                              >Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0">
                            <div>
                              <div className="font-extrabold text-slate-800 text-xs">{p.name}</div>
                              <span className="text-[10px] text-slate-400">Faculty Code: <span className="font-bold text-indigo-700">{fCode}</span></span>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{cCount} courses</span>
                              <button
                                onClick={() => handleStartEditProgram(p)}
                                className="px-2.5 py-1 text-[10px] bg-slate-100 text-slate-700 font-bold rounded hover:bg-indigo-600 hover:text-white transition-colors"
                              >Edit</button>
                              <button
                                onClick={() => handleDeleteProgram(p.id)}
                                className="px-2.5 py-1 text-[10px] bg-slate-100 text-slate-700 font-bold rounded hover:bg-red-600 hover:text-white transition-colors"
                              >Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-16 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Academic Classification System. Prepared in accordance with University Program & Course standards.</p>
          <p className="mt-2 text-slate-500">Fully compliant with bilingual specifications for Course Types and Delivery Modes.</p>
        </div>
      </footer>
    </div>
  );
}