import {abcRender} from "../markdown/abcRender";
import {chartRender} from "../markdown/chartRender";
import {codeRender} from "../markdown/codeRender";
import {dberRender} from "../markdown/dberRender";
import {graphvizRender} from "../markdown/graphvizRender";
import {highlightRender} from "../markdown/highlightRender";
import {mathRender} from "../markdown/mathRender";
import {mermaidRender} from "../markdown/mermaidRender";
import {uierRender} from "../markdown/uierRender";

export const processPasteCode = (html: string, text: string, type = "sv") => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    let isCode = false;
    if (tempElement.childElementCount === 1 &&
        (tempElement.lastElementChild as HTMLElement).style.fontFamily.indexOf("monospace") > -1) {
        // VS Code
        isCode = true;
    }
    const pres = tempElement.querySelectorAll("pre");
    if (tempElement.childElementCount === 1 && pres.length === 1
        && pres[0].className !== "vditor-wysiwyg"
        && pres[0].className !== "vditor-textarea") {
        // IDE
        isCode = true;
    }
    if (html.indexOf('\n<p class="p1">') === 0) {
        // Xcode
        isCode = true;
    }

    if (isCode) {
        const code = text || html;
        if (/\n/.test(code) || pres.length === 1) {
            if (type === "wysiwyg") {
                return `<div class="vditor-wysiwyg__block" data-block="0" data-type="code-block"><pre><code>${
                    code.replace(/&/g, "&amp;").replace(/</g, "&lt;")}<wbr></code></pre></div>`;
            }
            if (type === "ir") {
                return "```\n" + code.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "\n```";
            }
            return "```\n" + code + "\n```";
        } else {
            if (type === "wysiwyg") {
                return `<code>${code.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code><wbr>`;
            }
            return `\`${code}\``;
        }
    }
    return false;
};

export const processCodeRender = (previewPanel: HTMLElement, vditor: IVditor) => {
    if (!previewPanel) {
        return;
    }
    const codeElement = previewPanel.querySelector("code");
    if (!codeElement) {
        return;
    }
    const language = codeElement.className.replace("language-", "");
    if (language === "abc") {
        abcRender(previewPanel, vditor.options.cdn);
    } else if (language === "mermaid") {
        mermaidRender(previewPanel, `.vditor-${vditor.currentMode}__preview .language-mermaid`, vditor.options.cdn);
    } else if (language === "dber") {
        dberRender(previewPanel, `.vditor-${vditor.currentMode}__preview .language-dber`, vditor.options.cdn);
    } else if (language === "uier") {
        uierRender(previewPanel, `.vditor-${vditor.currentMode}__preview .language-uier`, vditor.options.cdn);
    } else if (language === "echarts") {
        chartRender(previewPanel, vditor.options.cdn);
    } else if (language === "graphviz") {
        graphvizRender(previewPanel, vditor.options.cdn);
    } else if (language === "math") {
        let tag = "div";
        if (previewPanel.tagName === "SPAN") {
            tag = "span";
        }
        previewPanel.innerHTML = `<code class="language-math"><${tag} class="vditor-math">${previewPanel.innerHTML}</${tag}></code>`;
        mathRender(previewPanel.parentElement, {cdn: vditor.options.cdn, math: vditor.options.preview.math});
    } else {
        highlightRender(Object.assign({}, vditor.options.preview.hljs, {enable: true}),
            previewPanel, vditor.options.cdn);
        codeRender(previewPanel, vditor.options.lang);
    }

    previewPanel.setAttribute("data-render", "1");
};
