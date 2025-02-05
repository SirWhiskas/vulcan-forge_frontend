import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import isUrl from 'is-url'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, Transforms, Range, createEditor, Text } from 'slate'
import { withHistory } from 'slate-history'

import { VFRichTextButton, VFRichTextIcon, VFRichTextToolbar } from './vfRichTextComponents'

import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import CodeIcon from '@material-ui/icons/Code';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import LinkIcon from '@material-ui/icons/Link';

import { GiMonsterGrasp } from 'react-icons/gi'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const VFTextEditor = ({ handleNewMonster }) => {
  const [value, setValue] = useState(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), [])

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <VFRichTextToolbar>
        <MarkButton format="bold" icon="FormatBoldIcon" />
        <MarkButton format="italic" icon="FormatItalicIcon" />
        <MarkButton format="underline" icon="FormatUnderlinedIcon" />
        <MarkButton format="code" icon="CodeIcon" />
        <BlockButton format="heading-one" icon="LooksOneIcon" />
        <BlockButton format="heading-two" icon="LooksTwoIcon" />
        <BlockButton format="block-quote" icon="FormatQuoteIcon" />
        <BlockButton format="numbered-list" icon="FormatListNumberedIcon" />
        <BlockButton format="bulleted-list" icon="FormatListBulletedIcon" />
        <LinkButton />
        <AddNewMonsterButton format="monster" functionHandler={handleNewMonster} />
      </VFRichTextToolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

const withLinks = editor => {
    const { insertData, insertText, isInline } = editor

    editor.isInline = element => {
        return element.type === 'link' ? true : isInline(element)
    }

    editor.insertText = text => {
        if (text && isUrl(text)) {
        wrapLink(editor, text)
        } else {
        insertText(text)
        }
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')

        if (text && isUrl(text)) {
        wrapLink(editor, text)
        } else {
        insertData(data)
        }
    }

    return editor
}

const insertLink = (editor, url) => {
    if (editor.selection) {
        wrapLink(editor, url)
    }
}

const isLinkActive = editor => {
    const [link] = Editor.nodes(editor, { match: n => n.type === 'link' })
    return !!link
}

const unwrapLink = editor => {
    Transforms.unwrapNodes(editor, { match: n => n.type === 'link' })
}

const wrapLink = (editor, url) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor)
    }

    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link = {
        type: 'link',
        url,
        children: isCollapsed ? [{ text: url }] : [],
    }

    if (isCollapsed) {
        Transforms.insertNodes(editor, link)
    } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
    }
}

const markMonster = (editor, format) => {
    Editor.addMark(editor, format, true)
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  })

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'link':
        return (
            <a {...attributes} href={element.url}>
            {children}
            </a>
        )
    case 'monster':
        return (
            <strong>{children}</strong>
        )
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.monster) {
    children = <strong className="monster-name">{children}</strong>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <VFRichTextButton
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {getTagByFormat(format)}
    </VFRichTextButton>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <VFRichTextButton
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
        {getTagByFormat(format)}
    </VFRichTextButton>
  )
}

const AddNewMonsterButton = ({ functionHandler, format }) => {
    const editor = useSlate()
  return (
    <VFRichTextButton
      active={true}
      onMouseDown={event => {
        event.preventDefault()
        markMonster(editor, format)
        functionHandler(getSelectedContents(editor))
      }}
    >
        <GiMonsterGrasp />
    </VFRichTextButton>
  )
}

const getSelectedContents = editor => {
    console.log(editor.selection);
    console.log(editor);

    let beginning = editor.selection.anchor.offset;
    let end = editor.selection.focus.offset;
    let row = editor.selection.anchor.path[0];
    let col = editor.selection.anchor.path[1];

    let currentContent = editor.children[row].children[col].text;

    let selectedText = currentContent.substring(beginning, end);

    return selectedText;
}

const LinkButton = () => {
    const editor = useSlate()
    return (
      <VFRichTextButton
        active={isLinkActive(editor)}
        onMouseDown={event => {
          event.preventDefault()
          const url = window.prompt('Enter the URL of the link:')
          if (!url) return
          insertLink(editor, url)
        }}
      >
        <LinkIcon />
      </VFRichTextButton>
    )
  }

const getTagByFormat = (format) => {
    switch (format) {
        case "bold":
            return ( <FormatBoldIcon /> );
            break;
        case "italic":
            return ( <FormatItalicIcon /> );
            break;
        case "underline":
            return ( <FormatUnderlinedIcon /> );
            break;
        case "code":
            return ( <CodeIcon /> );
            break;
        case "heading-one":
            return ( <LooksOneIcon /> );
            break;
        case "heading-two":
            return ( <LooksTwoIcon /> );
            break;
        case "block-quote":
            return ( <FormatQuoteIcon /> );
            break;
        case "numbered-list":
            return ( <FormatListNumberedIcon /> );
            break;
        case "bulleted-list":
            return ( <FormatListBulletedIcon /> );
            break;
        case "insert-link":
            return ( <LinkIcon /> );
            break;
        default:
            break;
    }
} 

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text:
          ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

export default VFTextEditor;