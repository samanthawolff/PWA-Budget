let db;


const request = indexedDB.open('budget_tracker', 1);


// If database version updates
request.onupgradeneeded = function(event) {
    const db = event.target.result;

    db.createObjectStore('new_transaction', { autoIncrement: true });
};   


// If successful
request.onnsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        // function here
    }
};


// If error, console.log error
request.onerror = function(event) {
    console.log(event.target.errorCode);
};


function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_transaction');

    budgetObjectStore.add(record);
};


function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_transaction');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }

                const transaction = db.transaction(['new_transaction'], 'readwrite');
                const budgetObjectStore = transaction.objectStore('new_transaction');

                budgetObjectStore = transaction.objectStore('new_transaction');
                budgetObjectStore.clear();
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
};


window.addEventListener('online', uploadTransaction);