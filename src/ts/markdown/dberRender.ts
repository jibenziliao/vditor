import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare const dber: {
    init(option: { noteMargin: number; }, c: string): void;
};

export const dberRender = (element: HTMLElement, className = ".language-dber", cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
    if (element.querySelectorAll(className).length === 0) {
        return;
    }
    addScript("/dber/dber.js", "vditorDberScript").then(() => {
      dber.init({noteMargin: 10}, className);
    });
};
