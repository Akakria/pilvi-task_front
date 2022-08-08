var counter = 0

var taskList = []
const btn = document.getElementById('trigbtn')
const taskDescr = document.getElementById('taskname')
const taskView = document.querySelector('ul')



class Task {
    constructor(id, descr) {
        this.id = id + Date.now()
        this.descr = descr
    }
}



async function triggerTest() {
    btn.disabled = true;

    await fetch('https://pilvitask.azurewebsites.net/api/HttpTrigger1?code=BVC3Nck6PmrJtDFbC-LXeGlxMLTPPK3gA0J9MDSJVpUtAzFujWu5WA==')
        .then((response) => response.json())
        .then((data) => taskList.push(data));

    updateView()
    btn.disabled = false;
}



function updateView() {
    taskView.innerHTML = null
    taskList.forEach(task => taskToView(task))
}



function taskToView(task) {
    let entry = document.createElement('div')
    entry.id = "entry_" + task.id
    entry.style.minHeight = '40px'
    entry.appendChild(generateDescr("descr" + task.id, task.descr))
    entry.appendChild(generateBtn(task.id, "Del", entry.id))
    taskView.appendChild(entry)
}



function taskToList() {
    let taskInput = document.getElementById("taskname")
    if (taskInput.value != "") {
        const localTask = new Task("task" + Date.now(), taskDescr.value)
        taskList.push(localTask)
        taskInput.value = null
        updateView()
    }
    else {
        alert("No task!")
    }
}



function generateBtn(_id, content, entryId) {

    let btnDiv = document.createElement('div')
    let btn = document.createElement("button")

    btn.id = "btn" + _id
    btn.innerHTML = content
    btn.onclick = function () {
        delItem(_id, entryId);
    }
    btnDiv.appendChild(btn)
    btnDiv.style.float = 'right'

    return btnDiv
}



function generateDescr(_id, content) {

    let descr = document.createElement('div')

    descr.id = _id
    descr.appendChild(document.createTextNode(content));
    descr.style.float = 'left'

    return descr
}



function delItem(taskId, entryId) {
    taskList = taskList.filter(task => task.id !== taskId)
    document.getElementById(entryId).remove()
}


