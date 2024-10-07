
import {Job} from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        const { title,requirements, location, position, description, jobType, salary,companyId ,experience } =
            req.body;
            const userId = req.id;
            if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
                return res.status(400).json({
                    message: "Somethin is missing.",
                    success: false
                })
            };

        const job = await Job.create({
            title,
            location,   
           position,
            description,
            
            jobType,
            salary: Number(salary),   
            company: companyId,
            created_by: userId,
            requirements : requirements.split(","),
            experienceLevel:experience
            
        });

        return res.status(201).json({
            message: "Job created successfully.",
            job,    
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const getAllJobs = async (req, res) => {
    try {

     const keyword = req.query.keyword || "";
      const query ={
        $or: [
          { title: { $regex: keyword, $options: "i" } },
         { description: { $regex: keyword, $options: "i" } },
        ],
      };
      const jobs = await Job.find(query).populate("company").sort({createdAt: -1})
      ;

      if(!jobs){
        return res.status(404).json({
          message: "Jobs not found",
          success: false,
        });
      }

      return res.status(200).json({
        jobs,
        success: true,
      });
    } catch (error) {
        console.log(error);
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("company").sort({createdAt: -1});

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false,
            });
        }
        return res.status(200).json({
            job,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found",
                success: false,
            });
        }
        return res.status(200).json({
            jobs,
            success: true,
        });
       
    } catch (error) {
        console.log(error);
    }
}