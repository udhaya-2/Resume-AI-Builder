import { GraduationCap ,Plus , Trash2} from "lucide-react"

const EducationForm = ({data , onChange}) => {
    const addEducation = () => {
        const newEducation = {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            gpa: ""
        }
        onChange([...data, newEducation])
    }
    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index)
        onChange(updated)
    }
    const updatedEducation = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-fray-900"> Education
                    </h3>
                    <p className="text-sm text-gray-500"> Add your education details
                    </p>
                </div>
                <button onClick={addEducation} className="flex items-center gap-2 px-2 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50">
                    <Plus className="size-4" />
                    Add Education
                </button>
            </div>
            {data.length == 0 ? (
                <div className="tex-center py-8 text-gray-500">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No  Education added yet.</p>
                    <p className="text-sm">Click "Add Education" to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((Education, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                                <h4>Education #{index + 1}</h4>
                                <button onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700 transition-colors">
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                <input value={Education.institution || ""} type="text" onChange={(e) => updatedEducation(index, "institution", e.target.value)}
                                    placeholder="Institution Name " className="px-2 py-2 text-sm rounded-lg" />
                                <input value={Education.degree || ""} type="text" onChange={(e) => updatedEducation(index, "degree", e.target.value)}
                                    placeholder="Degree (e.g. , Bachelor's , Master's)" className="px-2 py-2 text-sm rounded-lg" />
                                <input value={Education.field || ""} type="text" onChange={(e) => updatedEducation(index, "field", e.target.value)}
                                    placeholder="Field of Study" className="px-2 py-2 text-sm rounded-lg" />
                                <input value={Education.graduation_date || ""} type="month" onChange={(e) => updatedEducation(index, "graduation_date", e.target.value)}
                                    className="px-2 py-2 text-sm rounded-lg" />
                            </div>

                            <input value={Education.gpa || ""} type="text" onChange={(e) => updatedEducation(index, "gpa", e.target.value)}
                                placeholder="GPA (optional)"    className="px-2 py-2 text-sm rounded-lg" />
                         
                            
                        </div>

                    ))}
                </div>)}
        </div>
    )
}
export default EducationForm 