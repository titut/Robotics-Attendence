const express = require('express');
const { attendence } = require('./controller/admin');
const app = express()
const port = 3000

const admin = require("./controller/admin");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json())

app.get("/", async (req, res)=>{
    let data = await admin.getAllMembers();
    var date = new Date();
    var today = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    let members = [];
    for(let i of data){
        if(!i.attendence.includes(today)){
            members.push(i);
        }
    }
    res.render("home", {data: members});
})

app.post("/attendence", async (req,res)=>{
    let data = req.body.id;
    let members = await admin.getAllMembers();
    let cur_member = null;
    for(let member of members){
        if(member.id == data){
            cur_member = member;
        }
    }
    if(cur_member == null){
        res.sendStatus(500);
    } else {
        var date = new Date();
        if(cur_member.attendence == ""){
            let attendence = [`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`]
            await admin.attendence(data, attendence);
        } else {
            let attendence = cur_member.attendence.split(",");
            attendence.push(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`);
            await admin.attendence(data, attendence);
        }
        res.sendStatus(200);
    }
})

app.get('/admin', async (req, res) => {
    let grade = req.query.grade;
    let department = req.query.department;
    let attendence = req.query.attendence;
    let data = await admin.getAllMembers(); 
    let members = [];
    
    for(let i of data){
        if(i.grade == grade){
            if(department == undefined){
                members.push(i);
            } else if(i.department == department){
                members.push(i);
            }
        }
        if(i.department == department){
            if(grade == undefined){
                members.push(i);
            } else if(i.grade == grade){
                members.push(i);
            }
        }
        if(grade == undefined && department == undefined){
            members.push(i);
        }
    }

    var date = new Date();
    var today = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    var cur_member = [];
    if(attendence != undefined){
        for(let i of members){
            if(i.attendence.includes(today)){
                cur_member.push(i);
            }
        }
        members = cur_member;
    }

    res.render("admin", {data: members});
})

app.post("/add_member", async (req,res)=>{
    var data = req.body;
    if(data.last == "" || data.first == "" || data.email == ""){
        res.sendStatus(200);
    } else {
        await admin.addMember(data.last, data.first, data.email, data.grade, data.department);
        res.sendStatus(200);
    }
})

app.post("/delete_member", async (req,res)=>{
    var data = req.body;
    await admin.deleteMember(data.id);
    res.sendStatus(200);
})

app.post("/edit_member", async (req,res)=>{
    var data = req.body;
    if(data.last == "" || data.first == "" || data.email == ""){
        res.sendStatus(200);
    } else {
        await admin.editMember(data.id, data.last, data.first, data.email, data.grade, data.department);
        res.sendStatus(200);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})