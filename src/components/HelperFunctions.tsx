import { ReactElement, cloneElement } from 'react';
import { ColorOptionsMap, ShapeOptionsMap } from './Definitions';

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

export function createClonedSVG(svgToClone : ReactElement | undefined, newWidth : number | string, newHeight : number | string) {
    if (svgToClone === undefined) {
        return svgToClone;
    }

    const clonedElement = cloneElement(
        svgToClone, { width: newWidth, height: newHeight }
    );

    return clonedElement;
}

export function userSelectionsMapHasKey(userSelectionsMap : Map<string, string[]>, mapKey : string) {
    const mapKeys = [...userSelectionsMap.keys()];

    return mapKeys.includes(mapKey);
}

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

export function getColor(userSelectionsMap : Map<string, string[]>) {
    if (!userSelectionsMapHasKey(userSelectionsMap, "Colors")) {
        return "white";
    }

    const availableColors = userSelectionsMap.get("Colors");
    const selectedColor = availableColors?.[Math.floor(Math.random() * availableColors.length)];

    if (selectedColor === undefined) {
        throw new Error("An invalid color was selected!");
    }

    const displayColor = ColorOptionsMap?.get(selectedColor)?.backgroundColor;

    if (displayColor === undefined) {
        throw new Error("Tried to display an invalid color!");
    }

    return displayColor;
}

export function getShape(userSelectionsMap : Map<string, string[]>) {
    if (!userSelectionsMapHasKey(userSelectionsMap, "Shapes")) {
        return <></>;
    }

    const availableShapes = userSelectionsMap.get("Shapes");
    const selectedShape = availableShapes?.[Math.floor(Math.random() * availableShapes.length)];

    if (selectedShape === undefined) {
        throw new Error("An invalid shape was selected!");
    }

    const displayShape = ShapeOptionsMap?.get(selectedShape)?.content;

    if (displayShape === undefined) {
        throw new Error("Tried to display an invalid shape!");
    }

    const clonedShape = createClonedSVG(displayShape, "100%", "100%");

    return (
        clonedShape
    );
}

export function getText(userSelectionsMap : Map<string, string[]>) {
    if (!userSelectionsMapHasKey(userSelectionsMap, "Text")) {
        return <></>;
    }

    const availableText = userSelectionsMap.get("Text");
    const displayText = availableText?.[Math.floor(Math.random() * availableText.length)];

    if (displayText === undefined) {
        throw new Error("An invalid text was selected!");
    }

    return (
        displayText
    );
}
