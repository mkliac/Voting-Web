/*let myLeads = []
const inputUrlEl = document.getElementById("inputUrl-el")
const inputUrlNameEl = document.getElementById("inputUrlName-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if(inputUrlNameEl.value === "")
            myLeads.push([tabs[0].url,tabs[0].url])
        else{
            myLeads.push([tabs[0].url,inputUrlNameEl.value])
            inputUrlNameEl.value = ""
        }
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    })
})

function render(leads) {
    ulEl.innerHTML = ''
    for(let i = 0; i < leads.length; i++){
        let URLItem = document.createElement("li")
        let URLLink = createURLLink(leads[i])
        let deleteLink = createDeleteLink(URLItem,URLLink)
        URLItem.appendChild(URLLink)
        URLItem.appendChild(deleteLink)
        ulEl.appendChild(URLItem)
    }
}

function createDeleteLink(URLItem,URLLink){
    let deleteLink = document.createElement("a")
    deleteLink.textContent = "[Delete]"
    deleteLink.addEventListener("click",function(){
        let index = -1
        for(let i = 0; i < myLeads.length; i++){
            if(myLeads[i][1] === URLLink.textContent){
                index = i
                break
            }
        }
        if(index > -1){
            myLeads.splice(index,1)
        }
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        ulEl.removeChild(URLItem)
    })
    return deleteLink
}

function createURLLink(URL){
    let URLLink = document.createElement('a')
    URLLink.href = URL[0]
    URLLink.textContent = URL[1]
    URLLink.target = '_blank'
    return URLLink
}

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
    myLeads.push([inputUrlEl.value,inputUrlNameEl.value])
    inputUrlEl.value = ""
    inputUrlNameEl.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads) )
    render(myLeads)
})*/
class Post{
    constructor(author, question, items){
        this.question = question;
        this.author = author;
        this.items = items;
        this.clickCount = 0;
        this.activated = false;
    }

    incrementClickCount(){
        this.clickCount += 1;
    }

    decrementClickCount(){
        this.clickCount -= 1;
    }

    activate(){
        this.activated = true;
    }
}

class Item{
    constructor(name){
        this.vote = 0;
        this.name = name;
    }

    incrementVote(){
        this.vote += 1;
    }

    decrementVote(){
        this.vote -= 1;
    }
}

let posts = [];
const nameEl = document.getElementById("name-el");
const questionEl = document.getElementById("question-el");
const itemEl = document.getElementById("item-el");
const postBtn = document.getElementById("post-btn");
const clearBtn = document.getElementById("clear-btn");
const postlistEl = document.getElementById("postlist-el");
const addBtn = document.getElementById("add-btn");
const addInfo = document.getElementById("add-info");

addBtn.addEventListener("click", function(){
    if(addBtn.innerText === "+"){
        addInfo.style.display = "block"; 
        addBtn.innerText = "-";   
    }else{
        addInfo.style.display = "none";
        addBtn.innerText = "+";
    }
})

function renderPosts(posts){
    postlistEl.innerHTML = "";
    for(let i = 0; i < posts.length; i++){
        postlistEl.appendChild(renderPost(posts[i]));
    }
}

function renderPost(post){
    let newPost = document.createElement("div");
    newPost.className = "post";
    newPost.innerHTML = `<h1 class="post-question">${post.question}</h1>
                        <h3 class="post-author">${post.author}</h3>`;
    let items = document.createElement("ul");
    items.className = "post-items";
    for(let i = 0; i < post.items.length; i++){
        items.appendChild(createItemEl(post, post.items[i]));
    }
    
    newPost.appendChild(items);
    return newPost;
}

function createItemEl(post, item){
    let itemName = document.createElement("p");
    itemName.className = "post-items-item-name";
    itemName.textContent = item.name;

    let itemPercentage = document.createElement("p");
    itemPercentage.className = "post-items-item-percentage";
    if(post.clickCount === 0){
        itemPercentage.textContent = "0%";
    }else{
        itemPercentage.textContent = (item.vote*100.0/post.clickCount).toFixed(1) + "%";
    }

    let percentageBar = document.createElement("div");
    percentageBar.className = "post-items-item-colorBar";
    
    let newItem = document.createElement("li");
    newItem.className = "post-items-item";
    newItem.appendChild(itemName);
    newItem.appendChild(itemPercentage);
    newItem.appendChild(percentageBar);

    newItem.addEventListener("click", function(){
        item.incrementVote();
        post.incrementClickCount();
        post.activate();
        renderPosts(posts);
    })

    if(post.activated === true){
        percentageBar.style.width = item.vote*100.0/post.clickCount + "%";
        percentageBar.style.backgroundColor = "rgb(248, 94, 248)";
        itemPercentage.style.opacity = 1;
    }

    return newItem;
}
postBtn.addEventListener("click", function(){
    if(checkValidInput() === false)
        return;
    let items = parseItems(itemEl.value);
    posts.push(new Post(nameEl.value,questionEl.value, items));
    renderPosts(posts);
    clear();
})

function parseItems(itemsString){
    let items = [];
    for(let i = 0, t = ""; i < itemsString.length; i++){
        if(itemsString[i] != "/")
            t += itemsString[i];
        if(itemsString[i] == "/" || i == itemsString.length-1){
            items.push(new Item(t));
            t = "";
        }
    }
    
    return items;
}
clearBtn.addEventListener("click", clear)

function clear(){
    nameEl.value = "";
    questionEl.value = "";
    itemEl.value = "";
}

function checkValidInput(){
    if(nameEl.value === "") 
        nameEl.value = "anonymous";
    
    if(questionEl.value === ""){
        console.log("Please Type The Question");
        return false;    
    }
    
    if(itemEl.value === ""){
        console.log("Please Type the Items");
        return false;
    }
    
    return true;
}