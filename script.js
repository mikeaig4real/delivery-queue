const bedrug = document.querySelector('.bedraggled');
const drop = document.querySelector('.dropped');

function handleDragStart(e) {
    e.dataTransfer.setData("application/my-app", e.target.id);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.dropEffect = "copy";
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("application/my-app");
    e.target.appendChild(document.getElementById(data));
}










// dom loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log(bedrug);
    console.log(drop);
    bedrug.addEventListener('dragstart', handleDragStart);
    drop.addEventListener('dragover', handleDragOver);
    drop.addEventListener('drop', handleDrop);
});