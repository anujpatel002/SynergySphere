// client/components/common/dialog.tsx
"use client"

import {
  Children,
  ReactNode,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  ElementRef,
  HTMLAttributes
} from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

type DialogProps = {
  children: ReactNode
} & HTMLAttributes<HTMLDialogElement>

export type DialogRef = {
  open: () => void
  close: () => void
  dialog: HTMLDialogElement | null
}

const Dialog = forwardRef<DialogRef, DialogProps>(({ children, ...props }, ref) => {
  const dialogRef = useRef<ElementRef<'dialog'>>(null)
  const [open, setOpen] = useState(false)

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        dialogRef.current?.showModal()
        setOpen(true)
      },
      close: () => {
        dialogRef.current?.close()
        setOpen(false)
      },
      dialog: dialogRef.current,
    }),
    [],
  )

  const handleClose = () => {
    dialogRef.current?.close()
    setOpen(false)
  }

  const { title, ...rest } = Children.only(children) as { title: ReactNode, children: ReactNode } & Record<string, unknown>

  return (
    <dialog
      className="backdrop:bg-black/50 overflow-hidden rounded-lg border bg-background shadow-lg transition-all"
      ref={dialogRef}
      onClose={handleClose}
      {...props}
    >
      <div className="flex flex-col p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={handleClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="py-4">
          {rest.children}
        </div>
      </div>
    </dialog>
  )
})

Dialog.displayName = 'Dialog'

export { Dialog }