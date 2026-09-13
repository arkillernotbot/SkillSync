// In-memory data store for the prototype
let studentProfile = null;

let jobListings = [
  {
    title: "Python Developer Intern",
    company: "DataWorks Ltd.",
    skills: ["python", "sql"]
  }
];

let collegeCurriculum = ["c++", "dbms", "operating systems"];

// 1. Role switcher tab functionality
function switchRole(roleName) {
  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.add('hidden'));
  document.querySelectorAll('.role-selector button').forEach(btn => btn.classList.remove('active'));

  document.getElementById(`${roleName}-view`).classList.remove('hidden');
  event.target.classList.add('active');

  renderAll();
}

// 2. Student submission handler
function saveStudentProfile(e) {
  e.preventDefault();
  const name = document.getElementById('stu-name').value.trim();
  const degree = document.getElementById('stu-degree').value.trim();
  const rawSkills = document.getElementById('stu-skills').value.split(',').map(s => s.trim().toLowerCase());

  studentProfile = { name, degree, skills: rawSkills };
  alert("Profile updated! Checking matching jobs...");
  renderAll();
}

// 3. Industry posting handler
function postJob(e) {
  e.preventDefault();
  const title = document.getElementById('job-title').value.trim();
  const company = document.getElementById('job-company').value.trim();
  const rawSkills = document.getElementById('job-skills').value.split(',').map(s => s.trim().toLowerCase());

  jobListings.push({ title, company, skills: rawSkills });
  alert("Job posted successfully!");
  document.getElementById('job-form').reset();
  renderAll();
}

// 4. Matching and rendering logic
function renderAll() {
  renderStudentMatches();
  renderIndustryTalent();
  renderSkillGaps();
}

function renderStudentMatches() {
  const container = document.getElementById('student-matches-list');
  const status = document.getElementById('student-status-text');
  container.innerHTML = '';

  if (!studentProfile) {
    status.innerText = "Please fill in your profile on the left to see matches.";
    return;
  }

  status.innerText = `Matching listings for ${studentProfile.name}:`;

  const matches = jobListings.filter(job => 
    job.skills.some(skill => studentProfile.skills.includes(skill))
  );

  if (matches.length === 0) {
    container.innerHTML = "<p>No matching positions found yet based on your skill set.</p>";
    return;
  }

  matches.forEach(job => {
    const el = document.createElement('div');
    el.className = 'item-badge';
    el.innerHTML = `<strong>${job.title}</strong> at <em>${job.company}</em><br><small>Required: ${job.skills.join(', ')}</small>`;
    container.appendChild(el);
  });
}

function renderIndustryTalent() {
  const container = document.getElementById('industry-talent-list');
  container.innerHTML = '';

  if (!studentProfile) {
    container.innerHTML = "<p>No students have registered their profiles yet.</p>";
    return;
  }

  // Check if student matches ANY current job
  const matchingJobs = jobListings.filter(job =>
    job.skills.some(skill => studentProfile.skills.includes(skill))
  );

  if (matchingJobs.length > 0) {
    const el = document.createElement('div');
    el.className = 'item-badge';
    el.innerHTML = `<strong>${studentProfile.name}</strong> (${studentProfile.degree})<br><small>Skills: ${studentProfile.skills.join(', ')}</small><br><strong>Match for:</strong> ${matchingJobs.map(j => j.title).join(', ')}`;
    container.appendChild(el);
  } else {
    container.innerHTML = "<p>No registered candidates match your skill criteria currently.</p>";
  }
}

function renderSkillGaps() {
  const container = document.getElementById('skill-gap-list');
  container.innerHTML = '';

  // Aggregate all unique required skills from jobs
  const allDemandedSkills = new Set();
  jobListings.forEach(j => j.skills.forEach(s => allDemandedSkills.add(s)));

  // Identify skills demanded by industry that aren't in curriculum
  const gaps = [...allDemandedSkills].filter(skill => !collegeCurriculum.includes(skill));

  if (gaps.length === 0) {
    container.innerHTML = "<p>Curriculum currently matches all industry demands!</p>";
  } else {
    gaps.forEach(gap => {
      const el = document.createElement('div');
      el.className = 'item-badge';
      el.style.borderColor = '#fca5a5';
      el.style.backgroundColor = '#fef2f2';
      el.innerHTML = `<strong>Recommended Course addition:</strong> ${gap.toUpperCase()} (High demand in postings)`;
      container.appendChild(el);
    });
  }
}

// Initial render
renderAll();