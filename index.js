const manageSpinner = (isLoading) => {
    const spinnerSection = document.getElementById("loading-spinner");
    if (isLoading == true) {
        spinnerSection.classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        spinnerSection.classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
};

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((res) => res.json())
        .then((data) => dispalyLesson(data));
};

const clearActiveButtons = () => {
    const lessonButtons = document.getElementsByClassName("lessonBtn");
    for (let btn of lessonButtons) {
        btn.classList.remove("btn-active");
    }
};

const loadLevelWords = (levelNo) => {
    // console.log(levelNo);
    manageSpinner(true);
    fetch(`https://openapi.programming-hero.com/api/level/${levelNo}`)
        .then((res) => res.json())
        .then((data) => {
            clearActiveButtons();
            const clickBtn = document.getElementById(`lessonBtn-${levelNo}`);
            clickBtn.classList.add("btn-active");
            displayLevelWords(data.data);
        });
};

const loadWordDetails = async (wordId) => {
    const url = `https://openapi.programming-hero.com/api/word/${wordId}`;
    const res = await fetch(url);
    const data = await res.json();

    displayWordDetails(data.data);
};

const creatElements = (arr) => {
    const htmlElements = arr
        .map(
            (item) =>
                `<span class="badge badge-secondary mr-2 mb-2">${item}</span>`,
        )
        .join("");
    return htmlElements;
};

const displayWordDetails = (wordData) => {
    console.log(wordData);
    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = `
    <div>
    <div>
    <h2 class="font-bold text-2xl">${wordData.word ? wordData.word : "শব্দ পাওয়া যায়নি"} (<i class="fa-solid fa-microphone-lines"></i> : ${wordData.pronunciation ? wordData.pronunciation : "উচ্চারণ পাওয়া যায়নি"})</h2></div>
    <div class="space-y-4 mt-4">
    <p class="font-medium">Meaning : <span class=" font-bangla">"${wordData.meaning ? wordData.meaning : "অর্থ পাওয়া যায়নি"}"</span></p>
    <p class="font-medium">Example : <span>${wordData.sentence ? wordData.sentence : " Couldn't find any example"}</span></p>
    <p class="font-medium">Part of speech: ${wordData.partsOfSpeech}</p>
    <div>
    <p class="font-medium font-bangla">সমার্থক শব্দ গুলো</p>
    <div>${wordData.synonyms.length > 0 ? creatElements(wordData.synonyms) : "No synonyms found"}</div>
    </div></div></div>
    `;
    const modal = document.getElementById("my_modal_5");
    modal.showModal();
};

const displayLevelWords = (levelData) => {
    // console.log(levelData);
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (levelData.length === 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full rounded-xl py-10">
            <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <p class="font-bangla text-sm font-normal text-[#79716b] ">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bangla font-medium text-3xl">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        manageSpinner(false);
        return;
    }

    //     {
    // "id": 4,
    // "level": 5,
    // "word": "Diligent",
    // "meaning": "পরিশ্রমী",
    // "pronunciation": "ডিলিজেন্ট"
    // },

    levelData.forEach((word) => {
        console.log(word);

        const wordCard = document.createElement("div");
        wordCard.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center px-5 py-10 space-y-4 h-full">
                <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
                <p class="font-medium">Meaning /Pronounciation</p>
                <div class="text-2xl font-semibold font-bangla">" ${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"} "</div>
                <div class="flex justify-between items-center">
                    <button onclick="loadWordDetails(${word.id})" class="btn bg-[#1a91ff1a] hover:bg-[#064e921a]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1a91ff1a] hover:bg-[#0d7ae01a]"><i class="fa-solid fa-volume-high"></i></button>
                </div>

            </div>
        `;
        wordContainer.appendChild(wordCard);
    });
    manageSpinner(false);
};

const dispalyLesson = (lessons) => {
    // console.log(lessons);

    //  1. get the container and clear the previous content
    const lessonContainer = document.getElementById("lesson-container");
    lessonContainer.innerHTML = "";

    // 2. loop through the lessons and create cards for each lesson
    lessons.data.forEach((lesson) => {
        // console.log(lesson);

        // 3. create a card element
        const lessonCard = document.createElement("div");

        lessonCard.innerHTML = `
        <button id="lessonBtn-${lesson.level_no}" onclick="loadLevelWords(${lesson.level_no})" class="btn btn-outline btn-primary lessonBtn"
                                ><i class="fa-solid fa-book-open"></i></i>
                                Lesson - ${lesson.level_no}</button
                            >
        `;
        // 4.appendChild the card to the container
        lessonContainer.appendChild(lessonCard);
    });
};

loadLesson();

document.getElementById("btn-search").addEventListener("click", function () {
    clearActiveButtons();
    const searchInput = document.getElementById("input-search");
    const searchText = searchInput.value.trim().toLowerCase();

    fetch(`https://openapi.programming-hero.com/api/words/all`)
        .then((res) => res.json())
        .then((data) => {
            const allWords = data.data;
            const filteredWords = allWords.filter((word) =>
                word.word.toLowerCase().includes(searchText),
            );
            displayLevelWords(filteredWords);
        });
});
