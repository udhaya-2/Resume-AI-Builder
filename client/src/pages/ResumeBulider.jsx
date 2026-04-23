import React, { useEffect, useState } from "react";
import { dummyResumeData } from "../assets/assets";
import { useParams, Link, data } from "react-router-dom"
import PersonalInfoForm from "../compounents/Personalinform";
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from "lucide-react";
import ResumePreview from "../compounents/ResumePerview";
import TemplateSelector from "../compounents/TemplateSelector";
import ColorPicker from "../compounents/ColorPicker";
import ProfessionalSummaryForm from "../compounents/ProfessionalSummary";
import ExperienceForm from "../compounents/ExperienceForm"
import EducationForm from "../compounents/EducationForm"
import ProjectFrom from "../compounents/ProjectFrom";
import SkillsForm from "../compounents/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api"
import toast from "react-hot-toast"
const ResumeBulider = () => {
  const { resumeId } = useParams()
  const { token } = useSelector(state => state.auth)
  const [resumeData, setResumeData] = useState(
    {
      _id: '',
      title: '',
      personal_info: {},
      professional_summary: "",
      experience: [],
      education: [],
      project: [],
      template: "classic",
      accent_colo: "#3B82F6",
      public: false,
    }
  )
  const loadExistingResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } })
      if (data.resume) {
        setResumeData(data.resume)
        document.title = data.resume.title;
      }
    } catch (error) {
      console.log(error.message);

    }


  }

  const [activeSectionIndex, setactiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const sections = [
    { id: "personal", name: "Personal Info ", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Project", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },

  ]
  const activeSection = sections[activeSectionIndex]
  useEffect(() => {
    loadExistingResume()
  }, [])
  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append("resumeId", resumeId)
      formData.append("resumeData", JSON.stringify({ public: !resumeData.public }))
      const { data } = await api.put('/api/resumes/update' ,formData,{ headers: { Authorization: token } })
      setResumeData({...resumeData, public:!resumeData.public})
      toast.success(data.message)
    } catch (error) {
          console.error("Error saving resume" , error);
    }
    setResumeData({ ...resumeData, public: !resumeData.public })
  }
  const handleShare = async () => {
    try {
      const frontendUrl = window.location.href.split('/app')[0]
      const resumeUrl = frontendUrl + '/preview/' + resumeId;
      await navigator.share({
        title: "My Resume",
        text: "Check my resume",
        url: resumeUrl,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const downloadResume = () => {
    window.print()
  }
  const saveResume = async () => {
   try {
      const updatedResumeData = structuredClone(resumeData)
     if(typeof resumeData.personal_info.image === 'object'){
      delete updatedResumeData.personal_info.image
     }
     const formData = new FormData()
     formData.append("resumeId", resumeId)
     formData.append("resumeData", JSON.stringify(updatedResumeData))
     removeBackground && formData.append("resumeBackground","yes");
     typeof resumeData.personal_info.image === 'object' && formData.append("image",
      resumeData.personal_info.image
     )
     const {data} = await api.put('/api/resumes/update', formData ,{headers:{Authorization:token}})
     setResumeData(data.resume)
     toast.success(data.message)
   } catch (error) {
               console.error("Error saving resume" , error);

   }
  }   
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to={'/app'} className="inline-flex gap-2 items-center text-slate-500 
        hover:text-slate-700 transition-all">
          <ArrowLeftIcon className="size-4" />Back to Dashboard
        </Link>
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid lg:grid-cols-12 gap-8">
            {/*Left Panel - form  */}
            <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
                <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
                <hr className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none
                transition-all duration-200" style={{ width: `${activeSectionIndex * 600 / (sections.length - 1)}px` }} />
                {/* Section Navigation */}
                <div className="flex justify-between mb-6 border-b border-gray-300 py-1 items-center">
                  <div className="flex items-center gap-2">
                    <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                    <ColorPicker selectedColor={resumeData.accent_colo} onChange={(color) => setResumeData(prev => ({ ...prev, accent_colo: color }))} />
                  </div>
                  <div className="flex items-center">
                    {
                      activeSectionIndex !== 0 && (
                        <button onClick={() => setactiveSectionIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
                          className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600
                    hover:bg-gray-50 transition-all" disabled={activeSectionIndex === 0}>
                          <ChevronLeft className="size-4" /> Previous
                        </button>
                      )}
                    <button onClick={() => setactiveSectionIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1))}
                      className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600
                    hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`}
                      disabled={activeSectionIndex === sections.length - 1}>
                      Next <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
                {/* Form Content */}
                <div className="space-y-6">
                  {
                    activeSection.id === "personal" && (
                      < PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))}
                        removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                    )
                  }
                  {
                    activeSection.id === "summary" && (
                      <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))} setResumeData={setResumeData} />

                    )}
                  {
                    activeSection.id === "experience" && (
                      <ExperienceForm data={resumeData.experience} onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))} />

                    )
                  }
                  {
                    activeSection.id === "education" && (
                      <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))}
                      />
                    )
                  }
                  {
                    activeSection.id === "projects" && (
                      <ProjectFrom data={resumeData.project} onChange={(data) => setResumeData(prev => ({ ...prev, project: data }))}
                      />
                    )
                  }
                  {
                    activeSection.id === "skills" && (
                      <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))}
                      />
                    )
                  }
                </div>
                <button onClick={()=>{toast.promise(saveResume ,{loading :'Saving...'})}} className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm ">
                  Save Change
                </button>
              </div>
            </div>
            {/* Right Panel - Preview */}
            <div className="lg:col-span-7 max-lg:mt-6">
              <div className="relative w-full mt-3">
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                  {
                    resumeData.public && (
                      <button onClick={handleShare} className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 ring-blue-300 text-blue-600 hover:ring transition-colors rounded-lg">
                        <Share2Icon className="size-6" /> Share
                      </button>
                    )
                  }
                  <button onClick={changeResumeVisibility} className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 ring-purple-300 text-purple-600 rounded-lg hover:ring transition-colors ">
                    {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                    {resumeData.public ? 'Public' : 'Private'}
                  </button>
                  <button onClick={downloadResume} className="flex items-center  px-6 py-2 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 rounded-lg hover:ring transition-colors ">
                    <DownloadIcon className="size-4" /> Download
                  </button>
                </div>
              </div>

              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_colo} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBulider