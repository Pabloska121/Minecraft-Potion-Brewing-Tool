let languageJson;
let languageId;
let stepIndex = 1;

const languages = {
    'en': 'English',
    'es': 'Español',
};

const bg = document.querySelector('.background');
window.addEventListener('scroll', () => {
  let offset = window.scrollY * 0.7;
  bg.style.backgroundPosition = `center ${-offset}px`;
});

const languages_cache_key = 6;

window.onload = function() {
    setupLanguage();
    buildItemSelection();
    buildPotionSelection();
    initializeReloadButton();
    BrewButton();
    ScrollDown();
};

function ScrollDown() {
    document.getElementById('potion-button').addEventListener('click', function() {
        const customBox = document.querySelector('.custom-box');
        if (customBox) {
        // Mostrar la caja si está oculta
        if (customBox.style.display === 'none' || getComputedStyle(customBox).display === 'none') {
            customBox.style.display = 'block';
        }
        // Scroll suave hacia custom-box
        customBox.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

document.body.addEventListener("click", (ev) => {
    const isExpandibleTitle = !!ev.target.closest(".expandable-title-bar");
    const expandable = ev.target.closest(".expandable");

    if (!isExpandibleTitle) {
        return;
    }

    expandable.classList.toggle("expandable-open");
});

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
            $(".custom-box").show();
            potionTitle(selectedPotion, selectedBoost, selectedPotionMode);
        } else {
            console.error('Por favor, selecciona una poción.');
        }
    });
}

function potionTitle(selectedPotion, selectedBoost, selectedPotionMode) {
    const effect = data["potions"][selectedPotion]["effects"]
    const effect_color = data["potions"][selectedPotion]["effects_color"]
    $("#big-potion").html('<img src="./images/potions/' + selectedPotionMode + '/' + selectedPotion + '.png" class="big-potion">');
    $(".potion-info-text").html(`
        <p>${languageJson['potions'][selectedPotion]}</p>
        <p style="color: #6157ff">${languageJson["foods_and_drinks"]}</p>
    `);
    
    var lingering_time;
    var potiondescription;
    var enhanced_symbol;
    if (selectedBoost === languageJson['secondary-items']["extended"] && data["potions"][selectedPotion]["extended"][0]) {
        lingering_time = data["potions"][selectedPotion]["lingering"][1]
        potiondescription = data["potions"][selectedPotion]["potion_description"][1];
        $("#solution-header").html(languageJson["potions"][selectedPotion]);
        enhanced_symbol = "";
        if (selectedPotionMode !== "lingering") {
            if (selectedPotion === "potion_of_turtle_master") {
                $(".potion-info-text").append(`
                    <p style="color: ${effect_color[0]};">${languageJson["potion_effects"][effect[0]]} ${"IV"} ${data["potions"][selectedPotion]["extended"][1]}</p>
                    <p style="color: ${effect_color[1]};">${languageJson["potion_effects"][effect[1]]} ${"III"} ${data["potions"][selectedPotion]["extended"][1]}</p>
                `);
            } else {
                $(".potion-info-text").append(`
                    <p style="color: ${effect_color};">${languageJson["potion_effects"][effect]}${enhanced_symbol + " "}${data["potions"][selectedPotion]["extended"][1]}</p>
                `);
            }
        }
    } else if (selectedBoost === languageJson['secondary-items']["enhanced"] && data["potions"][selectedPotion]["enhanced"][0]) {
        lingering_time = data["potions"][selectedPotion]["lingering"][2]
        potiondescription = data["potions"][selectedPotion]["potion_description"][2];
        $("#solution-header").html(languageJson["potions"][selectedPotion] + " " + data["potions"][selectedPotion]["enhanced"][2]);
        enhanced_symbol = data["potions"][selectedPotion]["enhanced"][2];
        if (selectedPotionMode !== "lingering") {
            if (selectedPotion === "potion_of_turtle_master") {
                $(".potion-info-text").append(`
                    <p style="color: ${effect_color[0]};">${languageJson["potion_effects"][effect[0]]} ${"VI"} ${data["potions"][selectedPotion]["enhanced"][1]}</p>
                    <p style="color: ${effect_color[1]};">${languageJson["potion_effects"][effect[1]]} ${"IV"} ${data["potions"][selectedPotion]["enhanced"][1]}</p>
                `);
            } else {
                $(".potion-info-text").append(`
                    <p style="color: ${effect_color};">${languageJson["potion_effects"][effect]}${" " + enhanced_symbol + " "}${data["potions"][selectedPotion]["enhanced"][1]}</p>
                `);
            }
        }
    } else {
        lingering_time = data["potions"][selectedPotion]["lingering"][0];
        potiondescription = data["potions"][selectedPotion]["potion_description"][0];
        $("#solution-header").html(languageJson["potions"][selectedPotion]);
        enhanced_symbol = "";
        if (selectedPotionMode !== "lingering") {
            if (selectedPotion === "potion_of_turtle_master") {
                $(".potion-info-text").append(`
                    <p style="color: ${effect_color[0]};">${languageJson["potion_effects"][effect[0]]} ${"IV"} ${data["potions"][selectedPotion].length}</p>
                    <p style="color: ${effect_color[1]};">${languageJson["potion_effects"][effect[1]]} ${"III"} ${data["potions"][selectedPotion].length}</p>
                `);
            } else {
                $(".potion-info-text").append(`
                    <p style="color: ${effect_color};">${languageJson["potion_effects"][effect]}${" " + enhanced_symbol + " "}${data["potions"][selectedPotion].length}</p>
                `);
            }
        }
    }

    if (selectedPotionMode === "lingering") {
        if (selectedPotion === "potion_of_turtle_master") {
            if (selectedBoost === languageJson['secondary-items']["enhanced"] && data["potions"][selectedPotion]["enhanced"][0]) {
                $(".potion-info-text").append(`
                    <p style="color: ${effect_color[0]};">${languageJson["potion_effects"][effect[0]]} ${"VI"} (${data["potions"][selectedPotion]["lingering"][2]})</p>
                    <p style="color: ${effect_color[1]};">${languageJson["potion_effects"][effect[1]]} ${"IV"} (${data["potions"][selectedPotion]["lingering"][2]})</p>
                `); 
            } else if (selectedBoost === languageJson['secondary-items']["extended"] && data["potions"][selectedPotion]["extended"][0]){
                $(".potion-info-text").append(`
                    <p style="color: ${effect_color[0]};">${languageJson["potion_effects"][effect[0]]} ${"IV"} (${data["potions"][selectedPotion]["lingering"][1]})</p>
                    <p style="color: ${effect_color[1]};">${languageJson["potion_effects"][effect[1]]} ${"III"} (${data["potions"][selectedPotion]["lingering"][1]})</p>
                `);
            } else {
                $(".potion-info-text").append(`
                    <p style="color: ${effect_color[0]};">${languageJson["potion_effects"][effect[0]]} ${"IV"} (${data["potions"][selectedPotion]["lingering"][0]})</p>
                    <p style="color: ${effect_color[1]};">${languageJson["potion_effects"][effect[1]]} ${"III"} (${data["potions"][selectedPotion]["lingering"][0]})</p>
                `);
            }
        } else {
            $(".potion-info-text").append(`
                <p style="color: ${effect_color};">${languageJson["potion_effects"][effect]}${" " + enhanced_symbol + " "}${lingering_time}</p>
            `);
        }
    }

    if (potiondescription !== "") {
        if (selectedPotionMode === "lingering") {
            $(".potion-info-text").append(`
                <br>
                <p style="color: #AA00AA;">${languageJson["when_applied"]}:</p>
                <p style="color: ${effect_color[0]};">${languageJson[potiondescription]}:</p>
            `);
        } else {
            $(".potion-info-text").append(`
                <br>
                <p style="color: #AA00AA;">${languageJson["when_applied"]}:</p>
                <p style="color: ${effect_color[0]};">${languageJson[potiondescription]}:</p>
            `);
        }
    }

    if (selectedPotionMode === "rare") {
        $(".potion-info-text").append(`
            <p style="color: grey;">minecraft:potion</p>
            <p style="color: grey;">${languageJson["13_component(s)"]}</p>
        `);
    } else if (selectedPotionMode === "splash") {
        $(".potion-info-text").append(`
            <p style="color: grey;">minecraft:${selectedPotionMode}_potion</p>
            <p style="color: grey;">${languageJson["11_component(s)"]}</p>
        `);
    } else {
        $(".potion-info-text").append(`
            <p style="color: grey;">minecraft:${selectedPotionMode}_potion</p>
            <p style="color: grey;">${languageJson["12_component(s)"]}</p>
        `);
    }


    addInstructionDisplay(selectedPotion, selectedBoost, selectedPotionMode);
}

function addInstructionDisplay(selectedPotion, selectedBoost, selectedPotionMode) {
    stepIndex = 1;
    var solution_steps = $("#steps");
    solution_steps.empty();
    solution_steps.append("<hr>");
    //STEP 1
    var step = $("<div>").addClass("step-row");

    var leftContainer = $("<div>").addClass("left-container");
    var title = $("<div>").addClass("step_number-left").html(`<strong>#${stepIndex}.</strong>`);
    var left = $("<div>").addClass("step-left").html(firstStep());

    leftContainer.append(title).append(left);

    var right = $(`
        <div class="step-right">
          <img src="./images/potions_menu.png" class="step-image">
          <img src="./images/water_bottle.png" class="overlay-item" style="top: 150px; left: 162px;">
          <img src="./images/water_bottle.png" class="overlay-item" style="top: 150px; left: 325px;">
          <img src="./images/water_bottle.png" class="overlay-item" style="top: 175px; left: 243px;">
          <img src="./images/blaze_powder.png" class="overlay-item" style="top: 29px; left: 24px;">
        </div>
      `);      
    stepIndex += 1
    step.append(leftContainer).append(right);
    solution_steps.append(step);
    solution_steps.append("<hr>");
    //STEP 2
    if (selectedPotion !== "potion_of_weakness") {
        step = $("<div>").addClass("step-row");

        var leftContainer = $("<div>").addClass("left-container");
        var title = $("<div>").addClass("step_number-left").html(`<strong>#${stepIndex}.</strong>`);
        var left = $("<div>").addClass("step-left").html(
            languageJson.introduce + " " + displayItemText("nether_wart") + " " + languageJson.into_the + displayText('brewing_stand') + "."
        );

        leftContainer.append(title).append(left);

        var right = $(`
            <div class="step-right">
            <img src="./images/potions_menu.png" class="step-image">
            <img src="./images/nether_wart.png" class="overlay-item" style="top: 29px; left: 243px;">
            <img src="./images/water_bottle.png" class="overlay-item" style="top: 150px; left: 162px;">
            <img src="./images/water_bottle.png" class="overlay-item" style="top: 150px; left: 325px;">
            <img src="./images/water_bottle.png" class="overlay-item" style="top: 175px; left: 243px;">
            <img src="./images/blaze_powder.png" class="overlay-item" style="top: 29px; left: 24px;">
            </div>
        `); 

        step.append(leftContainer).append(right);
        solution_steps.append(step);
        solution_steps.append("<hr>");
        stepIndex += 1;

    }
    data.potions[selectedPotion]["items"].forEach(function(item) {
        step = $("<div>").addClass("step-row");

        var leftContainer = $("<div>").addClass("left-container");
        var title = $("<div>").addClass("step_number-left").html(`<strong>#${stepIndex}.</strong>`);
        var left = $("<div>").addClass("step-left").html(
            languageJson.introduce + " " + displayItemText(item) + " " + languageJson.into_the + " " + displayText('brewing_stand') + " " + languageJson.to_give_effect + "."
        );

        leftContainer.append(title).append(left);

        var right = $(`
            <div class="step-right">
            <img src="./images/potions_menu.png" class="step-image">
            <img src="./images/${item}.png" class="overlay-item" style="top: 29px; left: 243px;">
            <img src="./images/potions/rare/${selectedPotion}.png" class="overlay-item" style="top: 150px; left: 162px;">
            <img src="./images/potions/rare/${selectedPotion}.png" class="overlay-item" style="top: 150px; left: 325px;">
            <img src="./images/potions/rare/${selectedPotion}.png" class="overlay-item" style="top: 175px; left: 243px;">
            <img src="./images/blaze_powder.png" class="overlay-item" style="top: 29px; left: 24px;">
            </div>
        `);

        step.append(leftContainer).append(right);
        solution_steps.append(step);
        solution_steps.append("<hr>");
        stepIndex += 1;
    });

    if (selectedBoost) {
        step = $("<div>").addClass("step-row");

        var leftContainer = $("<div>").addClass("left-container");
        var title = $("<div>").addClass("step_number-left").html(`<strong>#${stepIndex}.</strong>`);
        var left = $("<div>").addClass("step-left").html(
            languageJson.introduce + " " + displayItemText(potionBoost(selectedBoost)[1]) + " " + languageJson.into_the + " " + displayText('brewing_stand') + " " + languageJson.to_give_effect + "."
        );

        leftContainer.append(title).append(left);

        var right = $(`
            <div class="step-right">
            <img src="./images/potions_menu.png" class="step-image">
            <img src="./images/${potionBoost(selectedBoost)[1]}.png" class="overlay-item" style="top: 29px; left: 243px;">
            <img src="./images/potions/rare/${selectedPotion}.png" class="overlay-item" style="top: 150px; left: 162px;">
            <img src="./images/potions/rare/${selectedPotion}.png" class="overlay-item" style="top: 150px; left: 325px;">
            <img src="./images/potions/rare/${selectedPotion}.png" class="overlay-item" style="top: 175px; left: 243px;">
            <img src="./images/blaze_powder.png" class="overlay-item" style="top: 29px; left: 24px;">
            </div>
        `);

        step.append(leftContainer).append(right);
        solution_steps.append(step);
        if (selectedPotionMode !== "rare") {
            solution_steps.append("<hr>");
        }
        stepIndex += 1;
    }
    if (selectedPotionMode === "splash") {
        step = $("<div>").addClass("step-row");

        var leftContainer = $("<div>").addClass("left-container");
        var title = $("<div>").addClass("step_number-left").html(`<strong>#${stepIndex}.</strong>`);
        var left = $("<div>").addClass("step-left").html(
            languageJson.introduce + " " + displayItemText("gunpowder") + " " + languageJson.into_the + " " + displayText('brewing_stand') + "."
        );

        leftContainer.append(title).append(left);

        var right = $(`
            <div class="step-right">
            <img src="./images/potions_menu.png" class="step-image">
            <img src="./images/gunpowder.png" class="overlay-item" style="top: 29px; left: 243px;">
            <img src="./images/potions/${selectedPotionMode}/${selectedPotion}.png" class="overlay-item" style="top: 150px; left: 162px;">
            <img src="./images/potions/${selectedPotionMode}/${selectedPotion}.png" class="overlay-item" style="top: 150px; left: 325px;">
            <img src="./images/potions/${selectedPotionMode}/${selectedPotion}.png" class="overlay-item" style="top: 175px; left: 243px;">
            <img src="./images/blaze_powder.png" class="overlay-item" style="top: 29px; left: 24px;">
            </div>
        `);

        step.append(leftContainer).append(right);
        solution_steps.append(step);
        stepIndex += 1;

    }
    if (selectedPotionMode === "lingering") {
        step = $("<div>").addClass("step-row");

        var leftContainer = $("<div>").addClass("left-container");
        var title = $("<div>").addClass("step_number-left").html(`<strong>#${stepIndex}.</strong>`);
        var left = $("<div>").addClass("step-left").html(
            languageJson.introduce + " " + displayItemText("gunpowder") + " " + languageJson.into_the + " " + displayText('brewing_stand') + "."
        );

        leftContainer.append(title).append(left);

        var right = $(`
            <div class="step-right">
            <img src="./images/potions_menu.png" class="step-image">
            <img src="./images/gunpowder.png" class="overlay-item" style="top: 29px; left: 243px;">
            <img src="./images/potions/splash/${selectedPotion}.png" class="overlay-item" style="top: 150px; left: 162px;">
            <img src="./images/potions/splash/${selectedPotion}.png" class="overlay-item" style="top: 150px; left: 325px;">
            <img src="./images/potions/splash/${selectedPotion}.png" class="overlay-item" style="top: 175px; left: 243px;">
            <img src="./images/blaze_powder.png" class="overlay-item" style="top: 29px; left: 24px;">
            </div>
        `);

        step.append(leftContainer).append(right);
        solution_steps.append(step);
        solution_steps.append("<hr>");
        stepIndex += 1;
        
        step = $("<div>").addClass("step-row");

        var leftContainer = $("<div>").addClass("left-container");
        var title = $("<div>").addClass("step_number-left").html(`<strong>#${stepIndex}.</strong>`);
        var left = $("<div>").addClass("step-left").html(
            languageJson.introduce + " " + displayItemText("dragons_breath") + " " + languageJson.into_the + " " + displayText('brewing_stand') + "."
        );

        leftContainer.append(title).append(left);

        var right = $(`
            <div class="step-right">
            <img src="./images/potions_menu.png" class="step-image">
            <img src="./images/dragons_breath.png" class="overlay-item" style="top: 29px; left: 243px;">
            <img src="./images/potions/${selectedPotionMode}/${selectedPotion}.png" class="overlay-item" style="top: 150px; left: 162px;">
            <img src="./images/potions/${selectedPotionMode}/${selectedPotion}.png" class="overlay-item" style="top: 150px; left: 325px;">
            <img src="./images/potions/${selectedPotionMode}/${selectedPotion}.png" class="overlay-item" style="top: 175px; left: 243px;">
            <img src="./images/blaze_powder.png" class="overlay-item" style="top: 29px; left: 24px;">
            </div>
        `);

        step.append(leftContainer).append(right);
        solution_steps.append(step);
        stepIndex += 1;
    }
}

function firstStep() {
    const instruction_text = languageJson.prepare + " " + displayText('brewing_stand') + " " + languageJson.with + displayText('water_bottle') + " " + languageJson.and + " " + displayItemText('blaze_powder') + " " + languageJson.as_fuel + ".";
    return instruction_text
}

function potionBoost(selectedBoost) {
    var instruction_text;
    var item;
    if (selectedBoost === languageJson['secondary-items']["extended"]) {
        item = "redstone_dust"
        instruction_text = languageJson.add + " " + displayItemText("redstone_dust") + " " + languageJson.to_extend_duration;
    } else if (selectedBoost === languageJson['secondary-items']["enhanced"]) {
        item = "glowstone_dust"
        instruction_text = languageJson.add + " " + displayItemText("glowstone_dust") + " " + languageJson.to_increase_power;
    }

    return [instruction_text + ".", item]
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
    document.getElementById("sub-item").value = ""
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
    $(".custom-box").hide();
}

function languageChangeListener(){
    const selectLanguage = document.getElementById('language');
    selectLanguage.addEventListener('change', function() {
        const selectedValue = selectLanguage.value;
        changePageLanguage(selectedValue);
        $("#right").hide();
        $(".custom-box").hide();
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
