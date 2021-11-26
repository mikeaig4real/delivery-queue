// variables
const listsDom = document.querySelector("body > main > aside > div");
const cells = document.querySelectorAll("body > main > section > table > tbody > tr > td");
const days = document.querySelectorAll('.date');


//get deliveries
class Data {
    static async getData() {
        const data = await fetch('customers.json');
        const dataJson = await data.json();
        loadItems(dataJson.customers);
    }
}

function afterSeven() {
    const currentDate = new Date();
    const [month, day, year] = [currentDate.getMonth(), currentDate.getDate(), currentDate.getFullYear()];
    const nextDays = [7, 8, 9, 10, 11, 12, 13].map((num) => {
        return new Date(year, month, day + num).toUTCString().slice(0,-13);
    });
    return nextDays;
}

function handleDragStart(e) {
    let parent = e.target.parentElement;
    if (parent.id.includes('cell')) {
        parent.dataset.empty = 'true';
    }
    e.dataTransfer.setData("application/my-app", e.target.id);
    e.effectAllowed = "move";
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const dataId = e.dataTransfer.getData("application/my-app");
    const element = document.getElementById(dataId);
    if (e.target.id === 'list-dom') {
        e.target.appendChild(element);
    }
    if (e.target.dataset.empty === 'true') {
        // add deliveries
        e.target.appendChild(element);
        e.target.dataset.empty = 'false';
        element.dataset.incell = 'true';
    } else {
        // swap deliveries
        if (element.dataset.incell === 'true' && e.target.id.includes('cell')) {
            const parentCell = element.parentElement;
            parentCell.appendChild(e.target.firstChild);
            parentCell.dataset.empty = 'false';
            e.target.appendChild(element);
            e.target.dataset.empty = 'false';
        }
    }
}


function loadItems(data) {
    // prepare deliveries
    data.forEach((data, index) => {
        const { id, name, up, off } = data;
        const article = document.createElement('article');
        article.innerHTML = `customer: <span class="name">${name}</span><br>
                             id: <span class="id">${id}</span><br>
                             pick up at: <span class="up">${up}</span><br>
                             drop off at: <span class="off">${off}</span>
                             `;
        article.id = `list${index}`;
        article.draggable = 'true';
        article.addEventListener('dragstart', handleDragStart);
        article.dataset.incell = 'false';
        listsDom.appendChild(article);
    });
    // prepare cells
    cells.forEach((cell, index) => {
        cell.id = `cell${index}`;
        cell.addEventListener('dragover', handleDragOver);
        cell.addEventListener('drop', handleDrop);
        cell.dataset.empty = 'true';
    });
    listsDom.addEventListener('dragover', handleDragOver);
    listsDom.addEventListener('drop', handleDrop);
    const next7Days = afterSeven();
    days.forEach((day,id) => {
        day.innerText = next7Days[id];
    })
}









// dom loaded
document.addEventListener('DOMContentLoaded', () => {
    Data.getData();
});
