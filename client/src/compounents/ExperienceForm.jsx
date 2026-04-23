import { Briefcase, Loader2, Plus, Sparkle, Trash2 } from "lucide-react"
import { useState } from "react"
import  {useSelector} from "react-redux"
import api from "../configs/api"
import toast from "react-hot-toast"
const ExperienceForm = ({ data, onChange ,  }) => {
    const {token } = useSelector(state => state.auth)
    const [generatingIndex , setGeneratingIndex] = useState(-1)
    const addExperience =()=>{
        const newExperience ={
            company : "",
            position : "",
            start_date : "",
            end_date : "",
            description: "",
            is_current:false
        }
        onChange([...data , newExperience])
    }
    const removeExprience = (index) =>{
        const updated = data.filter((_, i)=>i !==index)
        onChange(updated)
    }
    const updatedExperience = (index, field , value) =>{
        const updated = [...data]
        updated[index] = {...updated[index] ,[field] : value}
        onChange(updated)
    }
    const generateDescription = async (index) => {
        setGeneratingIndex(index)
        const experience = data[index]
        const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}`
        try {
            const {data} = await api.post('api/ai/enhance-job-desc' , {userContent : prompt} , {headers:{Authorization:token}})
            updatedExperience(index , "description" , data.enhancedContent)
        } catch (error) {
            toast.error(error.message)
        }
        finally{
            setGeneratingIndex(-1)
        }
    }
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-fray-900"> Professional Experience
                    </h3>
                    <p className="text-sm text-gray-500"> Add your job experience
                    </p>
                </div>
                <button onClick={addExperience} className="flex items-center gap-2 px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50">
                    <Plus className="size-4" />
                    Add Experience
                </button>
            </div>
            {data.length==0 ? (
                <div className="tex-center py-8 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                    <p>No word experience added yet.</p>
                    <p className="text-sm">Click "Add Experience" to get started.</p>
                </div>
            ):(
                <div className="space-y-4">
                    {data.map((experience , index)=>(
                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                            <h4>Experience #{index+1}</h4>
                            <button onClick={()=> removeExprience(index)} className="text-red-500 hover:text-red-700 transition-colors">
                                <Trash2 className="size-4"/>
                            </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                <input value={experience.company || ""} type="text" onChange={(e)=>updatedExperience(index ,"company" , e.target.value)} 
                                placeholder="Company Name " className="px-2 py-2 text-sm rounded-lg" />
                                <input value={experience.position || ""} type="text" onChange={(e)=>updatedExperience(index ,"position" , e.target.value)} 
                                placeholder="Job title " className="px-2 py-2 text-sm rounded-lg" />
                                <input value={experience.start_date|| ""} type="month" onChange={(e)=>updatedExperience(index ,"start_date" , e.target.value)} 
                                className="px-2 py-2 text-sm rounded-lg" />
                                <input value={experience. end_date|| ""} type="month" onChange={(e)=>updatedExperience(index ,"end_date" , e.target.value)} 
                                disabled ={experience.is_current}
                                className="px-2 py-2 text-sm rounded-lg" />
                            </div>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked ={experience.is_current|| false} onChange={(e)=>{updatedExperience(index ,"is_current" , e.target.checked ? true:false);}}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                <span className="text-sm text-gray-700">Currently working here</span>
                            </label>
                            <div className="sapce-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">
                                        Job Description
                                    </label>
                                    <button disabled= {generatingIndex === index|| !experience.position || !experience.company} onClick={()=>generateDescription(index)}  className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabeld:opacity-50">
                                        {generatingIndex === index ?(
                                            <Loader2 className="w-3 h-3 animate-spin"/>
                                        ):(
                                            <Sparkle className="w-3 h-3"/>
                                        )}
                                        
                                        Enhance with AI
                                    </button>
                                </div>
                                <textarea value={experience.description || ""} onChange={(e)=>updatedExperience(index , "description" , e.target.value)}
                                    rows={4} className="w-full text-sm px-3 py-2 rounded-lg resize-none" placeholder="Describe your key responsiblities and achievements..." />

                            </div>
                        </div>
                        
                    ))}
                </div>
            )}
        </div>
    )
}
export default ExperienceForm