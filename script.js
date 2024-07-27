let currentTab = 0;
let tabs = [{ name: 'notepad', content: '', format: 'txt' }];

function updateTabs() {
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML = '';

    tabs.forEach((tab, index) => {
        const tabElement = document.createElement('div');
        tabElement.className = 'tab' + (index === currentTab ? ' active' : '');
        tabElement.innerText = `${tab.name}.${tab.format}`;
        tabElement.onclick = () => switchTab(index);
        tabsContainer.appendChild(tabElement);
    });

    document.getElementById('notepad').value = tabs[currentTab].content;
    document.getElementById('filename').value = tabs[currentTab].name;
    document.getElementById('fileFormat').value = tabs[currentTab].format;
}

function addTab() {
    const newTab = { name: 'untitled', content: '', format: 'txt' };
    tabs.push(newTab);
    switchTab(tabs.length - 1);
}

function switchTab(index) {
    tabs[currentTab].content = document.getElementById('notepad').value;
    currentTab = index;
    updateTabs();
}

function deleteCurrentTab() {
    if (tabs[currentTab].content && !confirm('This tab contains text. Are you sure you want to close it?')) {
        return;
    }
    tabs.splice(currentTab, 1);
    if (tabs.length === 0) {
        tabs.push({ name: 'notepad', content: '', format: 'txt' });
    }
    currentTab = Math.max(0, currentTab - 1);
    updateTabs();
}

function exportText() {
    const text = document.getElementById('notepad').value;
    const filename = document.getElementById('filename').value || 'notepad';
    const format = document.getElementById('fileFormat').value || 'txt';
    const blob = new Blob([text], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = `${filename}.${format}`;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target = '_blank';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

function importText() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        document.getElementById('notepad').value = text;
        const filename = file.name.replace(/\.[^/.]+$/, '');
        const format = file.name.split('.').pop();
        document.getElementById('filename').value = filename;
        document.getElementById('fileFormat').value = format;
        tabs[currentTab].name = filename;
        tabs[currentTab].format = format;
        tabs[currentTab].content = text;
        updateTabs();
    };
    reader.readAsText(file);
}

function updateFilename() {
    const filename = document.getElementById('filename').value;
    const format = document.getElementById('fileFormat').value;
    tabs[currentTab].name = filename;
    tabs[currentTab].format = format;
    const content = document.getElementById('notepad').value;
    tabs[currentTab].content = content; // Preserve the content
    updateTabs();
}

document.addEventListener('DOMContentLoaded', () => {
    updateTabs();
});