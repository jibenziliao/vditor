import {VDITOR_VERSION} from "../constants";
import {addScript} from "../util/addScript";

declare const uier: {
    init(option: { noteMargin: number; }, c: string): void;
};

export const uierRender = (element: HTMLElement, className = ".language-uier", cdn = `https://cdn.jsdelivr.net/npm/vditor@${VDITOR_VERSION}`) => {
    if (element.querySelectorAll(className).length === 0) {
        return;
    }
    addScript("/uier/uier.js", "vditorUierScript").then(() => {
      uier.init({noteMargin: 10}, className);
    });
};
