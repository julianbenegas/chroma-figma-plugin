figma.showUI(__html__);
figma.ui.onmessage = ({ type, count, scale }) => {
    if (type === 'create-scale') {
        const nodes = [];
        count = parseInt(count);
        count.forEach((n) => {
            const hex = scale[n - 1];
            console.log(hex);
            const rect = figma.createRectangle();
            rect.x = n * 150;
            rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        });
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    figma.closePlugin();
};
