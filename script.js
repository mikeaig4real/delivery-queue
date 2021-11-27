// variables
const listsDom = document.querySelector("body > main > aside > div");
const cells = document.querySelectorAll("body > main > section > table > tbody > tr > td");
const days = document.querySelectorAll('.date');


//get deliveries
class Data {
    static async getData() {
        const data = await fetch('customers.json');
        const dataJson = await data.json();
        let starter = Storage.getItems();
        if (starter[0]) {
            loadItems(starter[0]);
            return;
        }
        loadItems(dataJson.customers);
    }
}

// get seven days after current date
function afterSeven() {
    const currentDate = new Date();
    const [month, day, year] = [currentDate.getMonth(), currentDate.getDate(), currentDate.getFullYear()];
    const nextDays = [8, 9, 10, 11, 12, 13, 14].map((num) => {
        return new Date(year, month, day + num).toUTCString().slice(0,-13);
    });
    return nextDays;
}

// All event listeners

// handle drag start
function handleDragStart(e) {
    let parent = e.target.parentElement;
    if (parent.id.includes('cell')) {
        parent.dataset.empty = 'true';
    }
    e.dataTransfer.setData("application/my-app", e.target.id);
    e.effectAllowed = "move";
}

// handle drag over
function handleDragOver(e) {
    e.preventDefault();
}

// handle drop
function handleDrop(e) {
    e.preventDefault();
    const dataId = e.dataTransfer.getData("application/my-app");
    const element = document.getElementById(dataId);
    // returning the element to list
    if (e.target.id === 'list-dom') {
        e.target.appendChild(element);
        Storage.setItems();
    }

    // placing in a cell
    if (e.target.dataset.empty === 'true') {
        // add deliveries
        e.target.appendChild(element);
        // set cells empty value
        e.target.dataset.empty = 'false';
        // set items incell value
        element.dataset.incell = 'true';
        Storage.setItems();
    } else {
        // swap deliveries
        if (element.dataset.incell === 'true' && e.target.id.includes('cell')) {
            // get parent of item to swap with
            const parentCell = element.parentElement;
            // append that child to it
            parentCell.appendChild(e.target.firstChild);
            parentCell.dataset.empty = 'false';
            // do the same to the other
            e.target.appendChild(element);
            e.target.dataset.empty = 'false';
            // set both cell empty values to be false
            Storage.setItems();
        }
    }
}

// control UI
function loadItems(data) {
    // prepare deliveries
    data.forEach((data, index) => {
        const { id, name, up, off } = data;
        // console.log(data);
        const article = document.createElement('article');
        article.innerHTML = `customer: <span class="name">${name}</span><br>
                             id: <span class="id">${id}</span><br>
                             pick up at: <span class="up">${up}</span><br>
                             drop off at: <span class="off">${off}</span>
                             `;
        article.id = data.mainid || `list${index}`;
        article.draggable = 'true';
        article.addEventListener('dragstart', handleDragStart);
        article.dataset.incell = data.incell || 'false';
        listsDom.appendChild(article);
    });
    // Storage.setItems();
    // prepare cells
    cells.forEach((cell, index) => {
        cell.id = `cell${index}`;
        cell.addEventListener('dragover', handleDragOver);
        cell.addEventListener('drop', handleDrop);
        cell.dataset.empty = 'true';
    });
    let starter = Storage.getItems();
    if (starter[1]) {
        // console.log(starter[1])
        starter[1].forEach((cell) => {
            let { cellid,listname, listid, listup, listoff, listincell, cellempty, listmainid } = cell;
            let cellEle = document.getElementById(cellid);
            // console.log(cellEle);
            if (cellEle) {
                const article = document.createElement('article');
                article.innerHTML = `customer: <span class="name">${listname}</span><br>
                                id: <span class="id">${listid}</span><br>
                                pick up at: <span class="up">${listup}</span><br>
                                drop off at: <span class="off">${listoff}</span>
                                `;
                article.id = listmainid;
                article.draggable = 'true';
                cellEle.dataset.empty = cellempty;
                article.addEventListener('dragstart', handleDragStart);
                article.dataset.incell = listincell;
                cellEle.appendChild(article);
            }
        });
    }
    // add event on lists dom
    listsDom.addEventListener('dragover', handleDragOver);
    listsDom.addEventListener('drop', handleDrop);
    const next7Days = afterSeven();
    // display seven days
    days.forEach((day, id) => {
        day.innerText = next7Days[id];
    });
}


class Storage {
    static setItems() {
        let deliveriesList = [];
        listsDom.querySelectorAll('article').forEach((list) => {
            if (list) {
                const listObj = {};
                listObj.mainid = list.id;
                listObj.name = list.querySelector('.name').innerText;
                listObj.id = list.querySelector('.id').innerText;
                listObj.up = list.querySelector('.up').innerText;
                listObj.off = list.querySelector('.off').innerText;
                listObj.incell = list.dataset.incell;
                deliveriesList = [...deliveriesList, listObj];
            };
        });
        let cellsList = [];
        cells.forEach((cell) => {
            if (cell.firstChild) {
                const cellObj = {};
                cellObj.cellid = cell.id;
                cellObj.listname = cell.querySelector('.name').innerText;
                cellObj.listid = cell.querySelector('.id').innerText;
                cellObj.listup = cell.querySelector('.up').innerText;
                cellObj.listoff = cell.querySelector('.off').innerText;
                cellObj.listincell = cell.firstChild.dataset.incell;
                cellObj.listmainid = cell.firstChild.id
                cellObj.cellempty = cell.dataset.empty;
                cellsList = [...cellsList, cellObj];
            };
        });
        localStorage.setItem('delivery',JSON.stringify(deliveriesList));
        localStorage.setItem('cells',JSON.stringify(cellsList));
    }

    static getItems() {
        const deliveriesList = JSON.parse(localStorage.getItem('delivery'));
        const cellsList = JSON.parse(localStorage.getItem('cells'));
        return [deliveriesList, cellsList];
    }
}









// dom loaded
document.addEventListener('DOMContentLoaded', () => {
    Data.getData();
});
