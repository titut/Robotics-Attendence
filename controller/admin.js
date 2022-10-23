const csvdb = require("csv-database");
const { v4: uuidv4 } = require('uuid');

module.exports = {
    getAllMembers: async ()=>{
        const db = await csvdb("member.csv", ["id", "last", "first", "email", "grade", "department", "attendence"]);
    
        return await db.get();
    },
    getMember: async (id)=>{
        const db = await csvdb("member.csv", ["id", "last", "first", "email", "grade", "department", "attendence"]);

        db.get({id: id})
    },
    addMember: async (last, first, email, grade, department)=>{
        const db = await csvdb("member.csv", ["id", "last", "first", "email", "grade", "department", "attendence"]);
    
        await db.add([{
            id: uuidv4(),
            last: last,
            first: first,
            email: email,
            grade: grade,
            department: department,
            attendence: []
        }]);
    },
    deleteMember: async (id)=>{
        const db = await csvdb("member.csv", ["id", "last", "first", "email", "grade", "department", "attendence"]);
    
        await db.delete({id: id});
    },
    editMember: async (id, last, first, email, grade, department)=>{
        const db = await csvdb("member.csv", ["id", "last", "first", "email", "grade", "department", "attendence"]);
    
        await db.edit({id: id}, {
            first: first,
            last: last,
            email: email,
            grade: grade,
            department: department
        })
    },
    attendence: async (id, attendence)=>{
        const db = await csvdb("member.csv", ["id", "last", "first", "email", "grade", "department", "attendence"]);

        await db.edit({id: id}, {
            attendence: attendence
        })
    }
}