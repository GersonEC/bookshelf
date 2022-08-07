/** @jsx jsx */
import {jsx} from '@emotion/react'

import * as React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import {Dialog, CircleButton} from './lib'

/** a function that accepts any number of functions,
 * and returns a function that accepts any number of arguments.
 * Then when that's called for each of the functions that were passed,
 * if that function does exist, then we'll call that function with all of the arguments this function was called with.
 */
const callAll =
  (...fns) =>
  (...args) =>
    fns.map(fn => fn && fn(...args))

// [8] Compound components
// to avoid custom components with loads of props, take advantage of the context api
// pass useState values as a value prop of the context provider
// to implicitly share some state between the sub components

const ModalContext = React.createContext()

function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)

  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
}

function ModalDismissButton({children: child}) {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

function ModalOpenButton({children: child}) {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

function ModalContentsBase(props) {
  const [isOpen, setIsOpen] = React.useContext(ModalContext)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

function ModalContents({title, children, ...props}) {
  return (
    <ModalContentsBase {...props}>
      <div css={{display: 'flex', justifyContent: 'flex-end'}}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{textAlign: 'center', fontSize: '2em'}}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

export {Modal, ModalDismissButton, ModalOpenButton, ModalContents}
