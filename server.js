const express=require("express");
const path=require("path");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const Database=require("better-sqlite3");

const app=express();
const PORT=process.env.PORT||3000;
const JWT_SECRET=process.env.JWT_SECRET||"change-this-secret-in-production";
const db=new Database("learnflow.db");

app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

db.exec(`
CREATE TABLE IF NOT EXISTS users(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS progress(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER NOT NULL,
 lesson_id TEXT NOT NULL,
 completed INTEGER DEFAULT 0,
 score INTEGER DEFAULT 0,
 updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(user_id,lesson_id)
);
`);

app.post("/api/register",async(req,res)=>{
 const {name,email,password}=req.body||{};
 if(!name||!email||!password||password.length<6)return res.status(400).json({error:"Name, email and 6+ character password required"});
 try{
  const hash=await bcrypt.hash(password,10);
  const result=db.prepare("INSERT INTO users(name,email,password_hash) VALUES(?,?,?)").run(name,email.toLowerCase(),hash);
  const token=jwt.sign({id:result.lastInsertRowid,email},JWT_SECRET,{expiresIn:"7d"});
  res.json({token,user:{id:result.lastInsertRowid,name,email}});
 }catch(e){res.status(409).json({error:"Email already registered"});}
});
app.post("/api/login",async(req,res)=>{
 const {email,password}=req.body||{};
 const user=db.prepare("SELECT * FROM users WHERE email=?").get((email||"").toLowerCase());
 if(!user||!(await bcrypt.compare(password||"",user.password_hash)))return res.status(401).json({error:"Invalid credentials"});
 const token=jwt.sign({id:user.id,email:user.email},JWT_SECRET,{expiresIn:"7d"});
 res.json({token,user:{id:user.id,name:user.name,email:user.email}});
});
function auth(req,res,next){
 try{const h=req.headers.authorization||"";req.user=jwt.verify(h.replace("Bearer ",""),JWT_SECRET);next();}
 catch(e){res.status(401).json({error:"Authentication required"});}
}
app.get("/api/progress",auth,(req,res)=>{
 const rows=db.prepare("SELECT lesson_id,completed,score,updated_at FROM progress WHERE user_id=?").all(req.user.id);
 res.json(rows);
});
app.post("/api/progress",auth,(req,res)=>{
 const {lessonId,completed,score}=req.body||{};
 if(!lessonId)return res.status(400).json({error:"lessonId required"});
 db.prepare(`INSERT INTO progress(user_id,lesson_id,completed,score) VALUES(?,?,?,?)
 ON CONFLICT(user_id,lesson_id) DO UPDATE SET completed=excluded.completed,score=excluded.score,updated_at=CURRENT_TIMESTAMP`)
 .run(req.user.id,lessonId,completed?1:0,Number(score)||0);
 res.json({ok:true});
});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`LearnFlow running at http://localhost:${PORT}`));