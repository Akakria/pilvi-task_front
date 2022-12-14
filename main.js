var counter = 0

var taskList = []
const btn = document.getElementById('trigbtn')
const fetchBtn = document.getElementById('fetchbtn')
const taskDescr = document.getElementById('taskname')
const taskView = document.querySelector('ul')
const placeholderUser = "Placeholder"
let taskIdToEdit = ''



class Task {
    constructor(id, descr) {
        this._id = id
        this.descr = descr
    }
}

function taskDbCreate(task) {
    fetch('https://pilvitask-apim.azure-api.net/PilviTaskapi/HttpPost-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
}
/*
function taskDbInit() {
    fetch('https://pilvitask-apim.azure-api.net/PilviTaskapi/HttpInit-db')
}
*/
function taskDbRemove(taskId) {
    return fetch('https://pilvitask-apim.azure-api.net/PilviTaskapi/HttpRemove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskId)
    })
}

function taskDbUpdate(taskId, taskText) {
    const object = {
        id: taskId,
        descr: taskText
    }
    return fetch('https://pilvitask-apim.azure-api.net/PilviTaskapi/HttpUpdate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object)
    })
}

function taskDbGet() {
    return fetch('https://pilvitask-apim.azure-api.net/PilviTaskapi/HttpGet-list')
}

/* function triggerTest() {
    btn.disabled = true;

    fetch('https://pilvitask.azurewebsites.net/api/HttpTrigger1?code=BVC3Nck6PmrJtDFbC-LXeGlxMLTPPK3gA0J9MDSJVpUtAzFujWu5WA==')
        .then((response) => response.json())
        .then((data) => taskList.push(data));

    updateView()
    btn.disabled = false;
}
 */

function fetchTasks() {
    fetchBtn.disabled = true;
    taskDbGet().then((res) => res.json()).then((data) => {
        taskList = []
        for (let task of data) {
            taskList.push(task)
        }
        updateView();
        fetchBtn.disabled = false;
    }).catch(error => {
        alert('Fetching tasks failed')
        fetchBtn.disabled = false;
    });
}


function updateView() {
    taskView.innerHTML = null
    taskList.forEach(task => taskToView(task))
}



function taskToView(task) {
    let entry = document.createElement('div')
    entry.id = task._id
    entry.style.minHeight = '40px'
    entry.appendChild(generateDescr("descr" + task._id, task.descr))
    entry.appendChild(generateBtn(task._id, "Delete", entry.id))
    entry.appendChild(generateBtn(task._id, "Edit", entry.id))
    taskView.appendChild(entry)
}



function taskToList() {
    let taskInput = document.getElementById("taskname")
    if (taskInput.value != "") {
        const localTask = new Task("task" + Date.now(), taskDescr.value)
        taskList.push(localTask)
        taskInput.value = null
        console.log("localTask = " + localTask._id);
        taskDbCreate(localTask)
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
    if (content == "Delete") {
        btn.onclick = function () {
            delItem(_id, entryId);
        }
    } else {
        btn.onclick = function () {
            startEdit(_id, entryId);
        }
    }

    btnDiv.appendChild(btn)
    btnDiv.style.float = 'right'

    return btnDiv
}



function generateDescr(_id, content) {

    let descr = document.createElement('div')

    descr.id = _id
    console.log("descr.id = " + descr.id);
    descr.appendChild(document.createTextNode(content));
    descr.style.float = 'left'

    return descr
}



function delItem(taskId, entryId) {
    document.getElementById(entryId).disabled = true
    taskList = taskList.filter(task => task._id !== taskId)
    taskDbRemove(taskId).then(() => {
        document.getElementById(entryId).remove()
    }).catch(error => {
        alert('Deleting task failed')
        document.getElementById(entryId).disabled = false
    });
}

function startEdit(taskId, entryId) {
    for (const task of taskList) {
        if (task._id == taskId) {
            taskDescr.value = task.descr
        }
    }
    taskIdToEdit = taskId
    document.getElementById('addbtn').style.display = "none"
    document.getElementById('fetchbtn').style.display = "none"
    document.getElementById('savebtn').style.display = "inline"
    document.getElementById('cancelbtn').style.display = "inline"
}

function handleEdit(saved) {
    if (saved) {
        taskDbUpdate(taskIdToEdit, taskDescr.value).then(() => {
            for (const task of taskList) {
                if (task._id == taskIdToEdit) {
                    task.descr = taskDescr.value
                }
            }
            updateView()
            taskDescr.value = null
            document.getElementById('addbtn').style.display = "inline"
            document.getElementById('fetchbtn').style.display = "inline"
            document.getElementById('savebtn').style.display = "none"
            document.getElementById('cancelbtn').style.display = "none"
        })
    }
}


