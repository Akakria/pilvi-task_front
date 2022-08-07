var counter = 0



function generateBtn(_id, content, entryId) {

    let btnDiv = document.createElement('div')
    let btn = document.createElement("button")

    btn.id = _id
    btn.innerHTML = content
    btn.onclick = function () {
        delItem(entryId);
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


function delItem(_id) {
    console.log("delete " + _id)
    document.getElementById(_id).remove()
}

function triggerTest() {
    fetch('https://pilvitask.azurewebsites.net/api/HttpTrigger1?code=BVC3Nck6PmrJtDFbC-LXeGlxMLTPPK3gA0J9MDSJVpUtAzFujWu5WA==')
        .then((response) => response.json())
        .then((data) => console.log(data));

}

function addTask() {

    const task = document.querySelector("input")

    if (task.value.length != 0) {

        let list = document.querySelector("ul")

        let entry = document.createElement('div')

        entry.classList.add("taskitem")
        entry.id = "task" + counter;
        entry.style.minHeight = '40px'
        entry.appendChild(generateDescr("descr" + counter, task.value))
        entry.appendChild(generateBtn("delBtn" + counter, "del", entry.id))

        list.appendChild(entry)

        counter++

        task.value = null
    }
    else {
        alert("No Task Specified!")
    }
}
