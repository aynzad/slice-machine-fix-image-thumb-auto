import React from 'react'
import * as Widgets from '../../../../../../../models/common/widgets'
import CodeBlock from '../CodeBlock'

// const DOCS_README = 'https://github.com/prismicio/prismic-vue'

const wrapRepeatable = (code) =>
`
<div v-for="(item, i) in slice.items" :key="\`slice-item-\${i}\`">    
  ${code}
</div>
`

const createCodeFromTag = (tag) => (fieldText) => `<${tag} :field="${fieldText}" />`
const createDefaultField = (tag = 'span') => (fieldText) => `<${tag}>{{ ${fieldText} }}</${tag}>`

const codeByWidgetType = {
  [Widgets.ContentRelationship.CUSTOM_NAME]: createCodeFromTag('todo-hint'),
  [Widgets.UID.TYPE_NAME]: (fieldText) => `<span>{{ ${fieldText} }}</span>`,
  [Widgets.StructuredText.TYPE_NAME]: createCodeFromTag('prismic-rich-text'),
  [Widgets.Image.TYPE_NAME]: createCodeFromTag('prismic-image'),
  [Widgets.Link.TYPE_NAME]: (fieldText) => `<prismic-link :field="${fieldText}">My Link</prismic-link>`,
  [Widgets.Select.TYPE_NAME]: createDefaultField(),
  [Widgets.Boolean.TYPE_NAME]: (fieldText) => `<span>{{ ${fieldText} ? 'true' : 'false' }}</span>`,
  [Widgets.Date.TYPE_NAME]: (fieldText) => `<span>{{ ${fieldText} }}</span>`,
  [Widgets.Timestamp.TYPE_NAME]: createDefaultField(),
  [Widgets.Embed.TYPE_NAME]: createCodeFromTag('prismic-embed'),
  [Widgets.Number.TYPE_NAME]: createDefaultField(),
  [Widgets.GeoPoint.TYPE_NAME]: createDefaultField(),
  [Widgets.Color.TYPE_NAME]: (fieldText) => `<span :style="\`color: \${${fieldText}}\`">Some Text</span>`,
  [Widgets.Text.TYPE_NAME]: createDefaultField(),
}

const toVue = ({ item, typeName, renderHintBase, isRepeatable }) => {
  const hintBase = renderHintBase({ item })
  const code = codeByWidgetType[typeName](hintBase)
  const withRepeat = isRepeatable ? wrapRepeatable(code) : code

  return <CodeBlock className="language-html">{withRepeat}</CodeBlock>
}

export default toVue;