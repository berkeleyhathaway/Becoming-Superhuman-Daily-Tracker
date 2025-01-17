let timeLeft;
let timerId = null;
let isBreakTime = false;
let currentMITs = [];
let currentMIT = null;
let selectedTaskForSprint = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const modeLabel = document.getElementById('modeLabel');
const startBtn = document.getElementById('startBtn');
const focusButtons = document.querySelector('.focus-buttons');
const breakButtons = document.querySelector('.break-buttons');
const workModeBtn = document.getElementById('workModeBtn');
const breakModeBtn = document.getElementById('breakModeBtn');
const addTimeBtn = document.getElementById('addTimeBtn');
const breakSuggestions = document.getElementById('breakSuggestions');
const mitForm = document.getElementById('mitForm');
const mitInput = document.getElementById('mitInput');
const breakdownForm = document.getElementById('breakdownForm');
const subtaskForm = document.getElementById('subtaskForm');
const subtaskList = document.getElementById('subtaskList');
const mitList = document.getElementById('mitList');
const sprintTaskSelect = document.getElementById('sprintTaskSelect');
const sprintTaskOptions = document.getElementById('sprintTaskOptions');

function setTimer(minutes) {
    if (timerId) return;
    
    // Show task selection before starting timer
    sprintTaskSelect.style.display = 'block';
    renderTaskOptions();
    
    // Store the minutes for later use
    pendingMinutes = minutes;
}

function setBreak(minutes) {
    if (timerId) return; // Prevent setting timer while it's running
    timeLeft = minutes * 60;
    updateDisplay();
    isBreakTime = true;
    addTimeBtn.style.display = 'none';
    modeLabel.textContent = `${minutes} Minute Brain Break`;
    breakSuggestions.style.display = 'none'; // Hide suggestions when break starts
}

function toggleMode(mode) {
    if (timerId) return; // Don't allow mode switching while timer is running
    
    if (mode === 'work') {
        workModeBtn.classList.add('active');
        breakModeBtn.classList.remove('active');
        focusButtons.style.display = 'block';
        breakButtons.style.display = 'none';
        modeLabel.textContent = 'Select Focus Sprint Duration';
        breakSuggestions.style.display = 'none';
    } else {
        workModeBtn.classList.remove('active');
        breakModeBtn.classList.add('active');
        focusButtons.style.display = 'none';
        breakButtons.style.display = 'block';
        modeLabel.textContent = 'Select Brain Break Duration';
        breakSuggestions.style.display = 'block'; // Show break suggestions in break mode
    }
}

function startTimer() {
    if (!timeLeft) return; // Don't start if no time is set
    
    if (timerId) {
        // Pause timer
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = 'Start';
    } else {
        // Start timer
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                startBtn.textContent = 'Start';
                playAlarm();
                
                if (!isBreakTime) {
                    // Automatically switch to break mode after focus sprint
                    toggleMode('break');
                    modeLabel.textContent = 'Focus Sprint complete! Select Brain Break Duration';
                } else {
                    toggleMode('work');
                    modeLabel.textContent = 'Brain Break finished! Select new Focus Sprint Duration';
                }
            }
        }, 1000);
        startBtn.textContent = 'Pause';
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 0;
    updateDisplay();
    startBtn.textContent = 'Start';
    toggleMode('work');
    breakSuggestions.style.display = 'none';
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function playAlarm() {
    const audio = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
    audio.play();
}

function addTime(minutes) {
    if (!timerId || isBreakTime) return; // Only work during active work sessions
    timeLeft += minutes * 60;
    updateDisplay();
}

function showMITForm() {
    mitForm.style.display = 'block';
    mitInput.focus();
}

function hideMITForm() {
    mitForm.style.display = 'none';
    mitInput.value = '';
}

function askForBreakdown() {
    if (!mitInput.value.trim()) return;
    currentMIT = {
        title: mitInput.value.trim(),
        subtasks: [],
        completed: false
    };
    mitForm.style.display = 'none';
    breakdownForm.style.display = 'block';
}

function showSubtaskForm() {
    breakdownForm.style.display = 'none';
    subtaskForm.style.display = 'block';
    subtaskList.innerHTML = `
        <div class="subtask-input">
            <input type="text" placeholder="Subtask">
            <input type="number" placeholder="Minutes" min="1">
        </div>
    `;
}

function addSubtaskInput() {
    const newInput = document.createElement('div');
    newInput.className = 'subtask-input';
    newInput.innerHTML = `
        <input type="text" placeholder="Subtask">
        <input type="number" placeholder="Minutes" min="1">
    `;
    subtaskList.appendChild(newInput);
}

function saveMITWithSubtasks() {
    const subtaskInputs = subtaskList.querySelectorAll('.subtask-input');
    subtaskInputs.forEach(input => {
        const title = input.querySelector('input[type="text"]').value.trim();
        const minutes = input.querySelector('input[type="number"]').value;
        if (title && minutes) {
            currentMIT.subtasks.push({
                title,
                estimatedMinutes: parseInt(minutes),
                completed: false
            });
        }
    });
    
    currentMITs.push(currentMIT);
    renderMITs();
    hideSubtaskForm();
}

function saveMITWithoutBreakdown() {
    currentMITs.push(currentMIT);
    renderMITs();
    breakdownForm.style.display = 'none';
}

function hideSubtaskForm() {
    subtaskForm.style.display = 'none';
    currentMIT = null;
}

function renderMITs() {
    mitList.innerHTML = '';
    currentMITs.forEach((mit, index) => {
        const mitElement = document.createElement('div');
        mitElement.className = 'mit-item' + (mit.subtasks.length ? ' has-subtasks' : '');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = mit.completed;
        checkbox.onchange = () => toggleMITComplete(index);
        
        mitElement.appendChild(checkbox);
        mitElement.appendChild(document.createTextNode(' ' + mit.title));
        
        if (mit.subtasks.length) {
            const subtasksList = document.createElement('div');
            subtasksList.className = 'subtask-list';
            mit.subtasks.forEach((subtask, subIndex) => {
                const subtaskElement = document.createElement('div');
                const subtaskCheckbox = document.createElement('input');
                subtaskCheckbox.type = 'checkbox';
                subtaskCheckbox.checked = subtask.completed;
                subtaskCheckbox.onchange = () => toggleSubtaskComplete(index, subIndex);
                
                subtaskElement.appendChild(subtaskCheckbox);
                subtaskElement.appendChild(document.createTextNode(
                    ` ${subtask.title} (${subtask.estimatedMinutes}min)`
                ));
                subtasksList.appendChild(subtaskElement);
            });
            mitElement.appendChild(subtasksList);
            mitElement.onclick = () => toggleSubtaskList(mitElement);
        }
        
        mitList.appendChild(mitElement);
    });
}

function toggleSubtaskList(mitElement) {
    const subtaskList = mitElement.querySelector('.subtask-list');
    if (subtaskList) {
        subtaskList.classList.toggle('show');
    }
}

function toggleMITComplete(index) {
    currentMITs[index].completed = !currentMITs[index].completed;
    renderMITs();
}

function toggleSubtaskComplete(mitIndex, subtaskIndex) {
    currentMITs[mitIndex].subtasks[subtaskIndex].completed = 
        !currentMITs[mitIndex].subtasks[subtaskIndex].completed;
    renderMITs();
}

function renderTaskOptions() {
    sprintTaskOptions.innerHTML = '';
    currentMITs.forEach((mit, index) => {
        if (!mit.completed) {
            const option = document.createElement('div');
            option.className = 'task-option';
            option.textContent = mit.title;
            option.onclick = () => selectTaskForSprint(index);
            sprintTaskOptions.appendChild(option);
            
            if (mit.subtasks.length) {
                mit.subtasks.forEach((subtask, subIndex) => {
                    if (!subtask.completed) {
                        const subOption = document.createElement('div');
                        subOption.className = 'task-option subtask';
                        subOption.textContent = `→ ${subtask.title}`;
                        subOption.onclick = () => selectTaskForSprint(index, subIndex);
                        sprintTaskOptions.appendChild(subOption);
                    }
                });
            }
        }
    });
}

function selectTaskForSprint(mitIndex, subtaskIndex = null) {
    selectedTaskForSprint = { mitIndex, subtaskIndex };
    
    // Update visual selection
    document.querySelectorAll('.task-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Start the timer with the previously stored minutes
    timeLeft = pendingMinutes * 60;
    updateDisplay();
    isBreakTime = false;
    addTimeBtn.style.display = 'block';
    modeLabel.textContent = `${pendingMinutes} Minute Focus Sprint`;
    breakButtons.style.display = 'none';
    breakSuggestions.style.display = 'none';
    sprintTaskSelect.style.display = 'none';
} 