const resultBox = document.querySelector(".result");
const inputBox = document.getElementById("input-box");
const resultBtnBox = document.querySelector(".result-btn");

let jsonData = {};

fetch('result.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data;
    })
    .catch(error => console.error('Error fetching JSON:', error));

inputBox.onkeyup = function() {
    let result = [];
    let input = inputBox.value.toLowerCase().trim();

    if (input.length) {
        jsonData.messages.forEach(message => {
            message.text_entities.forEach(entity => {
                if (entity.text.toLowerCase().includes(input)) {
                    result.push(entity.text);
                }
            });
        });
    }

    displayResults(result, input);
};

function displayResults(results, input) {
    resultBox.innerHTML = "";
    results.forEach(result => {
        const div = document.createElement("div");
        const maxLength = 140; // Максимальна довжина для показу
        let displayText = formatText(result, input);
        
        if (displayText.length > maxLength) {
            const shortText = displayText.slice(0, maxLength) + "...";
            const showMoreButton = document.createElement("button");
            showMoreButton.textContent = "Show more";
            
            const showLessButton = document.createElement("button");
            showLessButton.textContent = "Show less";
            showLessButton.style.display = "none"; // Сховати кнопку спочатку
            
            div.innerHTML = shortText; // Показати скорочений текст
            div.appendChild(showMoreButton); // Додати кнопку "Show more"

            showMoreButton.addEventListener("click", function() {
                div.innerHTML = displayText; // Показати повний текст
                div.appendChild(showLessButton); // Додати кнопку "Show less"
                showMoreButton.style.display = "none"; // Сховати кнопку "Show more"
                showLessButton.style.display = "inline"; // Показати кнопку "Show less"
            });

            showLessButton.addEventListener("click", function() {
                div.innerHTML = shortText; // Показати скорочений текст
                div.appendChild(showMoreButton); // Додати кнопку "Show more"
                showLessButton.style.display = "none"; // Сховати кнопку "Show less"
                showMoreButton.style.display = "inline"; // Показати кнопку "Show more"
            });
        } else {
            div.innerHTML = displayText;
        }
        
        resultBox.appendChild(div);
    });
}

function formatText(text, term) {
    // Спочатку виділяємо терміни
    let highlightedText = highlightText(text, term);
    // Потім замінюємо символи нового рядка на <br>
    return highlightedText.replace(/\n/g, '<br>');
}

function highlightText(text, term) {
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index !== -1) {
        return insertMark(text, index, term.length);
    }
    return text;
}

function insertMark(string, pos, len) {
    return string.slice(0, pos) + "<mark>" + string.slice(pos, pos + len) + "</mark>" + string.slice(pos + len);
}

// function displayResults(results, input) {
//     resultBox.innerHTML = "";
//     results.forEach(result => {
//         const div = document.createElement("div");
//         const maxLength = 140; // Максимальна довжина для показу
//         let displayText = formatText(result, input);
        
//         if (displayText.length > maxLength) {
//             const shortText = displayText.slice(0, maxLength) + "...";
//             const showMoreButton = document.createElement("button");
//             showMoreButton.textContent = "Show more";
//             showMoreButton.addEventListener("click", function() {
//                 div.innerHTML = displayText; // Показати повний текст
//             });
//             div.innerHTML = shortText;
//             div.appendChild(showMoreButton);
//         } else {
//             div.innerHTML = displayText;
//         }
        
//         resultBox.appendChild(div);
//     });
// }