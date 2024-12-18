import { ReactElement, cloneElement } from 'react';
import { ColorObj, ColorOptionsMap, SFXObj, ShapeObj, ShapeOptionsMap, TextObj } from './Definitions';

//
// Convert HH:MM:SS format to a total number of seconds.
//
export function getSecondsFromHHMMSS(value : string) {
    const [ str1, str2, str3 ] = value.split(":");

    const val1 = Number(str1);
    const val2 = Number(str2);
    const val3 = Number(str3);

    if (!isNaN(val1) && isNaN(val2) && isNaN(val3)) {
        return val1;
    }

    if (!isNaN(val1) && !isNaN(val2) && isNaN(val3)) {
        return val1 * 60 + val2;
    }

    if (!isNaN(val1) && !isNaN(val2) && !isNaN(val3)) {
        return val1 * 60 * 60 + val2 * 60 + val3;
    }

    return 0;
}

//
// Convert total number of seconds to HH:MM:SS format.
//
export function toHHMMSS(secs : number | undefined) {
    if (secs == undefined) {
        throw Error("Input value is undefined!");
    }

    const secNum = parseInt(secs.toString(), 10);
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor(secNum / 60) % 60;
    const seconds = secNum % 60;

    return [hours, minutes, seconds]
        .map((val) => (val < 10 ? `0${val}` : val))
        .filter((val, index) => val !== "00" || index > 0)
        .join(":")
        .replace(/^0/, "");
}

//
// Returns true if an input string only contains alphanumeric numbers or commas.
//
export function containsOnlyAlphanumericAndComma(textInput : string) {
    const inputLen = textInput.length;

    const isNumeric = (code : number) => (code <= 57) && (code >= 48);
    const isUpperAlpha = (code : number) => (code <= 90) && (code >= 65);
    const isLowerAlpha = (code : number) => (code <= 122) && (code >= 97);
    const isComma = (code : number) => code === 44;
    const isSpace = (code : number) => code === 32;

    for (let i = 0; i < inputLen; i++) {
        const code = textInput.charCodeAt(i);

        if (!isNumeric(code) && !isUpperAlpha(code) && !isLowerAlpha(code) && !isComma(code) && !isSpace(code)) {
            return false;
        }
    }

    return true;
}

//
// Removes all whitespace and excess leading and ending commas from the input string
//
export function formatInputValue(inputValue : string | undefined) {
    if (inputValue === undefined) {
        throw new Error("Tried to format in undefined input value!");
    }

    return inputValue.replace(/\s/g, "").replace(/^\,+|\,+$/gm,'').trim();
}

//
// Determine if we have a valid userSelectionsMap before starting training mode. A userSelectionsMap is valid if a stimulus category has at least two stimuli selected under it.
//
export function getUserSelectionValidity(userSelectionsMap : Map<string, string[]>) {
    if (userSelectionsMap.size === 0) {
        return false;
    }

    const userSelectionMapValues = [...userSelectionsMap.values()];

    for (let i = 0; i < userSelectionMapValues.length; i++) {
        if (userSelectionMapValues[i].length < 2) {
            return false;
        }
    }

    return true;
}

//
// Creates a clone of an SVG Element with a specified width and height.
//
export function createClonedSVG(svgToClone : ReactElement | undefined, newWidth : number | string, newHeight : number | string) {
    if (svgToClone === undefined) {
        return svgToClone;
    }

    const clonedElement = cloneElement(
        svgToClone, { width: newWidth, height: newHeight }
    );

    return clonedElement;
}

//
// Checks if the userSelectionsMap has a given key
//
export function userSelectionsMapHasKey(userSelectionsMap : Map<string, string[]>, mapKey : string) {
    const mapKeys = [...userSelectionsMap.keys()];

    return mapKeys.includes(mapKey);
}

//
// Helps the training modal choose between first displaying shapes or text upon entering training mode.
//
export function startWithShapesOrText(userSelectionsMap : Map<string, string[]>) {
    const userSelectedShapes = userSelectionsMapHasKey(userSelectionsMap, "Shapes");
    const userSelectedText = userSelectionsMapHasKey(userSelectionsMap, "Text")

    if (userSelectedShapes && userSelectedText) {
        return Math.random() < 0.5 ? "Shapes" : "Text";
    }
    else if (userSelectedShapes) {
        return "Shapes";
    }
    else if (userSelectedText) {
        return "Text";
    }
    else {
        return "";
    }
}

export function getNextColorObj(userSelectionsMap : Map<string, string[]>, currentColorName : string | undefined, isUniqueEnabled : boolean) : ColorObj {
    if (!userSelectionsMapHasKey(userSelectionsMap, "Colors")) {
        return { 
            name: undefined, 
            colorCode: "white" 
        };
    }

    const userSelectedColors = userSelectionsMap.get("Colors");
    let availableColors = userSelectedColors;

    if (isUniqueEnabled && (currentColorName !== undefined)) {
        availableColors = userSelectedColors?.filter((colorName) => colorName !== currentColorName);
    }

    const selectedColor = availableColors?.[Math.floor(Math.random() * availableColors.length)];

    if (selectedColor === undefined) {
        throw new Error("An invalid color was selected!");
    }

    const displayColor = ColorOptionsMap?.get(selectedColor)?.backgroundColor;

    if (displayColor === undefined) {
        throw new Error("Tried to display an invalid color!");
    }

    return { 
        name: selectedColor, 
        colorCode: displayColor 
    };
}

export function getNextShapeObj(userSelectionsMap : Map<string, string[]>, currentShapeName : string | undefined, isUniqueEnabled : boolean) : ShapeObj {
    if (!userSelectionsMapHasKey(userSelectionsMap, "Shapes")) {
        return {
            name: undefined, 
            shapeElement : <></> 
        };
    }

    const userSelectedShapes = userSelectionsMap.get("Shapes");
    let availableShapes = userSelectedShapes;

    if (isUniqueEnabled && (currentShapeName !== undefined)) {
        availableShapes = userSelectedShapes?.filter((shapeName) => shapeName !== currentShapeName);
    }

    const selectedShape = availableShapes?.[Math.floor(Math.random() * availableShapes.length)];

    if (selectedShape === undefined) {
        throw new Error("An invalid shape was selected!");
    }

    const displayShape = ShapeOptionsMap?.get(selectedShape)?.content;

    if (displayShape === undefined) {
        throw new Error("Tried to display an invalid shape!");
    }

    const clonedShape = createClonedSVG(displayShape, "100%", "100%");

    if (clonedShape === undefined) {
        throw new Error("An invalid clone was created!");
    }

    return {
        name: selectedShape,
        shapeElement: 
            <div className="Shapes-Text-Div">
                { clonedShape }
            </div>
    };
}

export function getNextTextObj(userSelectionsMap : Map<string, string[]>, currentText : string | undefined, isUniqueEnabled : boolean) : TextObj {
    if (!userSelectionsMapHasKey(userSelectionsMap, "Text")) {
        return { 
            name: undefined, 
            textElement: <></> 
        };
    }

    const userSelectedText = userSelectionsMap.get("Text");
    let availableText = userSelectedText;

    if (isUniqueEnabled && (currentText !== undefined)) {
        availableText = userSelectedText?.filter((text) => text !== currentText);
    }

    const displayText = availableText?.[Math.floor(Math.random() * availableText.length)];

    if (displayText === undefined) {
        throw new Error("An invalid text was selected!");
    }

    return {
        name: displayText,
        textElement: 
            <div className="Shapes-Text-Div">
                { displayText }
            </div>
    };
}

export function getNextSFXObj(userSelectionsMap : Map<string, string[]>, currentAudioFileName : string | undefined, isUniqueEnabled : boolean) : SFXObj {
    if (!userSelectionsMapHasKey(userSelectionsMap, "Sound Effects")) {
        return { 
            name: undefined, 
            audioFileName: undefined
        };
    }

    const userSelectedSounds = userSelectionsMap.get("Sound Effects");
    let availableSounds = userSelectedSounds;

    if (isUniqueEnabled && (currentAudioFileName !== undefined)) {
        availableSounds = userSelectedSounds?.filter((filename) => filename !== currentAudioFileName);
    }

    const selectedAudioFile = availableSounds?.[Math.floor(Math.random() * availableSounds.length)];

    if (selectedAudioFile === undefined) {
        throw new Error("An invalid audio file was selected!");
    }

    return {
        name : selectedAudioFile, 
        audioFileName : `${ selectedAudioFile }.wav`
    }
}