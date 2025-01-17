let timeLeft;
let timerId = null;
let isBreakTime = false;
let currentTask = null;
let subtasks = [];

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const focusButtons = document.querySelector('.focus-buttons');
const breakButtons = document.querySelector('.break-buttons');
const workModeBtn = document.getElementById('workModeBtn');
const breakModeBtn = document.getElementById('breakModeBtn');
const addTimeBtn = document.getElementById('addTimeBtn');
const taskModal = document.getElementById('taskModal');
const breakdownModal = document.getElementById('breakdownModal');
const currentTaskDiv = document.getElementById('currentTask');
const taskDisplay = document.getElementById('taskDisplay');
const subtasksDisplay = document.getElementById('subtasksDisplay');

function setTimer(minutes) {
    if (timerId) return;
    
    // Show task input modal before starting timer
    taskModal.style.display = 'flex';
    // Store minutes for later use
    pendingMinutes = minutes;
}

function submitTask() {
    const taskInput = document.getElementById('taskInput');
    if (taskInput.value.trim()) {
        currentTask = taskInput.value.trim();
        taskModal.style.display = 'none';
        breakdownModal.style.display = 'flex';
    }
}

function skipTaskInput() {
    taskModal.style.display = 'none';
    startTimerWithDuration();
}

function addSubtaskInput() {
    const subtasksList = document.getElementById('subtasksList');
    const newInput = document.createElement('div');
    newInput.className = 'subtask-input';
    newInput.innerHTML = '<input type="text" placeholder="Enter subtask...">';
    subtasksList.appendChild(newInput);
}

function saveSubtasks() {
    subtasks = [];
    const inputs = document.querySelectorAll('#subtasksList input');
    inputs.forEach(input => {
        if (input.value.trim()) {
            subtasks.push(input.value.trim());
        }
    });
    breakdownModal.style.display = 'none';
    startTimerWithDuration();
    displayCurrentTask();
}

function keepTaskAsIs() {
    breakdownModal.style.display = 'none';
    startTimerWithDuration();
    displayCurrentTask();
}

function cancelTaskInput() {
    currentTask = null;
    subtasks = [];
    breakdownModal.style.display = 'none';
    taskModal.style.display = 'none';
    startTimerWithDuration();
}

function displayCurrentTask() {
    if (currentTask) {
        taskDisplay.textContent = currentTask;
        subtasksDisplay.innerHTML = '';
        if (subtasks.length > 0) {
            subtasks.forEach(subtask => {
                const div = document.createElement('div');
                div.textContent = `• ${subtask}`;
                subtasksDisplay.appendChild(div);
            });
        }
        currentTaskDiv.style.display = 'block';
    } else {
        currentTaskDiv.style.display = 'none';
    }
}

function startTimerWithDuration() {
    timeLeft = pendingMinutes * 60;
    updateDisplay();
    isBreakTime = false;
    addTimeBtn.style.display = 'block';
}

function setBreak(minutes) {
    if (timerId) return;
    timeLeft = minutes * 60;
    updateDisplay();
    isBreakTime = true;
    addTimeBtn.style.display = 'none';
}

function toggleMode(mode) {
    if (timerId) return; // Don't allow mode switching while timer is running
    
    if (mode === 'work') {
        workModeBtn.classList.add('active');
        breakModeBtn.classList.remove('active');
        focusButtons.style.display = 'block';
        breakButtons.style.display = 'none';
    } else {
        workModeBtn.classList.remove('active');
        breakModeBtn.classList.add('active');
        focusButtons.style.display = 'none';
        breakButtons.style.display = 'block';
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
                    toggleMode('break');
                } else {
                    toggleMode('work');
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
    currentTask = null;
    subtasks = [];
    displayCurrentTask();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function addTime(minutes) {
    if (!timerId || isBreakTime) return; // Only work during active work sessions
    timeLeft += minutes * 60;
    updateDisplay();
}

function playAlarm() {
    const audio = new Audio('data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9I...(line too long; chars omitted)');
    audio.play();
} 