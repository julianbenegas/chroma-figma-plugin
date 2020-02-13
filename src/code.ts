figma.showUI(__html__)

type rgb = number[]

interface Args {
  type: 'create-scale' | 'cancel'
  colors: rgb[]
  scale: chroma.Scale
}

figma.ui.onmessage = ({ type, colors }: Args) => {
  if (type === 'create-scale') {
    const nodes = []
    for (let i = 0; i < colors.length; i++) {
      const [r, g, b] = colors[i]
      const rect = figma.createRectangle()
      rect.x = i * 150
      rect.fills = [{ type: 'SOLID', color: { r, g, b } }]
      figma.currentPage.appendChild(rect)
      nodes.push(rect)
    }
    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
  }
  figma.closePlugin()
}
