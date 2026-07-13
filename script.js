const quotes=[
"Start before you're ready.",
"Small progress is still progress.",
"Code. Learn. Repeat.",
"Every bug teaches something.",
"Dream big, build bigger."
];
document.getElementById("btn").onclick=()=>{
document.getElementById("quote").textContent=quotes[Math.floor(Math.random()*quotes.length)];
};