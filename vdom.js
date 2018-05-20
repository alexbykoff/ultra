function R (htmlDOM, templateRaw) {
  const template = document.createElement('template')
  template.innerHTML = templateRaw
  const virtualDOM = template.content.firstChild.nextSibling
  return htmlDOM.childNodes.length ? compare(htmlDOM, virtualDOM) : htmlDOM.parentElement.replaceChild(virtualDOM, htmlDOM)
}

function isDocumentNode (node) {
  return node.nodeType !== 3 && node.nodeType !== 8
}

function compare (domNode, vNode, domParent = domNode) {
  if (!(domNode || vNode)) return
  if (!vNode) return domNode.parentNode.removeChild(domNode)
  if (!domNode) return isDocumentNode(domParent) ? domParent.appendChild(vNode.cloneNode(true)) : null
  if (domNode.nodeName !== vNode.nodeName) domNode.parentNode.replaceChild(vNode.cloneNode(true), domNode)
  if (domNode.nodeName === vNode.nodeName && (domNode.nodeValue !== vNode.nodeValue)) {
    domNode.textContent = vNode.textContent
  }
  if (isDocumentNode(domNode) && isDocumentNode(vNode)) compareAttributes(domNode, vNode)
  if (domNode.childNodes && vNode.childNodes) {
    let i = 0
    while (domNode.childNodes[i] || vNode.childNodes[i]) {
      compare(domNode.childNodes[i], vNode.childNodes[i], domNode)
      i++
    }
  }
}

function compareAttributes (domNode, vNode) {
  Array.from(domNode.attributes).forEach(attr => {
    const n = attr.name
    if (vNode.getAttribute(n) === null) domNode.removeAttribute(n)
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

