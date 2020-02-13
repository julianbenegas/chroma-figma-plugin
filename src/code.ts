figma.showUI(__html__, { height: 400, width: 320 })

type rgb = number[]

interface Args {
  type: 'create-scale' | 'cancel'
  colors: rgb[]
  scale: chroma.Scale
  localStyles: string
  name: string
}

figma.ui.onmessage = ({ type, colors, localStyles, name }: Args) => {
  if (type === 'create-scale') {
    const nodes = []
    for (let i = 0; i < colors.length; i++) {
      const [r, g, b] = colors[i]
      const rect = figma.createRectangle()
      rect.x = i * 82
      rect.resize(70, 70)
      rect.cornerRadius = 8
      rect.fills = [{ type: 'SOLID', color: { r, g, b } }]
      figma.currentPage.appendChild(rect)
      nodes.push(rect)
      if (localStyles === 'css' || localStyles === 'regular') {
        const style = figma.createPaintStyle()
        style.paints = [{ type: 'SOLID', color: { r, g, b } }]
        if (localStyles === 'css') style.name = `--${name}-${i + 1}`
        else style.name = `${name}-${i + 1}`
      }
    }
    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
  } else if (type === 'cancel') figma.closePlugin()
}
