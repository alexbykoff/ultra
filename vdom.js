function R (htmlDOM, templateRaw) {
  const template = document.createElement('template')
  template.innerHTML = templateRaw
  const virtualDOM = template.content.firstChild.nextSibling
  sanitizeVDOM(virtualDOM)
  return htmlDOM.childNodes.length ? compareElements(htmlDOM, virtualDOM) : htmlDOM.parentElement.replaceChild(virtualDOM, htmlDOM)
}

function isDocumentNode (node) {
  return node instanceof Element && node.nodeType !== 3 && node.nodeType !== 8
}

function isEqualTags (a, b) {
  return a.nodeName === b.nodeName
}

function compareElements (domNode, vNode, domNodeParent = domNode) {
  if (!(domNode || vNode)) return
  if (!vNode) return domNode.parentNode.removeChild(domNode)
  if (!domNode) return isDocumentNode(domNodeParent) ? domNodeParent.appendChild(vNode.cloneNode(true)) : null
  if (!isEqualTags(domNode, vNode)) return domNode.parentNode.replaceChild(vNode.cloneNode(true), domNode)
  if (isEqualTags(domNode, vNode) && domNode.nodeValue !== vNode.nodeValue) domNode.textContent = vNode.textContent
  if (isDocumentNode(domNode) && isDocumentNode(vNode)) compareAttributes(domNode, vNode)
  if (domNode.childNodes && vNode.childNodes) {
    let i = 0
    while (domNode.childNodes[i] || vNode.childNodes[i]) {
      compareElements(domNode.childNodes[i], vNode.childNodes[i], domNode)
      i++
    }
  }
}

function compareAttributes (domNode, vNode) {
  Array.from(domNode.attributes).forEach(attr => {
    const n = attr.name
    if (!vNode.getAttribute(n)) domNode.removeAttribute(n)
    if (domNode.getAttribute(n) !== vNode.getAttribute(n)) {
      domNode.setAttribute(n, vNode.getAttribute(n))
      if (n === 'value') domNode.value = vNode.getAttribute(n)
    }
  })
  Array.from(vNode.attributes).forEach(attr => {
    const n = attr.name
    if (domNode.getAttribute(n) !== vNode.getAttribute(n)) domNode.setAttribute(n, vNode.getAttribute(n))
  })
}

function sanitizeVDOM (node) {
  for (let n = 0; n < node.childNodes.length; n++) {
    const child = node.childNodes[n]
    if (child.nodeType === 3 && child.textContent.length === 1 && child.textContent.charCodeAt(0) === 10) {
      node.removeChild(child)
      n--
    }
    else if (child.nodeType === 1) sanitizeVDOM(child)
  }
}