//POST : /api/ai/enhance-pro-sum
import Resume from "../models/Resume.js"
import ai from "../configs/ai.js"
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const { userContent } = req.body;
        console.log(userContent);
        
        if (!userContent) {
            return res.status(400).json({ message: 'Missing  requried fields' })
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: 'You are an expert in resume writing.  Yourtask is to enhance the professional summary of a resume . The summary should be 1-2 sentence also highlighting key skills, experience , and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else. '
                },
                {
                    role: "user",
                    content: userContent,
                },
            ]
        })
        const enhanceContent = response.choices[0].message.content;
        return res.status(200).json({ enhanceContent })
    }

    catch (error) {
        return res.status(400).json({ message: error.message })

    }
}
//POST : /api/ai/enhance-job-des
export const enhanceJobDescription = async (req, res) => {
    try {
        const { userContent } = req.body;
        if (!userContent) {
            return res.status(400).json({ message: 'Missing  requried fields' })
        }
        console.log(userContent);
        
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: 'You are an expert in resume writing.  Your task is to enhance the job description of a resume . The sjob description should be 1-2 sentence also highlighting key responsibilities, and achivement. Make it compelling and ATS-friendly. and only return text no options or anything else. '
                },
                {
                    role: "user",
                    content: userContent,
                },
            ]
        })
        const enhancedContent = response.choices[0].message.content
        return res.status(200).json({ enhancedContent })
    }

    catch (error) {
        return res.status(400).json({ message: error.message })

    }
}
//POST /api/upload-resume
export const uploadResume = async (req, res) => {
    try {
        
        const { resumeText, title } = req.body;
        const userId = req.userId;
        if (!resumeText) {
            return res.status(400).json({ message: 'Missing  requried fields' })
        }
        const systemPrompt = 'You are an expert AI Agent to extract data from resume.'
        const userPrompt = `extract data from this resume:${resumeText}
        {
        professional_summary: {type: String , default:""},
        skills:[{type:String}],
        personal_info:{
            image:{type: String , default:''},
            full_name:{type: String , default:''},
            profession:{type: String , default:''},
            email:{type: String , default:''},
            phone:{type: String , default:''},
            location:{type: String , default:''},
            linkedin:{type: String , default:''},
            website:{type: String , default:''}

        },
        experience:[
            {
                company: {type:String},
                position: {type:String},
                start_date: {type:String},
                end_date: {type:String},
                description: {type:String},
                is_current: {type:Boolean},

            }
        ],
        project:[
            {
                name: {type:String},
                type: {type:String},
                description: {type:String}
            }
        ],
        education:[
            {
                institution: {type:String},
                degree: {type:String},
                field: {type:String},
                graduation_date: {type:String},
                gap:{type:String}
            }
        ]
        }
        `
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: 'You are an expert in resume writing.  Your task is to enhance the job description of a resume . The sjob description should be 1-2 sentence also highlighting key responsibilities, and achivement. Make it compelling and ATS-friendly. and only return text no options or anything else. '
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            response_format: { type: 'json_object' }
        })
        console.log("FULL RESPONSE:", JSON.stringify(response, null, 2));
        const extractedData = response.choices[0].message.content
        const parsedData = JSON.parse(extractedData)
        const newResume = await Resume.create({ userId, title, ...parsedData })
        return res.json({ resumeId: newResume._id })
    }

    catch (error) {
        return res.status(400).json({ message: error.message })

    }
}