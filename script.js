let languageJson;
let languageId;

const languages = {
    'en': 'English',
    'es': 'Español',
};

const languages_cache_key = 6;

window.onload = function() {
    setupLanguage();
    buildItemSelection();
    buildPotionSelection();
    initializeReloadButton();
    BrewButton();
};

function updateBrewButtonState(isAvailable) {
    const potionButton = document.getElementById('potion-button');

    if (isAvailable) {
        potionButton.classList.remove('button-disabled');
        potionButton.classList.add('button-enabled');
    } else {
        potionButton.classList.remove('button-enabled');
        potionButton.classList.add('button-disabled');
    }
}

function BrewButton() {
    $("#potion-button").on('click', function() {
        const selectedPotionMode = $('input[name="potion-mode"]:checked').val();
        const selectedPotion = $("#item").val();
        const selectedBoost = $("#sub-item").val();
        if (selectedPotion) {
            $("#right").show()
            potionTitle(selectedPotion, selectedBoost, selectedPotionMode);
        } else {
            console.error('Por favor, selecciona una poción.');
        }
    });
}

function potionTitle(selectedPotion, selectedBoost, selectedPotionMode) {
    $("#big-potion").html('<img src="./images/potions/' + selectedPotionMode + '/' + selectedPotion + '.png" class="big-potion">');

    if (selectedPotionMode === "rare") {
        document.getElementById("potion-type").textContent = languageJson.potion_type + " " + languageJson.awkward_potion;
    } 
    if (selectedPotionMode === "splash") {
        document.getElementById("potion-type").textContent = languageJson.potion_type + " " + languageJson.splash_potion;
    }
    if (selectedPotionMode === "lingering") {
        document.getElementById("potion-type").textContent = languageJson.potion_type + " " + languageJson.lingering_potion;
    }
    
    if (selectedBoost === languageJson['secondary-items']["extended"] && data["potions"][selectedPotion]["extended"][0]) {
        document.getElementById("potion-time").textContent = languageJson.potion_time + " " + data["potions"][selectedPotion]["extended"][1];
        $("#solution-header").html(languageJson["potions"][selectedPotion] + " " + data["potions"][selectedPotion]["extended"][2] + ":");
    } else if (selectedBoost === languageJson['secondary-items']["enhanced"] && data["potions"][selectedPotion]["enhanced"][0]) {
        document.getElementById("potion-time").textContent = languageJson.potion_time + " " + data["potions"][selectedPotion]["enhanced"][1];
        $("#solution-header").html(languageJson["potions"][selectedPotion] + " " + data["potions"][selectedPotion]["enhanced"][2] + ":");
    } else {
        document.getElementById("potion-time").textContent = languageJson.potion_time + " " + data["potions"][selectedPotion].length;
        $("#solution-header").html(languageJson["potions"][selectedPotion] + ":");
    }

    if (selectedPotionMode === "lingering") {
        document.getElementById("potion-time").textContent = languageJson.potion_time + " " + "0:30";
    }

    document.getElementById("steps_title").textContent = languageJson.steps_title;

    addInstructionDisplay(selectedPotion, selectedBoost, selectedPotionMode);
}

function addInstructionDisplay(selectedPotion, selectedBoost, selectedPotionMode) {
    const solution_steps = $("#steps");
    solution_steps.empty();
    solution_steps.append($("<li>").html(firstStep()))
    if (selectedPotion !== "potion_of_weakness") {
        solution_steps.append($("<li>").html(languageJson.introduce + " " + displayItemText("nether_wart") + " " + languageJson.into_the + displayText('brewing_stand') + "."));
    }
    data.potions[selectedPotion].items.forEach(function(item) {
        const instruction_text = languageJson.introduce + " " + displayItemText(item) + " " + languageJson.into_the + " " + displayText('brewing_stand') + " " + languageJson.to_give_effect + ".";
        solution_steps.append($("<li>").html(instruction_text))
    });
    solution_steps.append($("<li>").html(potion(selectedPotion)))
    if (selectedBoost) {
        solution_steps.append($("<li>").html(potionBoost(selectedBoost)))
    }
    if (selectedPotionMode === "splash") {
        solution_steps.append($("<li>").html(languageJson.introduce + " " + displayItemText("gunpowder") + " " + languageJson.into_the + displayText('brewing_stand') + "."))
    }
    if (selectedPotionMode === "lingering") {
        solution_steps.append($("<li>").html(languageJson.introduce + " " + displayItemText("gunpowder") + " " + languageJson.into_the + displayText('brewing_stand') + "."))
        solution_steps.append($("<li>").html(languageJson.introduce + " " + displayItemText("dragons_breath") + " " + languageJson.into_the + displayText('brewing_stand') + "."))
    }
}

function firstStep() {
    const instruction_text = languageJson.prepare + " " + displayText('brewing_stand') + languageJson.with + displayText('water_bottle') + " " + languageJson.and + " " + displayItemText('blaze_powder') + " " + languageJson.as_fuel + ".";
    return instruction_text
}

function potionBoost(selectedBoost) {
    var instruction_text;
    if (selectedBoost === languageJson['secondary-items']["extended"]) {
        instruction_text = languageJson.add + " " + displayItemText("redstone_dust") + " " + languageJson.to_extend_duration;
    } else if (selectedBoost === languageJson['secondary-items']["enhanced"]) {
        instruction_text = languageJson.add + " " + displayItemText("glowstone_dust") + " " + languageJson.to_increase_power;
    }

    return instruction_text + "."
}

function displayText(text) {
    const item_name = " <i>" + languageJson[text] + " </i>";
    const icon_text = '<img src="./images/' + text + '.png" class="icon">';
    const instruction_text = '<strong>' + item_name + '</strong>' + " " + icon_text;
    return instruction_text
}

function displayItemText(item_obj) {
    const item_name = " <i>" + languageJson["items"][item_obj] + " </i>";
    const icon_text = '<img src="./images/' + item_obj + '.png" class="icon">';
    const instruction_text = '<strong>' + item_name + '</strong>' + " " + icon_text;
    return instruction_text
}

function buildPotionSelection() {
    $("select#item").change(function() {
        const item_namespace_selected = $("select#item option:selected").val();
        if (item_namespace_selected) {
            updateBrewButtonState(true);
            updateSecondarySelect(item_namespace_selected);
        }
    });
}

function updateSecondarySelect(selectedItem) {
    const potionData = data.potions[selectedItem];
    const $subItemSelect = $("select#sub-item");
    $subItemSelect.find("#extended").hide();
    $subItemSelect.find("#enhanced").hide();
    if (potionData["extended"][0] || potionData["enhanced"][0]) {
        if (potionData["extended"][0]) {
            $subItemSelect.find("#extended").show();
        } 
        if (potionData["enhanced"][0]) {
            $subItemSelect.find("#enhanced").show();
        }   
        $subItemSelect.show();    
    } else {
        $subItemSelect.hide();
    }
}

function buildItemSelection() {
    Object.keys(data.potions).forEach(potionName => {
        const item_listbox_metadata = { value: potionName};
        const item_listbox = $("<option/>", item_listbox_metadata);
        item_listbox.text(potionName).appendTo("select#item")
    })
}

function initializeReloadButton() {
    $("#restart-button").on('click', function() {
        resetSelects();
    });
}

function resetSelects() {
    $("select").each(function() {
        $(this).prop('selectedIndex', 0);
    });
    const potionButton = document.getElementById('potion-button');
    potionButton.classList.remove('button-enabled');
    potionButton.classList.add('button-disabled');
    $("#sub-item").hide(); 
    $("#right").hide();
    $("#big-potion").hide();
}

function languageChangeListener(){
    const selectLanguage = document.getElementById('language');
    selectLanguage.addEventListener('change', function() {
        const selectedValue = selectLanguage.value;
        changePageLanguage(selectedValue);
        $("#right").hide();
        $("#big-potion").hide();
    });
}

async function setupLanguage() {
    for (const [code, name] of Object.entries(languages)) {
        $('<option/>', {'value': code}).text(name).appendTo('#language');
    }

    defineBrowserLanguage();
    languageChangeListener();
}

function defineBrowserLanguage(){
    if (!localStorage.getItem("savedlanguage")) {
        const browserLanguage = navigator.language || navigator.userLanguage;
        if (languages[browserLanguage]){
            changePageLanguage(browserLanguage);
        } else {
            changePageLanguage('en');
        }
    } else {
        changePageLanguage(localStorage.getItem("savedlanguage"));
    }
}

async function changePageLanguage(language){
    if (!languages[language]){
        console.error("Trying to switch to unknown language:", language);
        return;
    }

    languageId = language;
    languageJson = await loadJsonLanguage(language).then(languageData => { return languageData});
    if (languageJson){
        changeLanguageByJson(languageJson);
        localStorage.setItem("savedlanguage", language);
    }
}

async function loadJsonLanguage(language) {
    try {
        const response = await fetch('languages/' + language + '.json?' + languages_cache_key);
        if (!response.ok) {
            throw new Error('Can\'t load language file');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Language file error:', error);
        return null;
    }
}

function changeLanguageByJson(languageJson){
    const map = {};
    for (let i in languageJson.potions) {
        if (map[languageJson.potions[i]]) {
            console.error("Duplicate string for potions names (must be unique)", languageId, i, map[languageJson.potions[i]]);
        }
        map[languageJson.potions[i]] = i;
    }

    const h1Element = document.querySelector('h1');
    if (h1Element) {
        h1Element.textContent = languageJson.h1_title || 'Default Title';
    } else {
        console.error("Elemento <h1> no encontrado.");
    }

    const paragraphs = document.getElementsByTagName('p');
    if (paragraphs.length > 3) {
        if (paragraphs[1]) paragraphs[1].innerHTML = languageJson.paragraph_1 || '';
        if (paragraphs[2]) paragraphs[2].innerHTML = languageJson.paragraph_2 || '';
        if (paragraphs[3]) paragraphs[3].innerHTML = languageJson.paragraph_3 || '';
    } else {
        console.error("No se encontraron suficientes párrafos para cambiar.");
    }

    const selectElement = document.getElementById("item");
    if (selectElement) {
        const options = selectElement.getElementsByTagName("option");
        if (options.length > 0) {
            options[0].textContent = languageJson.choose_a_potion_to_brew || '';
        }
        
        let i = 1;
        Object.keys(data.potions).forEach(item_namespace => {
            if (options[i]) {
                options[i].textContent = languageJson.potions[item_namespace] || 'Default Item Name';
                i++;
            }
        });
    } else {
        console.error("Elemento <select id='item'> no encontrado.");
    }

    const subItemSelectElement = document.getElementById("sub-item");
    if (subItemSelectElement) {
        const subItemOptions = subItemSelectElement.getElementsByTagName("option");
        if (subItemOptions.length > 0) {
            subItemOptions[0].textContent = languageJson.no_boosts_applied || '';
        }

        let i = 1; 
        Object.keys(languageJson['secondary-items']).forEach(item_namespace => {
            if (subItemOptions[i]) {
                subItemOptions[i].textContent = languageJson['secondary-items'][item_namespace] || 'Default Item Name';
                i++;
            }
        });

    } else {
        console.error("Elemento <select id='sub-item'> no encontrado.");
    }

    if (document.getElementById("awkward-potion")) {
        document.getElementById("awkward-potion").textContent = languageJson.awkward_potion || '';
    }

    if (document.getElementById("splash-potion")) {
        document.getElementById("splash-potion").textContent = languageJson.splash_potion || '';
    }

    if (document.getElementById("lingering-potion")) {
        document.getElementById("lingering-potion").textContent = languageJson.lingering_potion || '';
    }

    if (document.getElementById("potion-button")) {
        document.getElementById("potion-button").textContent = languageJson.brew || '';
    }

    if (document.getElementById("restart-button")) {
        document.getElementById("restart-button").textContent = languageJson.reload_page || '';
    }
}
