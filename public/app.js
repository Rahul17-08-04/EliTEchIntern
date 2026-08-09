const courses=[
{id:"js",title:"Modern JavaScript",category:"Development",description:"Build strong JavaScript foundations and interactive web experiences.",color:"",lessons:[
{id:"js1",title:"JavaScript Essentials",mins:8,video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",description:"Variables, functions, arrays, objects, and the core ideas behind modern JavaScript.",quiz:{q:"Which keyword declares a block-scoped variable that can be reassigned?",options:["var","let","const","static"],answer:1}},
{id:"js2",title:"DOM & Events",mins:7,video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",description:"Connect JavaScript to the page and respond to user actions.",quiz:{q:"Which method selects the first matching CSS selector?",options:["querySelector","getElement","selectFirst","findNode"],answer:0}},
{id:"js3",title:"Async JavaScript",mins:9,video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",description:"Understand promises, async/await, and asynchronous application flow.",quiz:{q:"Which keyword is used to wait for a Promise inside an async function?",options:["pause","await","defer","yield"],answer:1}}
]},
{id:"data",title:"Data Analytics Foundations",category:"Analytics",description:"Learn how to clean, explore, and communicate data.",lessons:[
{id:"d1",title:"Understanding Data",mins:6,video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",description:"Learn the analytics workflow and how good questions lead to useful insights.",quiz:{q:"What is the first useful step before analyzing a dataset?",options:["Ignore missing values","Define the question","Build a dashboard","Publish results"],answer:1}},
{id:"d2",title:"SQL Essentials",mins:10,video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",description:"Query relational data using SELECT, WHERE, GROUP BY, and JOIN.",quiz:{q:"Which SQL clause filters rows before grouping?",options:["ORDER BY","HAVING","WHERE","LIMIT"],answer:2}},
{id:"d3",title:"Visual Storytelling",mins:8,video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",description:"Choose charts and structure dashboards so insights are easy to understand.",quiz:{q:"Which chart is usually best for showing a trend over time?",options:["Line chart","Pie chart","Treemap","Gauge"],answer:0}}
]},
{id:"web",title:"Frontend Web Design",category:"Design",description:"Create responsive interfaces with HTML, CSS, and practical design principles.",lessons:[
{id:"w1",title:"Responsive Layouts",mins:8,video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",description:"Build layouts that adapt gracefully from desktop to mobile.",quiz:{q:"Which CSS feature is commonly used for responsive breakpoints?",options:["Media queries","Variables","Keyframes","Filters"],answer:0}},
{id:"w2",title:"Modern CSS",mins:9,video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",description:"Use Flexbox, Grid, custom properties, and modern visual patterns.",quiz:{q:"Which CSS layout system is ideal for two-dimensional page layouts?",options:["Float","Grid","Inline","Position"],answer:1}},
{id:"w3",title:"Accessibility Basics",mins:6,video:"https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",description:"Make interfaces usable with keyboards, assistive technology, and different abilities.",quiz:{q:"What does semantic HTML primarily improve?",options:["File size","Meaning and accessibility","Internet speed","Database queries"],answer:1}}
]}
];

let user=JSON.parse(localStorage.getItem("learnflow-user")||"null");
let state=JSON.parse(localStorage.getItem("learnflow-state")||'{"done":[],"scores":{},"time":0}');
let currentCourse=null,currentLesson=null,selectedAnswer=null;

const $=s=>document.querySelector(s);
const save=()=>localStorage.setItem("learnflow-state",JSON.stringify(state));
const allLessons=()=>courses.flatMap(c=>c.lessons.map(l=>({...l,courseId:c.id,courseTitle:c.title})));
const initials=n=>n.split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase();

function setupUser(){
 if(user){
   $("#authScreen").classList.add("hidden");$("#app").classList.remove("hidden");
   $("#userName").textContent=user.name;$("#welcomeName").textContent=user.name.split(" ")[0];
   $("#userEmail").textContent=user.email;$("#avatar").textContent=initials(user.name);
   renderDashboard();
 }else $("#authScreen").classList.remove("hidden");
}
$("#loginForm").onsubmit=e=>{e.preventDefault();user={name:$("#nameInput").value.trim(),email:$("#emailInput").value.trim()};localStorage.setItem("learnflow-user",JSON.stringify(user));setupUser();};
$("#logout").onclick=()=>{localStorage.removeItem("learnflow-user");location.reload()};

function progress(course){
 const done=course.lessons.filter(l=>state.done.includes(l.id)).length;
 return Math.round(done/course.lessons.length*100);
}
function card(c){
 const p=progress(c);
 return `<article class="course-card"><div class="course-cover">${c.title}</div><div class="course-body"><p class="eyebrow">${c.category}</p><h3>${c.title}</h3><p>${c.description}</p><div class="meta"><span>${c.lessons.length} lessons</span><span>${p}% complete</span></div><div class="bar"><i style="width:${p}%"></i></div><div class="course-footer"><span class="progress-text">${p===100?"Completed":"In progress"}</span><button class="primary open-course" data-id="${c.id}">${p?"Continue":"Start course"} →</button></div></div></article>`
}
function bindCourseButtons(){document.querySelectorAll(".open-course").forEach(b=>b.onclick=()=>openCourse(b.dataset.id))}
function renderCourses(list=courses){$("#courseGrid").innerHTML=list.map(card).join("");bindCourseButtons()}
function renderDashboard(){renderCourses();$("#continueGrid").innerHTML=courses.map(card).join("");$("#continueGrid").querySelectorAll(".open-course").forEach(b=>b.onclick=()=>openCourse(b.dataset.id));updateStats()}
function updateStats(){
 const done=state.done.length,total=allLessons().length;
 const scores=Object.values(state.scores);const avg=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
 $("#statCourses").textContent=courses.length;$("#statLessons").textContent=done;$("#statScore").textContent=avg+"%";$("#statTime").textContent=Math.round(state.time/60)+"m";
}
function showView(id){
 document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));
 $("#"+id+"View").classList.remove("hidden");
 document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===id));
 window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>showView(b.dataset.view));

function openCourse(id){
 currentCourse=courses.find(c=>c.id===id);currentLesson=currentCourse.lessons[0];
 openLesson(currentCourse,currentLesson);showView("lesson");
}
function openLesson(c,l){
 currentCourse=c;currentLesson=l;
 $("#lessonCourse").textContent=c.category+" • "+c.title;
 $("#lessonTitle").textContent=l.title;$("#lessonDescription").textContent=l.description;
 $("#videoSource").src=l.video;$("#lessonVideo").load();$("#videoFallback").classList.add("hidden");
 $("#lessonVideo").onerror=()=>$("#videoFallback").classList.remove("hidden");
 $("#completeLesson").textContent=state.done.includes(l.id)?"✓ Completed":"✓ Mark lesson complete";
 $("#lessonList").innerHTML=c.lessons.map((x,i)=>`<div class="lesson-item ${x.id===l.id?"active":""} ${state.done.includes(x.id)?"done":""}" data-l="${x.id}"><span>${state.done.includes(x.id)?"✓":i+1}</span><span>${x.title}<small> · ${x.mins} min</small></span></div>`).join("");
 $("#lessonList").querySelectorAll(".lesson-item").forEach(el=>el.onclick=()=>openLesson(c,c.lessons.find(x=>x.id===el.dataset.l)));
}
$("#backCourses").onclick=()=>showView("courses");
$("#backLesson").onclick=()=>showView("lesson");
$("#completeLesson").onclick=()=>{
 if(!state.done.includes(currentLesson.id)){state.done.push(currentLesson.id);state.time+=currentLesson.mins*60;save();updateStats();openLesson(currentCourse,currentLesson);renderProgress();showQuiz();}
 else showQuiz();
};
$("#nextLesson").onclick=()=>{
 const i=currentCourse.lessons.findIndex(x=>x.id===currentLesson.id);
 if(i<currentCourse.lessons.length-1){openLesson(currentCourse,currentCourse.lessons[i+1]);}
 else showToast("Course lesson complete 🎉");
};
function showQuiz(){selectedAnswer=null;$("#quizTitle").textContent=currentLesson.title;$("#quizQuestion").innerHTML=`<h3>${currentLesson.quiz.q}</h3><div class="quiz-options">${currentLesson.quiz.options.map((o,i)=>`<button class="quiz-option" data-a="${i}">${o}</button>`).join("")}</div>`;$("#quizResult").textContent="";$("#submitQuiz").disabled=false;$("#quizQuestion").querySelectorAll(".quiz-option").forEach(b=>b.onclick=()=>{selectedAnswer=Number(b.dataset.a);document.querySelectorAll(".quiz-option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")});showView("quiz")}
$("#submitQuiz").onclick=()=>{
 if(selectedAnswer===null){$("#quizResult").textContent="Choose an answer first.";return}
 const ok=selectedAnswer===currentLesson.quiz.answer;state.scores[currentLesson.id]=ok?100:0;save();
 $("#quizResult").textContent=ok?"Correct! Nice work. 🎉":"Not quite. Review the lesson and try again.";
 $("#quizResult").style.color=ok?"var(--green)":"#dc4b4b";updateStats();renderProgress();
};
function renderProgress(){
 const total=allLessons().length,done=state.done.length,p=Math.round(done/total*100);
 $("#overallProgress").textContent=p+"%";$("#overallBar").style.width=p+"%";
 $("#progressList").innerHTML=courses.map(c=>`<div class="progress-row"><header><div><b>${c.title}</b><small> · ${c.lessons.length} lessons</small></div><strong>${progress(c)}%</strong></header><div class="bar"><i style="width:${progress(c)}%"></i></div></div>`).join("");
}
$("#courseSearch").oninput=e=>{const q=e.target.value.toLowerCase();renderCourses(courses.filter(c=>(c.title+c.category+c.description).toLowerCase().includes(q)))};

function showToast(t){const x=document.createElement("div");x.textContent=t;x.style.cssText="position:fixed;bottom:25px;left:50%;transform:translateX(-50%);background:#171a2a;color:#fff;padding:12px 18px;border-radius:10px;z-index:99;font-size:13px";document.body.appendChild(x);setTimeout(()=>x.remove(),2200)}
setupUser();renderProgress();