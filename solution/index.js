
//Global variable
let FOCUSED_TASK = undefined;

//Create page structure
function createPageStructure(){
    
    //create nav bar.
    let header = document.createElement('nav');
    header.id = 'pageHeader';

    //add section button
    let AddSectionButton = document.createElement('button');
    AddSectionButton.textContent = 'ADD Section';
    AddSectionButton.classList.add('btn');
    AddSectionButton.classList.add('btn-primary')
    AddSectionButton.classList.add('m-2')
    header.append(AddSectionButton);
    AddSectionButton.addEventListener('click', (event) => {
        let sectionName = prompt('please enter the new section name');
        if(document.querySelectorAll('section').length < 6 ){
            if(sectionName != null && sectionName.length > 0 && sectionName.length < 13){
                createTaskSection({
                    sectionId: sectionName,
                    sectionName: sectionName,
                    ulClass: `${sectionName}-tasks`,
                    inputId: `add-${sectionName}-task`,
                    buttonId: `submit-add-${sectionName}`     
                })
                    sections = document.querySelectorAll('section');
                    let tasks = {};
                    sections.forEach(section => {
                        tasks[section.id] = [];
                        allLi = section.querySelectorAll('ul')[0].querySelectorAll('li');
                        allLi.forEach(li => {
                            tasks[section.id].push(li.textContent);
                        });
                    });
                    console.log(tasks);
                    stroeDataInApi(tasks);
            }
            else alert('section name is not valid');
        }
        else alert('reached sections limit');
    });

    //load data button
    let loadDataButton = document.createElement('button');
    loadDataButton.textContent = 'LOAD Data';
    loadDataButton.addEventListener('click', (event) =>{
        fetchApiData();

    })
    loadDataButton.classList.add('btn');
    loadDataButton.classList.add('btn-primary')
    loadDataButton.classList.add('m-2')
    header.append(loadDataButton);

    //search bar
    let search = document.getElementById('search');
    search.classList.add('m-2')
    search.classList.add('position-absolute')
    search.classList.add('end-0');
    header.append(search);

    document.getElementById('root').appendChild(header);
    
    //create page body
    let body = document.createElement('div');
    body.id = 'pageBody';

   
    document.getElementById('root').appendChild(body);
    
    //moving tasks between sections using keyboards keys
    document.addEventListener('keyup', (event) => {
        let sectionArr = document.getElementById('pageBody').querySelectorAll('section');
        if(event.key <= sectionArr.length && event.altKey && FOCUSED_TASK != undefined && event.target.id != 'search'){
            tasksSections = JSON.parse(window.localStorage.getItem('tasks'));
            sections = document.querySelectorAll('section');

            tasks = tasksSections[sectionArr[event.key - 1].id];
            tasks.unshift(FOCUSED_TASK.textContent);
         

            prevTasks = tasksSections[FOCUSED_TASK.parentElement.parentElement.id];
            console.log(FOCUSED_TASK.parentElement.parentElement);
            let index = prevTasks.indexOf(FOCUSED_TASK.textContent);
            prevTasks.splice(index, 1);
        

            window.localStorage.setItem('tasks', JSON.stringify(tasksSections));
            stroeDataInApi(tasksSections);
            sectionArr[event.key - 1].querySelectorAll('ul')[0].prepend(FOCUSED_TASK);
        }
        
    });
    //get tasks from local storage
    tasks = JSON.parse(window.localStorage.getItem('tasks'));

    //defining the tasks sections from local storage
    sections = [];
    let indexing = 0;
    for (const key in tasks) {
        if(indexing == 0){
            first = 'to-do'
            sections[indexing] = {
                sectionId: 'todo',
                sectionName: first.toUpperCase(),
                ulClass: `${first}-tasks`,
                inputId: `add-${first}-task`,
                buttonId: `submit-add-${first}`
            }
        }
        else{
            sections[indexing] = {
                sectionId: key,
                sectionName: key.toUpperCase(),
                ulClass: `${key}-tasks`,
                inputId: `add-${key}-task`,
                buttonId: `submit-add-${key}`
            }
        }   
        indexing++;
    }
    //create each section in dom
    sections.forEach(section => {
        createTaskSection(section);
    });

    //create each task in dom
    let taskSectionArr = document.querySelectorAll('section');
    let dataArr = JSON.parse(window.localStorage.getItem('tasks'));
    let index = 0;
    for (const key in dataArr) {
        const section = dataArr[key];
        section.forEach(task => {
            createLiElement(taskSectionArr[index], task);
        });
        index++;
    }
    //moving loader into the right place
    document.getElementById('pageBody').append(document.querySelector('.spinner-border'));
}

//search list items in sections 
function search(event){
    let allSections = document.querySelectorAll('section');
    let allLi = [];
    for (let i = 0; i < allSections.length; i++) {
        const section = allSections[i];
        allLi.push(document.getElementById(section.id).querySelectorAll('ul')[0].querySelectorAll('li'));
    }
    allLi.forEach(section => {
        for (let i = 0; i < section.length; i++) {
            const li = section[i];
            li.style.display = 'none';
            if(li.textContent.includes(event.target.value)){
                li.style.display = '';
            }
        }
    });
}

//add task button function
function HandleAddTaskButtonClickedEvent(event){
    const section = event.target.parentElement;
    const input = document.getElementById(section.id).querySelectorAll('input')[0]; 
    if(input.value.length > 0){
    createLiElement(section, input.value);
        
        tasksSections = JSON.parse(window.localStorage.getItem('tasks'));
        sections = document.querySelectorAll('section');
        tasks = tasksSections[section.id];
        tasks.unshift(input.value);
        window.localStorage.setItem('tasks', JSON.stringify(tasksSections));
        stroeDataInApi(tasksSections);
        
        let allSections = document.querySelectorAll('section');
        for (let i = 0; i < allSections.length; i++) {
            const section = allSections[i];
        }
        bootstrapsClassSelctor();
    }
    else{
        alert('Please enter a task with content');
    }
}
//create a li element representing a task
function createLiElement(section, text){
    const ul = document.getElementById(section.id).querySelectorAll('ul')[0]; 
    let li = document.createElement('li');

    li.textContent =  text;
    li.classList = 'task';
    li.draggable = true;

    li.addEventListener('click', (event) => {
        li.contentEditable = true;
    });
    li.addEventListener('blur', (event) => {
        li.contentEditable = false;
        FOCUSED_TASK = undefined;

        tasksSections = JSON.parse(window.localStorage.getItem('tasks'));
        section = event.target.parentElement.parentElement;
        ulChanged = event.target.parentElement;
        liChanged = event.target;
        liList = ulChanged.children;
        console.log(liList);
        liContentList = [];
        for (let i = 0; i < liList.length; i++) {
            const temp = liList[i];
            if(temp.textContent.length > 0)
                liContentList.push(temp.textContent);
        }
        console.log(liContentList)
        tasksSections[section.id] = liContentList;
        window.localStorage.setItem('tasks', JSON.stringify(tasksSections));
        stroeDataInApi(tasksSections);
    });
    li.addEventListener('mouseenter', (event) => {
        FOCUSED_TASK = event.target;
    });
    li.addEventListener('mouseleave', (event) => {
        FOCUSED_TASK = undefined;
    });
    addEventsDragAndDrop(li);
    if(text.length > 0){
        ul.prepend(li);
    }
    
}

//create a section in page
function createTaskSection(section){
    //create the section element.
    let sectionElement = document.createElement('section');
    sectionElement.id = section['sectionId'];


    //define the template of a section.
    let elements = [{
        type:'h6',
        content:section['sectionName']
    },{
        type:'input',
        id:section['inputId']
    },{
        type:'button',
        id:section['buttonId']
    },{
        type:'ul',
        class:section['ulClass']
    }];
    //create the element and assign properties to it.
    elements.forEach(ele => {
        let temp = document.createElement(ele['type']);
        
        for (const key in ele) {
            if (key == 'class') {
                temp.classList = ele[key];
            }
            if (key == 'id'){
                temp.id = ele[key];
            }
            if (key == 'content'){
                temp.textContent = ele[key];
            }
            if(ele[key] == 'button'){
                temp.textContent = 'ADD';
                temp.classList.add('position-absolute')
                temp.classList.add('end-0')
                temp.classList.add('top-0')
                temp.classList.add('m-9')

                temp.addEventListener('click', HandleAddTaskButtonClickedEvent);
            }
        }
        sectionElement.appendChild(temp);
    });
    //add section to page.
    document.getElementById('pageBody').appendChild(sectionElement);
}
//fetch data from api
async function fetchApiData(){ 
    displayLoading();
    fetch('https://json-bins.herokuapp.com/bin/614b6c99e352a453bebed525')
  .then(response => response.json())
  .then(data => {
      hideLoading();
      window.localStorage.setItem('tasks', JSON.stringify(data.tasks));

    });
}
//update api data
function stroeDataInApi(tasks){
    displayLoading();
    data = {"_id":"614b6c99e352a453bebed525","name":"dor","tasks":tasks,"createdAt":"2021-09-22T17:49:13.555Z","updatedAt":`${new Date().toLocaleString()}`}
    const putMethod = {
        method: 'PUT', // Method itself
        headers: {
         'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
        },
        body: JSON.stringify(data) // We send data in JSON format
       }
    // make the HTTP put request using fetch api
    fetch('https://json-bins.herokuapp.com/bin/614b6c99e352a453bebed525', putMethod)
    .then(response => response.json())
    .then(data => hideLoading()) // Manipulate the data retrieved back, if we want to do something with it
    .catch(err => console.log(err)) // Do something with the error
}
//use bootstraps to style page
function bootstrapsClassSelctor(){
    sections = document.querySelectorAll('section');
    let index = 0;
    sections.forEach(section => {
        section.classList.add('card');
        section.classList.add('m-5');
        section.classList.add('p-5');

        section.classList.add('bg-success');
        section.classList.add('bg-gradient');
        buttons = document.getElementById(section.id).querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.add('btn');
            button.classList.add('btn-primary')
        });
        index++;
    }); 
    uls = document.querySelectorAll('ul');
    uls.forEach(ul => {
        ul.classList.add('list-group');
        ul.classList.add('list-group-flush')
    });
    lis = document.querySelectorAll('li');
    lis.forEach(li => {
        li.classList.add('list-group-item');
    });
    header = document.getElementById('pageHeader');
    header.classList.add('navbar');
    header.classList.add('navbar-expand-lg');
    header.classList.add('navbar-light');
    header.classList.add('bg-light');
    header.classList.add('bg-gradient');

    body = document.getElementById('pageBody');
    body.classList.add('justify-content-center');
    body.style.display = 'flex';

}

//#region drag and drop
function dragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    sections = document.querySelectorAll('section');
    sections.forEach(section => {
    });
    
  };
   
  function dragEnter(e) {
    this.classList.add('over');
  }
   
  function dragLeave(e) {
    e.stopPropagation();
    this.classList.remove('over');
    
  }
   
  function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }
   
  function dragDrop(e) {
    if (dragSrcEl != this) {
        console.log(dragSrcEl);
        dragSrcEl.remove();
        createLiElement(e.target.parentElement.parentElement, dragSrcEl.textContent);
        sections = document.querySelectorAll('section');
        let tasks = {};
        sections.forEach(section => {
            tasks[section.id] = [];
            allLi = section.querySelectorAll('ul')[0].querySelectorAll('li');
            allLi.forEach(li => {
                tasks[section.id].push(li.textContent);
            });
        });
        console.log(tasks);
        stroeDataInApi(tasks);
        fetchApiData(tasks);
        bootstrapsClassSelctor();
        // this.textContent = e.dataTransfer.getData('text/html');
    }
    return false;
  }
   
  function dragEnd(e) {
    var listItens = document.querySelectorAll('.draggable');
    [].forEach.call(listItens, function(item) {
      item.classList.remove('over');
    });
    this.style.opacity = '1';
  }
   
  function addEventsDragAndDrop(el) {
    el.addEventListener('dragstart', dragStart, false);
    el.addEventListener('dragenter', dragEnter, false);
    el.addEventListener('dragover', dragOver, false);
    el.addEventListener('dragleave', dragLeave, false);
    el.addEventListener('drop', dragDrop, false);
    el.addEventListener('dragend', dragEnd, false);
  }
   
  function addNewItem() {
    var newItem = document.querySelector('.input').value;
    if (newItem != '') {
      document.querySelector('.input').value = '';
      var li = document.createElement('li');
      var attr = document.createAttribute('draggable');
      var ul = document.querySelector('ul');
      li.className = 'draggable';
      attr.value = 'true';
      li.setAttributeNode(attr);
      li.appendChild(document.createTextNode(newItem));
      ul.appendChild(li);
      addEventsDragAndDrop(li);
    }
  }
   

var listItens = document.querySelectorAll('.draggable');
[].forEach.call(listItens, function(item) {
    addEventsDragAndDrop(item);
});
   
//#endregion


//#region loader
const loader = document.querySelector("#loading");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("display");
    }, 5000);
}

// hiding loading 
function hideLoading() {
    loader.classList.remove("display");
}

//#endregion

//intilaize the local stroage if empty
if (localStorage.getItem("tasks") === null){
    window.localStorage.setItem('tasks', JSON.stringify(
    {
        "todo": [],
        "in-progress": [],
        "done": []
    }));
}

createPageStructure();
bootstrapsClassSelctor();
