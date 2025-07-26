import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '../components/OptimizedImage';
import '../Home.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, type: 'spring', stiffness: 60 }
  })
};

const ResumeScan = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile.type === 'application/pdf' || droppedFile.type === 'application/msword' || 
        droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setFile(droppedFile);
    } else {
      alert('Please upload a PDF or Word document');
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysisResult({
        score: 85,
        strengths: [
          'Strong technical skills section',
          'Clear work experience timeline',
          'Good use of action verbs'
        ],
        suggestions: [
          'Add more quantifiable achievements',
          'Include relevant certifications',
          'Consider adding a skills matrix'
        ],
        keywords: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'AWS', 'REST API']
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Scanner</h1>
          <p className="text-xl text-gray-600">Upload your resume to get instant feedback and optimization tips</p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            {!analysisResult ? (
              <div 
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-lg font-medium text-gray-900">
                      {file ? file.name : 'Drag and drop your resume here'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {file ? 'Ready to analyze' : 'or click to browse files'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Supported formats: PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>
                  
                  <div>
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                      {file ? 'Change File' : 'Select File'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-xl font-bold">{analysisResult.score}%</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-green-800">Resume Score: {analysisResult.score}/100</h3>
                      <p className="text-sm text-green-700">
                        {analysisResult.score > 80 ? 'Great job! Your resume is well-optimized.' : 
                         analysisResult.score > 60 ? 'Good start! There are some areas for improvement.' : 
                         'Consider revising your resume to improve its effectiveness.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-3">✅ Strengths</h3>
                    <ul className="space-y-2">
                      {analysisResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50 p-5 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-3">💡 Suggestions</h3>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <h3 className="font-medium text-gray-900 mb-3">🔑 Keywords Found</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords.map((keyword, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              {analysisResult && (
                <button
                  onClick={() => {
                    setAnalysisResult(null);
                    setFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Scan Another Resume
                </button>
              )}
              
              <button
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!file || isAnalyzing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
              >
                {isAnalyzing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : 'Analyze Resume'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScan;
